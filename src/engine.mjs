// GRAIUL · motorul (logică pură, fără DOM). Sintaxă ES2017. Regulile «fold», «plain», «itemId» și similaritatea sunt aceleași ca în scripts/validate.py.
// fold · plain · itemId · uniqueId · trigrams · similarity · findDuplicates · duplicates · isUrl · validateItem · canonicalItem · buildIndex · search ·
// countByCounty · regionList · dayNumber · potdPick · toTSV · makeBundle · parseBundle · parsePaste · parseTranslations · translationsText

export const TYPES = ['proverb', 'charm', 'riddle', 'carol', 'tale', 'saying', 'lullaby'];
export const STATUSES = ['draft', 'sourced', 'reviewed'];
export const CONSENTS = ['published', 'informed', 'anonymised'];
export const LICENSES = ['MIT', 'public-domain', 'CC0-1.0', 'CC-BY-SA-4.0'];
export const COUNTY_CODES = ['RO-AB', 'RO-AR', 'RO-AG', 'RO-BC', 'RO-BH', 'RO-BN', 'RO-BT', 'RO-BV', 'RO-BR', 'RO-B', 'RO-BZ', 'RO-CS', 'RO-CL', 'RO-CJ', 'RO-CT', 'RO-CV', 'RO-DB', 'RO-DJ', 'RO-GL', 'RO-GR', 'RO-GJ', 'RO-HR', 'RO-HD', 'RO-IL', 'RO-IS', 'RO-IF', 'RO-MM', 'RO-MH', 'RO-MS', 'RO-NT', 'RO-OT', 'RO-PH', 'RO-SJ', 'RO-SM', 'RO-SB', 'RO-SV', 'RO-TR', 'RO-TM', 'RO-TL', 'RO-VS', 'RO-VL', 'RO-VN'];
export const LIMITS = { text: 20000, region: 80, answer: 300, purpose: 300, notes: 500, collector: 120, source: 300, reviewed_by: 120, translations: 12, own: 500, bulk: 200, bundle: 500, url: 500 };
export const NEAR = 0.85;
export const UNLOCATED = 'unlocated';
const KEYS = ['type', 'lang', 'text', 'region', 'county', 'translations', 'answer', 'purpose', 'notes', 'collector', 'consent', 'source', 'source_url', 'license', 'status', 'reviewed_by'];
const EXTRA = { 'đ': 'd', 'ð': 'd', 'ł': 'l', 'ø': 'o', 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ı': 'i', 'þ': 'th', 'ħ': 'h', 'ə': 'a', 'ɨ': 'i', 'ʒ': 'zh', 'ʃ': 'sh' };
const EXTRA_RE = /[đðłøßæœıþħəɨʒʃ]/g;
const PUNCT = /[\s.,;:!?"'`´‘’‚“”„«»‹›()\[\]{}<>\/\\|*_~^=+@#$%&\-–—…·•¡¿]+/g;
const CTRL_LINE = /[\u0000-\u001f\u007f]/;
const CTRL_TEXT = /[\u0000-\u0009\u000b-\u001f\u007f]/;
const LANG_RE = /^[a-z]{2,3}$/;
// adresă https:// fără spații și fără caractere de control (aceeași clasă în schema.json și în scripts/validate.py); flag «u»: lungimea în puncte de cod
const URL_RE = /^https:\/\/[^\u0000-\u0020\u007f-\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{1,500}$/u;
export const ID_RE = /^[a-z]{2,3}-[a-z0-9]+(-[a-z0-9]+)*$/;
const SRANK = { reviewed: 0, sourced: 1, draft: 2 };

function dict() { return Object.create(null); }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
// lungimea în puncte de cod (așa numără schema JSON și Python, nu unitățile UTF-16 ale lui JavaScript); -1 dacă are jumătăți de pereche
// surogat, pe care JSON le admite, dar UTF-8 nu: fișierul exportat și scripturile Python nu le-ar putea citi
function cpLen(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++, n++) {
    const c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) { const d = s.charCodeAt(i + 1); if (d >= 0xdc00 && d <= 0xdfff) i++; else return -1; }
    else if (c >= 0xdc00 && c <= 0xdfff) return -1;
  }
  return n;
}
function str(v, min, max) { if (typeof v !== 'string') return false; const n = cpLen(v); return n >= min && n <= max; }
// adresă https:// acceptată (aceeași regulă în schema.json și în scripts/validate.py); interfața face legătură doar din astfel de adrese
export function isUrl(u) { return typeof u === 'string' && cpLen(u) >= 0 && URL_RE.test(u); }
function line(v, max) { return str(v, 1, max) && !CTRL_LINE.test(v); }
function block(v, max) { return str(v, 1, max) && !CTRL_TEXT.test(v); }

/* ---------------- normalizare ---------------- */
// minuscule, fără semne diacritice combinate, câteva litere scrise cu litere latine simple
export function fold(s) {
  const t = String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(EXTRA_RE, function (c) { return EXTRA[c]; });
  return t.replace(/\s+/g, ' ').trim();
}
// ca «fold», dar și fără punctuație: cheia pentru duplicate și pentru căutare
export function plain(s) { return fold(s).replace(PUNCT, ' ').replace(/\s+/g, ' ').trim(); }
// <limbă>-<primele cuvinte, scrise simplu, cel mult 60 de caractere>; text fără litere latine: «u» + codurile primelor 6 caractere
export function itemId(lang, text) {
  const words = plain(text).replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter(Boolean);
  let slug = '';
  for (let i = 0; i < words.length; i++) {
    const next = slug ? slug + '-' + words[i] : words[i];
    if (slug && next.length > 60) break;
    slug = next.slice(0, 60);
  }
  if (!slug) slug = 'u' + Array.from(String(text).toLowerCase()).slice(0, 6).map(function (c) { return c.codePointAt(0).toString(16); }).join('-');
  return lang + '-' + slug;
}
// id unic față de cele existente: <id>, apoi -2, -3 …
export function uniqueId(lang, text, taken) {
  const base = itemId(lang, text);
  let id = base, n = 2;
  while (taken[id]) id = base + '-' + (n++);
  return id;
}

/* ---------------- duplicate ---------------- */
// trigramele unui text deja «plain», cu câte un spațiu la capete: {set: {trigramă: 1}, list: [trigrame fără repetări], size}
function trigramSet(k) {
  const cp = Array.from(' ' + k + ' '), set = dict(), list = [];
  for (let i = 0; i + 3 <= cp.length; i++) {
    const t = cp[i] + cp[i + 1] + cp[i + 2];
    if (!set[t]) { set[t] = 1; list.push(t); }
  }
  return { set: set, list: list, size: list.length };
}
export function trigrams(s) { return trigramSet(plain(s)).list.slice(); }
// «plain» și trigramele unui text, calculate o singură dată: căutarea de dubluri compară aceleași texte de multe ori (la fiecare intrare dintr-un
// fișier importat, cu toate cele din pagină), iar fără această păstrare timpul crește cu pătratul numărului de intrări înmulțit cu lungimea textelor
let memo = dict(), memoCount = 0, memoChars = 0;
const MEMO_ITEMS = 50000, MEMO_CHARS = 8000000;
function profile(text) {
  const s = String(text);
  let p = memo[s];
  if (p) return p;
  const key = plain(s), t = trigramSet(key);
  p = { key: key, set: t.set, list: t.list, size: t.size };
  if (memoCount >= MEMO_ITEMS || memoChars + s.length > MEMO_CHARS) { memo = dict(); memoCount = 0; memoChars = 0; }
  memo[s] = p; memoCount++; memoChars += s.length;
  return p;
}
// coeficientul Dice pe trigrame (2·|A∩B| / (|A|+|B|)): se parcurge mulțimea mai mică în cea mai mare. Cu «min» > 0 se renunță (întoarce 0) de îndată ce,
// chiar dacă toate trigramele rămase ar fi comune, scorul n-ar mai putea ajunge la «min»: același rezultat pentru scorurile ≥ min, mult mai puțină muncă
// pentru texte fără legătură
function diceP(a, b, min) {
  const la = a.size, lb = b.size;
  if (!la || !lb) return 0;
  const small = la <= lb ? a.list : b.list, set = la <= lb ? b.set : a.set, tot = la + lb;
  let n = 0, left = small.length;
  for (let i = 0; i < small.length; i++) {
    left--;
    if (set[small[i]]) n++;
    else if (min && 2 * (n + left) / tot < min) return 0;
  }
  return 2 * n / tot;
}
// scorul Dice dacă poate ajunge la NEAR, altfel 0. |A∩B| ≤ min(|A|, |B|), deci perechile cu mărimi foarte diferite nu se mai parcurg deloc (aceeași
// formulă ca la scor, deci aceeași rotunjire)
function nearScore(a, b) {
  if (!a.size || !b.size || 2 * Math.min(a.size, b.size) / (a.size + b.size) < NEAR) return 0;
  return diceP(a, b, NEAR);
}
// coeficientul Dice pe trigrame, 0..1
export function similarity(a, b) { return diceP(profile(a), profile(b), 0); }
// intrările din aceeași limbă identice (exact) sau foarte asemănătoare (scor ≥ NEAR) cu «e»; cele identice primele
export function findDuplicates(items, e) {
  const pe = profile(e.text), out = [];
  items.forEach(function (x) {
    if (x === e || x.lang !== e.lang) return;
    const px = profile(x.text), same = px.key === pe.key, score = same ? 1 : nearScore(pe, px);
    if (same || score >= NEAR) out.push({ e: x, exact: same, score: score });
  });
  out.sort(function (a, b) { return (b.exact ? 1 : 0) - (a.exact ? 1 : 0) || b.score - a.score || (String(a.e.id) < String(b.e.id) ? -1 : 1); });
  return out;
}
// toate perechile asemănătoare dintr-o colecție: [{a, b, exact, score}], cele identice primele
export function duplicates(items) {
  const pr = items.map(function (e) { return profile(e.text); }), out = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].lang !== items[j].lang) continue;
      const same = pr[i].key === pr[j].key, score = same ? 1 : nearScore(pr[i], pr[j]);
      if (same || score >= NEAR) out.push({ a: items[i], b: items[j], exact: same, score: score });
    }
  }
  out.sort(function (x, y) { return (y.exact ? 1 : 0) - (x.exact ? 1 : 0) || y.score - x.score; });
  return out;
}

/* ---------------- validarea unei înregistrări (oglinda schemei) ---------------- */
// întoarce o listă de coduri de eroare: object, extra, type, lang, text, region, county, translations, answer, purpose, notes, collector,
// consent, source, source_url, license, status, reviewed_by
export function validateItem(o) {
  if (!isObj(o)) return ['object'];
  const out = [];
  const bad = function (c) { if (out.indexOf(c) < 0) out.push(c); };
  Object.keys(o).forEach(function (k) { if (KEYS.indexOf(k) < 0) bad('extra'); });
  if (TYPES.indexOf(o.type) < 0) bad('type');
  if (typeof o.lang !== 'string' || !LANG_RE.test(o.lang)) bad('lang');
  if (!block(o.text, LIMITS.text)) bad('text');
  if (!line(o.region, LIMITS.region)) bad('region');
  if (o.county !== undefined && COUNTY_CODES.indexOf(o.county) < 0) bad('county');
  if (o.translations !== undefined) {
    const ks = isObj(o.translations) ? Object.keys(o.translations) : [];
    if (!ks.length || ks.length > LIMITS.translations) bad('translations');
    else ks.forEach(function (k) { if (!LANG_RE.test(k) || !block(o.translations[k], LIMITS.text)) bad('translations'); });
  }
  if (o.answer !== undefined && (!line(o.answer, LIMITS.answer) || o.type !== 'riddle')) bad('answer');
  if (o.type === 'riddle' && o.answer === undefined) bad('answer');
  if (o.purpose !== undefined && (!line(o.purpose, LIMITS.purpose) || o.type !== 'charm')) bad('purpose');
  if (o.type === 'charm' && o.purpose === undefined) bad('purpose');
  if (o.notes !== undefined && !block(o.notes, LIMITS.notes)) bad('notes');
  if (o.collector !== undefined && !line(o.collector, LIMITS.collector)) bad('collector');
  if (o.consent !== undefined && CONSENTS.indexOf(o.consent) < 0) bad('consent');
  if ((o.type === 'charm' || o.collector !== undefined) && o.consent === undefined) bad('consent');
  if (!line(o.source, LIMITS.source)) bad('source');
  if (o.source_url !== undefined && !isUrl(o.source_url)) bad('source_url');
  if (o.license !== undefined && LICENSES.indexOf(o.license) < 0) bad('license');
  if (o.status !== undefined && STATUSES.indexOf(o.status) < 0) bad('status');
  if (o.reviewed_by !== undefined && !line(o.reviewed_by, LIMITS.reviewed_by)) bad('reviewed_by');
  if (o.status === 'reviewed' && o.reviewed_by === undefined) bad('reviewed_by');
  if (o.status === 'sourced' && o.source_url === undefined) bad('source_url');
  return out;
}
// aceleași câmpuri, în ordinea din fișierele de date; fără câmpuri goale; traducerile în ordinea codurilor
export function canonicalItem(o) {
  const e = {};
  KEYS.forEach(function (k) {
    const v = o[k];
    if (v === undefined || v === null || v === '') return;
    if (k === 'translations') {
      if (!isObj(v)) { e[k] = v; return; }
      const t = {};
      Object.keys(v).sort().forEach(function (l) { t[l] = v[l]; });
      e[k] = t;
      return;
    }
    e[k] = v;
  });
  return e;
}

/* ---------------- căutare ---------------- */
// counties: {cod: nume} (opțional) — numele județului se caută și el
export function buildIndex(items, counties) {
  return items.map(function (e) {
    const parts = [e.text, e.answer, e.purpose, e.region, e.notes, e.source, e.county ? e.county + ' ' + ((counties && counties[e.county]) || '') : ''];
    Object.keys(e.translations || {}).forEach(function (k) { parts.push(e.translations[k]); });
    return { e: e, t: plain(e.text), hay: plain(parts.filter(Boolean).join(' ')) };
  });
}
function wordStart(h, f) { return (' ' + h).indexOf(' ' + f) >= 0; }
// opt: {type, lang, county, region, minStatus: 'any'|'sourced'|'reviewed'}; întoarce [{e, score}] cele mai bune primele
export function search(index, q, opt) {
  const o = opt || {}, full = plain(q), toks = full ? full.split(' ') : [], out = [];
  const minRank = o.minStatus === 'reviewed' ? 0 : o.minStatus === 'sourced' ? 1 : 2;
  const reg = o.region && o.region !== 'all' ? plain(o.region) : '';
  index.forEach(function (x) {
    const e = x.e;
    if (o.type && o.type !== 'all' && e.type !== o.type) return;
    if (o.lang && o.lang !== 'all' && e.lang !== o.lang) return;
    if (o.county && e.county !== o.county) return;
    if (reg && plain(e.region) !== reg) return;
    if (SRANK[e.status || 'draft'] > minRank) return;
    let s = 1;
    if (toks.length) {
      if (!toks.every(function (t) { return x.hay.indexOf(t) >= 0; })) return;
      if (x.t.indexOf(full) >= 0) s = wordStart(x.t, full) ? 50 : 40;
      else if (toks.every(function (t) { return wordStart(x.t, t); })) s = 20;
      else if (toks.every(function (t) { return x.t.indexOf(t) >= 0; })) s = 10;
      else s = 2;
    }
    out.push({ e: e, score: s, k: x.t });
  });
  out.sort(function (a, b) {
    return b.score - a.score || (SRANK[a.e.status || 'draft'] - SRANK[b.e.status || 'draft']) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0) || (String(a.e.id) < String(b.e.id) ? -1 : 1);
  });
  return out;
}
// {cod județ: număr de intrări}
export function countByCounty(items) {
  const c = dict();
  items.forEach(function (e) { if (e.county) c[e.county] = (c[e.county] || 0) + 1; });
  return c;
}
// regiunile folosite, în ordine alfabetică (fără diacritice); «unlocated» la sfârșit
export function regionList(items) {
  const seen = dict(), list = [];
  let unl = false;
  items.forEach(function (e) {
    const k = plain(e.region);
    if (k === UNLOCATED) { unl = true; return; }
    if (!seen[k]) { seen[k] = 1; list.push(e.region); }
  });
  list.sort(function (a, b) { const x = plain(a), y = plain(b); return x < y ? -1 : x > y ? 1 : 0; });
  if (unl) list.push(UNLOCATED);
  return list;
}

/* ---------------- proverbul zilei ---------------- */
// zilele întregi de la 1970-01-01 pentru «AAAA-LL-ZZ» (anii 0001–9999); NaN dacă data nu există
// (setUTCFullYear, nu Date.UTC: Date.UTC citește anii 0–99 ca 1900–1999)
export function dayNumber(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));
  if (!m) return NaN;
  const y = +m[1], mo = +m[2], d = +m[3], c = new Date(0);
  if (y < 1) return NaN;
  c.setUTCFullYear(y, mo - 1, d);
  if (c.getUTCFullYear() !== y || c.getUTCMonth() !== mo - 1 || c.getUTCDate() !== d) return NaN;
  return Math.floor(c.getTime() / 86400000);
}
function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
// aceeași zi → același proverb, pe orice dispozitiv: proverbele (din limba cerută, dacă e dată) se ordonează după un hash al id-ului și se
// parcurg câte unul pe zi; fiecare apare o dată pe ciclu. Întoarce intrarea sau null.
export function potdPick(items, date, lang) {
  const day = dayNumber(date);
  if (day !== day) return null;
  const list = items.filter(function (e) { return e.type === 'proverb' && (!lang || e.lang === lang); });
  if (!list.length) return null;
  const keyed = list.map(function (e) { return { e: e, h: fnv(String(e.id)) }; });
  keyed.sort(function (a, b) { return a.h - b.h || (String(a.e.id) < String(b.e.id) ? -1 : 1); });
  return keyed[((day % keyed.length) + keyed.length) % keyed.length].e;
}

/* ---------------- traduceri: «xx: text» pe rânduri ---------------- */
// întoarce {map, errors: [{line, code}]}; coduri: format, dup, many
export function parseTranslations(text) {
  const map = {}, errors = [], lines = String(text).split('\n');
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, ''), t = raw.trim();
    if (!t) continue;
    const m = /^([a-z]{2,3})\s*:\s*(\S[\s\S]*)$/.exec(t);
    if (!m) { errors.push({ line: i + 1, code: 'format' }); continue; }
    if (Object.prototype.hasOwnProperty.call(map, m[1])) { errors.push({ line: i + 1, code: 'dup' }); continue; }
    if (++n > LIMITS.translations) { errors.push({ line: i + 1, code: 'many' }); break; }
    map[m[1]] = m[2].trim();
  }
  return { map: map, errors: errors };
}
export function translationsText(map) {
  return Object.keys(map || {}).sort().map(function (k) { return k + ': ' + map[k]; }).join('\n');
}

/* ---------------- exporturi ---------------- */
function cell(s) { return String(s === undefined || s === null ? '' : s).replace(/[\t\r\n]+/g, ' ').trim(); }
// foile de calcul iau drept formulă o celulă care începe cu = + - @; apostroful din față o face text (OWASP, «CSV injection»)
function sheetCell(s) { const c = cell(s); return /^[=+\-@]/.test(c) ? "'" + c : c; }
// TSV cu antet; traducerile într-o singură coloană: «en: … | fr: …»
export function toTSV(items) {
  const lines = [['id', 'type', 'lang', 'text', 'region', 'county', 'answer', 'purpose', 'translations', 'notes', 'collector', 'consent', 'source', 'source_url', 'license', 'status', 'reviewed_by'].join('\t')];
  items.forEach(function (e) {
    const tr = Object.keys(e.translations || {}).sort().map(function (k) { return k + ': ' + cell(e.translations[k]); }).join(' | ');
    lines.push([e.id || itemId(e.lang, e.text), e.type, e.lang, e.text, e.region, e.county || '', e.answer || '', e.purpose || '', tr, e.notes || '', e.collector || '', e.consent || '', e.source, e.source_url || '', e.license || '', e.status || 'draft', e.reviewed_by || '']
      .map(sheetCell).join('\t'));
  });
  return lines.join('\n') + '\n';
}
export function itemToJson(e) { return JSON.stringify(canonicalItem(e), null, 2) + '\n'; }

/* ---------------- fișierul de contribuție ---------------- */
export function makeBundle(items, when) {
  return JSON.stringify({ format: 'graiul-bundle', version: 1, created: when || new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'), entries: items.map(canonicalItem) }, null, 2) + '\n';
}
// întoarce {entries, errors}; errors = [{index (de la 1), codes}] sau [{index: 0, codes: ['format'|'json'|'many']}]
export function parseBundle(text) {
  let b;
  try { b = JSON.parse(String(text)); } catch (e) { return { entries: [], errors: [{ index: 0, codes: ['json'] }] }; }
  if (!isObj(b) || b.format !== 'graiul-bundle' || b.version !== 1 || !Array.isArray(b.entries)) return { entries: [], errors: [{ index: 0, codes: ['format'] }] };
  if (b.entries.length > LIMITS.bundle) return { entries: [], errors: [{ index: 0, codes: ['many'] }] };
  const entries = [], errors = [];
  b.entries.forEach(function (raw, i) {
    const codes = validateItem(raw);
    if (codes.length) errors.push({ index: i + 1, codes: codes }); else entries.push(canonicalItem(raw));
  });
  return { entries: entries, errors: errors };
}

/* ---------------- lipire de liste: un text pe rând, opțional «text | traducere» ---------------- */
// separatori: tab sau « | »; întoarce {items: [{text, translation, line}], errors: [{line, code}]}; coduri: text, translation, many
export function parsePaste(text) {
  const items = [], errors = [], lines = String(text).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, ''), t = raw.trim();
    if (!t || t.charAt(0) === '#') continue;
    if (items.length >= LIMITS.bulk) { errors.push({ line: i + 1, code: 'many' }); break; }
    let cut = raw.indexOf('\t'), w = 1;
    if (cut < 0) { cut = raw.indexOf(' | '); w = 3; }
    const head = (cut < 0 ? raw : raw.slice(0, cut)).trim(), tr = cut < 0 ? '' : raw.slice(cut + w).trim();
    if (!block(head, LIMITS.text)) { errors.push({ line: i + 1, code: 'text' }); continue; }
    if (cut >= 0 && !block(tr, LIMITS.text)) { errors.push({ line: i + 1, code: 'translation' }); continue; }
    items.push({ text: head, translation: tr, line: i + 1 });
  }
  return { items: items, errors: errors };
}

