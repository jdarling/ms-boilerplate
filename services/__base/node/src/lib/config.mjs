import dotenv from 'dotenv';
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';

import os from 'os';
const hostname = os.hostname();
const pid = process.pid;
import pkg from '../package.json' assert { type: 'json' };
const { name } = pkg;
import safeJsonStringify from 'safe-json-stringify';

const margv = minimist(process.argv.slice(2));

dotenv.config();
const env = process.env;

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const isFalse = (s) => (s ? /^(n|no|f|false|0)$/i.exec(s.toString()) : true);
const isTrue = (s) => s && /^(y|yes|t|true|1)$/i.exec(s.toString());

const typedValue = (s) => {
  if (!s) {
    return s;
  }
  if (isNumeric(s)) {
    return +s;
  }
  if (isTrue(s)) {
    return true;
  }
  if (isFalse(s)) {
    return false;
  }
  return s;
};

const argv = Object.keys(margv).reduce((argv, key) => {
  const value = typedValue(margv[key]);
  argv[key] = value;
  return argv;
}, {});

const trueType = (o) => {
  const type = typeof o;
  if (type === 'object') {
    if (Array.isArray(o)) {
      return 'array';
    }
    if (o instanceof RegExp) {
      return 'regex';
    }
    if (o instanceof Date) {
      return 'date';
    }
    if (o === null) {
      return 'null';
    }
    return type;
  }
  return type;
};

const unique = (a) =>
  a.filter((e, i, arr) => {
    return arr.findIndex((item) => isTheSame(e, item)) === i;
  });

const merge = (source, ...args) => {
  const sourceType = trueType(source);
  return args.reduce((merged, arg) => {
    const argType = trueType(arg);
    if (argType !== sourceType) {
      if (typeof arg === 'undefined') {
        return merged;
      }
      if (typeof merged === 'undefined') {
        return arg;
      }
      return arg;
    }
    if (sourceType === 'object') {
      //return Object.assign({}, arg, source);
      return Object.keys(arg).reduce((o, key) => {
        o[key] = merge(o[key], arg[key]);
        return o;
      }, Object.assign({}, source));
    }
    return arg;
  }, source);
};

const firstStringIndex = (arr) => {
  const l = arr.length;
  for (let i = 0; i < l; i++) {
    if (typeof arr[i] === 'string') {
      return i;
    }
  }
  return -1;
};

const logError = (...args) => {
  const err = args[args.length - 1] instanceof Error ? args.pop() : null;
  const levelName = 'error';
  const level = 50;
  const msgIndex = firstStringIndex(args);
  const msg = msgIndex > -1 ? args.splice(msgIndex, 1).join() : '';
  const pkt = {
    name,
    hostname,
    pid,
    time: new Date(),
    level: logLevel,
    levelName: levelName,
    msg,
    data: args,
    v: 0,
    trace: new Error().stack
      .split('\n')
      .slice(3)
      .map((s) => '  ' + s.trim())
      .join('\n'),
  };
  return console.log(safeJsonStringify(pkt, null, null));
};

const setObjectValue = (source, key = '', value) => {
  try {
    let o = source;
    let last, segment;
    const path = Array.isArray(key) ? key : key.split('.');
    while (o && path.length) {
      segment = path.shift();
      last = o;
      o = o[segment];
      if (!o) {
        o = last[segment] = {};
      }
    }
    last[segment] = value;
    return source;
  } catch (e) {
    logError(e.toString(), key, value, source, e);
    throw e;
  }
};

const camelCase = (s) =>
  s.toLowerCase().replace(/_([a-z0-9])/gi, (_, l) => l.toUpperCase());

const envToObj = (env) => {
  return Object.keys(env).reduce((obj, key) => {
    const path = key.split('__').map(camelCase);
    return setObjectValue(obj, path, typedValue(env[key]));
  }, {});
};

const getConfig = () => {
  const { configfile } = argv;
  if (configfile) {
    const config = require(path.resolve('./', configfile));
    return Object.assign({}, config, argv);
  }
  return merge(argv, envToObj(env));
};

const config = getConfig();

const secrets = (() => {
  try {
    const secretsLocation = config.secretsPath || '/run/secrets/';
    const paths = fs
      .readdirSync(secretsLocation)
      .filter((d) => ['.', '..'].indexOf(d) === -1);
    return paths.reduce((secrets, key) => {
      try {
        const secret = fs
          .readFileSync(path.resolve(secretsLocation, key))
          .toString();
        secrets[key] = typedValue(secret);
      } catch (e) {
        logError(e);
      }
      return secrets;
    }, {});
  } catch (e) {
    return {};
  }
})();

const fullConfig = merge(config, secrets);

export default fullConfig;
