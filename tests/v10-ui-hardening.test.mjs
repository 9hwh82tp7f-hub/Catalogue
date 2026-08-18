import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const panel = fs.readFileSync(path.join(root, 'panel.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

assert.match(html, /function openCart\(\)/, 'Le raccourci panier doit disposer d’une fonction openCart réelle.');
assert.match(html, /id="cartNavBtn"[^>]*data-action="cart"/, 'Le raccourci panier de la navigation doit être un bouton dédié.');
assert.match(html, /<button type="button" class="modal-topbar-btn" id="modalClose"/, 'La fermeture de fiche produit doit être un vrai bouton tactile/accessibile.');
assert.match(html, /modalClose[^\n]*aria-label="Fermer la fiche produit"/, 'Le bouton de fermeture média doit avoir un libellé accessible.');
assert.match(html, /id="modalCartBtn"/, 'Le panier doit rester accessible depuis la fiche produit.');
assert.match(html, /class="modal-media-preview"/, 'La miniature de la fiche doit être une zone média dédiée.');
assert.match(html, /function openMediaViewer\(product/, 'La visionneuse média doit être ouverte depuis la miniature.');
assert.match(html, /firstVideo >= 0 \? firstVideo : 0/, 'Le clic sur la miniature doit ouvrir prioritairement la vidéo lorsqu’elle existe.');
assert.match(html, /function syncOverlayScrollLock\(\)/, 'Le verrouillage du scroll doit être centralisé.');
assert.match(html, /querySelectorAll\('video'\)\.forEach\(video => \{ try\{ video\.pause\(\)/, 'La fermeture d’une fiche doit arrêter les vidéos.');
assert.match(html, /id="modalOverlay" aria-hidden="true"/, 'La modale produit doit exposer son état aria initial.');
assert.match(html, /id="cartOverlay" aria-hidden="true"/, 'La modale panier doit exposer son état aria initial.');
assert.doesNotMatch(html, /class="[^"]*mobile-cart-bar[^"]*"/, 'Une barre panier flottante ne doit plus exister : le panier est intégré à la navigation.');
assert.doesNotMatch(html, /\.cart-fab\s*\{/, 'Le FAB panier flottant ne doit plus exister.');
assert.match(html, /id="checkoutSend"/, 'Le bouton final Telegram doit exister.');
assert.match(html, /const sendButton=document\.getElementById\('checkoutSend'\)/, 'L’envoi Telegram doit verrouiller le bouton pendant le traitement.');
assert.match(html, /data-telegram-fallback/, 'Un fallback Telegram doit être fourni si la fenêtre est bloquée.');

assert.match(html, /id="compareModal" aria-hidden="true"/, 'La modale comparaison doit exposer son état aria initial.');
assert.match(sw, /CACHE_NAME = CACHE_PREFIX \+ 'v11\.4-[^']+'/, 'Le cache local doit être invalidé après la passe panel/index.');

// Le template publié doit rester strictement identique au catalogue source.
const m = panel.match(/const BASE_TEMPLATE_B64 = '([^']+)';/);
assert.ok(m, 'Template embarqué introuvable.');
const decoded = Buffer.from(m[1], 'base64').toString('utf8');
assert.equal(decoded, html, 'Le template embarqué du panneau doit rester identique à index.html.');

console.log('V10 UI hardening/regression tests: OK');
