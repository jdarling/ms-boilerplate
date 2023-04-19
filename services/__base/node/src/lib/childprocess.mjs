import { spawn } from 'child_process';
import EventEmitter from 'events';

export class ChildProcess {
  constructor({ command, args = [] }) {
    this.command = command;
    this.args = args;
    this.emitter = new EventEmitter();
    this.std = {
      out: '',
      err: '',
      all: '',
    };
  }

  on(event, handler) {
    this.emitter.on(event, handler);
  }

  running() {
    if (this.process && !this.exited) {
      return true;
    }
    return false;
  }

  exitCode() {
    if (!this.running()) {
      return this._exitCode;
    }
    return -1;
  }

  start() {
    if (this.running()) {
      return;
    }

    this.exited = false;

    this.process = spawn(this.command, this.args);
    this.process.stdout.on('data', (data) => {
      this.std.all += data;
      this.std.out += data;
      this.emitter.emit('stdout', data);
    });
    this.process.stderr.on('data', (data) => {
      this.std.all += data;
      this.std.out += data;
      this.emitter.emit('stderr', data);
    });
    this.process.on('close', (code) => {
      this.exited = true;
      this._exitCode = code;
      this.emitter.emit('close', code);
    });
  }

  write(msg) {
    this.process.stdin.write(msg);
  }

  writeln(msg) {
    this.write(`${msg}\n`);
  }

  stdout() {
    return this.std.out;
  }

  stderr() {
    return this.std.err;
  }

  stdall() {
    return this.std.all;
  }
}

export default ChildProcess;
