import assert from 'node:assert';
import test from 'node:test';

import isNumeric from '../../lib/isnumeric.mjs';

test('isNumeric(0) returns true', () => {
  assert.strictEqual(isNumeric(0), true);
});

test('isNumeric("false") returns false', () => {
  assert.strictEqual(isNumeric('false'), false);
});

test('isNumeric("-123") returns true', () => {
  assert.strictEqual(isNumeric('-123'), true);
});

test('isNumeric("123") returns true', () => {
  assert.strictEqual(isNumeric('123'), true);
});

test('isFalse("1.23") returns true', () => {
  assert.strictEqual(isNumeric('1.23'), true);
});

test('isFalse("1e26") returns true', () => {
  assert.strictEqual(isNumeric('1e26'), true);
});
