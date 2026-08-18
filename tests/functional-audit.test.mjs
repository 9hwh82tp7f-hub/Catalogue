import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync('index.html','utf8');
const panel = fs.readFileSync('panel.html','utf8');

// Every static admin action button must have a concrete click path.
const adminButtons = [
  'btnImport','btnReset','btnPublishSettings','btnDownload','btnDraftPreview',
  'btnPreflight','btnReleases','btnPublish','btnVerifyGitHub',
  'btnSavePublishSettings','btnClosePublishSettings','btnRefreshPreview'
];
for (const id of adminButtons) {
  assert.match(panel, new RegExp(`getElementById\\(['"]${id}['"]\\)\\??\\.addEventListener\\(['"]click['"]`), `Le bouton admin ${id} doit avoir un gestionnaire click.`);
}
assert.match(panel, /allowfullscreen/, 'L’aperçu doit pouvoir passer en plein écran.');
assert.match(panel, /Réinitialiser le panneau depuis le modèle intégré/, 'La réinitialisation doit demander confirmation.');

// The secret navigation handler is installed exactly once through the tab binding.
const secretDirectHandlers = (index.match(/getElementById\(['"]secretNavBtn['"]\)\?\.addEventListener\(['"]click['"],\s*openSecretPanel\)/g) || []).length;
assert.equal(secretDirectHandlers, 0, 'Le bouton secret ne doit pas recevoir un second gestionnaire direct redondant.');
const secretTabHandler = (index.match(/btn\.addEventListener\(['"]click['"],openSecretPanel\)/g) || []).length;
assert.equal(secretTabHandler, 1, 'Le bouton secret doit avoir exactement un gestionnaire dans le binding des onglets.');

// Keep panel and published source synchronized.
const m = panel.match(/const BASE_TEMPLATE_B64 = '([^']+)'/);
assert.ok(m, 'Le template intégré du panel doit exister.');
const decoded = Buffer.from(m[1], 'base64').toString('utf8');
assert.equal(decoded, index, 'Le template intégré du panel doit être identique à index.html.');

console.log('Functional audit static checks: OK');
