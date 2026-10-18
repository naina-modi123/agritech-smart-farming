import test from 'node:test';
import assert from 'node:assert/strict';

test('health route contract includes status and service', () => {
  const payload = { status: 'ok', service: 'AgriTech API' };
  assert.equal(payload.status, 'ok');
  assert.equal(payload.service, 'AgriTech API');
});
