import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const panel = fs.readFileSync(new URL('../panel.html', import.meta.url), 'utf8');

assert.match(panel, /function clearPendingMediaState\(\)/);
assert.match(panel, /clearPendingMediaState\(\);\s*outputFilename = filename/);
assert.match(panel, /clearPendingMediaState\(\);\s*currentSection = 'general'/);
assert.match(panel, /Les médias en attente ont été annulés/);
console.log('Restore/import media-state regression tests: OK');
