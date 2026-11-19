(() => {
  const IMG = (name, thumb) => `assets/img/${name}${thumb ? '-thumb' : ''}.jpg`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const grid = document.getElementById('project-grid');
  const dlg = document.getElementById('project-dialog');
  const body = document.getElementById('project-body');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');

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

  // Lightbox
  function openLightbox(src, cap) {
    lbImg.src = src; lbImg.alt = cap || ''; lbCap.textContent = cap || '';
    lb.showModal();
  }
  body.addEventListener('click', (e) => {
    const img = e.target.closest('img[data-full]');
    if (img) openLightbox(img.dataset.full, img.alt);
  });
  lb.addEventListener('click', () => lb.close());

  // Making grid
  document.getElementById('making-grid').innerHTML = MAKING.map((m) => `
    <figure class="make" data-full="${IMG(m.img)}" data-cap="${esc(m.title + ': ' + m.cap)}">
      <img src="${IMG(m.img, true)}" alt="${esc(m.title)}" loading="lazy">
      <figcaption><b>${esc(m.title)}</b>${esc(m.cap)}</figcaption>
    </figure>`).join('');
  document.getElementById('making-grid').addEventListener('click', (e) => {
    const f = e.target.closest('.make');
    if (f) openLightbox(f.dataset.full, f.dataset.cap);
  });

  // Deep links: yoursite/#robot opens that project
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (PROJECTS.some((p) => p.id === id)) openProject(id, false);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
