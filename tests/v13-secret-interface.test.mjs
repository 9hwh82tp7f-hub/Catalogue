import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const panel=fs.readFileSync(new URL('../panel.html',import.meta.url),'utf8');
for(const needle of [
  'secretInterface:',
  'id="panel-secret"',
  'secretNavBtn',
  'secret-ready',
  'secret-pulse',
  "const sequence = ['accueil','catalogue','accueil','panier','infos','contact','communaute','panier','accueil','catalogue'];",
  'renderSecretInterface',
  "{ id:'secretInterface', label:'🥚 Espace secret' }"
]) assert.ok(html.includes(needle)||panel.includes(needle),`Missing secret interface implementation: ${needle}`);
const base=panel.match(/const BASE_TEMPLATE_B64 = "([^"]+)";/);
assert.ok(base,'BASE_TEMPLATE_B64 missing');
assert.equal(Buffer.from(base[1],'base64').toString('utf8'),html,'Panel template must match public index exactly');
console.log('v13-secret-interface.test.mjs: OK');
