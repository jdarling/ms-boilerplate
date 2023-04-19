import assert from 'node:assert';
import test from 'node:test';

import trueType from '../../lib/truetype.mjs';

test('Returns regex for Regular expressions', () => {
  const typ = trueType(/Test/i);
  assert.deepEqual(typ, 'regex');
  const typ2 = trueType(new RegExp('test', 'i'));
  assert.deepEqual(typ, 'regex');
});

test('Returns number for nubmers', () => {
  const typ = trueType(123);
  assert.deepEqual(typ, 'number');
  const typf = trueType(1.23);
  assert.deepEqual(typ, 'number');
});

test('Returns string for strings', () => {
  const typ = trueType('test');
  assert.deepEqual(typ, 'string');
});

test('Returns object for objects', () => {
  const typ = trueType({});
  assert.deepEqual(typ, 'object');
});

test('Returns boolean for booleans', () => {
  const typ = trueType(true);
  assert.deepEqual(typ, 'boolean');
});

test('Returns array for arrays', () => {
  const typ = trueType([]);
  assert.deepEqual(typ, 'array');
});

test('Returns date for dates', () => {
  const typ = trueType(new Date());
  assert.deepEqual(typ, 'date');
});

test('Returns null for nulls', () => {
  const typ = trueType(null);
  assert.deepEqual(typ, 'null');
});

test('Returns undefined for undefined', () => {
  const typ = trueType(undefined);
  assert.deepEqual(typ, 'undefined');
});
