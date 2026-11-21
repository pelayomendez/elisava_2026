// One project brief, picked by the hash: project.html#ex1. Data lives in COURSE.exercises.
const C = window.COURSE;
const root = document.getElementById('project');
const tabs = document.getElementById('tabs');
const isExternal = (href) => /^https?:/.test(href);
// Only projects of chapters already open on the site.
const EXERCISES = C.exercises.filter((e) => C.isOpen(e.chapter));

function render() {
  const slug = location.hash.slice(1) || EXERCISES[0].slug;
  const i = Math.max(0, EXERCISES.findIndex((e) => e.slug === slug));
  const e = EXERCISES[i];
  const c = C.chapters.find((ch) => ch.id === e.chapter);
  document.title = `${e.id} · ${e.title} — ${C.title} ${C.edition}`;
  document.body.style.setProperty('--accent', c.color);

  tabs.innerHTML = EXERCISES.map((x) => {
    const xc = C.chapters.find((ch) => ch.id === x.chapter);
    return `<a href="#${x.slug}" class="${x === e ? 'on' : ''}" style="--accent:${xc.color}">${x.id}</a>`;
  }).join('');

  const prev = EXERCISES[i - 1], next = EXERCISES[i + 1];
  root.innerHTML = `
    <header class="card project-hero" style="--accent:${c.color}">
      <div class="meta">${e.id} · Chapter ${c.id} · ${c.title}</div>
      <h1>${e.title}</h1>
      <p class="lead">${e.lead}</p>
      <div class="actions">
        <a class="btn" href="${c.dir}/slides.html"><i class="fas fa-play"></i> Chapter slides</a>
        <a class="btn ghost" href="doc.html#/${c.dir}/guide.md"><i class="fas fa-book-open"></i> Guide</a>
        <a class="btn ghost" href="doc.html#/${c.dir}/README.md"><i class="fas fa-list-check"></i> Plan</a>
      </div>
      <span class="big-icon"><i class="fas ${c.icon}"></i></span>
    </header>

    <section class="project-block">
      <h2>Steps</h2>
      <ol class="project-steps">
        ${e.steps.map(([t, d]) => `<li class="card" style="--accent:${c.color}"><h3>${t}</h3><p>${d}</p></li>`).join('')}
      </ol>
    </section>

    <div class="project-cols">
      <section class="project-block">
        <h2>Deliver</h2>
        <ul class="card deliver" style="--accent:${c.color}">
          ${e.deliver.map((d) => `<li><i class="fas fa-square-check"></i>${d}</li>`).join('')}
        </ul>
      </section>
      ${e.resources.length ? `
      <section class="project-block">
        <h2>Resources</h2>
        <div class="resources">
          ${e.resources.map(([t, ic, href]) => `
            <a class="card compact" style="--accent:${c.color}" href="${encodeURI(href)}" ${isExternal(href) ? 'target="_blank" rel="noopener"' : ''}>
              <span class="icon"><i class="fas ${ic}"></i></span><h3>${t}</h3>
            </a>`).join('')}
        </div>
      </section>` : ''}
    </div>

    <nav class="project-pager">
      ${prev ? `<a class="btn ghost" href="#${prev.slug}"><i class="fas fa-arrow-left"></i> ${prev.id} · ${prev.title}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#${next.slug}">${next.id} · ${next.title} <i class="fas fa-arrow-right"></i></a>` : '<span></span>'}
    </nav>`;
  window.scrollTo(0, 0);
}

addEventListener('hashchange', render);
render();
