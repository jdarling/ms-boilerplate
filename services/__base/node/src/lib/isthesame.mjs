import betterType from './truetype.mjs';

const typeCheckers = {
  object: function object(o1, o2) {
    var keys1 = Object.keys(o1);
    var keys2 = Object.keys(o2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    var keysSame = keys1.filter(function (key) {
      return keys2.indexOf(key) > -1;
    });
    if (keysSame.length !== keys1.length) {
      return false;
    }
    return keys1.every(function (key) {
      // eslint-disable-next-line
      return isTheSame(o1[key], o2[key]);
    });
  },
  array: function array(a1, a2) {
    if (a1.length !== a2.length) {
      return false;
    }
    return a1.every(function (index) {
      // eslint-disable-next-line
      return isTheSame(a1[index], a2[index]);
    });
  },
  date: function date(d1, d2) {
    return d1.getTime() === d2.getTime();
  },
  default: function _default(a, b) {
    return a === b;
  },
};

const isTheSame = (o1, o2) => {
  var type = betterType(o1);
  if (type !== betterType(o2)) {
    return false;
  }
  var checker = typeCheckers[type] || typeCheckers.default;
  return checker(o1, o2);
};

export default isTheSame;
