const KEY = 'catalogue_admin_snapshots_v1';
const MAX = 20;
function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
function stable(value){ if(Array.isArray(value)) return value.map(stable); if(value && typeof value === 'object') return Object.keys(value).sort().reduce((o,k)=>{o[k]=stable(value[k]);return o;},{}); return value; }
function canonical(value){ return JSON.stringify(stable(value)); }
function read(){ try{ const raw=localStorage.getItem(KEY); const list=raw?JSON.parse(raw):[]; return Array.isArray(list)?list:[]; }catch(e){ return []; } }
function write(list){ localStorage.setItem(KEY, JSON.stringify(list.slice(0,MAX))); }
export function diff(a,b,path=''){
  const out=[]; if(Object.is(a,b)) return out;
  const ao=a && typeof a==='object', bo=b && typeof b==='object';
  if(Array.isArray(a)!==Array.isArray(b) || !ao || !bo){ out.push({path:path||'$',before:a,after:b}); return out; }
  const keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
  for(const k of [...keys].sort()) out.push(...diff(a?.[k],b?.[k],path?`${path}.${k}`:k));
  return out;
}
export function createSnapshot(config,products,meta={}){
  const id=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const snapshot={id,date:new Date().toISOString(),config:clone(config),products:clone(products),meta:clone(meta)};
  const list=read(); list.unshift(snapshot); write(list); return snapshot;
}
export function listSnapshots(){ return read(); }
export function removeSnapshot(id){ write(read().filter(x=>x.id!==id)); }
export function clearSnapshots(){ try{localStorage.removeItem(KEY);}catch(e){} }
export function compareSnapshots(a,b){ return diff(a,b); }
export function fingerprint(value){ const bytes=new TextEncoder().encode(canonical(value)); let h=2166136261; for(const x of bytes){h^=x;h=Math.imul(h,16777619);} return (h>>>0).toString(16).padStart(8,'0'); }
