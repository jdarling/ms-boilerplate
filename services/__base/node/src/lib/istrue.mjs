const reIsTrue = /^true$/i;

const isTrue = (s) => !!reIsTrue.exec(s);

export default isTrue;
