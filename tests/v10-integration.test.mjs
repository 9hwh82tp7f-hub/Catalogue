import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';

const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const panel = await readFile(new URL('../panel.html', import.meta.url), 'utf8');
const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');

assert.match(index, /\.modal-overlay\.open\{\s*display:flex;/);
assert.match(index, /function refreshCatalogueMedia\(\)/);
assert.match(index, /requestAnimationFrame\(refreshCatalogueMedia\)/);
assert.match(index, /html\.modal-open[\s\S]*body\.modal-open/);
assert.match(index, /fetchpriority="high"/);
assert.match(sw, /v10\.2/);
assert.match(index, /controllerchange/);
assert.match(index, /reg\.update\(\)/);
assert.match(index, /img\.loading = 'eager'/);
assert.match(index, /img\.src = src/);
assert.match(sw, /v10\.2-20260814/);
assert.match(panel, /PUBLISH_VERSION = 'V10\.2'/);
assert.match(panel, /v10\.2-/);

const match = panel.match(/const BASE_TEMPLATE_B64 = "([^"]+)";/);
assert.ok(match, 'BASE_TEMPLATE_B64 absent');
const embedded = Buffer.from(match[1], 'base64').toString('utf8');
assert.equal(embedded, index, 'Le template embarqué du panneau doit être identique à index.html');

console.log('V10 integration/static synchronization tests: OK');
