export function validateCatalogue(config,products){
  const checks=[]; const ok=(label,detail)=>checks.push({level:'ok',label,detail}); const warn=(label,detail)=>checks.push({level:'warn',label,detail}); const error=(label,detail)=>checks.push({level:'error',label,detail});
  if(!config || typeof config!=='object') error('Configuration','Configuration absente ou invalide.'); else ok('Configuration','Objet de configuration présent.');

  if(config && typeof config==='object'){
    const co=config.checkoutOptions;
    if(co){
      const d=co.delivery?.methods, pay=co.payment?.methods;
      if(!Array.isArray(d)) warn('Commande / livraison','Aucune liste de modes de livraison valide.');
      else {
        const ids=new Set();
        d.forEach((m,i)=>{
          if(!m?.id) error(`Livraison #${i+1}`,'Identifiant manquant.');
          if(m?.id && ids.has(m.id)) error(`Livraison #${i+1}`,`Identifiant dupliqué : ${m.id}.`);
          if(m?.id) ids.add(m.id);
          if(Number(m?.fee)<0) error(`Livraison #${i+1}`,'Frais négatifs interdits.');
          if(m?.id==='postal' && !Array.isArray(m?.carriers)) warn('Livraison postale','Aucun transporteur configuré.');
          (m?.carriers||[]).forEach((c,j)=>{if(Number(c?.fee)<0) error(`Transporteur #${j+1}`,'Frais négatifs interdits.');});
        });
      }
      if(!Array.isArray(pay)) warn('Commande / paiement','Aucune liste de modes de paiement valide.');
      else pay.forEach((m,i)=>{if(!m?.id) error(`Paiement #${i+1}`,'Identifiant manquant.'); if(Number(m?.fee)<0) error(`Paiement #${i+1}`,'Frais négatifs interdits.');});
      ok('Commande','Options de livraison et paiement analysées.');
    } else {
      warn('Commande','checkoutOptions absent : les valeurs par défaut seront utilisées.');
    }
  }
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
