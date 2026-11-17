import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import I18N from '../src/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = fs.readFileSync(path.join(ROOT, 'src', 'ui.js'), 'utf8');
const eng = fs.readFileSync(path.join(ROOT, 'src', 'engine.mjs'), 'utf8');
const LANGS = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
const keys = Object.keys(I18N.en);
const ph = (s) => [...String(s).matchAll(/\{(\d)\}/g)].map((m) => +m[1]);

// Cheile folosite de ambalajul generat (meniu, titlu, buton de deschidere) și nu de ui.js.
const BUILDER = ['nav', 'title', 'open'];

function list(re, src) { const m = src.match(re); assert.ok(m, 'nu găsesc ' + re); return [...m[1].matchAll(/'([a-z_]+)'/g)].map((x) => x[1]); }
const TABS = list(/var TABS = \[([^\]]*)\]/, ui);
const ISSUE_CODES = list(/var ISSUE_CODES = \[([^\]]*)\]/, ui);
const validate = eng.slice(eng.indexOf('export function validateItem'), eng.indexOf('export function canonicalItem'));
const EMITTED = [...new Set([...validate.matchAll(/bad\('([a-z_]+)'\)/g)].map((m) => m[1]).concat(['object']))].sort();
const PASTE = [...new Set([...eng.slice(eng.indexOf('export function parsePaste')).matchAll(/code: '([a-z]+)'/g)].map((m) => m[1]))].sort();

/** Argumentele de la nivelul superior ale apelului care începe imediat după paranteza deschisă de la poziția i. */
function callArgs(src, i) {
  const args = []; let depth = 0, q = '', cur = '';
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (q) { cur += c; if (c === '\\') { cur += src[++k]; } else if (c === q) q = ''; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) { if (depth === 0) { args.push(cur.trim()); return args; } depth--; }
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  throw new Error('apel neînchis');
}

// toate familiile de chei construite din cod: prefix + valoare
const FAMILIES = {
  tab_: TABS, t_: E.TYPES, st_: E.STATUSES, cn_: E.CONSENTS, gd_st_: E.STATUSES,
  issue_: ISSUE_CODES.concat(['other']), b_e_: PASTE.concat(['dup']), gd_: [1, 2, 3, 4, 5], gd_eth_: [1, 2, 3, 4, 5], lim_: [1, 2, 3, 4, 5, 6]
};
const familyKeys = [].concat(...Object.entries(FAMILIES).map(([p, vs]) => vs.map((v) => p + v)));
// Șiruri snake_case din ui.js care sunt nume de câmpuri ale intrărilor, nu chei de traducere.
const NOT_KEYS = ISSUE_CODES;

test('toate limbile au exact aceleași chei și aceiași substituenți {n}, fără texte goale', () => {
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(I18N[l]), keys, l + ': chei diferite');
    for (const k of keys) {
      assert.ok(typeof I18N[l][k] === 'string' && I18N[l][k].trim().length > 0, l + '/' + k + ': text gol');
      assert.deepEqual(ph(I18N[l][k]).sort(), ph(I18N.en[k]).sort(), l + '/' + k + ': substituenți diferiți');
    }
  }
  assert.deepEqual(Object.keys(I18N).sort(), LANGS.slice().sort());
  assert.ok(keys.length >= 180, keys.length + ' chei');
});

test('fiecare șir snake_case din ui.js este o cheie de traducere existentă (sau un nume de câmp cunoscut)', () => {
  const lits = [...ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)].map((m) => m[1]).filter((s) => !s.endsWith('_') && !NOT_KEYS.includes(s));
  assert.ok(lits.length > 80, 'puține chei găsite: ' + lits.length);
  for (const k of new Set(lits)) assert.ok(keys.includes(k), 'cheie lipsă în i18n: ' + k);
  // prefixele folosite la chei construite («'t_' + tip») sunt exact cele din FAMILIES
  const pre = new Set([...ui.matchAll(/L\.[tf]\('([a-z_]+_)' \+/g)].map((m) => m[1]));
  for (const p of pre) assert.ok(FAMILIES[p], 'familie necunoscută: ' + p);
  for (const p of Object.keys(FAMILIES)) assert.ok(pre.has(p) || p === 'b_e_', 'familie nefolosită în ui.js: ' + p);
});

test('familiile dinamice de chei (file, tipuri, stări, acorduri, erori, ghid, limite) sunt complete', () => {
  assert.deepEqual(TABS, ['search', 'today', 'map', 'add', 'export', 'guide']);
  assert.deepEqual(E.TYPES, ['proverb', 'charm', 'riddle', 'carol', 'tale', 'saying', 'lullaby']);
  assert.deepEqual(E.STATUSES, ['draft', 'sourced', 'reviewed']);
  assert.deepEqual(E.CONSENTS, ['published', 'informed', 'anonymised']);
  assert.deepEqual(PASTE, ['many', 'text', 'translation']);
  for (const k of familyKeys) assert.ok(keys.includes(k), 'lipsește ' + k);
  assert.ok(!keys.includes('lim_7') && !keys.includes('gd_6') && !keys.includes('gd_eth_6'), 'ui.js afișează doar lim_1…lim_6, gd_1…gd_5 și gd_eth_1…gd_eth_5');
});

test('codurile de eroare ale motorului: cele din ISSUE_CODES sunt toate emise de validateItem, iar celelalte se arată ca «issue_other»', () => {
  const other = EMITTED.filter((c) => !ISSUE_CODES.includes(c));
  assert.deepEqual(other, ['extra', 'object']);
  for (const c of ISSUE_CODES) assert.ok(EMITTED.includes(c), c + ' nu mai este emis de motor');
  // fiecare cod chiar apare: câte o intrare stricată în felul respectiv
  const ok = { type: 'proverb', lang: 'ro', text: 'x', region: 'r', source: 's' };
  const mk = (patch) => Object.assign({}, ok, patch);
  const bad = {
    type: mk({ type: 'z' }), lang: mk({ lang: 'X' }), text: mk({ text: '' }), region: mk({ region: '' }), county: mk({ county: 'RO-ZZ' }), translations: mk({ translations: {} }),
    answer: mk({ answer: 'x' }), purpose: mk({ purpose: 'x' }), notes: mk({ notes: '' }), collector: mk({ collector: '', consent: 'informed' }), consent: mk({ consent: 'z' }),
    source: mk({ source: '' }), source_url: mk({ source_url: 'http://x' }), license: mk({ license: '' }), status: mk({ status: 'z' }), reviewed_by: mk({ reviewed_by: '' })
  };
  assert.deepEqual(Object.keys(bad).sort(), ISSUE_CODES.slice().sort());
  for (const [c, e] of Object.entries(bad)) assert.ok(E.validateItem(e).includes(c), c + ': ' + JSON.stringify(E.validateItem(e)));
  assert.deepEqual(E.validateItem(5), ['object']);
  assert.deepEqual(E.validateItem(Object.assign({ id: 1 }, ok)), ['extra']);
  // codurile lipirii: fiecare se produce
  assert.deepEqual(E.parsePaste('a\u0001').errors.map((x) => x.code), ['text']);
  assert.deepEqual(E.parsePaste('a | b\u0001').errors.map((x) => x.code), ['translation']);
  assert.deepEqual(E.parsePaste(Array.from({ length: 201 }, (_, i) => 't' + i).join('\n')).errors.map((x) => x.code), ['many']);
});

test('nicio cheie nu rămâne nefolosită (nici statică, nici din familiile dinamice, nici în ambalaj)', () => {
  const used = new Set(BUILDER.concat(familyKeys));
  for (const m of ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)) used.add(m[1]);
  for (const m of ui.matchAll(/L\.[tf]\('([a-z_0-9]+)'/g)) used.add(m[1]);
  const orphan = keys.filter((k) => !used.has(k));
  assert.deepEqual(orphan, []);
  const unknown = familyKeys.filter((k) => !keys.includes(k));
  assert.deepEqual(unknown, []);
});

test('apelurile L.f dau cel puțin atâtea argumente câți substituenți are textul, iar L.t nu se folosește pe texte cu substituenți', () => {
  let nf = 0, nt = 0;
  for (const m of ui.matchAll(/L\.([tf])\('([a-z_0-9]+)'/g)) {
    const kind = m[1], key = m[2];
    if (!keys.includes(key)) continue;  // prefixe de chei construite, verificate mai sus
    const rest = callArgs(ui, m.index + m[0].length);
    const given = rest.filter((x) => x !== '').length;
    const need = Math.max(-1, ...ph(I18N.en[key]));
    if (kind === 'f') { nf++; assert.ok(given >= need + 1 && given >= 1, 'L.f(' + key + '): ' + given + ' argumente, ' + (need + 1) + ' necesare'); }
    else { nt++; assert.ok(need < 0, 'L.t(' + key + ') folosit pe un text cu substituenți'); }
  }
  assert.ok(nf >= 12 && nt >= 70, nf + ' apeluri L.f, ' + nt + ' apeluri L.t');
  // familiile construite se afișează cu L.t (fără substituenți), în afară de «issue_*», care se afișează cu L.f și are cel mult un substituent
  for (const k of familyKeys) {
    if (k.startsWith('issue_')) { assert.ok(ph(I18N.en[k]).every((n) => n === 0), k); continue; }
    assert.deepEqual(ph(I18N.en[k]), [], k);
  }
});

test('traducerile nu conțin caractere de control, spații duble sau la capete, nici sedilă în română', () => {
  for (const l of LANGS) for (const k of keys) {
    const s = I18N[l][k];
    assert.ok(!/[\u0000-\u001f\u007f]/.test(s), l + '/' + k + ': caractere de control');
    assert.ok(!/ {2,}/.test(s), l + '/' + k + ': spații duble');
    assert.equal(s, s.trim(), l + '/' + k + ': spații la capete');
  }
  for (const k of keys) assert.ok(!/[şţŞŢ]/.test(I18N.ro[k]), 'ro/' + k + ': sedilă');
});

test('numele filelor: scurte (încap pe un ecran de 360 px în opt limbi), distincte într-o limbă, iar numele butoanelor principale sunt distincte între ele', () => {
  for (const l of LANGS) {
    const names = TABS.map((t) => I18N[l]['tab_' + t]);
    assert.equal(new Set(names).size, TABS.length, l + ': nume repetate ' + names.join(', '));
    for (const n of names) assert.ok(n.length <= 22, l + ': nume prea lung: ' + n);
    const act = ['a_check', 'a_add', 'a_add_any', 'a_reset', 'b_go', 'x_json', 'x_tsv', 'x_dup_go', 'm_all', 'd_today'].map((k) => I18N[l][k]);
    assert.equal(new Set(act).size, act.length, l + ': butoane cu același nume ' + act.join(', '));
  }
});
