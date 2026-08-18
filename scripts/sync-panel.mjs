import {readFile, writeFile} from 'node:fs/promises';

const indexPath = new URL('../index.html', import.meta.url);
const panelPath = new URL('../panel.html', import.meta.url);
const index = await readFile(indexPath);
const panel = await readFile(panelPath, 'utf8');
const encoded = index.toString('base64');
const pattern = /const BASE_TEMPLATE_B64 = '([^']+)';/;
if (!pattern.test(panel)) throw new Error('BASE_TEMPLATE_B64 introuvable dans panel.html');
const next = panel.replace(pattern, `const BASE_TEMPLATE_B64 = '${encoded}';`);
await writeFile(panelPath, next);
console.log(`panel.html synchronisé (${index.length} octets de template).`);
