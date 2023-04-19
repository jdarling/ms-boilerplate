import isNumeric from './isnumeric.mjs';
import isTheSame from './isthesame.mjs';
import tokenize from './tokenize.mjs';

const isUndefined = (value) => typeof value === 'undefined';

const valueFromPath = (source, scope) => {
  const patterns = {
    dot: /\./,
    groupStart: /\[/,
    groupEnd: /]/,
    //selector: /('(?:[^'\\]|\.)*'|"(?:[^"\\]|\.)*")/,
    string: /('(?:[^']|\.)*'|"(?:[^"]|\.)*")/,
    leftParen: /\(/,
    rightParen: /\)/,
    comma: /,/,
  };
  const path = tokenize(source, patterns, 'selector');
  const stack = [scope];
  while (path.length && stack.length) {
    const part = path.shift();
    switch (part.type) {
      case 'dot':
        // ignore dots
        break;
      case 'leftParen':
        const f = stack.pop();
        if (typeof f !== 'function') {
          throw new Error(`Method or function does not exist.`);
        }
        stack.push(FunctionStart);
        stack.push(f);
        stack.push(scope);
        break;
      case 'comma':
        stack.push(scope);
        break;
      case 'rightParen':
        let fs = stack.length - 1;
        while (fs > 0 && !isTheSame(stack[fs], FunctionStart)) {
          fs--;
        }
        const items = stack.splice(fs).slice(1);
        const func = items.shift();
        stack.push(func(...items));
        break;
      case 'groupStart':
        stack.push(scope);
        break;
      case 'groupEnd':
        if (stack.length < 2) {
          throw new Error('Invalid group ending');
        }
        const indexer = stack.pop();
        const scopedIndexer = scope[indexer];
        const val = stack.pop();
        if (typeof scopedIndexer !== 'undefined') {
          stack.push(val[scopedIndexer]);
          break;
        }
        stack.push(val[indexer]);
        break;
      case 'selector':
        const selectFrom = stack.pop();
        const selector = (
          part.matches && part.matches.length ? part.matches[0] : part.token
        ).trim();
        if (selector === 'this') {
          stack.push(scope.this);
          break;
        }
        if (isTheSame(selectFrom, scope)) {
          if (isNumeric(selector)) {
            stack.push(+selector);
            break;
          }
        }
        if (this.allowUndefined && typeof selectFrom === 'undefined') {
          stack.push(selectFrom);
          break;
        }
        const selectedValue = (selectFrom || {})[selector];
        stack.push(selectedValue);
        break;
      case 'string':
        const stringToken = part.token.substr(1, part.token.length - 2);
        stack.pop();
        stack.push(stringToken);
        break;
    }
  }
  if (stack.length > 1) {
    throw new Error(
      'Too many items on stack.  Did you forget a group ending "]"?'
    );
  }
  return stack.pop();
};

const valuefrom = (paths, obj, defaultValue) => {
  if (Array.isArray(paths)) {
    return paths.reduce((value, path) => {
      const objValue = valueFromPath(path, obj);
      if (isUndefined(objValue)) {
        return value;
      }
      return objValue;
    }, defaultValue);
  }
  const returnValue = valueFromPath(paths, obj, defaultValue);
  if (isUndefined(returnValue)) {
    return defaultValue;
  }
  return returnValue;
};

export default valuefrom;
