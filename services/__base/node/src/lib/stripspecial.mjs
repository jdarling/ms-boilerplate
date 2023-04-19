import allKeys from './allkeys.mjs';

const reKeep = /[^a-z0-9]/gi;
const stripSpecial = (s) => s.replace(reKeep, '');

export default stripSpecial;
