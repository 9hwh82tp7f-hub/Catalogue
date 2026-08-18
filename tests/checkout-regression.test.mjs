import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

test('checkout handlers do not accumulate on repeated opens', () => {
  const dynamicHandler = "checkoutPaymentEl.onchange = refreshCheckoutDynamic";
  const dynamicCryptoHandler = "checkoutCryptoAssetEl.onchange = refreshCheckoutDynamic";
  assert.equal((html.match(/checkoutPayment[^\n]*addEventListener\(['\"]change['\"]/g) || []).length, 0);
  assert.equal((html.match(/checkoutCryptoAsset[^\n]*addEventListener\(['\"]change['\"]/g) || []).length, 0);
  assert.ok(html.includes(dynamicHandler));
  assert.ok(html.includes(dynamicCryptoHandler));
});

console.log('Checkout regression tests: OK');
