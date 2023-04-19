import logger from './logger.mjs';

const tokenize = (source, parsers, defaultType = 'unknown') => {
  const tokens = [];
  while (source) {
    let left = source.length;
    let token;
    for (let key in parsers) {
      try {
        const match = parsers[key].exec(source);
        if (match && match.index < left) {
          token = {
            token: match[0],
            type: key,
            matches: match.slice(1),
          };
          left = match.index;
        }
      } catch (e) {
        logger.error(key, parsers[key]);
        logger.error(e);
        throw e;
      }
    }
    if (left) {
      tokens.push({
        token: source.substr(0, left),
        type: defaultType,
      });
    }
    if (token) {
      tokens.push(token);
    }
    source = source.substr(left + (token ? token.token.length : 0));
  }
  return tokens;
};

export default tokenize;
