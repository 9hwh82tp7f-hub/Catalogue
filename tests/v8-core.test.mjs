import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
function validatePublishPath(value){
 const path=String(value||'').trim().replace(/^\/+|\/+$/g,'');
 if(!path) throw Error('required'); if(path.length>240) throw Error('long');
 if(!/^[^\\\0]+\.html$/i.test(path)) throw Error('html');
 if(path.includes('\\')||path.split('/').some(p=>!p||p==='.'||p==='..')) throw Error('segments');
 const l=path.toLowerCase(); if(l==='sw.js'||l==='manifest.json'||l.endsWith('/sw.js')||l.endsWith('/manifest.json')||l.includes('/assets/icons/')||l.startsWith('assets/icons/')) throw Error('reserved');
 return path;
}
function validateBranch(value){
 const b=String(value||'').trim(); if(!b||b.length>250) throw Error('branch');
 if(b.startsWith('/')||b.endsWith('/')||b.includes('//')||b.includes('..')||b.includes('@{')||b.includes('\\')) throw Error('syntax');
 if(/[~^:?*\[\]\x00-\x20\x7f]/.test(b)||b.endsWith('.lock')||b.startsWith('.')||b.endsWith('.')) throw Error('chars'); return b;
}
assert.equal(validatePublishPath('catalogue/boutique.html'),'catalogue/boutique.html');
for(const p of ['','sw.js','x/../y.html','x.txt','assets/icons/x.html','a\\b.html']) assert.throws(()=>validatePublishPath(p));
assert.equal(validateBranch('main'),'main');
for(const b of ['','/main','main/','a//b','a..b','a@{b','a b','main.lock']) assert.throws(()=>validateBranch(b));
const bytes=Buffer.from('hello'); const expected=createHash('sha1').update(Buffer.concat([Buffer.from('blob 5\0'),bytes])).digest('hex');
assert.equal(expected,'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0');
console.log('V8 core tests: OK');
