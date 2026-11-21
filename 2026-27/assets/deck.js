// Slide engine. A deck is <body class="deck" data-chapter="NN"> with <section class="slide"> children.
// Keys: → / Space / PageDown next · ← / PageUp previous · Esc / Home course page · O overview · F fullscreen.
// Past the last slide it continues into the next chapter's deck; before the first, into the previous one.
(function () {
  const C = window.COURSE;
  const idx = C.chapters.findIndex((c) => c.id === document.body.dataset.chapter);
  const chapter = C.chapters[idx];
  // Locked chapters are not shown on the published site.
  if (!C.isOpen(chapter.id)) { location.replace('../index.html'); return; }
  const prevCh = C.chapters[idx - 1];
  const nextCh = C.chapters[idx + 1] && C.isOpen(C.chapters[idx + 1].id) ? C.chapters[idx + 1] : null;
  // The closing "Next · …" note names the next chapter: keep only its number while it is locked.
  const upcoming = C.chapters[idx + 1];
  if (upcoming && !C.isOpen(upcoming.id)) {
    document.querySelectorAll('.note').forEach((n) => {
      if (n.textContent.trim().startsWith('Next ·')) n.innerHTML = `<strong>Next · Chapter ${upcoming.id}</strong>`;
    });
  }
  const slides = [...document.querySelectorAll('section.slide')];
  const n = slides.length;

  document.documentElement.style.setProperty('--accent', chapter.color);
  document.title = `${chapter.id} · ${chapter.title} — ${C.title}`;

  const stage = document.createElement('div');
  stage.className = 'stage';
  slides[0].before(stage);

  slides.forEach((s, i) => {
    s.style.setProperty('--accent', chapter.color);
    s.insertAdjacentHTML('afterbegin', `
      <div class="dots"></div>
      <div class="circle" style="width:600px;height:600px;top:-140px;right:-160px;opacity:.6"></div>
      <div class="circle" style="width:460px;height:460px;bottom:-220px;left:-120px;opacity:.4"></div>
      <div class="chrome chapter-tag"><b>${chapter.id}</b> · ${chapter.title}</div>
      <div class="chrome brand"><span class="pill">Agentic Product Dev · ${C.edition}</span></div>`);
    s.insertAdjacentHTML('beforeend', `
      <a class="chrome home" href="../index.html" title="Course page (Esc)"><i class="fas fa-house"></i></a>
      <div class="chrome progress"><span>Slide ${i + 1}/${n}</span>
        <span class="bar"><span class="fill" style="width:${((i + 1) / n) * 100}%"></span></span></div>
      <div class="chrome arrows">
        <a href="#" data-go="-1" title="Previous (←)"><i class="fas fa-chevron-left"></i></a>
        <a href="#" data-go="1" title="Next (→)"><i class="fas fa-chevron-right"></i></a>
      </div>`);
    const shell = document.createElement('div');
    shell.className = 'slide-shell';
    shell.appendChild(s);
    stage.appendChild(shell);
    shell.addEventListener('click', () => {
      if (document.body.classList.contains('overview')) { toggleOverview(); show(i); }
    });
  });

  let current = 0;

  function fit() {
    if (document.body.classList.contains('overview')) return;
    const k = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    slides.forEach((s) => { s.style.transform = `translate(-50%, -50%) scale(${k})`; });
  }

  function show(i) {
    current = Math.max(0, Math.min(n - 1, i));
    slides.forEach((s, j) => s.classList.toggle('active', j === current));
    history.replaceState(null, '', `#${current + 1}`);
  }

  function go(step) {
    const target = current + step;
    if (target >= n) { location.href = nextCh ? `../${nextCh.dir}/slides.html` : '../index.html'; return; }
    if (target < 0) { location.href = prevCh ? `../${prevCh.dir}/slides.html#last` : '../index.html'; return; }
    show(target);
  }

  function toggleOverview() {
    const on = document.body.classList.toggle('overview');
    slides.forEach((s) => { s.style.transform = on ? '' : s.style.transform; });
    fit();
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-go]');
    if (a) { e.preventDefault(); go(Number(a.dataset.go)); }
  });

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); go(1); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); go(-1); break;
      case 'Escape': case 'Home': e.preventDefault(); location.href = '../index.html'; break;
      case 'o': case 'O': toggleOverview(); break;
      case 'f': case 'F': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); break;
    }
  });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => show((parseInt(location.hash.slice(1), 10) || 1) - 1));
  const h = location.hash.slice(1);
  show(h === 'last' ? n - 1 : (parseInt(h, 10) || 1) - 1);
  fit();
})();
