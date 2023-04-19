import isTrue from './istrue.mjs';
import isFalse from './isfalse.mjs';

const isBoolean = (s) => isTrue(s) || isFalse(s);

export default isBoolean;
