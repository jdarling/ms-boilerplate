import config from './config.mjs';
import _request from 'request';
import URL from 'url';
const request = _request.defaults({ json: true });

const { filestoreServiceHost: cacheHost } = config;

const reHasProtocol = /^https?:\/\//i;
const makeValidHost = (host) => {
  if (reHasProtocol.exec(host)) {
    return host;
  }
  return `http://${host}`;
};

export class Cache {
  constructor({ host }) {
    this.host = makeValidHost(host);
  }

  request({ url: filename, method, ...rest }, callback) {
    const url = this.host + '/' + filename;
    const options = { url, method, ...rest };
    return request(options, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      if (typeof body !== 'undefined') {
        if (typeof body.error !== 'undefined') {
          return callback(err);
        }
        return callback(null, body);
      }
      if (response.statusCode === 401) {
        return callback(new Error('API returned Unauthorized'));
      }
      if (response.statusCode === 200) {
        return callback(err, body);
      }

      return callback(
        new Error(
          'SERVICE ERROR: ' + JSON.stringify({ url, method, response }, null, 2)
        )
      );
    });
  }

  info(filename, callback) {
    return this.request(
      {
        url: `meta/${filename}`,
        method: 'get',
      },
      callback
    );
  }

  create(fn, contents, callback = () => {}) {
    const parts = fn.split('/');
    const filename = parts.pop();
    const url = parts.join('/');
    const file = Buffer.from(JSON.stringify(contents));
    return this.request(
      {
        url,
        method: 'post',
        formData: {
          file: {
            value: file,
            options: {
              filename,
              contentType: 'application/json',
            },
          },
        },
      },
      (err, ...args) => {
        if (err) {
          console.error(err);
        }
        return callback(err, ...args);
      }
    );
  }

  update(fn, contents, callback = () => {}) {
    const parts = fn.split('/');
    const filename = parts.pop();
    const url = parts.join('/');
    const file = Buffer.from(JSON.stringify(contents));
    return this.request(
      {
        url,
        method: 'put',
        formData: {
          file: {
            value: file,
            options: {
              filename,
              contentType: 'application/json',
            },
          },
        },
      },
      (err, ...args) => {
        if (err) {
          console.error(err);
        }
        return callback(err, ...args);
      }
    );
  }

  delete(filename, callback) {
    return this.request(
      {
        url: filename,
        method: 'delete',
      },
      callback
    );
  }

  get(filename, callback) {
    return this.request(
      {
        url: filename,
        method: 'get',
      },
      callback
    );
  }
}

const cache = new Cache({ host: cacheHost });

export default cache;
