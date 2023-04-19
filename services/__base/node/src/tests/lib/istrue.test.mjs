import assert from 'node:assert';
import test from 'node:test';

import isTrue from '../../lib/istrue.mjs';

test('isTrue(1) returns false', () => {
  assert.strictEqual(isTrue(1), false);
});

test('isTrue("true") returns true', () => {
  assert.strictEqual(isTrue('true'), true);
});

test('isTrue("True") returns true', () => {
  assert.strictEqual(isTrue('True'), true);
});

test('isTrue("TRUE") returns true', () => {
  assert.strictEqual(isTrue('true'), true);
});

test('isTrue("false") returns false', () => {
  assert.strictEqual(isTrue('false'), false);
});
