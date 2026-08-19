export function validateCatalogue(config,products){
  const checks=[]; const ok=(label,detail)=>checks.push({level:'ok',label,detail}); const warn=(label,detail)=>checks.push({level:'warn',label,detail}); const error=(label,detail)=>checks.push({level:'error',label,detail});
  if(!config || typeof config!=='object') error('Configuration','Configuration absente ou invalide.'); else ok('Configuration','Objet de configuration présent.');
  if(!Array.isArray(products)){ error('Produits','La liste des produits est invalide.'); return checks; }
  const sku=new Set();
  products.forEach((p,i)=>{
    const n=String(p?.name||'').trim(), s=String(p?.sku||'').trim();
    if(!n) error(`Produit #${i+1}`,'Nom vide.'); if(!s) error(`Produit #${i+1}`,'SKU vide.');
    if(s && sku.has(s)) error(`Produit #${i+1}`,`SKU dupliqué : ${s}.`); else if(s) sku.add(s);
    if(!Array.isArray(p?.prices)||!p.prices.length) warn(`Produit #${i+1}`,'Aucun tarif défini.');
    (p?.prices||[]).forEach((price,j)=>{if(!String(price?.price||'').trim()) warn(`Tarif #${i+1}.${j+1}`,'Prix vide.');});
    (p?.media||[]).forEach((m,j)=>{if(!['image','video'].includes(m?.type)) error(`Média #${i+1}.${j+1}`,'Type de média invalide.'); if(!String(m?.url||'').trim()) warn(`Média #${i+1}.${j+1}`,'URL/média vide.');});
  });
  if(products.length) ok('Produits',`${products.length} produit(s) analysé(s), ${sku.size} SKU distinct(s).`); else warn('Produits','Catalogue vide.');
  return checks;
}
