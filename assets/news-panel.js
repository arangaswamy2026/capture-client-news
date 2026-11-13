/* Security News panel for the header newspaper icon (formatted like the Announcements resource-center panel; top 5 plus a View all link).
   Source: https://www.sonicwall.com/api/content?contentKey=security-news&page=0&pageSize=20&locale=en-us
   The live API is attempted first; if the browser blocks it (CORS / bot protection) the bundled snapshot is used. */
(function () {
  var API = 'https://www.sonicwall.com/api/content?contentKey=security-news&page=0&pageSize=20&locale=en-us';
  var SITE = 'https://www.sonicwall.com/blog';
  var ALL = 'https://capturelabs.sonicwall.com/m/feature/security-news';
  var TOP = 5;
  var btn = document.getElementById('cc-news-btn');
  if (!btn) return;

  var panel = document.createElement('section');
  panel.className = 'cc-news-panel';
  panel.id = 'cc-news-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Security News');
  panel.hidden = true;
  panel.innerHTML =
    '<header class="cc-news-panel__head">' +
    '<h2 class="cc-news-panel__title">Security News</h2>' +
    '<button type="button" class="cc-news-panel__close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
    '</header><div class="cc-news-panel__body" tabindex="0"></div>' +
    '<footer class="cc-news-panel__foot"><a class="cc-news-panel__all" href="' + ALL + '" target="_blank" rel="noopener">View all <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></footer>';
  document.body.appendChild(panel);
  var body = panel.querySelector('.cc-news-panel__body');

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function fmt(iso) {
    var t = new Date(iso); if (isNaN(t)) return '';
    return t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  function render(items, note) {
    body.innerHTML = items.slice(0, TOP).map(function (n) {
      var href = SITE + n.url;
      return '<article class="cc-news-card">' +
        '<h3 class="cc-news-card__title">' + esc(n.title) + '</h3>' +
        '<div class="cc-news-card__date">' + esc(fmt(n.date)) + '</div>' +
        '<p class="cc-news-card__text">' + esc(n.text) + '</p>' +
        '<a class="cc-news-card__link" href="' + esc(href) + '" target="_blank" rel="noopener">Learn more &gt;</a>' +
        '</article>';
    }).join('') + (note ? '<div class="cc-news-panel__note">' + esc(note) + '</div>' : '');
  }

  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    render(window.CC_NEWS_SNAPSHOT || [], '');
    fetch(API, { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var items = (d.items || []).map(function (i) {
          return { title: i.title, url: i.url, date: i.published_date, text: plain(i.paragraph).slice(0, 300) };
        });
        if (items.length) render(items, '');
      })
      .catch(function () { /* keep snapshot */ });
  }

  function open() { load(); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); body.scrollTop = 0; }
  function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) { e.stopPropagation(); panel.hidden ? open() : close(); });
  panel.querySelector('.cc-news-panel__close').addEventListener('click', close);
  panel.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { if (!panel.hidden) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
})();
