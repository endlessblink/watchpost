/* Watchpost "Dusk" shared dropdown.
   Replaces the operating system's select popup with a Dusk listbox for every <select> on the page.
   The real <select> stays in place (same id, value, onchange), only its popup is ours, so no page code changes.
   Selects added later are picked up automatically. Opt out with data-native on a select. */
(function () {
  if (window.DuskSelect) return;

  var CHECK = '<svg class="ds-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var menu = null, current = null, items = [], active = -1, typed = '', typedTimer = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function ensureMenu() {
    if (menu) return menu;
    menu = document.createElement('div');
    menu.className = 'dusk-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    menu.addEventListener('mousedown', function (e) { e.preventDefault(); });
    menu.addEventListener('click', function (e) {
      var el = e.target.closest('.dusk-opt');
      if (el && !el.classList.contains('disabled')) choose(+el.dataset.i);
    });
    menu.addEventListener('mousemove', function (e) {
      var el = e.target.closest('.dusk-opt');
      if (el && !el.classList.contains('disabled')) setActive(+el.dataset.i, true);
    });
    document.body.appendChild(menu);
    return menu;
  }

  function setActive(i, noScroll) {
    if (active >= 0 && items[active]) items[active].classList.remove('active');
    active = i;
    if (items[i]) {
      items[i].classList.add('active');
      menu.setAttribute('aria-activedescendant', items[i].id);
      if (!noScroll) items[i].scrollIntoView({ block: 'nearest' });
    }
  }

  function step(dir) {
    var n = items.length, i = active;
    for (var k = 0; k < n; k++) {
      i = (i + dir + n) % n;
      if (!items[i].classList.contains('disabled')) return setActive(i);
    }
  }

  function open(sel) {
    if (sel.disabled) return;
    if (current === sel) return close();
    close();
    var m = ensureMenu();
    current = sel;
    m.innerHTML = '';
    items = [];
    Array.prototype.forEach.call(sel.options, function (o, i) {
      var el = document.createElement('div');
      el.className = 'dusk-opt' + (o.disabled ? ' disabled' : '');
      el.id = 'ds-opt-' + i;
      el.dataset.i = i;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', i === sel.selectedIndex ? 'true' : 'false');
      el.innerHTML = '<span class="ds-label">' + esc(o.textContent) + '</span>' + CHECK;
      m.appendChild(el);
      items.push(el);
    });
    m.setAttribute('aria-label', sel.getAttribute('aria-label') || sel.title || '');
    m.hidden = false;
    m.style.visibility = 'hidden';
    place(sel);
    m.style.visibility = '';
    sel.setAttribute('aria-expanded', 'true');
    active = -1;
    setActive(sel.selectedIndex >= 0 ? sel.selectedIndex : 0);
  }

  function place(sel) {
    var r = sel.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    menu.style.minWidth = Math.max(r.width, 180) + 'px';
    menu.style.maxHeight = Math.min(360, vh - 16) + 'px';
    var mw = menu.offsetWidth, mh = menu.offsetHeight;
    var left = r.left;
    if (left + mw > vw - 8) left = Math.max(8, r.right - mw);
    var top = r.bottom + 6;
    if (top + mh > vh - 8 && r.top - 6 - mh > 8) top = r.top - 6 - mh;
    menu.style.left = left + 'px';
    menu.style.top = Math.max(8, top) + 'px';
  }

  function close() {
    if (!current) return;
    current.removeAttribute('aria-expanded');
    current = null;
    if (menu) menu.hidden = true;
  }

  function choose(i) {
    var sel = current;
    if (!sel) return;
    close();
    if (sel.selectedIndex !== i) {
      sel.selectedIndex = i;
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sel.focus({ preventScroll: true });
  }

  function onKey(e) {
    if (!current) return;
    var k = e.key;
    if (k !== 'Tab') e.stopPropagation();   // the select's own handler must not reopen the menu on the same key
    if (k === 'Escape') { e.preventDefault(); var s = current; close(); s.focus(); return; }
    if (k === 'ArrowDown') { e.preventDefault(); step(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if (k === 'Home') { e.preventDefault(); setActive(0); }
    else if (k === 'End') { e.preventDefault(); setActive(items.length - 1); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (active >= 0) choose(active); }
    else if (k === 'Tab') close();
    else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      typed += k.toLowerCase();
      clearTimeout(typedTimer);
      typedTimer = setTimeout(function () { typed = ''; }, 700);
      var opts = current.options, n = opts.length, hit = -1;
      for (var j = 0; j < n && hit < 0; j++) {
        var idx = (Math.max(active, 0) + (typed.length > 1 ? 0 : 1) + j) % n;
        if (!opts[idx].disabled && opts[idx].textContent.trim().toLowerCase().indexOf(typed) === 0) hit = idx;
      }
      if (hit >= 0) setActive(hit);
    }
  }

  function enhance(sel) {
    if (sel.__dusk || sel.hasAttribute('data-native') || sel.multiple || sel.size > 1) return;
    sel.__dusk = true;
    sel.setAttribute('aria-haspopup', 'listbox');
    sel.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();               // no native popup
      sel.focus({ preventScroll: true });
      open(sel);
    });
    sel.addEventListener('keydown', function (e) {
      if (current === sel) return;      // the document handler owns keys while open
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(sel);
      }
    });
  }

  function scan(root) {
    if (root.tagName === 'SELECT') enhance(root);
    else if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('select'), enhance);
  }

  function start() {
    scan(document);
    new MutationObserver(function (list) {
      list.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', function (e) {
      if (current && !(menu && menu.contains(e.target)) && e.target !== current) close();
    }, true);
    window.addEventListener('blur', close);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', function (e) { if (menu && !menu.contains(e.target)) close(); }, true);
  }

  window.DuskSelect = { enhance: enhance, close: close };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
