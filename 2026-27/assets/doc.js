// Renders the edition's Markdown (chapter plans and guides) in the course look.
// doc.html#/02-agentic-ides/guide.md — no build step; needs http(s), not file://.
const C = window.COURSE;
const SITE_DIR = '2026-27/';

// Reading order: course README, then per chapter its plan and guide.
const PAGES = [{ path: 'README.md', title: 'About this edition' }];
C.living.forEach((g) => PAGES.push({ path: g.path, title: g.title }));
C.chapters.filter((c) => C.isOpen(c.id)).forEach((c) => {
  PAGES.push({ path: `${c.dir}/README.md`, title: `${c.id} · ${c.title}`, kind: 'Plan', chapter: c });
  PAGES.push({ path: `${c.dir}/guide.md`, title: `${c.id} · ${c.title}`, kind: 'Guide', chapter: c });
});

const content = document.getElementById('content');
const hero = document.getElementById('hero');
const sidebar = document.querySelector('.sidebar');
const pager = document.querySelector('.pager');
const toggle = document.querySelector('.menu-toggle');

function toRepoPath(fromFile, href) {
  const out = [];
  for (const part of (SITE_DIR + fromFile.replace(/[^/]*$/, '') + href).split('/')) {
    if (part === '..') out.pop();
    else if (part && part !== '.') out.push(part);
  }
  return out.join('/') + (href.endsWith('/') ? '/' : '');
}

function rewriteLink(a, fromFile) {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) {
    if (/^https?:/i.test(href || '')) a.target = '_blank';
    return;
  }
  const repoPath = toRepoPath(fromFile, href);
  const sitePath = repoPath.slice(SITE_DIR.length);
  const inSite = repoPath.startsWith(SITE_DIR);
  if (inSite && repoPath.endsWith('.md')) { a.href = '#/' + sitePath; return; }
  if (inSite && /\.html(#|$)/.test(repoPath)) { a.href = sitePath; return; }
  if (inSite && repoPath.endsWith('/') && PAGES.some((p) => p.path === sitePath + 'README.md')) {
    a.href = '#/' + sitePath + 'README.md'; return;
  }
  // Everything else in the repo (old slides, examples, tools, decks) is linked in place.
  // Note: PDFs and PPTX are in Git LFS, which GitHub Pages does not serve.
  a.href = '../' + repoPath;
  if (!repoPath.endsWith('.html')) a.target = '_blank';
}

function renderNav(current) {
  const item = (path, label, icon) =>
    `<a class="${path === current ? 'active' : ''}" href="#/${path}"><i class="fas ${icon}"></i>${label}</a>`;
  sidebar.innerHTML = `
    <div class="nav-group">${item('README.md', 'About this edition', 'fa-circle-info')}
      ${C.living.map((g) => item(g.path, g.title, g.icon)).join('')}</div>
    ${C.chapters.map((c) => !C.isOpen(c.id) ? `
      <div class="nav-group locked" style="--accent:${c.color}">
        <div class="nav-chapter"><span class="dot"><i class="fas fa-lock"></i></span>${c.title}</div>
      </div>` : `
      <div class="nav-group ${current.startsWith(c.dir + '/') ? 'open' : ''}" style="--accent:${c.color}">
        <div class="nav-chapter"><span class="dot">${c.id}</span>${c.title}</div>
        <a href="${c.dir}/slides.html"><i class="fas fa-play"></i>Slides</a>
        ${item(`${c.dir}/guide.md`, 'Guide', 'fa-book-open')}
        ${item(`${c.dir}/README.md`, 'Plan', 'fa-list-check')}
      </div>`).join('')}`;

  const i = PAGES.findIndex((p) => p.path === current);
  const label = (p) => (p.kind ? `${p.chapter.id} · ${p.kind}` : p.title);
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  pager.innerHTML =
    (prev ? `<a class="btn ghost" href="#/${prev.path}"><i class="fas fa-arrow-left"></i>${label(prev)}</a>` : '<span></span>') +
    (next ? `<a class="btn" href="#/${next.path}">${label(next)}<i class="fas fa-arrow-right"></i></a>` : '<span></span>');
}

function renderHero(page) {
  const c = page && page.chapter;
  if (!c) { hero.innerHTML = ''; hero.style.display = 'none'; return; }
  hero.style.display = '';
  hero.style.setProperty('--accent', c.color);
  hero.innerHTML = `
    <div class="hero-text">
      <div class="meta">Chapter ${c.id} · ${page.kind}</div>
      <h1>${c.title}</h1>
      <div class="actions">
        <a class="btn" href="${c.dir}/slides.html"><i class="fas fa-play"></i>Slides</a>
        <a class="btn ghost ${page.kind === 'Guide' ? 'on' : ''}" href="#/${c.dir}/guide.md"><i class="fas fa-book-open"></i>Guide</a>
        <a class="btn ghost ${page.kind === 'Plan' ? 'on' : ''}" href="#/${c.dir}/README.md"><i class="fas fa-list-check"></i>Plan</a>
      </div>
    </div>
    <span class="num">${c.id}</span>
    <span class="icon"><i class="fas ${c.icon}"></i></span>`;
}

async function load() {
  const path = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'README.md';
  const page = PAGES.find((p) => p.path === path);
  renderNav(path);
  renderHero(page);
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');

  const locked = C.chapters.find((c) => !C.isOpen(c.id) && path.startsWith(c.dir + '/'));
  if (locked) {
    content.innerHTML = `<h1><i class="fas fa-lock"></i> Coming soon</h1>
      <p>Chapter ${locked.id} · ${locked.title} opens after its class.</p>
      <p><a href="index.html">Back to the course</a></p>`;
    return;
  }
  if (location.protocol === 'file:') {
    content.innerHTML = `<h1>Run a local server</h1><p>Browsers block loading Markdown from <code>file://</code>.
      From the repo root run <code>python3 -m http.server</code> and open <code>http://localhost:8000/2026-27/</code>.</p>`;
    return;
  }
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    let html = marked.parse(await res.text());
    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = `<h1>Not found</h1><p>${err.message}</p>`;
    return;
  }
  // The chapter hero already shows the title.
  if (page && page.chapter) content.querySelector('h1')?.remove();
  content.querySelectorAll('a').forEach((a) => rewriteLink(a, path));
  content.querySelectorAll('p em').forEach((em) => {
    if (em.textContent === 'To write.') em.closest('p').classList.add('gap');
  });
  document.title = `${page ? (page.kind ? `${page.chapter.id} ${page.kind} · ${page.chapter.title}` : page.title) : path} — ${C.title} ${C.edition}`;
  window.scrollTo(0, 0);
}

toggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', load);
load();
