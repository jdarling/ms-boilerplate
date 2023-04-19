import logger from './logger.mjs';

import axios from 'axios';

const axiosConfig = (x) => {
  const { headers, url, method } = x.config || x;
  return {
    headers,
    url,
    method,
  };
};

axios.interceptors.request.use((x) => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {};
  x.meta.requestStartedAt = new Date().getTime();
  logger.debug('Outbound Request: ', axiosConfig(x));
  return x;
});

axios.interceptors.response.use(
  (x) => {
    logger.debug(
      `Outbound Response: ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`,
      axiosConfig(x)
    );
    return x;
  },
  // Handle 4xx & 5xx responses
  (x) => {
    logger.debug(
      `Outbound Error: ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`,
      axiosConfig(x)
    );
    throw x;
  }
);

export default axios;
