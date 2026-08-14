import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const release=await readFile(new URL('../assets/admin/v10-release.js',import.meta.url),'utf8');
assert.match(release,/createRelease/);assert.match(release,/SHA-256|SHA-256/);assert.match(release,/localStorage/);
const panel=await readFile(new URL('../panel.html',import.meta.url),'utf8');
assert.match(panel,/v10-ui\.js/);assert.match(panel,/releasePanel/);
console.log('V10 release static tests: OK');


// Regression guard: the admin download must not leave premium assets behind.
assert.match(panel, /makeStandaloneDownload/);
assert.match(panel, /data-embedded-premium-css/);
assert.match(panel, /data-embedded-premium-runtime/);
console.log('Standalone download guard: OK');
