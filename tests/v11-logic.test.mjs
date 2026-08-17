import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync(new URL('../panel.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(panel, /CACHE_NAME = CACHE_PREFIX \+ 'v11\.3-'/, 'Service Worker cache must be V11.3');
assert.match(panel, /state\.cfg\.pwaEnabled !== false/, 'Preflight must follow PWA configuration');
assert.match(panel, /cp\.icon192/, 'Preflight must account for the 192px PWA icon');
assert.match(panel, /cp\.icon512/, 'Preflight must account for the 512px PWA icon');
assert.match(panel, /deleted:true/, 'Preflight must model PWA file deletion');
assert.match(panel, /base64ToBytes\(PWA_ICON_192_B64\)/, 'Remote preflight must hash the published 192px icon');
assert.match(panel, /base64ToBytes\(PWA_ICON_512_B64\)/, 'Remote preflight must hash the published 512px icon');
assert.match(panel, /makePublishedServiceWorker\(filename\)/, 'Publication must generate the Service Worker');
assert.match(index, /if\(CONFIG\.pwaEnabled\)/, 'Public app must respect PWA setting');
assert.match(index, /navigator\.serviceWorker\.getRegistrations\(\)/, 'Public app must unregister Service Workers when PWA is disabled');
console.log('V11.3 logic/coherence tests: OK');
