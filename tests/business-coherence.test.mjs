import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const index = fs.readFileSync(`${root}/index.html`, 'utf8');
const panel = fs.readFileSync(`${root}/panel.html`, 'utf8');

assert.match(index, /function getCurrentPromoByCode\(code\)/);
assert.match(index, /String\(code\|\|''\)\.trim\(\)\.toUpperCase\(\)/);
assert.match(index, /Minimum de commande/);
assert.match(index, /minimum non atteint/);
assert.equal(/<a\b[^>]*href="#"/i.test(index), false, 'index ne doit pas conserver de liens href="#"');
assert.equal(/<a\b[^>]*href="#"/i.test(panel), false, 'panel ne doit pas conserver de liens href="#"');

console.log('Business coherence tests: OK');
