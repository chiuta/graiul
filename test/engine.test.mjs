import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.mjs';

const OK = () => ({ type: 'proverb', lang: 'ro', text: 'Cine se aseamănă, se adună.', region: 'unlocated', source: 'test' });
const mk = (patch) => { const o = Object.assign(OK(), patch); for (const k of Object.keys(patch)) if (patch[k] === undefined) delete o[k]; return o; };
const codes = (o) => E.validateItem(o);
const item = (id, text, extra) => Object.assign({ id, type: 'proverb', lang: 'ro', text, region: 'unlocated', source: 's' }, extra || {});

test('fold: minuscule, fără semne diacritice, câteva litere scrise simplu, spații normalizate', () => {
  const cases = {
    'Așteaptă': 'asteapta', 'ȘȚ': 'st', 'ţară': 'tara', 'Cine se aseamănă': 'cine se aseamana', 'đ': 'd', 'Æ': 'ae', 'ß': 'ss', 'ł': 'l', 'ø': 'o',
    'ʒ': 'zh', '  A   b  ': 'a b', 'İ': 'i', 'x': 'x', '': '', 'a\tb\nc': 'a b c', 'a\u00a0b\u2003c\u3000d': 'a b c d'
  };
  for (const [a, b] of Object.entries(cases)) assert.equal(E.fold(a), b, JSON.stringify(a));
  for (const s of Object.keys(cases)) assert.equal(E.fold(E.fold(s)), E.fold(s), 'idempotent: ' + s);
});

test('plain: ca fold, dar fără punctuație (ghilimele, linii, semne de întrebare, paranteze) — cheia pentru duplicate și căutare', () => {
  assert.equal(E.plain('Cine se aseamănă, se adună.'), 'cine se aseamana se aduna');
  assert.equal(E.plain('„Așteaptă, murgule…”'), 'asteapta murgule');
  assert.equal(E.plain('«a»—b–c-d (e) [f] {g} <h>/i\\j|k*l_m~n^o=p+q@r#s$t%u&v!w?x;y:z'), 'a b c d e f g h i j k l m n o p q r s t u v w x y z');
  assert.equal(E.plain('!!!'), '');
  assert.equal(E.plain('a   b'), 'a b');
  assert.equal(E.plain('Ana-Maria'), 'ana maria');
  assert.equal(E.plain("l'eau"), 'l eau');
});

test('itemId și uniqueId: <limbă>-<primele cuvinte>, cel mult 60 de caractere, litere nelatine devin cod Unicode, sufix -2, -3', () => {
  assert.equal(E.itemId('ro', 'Cine se aseamănă, se adună.'), 'ro-cine-se-aseamana-se-aduna');
  assert.equal(E.itemId('ro', 'Așteaptă, murgule, să paști iarbă verde.'), 'ro-asteapta-murgule-sa-pasti-iarba-verde');
  assert.equal(E.itemId('hu', 'Addig nyújtózkodj, amíg a takaród ér'), 'hu-addig-nyujtozkodj-amig-a-takarod-er');
  assert.equal(E.itemId('rom', 'Čhib'), 'rom-chib');
  assert.equal(E.itemId('ro', 'Cine-s-a-fript'), 'ro-cine-s-a-fript');
  assert.equal(E.itemId('ru', 'жена'), 'ru-u436-435-43d-430');
  assert.equal(E.itemId('zh', '日本語のことわざを書く'), 'zh-u65e5-672c-8a9e-306e-3053-3068');
  const long = E.itemId('ro', 'unu doi trei patru cinci sase sapte opt noua zece unsprezece doisprezece treisprezece');
  assert.ok(long.slice(3).length <= 60, long);
  assert.ok(!long.endsWith('-'), long);
  assert.match(long, E.ID_RE);
  for (const t of ['a', 'Ab cd', '1 2 3', 'ţară', 'x'.repeat(200), 'é'.repeat(70) + ' z']) assert.match(E.itemId('ro', t), E.ID_RE, t);
  assert.equal(E.uniqueId('ro', 'Un text', {}), 'ro-un-text');
  assert.equal(E.uniqueId('ro', 'Un text', { 'ro-un-text': 1 }), 'ro-un-text-2');
  assert.equal(E.uniqueId('ro', 'Un text', { 'ro-un-text': 1, 'ro-un-text-2': 1 }), 'ro-un-text-3');
});

test('trigrame și similaritate: coeficientul Dice pe trigrame ale textului simplificat', () => {
  assert.deepEqual(E.trigrams('ab').sort(), [' ab', 'ab '].sort());
  assert.equal(E.trigrams('').length, 0, 'text gol: « » + « » = două spații, o singură trigramă „  ”?');
  assert.equal(E.similarity('Cine se aseamănă, se adună.', 'cine se aseamana se aduna'), 1);
  assert.equal(E.similarity('abc', ''), 0);
  assert.equal(E.similarity('', ''), 0);
  const s = E.similarity('Cine se aseamănă se adună', 'Cine se aseamănă se adună bine');
  assert.ok(s > E.NEAR && s < 1, String(s));
  assert.ok(E.similarity('Cine se aseamănă se adună', 'Ce frumos e afară') < 0.3);
  assert.equal(E.similarity('a b', 'b a') < 1, true);
  // simetrie
  for (const [a, b] of [['abcdef', 'abcxyz'], ['Așteaptă', 'asteapta murgule'], ['x', 'y']]) assert.equal(E.similarity(a, b), E.similarity(b, a));
  // puncte de cod: literele astrale nu se sparg în jumătăți
  assert.equal(E.trigrams('𝒜𝒜').some((t) => /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/.test(t)), false);
});

test('findDuplicates și duplicates: aceeași limbă; identice (exact) înaintea celor foarte asemănătoare; limbile diferite nu se compară', () => {
  const a = item('ro-a', 'Cine se aseamănă, se adună.');
  const items = [a, item('ro-b', 'cine se aseamana se aduna'), item('ro-c', 'Cine se aseamănă se adună bine'), item('ro-d', 'Altceva cu totul despre ceva diferit'), item('hu-a', 'Cine se aseamănă, se adună.', { lang: 'hu' })];
  const f = E.findDuplicates(items, a);
  assert.deepEqual(f.map((x) => [x.e.id, x.exact]), [['ro-b', true], ['ro-c', false]]);
  assert.equal(f[0].score, 1);
  assert.ok(f[1].score >= E.NEAR && f[1].score < 1);
  assert.deepEqual(E.findDuplicates(items, items[4]), []);
  assert.deepEqual(E.findDuplicates(items, Object.assign({}, a, { id: undefined })).map((x) => x.e.id), ['ro-a', 'ro-b', 'ro-c'], 'un obiect nou, cu același text, vede și originalul');
  const d = E.duplicates(items);
  assert.deepEqual(d.map((p) => [p.a.id, p.b.id, p.exact]), [['ro-a', 'ro-b', true], ['ro-a', 'ro-c', false], ['ro-b', 'ro-c', false]]);
  assert.deepEqual(E.duplicates([]), []);
  assert.deepEqual(E.duplicates([a]), []);
});

// implementarea de referință, scrisă direct după definiție (fără păstrarea trigramelor și fără filtrarea după mărime)
function refDice(a, b) {
  const A = E.trigrams(a), B = E.trigrams(b);
  if (!A.length || !B.length) return 0;
  const inB = new Set(B);
  let n = 0;
  for (const x of A) if (inB.has(x)) n++;
  return 2 * n / (A.length + B.length);
}
function refFind(items, e) {
  const k = E.plain(e.text), out = [];
  for (const x of items) {
    if (x === e || x.lang !== e.lang) continue;
    const same = E.plain(x.text) === k, score = same ? 1 : refDice(e.text, x.text);
    if (same || score >= E.NEAR) out.push({ id: x.id, exact: same, score });
  }
  return out.sort((a, b) => (b.exact ? 1 : 0) - (a.exact ? 1 : 0) || b.score - a.score || (String(a.id) < String(b.id) ? -1 : 1));
}
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

test('findDuplicates, duplicates și similarity dau exact aceleași rezultate ca definiția, și pe texte aproape identice, de mărimi diferite, goale sau doar cu semne', () => {
  const r = rng(7), alpha = 'abcdefghij klmnopqrstuvwxyzăâîșț', word = (n) => Array.from({ length: n }, () => alpha[Math.floor(r() * alpha.length)]).join('');
  const base = Array.from({ length: 30 }, () => word(20 + Math.floor(r() * 60)));
  const texts = base.slice();
  for (const b of base.slice(0, 20)) {
    texts.push(b + word(1), b.slice(0, -1), b.slice(1) + '.', word(1) + b, b.replace(/./, 'x'), b + ' ' + word(40), b.slice(0, Math.floor(b.length * 0.6)));   // aproape identice, la limita pragului, și mult mai scurte
  }
  texts.push('', '   ', '...', '!!!', 'a', 'ab', 'abc', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaab', 'AAAAAAAAAAAAAAAAAAAAAAAA!');
  const items = texts.map((t, i) => ({ id: 'ro-t' + i, lang: i % 11 === 0 ? 'hu' : 'ro', text: t }));
  let pairs = 0;
  for (const e of items) {
    const got = E.findDuplicates(items, e).map((x) => ({ id: x.e.id, exact: x.exact, score: x.score })), want = refFind(items, e);
    assert.deepEqual(got.map((x) => x.id + ':' + x.exact), want.map((x) => x.id + ':' + x.exact), e.id);
    got.forEach((x, i) => assert.ok(Math.abs(x.score - want[i].score) < 1e-12, e.id + ' ' + x.id));
    pairs += got.length;
  }
  assert.ok(pairs > 100, 'perechi de verificat: ' + pairs);
  const all = E.duplicates(items), keys = new Set(all.map((x) => [x.a.id, x.b.id].sort().join('|')));
  const refKeys = new Set();
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    if (items[i].lang !== items[j].lang) continue;
    const same = E.plain(items[i].text) === E.plain(items[j].text);
    if (same || refDice(items[i].text, items[j].text) >= E.NEAR) refKeys.add([items[i].id, items[j].id].sort().join('|'));
  }
  assert.deepEqual([...keys].sort(), [...refKeys].sort(), 'perechile din duplicates()');
  assert.equal(all.length, refKeys.size);
  for (let i = 0; i < 40; i++) {
    const a = texts[Math.floor(r() * texts.length)], b = texts[Math.floor(r() * texts.length)];
    assert.ok(Math.abs(E.similarity(a, b) - refDice(a, b)) < 1e-12, JSON.stringify([a, b]));
  }
});

test('căutarea de dubluri rămâne rapidă pe fișiere mari: 150 de intrări de câte 15 000 de caractere, comparate cu toate cele existente', () => {
  const r = rng(11), W = () => Array.from({ length: 12 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(r() * 26)]).join('');
  const text = (n) => { const w = []; while (w.join(' ').length < n) w.push(W()); return w.join(' ').slice(0, n); };
  const items = [];
  const t0 = Date.now();
  for (let i = 0; i < 150; i++) {
    const e = { id: 'ro-l' + i, lang: 'ro', text: text(15000) };
    E.findDuplicates(items, e);
    items.push(e);
  }
  const ms = Date.now() - t0;
  assert.ok(ms < 15000, 'a durat ' + ms + ' ms');   // fără păstrarea trigramelor ar dura câteva minute
  const copy = Object.assign({}, items[5], { id: 'ro-copie', text: items[5].text.slice(0, -3) + 'xyz' });
  assert.deepEqual(E.findDuplicates(items, copy).map((x) => x.e.id + ':' + x.exact), ['ro-l5:false']);
  const t1 = Date.now();
  assert.equal(E.duplicates(items.slice(0, 100)).length, 0);
  assert.ok(Date.now() - t1 < 10000, 'duplicates() a durat ' + (Date.now() - t1) + ' ms');
});

test('validateItem: o intrare corectă trece, iar fiecare câmp are propriul cod de eroare', () => {
  assert.deepEqual(codes(OK()), []);
  assert.deepEqual(codes(null), ['object']);
  assert.deepEqual(codes([]), ['object']);
  assert.deepEqual(codes('x'), ['object']);
  const bad = (patch, code) => assert.deepEqual(codes(mk(patch)), [code], JSON.stringify(patch).slice(0, 90));
  bad({ id: 'ro-x' }, 'extra');
  bad({ type: 'poem' }, 'type');
  bad({ type: undefined }, 'type');
  bad({ lang: 'RO' }, 'lang');
  bad({ lang: 'roma' }, 'lang');
  bad({ lang: 'r' }, 'lang');
  bad({ text: '' }, 'text');
  bad({ text: 'a\u0000b' }, 'text');
  bad({ text: 'x'.repeat(20001) }, 'text');
  bad({ text: 5 }, 'text');
  bad({ region: '' }, 'region');
  bad({ region: 'a\nb' }, 'region');
  bad({ region: 'x'.repeat(81) }, 'region');
  bad({ county: 'RO-XX' }, 'county');
  bad({ county: 'AB' }, 'county');
  bad({ translations: {} }, 'translations');
  bad({ translations: { en: '' } }, 'translations');
  bad({ translations: { EN: 'x' } }, 'translations');
  bad({ translations: 'x' }, 'translations');
  bad({ translations: Object.fromEntries(Array.from({ length: 13 }, (_, i) => ['a' + String.fromCharCode(97 + i), 'x'])) }, 'translations');
  bad({ answer: 'x' }, 'answer');
  bad({ type: 'riddle' }, 'answer');
  bad({ type: 'riddle', answer: '' }, 'answer');
  bad({ type: 'riddle', answer: 'a\nb' }, 'answer');
  bad({ purpose: 'x' }, 'purpose');
  bad({ type: 'charm', consent: 'informed' }, 'purpose');
  bad({ notes: '' }, 'notes');
  bad({ notes: 'x'.repeat(501) }, 'notes');
  assert.deepEqual(codes(mk({ collector: '' })), ['collector', 'consent'], 'un colector, chiar și greșit, cere un acord');
  bad({ collector: '', consent: 'informed' }, 'collector');
  bad({ collector: 'x'.repeat(121), consent: 'informed' }, 'collector');
  bad({ consent: 'yes' }, 'consent');
  bad({ type: 'charm', purpose: 'p' }, 'consent');
  bad({ collector: 'Ana' }, 'consent');
  bad({ source: '' }, 'source');
  bad({ source: undefined }, 'source');
  bad({ source_url: 'http://x.org' }, 'source_url');
  bad({ source_url: 'https://x org' }, 'source_url');
  bad({ status: 'sourced' }, 'source_url');
  bad({ license: 'GPL' }, 'license');
  bad({ status: 'done' }, 'status');
  bad({ status: 'reviewed' }, 'reviewed_by');
  bad({ reviewed_by: '' }, 'reviewed_by');
  assert.deepEqual(codes(mk({ type: 'riddle', answer: 'Ceasul' })), []);
  assert.deepEqual(codes(mk({ type: 'charm', purpose: 'de somn', consent: 'informed', collector: 'AC' })), []);
  assert.deepEqual(codes(mk({ status: 'sourced', source_url: 'https://x.org/a' })), []);
  assert.deepEqual(codes(mk({ status: 'reviewed', reviewed_by: 'Ana', translations: { en: 'x', fr: 'y' }, county: 'RO-B', license: 'CC0-1.0', notes: 'n\nm', text: 'a\nb' })), []);
  assert.deepEqual(codes(mk({ collector: 'Ana', consent: 'anonymised' })), []);
  // mai multe greșeli deodată, o singură dată fiecare
  assert.deepEqual(codes({ type: 'x', lang: 'X', text: '', region: '', source: '' }).sort(), ['lang', 'region', 'source', 'text', 'type']);
});

test('canonicalItem: ordinea câmpurilor din fișierele de date, fără câmpuri goale, traduceri sortate; nu schimbă valorile', () => {
  const e = { source: 's', status: 'draft', translations: { fr: 'b', en: 'a' }, text: 't', lang: 'ro', type: 'proverb', region: 'r', notes: '', county: undefined, answer: null };
  const c = E.canonicalItem(e);
  assert.deepEqual(Object.keys(c), ['type', 'lang', 'text', 'region', 'translations', 'source', 'status']);
  assert.deepEqual(Object.keys(c.translations), ['en', 'fr']);
  assert.deepEqual(E.canonicalItem(c), c);
  assert.equal(JSON.stringify(E.canonicalItem(Object.assign({ id: 'x' }, e))).includes('"id"'), false, 'câmpul id nu se păstrează');
  assert.equal(E.itemToJson(e), JSON.stringify(c, null, 2) + '\n');
});

test('căutare: fără diacritice, toate cuvintele, în text, traducere, răspuns, regiune și județ; filtre; ordine stabilă', () => {
  const items = [
    item('ro-a', 'Așteaptă, murgule, să paști iarbă verde.', { translations: { en: 'Wait, steed, to graze on green grass.' }, status: 'sourced', source_url: 'https://x.org' }),
    item('ro-b', 'Cine se aseamănă se adună', { region: 'Moldova', county: 'RO-IS', status: 'reviewed', reviewed_by: 'A' }),
    item('ro-c', 'Ce are pătrate și nu e cutie?', { type: 'riddle', answer: 'Ferestrele', region: 'Maramureș', county: 'RO-MM' }),
    item('hu-a', 'Addig nyújtózkodj', { lang: 'hu', region: 'Transilvania' })
  ];
  const idx = E.buildIndex(items, { 'RO-IS': 'Iași', 'RO-MM': 'Maramureș' });
  const ids = (q, o) => E.search(idx, q, o).map((x) => x.e.id);
  assert.deepEqual(ids('', {}), ['ro-b', 'ro-a', 'hu-a', 'ro-c'], 'fără interogare: întâi cele revizuite, apoi cu sursă, apoi restul, în ordinea alfabetică a textului');
  assert.deepEqual(ids('asteapta'), ['ro-a']);
  assert.deepEqual(ids('ASTEAPTĂ  murgule'), ['ro-a']);
  assert.deepEqual(ids('steed grass'), ['ro-a'], 'în traducere');
  assert.deepEqual(ids('ferestrele'), ['ro-c'], 'în răspuns');
  assert.deepEqual(ids('moldova'), ['ro-b'], 'în regiune');
  assert.deepEqual(ids('iasi'), ['ro-b'], 'în numele județului');
  assert.deepEqual(ids('ro-mm'), ['ro-c'], 'în codul județului');
  assert.deepEqual(ids('nimic de gasit'), []);
  assert.deepEqual(ids('', { type: 'riddle' }), ['ro-c']);
  assert.deepEqual(ids('', { lang: 'hu' }), ['hu-a']);
  assert.deepEqual(ids('', { region: 'Moldova' }), ['ro-b']);
  assert.deepEqual(ids('', { region: 'moldova' }), ['ro-b']);
  assert.deepEqual(ids('', { county: 'RO-MM' }), ['ro-c']);
  assert.deepEqual(ids('', { minStatus: 'sourced' }), ['ro-b', 'ro-a']);
  assert.deepEqual(ids('', { minStatus: 'reviewed' }), ['ro-b']);
  assert.deepEqual(ids('', { type: 'all', lang: 'all', region: 'all' }), ['ro-b', 'ro-a', 'hu-a', 'ro-c']);
  // potrivirea la începutul unui cuvânt bate potrivirea din mijlocul cuvântului
  const i2 = E.buildIndex([item('x1', 'aducere aminte'), item('x2', 'readuce'), item('x3', 'a aduce')], null);
  assert.deepEqual(E.search(i2, 'aduc').map((x) => x.e.id), ['x3', 'x1', 'x2']);
  assert.deepEqual(E.search(i2, 'aduc').map((x) => x.score), [50, 50, 40]);
  // fraza întreagă bate cuvintele răzlețe; cuvintele din text bat cuvintele găsite doar în alte câmpuri
  const i3 = E.buildIndex([item('y1', 'unu doi trei'), item('y2', 'trei doi unu'), item('y3', 'altceva', { translations: { en: 'doi trei' } }), item('y4', 'ceva doitrei')], null);
  const run = (q) => E.search(i3, q).map((x) => [x.e.id, x.score]);
  assert.deepEqual(run('doi trei'), [['y1', 50], ['y2', 20], ['y4', 10], ['y3', 2]]);
  assert.deepEqual(run('oi tre'), [['y1', 40], ['y4', 10], ['y2', 10], ['y3', 2]], 'fragmente de cuvinte: fraza din mijlocul cuvântului, apoi cuvintele răzlețe, în ordinea alfabetică a textului');
  assert.deepEqual(E.search(i3, 'zzz'), []);
});

test('numărătoare pe județe și lista regiunilor', () => {
  const items = [item('a', 'a', { county: 'RO-IS' }), item('b', 'b', { county: 'RO-IS' }), item('c', 'c', { county: 'RO-B' }), item('d', 'd'),
    item('e', 'e', { region: 'Moldova' }), item('f', 'f', { region: 'Bucovina' }), item('g', 'g', { region: 'moldova' }), item('h', 'h', { region: 'Țara Zarandului' })];
  assert.deepEqual(Object.assign({}, E.countByCounty(items)), { 'RO-IS': 2, 'RO-B': 1 });
  assert.deepEqual(E.regionList(items), ['Bucovina', 'Moldova', 'Țara Zarandului', 'unlocated']);
  assert.deepEqual(E.regionList([]), []);
  assert.deepEqual(E.regionList([item('x', 'x')]), ['unlocated']);
  assert.equal(E.COUNTY_CODES.length, 42);
  assert.equal(new Set(E.COUNTY_CODES).size, 42);
});

test('dayNumber: zile întregi de la 1970-01-01; NaN pentru date inexistente sau în alt format', () => {
  assert.equal(E.dayNumber('1970-01-01'), 0);
  assert.equal(E.dayNumber('1970-01-02'), 1);
  assert.equal(E.dayNumber('1969-12-31'), -1);
  assert.equal(E.dayNumber('2000-03-01') - E.dayNumber('2000-02-28'), 2, '2000 este bisect');
  assert.equal(E.dayNumber('1900-03-01') - E.dayNumber('1900-02-28'), 1, '1900 nu este bisect');
  assert.equal(E.dayNumber('2024-02-29') - E.dayNumber('2024-02-28'), 1);
  assert.equal(E.dayNumber('2026-11-17'), 20774);
  for (const bad of ['2023-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '2026-1-1', '26-01-01', '2026/01/01', '', ' 2026-01-01', '2026-01-01 ', 'abcd-ef-gh', null, undefined, 5]) assert.ok(Number.isNaN(E.dayNumber(bad)), String(bad));
  assert.equal(E.dayNumber('0001-01-01'), -719162, 'anii 0001–0099 nu sunt citiți ca 19xx (Date.UTC ar greși)');
  assert.equal(E.dayNumber('9999-12-31'), 2932896);
  assert.equal(E.dayNumber('0100-01-01') - E.dayNumber('0099-12-31'), 1);
  assert.equal(E.dayNumber('0004-02-29') - E.dayNumber('0004-02-28'), 1, 'anul 4 este bisect');
  assert.ok(Number.isNaN(E.dayNumber('0100-02-29')), 'anul 100 nu este bisect');
  assert.ok(Number.isNaN(E.dayNumber('0000-01-01')), 'nu există anul 0000 în câmpul de dată');
});

test('potdPick: aceeași zi → același proverb; în n zile consecutive apar toate cele n; ordinea nu depinde de ordinea intrărilor', () => {
  const ps = Array.from({ length: 7 }, (_, i) => item('ro-p' + i, 'proverb ' + i));
  const day = (n) => { const d = new Date((20000 + n) * 86400000); return d.toISOString().slice(0, 10); };
  const seen = new Set();
  for (let n = 0; n < 7; n++) seen.add(E.potdPick(ps, day(n)).id);
  assert.equal(seen.size, 7);
  for (let n = 0; n < 40; n++) assert.equal(E.potdPick(ps, day(n)).id, E.potdPick(ps, day(n + 7)).id, 'ciclu de 7 zile');
  const rev = ps.slice().reverse();
  for (let n = 0; n < 20; n++) assert.equal(E.potdPick(rev, day(n)).id, E.potdPick(ps, day(n)).id, 'altă ordine a intrărilor');
  assert.equal(E.potdPick([], '2026-11-17'), null);
  assert.equal(E.potdPick(ps, 'ieri'), null);
  assert.equal(E.potdPick([item('x', 'x', { type: 'riddle', answer: 'a' })], '2026-11-17'), null, 'doar proverbele');
  const mixed = ps.concat([item('hu-a', 'x', { lang: 'hu' })]);
  assert.equal(E.potdPick(mixed, '2026-11-17', 'hu').id, 'hu-a');
  assert.equal(E.potdPick(mixed, '2026-11-17', 'fr'), null);
  // înainte de 1970 (zile negative) funcționează la fel
  assert.ok(E.potdPick(ps, '1900-01-01'));
  assert.ok(E.potdPick(ps, '0001-01-01'));
  assert.equal(E.potdPick([ps[0]], '2026-11-17').id, 'ro-p0');
});

test('traduceri «xx: text»: parsare, erori pe rânduri și drum înapoi', () => {
  const p = E.parseTranslations('en: Hello\n fr :  Bonjour  \n\nde:Hallo');
  assert.deepEqual(p.map, { en: 'Hello', fr: 'Bonjour', de: 'Hallo' });
  assert.deepEqual(p.errors, []);
  assert.deepEqual(E.parseTranslations('en Hello').errors, [{ line: 1, code: 'format' }]);
  assert.deepEqual(E.parseTranslations('EN: x').errors, [{ line: 1, code: 'format' }]);
  assert.deepEqual(E.parseTranslations('en:').errors, [{ line: 1, code: 'format' }]);
  assert.deepEqual(E.parseTranslations('en: a\nen: b').errors, [{ line: 2, code: 'dup' }]);
  const many = Array.from({ length: 14 }, (_, i) => String.fromCharCode(97 + i) + 'x: t').join('\n');
  const m = E.parseTranslations(many);
  assert.equal(Object.keys(m.map).length, 12);
  assert.deepEqual(m.errors, [{ line: 13, code: 'many' }]);
  assert.deepEqual(E.parseTranslations('').map, {});
  assert.equal(E.translationsText({ fr: 'b', en: 'a' }), 'en: a\nfr: b');
  assert.equal(E.translationsText(undefined), '');
  assert.equal(Object.prototype.hasOwnProperty.call(E.parseTranslations('__proto__: x').map, '__proto__'), false, 'codurile au 2–3 litere mici');
  assert.deepEqual(E.parseTranslations('constructor: x').errors.length, 1);
});

test('export TSV: antet, o linie pe intrare, tab/rând nou devin spațiu, celulele care par formule primesc apostrof', () => {
  const items = [
    item('ro-a', 'Text cu\ttab\nși rând nou', { county: 'RO-B', translations: { fr: 'Texte', en: 'Text' }, answer: undefined }),
    item('ro-b', '=1+1', { source: '@SUM(A1)', notes: '-5', collector: '+x', consent: 'informed' }),
    item('ro-c', 'Ghicitoare', { type: 'riddle', answer: 'Răspuns', status: 'reviewed', reviewed_by: 'A', source_url: 'https://x.org/a' })
  ];
  const t = E.toTSV(items), lines = t.trimEnd().split('\n');
  assert.ok(t.endsWith('\n'));
  assert.equal(lines.length, 4);
  assert.equal(lines[0], ['id', 'type', 'lang', 'text', 'region', 'county', 'answer', 'purpose', 'translations', 'notes', 'collector', 'consent', 'source', 'source_url', 'license', 'status', 'reviewed_by'].join('\t'));
  const c1 = lines[1].split('\t');
  assert.equal(c1.length, 17);
  assert.equal(c1[0], 'ro-a'); assert.equal(c1[3], 'Text cu tab și rând nou'); assert.equal(c1[5], 'RO-B'); assert.equal(c1[8], 'en: Text | fr: Texte'); assert.equal(c1[15], 'draft');
  const c2 = lines[2].split('\t');
  assert.equal(c2[3], "'=1+1"); assert.equal(c2[12], "'@SUM(A1)"); assert.equal(c2[9], "'-5"); assert.equal(c2[10], "'+x"); assert.equal(c2[11], 'informed');
  const c3 = lines[3].split('\t');
  assert.equal(c3[6], 'Răspuns'); assert.equal(c3[15], 'reviewed'); assert.equal(c3[16], 'A'); assert.equal(c3[13], 'https://x.org/a');
  assert.ok(E.toTSV([]).trimEnd().split('\n').length === 1);
  // fără id în intrare: se folosește id-ul calculat
  assert.equal(E.toTSV([OK()]).split('\n')[1].split('\t')[0], 'ro-cine-se-aseamana-se-aduna');
});

test('fișierul de contribuție: dus-întors, intrări greșite raportate cu numărul și codurile lor, formate ostile respinse', () => {
  const a = mk({ type: 'riddle', answer: 'Ceasul', translations: { en: 'x' }, county: 'RO-B' }), b = mk({ text: 'Alt text' });
  const text = E.makeBundle([a, b], '2026-11-17T10:00:00Z');
  const j = JSON.parse(text);
  assert.equal(j.format, 'graiul-bundle'); assert.equal(j.version, 1); assert.equal(j.created, '2026-11-17T10:00:00Z'); assert.equal(j.entries.length, 2);
  assert.ok(text.endsWith('\n'));
  assert.deepEqual(E.parseBundle(text), { entries: [E.canonicalItem(a), E.canonicalItem(b)], errors: [] });
  assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(JSON.parse(E.makeBundle([a])).created));
  // intrări greșite
  const mixed = JSON.stringify({ format: 'graiul-bundle', version: 1, entries: [a, mk({ lang: 'X' }), 5, mk({ id: 'ro-x', type: 'z' }), b] });
  const r = E.parseBundle(mixed);
  assert.equal(r.entries.length, 2);
  assert.deepEqual(r.errors, [{ index: 2, codes: ['lang'] }, { index: 3, codes: ['object'] }, { index: 4, codes: ['extra', 'type'] }]);
  // formate ostile
  const err = (s) => E.parseBundle(s).errors;
  assert.deepEqual(err('nu e json'), [{ index: 0, codes: ['json'] }]);
  assert.deepEqual(err(''), [{ index: 0, codes: ['json'] }]);
  assert.deepEqual(err('[]'), [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(err('null'), [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(err('{"format":"glosar-bundle","version":1,"entries":[]}'), [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(err('{"format":"graiul-bundle","version":2,"entries":[]}'), [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(err('{"format":"graiul-bundle","version":1,"entries":{}}'), [{ index: 0, codes: ['format'] }]);
  assert.deepEqual(err('{"format":"graiul-bundle","version":1}'), [{ index: 0, codes: ['format'] }]);
  const big = JSON.stringify({ format: 'graiul-bundle', version: 1, entries: Array.from({ length: 501 }, () => OK()) });
  assert.deepEqual(err(big), [{ index: 0, codes: ['many'] }]);
  assert.equal(E.parseBundle(JSON.stringify({ format: 'graiul-bundle', version: 1, entries: Array.from({ length: 500 }, () => OK()) })).entries.length, 500);
  // chei periculoase nu ajung în intrări
  const proto = '{"format":"graiul-bundle","version":1,"entries":[{"__proto__":{"x":1},"type":"proverb","lang":"ro","text":"a","region":"r","source":"s"}]}';
  const pr = E.parseBundle(proto);
  assert.equal(({}).x, undefined);
  assert.deepEqual(pr.errors.map((e) => e.codes), [['extra']]);
});

test('lipirea unei liste: un text pe rând, «text | traducere» sau tab, comentarii și rânduri goale sărite, rânduri greșite raportate', () => {
  const p = E.parsePaste('# comentariu\nunu\n\ndoi | two\ntrei\tthree\n  patru  |  four  \n#cinci\nșase | ');
  assert.deepEqual(p.items, [
    { text: 'unu', translation: '', line: 2 }, { text: 'doi', translation: 'two', line: 4 }, { text: 'trei', translation: 'three', line: 5 },
    { text: 'patru', translation: 'four', line: 6 }
  ]);
  assert.deepEqual(p.errors, [{ line: 8, code: 'translation' }], 'separator fără traducere după el');
  assert.deepEqual(E.parsePaste('a\r\nb\r\n').items.map((x) => x.text), ['a', 'b']);
  assert.deepEqual(E.parsePaste('a\u0001b').errors, [{ line: 1, code: 'text' }]);
  assert.deepEqual(E.parsePaste('a | b\u0001c').errors, [{ line: 1, code: 'translation' }]);
  assert.deepEqual(E.parsePaste('a|b').items.map((x) => x.text), ['a|b'], 'bara fără spații nu desparte');
  assert.deepEqual(E.parsePaste('').items, []);
  const many = Array.from({ length: 205 }, (_, i) => 't' + i).join('\n');
  const m = E.parsePaste(many);
  assert.equal(m.items.length, 200);
  assert.deepEqual(m.errors, [{ line: 201, code: 'many' }]);
  assert.deepEqual(E.parsePaste('x'.repeat(20001)).errors, [{ line: 1, code: 'text' }]);
});

test('constantele: tipuri, stări, acorduri, licențe și limite', () => {
  assert.deepEqual(E.TYPES, ['proverb', 'charm', 'riddle', 'carol', 'tale', 'saying', 'lullaby']);
  assert.deepEqual(E.STATUSES, ['draft', 'sourced', 'reviewed']);
  assert.deepEqual(E.CONSENTS, ['published', 'informed', 'anonymised']);
  assert.deepEqual(E.LICENSES, ['MIT', 'public-domain', 'CC0-1.0', 'CC-BY-SA-4.0']);
  assert.equal(E.NEAR, 0.85);
  assert.equal(E.UNLOCATED, 'unlocated');
  assert.deepEqual(E.LIMITS, { text: 20000, region: 80, answer: 300, purpose: 300, notes: 500, collector: 120, source: 300, reviewed_by: 120, translations: 12, own: 500, bulk: 200, bundle: 500, url: 500 });
});
