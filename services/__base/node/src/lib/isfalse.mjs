const reIsFalse = /^false$/i;

const isFalse = (s) => !!reIsFalse.exec(s);

export default isFalse;
