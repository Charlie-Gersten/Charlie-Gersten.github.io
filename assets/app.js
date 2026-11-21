(() => {
  const IMG = (name, thumb) => `assets/img/${name}${thumb ? '-thumb' : ''}.jpg`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const grid = document.getElementById('project-grid');
  const dlg = document.getElementById('project-dialog');
  const body = document.getElementById('project-body');
  const lb = document.getElementById('lightbox');
  const lbImgs = document.getElementById('lightbox-imgs');

  const tags = (t) => `<div class="tags">${t.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>`;

  // Project cards
  grid.innerHTML = PROJECTS.map((p) => {
    const thumb = p.cover
      ? `<div class="thumb${p.fit === 'contain' ? ' contain' : ''}"${p.bg ? ` style="background:${esc(p.bg)}"` : ''}><img src="${IMG(p.cover, true)}" alt="${esc(p.title)}" loading="lazy"></div>`
      : `<div class="thumb text" aria-hidden="true">${esc(p.title.split(' ').map((w) => w[0]).join('').slice(0, 3))}</div>`;
    return `<button class="card" data-id="${p.id}" aria-haspopup="dialog">
      ${thumb}
      <div class="body">
        <p class="meta">${esc(p.meta)}</p>
        <h3>${esc(p.title)}</h3>
        <p class="sum">${esc(p.summary)}</p>
        ${tags(p.tags)}
      </div>
    </button>`;
  }).join('');

  function openProject(id, push = true) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const gallery = (p.gallery || []).map((g) => g.video
      ? `<figure><video src="assets/video/${g.video}.mp4" poster="${IMG(g.poster, true)}" controls preload="none" playsinline></video><figcaption>${esc(g.cap)}</figcaption></figure>`
      : `<figure><img src="${IMG(g.img, true)}" data-full="${IMG(g.img)}" alt="${esc(g.cap)}"><figcaption>${esc(g.cap)}</figcaption></figure>`
    ).join('');
    body.innerHTML = `
      <p class="meta">${esc(p.meta)}</p>
      <h2>${esc(p.title)}</h2>
      ${tags(p.tags)}
      <p class="summary">${esc(p.summary)}</p>
      ${p.points && p.points.length ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${gallery ? `<div class="gallery">${gallery}</div>` : ''}`;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    if (push) history.replaceState(null, '', '#' + id);
  }

  function closeProject() {
    dlg.querySelectorAll('video').forEach((v) => v.pause());
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', () => {
    dlg.querySelectorAll('video').forEach((v) => v.pause());
    if (PROJECTS.some((p) => '#' + p.id === location.hash)) history.replaceState(null, '', location.pathname);
  });

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openProject(card.dataset.id);
  });
  dlg.querySelector('.close').addEventListener('click', closeProject);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeProject(); });

  // Lightbox: shows one or more images side by side, each with a caption
  function openLightbox(views) {
    lbImgs.classList.toggle('multi', views.length > 1);
    lbImgs.innerHTML = views.map((v) =>
      `<figure><img src="${v.src}" alt="${esc(v.cap || '')}"><figcaption>${esc(v.cap || '')}</figcaption></figure>`
    ).join('');
    lb.showModal();
  }
  body.addEventListener('click', (e) => {
    const img = e.target.closest('img[data-full]');
    if (img) openLightbox([{ src: img.dataset.full, cap: img.alt }]);
  });
  lb.addEventListener('click', () => lb.close());

  // Making + sketchbook grids
  const lists = { making: MAKING, sketches: window.SKETCHES || [] };
  const tiles = (key) => lists[key].map((m, i) => `
    <figure class="make" data-list="${key}" data-i="${i}">
      <div class="make-img"><img src="${IMG(m.img, true)}" alt="${esc(m.title)}" loading="lazy">${m.badge ? `<span class="badge">${esc(m.badge)}</span>` : ''}</div>
      <figcaption><b>${esc(m.title)}</b>${esc(m.cap)}</figcaption>
    </figure>`).join('');
  document.getElementById('making-grid').innerHTML = tiles('making');
  document.getElementById('sketch-grid').innerHTML = tiles('sketches');
  document.addEventListener('click', (e) => {
    const f = e.target.closest('.make');
    if (!f) return;
    const m = lists[f.dataset.list][+f.dataset.i];
    openLightbox(m.views
      ? m.views.map((v) => ({ src: IMG(v.img), cap: v.cap }))
      : [{ src: IMG(m.img), cap: `${m.title}: ${m.cap}` }]);
  });

  // Deep links: yoursite/#robot opens that project
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (PROJECTS.some((p) => p.id === id)) openProject(id, false);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
