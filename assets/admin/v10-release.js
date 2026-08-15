const RELEASE_KEY='catalogue_v10_releases_v1';
const MAX_RELEASES=50;
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function read(){try{const x=JSON.parse(localStorage.getItem(RELEASE_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function write(x){localStorage.setItem(RELEASE_KEY,JSON.stringify(x.slice(0,MAX_RELEASES)))}
function canonical(v){if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object')return Object.keys(v).sort().reduce((o,k)=>(o[k]=canonical(v[k]),o),{});return v}
async function digest(v){const data=new TextEncoder().encode(JSON.stringify(canonical(v)));if(globalThis.crypto?.subtle){const b=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}let h=2166136261;for(const x of data){h^=x;h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
function diff(a,b,path=''){const out=[];if(Object.is(a,b))return out;const ao=a&&typeof a==='object',bo=b&&typeof b==='object';if(Array.isArray(a)!==Array.isArray(b)||!ao||!bo){out.push({path:path||'$',before:a,after:b});return out}const keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);for(const k of [...keys].sort())out.push(...diff(a?.[k],b?.[k],path?`${path}.${k}`:k));return out}
export async function createRelease({config,products,meta={},previous=null}){const state={config:clone(config),products:clone(products)};const changes=previous?diff({config:previous.config,products:previous.products},state):[];const release={id:`REL-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,createdAt:new Date().toISOString(),fingerprint:await digest(state),changes:changes.length,meta:clone(meta),state};const list=read();list.unshift(release);write(list);return release}
export function listReleases(){return read()}
export function getRelease(id){return read().find(x=>x.id===id)||null}
export function removeRelease(id){write(read().filter(x=>x.id!==id))}
export function clearReleases(){localStorage.removeItem(RELEASE_KEY)}
export function exportRelease(id){const r=getRelease(id);if(!r)throw new Error('Release introuvable.');const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${r.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
window.CatalogueV10Release={createRelease,listReleases,getRelease,removeRelease,clearReleases,exportRelease,version:'10.2'};
