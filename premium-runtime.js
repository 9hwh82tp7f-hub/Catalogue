/* Premium Runtime — consolidated V10.4
   One runtime for 3D, showroom, UX and performance. */
(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // La source de vérité pour le réglage 3D est le CONFIG du site (panneau
  // d'administration > Apparence), déjà appliqué par la page hôte via la
  // classe body.visual-3d et la variable CSS --ui-3d. On lit ces deux
  // signaux directement plutôt qu'une clé localStorage indépendante, pour
  // que ce runtime reste toujours synchronisé avec les réglages réels.
  function intensity() {
    const raw = getComputedStyle(root).getPropertyValue('--ui-3d').trim();
    const parsed = Number(raw);
    return clamp(Number.isFinite(parsed) ? parsed * 1.5 : 1, 0, 1.5);
  }

  function threeDEnabled() {
    return body.classList.contains('visual-3d') && intensity() > 0;
  }

  function performanceTier() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    return cores <= 4 || memory <= 4 ? 'low' : 'balanced';
  }

  function applyRuntimeState() {
    // Auparavant désactivé en bloc dès qu'un pointeur tactile était détecté
    // (coarsePointer) : sur un catalogue consulté avant tout depuis un
    // téléphone, ça éteignait la quasi-totalité de la couche 3D pour la
    // majorité des visiteurs. Seule l'ambiance qui suit réellement un
    // curseur de souris (cf. setupAmbient) reste exclue du tactile.
    const enabled = threeDEnabled() && !reduceMotion.matches;
    root.style.setProperty('--ui-3d-strength', enabled ? intensity().toFixed(2) : '0');
    body.classList.toggle('ui-3d-enabled', enabled);
    body.classList.toggle('showroom-low', performanceTier() === 'low');
    body.classList.toggle('showroom-balanced', performanceTier() === 'balanced');
    body.classList.toggle('showroom-ultra', performanceTier() === 'ultra');
    body.classList.toggle('v9-anim-off', reduceMotion.matches);
    root.dataset.viewport = window.matchMedia('(max-width:760px)').matches ? 'mobile' : 'desktop';
  }

  function enhanceCards() {
    // Ciblé sur les vraies cartes du catalogue (mêmes classes que le
    // système 3D déjà appliqué en CSS par la page hôte), pour éviter
    // d'appliquer un effet 3D à des conteneurs structurels comme les
    // panneaux d'onglet (.panel) ou les fonds de modale (.modal-overlay).
    const selectors = [
      '.card',
      '.community-card',
      '.support-card',
      '.faq-item',
      '.builder-block',
      '.section-card',
      '.modal-panel'
    ];

    const nodes = new Set();
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => nodes.add(el));
    });

    nodes.forEach((el) => {
      if (el.closest('header,nav,footer,form')) return;

      el.classList.add('ui-3d', 'ui-depth-shadow', 'v4-parallax', 'v4-specular', 'v6-card', 'v5-depth-system', 'v5-interactive');

      if (!el.dataset.premiumBound) {
        el.dataset.premiumBound = '1';

        el.addEventListener('pointermove', (event) => {
          if (!body.classList.contains('ui-3d-enabled')) return;

          const rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          const s = intensity();

          el.style.transform =
            `perspective(var(--ui-perspective)) ` +
            `rotateX(${(-y * 7 * s).toFixed(2)}deg) ` +
            `rotateY(${(x * 9 * s).toFixed(2)}deg) ` +
            `translateZ(${(7 * s).toFixed(1)}px)`;

          el.style.setProperty('--v4-spec-x', `${(x * 120 + 20).toFixed(1)}%`);
        });

        // pointerleave seul ne suffit pas au doigt : sur beaucoup de
        // navigateurs mobiles il ne se déclenche pas de façon fiable à la
        // fin d'un toucher, ce qui laisserait la carte visuellement inclinée.
        const resetTilt = () => { el.style.transform = ''; };
        el.addEventListener('pointerleave', resetTilt);
        el.addEventListener('pointerup', resetTilt);
        el.addEventListener('pointercancel', resetTilt);
      }

      const children = [...el.children];
      if (children[0]) children[0].classList.add('v5-z-media');
      if (children[1]) children[1].classList.add('v5-z-text');
      if (children[2]) children[2].classList.add('v5-z-content');

      el.querySelectorAll('img').forEach((img) => {
        img.classList.add('v4-layer', 'v9-media-optimized');
        img.style.setProperty('--v4-z', '24px');
        if (!img.hasAttribute('loading') && !img.closest('header,nav')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');

        if (!img.parentElement.classList.contains('v6-media')) {
          const wrap = document.createElement('div');
          wrap.className = 'v6-media';
          img.parentNode.insertBefore(wrap, img);
          wrap.appendChild(img);
        }
      });

      el.querySelectorAll("h1,h2,h3,h4,strong,[class*='title'],[class*='price']").forEach((node, i) => {
        node.classList.add('v4-layer', 'v5-z-text');
        node.style.setProperty('--v4-z', `${28 + i * 3}px`);
      });

      el.querySelectorAll("button,a,[role='button']").forEach((button) => {
        button.classList.add('v5-cta', 'v6-button');
        if (!button.dataset.magneticBound) {
          button.dataset.magneticBound = '1';
          button.addEventListener('pointermove', (event) => {
            if (reduceMotion.matches || !body.classList.contains('ui-3d-enabled')) return;
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const m = Math.min(6, 5 * intensity());
            button.style.transform = `translate3d(${(x / rect.width * m).toFixed(1)}px,${(y / rect.height * m).toFixed(1)}px,${(4 * intensity()).toFixed(1)}px)`;
          });
          const resetMagnet = () => { button.style.transform = ''; };
          button.addEventListener('pointerleave', resetMagnet);
          button.addEventListener('pointerup', resetMagnet);
          button.addEventListener('pointercancel', resetMagnet);
        }
      });
    });
  }

  function setupAmbient() {
    if (!threeDEnabled() || reduceMotion.matches || performanceTier() === 'low') return;

    // Le halo suit une position de curseur en continu : sans souris, il n'y
    // a rien à suivre, donc on ne le crée pas au tactile. Le champ de
    // particules, lui, flotte tout seul (animation CSS) et reste pertinent
    // sur mobile.
    if (!coarsePointer.matches && !document.querySelector('.v4-cursor-light')) {
      const light = document.createElement('div');
      light.className = 'v4-cursor-light';
      document.body.appendChild(light);
    }

    if (!document.querySelector('.v4-particle-field')) {
      const field = document.createElement('div');
      field.className = 'v4-particle-field';
      const count = performanceTier() === 'ultra' ? 18 : 10;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('i');
        particle.className = 'v4-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${70 + Math.random() * 40}%`;
        particle.style.setProperty('--v4-dx', `${Math.random() * 180 - 90}px`);
        particle.style.setProperty('--v4-duration', `${9 + Math.random() * 10}s`);
        field.appendChild(particle);
      }
      document.body.appendChild(field);
    }
  }

  function setupShowroom() {
    const stage = document.querySelector('.showroom-stage');
    if (!stage || reduceMotion.matches || !threeDEnabled()) return;

    if (!stage.querySelector('.showroom-orbit')) {
      const orbit = document.createElement('div');
      orbit.className = 'showroom-orbit';
      stage.appendChild(orbit);
    }

    const object = stage.querySelector('.showroom-object');
    if (!object || object.dataset.showroomBound) return;
    object.dataset.showroomBound = '1';

    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const s = intensity();
      object.style.transform = `rotateX(${(-y * 7 * s).toFixed(2)}deg) rotateY(${(x * 11 * s).toFixed(2)}deg) translateZ(${(8 * s).toFixed(1)}px)`;
    });

    stage.addEventListener('pointerleave', () => { object.style.transform = ''; });
    stage.addEventListener('pointerup', () => { object.style.transform = ''; });
    stage.addEventListener('pointercancel', () => { object.style.transform = ''; });
  }

  function setupResponsiveUX() {
    document.querySelectorAll('form').forEach((form) => {
      if (form.dataset.v9Bound) return;
      form.dataset.v9Bound = '1';
      form.addEventListener('submit', () => form.setAttribute('aria-busy', 'true'));
    });
  }

  function refresh() {
    applyRuntimeState();
    enhanceCards();
    setupAmbient();
    setupShowroom();
    setupResponsiveUX();
  }

  let refreshQueued = false;
  const observer = new MutationObserver(() => {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      refresh();
    });
  });

  function init() {
    refresh();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('storage', refresh);
  window.addEventListener('visualSettingsChanged', refresh);
  window.addEventListener('resize', applyRuntimeState, { passive: true });
  reduceMotion.addEventListener?.('change', refresh);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.premiumDiagnostics = function () {
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      performanceTier: performanceTier(),
      reducedMotion: reduceMotion.matches,
      coarsePointer: coarsePointer.matches,
      threeDEnabled: threeDEnabled(),
      intensity: intensity(),
      images: document.images.length,
      scripts: document.scripts.length
    };
  };
})();
