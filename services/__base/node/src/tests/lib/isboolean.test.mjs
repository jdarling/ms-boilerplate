import assert from 'node:assert';
import test from 'node:test';

import isBoolean from '../../lib/isboolean.mjs';

test('isBoolean(0) returns false', () => {
  assert.strictEqual(isBoolean(1), false);
});

test('isBoolean("dog") returns false', () => {
  assert.strictEqual(isBoolean('dog'), false);
});

test('isBoolean("false") returns true', () => {
  assert.strictEqual(isBoolean('false'), true);
});

test('isBoolean("true") returns true', () => {
  assert.strictEqual(isBoolean('true'), true);
});
