/* S Lineage Realtors blog — shared site chrome (reusable header + footer), blog index
   (featured horizontal scroller + filterable grid) and scroll-reveal.
   Every page includes <script src="js/site.js" defer></script> (posts use ../js/site.js)
   plus optional <div id="posts-grid"></div> / <div id="featured-scroller"></div>. */
(function () {
  var BRAND = "S Lineage Realtors";
  var TAGLINE = "Pre-leased commercial space at The Omaxe State, Dwarka, explained plainly by a local consultant.";
  var inPosts = location.pathname.indexOf('/posts/') !== -1;
  var base = inPosts ? '../' : '';
  var file = (location.pathname.split('/').pop() || 'index.html');
  var PHONE = '+919810504326', PHONE_H = '+91 98105 04326';
  var WA = 'https://wa.me/919810504326?text=' + encodeURIComponent('Hello Manoj ji, I would like to know more about The Omaxe State, Dwarka.');
  var nav = [
    { label: 'Home', href: base + 'index.html', match: ['', 'index.html'] },
    { label: 'The project', href: base + 'index.html#project', match: [] },
    { label: 'How it works', href: base + 'index.html#how', match: [] },
    { label: 'FAQ', href: base + 'index.html#faq', match: [] },
    { label: 'Blog', href: base + 'index.html#blog', match: [] }
  ];
  var BADGE = { 'Platform': 'badge-platform', 'Getting Started': 'badge-getting-started', 'How-To': 'badge-how-to', 'Strategy': 'badge-strategy' };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function active(m) { return m.indexOf(file) !== -1; }

  function header() {
    var links = nav.map(function (n) { return '<a href="' + n.href + '"' + (active(n.match) ? ' class="active"' : '') + '>' + n.label + '</a>'; }).join('');
    return '<header class="site-header"><div class="inner">' +
      '<a class="logo" href="' + base + 'index.html"><span class="dot"></span>' + esc(BRAND) + '</a>' +
      '<button class="nav-toggle" aria-label="Menu">&#9776;</button>' +
      '<nav id="site-nav">' + links + '<a class="nav-cta" href="' + WA + '" rel="noopener">WhatsApp</a></nav></div></header>';
  }
  function footer() {
    return '<footer class="site-footer"><div class="inner">' +
      '<div><div class="logo"><span class="dot"></span>' + esc(BRAND) + '</div><p>' + esc(TAGLINE) + '</p></div>' +
      '<div><h4>Contact</h4><ul class="contact"><li><a href="tel:' + PHONE + '">' + PHONE_H + '</a></li>' +
        '<li><a href="' + WA + '" rel="noopener">WhatsApp</a></li><li>Sector 19B, Dwarka, New Delhi 110075</li>' +
        '<li><a href="https://www.facebook.com/profile.php?id=61582064513569" rel="noopener">Facebook</a></li></ul></div>' +
      '<div><h4>Explore</h4><ul><li><a href="' + base + 'index.html#project">The Omaxe State</a></li>' +
        '<li><a href="' + base + 'index.html#faq">FAQ</a></li><li><a href="' + base + 'index.html#blog">Blog</a></li></ul></div>' +
      '<p class="disclosure">S Lineage Realtors (Manoj Sachdeva) is an authorised channel partner for The Omaxe State and is not Omaxe Ltd or the DDA. ' +
        'Project facts come from the developer\'s launch coverage and the project\'s Delhi RERA registration (DLRERA2024P0003). ' +
        'Prices, availability, rental terms and timelines are as per the current official cost sheet, Omaxe\'s agreement and the RERA registration. ' +
        'This site is information, not an offer, and not tax or legal advice.</p>' +
      '<div class="copy">&copy; <span id="yr"></span> ' + esc(BRAND) + '. All rights reserved.</div>' +
      '</div></footer>';
  }
  function mount(id, html, where) { var el = document.getElementById(id); if (el) { el.outerHTML = html; return; } document.body.insertAdjacentHTML(where, html); }

  function cardHTML(p) {
    var href = (inPosts ? '' : 'posts/') + encodeURIComponent(p.slug) + '.html';
    return '<article class="card reveal">' +
      '<span class="badge ' + (BADGE[p.category] || '') + '">' + esc(p.category || 'Article') + '</span>' +
      '<h3><a href="' + href + '">' + esc(p.title) + '</a></h3>' +
      '<p class="excerpt">' + esc(p.excerpt || '') + '</p>' +
      '<div class="card-meta"><span>' + esc(p.publishedAt || '') + '</span><span>&middot;</span><span>' + esc(p.readTime || '') + '</span></div>' +
      '</article>';
  }
  function renderBlog(posts) {
    var grid = document.getElementById('posts-grid'), related = document.getElementById('related-posts'),
        scroller = document.getElementById('featured-scroller'), empty = document.getElementById('empty-state'),
        filters = document.getElementById('filters');
    var sorted = (posts || []).slice().sort(function (a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });
    if (scroller) {
      var feat = sorted.slice(0, 8);
      if (feat.length) scroller.innerHTML = feat.map(cardHTML).join('');
      else { var sw = scroller.closest('.blog-featured'); if (sw) sw.style.display = 'none'; }
    }
    if (grid) {
      if (!sorted.length) { if (empty) empty.style.display = 'block'; }
      else {
        var activeF = 'All';
        var cats = ['All'].concat(Array.from(new Set(sorted.map(function (p) { return p.category; }).filter(Boolean))).sort());
        function draw() { var list = activeF === 'All' ? sorted : sorted.filter(function (p) { return p.category === activeF; }); grid.innerHTML = list.map(cardHTML).join(''); observe(); }
        if (filters && cats.length > 1) {
          filters.innerHTML = cats.map(function (c) { return '<button class="filter-btn' + (c === activeF ? ' active' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
          filters.querySelectorAll('.filter-btn').forEach(function (b) { b.addEventListener('click', function () { activeF = b.dataset.c; filters.querySelectorAll('.filter-btn').forEach(function (x) { x.classList.toggle('active', x === b); }); draw(); }); });
        }
        draw();
      }
    }
    if (related) {
      var rel = sorted.filter(function (p) { return p.slug !== file.replace('.html', ''); }).slice(0, 3);
      if (rel.length) related.innerHTML = rel.map(cardHTML).join('');
      else { var rp = related.closest('.related-posts'); if (rp) rp.style.display = 'none'; }
    }
  }
  var io;
  function observe() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (e) { io.observe(e); });
  }
  function wire() {
    var t = document.querySelector('.nav-toggle'), n = document.getElementById('site-nav');
    if (t && n) t.addEventListener('click', function () { n.classList.toggle('open'); });
    document.querySelectorAll('[data-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () { var s = document.getElementById('featured-scroller'); if (!s) return; s.scrollBy({ left: (btn.dataset.scroll === 'next' ? 1 : -1) * Math.min(s.clientWidth * .9, 720), behavior: 'smooth' }); });
    });
    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  }
  function init() {
    mount('site-header', header(), 'afterbegin');
    mount('site-footer', footer(), 'beforeend');
    wire();
    if (document.getElementById('posts-grid') || document.getElementById('related-posts') || document.getElementById('featured-scroller')) {
      fetch(base + 'posts-data.json').then(function (r) { return r.json(); }).then(renderBlog).then(observe).catch(function () { renderBlog([]); observe(); });
    } else observe();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
