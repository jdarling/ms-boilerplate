import stripSpecial from './stripspecial.mjs';

const stripSpecialKeys = (obj) => allKeys(obj, stripSpecial);

export default stripSpecialKeys;
