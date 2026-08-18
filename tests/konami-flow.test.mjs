import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /const finalizeSecretReveal=\(\)=>\{/,
  'Konami: une fonction de finalisation explicite doit exister.');
assert.match(html, /if\(e\.animationName==='secureAccessReveal'\) finalizeSecretReveal\(\);/,
  'Konami: la fin réelle de l’animation doit déclencher la révélation statique.');
assert.match(html, /window\.setTimeout\(finalizeSecretReveal,1250\);/,
  'Konami: un fallback doit garantir la révélation même si animationend ne se déclenche pas.');
assert.match(html, /function openSecretPanel\(\)\{[\s\S]*?if\(!secretState\.unlocked\)return;[\s\S]*?secretBtn\.classList\.add\('revealed-static','active'\);/,
  'Konami: ouvrir la zone secrète doit forcer le bouton à l’état visible et actif.');
assert.match(html, /secretBtn\.disabled=false;/,
  'Konami: le bouton Secret doit rester activé après le déverrouillage.');

const panel = fs.readFileSync(new URL('../panel.html', import.meta.url), 'utf8');
const encoded = Buffer.from(html).toString('base64');
const m = panel.match(/const BASE_TEMPLATE_B64 = '([^']+)';/);
assert.ok(m, 'panel.html: template embarqué introuvable.');
assert.equal(m[1], encoded, 'panel.html: template embarqué différent de index.html.');

console.log('Konami full flow regression: OK');
