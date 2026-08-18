import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const adminDir = path.join(root, 'assets', 'admin');

test('admin ne conserve pas de module GitHub dupliqué/non utilisé', () => {
  assert.equal(fs.existsSync(path.join(adminDir, 'github.js')), false);
  const app = fs.readFileSync(path.join(adminDir, 'app.js'), 'utf8');
  assert.doesNotMatch(app, /GitHubClient/);
  const state = fs.readFileSync(path.join(adminDir, 'state.js'), 'utf8');
  assert.doesNotMatch(state, /getSnapshot/);
});

test('core ne contient pas de condition réservée dupliquée', () => {
  const core = fs.readFileSync(path.join(adminDir, 'core.js'), 'utf8');
  assert.equal((core.match(/lower\.startsWith\('assets\/icons\/'\)/g) || []).length, 1);
});
