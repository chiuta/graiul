/* GRAIUL · interfața. Folosește din ambalaj: I18N, DATA, COUNTIES, tr(), fmt() și funcțiile din engine.mjs. */
var STORE_KEY = 'graiul.state';
var TABS = ['search', 'today', 'map', 'add', 'export', 'guide'];
var PAGE = 30, MAX_FILE = 8000000, MAX_STORE_CHARS = 4000000, MAX_LINES_SHOWN = 20, MAX_PAIRS_SHOWN = 20;
var ENDONYM = { ro: 'română', en: 'English', fr: 'français', de: 'Deutsch', es: 'español', it: 'italiano', hu: 'magyar', pt: 'português', rom: 'romani' };
var HISTORIC = ['Moldova', 'Muntenia', 'Oltenia', 'Transilvania', 'Banat', 'Crișana', 'Maramureș', 'Bucovina', 'Dobrogea'];
var ISSUE_CODES = ['type', 'lang', 'text', 'region', 'county', 'translations', 'answer', 'purpose', 'notes', 'collector', 'consent', 'source', 'source_url', 'license', 'status', 'reviewed_by'];
var S = null, ALL = [], COUNTY_LIST = [], COUNTY_NAME = dict(), INDEX = [], TAKEN = dict();
var V = { tab: 'search', q: '', type: 'all', lang: 'all', region: 'all', county: '', minStatus: 'any', shown: PAGE, date: '', draft: null, more: false, confirm: '', focus: '', xscope: 'all', live: null, main: null, res: null, chk: null, potd: null, reveal: dict() };
var cur = { el: null, lang: 'en', L: null };
var booted = false, saveTimer = 0;

/* ---------- ajutoare DOM ---------- */
function h(tag, attrs, kids) {
  var e = document.createElement(tag), k;
  if (attrs) for (k in attrs) {
    var v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  if (kids) for (var i = 0; i < kids.length; i++) {
    var c = kids[i];
    if (c === null || c === undefined || c === false) continue;
    e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  return e;
}
function makeL(lang) {
  return {
    lang: lang,
    t: function (k) { return tr(lang, k); },
    f: function (k) { var a = [tr(lang, k)]; for (var i = 1; i < arguments.length; i++) a.push(arguments[i]); return fmt.apply(null, a); }
  };
}
function downloadBlob(name, blob) {
  try {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    return true;
  } catch (e) { return false; }
}
function downloadText(name, text, mime) { return downloadBlob(name, new Blob([text], { type: mime + ';charset=utf-8' })); }
function readText(file, done) {
  var L = cur.L;
  if (!file) return;
  if (file.size > MAX_FILE) { flash(L.t('e_big')); return; }
  var fr = new FileReader();
  fr.onload = function () { done(String(fr.result)); };
  fr.onerror = function () { flash(L.t('e_read')); };
  fr.readAsText(file, 'utf-8');
}
function flash(msg, lines) {
  var box = V.live;
  if (!box) return;
  box.textContent = '';
  if (msg) box.appendChild(h('p', { text: msg }));
  if (lines && lines.length) box.appendChild(h('ul', { class: 'gr-lines' }, lines.map(function (x) { return h('li', { text: x }); })));
}
function field(label, control, id) { return h('div', { class: 'gr-f' }, [h('label', { for: id, text: label }), control]); }
function stripId(e) { var o = dict(); Object.keys(e).forEach(function (k) { if (k !== 'id') o[k] = e[k]; }); return o; }
function two(n) { return (n < 10 ? '0' : '') + n; }
function ymd(y, m, d) { return ('000' + y).slice(-4) + '-' + two(m) + '-' + two(d); }
function localDate() { var d = new Date(); return ymd(d.getFullYear(), d.getMonth() + 1, d.getDate()); }
function shiftDate(s, delta) {
  var n = dayNumber(s);
  if (n !== n) return s;
  var d = new Date((n + delta) * 86400000), y = d.getUTCFullYear();
  return y < 1 || y > 9999 ? s : ymd(y, d.getUTCMonth() + 1, d.getUTCDate());
}
function shorten(s, n) { s = String(s).replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

/* ---------- date de bază ---------- */
function buildBase() {
  var keys = typeof DATA === 'undefined' ? [] : Object.keys(DATA).sort();
  ALL = keys.map(function (k) { var e = Object.assign({}, DATA[k]); e.id = k; return e; });
  COUNTY_LIST = typeof COUNTIES === 'undefined' || !COUNTIES.counties ? [] : COUNTIES.counties.slice().sort(function (a, b) { return a.row - b.row || a.col - b.col; });
  COUNTY_NAME = dict();
  COUNTY_LIST.forEach(function (c) { COUNTY_NAME[c.code] = c.name; });
}
function allItems() { return ALL.concat(S.own); }
function reindex() {
  var all = allItems();
  INDEX = buildIndex(all, COUNTY_NAME);
  TAKEN = dict();
  all.forEach(function (e) { TAKEN[e.id] = true; });
}
function isOwn(e) { return S.own.some(function (x) { return x.id === e.id; }); }
function langLabel(code) { return ENDONYM[code] ? ENDONYM[code] + ' (' + code + ')' : code; }
function langAttr(code) { return /^[a-z]{2,3}$/.test(code) ? code : null; }
function regionLabel(r) { return plain(r) === UNLOCATED ? cur.L.t('s_unlocated') : r; }
function usedLangs() {
  var seen = dict(), out = [];
  allItems().forEach(function (e) { if (!seen[e.lang]) { seen[e.lang] = 1; out.push(e.lang); } });
  return out.sort();
}
function issueMsg(code) {
  var L = cur.L, p = { text: LIMITS.text, region: LIMITS.region, translations: LIMITS.translations, notes: LIMITS.notes, collector: LIMITS.collector, source: LIMITS.source };
  return ISSUE_CODES.indexOf(code) < 0 ? L.t('issue_other') : L.f('issue_' + code, p[code]);
}
function pct(x) { return Math.floor(x * 100); }

/* ---------- starea salvată ---------- */
function defaultLast() { return { type: 'proverb', lang: 'ro', region: '', county: '', source: '', source_url: '', license: '', consent: '', collector: '', status: 'draft', reviewed_by: '' }; }
function cleanOwn(o) {
  if (!isObj(o) || typeof o.id !== 'string' || !ID_RE.test(o.id) || o.id.length > 90) return null;
  var e = stripId(o);
  if (validateItem(e).length) return null;
  var c = canonicalItem(e);
  c.id = o.id;
  return c;
}
function loadState() {
  var s = { own: [], last: defaultLast() }, raw = null;
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { raw = null; }
  if (!isObj(raw)) return s;
  if (Array.isArray(raw.own)) raw.own.forEach(function (o) {
    var c = cleanOwn(o);
    if (c && s.own.length < LIMITS.own && !s.own.some(function (x) { return x.id === c.id; })) s.own.push(c);
  });
  if (isObj(raw.last)) Object.keys(s.last).forEach(function (k) { if (typeof raw.last[k] === 'string' && raw.last[k].length <= 500) s.last[k] = raw.last[k]; });
  return s;
}
function saveNow() {
  clearTimeout(saveTimer); saveTimer = 0;
  try {
    var text = JSON.stringify({ v: 1, own: S.own, last: S.last });
    if (text.length > MAX_STORE_CHARS) { flash(cur.L ? cur.L.t('e_quota') : ''); return false; }
    localStorage.setItem(STORE_KEY, text);
    return true;
  } catch (e) { flash(cur.L ? cur.L.t('e_quota') : ''); return false; }
}

/* ---------- ciorna din formular ---------- */
function fit(v, n) { return typeof v === 'string' && v.length <= n ? v : ''; }
function newDraft() {
  var l = S.last;
  return { type: TYPES.indexOf(l.type) >= 0 ? l.type : 'proverb', lang: /^[a-z]{2,3}$/.test(l.lang) ? l.lang : 'ro', text: '', region: fit(l.region, LIMITS.region), county: COUNTY_NAME[l.county] ? l.county : '', translations: '', answer: '', purpose: '', notes: '',
    source: fit(l.source, LIMITS.source), source_url: fit(l.source_url, LIMITS.url), license: LICENSES.indexOf(l.license) >= 0 ? l.license : '', consent: CONSENTS.indexOf(l.consent) >= 0 ? l.consent : '', collector: fit(l.collector, LIMITS.collector),
    status: STATUSES.indexOf(l.status) >= 0 ? l.status : 'draft', reviewed_by: fit(l.reviewed_by, LIMITS.reviewed_by), bulk: '', bulkLang: 'en' };
}
function draftOf() { return V.draft || (V.draft = newDraft()); }
// întoarce {item, trErrors}: câmpurile ciornei, în forma unei intrări (fără câmpuri goale)
function draftItem(d, text) {
  var e = { type: d.type, lang: d.lang.trim(), text: text === undefined ? d.text.trim() : text, region: d.region.trim() || UNLOCATED, source: d.source.trim() };
  if (d.county) e.county = d.county;
  if (d.type === 'riddle' && d.answer.trim()) e.answer = d.answer.trim();
  if (d.type === 'charm' && d.purpose.trim()) e.purpose = d.purpose.trim();
  if (d.notes.trim()) e.notes = d.notes.trim();
  if (d.collector.trim()) e.collector = d.collector.trim();
  if (d.consent) e.consent = d.consent;
  if (d.source_url.trim()) e.source_url = d.source_url.trim();
  if (d.license) e.license = d.license;
  e.status = d.status;
  if (d.status === 'reviewed' && d.reviewed_by.trim()) e.reviewed_by = d.reviewed_by.trim();
  return e;
}
function withTranslations(e, d) {
  if (d.translations.trim()) {
    var p = parseTranslations(d.translations);
    e.translations = p.errors.length ? {} : p.map;   // {} = invalid: validateItem() raises «translations»
  }
  return e;
}
function remember(d) {
  S.last = { type: d.type, lang: d.lang.trim(), region: d.region.trim(), county: d.county, source: d.source.trim(), source_url: d.source_url.trim(), license: d.license, consent: d.consent, collector: d.collector.trim(), status: d.status, reviewed_by: d.reviewed_by.trim() };
}
// intrările puse deja în S.own în operația curentă (fresh: {id: true}); dacă browserul nu le poate păstra, ies din listă
function commit(fresh) {
  if (saveNow()) return true;
  S.own = S.own.filter(function (x) { return !fresh[x.id]; });
  return false;
}
function addOwn(e) {
  if (S.own.length >= LIMITS.own) { flash(cur.L.f('a_full', LIMITS.own)); return null; }
  var o = canonicalItem(e);
  o.id = uniqueId(o.lang, o.text, TAKEN);
  S.own.push(o);
  if (!saveNow()) { S.own.pop(); return null; }
  TAKEN[o.id] = true;
  return o;
}

/* ---------- Căutare ---------- */
function itemNode(e, L, openAns) {
  var la = langAttr(e.lang), li = h('li', { class: 'gr-item' + (isOwn(e) ? ' gr-yours' : ''), id: 'gr-i-' + e.id });
  var meta = [h('span', { class: 'gr-badge gr-type', text: L.t('t_' + e.type) }), h('span', { text: langLabel(e.lang) }),
    h('span', { text: regionLabel(e.region) + (e.county && COUNTY_NAME[e.county] ? ' · ' + COUNTY_NAME[e.county] : '') })];
  var st = e.status || 'draft';
  meta.push(h('span', { class: 'gr-badge gr-st-' + st, text: L.t('st_' + st) + (st === 'reviewed' && e.reviewed_by ? ' · ' + e.reviewed_by : '') }));
  if (isOwn(e)) meta.push(h('span', { class: 'gr-badge gr-own', text: L.t('s_yours') }));
  li.appendChild(h('p', { class: 'gr-meta' }, meta.reduce(function (acc, m, i) { if (i) acc.push(' · '); acc.push(m); return acc; }, [])));
  li.appendChild(h('p', { class: 'gr-text', lang: la, text: e.text }));
  if (e.type === 'riddle' && e.answer) {
    var ans = h('p', { class: 'gr-ans', id: 'gr-ans-' + e.id, hidden: !V.reveal[e.id] && !openAns }, [h('b', { text: L.t('s_answer') + ': ' }), h('span', { lang: la, text: e.answer })]);
    var btn = h('button', { type: 'button', class: 'btn gr-reveal', 'aria-expanded': ans.hidden ? 'false' : 'true', 'aria-controls': ans.id, text: ans.hidden ? L.t('s_reveal') : L.t('s_hide') });
    btn.addEventListener('click', function () {
      var show = ans.hidden;
      ans.hidden = !show;
      V.reveal[e.id] = show;
      btn.setAttribute('aria-expanded', show ? 'true' : 'false');
      btn.textContent = show ? L.t('s_hide') : L.t('s_reveal');
    });
    li.appendChild(btn);
    li.appendChild(ans);
  }
  if (e.type === 'charm') {
    if (e.purpose) li.appendChild(h('p', { class: 'gr-purpose' }, [h('b', { text: L.t('s_purpose') + ': ' }), e.purpose]));
    li.appendChild(h('p', { class: 'gr-note', text: L.t('s_charm_note') }));
  }
  var tl = Object.keys(e.translations || {}).sort(function (a, b) { return (a === L.lang ? -1 : 0) - (b === L.lang ? -1 : 0) || (a < b ? -1 : a > b ? 1 : 0); });
  tl.forEach(function (k) { li.appendChild(h('p', { class: 'gr-tr' }, [h('b', { text: L.t('s_tr') + ' (' + k + '): ' }), h('span', { lang: langAttr(k), text: e.translations[k] })])); });
  if (e.notes) li.appendChild(h('p', { class: 'gr-notes' }, [h('b', { text: L.t('s_notes') + ': ' }), e.notes]));
  var src = h('p', { class: 'gr-src' }, [L.t('s_src') + ': ']);
  if (isUrl(e.source_url)) src.appendChild(h('a', { href: e.source_url, target: '_blank', rel: 'noopener noreferrer' }, [e.source, h('span', { class: 'gr-sr', text: ' ' + L.t('s_newtab') })]));
  else src.appendChild(document.createTextNode(e.source));
  if (e.license) src.appendChild(document.createTextNode(' · ' + L.t('s_lic') + ': ' + e.license));
  if (e.consent) src.appendChild(document.createTextNode(' · ' + L.t('s_consent') + ': ' + L.t('cn_' + e.consent)));
  if (e.collector) src.appendChild(document.createTextNode(' · ' + L.f('s_by', e.collector)));
  li.appendChild(src);
  return li;
}
function renderResults() {
  var box = V.res, L = cur.L;
  if (!box) return;
  box.textContent = '';
  var hits = search(INDEX, V.q, { type: V.type, lang: V.lang, region: V.region, county: V.county, minStatus: V.minStatus }), shown = Math.min(hits.length, V.shown);
  box.appendChild(h('p', { class: 'gr-count', id: 'gr-count', role: 'status', text: hits.length ? L.f('s_count', hits.length) : L.t('s_none') }));
  if (!hits.length) return;
  var ul = h('ul', { class: 'gr-list', id: 'gr-list' });
  hits.slice(0, shown).forEach(function (x) { ul.appendChild(itemNode(x.e, L, false)); });
  box.appendChild(ul);
  if (hits.length > shown) box.appendChild(h('button', { type: 'button', class: 'btn', id: 'gr-more', text: L.f('s_more', hits.length - shown), onclick: function () {
    var first = hits[shown].e.id;
    V.shown += PAGE; renderResults(); V.focus = 'gr-i-' + first; refocus();
  } }));
}
function refocus() {
  if (!V.focus) return;
  var f = document.getElementById(V.focus);
  if (f) { if (!/^(button|input|select|textarea|a)$/i.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus(); }
  V.focus = '';
}
function selectOf(id, options, value, onchange) {
  var s = h('select', { id: id, class: 'sel gr-inp' }, options.map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
  s.value = value;
  if (s.value !== value) s.selectedIndex = 0;
  s.addEventListener('change', function () { onchange(s.value); });
  return s;
}
function panelSearch(L) {
  var box = h('div', { class: 'gr-box' });
  var q = h('input', { type: 'text', id: 'gr-q', class: 'gr-inp', autocomplete: 'off', spellcheck: 'false', maxlength: '100', value: V.q });
  q.addEventListener('input', function () { V.q = q.value; V.shown = PAGE; renderResults(); });
  var upd = function (k) { return function (v) { V[k] = v; V.shown = PAGE; renderResults(); }; };
  var types = [['all', L.t('s_all_types')]].concat(TYPES.map(function (t) { return [t, L.t('t_' + t)]; }));
  var langs = [['all', L.t('s_all_langs')]].concat(usedLangs().map(function (c) { return [c, langLabel(c)]; }));
  var regions = [['all', L.t('s_all_regions')]].concat(regionList(allItems()).map(function (r) { return [r, regionLabel(r)]; }));
  if (!langs.some(function (o) { return o[0] === V.lang; })) V.lang = 'all';
  if (!regions.some(function (o) { return o[0] === V.region; })) V.region = 'all';
  var counties = [['', L.t('s_all_counties')]].concat(COUNTY_LIST.map(function (c) { return [c.code, c.name]; }));
  var stat = [['any', L.t('s_st_any')], ['sourced', L.t('s_st_sourced')], ['reviewed', L.t('s_st_reviewed')]];
  box.appendChild(h('div', { class: 'gr-bar' }, [
    field(L.t('s_q_l'), q, 'gr-q'),
    field(L.t('s_type_l'), selectOf('gr-ftype', types, V.type, upd('type')), 'gr-ftype'),
    field(L.t('s_lang_l'), selectOf('gr-flang', langs, V.lang, upd('lang')), 'gr-flang'),
    field(L.t('s_region_l'), selectOf('gr-fregion', regions, V.region, upd('region')), 'gr-fregion'),
    field(L.t('s_county_l'), selectOf('gr-fcounty', counties, V.county, upd('county')), 'gr-fcounty'),
    field(L.t('s_status_l'), selectOf('gr-fstatus', stat, V.minStatus, upd('minStatus')), 'gr-fstatus')
  ]));
  V.res = h('div', { class: 'gr-res', id: 'gr-results' });
  box.appendChild(V.res);
  renderResults();
  return box;
}

/* ---------- Proverbul zilei ---------- */
function renderToday() {
  var box = V.potd, L = cur.L;
  if (!box) return;
  box.textContent = '';
  var e = potdPick(ALL, V.date);   // doar colecția din pagină: intrările tale nu schimbă proverbul zilei
  if (!e) { box.appendChild(h('p', { class: 'gr-empty', text: L.t('d_none') })); return; }
  box.appendChild(h('ul', { class: 'gr-list gr-potd' }, [itemNode(e, L, false)]));
}
function panelToday(L) {
  var box = h('div', { class: 'gr-box' });
  if (!V.date) V.date = localDate();
  var date = h('input', { type: 'date', id: 'gr-date', class: 'gr-inp', min: '1900-01-01', max: '2999-12-31', value: V.date, 'aria-describedby': 'gr-date-h' });
  var go = function (s) {
    if (dayNumber(s) !== dayNumber(s)) { flash(L.t('d_bad')); return; }
    flash('');
    V.date = s; date.value = s; renderToday();
  };
  date.addEventListener('change', function () { go(date.value); });
  box.appendChild(h('div', { class: 'gr-bar' }, [
    field(L.t('d_date_l'), date, 'gr-date'),
    h('button', { type: 'button', class: 'btn', id: 'gr-prev', text: L.t('d_prev'), onclick: function () { go(shiftDate(V.date, -1)); } }),
    h('button', { type: 'button', class: 'btn', id: 'gr-today', text: L.t('d_today'), onclick: function () { go(localDate()); } }),
    h('button', { type: 'button', class: 'btn', id: 'gr-next', text: L.t('d_next'), onclick: function () { go(shiftDate(V.date, 1)); } })
  ]));
  box.appendChild(h('p', { class: 'gr-hint', id: 'gr-date-h', text: L.t('d_hint') }));
  V.potd = h('div', { class: 'gr-res', id: 'gr-potd' });
  box.appendChild(V.potd);
  box.appendChild(h('p', { class: 'gr-hint', text: L.t('d_note') }));
  renderToday();
  return box;
}

/* ---------- Harta schematică ---------- */
function density(n) { return n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 9 ? 3 : 4; }
function panelMap(L) {
  var box = h('div', { class: 'gr-box' }), items = allItems(), counts = countByCounty(items), located = 0;
  Object.keys(counts).forEach(function (k) { located += counts[k]; });
  box.appendChild(h('h3', { text: L.t('m_h') }));
  box.appendChild(h('p', { class: 'gr-hint', text: L.t('m_note') }));
  box.appendChild(h('p', { class: 'gr-hint', text: L.t('m_help') }));
  box.appendChild(h('p', { class: 'gr-hint', id: 'gr-nocounty', text: L.f('m_nocounty', items.length - located, items.length) }));
  if (V.county) {
    box.appendChild(h('p', { class: 'gr-sel', text: L.f('m_sel', COUNTY_NAME[V.county] || V.county) }));
    box.appendChild(h('button', { type: 'button', class: 'btn', id: 'gr-allc', text: L.t('m_all'), onclick: function () { V.focus = 'gr-t-' + V.county; V.county = ''; V.shown = PAGE; render(); } }));
  }
  var grid = h('div', { class: 'gr-grid', id: 'gr-grid' });
  COUNTY_LIST.forEach(function (c) {
    var n = counts[c.code] || 0, on = V.county === c.code;
    grid.appendChild(h('button', {
      type: 'button', id: 'gr-t-' + c.code, class: 'gr-tile gr-c' + c.col + ' gr-r' + c.row + ' gr-d' + density(n) + (on ? ' gr-on' : ''), 'aria-pressed': on ? 'true' : 'false',
      onclick: function () {
        if (on) { V.county = ''; V.focus = 'gr-t-' + c.code; render(); return; }
        V.county = c.code; V.shown = PAGE; gotoTab('search', 'gr-results');
      }
    }, [
      h('span', { class: 'gr-tc', text: c.code.slice(3) }),
      h('span', { class: 'gr-tn', text: c.name }),
      h('span', { class: 'gr-tk', 'aria-hidden': 'true', text: String(n) }),
      h('span', { class: 'gr-sr', text: ' ' + L.f('m_cnt', n) })
    ]));
  });
  box.appendChild(grid);
  return box;
}

/* ---------- Adăugare ---------- */
function staleCheck() { if (V.chk) V.chk.textContent = ''; V.confirm = ''; }
function inp(id, key, opt) {
  var o = opt || {}, d = draftOf();
  var e = h(o.area ? 'textarea' : 'input', { id: id, class: 'gr-inp', maxlength: o.max, rows: o.area ? (o.rows || 3) : null, type: o.area ? null : 'text', autocomplete: 'off', spellcheck: o.spell ? 'true' : 'false', list: o.list, lang: o.lang, value: o.area ? null : d[key] });
  if (o.area) e.value = d[key];
  e.addEventListener('input', function () { draftOf()[key] = e.value; staleCheck(); });
  return e;
}
function sel(id, key, options, after) {
  var d = draftOf(), s = selectOf(id, options, d[key], function (v) { draftOf()[key] = v; staleCheck(); if (after) after(); });
  return s;
}
function checkDraft() {
  var d = draftOf(), e = withTranslations(draftItem(d), d), issues = validateItem(e).map(issueMsg), dups = issues.length ? [] : findDuplicates(allItems(), e);
  return { item: e, issues: issues, dups: dups };
}
function showCheck(r, canAny) {
  var L = cur.L, box = V.chk;
  if (!box) return;
  box.textContent = '';
  if (r.issues.length) {
    box.appendChild(h('p', { class: 'gr-bad', text: L.t('a_issues') }));
    box.appendChild(h('ul', { class: 'gr-lines' }, r.issues.map(function (m) { return h('li', { text: m }); })));
    return;
  }
  if (!r.dups.length) { box.appendChild(h('p', { class: 'gr-ok', text: L.t('check_ok') })); return; }
  box.appendChild(h('ul', { class: 'gr-lines' }, r.dups.map(function (x) {
    return h('li', { text: x.exact ? L.f('dup_exact', shorten(x.e.text, 90)) : L.f('dup_near', shorten(x.e.text, 90), pct(x.score)) });
  })));
  if (!r.dups.some(function (x) { return x.exact; })) {
    box.appendChild(h('p', { class: 'gr-hint', text: L.t('dup_hint') }));
    if (canAny) box.appendChild(h('button', { type: 'button', class: 'btn', id: 'gr-add-any', text: L.t('a_add_any'), onclick: function () { doAdd(true); } }));
  }
}
function doAdd(force) {
  var L = cur.L, d = draftOf(), r = checkDraft();
  showCheck(r, !force);
  if (r.issues.length) return;
  if (r.dups.some(function (x) { return x.exact; })) return;
  if (r.dups.length && !force) return;
  remember(d);
  var o = addOwn(r.item);
  if (!o) return;
  reindex();
  V.draft = newDraft();
  V.focus = 'gr-a-text';
  render();
  flash(L.f('a_added', S.own.length));
}
function bulkAdd() {
  var L = cur.L, d = draftOf(), raw = String(d.bulk).split('\n'), p = parsePaste(d.bulk), added = 0, skipped = 0, lines = [], seen = dict(), fresh = dict(), keep = dict(), tcode = d.bulkLang.trim();
  p.errors.forEach(function (x) {
    skipped++;
    lines.push(L.f('b_line', x.line, L.t(x.code === 'many' ? 'b_e_many' : x.code === 'translation' ? 'b_e_translation' : 'b_e_text')));
    for (var j = x.line - 1; j < (x.code === 'many' ? raw.length : x.line); j++) keep[j] = true;
  });
  p.items.forEach(function (it) {
    var e = draftItem(d, it.text), key = e.lang + '|' + plain(e.text), why = '';
    if (it.translation) {
      e.translations = {};   // {} nu e valid: validateItem() ridică «translations» dacă nu avem un cod de limbă bun
      if (langOk(tcode)) e.translations[tcode] = it.translation;
    }
    var bad = validateItem(e);
    if (bad.length) why = issueMsg(bad[0]);
    else if (seen[key] || findDuplicates(allItems(), e).some(function (x) { return x.exact; })) why = L.t('b_e_dup');
    else if (S.own.length >= LIMITS.own) why = L.f('a_full', LIMITS.own);
    if (why) { skipped++; keep[it.line - 1] = true; lines.push(L.f('b_line', it.line, why)); return; }
    var o = canonicalItem(e);
    o.id = uniqueId(o.lang, o.text, TAKEN);
    S.own.push(o); TAKEN[o.id] = true; seen[key] = true; fresh[o.id] = true; added++;
  });
  var stored = true;
  if (added) {
    stored = commit(fresh);
    if (stored) remember(d);
    reindex();
  }
  // rândurile respinse rămân în casetă, ca să le poți corecta și trimite din nou; la o scriere eșuată rămâne tot
  if (stored) d.bulk = raw.filter(function (x, i) { return keep[i]; }).join('\n');
  V.focus = 'gr-b-ta';
  render();
  if (!stored) { flash(L.t('e_quota')); return; }
  flash(L.f('b_done', added, skipped), lines.slice(0, MAX_LINES_SHOWN));
}
function langOk(c) { return /^[a-z]{2,3}$/.test(c); }
function ownList(L) {
  var box = h('div', { class: 'gr-own-box' });
  box.appendChild(h('h3', { id: 'gr-own-h', text: L.f('a_own_h', S.own.length) }));
  if (!S.own.length) { box.appendChild(h('p', { class: 'gr-empty', text: L.t('a_own_none') })); return box; }
  var ul = h('ul', { class: 'gr-custom' });
  S.own.forEach(function (o) {
    var sure = V.confirm === 'rm:' + o.id, name = shorten(o.text, 70);
    ul.appendChild(h('li', null, [
      h('span', { class: 'gr-cid', text: o.id }), h('span', { class: 'gr-cmeta', text: ' · ' + L.t('t_' + o.type) + ' · ' + name }), h('br'),
      h('button', {
        type: 'button', class: 'btn', id: 'gr-rm-' + o.id, 'aria-label': sure ? null : L.f('a_remove_l', o.id), text: sure ? L.t('a_remove_sure') : L.t('a_remove'),
        onclick: function () {
          if (!sure) { V.confirm = 'rm:' + o.id; V.focus = 'gr-rm-' + o.id; render(); return; }
          S.own = S.own.filter(function (x) { return x.id !== o.id; });
          saveNow(); reindex(); V.confirm = ''; V.focus = 'gr-own-h'; render(); flash(L.t('a_removed'));
        }
      })
    ]));
  });
  box.appendChild(ul);
  var all = V.confirm === 'all';
  box.appendChild(h('button', {
    type: 'button', class: 'btn', id: 'gr-clear', text: all ? L.f('a_clear_sure', S.own.length) : L.t('a_clear_all'),
    onclick: function () {
      if (!all) { V.confirm = 'all'; V.focus = 'gr-clear'; render(); return; }
      S.own = []; saveNow(); reindex(); V.confirm = ''; V.focus = 'gr-own-h'; render(); flash(L.t('a_cleared'));
    }
  }));
  return box;
}
function panelAdd(L) {
  var d = draftOf(), box = h('div', { class: 'gr-box' });
  box.appendChild(h('h3', { text: L.t('a_h') }));
  box.appendChild(h('p', { class: 'gr-hint', text: L.t('a_intro') }));
  var again = function (id) { return function () { V.focus = id; render(); }; };
  var typeOpts = TYPES.map(function (t) { return [t, L.t('t_' + t)]; });
  var consentOpts = [['', L.t('a_none')]].concat(CONSENTS.map(function (c) { return [c, L.t('cn_' + c)]; }));
  var licOpts = [['', L.t('a_lic_def')], ['public-domain', 'public-domain'], ['CC0-1.0', 'CC0-1.0'], ['CC-BY-SA-4.0', 'CC-BY-SA-4.0']];
  var statOpts = STATUSES.map(function (s) { return [s, L.t('st_' + s)]; });
  var countyOpts = [['', L.t('a_none')]].concat(COUNTY_LIST.map(function (c) { return [c.code, c.name]; }));
  var form = h('form', { class: 'gr-form', id: 'gr-form', novalidate: 'novalidate' });
  form.addEventListener('submit', function (ev) { ev.preventDefault(); doAdd(false); });
  form.appendChild(h('div', { class: 'gr-bar' }, [
    field(L.t('s_type_l'), sel('gr-a-type', 'type', typeOpts, again('gr-a-type')), 'gr-a-type'),
    field(L.t('a_lang_l'), inp('gr-a-lang', 'lang', { max: 3 }), 'gr-a-lang')
  ]));
  form.appendChild(field(L.t('a_text_l'), inp('gr-a-text', 'text', { area: true, rows: 4, max: LIMITS.text, spell: true }), 'gr-a-text'));
  if (d.type === 'riddle') form.appendChild(field(L.t('a_answer_l'), inp('gr-a-answer', 'answer', { max: LIMITS.answer }), 'gr-a-answer'));
  if (d.type === 'charm') form.appendChild(field(L.t('a_purpose_l'), inp('gr-a-purpose', 'purpose', { max: LIMITS.purpose }), 'gr-a-purpose'));
  form.appendChild(field(L.t('a_source_l'), inp('gr-a-source', 'source', { max: LIMITS.source }), 'gr-a-source'));
  form.appendChild(field(L.t('a_consent_l'), sel('gr-a-consent', 'consent', consentOpts), 'gr-a-consent'));
  var regions = regionList(allItems()).filter(function (r) { return plain(r) !== UNLOCATED; });
  HISTORIC.forEach(function (r) { if (regions.indexOf(r) < 0) regions.push(r); });
  var more = h('details', { class: 'gr-more', id: 'gr-more-d', open: V.more });
  more.addEventListener('toggle', function () { V.more = more.open; });
  more.appendChild(h('summary', { text: L.t('a_more') }));
  more.appendChild(h('datalist', { id: 'gr-regions' }, regions.map(function (r) { return h('option', { value: r }); })));
  more.appendChild(field(L.t('a_region_l'), inp('gr-a-region', 'region', { max: LIMITS.region, list: 'gr-regions' }), 'gr-a-region'));
  more.appendChild(field(L.t('a_county_l'), sel('gr-a-county', 'county', countyOpts), 'gr-a-county'));
  more.appendChild(field(L.t('a_tr_l'), inp('gr-a-tr', 'translations', { area: true, rows: 3, max: 4000, spell: true }), 'gr-a-tr'));
  more.appendChild(field(L.t('a_notes_l'), inp('gr-a-notes', 'notes', { area: true, rows: 2, max: LIMITS.notes }), 'gr-a-notes'));
  more.appendChild(field(L.t('a_url_l'), inp('gr-a-url', 'source_url', { max: LIMITS.url }), 'gr-a-url'));
  more.appendChild(field(L.t('a_lic_l'), sel('gr-a-lic', 'license', licOpts), 'gr-a-lic'));
  more.appendChild(field(L.t('a_collector_l'), inp('gr-a-collector', 'collector', { max: LIMITS.collector }), 'gr-a-collector'));
  more.appendChild(field(L.t('s_status_l'), sel('gr-a-status', 'status', statOpts, again('gr-a-status')), 'gr-a-status'));
  if (d.status === 'reviewed') more.appendChild(field(L.t('a_rev_l'), inp('gr-a-rev', 'reviewed_by', { max: LIMITS.reviewed_by }), 'gr-a-rev'));
  form.appendChild(more);
  V.chk = h('div', { class: 'gr-chk', id: 'gr-chk', role: 'status', 'aria-live': 'polite' });
  form.appendChild(h('div', { class: 'gr-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'gr-check', text: L.t('a_check'), onclick: function () { showCheck(checkDraft(), true); } }),
    h('button', { type: 'submit', class: 'btn pri', id: 'gr-add', text: L.t('a_add') }),
    h('button', { type: 'button', class: 'btn', id: 'gr-reset', text: L.t('a_reset'), onclick: function () { V.draft = newDraft(); V.draft.text = ''; V.focus = 'gr-a-text'; render(); } })
  ]));
  form.appendChild(V.chk);
  box.appendChild(form);
  box.appendChild(h('h3', { text: L.t('b_h') }));
  box.appendChild(h('p', { class: 'gr-hint', text: L.f('b_help', LIMITS.bulk) }));
  var ta = h('textarea', { id: 'gr-b-ta', class: 'gr-inp', rows: '5', spellcheck: 'false' });
  ta.value = d.bulk;
  ta.addEventListener('input', function () { draftOf().bulk = ta.value; });
  var bl = h('input', { type: 'text', id: 'gr-b-lang', class: 'gr-inp', maxlength: '3', autocomplete: 'off', value: d.bulkLang });
  bl.addEventListener('input', function () { draftOf().bulkLang = bl.value; });
  box.appendChild(field(L.t('b_ta_l'), ta, 'gr-b-ta'));
  box.appendChild(h('div', { class: 'gr-bar' }, [field(L.t('b_trl_l'), bl, 'gr-b-lang'), h('button', { type: 'button', class: 'btn', id: 'gr-b-go', text: L.t('b_go'), onclick: bulkAdd })]));
  box.appendChild(ownList(L));
  return box;
}

/* ---------- Export, import, duplicate ---------- */
function importText(text) {
  var L = cur.L, r = parseBundle(text), lines = [], added = 0, skipped = 0, full = false, fresh = dict();
  if (r.errors.length && r.errors[0].index === 0) {
    var c = r.errors[0].codes[0];
    flash(c === 'many' ? L.f('e_many', LIMITS.bundle) : L.t(c === 'format' ? 'e_format' : 'e_json'));
    return;
  }
  r.errors.slice(0, MAX_LINES_SHOWN).forEach(function (x) { lines.push(L.f('i_bad', x.index, x.codes.map(issueMsg).join(' '))); });
  r.entries.forEach(function (e) {
    if (S.own.length >= LIMITS.own) { if (!full) { full = true; lines.push(L.f('a_full', LIMITS.own)); } return; }
    if (findDuplicates(allItems(), e).some(function (x) { return x.exact; })) { skipped++; return; }
    var o = canonicalItem(e);
    o.id = uniqueId(o.lang, o.text, TAKEN);
    S.own.push(o); TAKEN[o.id] = true; fresh[o.id] = true; added++;
  });
  var stored = true;
  if (added) { stored = commit(fresh); reindex(); }
  V.focus = 'gr-x-file';
  render();
  if (!stored) { flash(L.t('e_quota')); return; }
  flash(L.f('i_ok', added, skipped), lines);
}
function panelExport(L) {
  var box = h('div', { class: 'gr-box' });
  box.appendChild(h('h3', { text: L.t('x_h') }));
  var scope = selectOf('gr-x-scope', [['all', L.t('x_all')], ['own', L.t('x_own')]], V.xscope, function (v) { V.xscope = v; });
  box.appendChild(h('div', { class: 'gr-bar' }, [field(L.t('x_scope_l'), scope, 'gr-x-scope')]));
  var day = localDate();
  box.appendChild(h('div', { class: 'gr-bar' }, [
    h('button', { type: 'button', class: 'btn pri', id: 'gr-x-json', text: L.t('x_json'), onclick: function () {
      if (!S.own.length) { flash(L.t('x_none')); return; }
      var name = 'graiul-contribution-' + day + '.json';
      if (downloadText(name, makeBundle(S.own), 'application/json')) flash(L.f('x_done', name));
    } }),
    h('button', { type: 'button', class: 'btn', id: 'gr-x-tsv', text: L.t('x_tsv'), onclick: function () {
      var list = V.xscope === 'own' ? S.own : allItems();
      if (!list.length) { flash(L.t('x_none')); return; }
      var name = 'graiul-' + (V.xscope === 'own' ? 'own' : 'all') + '-' + day + '.tsv';
      if (downloadText(name, '\ufeff' + toTSV(list), 'text/tab-separated-values')) flash(L.f('x_done', name));
    } })
  ]));
  var file = h('input', { type: 'file', id: 'gr-x-file', class: 'gr-file', accept: '.json,application/json' });
  file.addEventListener('change', function () { var f = file.files && file.files[0]; if (f) readText(f, importText); });
  box.appendChild(h('div', { class: 'gr-bar' }, [file, h('label', { class: 'btn gr-filelab', for: 'gr-x-file', text: L.t('x_import_l') })]));
  box.appendChild(h('h3', { text: L.t('x_dup_h') }));
  var out = h('div', { class: 'gr-dup', id: 'gr-dup', role: 'status', 'aria-live': 'polite' });
  box.appendChild(h('button', { type: 'button', class: 'btn', id: 'gr-dup-go', text: L.t('x_dup_go'), onclick: function () {
    var pairs = duplicates(allItems());
    out.textContent = '';
    if (!pairs.length) { out.appendChild(h('p', { text: L.t('x_dup_none') })); return; }
    out.appendChild(h('p', { text: L.f('x_dup_found', pairs.length) }));
    out.appendChild(h('ul', { class: 'gr-lines' }, pairs.slice(0, MAX_PAIRS_SHOWN).map(function (x) { return h('li', { text: L.f('x_dup_pair', x.a.id, x.b.id, pct(x.score)) }); })));
    if (pairs.length > MAX_PAIRS_SHOWN) out.appendChild(h('p', { text: L.f('x_dup_more', pairs.length - MAX_PAIRS_SHOWN) }));
  } }));
  box.appendChild(out);
  return box;
}

/* ---------- Ghid ---------- */
function panelGuide(L) {
  var box = h('div', { class: 'gr-box' });
  box.appendChild(h('h3', { text: L.t('gd_h') }));
  box.appendChild(h('ol', { class: 'gr-steps' }, [1, 2, 3, 4, 5].map(function (i) { return h('li', { text: L.t('gd_' + i) }); })));
  box.appendChild(h('h3', { text: L.t('gd_eth_h') }));
  box.appendChild(h('ul', { class: 'gr-lines' }, [1, 2, 3, 4, 5].map(function (i) { return h('li', { text: L.t('gd_eth_' + i) }); })));
  box.appendChild(h('h3', { text: L.t('gd_st_h') }));
  box.appendChild(h('ul', { class: 'gr-lines' }, STATUSES.map(function (s) { return h('li', { text: L.t('gd_st_' + s) }); })));
  box.appendChild(h('h3', { text: L.t('gd_lic_h') }));
  box.appendChild(h('p', { class: 'gr-intro', text: L.t('gd_lic') }));
  box.appendChild(h('h3', { text: L.t('gd_static_h') }));
  box.appendChild(h('p', { class: 'gr-intro', text: L.t('gd_static') }));
  return box;
}

/* ---------- file și desenare ---------- */
var PANELS = { search: panelSearch, today: panelToday, map: panelMap, add: panelAdd, export: panelExport, guide: panelGuide };
function gotoTab(id, focusId) {
  V.tab = id; V.focus = focusId || ''; V.confirm = ''; render();
}
function tabsBar() {
  var L = cur.L, bar = h('div', { class: 'gr-tabs', role: 'tablist', 'aria-label': L.t('nav') });
  TABS.forEach(function (id, i) {
    var on = id === V.tab;
    bar.appendChild(h('button', {
      type: 'button', class: 'btn gr-tab' + (on ? ' pri' : ''), role: 'tab', id: 'gr-tt-' + id, 'aria-selected': on ? 'true' : 'false', 'aria-controls': 'gr-p-' + id, tabindex: on ? '0' : '-1', text: L.t('tab_' + id),
      onclick: function () { gotoTab(id, 'gr-tt-' + id); },
      onkeydown: function (ev) {
        var j = null;
        if (ev.key === 'ArrowRight') j = i + 1; else if (ev.key === 'ArrowLeft') j = i - 1; else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = TABS.length - 1;
        if (j === null) return;
        ev.preventDefault();
        j = (j + TABS.length) % TABS.length;
        gotoTab(TABS[j], 'gr-tt-' + TABS[j]);
      }
    }));
  });
  return bar;
}
function render() {
  var main = V.main, L = cur.L;
  if (!main) return;
  // «toggle» al lui <details> vine asincron: starea reală se citește din pagină chiar înainte s-o înlocuim
  var det = document.getElementById('gr-more-d');
  if (det) V.more = det.open;
  main.textContent = '';
  var root = h('div', { class: 'gr-root' });
  root.appendChild(tabsBar());
  TABS.forEach(function (id) {
    var p = h('div', { class: 'gr-panel', role: 'tabpanel', id: 'gr-p-' + id, 'aria-labelledby': 'gr-tt-' + id, hidden: id !== V.tab });
    if (id === V.tab) p.appendChild(PANELS[id](L));
    root.appendChild(p);
  });
  main.appendChild(root);
  refocus();
}

/* ---------- montare ---------- */
function boot() {
  if (booted) return;
  booted = true;
  buildBase();
  S = loadState();
  reindex();
}
function mount(el, lang) {
  cur.el = el; cur.lang = lang; cur.L = makeL(lang);
  boot();
  var L = cur.L, card = el.parentNode;
  if (card && card.classList) card.classList.add('in');
  el.textContent = '';
  V.live = h('div', { class: 'gr-msg', id: 'gr-live', role: 'status', 'aria-live': 'polite' });
  V.main = h('div', { class: 'gr-main' });
  el.appendChild(h('p', { class: 'gr-intro', text: L.t('intro') }));
  el.appendChild(V.live);
  el.appendChild(V.main);
  var lim = h('section', { class: 'card rv in gr-card', id: 'gr-lim-card' }, [h('h2', { id: 'gr-lim-h', text: L.t('h_limits') }), h('ul', { class: 'gr-list-lim' }, [1, 2, 3, 4, 5, 6].map(function (i) { return h('li', { text: L.t('lim_' + i) }); }))]);
  if (card && card.insertAdjacentElement) card.insertAdjacentElement('afterend', lim);
  render();
}
