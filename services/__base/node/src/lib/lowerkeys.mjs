import allKeys from './allkeys.mjs';

const lowerKeys = (obj) => allKeys(obj, (s) => s.toLowerCase());

export default lowerKeys;
