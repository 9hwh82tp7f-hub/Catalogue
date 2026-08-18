import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /\.secret-fab\.revealed-static\{[^}]*opacity:1[^}]*pointer-events:auto;/,
  'index.html: le bouton Secret doit rester visible et cliquable après l’animation');
assert.match(html, /secretBtn\.classList\.remove\('secure-reveal','unlocked'\);/,
  'index.html: le bouton doit sortir de l’état animé sans perdre son état interactif');
assert.match(html, /secretBtn\.classList\.add\('revealed-static'\);/,
  'index.html: l’état statique doit être appliqué après l’animation');
console.log('Konami reveal regression: OK');
