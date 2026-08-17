export class GitHubClient{
  constructor({owner,repo,branch,token}){this.owner=owner;this.repo=repo;this.branch=branch;this.token=token;this.base=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;}
  headers(json=false){const h={Authorization:`Bearer ${this.token}`,Accept:'application/vnd.github+json'};if(json)h['Content-Type']='application/json';return h;}
  async json(url,options={}){const r=await fetch(url,options);const t=await r.text();let b=null;try{b=t?JSON.parse(t):null}catch{b=t}if(!r.ok)throw new Error(`${r.status} — ${typeof b==='string'?b:(b?.message||'Erreur GitHub')}`);return b;}
  ref(){return this.json(`${this.base}/git/ref/heads/${encodeURIComponent(this.branch)}`,{headers:this.headers()});}
  commit(sha){return this.json(`${this.base}/git/commits/${encodeURIComponent(sha)}`,{headers:this.headers()});}
  history(limit=20){return this.json(`${this.base}/commits?sha=${encodeURIComponent(this.branch)}&per_page=${Math.min(limit,30)}`,{headers:this.headers()});}
}
