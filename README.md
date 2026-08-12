CATALOGUE V6.0 — VERSION VALIDÉE
================================

Cette version consolide le catalogue statique et le panneau d’administration.

Corrections de la recette V5.8 → V6.0
- Archive nettoyée : fichiers de travail et anciens rapports retirés.
- Versionnement cohérent : Index, panneau, service worker et publication utilisent V6.0.
- Service worker local aligné sur V6.0.
- Générateur de service worker du panneau aligné sur V6.0.
- Template HTML embarqué dans le panneau régénéré à partir du Index.html final.
- Ancien helper Telegram non sécurisé et inutilisé supprimé.
- Manifest et icônes PWA validés.
- Import JSON sans exécution de JavaScript conservé.
- Jeton GitHub conservé uniquement en sessionStorage.
- Publication GitHub par tree/commit/ref conservée.

Limites d’architecture
- Pas de backend ni de base de données distante.
- Stock local au catalogue publié : pas de verrouillage inter-clients.
- Commandes transmises à Telegram.
- Le jeton GitHub reste présent dans le navigateur pendant la session ; pour une sécurité maximale, déplacer la publication côté serveur.
