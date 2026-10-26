/* Page chrome (theme, nav edge, reveal) and the hero wallet: tap or drag the cover up. */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  function paintIcon() {
    if (!icon) return;
    const dark = root.classList.contains('dark');
    icon.firstElementChild.setAttribute('href', 'assets/icons.svg' + (dark ? '#i-sun' : '#i-moon'));
    if (toggle) toggle.setAttribute('aria-pressed', String(dark));
  }
  paintIcon();
  if (toggle) {
    toggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
      paintIcon();
    });
  }

  const nav = document.querySelector('.nav');
  const sentinel = document.getElementById('nav-top');
  if (nav && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => nav.classList.toggle('scrolled', !e.isIntersecting)).observe(sentinel);
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Hero wallet ---- */
  const demo = document.querySelector('[data-wallet]');
  if (!demo) return;
  const cover = demo.querySelector('.cover');
  const hint = demo.querySelector('[data-hint]');
  const labels = { open: cover.dataset.labelClose, closed: cover.dataset.labelOpen };

  function setOpen(open) {
    demo.classList.toggle('open', open);
    cover.style.transform = '';
    cover.setAttribute('aria-label', open ? labels.open : labels.closed);
    cover.setAttribute('aria-expanded', String(open));
    if (hint) hint.textContent = open ? hint.dataset.close : hint.dataset.open;
  }

  /* Like the app: the cover follows the finger, and release speed decides. */
  let startY = 0, lastY = 0, lastT = 0, velocity = 0, height = 1, dragging = false, moved = false;
  cover.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false;
    startY = lastY = e.clientY; lastT = e.timeStamp; velocity = 0;
    height = cover.offsetHeight;
    cover.setPointerCapture(e.pointerId);
  });
  cover.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dt = Math.max(1, e.timeStamp - lastT);
    velocity = (e.clientY - lastY) / dt;
    lastY = e.clientY; lastT = e.timeStamp;
    const dy = Math.min(0, e.clientY - startY);
    if (Math.abs(e.clientY - startY) > 4) { moved = true; cover.classList.add('dragging'); }
    if (moved) cover.style.transform = `translateY(${dy}px)`;
  });
  function release(e) {
    if (!dragging) return;
    dragging = false;
    cover.classList.remove('dragging');
    if (!moved) { setOpen(true); return; }
    const progress = -(e.clientY - startY) / height;
    setOpen(progress > 0.3 || velocity < -0.5);
  }
  cover.addEventListener('pointerup', release);
  cover.addEventListener('pointercancel', release);
  cover.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
  });

  /* Closing: tap the open interior, like tapping free material in the app. */
  demo.querySelector('.screen').addEventListener('click', (e) => {
    if (demo.classList.contains('open') && !cover.contains(e.target)) setOpen(false);
  });
  const closeBtn = demo.querySelector('[data-close]');
  if (closeBtn) closeBtn.addEventListener('click', () => setOpen(!demo.classList.contains('open')));

  demo.querySelectorAll('.swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      demo.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === sw)));
      cover.querySelectorAll('img').forEach((img) => img.classList.toggle('on', img.dataset.material === sw.dataset.material));
      setOpen(false);
    });
  });
})();
