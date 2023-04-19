import assert from 'node:assert';
import { describe, it } from 'node:test';

import isFalse from '../../lib/isfalse.mjs';

describe('isFalse', () => {
  it('should return false when passed 0', () => {
    assert.strictEqual(isFalse(0), false);
  });

  it('should return true when passed "false"', () => {
    assert.strictEqual(isFalse('false'), true);
  });

  it('should return true when passed "False"', () => {
    assert.strictEqual(isFalse('False'), true);
  });

  it('should return true when passed "FALSE"', () => {
    assert.strictEqual(isFalse('FALSE'), true);
  });

  it('should return false when passed "true"', () => {
    assert.strictEqual(isFalse('true'), false);
  });
});
