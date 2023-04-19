import trueType from './truetype.mjs';

const allKeys = (obj, fun) => {
  const type = trueType(obj);
  if (type === 'object') {
    return Object.entries(obj).reduce(
      (obj, [key, value]) => ({ ...obj, [fun(key)]: allKeys(value, fun) }),
      {}
    );
  }
  if (type === 'array') {
    return obj.map((elem) => allKeys(elem, fun));
  }
  return obj;
};

export default allKeys;
