// Builds the landing page from COURSE (assets/course.js).
const C = window.COURSE;
const $ = (id) => document.getElementById(id);
const chapterOf = (id) => C.chapters.find((c) => c.id === id);
const icon = (name, brand) => `<i class="${brand ? 'fab' : 'fas'} ${name}"></i>`;
const soon = `<div class="meta soon">${icon('fa-lock')} Coming soon</div>`;

$('instructor').textContent = C.instructor;
$('school').textContent = C.school;
$('stat-chapters').textContent = C.chapters.length;
$('stat-exercises').textContent = C.exercises.length;
$('stat-guides').textContent = C.chapters.length + C.living.length + C.foundations.length;

$('path').innerHTML = C.chapters.map((c) => C.isOpen(c.id) ? `
  <a href="${c.dir}/slides.html" class="${c.core ? 'core' : ''}" style="--accent:${c.color}">
    <span class="dot">${c.id}</span><span class="name">${c.short}</span>
  </a>` : `
  <span class="locked ${c.core ? 'core' : ''}" style="--accent:${c.color}" title="Coming soon">
    <span class="dot">${icon('fa-lock')}</span><span class="name">${c.id}</span>
  </span>`).join('');

$('chapters').innerHTML = C.chapters.map((c) => !C.isOpen(c.id) ? `
  <article class="card locked" style="--accent:${c.color}">
    <div class="top"><span class="num">${c.id}</span><span class="icon">${icon('fa-lock')}</span></div>
    <h3>Chapter ${c.id}</h3>${soon}
  </article>` : `
  <article class="card" style="--accent:${c.color}">
    ${c.core ? '<span class="badge">New core</span>' : ''}
    <div class="top"><span class="num">${c.id}</span><span class="icon">${icon(c.icon)}</span></div>
    <h3>${c.title}</h3>
    <ul>${c.bullets.map((b) => `<li>${icon('fa-check-circle')}${b}</li>`).join('')}</ul>
    <div class="meta" data-count="${c.dir}">Slides</div>
    <div class="actions">
      <a class="btn" href="${c.dir}/slides.html">${icon('fa-play')} Slides</a>
      <a class="btn ghost" href="doc.html#/${c.dir}/guide.md">${icon('fa-book-open')} Guide</a>
      <a class="btn ghost" href="doc.html#/${c.dir}/README.md">${icon('fa-list-check')} Plan</a>
    </div>
  </article>`).join('');

// Chapter guides are on the chapter cards; this section holds the reference guides.
$('guides').innerHTML = C.living.map((g) => `
  <a class="card compact live" href="doc.html#/${g.path}">
    <span class="icon">${icon(g.icon)}</span>
    <div class="meta"><span class="live-dot"></span>Living guide</div>
    <h3>${g.title}</h3><p>${g.text}</p>
  </a>`).join('') + C.foundations.map((g) => `
  <a class="card compact" href="${g.href}">
    <span class="icon">${icon(g.icon, g.brand)}</span>
    <h3>${g.title}</h3><p>${g.text}</p>
  </a>`).join('');

$('exercises').innerHTML = C.exercises.map((e) => {
  const c = chapterOf(e.chapter);
  if (!C.isOpen(c.id)) return `
  <div class="card compact locked" style="--accent:${c.color}">
    <span class="icon">${icon('fa-lock')}</span>
    <h3>${e.id}</h3>${soon}
  </div>`;
  return `
  <a class="card compact" style="--accent:${c.color}" href="project.html#${e.slug}">
    <span class="icon">${icon(c.icon)}</span>
    <div class="meta">${e.id} · Chapter ${c.id}</div>
    <h3>${e.title}</h3><p>${e.text}</p>
  </a>`;
}).join('');

$('decks').innerHTML = C.decks.map((d) => {
  const c = chapterOf(d.chapter);
  if (!C.isOpen(c.id)) return '';
  return `
  <a class="card compact" style="--accent:${c.color}" href="${d.href}" target="_blank" rel="noopener">
    <span class="icon">${icon(d.icon)}</span>
    <div class="meta">PDF · Chapter ${c.id}</div>
    <h3>${d.title}</h3><p>${d.text}</p>
  </a>`;
}).join('');
$('decks').closest('section').hidden = !$('decks').innerHTML.trim();

// Slide counts come from the decks themselves, so they never go stale.
let total = 0;
Promise.all(C.chapters.filter((c) => C.isOpen(c.id)).map(async (c) => {
  try {
    const html = await (await fetch(`${c.dir}/slides.html`)).text();
    const n = (html.match(/<section class="slide/g) || []).length;
    total += n;
    document.querySelector(`[data-count="${c.dir}"]`).textContent = `${n} slides`;
  } catch { /* opened from file:// — leave the label as is */ }
})).then(() => { if (total) $('stat-slides').textContent = total; });
