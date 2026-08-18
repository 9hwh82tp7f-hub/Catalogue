import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const panel = fs.readFileSync(path.join(root,'panel.html'),'utf8');

assert.match(html,/function overlayFocusable\(overlay\)/,'Les overlays doivent avoir une gestion centralisée du focus.');
assert.match(html,/if\(e\.key === 'Tab' && topOverlay\)/,'Le focus clavier doit rester dans l’overlay actif.');
assert.match(html,/closeOverlayFocus\(cartOverlay\)/,'Le focus du panier doit être restauré à la fermeture.');
assert.match(html,/closeOverlayFocus\(overlay\);\n  syncOverlayScrollLock\(\);/,'La visionneuse média doit restaurer le focus à la fermeture.');
assert.match(html,/\.media-viewer-overlay\.open, #checkoutOverlay\.open, #cartOverlay\.open/,'Le checkout et le panier doivent verrouiller le scroll comme les autres overlays.');
assert.match(panel,/role:'dialog', 'aria-modal':'true', 'aria-labelledby':'appDialogTitle'/,'Les dialogues du panel doivent exposer un rôle dialog accessible.');
assert.match(panel,/if\(e\.key !== 'Tab'\)/,'Les dialogues du panel doivent piéger le focus au clavier.');
assert.match(panel,/appDialogReturnFocus/,'Le focus du panel doit être restauré après fermeture du dialogue.');
console.log('Accessibility/responsive hardening: OK');
