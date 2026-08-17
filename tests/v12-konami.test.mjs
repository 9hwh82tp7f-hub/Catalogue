import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const panel = fs.readFileSync(new URL('../panel.html', import.meta.url), 'utf8');

const required = [
  "const sequence = ['accueil','catalogue','accueil','panier','infos','contact','communaute','panier','accueil','catalogue'];",
  'initNavKonami',
  'konami-step',
  'konami-unlocked',
  "btn.dataset.action === 'cart' ? 'panier' : (btn.dataset.tab || '')"
];
for (const needle of required) assert.ok(html.includes(needle), `Missing Konami implementation: ${needle}`);

const base = panel.match(/const BASE_TEMPLATE_B64 = "([^"]+)";/);
assert.ok(base, 'BASE_TEMPLATE_B64 missing');
const decoded = Buffer.from(base[1], 'base64').toString('utf8');
assert.equal(decoded, html, 'Panel template must match public index exactly');

const navKeys = [...html.matchAll(/<button class="tab-btn[^>]*?(?:data-tab="([^"]+)"|id="cartNavBtn"[^>]*data-action="cart")[^>]*>/g)];
assert.ok(navKeys.length >= 6, 'Expected navigation buttons');

console.log('v12-konami.test.mjs: OK');
