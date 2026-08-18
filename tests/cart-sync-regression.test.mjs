import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /function validateCartAgainstProducts\(\)/);
assert.match(html, /resynchronise le libellé, le\s*\n?\/\/ prix et la miniature/);
assert.match(html, /const currentPrice=prices\.find\(pr=>String\(pr\?\.label\|\|'\'\)===String\(item\.label\|\|'\'\)\) \|\| prices\[0\]/);
assert.match(html, /if\(item\.price!==nextPrice\)\{ item\.price=nextPrice; changed=true; \}/);
assert.match(html, /if\(item\.name!==nextName\)\{ item\.name=nextName; changed=true; \}/);
console.log('Cart persistence synchronization tests: OK');
