import assert from 'node:assert';
import test from 'node:test';

import allKeys from '../../lib/allkeys.mjs';

test('Should iterate over all keys and child keys owned by an object', () => {
  const testObject = {
    foo: 'bar',
    key: 'value',
    boolTrue: true,
    num: 123,
    child: {
      childKey1: 'one',
      childKey2: 2,
    },
    arr: [1, 2, { three: 'four' }],
  };
  const keys = [
    ...Object.keys(testObject),
    ...Object.keys(testObject.child),
    'three',
  ];
  const keysFound = keys.reduce((keys, key) => ({ ...keys, [key]: false }), {});
  const keysIterated = [];
  allKeys(testObject, (key) => {
    keysIterated.push(key);
    keysFound[key] = true;
  });
  assert.strictEqual(keysIterated.length, keys.length);
  assert.strictEqual(
    keys.every((key) => keysFound[key]),
    true
  );
});
