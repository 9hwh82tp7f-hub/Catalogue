const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..','cat');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const required=[
  'id="modalCartBtn"',
  'id="modalCartCount"',
  'id="mediaViewerOverlay"',
  'id="mediaViewerClose"',
  'class="modal-media-preview"',
  'data-fav-for="${i}"',
  'function openMediaViewer',
  'function closeMediaViewer'
];
for(const needle of required) if(!html.includes(needle)) throw new Error('Missing UI contract: '+needle);
if(/class="modal-media"[^>]*>[\s\S]{0,300}<button[^>]+class="modal-close"/.test(html)) throw new Error('Legacy media close button remains in product preview.');
if(!html.includes("firstVideo >= 0 ? firstVideo : 0")) throw new Error('Media preview does not prioritize video on open.');
if(!html.includes("updateModalCartButton();")) throw new Error('Modal cart badge is not synchronized.');
console.log('V10.3 UI interaction audit: PASS');
