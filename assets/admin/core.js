/* Catalogue Admin — dependency-light publication helpers. */
(function(global){
  'use strict';
  const RESERVED = new Set(['sw.js','manifest.json','assets/icons/icon-192.png','assets/icons/icon-512.png']);
  function cleanPath(value){ return String(value || '').trim().replace(/^\/+|\/+$/g,''); }
  function validatePublishPath(value){
    const path=cleanPath(value);
    if(!path) throw new Error('Le chemin de publication est requis.');
    if(path.length>240) throw new Error('Le chemin de publication dépasse 240 caractères.');
    if(!/^[^\\\0]+\.html$/i.test(path)) throw new Error('Le chemin de publication doit désigner un fichier .html.');
    if(path.includes('\\') || path.split('/').some(p=>!p || p==='.' || p==='..')) throw new Error('Le chemin de publication contient une séquence interdite.');
    if(path.split('/').some(p=>p.length>100)) throw new Error('Un segment du chemin de publication est trop long.');
    const lower=path.toLowerCase();
    if(RESERVED.has(lower) || lower.endsWith('/sw.js') || lower.endsWith('/manifest.json') || lower.includes('/assets/icons/') || lower.startsWith('assets/icons/')) throw new Error('Ce chemin entre en collision avec un fichier réservé à la PWA.');
    return path;
  }
  function validateBranch(value){
    const b=String(value||'').trim();
    if(!b || b.length>250) throw new Error('Branche GitHub invalide.');
    if(b.startsWith('/') || b.endsWith('/') || b.includes('//') || b.includes('..') || b.includes('@{') || b.includes('\\')) throw new Error('Branche GitHub invalide : syntaxe de ref interdite.');
    if(/[~^:?*\[\]\x00-\x20\x7f]/.test(b)) throw new Error('Branche GitHub invalide : caractère interdit.');
    if(b.endsWith('.lock') || b.startsWith('.') || b.endsWith('.')) throw new Error('Branche GitHub invalide : nom de ref interdit.');
    return b;
  }
  function gitBlobSha(bytes){
    return crypto.subtle.digest('SHA-1', (function(){
      const header=new TextEncoder().encode('blob '+bytes.byteLength+'\0');
      const joined=new Uint8Array(header.byteLength+bytes.byteLength); joined.set(header); joined.set(bytes,header.byteLength); return joined;
    })()).then(buf=>Array.from(new Uint8Array(buf)).map(x=>x.toString(16).padStart(2,'0')).join(''));
  }
  function summarizeChanges(entries, remoteMap){
    const summary={added:0,changed:0,unchanged:0,deleted:0};
    for(const e of entries){
      const remote=remoteMap.get(e.path);
      if(e.deleted){ if(remote) summary.deleted++; continue; }
      if(!remote) summary.added++; else if(remote.sha && e.sha && remote.sha===e.sha) summary.unchanged++; else summary.changed++;
    }
    return summary;
  }
  global.CatalogueAdminCore={validatePublishPath,validateBranch,gitBlobSha,summarizeChanges,RESERVED};
})(window);
