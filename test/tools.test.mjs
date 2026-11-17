import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV = Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' });
const py = (args, o = {}) => { const r = spawnSync('python3', args, { encoding: 'utf8', cwd: o.cwd || ROOT, input: o.input, env: ENV, maxBuffer: 64 * 1024 * 1024 }); return { status: r.status, out: (r.stdout || '') + (r.stderr || '') }; };
const HAVE_PY = py(['-I', '-c', 'import jsonschema']).status === 0;
const T = HAVE_PY ? test : test.skip;
const tmpdirs = [];
const mktmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'graiul-test-')); tmpdirs.push(d); return d; };
test.after(() => { for (const d of tmpdirs) fs.rmSync(d, { recursive: true, force: true }); });

/** Un arbore mic de lucru: scheme, scripturi, plăcile județelor, șablonul și două intrări. */
function tree() {
  const d = mktmp();
  for (const f of ['schema.json', 'counties.schema.json']) fs.copyFileSync(path.join(ROOT, f), path.join(d, f));
  fs.mkdirSync(path.join(d, 'scripts')); fs.mkdirSync(path.join(d, 'data', 'items'), { recursive: true });
  for (const f of ['validate.py', 'import_bundle.py']) fs.copyFileSync(path.join(ROOT, 'scripts', f), path.join(d, 'scripts', f));
  fs.copyFileSync(path.join(ROOT, 'data', 'counties.json'), path.join(d, 'data', 'counties.json'));
  for (const f of ['example.json', 'ro-cine-se-aseamana-se-aduna.json', 'ro-calul-bun-se-vinde-in-grajd.json']) fs.copyFileSync(path.join(ROOT, 'data', 'items', f), path.join(d, 'data', 'items', f));
  return d;
}
const entry = (o) => Object.assign({ type: 'proverb', lang: 'ro', text: 'Un text nou despre ceva anume.', region: 'unlocated', source: 's' }, o || {});
const put = (d, name, o) => fs.writeFileSync(path.join(d, 'data', 'items', name + '.json'), typeof o === 'string' ? o : JSON.stringify(o));
const validate = (d, ...flags) => py([path.join(d, 'scripts', 'validate.py'), ...flags], { cwd: d });
const bundle = (d, entries, name) => { const f = path.join(d, name || 'bundle.json'); fs.writeFileSync(f, typeof entries === 'string' ? entries : JSON.stringify({ format: 'graiul-bundle', version: 1, entries })); return f; };
const importer = (d, f, ...flags) => py([path.join(d, 'scripts', 'import_bundle.py'), f, ...flags], { cwd: d });
const list = (d) => fs.readdirSync(path.join(d, 'data', 'items')).sort();

T('scripts/validate.py: datele din depozit trec fără erori și fără avertismente, și în modul --strict', () => {
  const r = py(['scripts/validate.py', '--strict', '--list']);
  assert.equal(r.status, 0, r.out);
  const n = fs.readdirSync(path.join(ROOT, 'data', 'items')).filter((f) => f.endsWith('.json') && f !== 'example.json').length;
  assert.ok(r.out.split('\n').includes(n + ' items, 42 county tiles, 0 error(s), 0 warning(s).'), r.out);
  assert.match(r.out, /^type: proverb \d+/m);
  assert.match(r.out, /^lang: ro \d+/m);
  assert.match(r.out, /^county: - \d+/m);
  assert.match(r.out, /^status: (reviewed \d+, )?sourced \d+/m);
});

// ——— aceleași reguli în Python și în motor ———
const WORDS = ['Așteaptă', 'așteaptă', 'ŞŢ', 'şţ', 'ŢARĂ', 'Cine se aseamănă, se adună.', 'čhib', 'štar', 'pandž', 'panʒ', 'đ', 'Æ', 'ß', 'ẞ', 'ł', 'ø', 'ð', 'þ', 'ħ', 'ə', 'ɨ', 'ʃ', 'œ', 'ı', 'İ', 'ǆ', 'ǅ', 'Ǳ', 'ﬁ', 'ŉ',
  '  A   b  ', 'a\tb\nc', 'a b', 'a b', 'a　b', '﻿a﻿', 'a\u0085b', 'a\u001cb', 'a​b', 'a᠎b', 'a b c', 'é', 'ẹ́', 'ÀÉÎÕÜ', 'Ő ű', 'Ångström',
  'жена', 'Привет, мир', '日本語のことわざ', 'दो', 'ΑΣ ΣΑΣ', 'ς', '𝒜𝒜𝒜', 'a😀b', '😀', '--x--', 'a-b', '«a»—b–c', '„Așteaptă…”', "l'eau", '!!!', '', ' ', 'x'.repeat(100), 'unu doi trei patru cinci sase sapte opt noua zece unsprezece doisprezece', 'ab', 'a'];
const POOL = ['a', 'A', 'ă', 'Ă', 'â', 'î', 'ș', 'Ș', 'ş', 'ț', 'Ț', 'ţ', 'e', 'é', 'é', 'ß', 'đ', 'İ', 'ı', 'Σ', 'ς', 'ж', '日', '😀', '𝒜', ' ', ' ', ' ', '　', '﻿', '\u0085', '\n', '\t', '-', '–', '.', ',', '«', '»', '„', '"', "'", '(', ')', '!', '?', '_', '/', '1', '0', 'x', 'z', 'q'];
function lcg(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function fuzz(n, seed) { const r = lcg(seed), out = []; for (let i = 0; i < n; i++) { const len = 1 + Math.floor(r() * 14); let s = ''; for (let k = 0; k < len; k++) s += POOL[Math.floor(r() * POOL.length)]; out.push(s); } return out; }
const JSON_STDIN = 'sys.stdin.buffer.read().decode("utf-8")';

T('fold, plain și item_id din Python dau exact aceleași rezultate ca fold, plain și itemId din motor (cuvinte alese și 600 de șiruri aleatoare)', () => {
  const words = WORDS.concat(fuzz(600, 20261117));
  const code = 'import sys, json\nsys.path.insert(0, "scripts")\nimport validate\nw = json.loads(' + JSON_STDIN + ')\nprint(json.dumps([[validate.fold(x), validate.plain(x), validate.item_id("ro", x)] for x in w]))';
  const r = py(['-I', '-c', code], { input: JSON.stringify(words) });
  assert.equal(r.status, 0, r.out.slice(0, 600));
  const got = JSON.parse(r.out);
  let bad = 0;
  words.forEach((w, i) => {
    const want = [E.fold(w), E.plain(w), E.itemId('ro', w)];
    if (JSON.stringify(got[i]) !== JSON.stringify(want)) { if (bad++ < 5) assert.deepEqual(got[i], want, JSON.stringify(w)); }
  });
  assert.equal(bad, 0);
  // ce se întoarce este un id valid pentru fișier
  for (const w of words) assert.match(E.itemId('ro', w), E.ID_RE, JSON.stringify(w));
});

T('similarity din Python dă aceeași valoare ca similarity din motor (perechi alese și 300 de perechi aleatoare)', () => {
  const fx = fuzz(600, 424242);
  const pairs = [['Cine se aseamănă, se adună.', 'cine se aseamana se aduna'], ['abc', ''], ['', ''], ['a', 'a'], ['Așteaptă', 'asteapta murgule'], ['𝒜𝒜𝒜', '𝒜𝒜'], ['ab', 'ba'], ['Cine se aseamănă se adună', 'Cine se aseamănă se adună bine']];
  for (let i = 0; i < 300; i++) pairs.push([fx[2 * i], fx[2 * i + 1]]);
  const code = 'import sys, json\nsys.path.insert(0, "scripts")\nimport validate\np = json.loads(' + JSON_STDIN + ')\nprint(json.dumps([validate.similarity(a, b) for a, b in p]))';
  const r = py(['-I', '-c', code], { input: JSON.stringify(pairs) });
  assert.equal(r.status, 0, r.out.slice(0, 600));
  const got = JSON.parse(r.out);
  pairs.forEach(([a, b], i) => assert.ok(Math.abs(got[i] - E.similarity(a, b)) < 1e-12, JSON.stringify([a, b]) + ' ' + got[i] + ' ≠ ' + E.similarity(a, b)));
});

// ——— schema.json + validate.py față de validateItem ———
const ok = () => ({ type: 'proverb', lang: 'ro', text: 'Cine se aseamănă, se adună.', region: 'unlocated', source: 's' });
const M = (patch) => { const o = ok(); for (const [k, v] of Object.entries(patch)) { if (v === undefined) delete o[k]; else o[k] = v; } return o; };
const many = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => ['a' + String.fromCharCode(97 + i), 'x']));
const MATRIX = [
  // [nume, intrare, acceptată]
  ['minimă', M({}), true],
  ['ghicitoare completă', M({ type: 'riddle', answer: 'Ceasul', county: 'RO-B', translations: { en: 'x', fr: 'y' }, notes: 'n\nm', collector: 'AC', consent: 'anonymised', source_url: 'https://x.org/a', license: 'CC0-1.0', status: 'reviewed', reviewed_by: 'Ana', text: 'a\nb' }), true],
  ['descântec', M({ type: 'charm', purpose: 'de somn', consent: 'informed' }), true],
  ['colindă cu colector', M({ type: 'carol', collector: 'Ana', consent: 'published' }), true],
  ['cu sursă și adresă', M({ status: 'sourced', source_url: 'https://ro.wikipedia.org/wiki/Șosea' }), true],
  ['text cu rând nou', M({ text: 'a\nb' }), true],
  ['12 traduceri', M({ translations: many(12) }), true],
  ['text de 20000 de puncte de cod (litere de 2 unități UTF-16)', M({ text: '𝒜'.repeat(20000) }), true],
  ['regiune de 80 de caractere', M({ region: 'x'.repeat(80) }), true],
  ['adresă de 500 de caractere', M({ status: 'sourced', source_url: 'https://' + 'a'.repeat(500) }), true],
  ['adresă cu NEL (U+0085) în ea', M({ status: 'sourced', source_url: 'https://a\u0085b' }), false],
  ['cheie în plus', M({ id: 'x' }), false],
  ['fără tip', M({ type: undefined }), false],
  ['tip necunoscut', M({ type: 'poem' }), false],
  ['limbă cu majuscule', M({ lang: 'RO' }), false],
  ['limbă cu 4 litere', M({ lang: 'roma' }), false],
  ['limbă cu o literă', M({ lang: 'r' }), false],
  ['limbă cu rând nou la sfârșit', M({ lang: 'ro\n' }), false],
  ['text gol', M({ text: '' }), false],
  ['text cu NUL', M({ text: 'a\u0000b' }), false],
  ['text cu tab', M({ text: 'a\tb' }), false],
  ['text cu CR', M({ text: 'a\r\nb' }), false],
  ['text cu DEL', M({ text: 'a\u007fb' }), false],
  ['text de 20001 de caractere', M({ text: 'x'.repeat(20001) }), false],
  ['text de 20001 de puncte de cod', M({ text: '𝒜'.repeat(20001) }), false],
  ['text cu jumătate de pereche surogat', M({ text: 'a\ud800b' }), false],
  ['text cu a doua jumătate de pereche', M({ text: 'a\udc00b' }), false],
  ['text număr', M({ text: 5 }), false],
  ['text nul', M({ text: null }), false],
  ['regiune goală', M({ region: '' }), false],
  ['regiune cu rând nou', M({ region: 'a\nb' }), false],
  ['regiune cu rând nou la sfârșit', M({ region: 'Moldova\n' }), false],
  ['regiune de 81 de caractere', M({ region: 'x'.repeat(81) }), false],
  ['județ necunoscut', M({ county: 'RO-XX' }), false],
  ['județ cu litere mici', M({ county: 'ro-b' }), false],
  ['județ cu rând nou', M({ county: 'RO-B\n' }), false],
  ['județ nul', M({ county: null }), false],
  ['traduceri goale', M({ translations: {} }), false],
  ['traducere goală', M({ translations: { en: '' } }), false],
  ['cod de limbă cu majuscule', M({ translations: { EN: 'x' } }), false],
  ['cod de limbă cu rând nou', M({ translations: { 'en\n': 'x' } }), false],
  ['traduceri șir', M({ translations: 'x' }), false],
  ['traduceri nule', M({ translations: null }), false],
  ['13 traduceri', M({ translations: many(13) }), false],
  ['traducere cu NUL', M({ translations: { en: 'a\u0000' } }), false],
  ['traducere cu rând nou', M({ translations: { en: 'a\nb' } }), true],
  ['răspuns la un proverb', M({ answer: 'x' }), false],
  ['ghicitoare fără răspuns', M({ type: 'riddle' }), false],
  ['ghicitoare cu răspuns gol', M({ type: 'riddle', answer: '' }), false],
  ['ghicitoare cu răspuns pe două rânduri', M({ type: 'riddle', answer: 'a\nb' }), false],
  ['ghicitoare cu răspuns nul', M({ type: 'riddle', answer: null }), false],
  ['răspuns de 301 caractere', M({ type: 'riddle', answer: 'x'.repeat(301) }), false],
  ['scop la un proverb', M({ purpose: 'x' }), false],
  ['descântec fără scop', M({ type: 'charm', consent: 'informed' }), false],
  ['descântec fără acord', M({ type: 'charm', purpose: 'p' }), false],
  ['note goale', M({ notes: '' }), false],
  ['note de 501 caractere', M({ notes: 'x'.repeat(501) }), false],
  ['note de 500 de caractere', M({ notes: 'x'.repeat(500) }), true],
  ['colector gol', M({ collector: '', consent: 'informed' }), false],
  ['colector de 121 de caractere', M({ collector: 'x'.repeat(121), consent: 'informed' }), false],
  ['colector fără acord', M({ collector: 'Ana' }), false],
  ['acord necunoscut', M({ consent: 'yes' }), false],
  ['sursă goală', M({ source: '' }), false],
  ['fără sursă', M({ source: undefined }), false],
  ['sursă de 301 caractere', M({ source: 'x'.repeat(301) }), false],
  ['sursă pe două rânduri', M({ source: 'a\nb' }), false],
  ['adresă http', M({ source_url: 'http://x.org' }), false],
  ['adresă cu spațiu', M({ source_url: 'https://x org' }), false],
  ['adresă cu NBSP', M({ source_url: 'https://a b' }), false],
  ['adresă cu U+FEFF', M({ source_url: 'https://a﻿b' }), false],
  ['adresă cu rând nou la sfârșit', M({ source_url: 'https://x.org\n' }), false],
  ['adresă cu caracter de control', M({ source_url: 'https://x\u001cy' }), false],
  ['adresă de 501 caractere', M({ source_url: 'https://' + 'a'.repeat(501) }), false],
  ['adresă doar «https://»', M({ source_url: 'https://' }), false],
  ['adresă număr', M({ source_url: 5 }), false],
  ['licență necunoscută', M({ license: 'GPL' }), false],
  ['stare necunoscută', M({ status: 'done' }), false],
  ['«sourced» fără adresă', M({ status: 'sourced' }), false],
  ['«reviewed» fără revizor', M({ status: 'reviewed' }), false],
  ['revizor gol', M({ reviewed_by: '' }), false],
  ['revizor de 121 de caractere', M({ reviewed_by: 'x'.repeat(121) }), false]
];

T('schema.json + validate.py și motorul (validateItem) acceptă și resping aceleași intrări (' + MATRIX.length + ' cazuri)', () => {
  const code = 'import sys, json\nsys.path.insert(0, "scripts")\nimport validate\nsch = validate.Draft7Validator(validate.load(validate.ROOT / "schema.json"))\ncases = json.loads(' + JSON_STDIN + ')\nprint(json.dumps([validate.item_errors(sch, e, "x") for e in cases]))';
  const r = py(['-I', '-c', code], { input: JSON.stringify(MATRIX.map((c) => c[1])) });
  assert.equal(r.status, 0, r.out.slice(0, 800));
  const got = JSON.parse(r.out);
  assert.equal(got.length, MATRIX.length);
  MATRIX.forEach(([name, e, want], i) => {
    const eng = E.validateItem(e).length === 0, pyOk = got[i].length === 0;
    assert.equal(eng, want, name + ': motorul → ' + JSON.stringify(E.validateItem(e)));
    assert.equal(pyOk, want, name + ': Python → ' + JSON.stringify(got[i]));
  });
  assert.ok(MATRIX.filter((c) => c[2]).length >= 10 && MATRIX.filter((c) => !c[2]).length >= 60);
});

T('validate.py: arborele de lucru curat trece; fiecare problemă din date este găsită, cu codul de ieșire potrivit', () => {
  const d = tree();
  let r = validate(d, '--strict');
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /2 items, 42 county tiles, 0 error\(s\), 0 warning\(s\)\./);

  // al doilea element cu aceleași primele cuvinte (id-ul se oprește la 60 de caractere): -2, -3 sunt bune; alt nume nu
  const FIRST = 'Unu doi trei patru cinci sase sapte opt noua zece unsprezece';
  const BASE = E.itemId('ro', FIRST);
  assert.equal(BASE, 'ro-unu-doi-trei-patru-cinci-sase-sapte-opt-noua-zece-unsprezece');
  const TAIL = (s) => entry({ text: FIRST + ', ' + s });
  assert.equal(E.itemId('ro', FIRST + ', iar după aceea urmează cu totul altceva, o poveste întreagă despre un lucru foarte diferit'), BASE, 'același id: începutul este același');
  put(d, BASE, entry({ text: FIRST }));
  put(d, BASE + '-2', TAIL('iar după aceea urmează cu totul altceva, o poveste întreagă despre un lucru foarte diferit'));
  r = validate(d, '--strict'); assert.equal(r.status, 0, r.out);
  put(d, BASE + '-12', TAIL('și încă o dată o cu totul altă poveste, care nu seamănă deloc cu celelalte două, nici ca temă, nici ca ton'));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /-12\.json: the file name must be ro-unu-doi/);
  fs.rmSync(path.join(d, 'data', 'items', BASE + '-12.json'));
  fs.rmSync(path.join(d, 'data', 'items', BASE + '-2.json'));
  fs.rmSync(path.join(d, 'data', 'items', BASE + '.json'));
  r = validate(d, '--strict'); assert.equal(r.status, 0, r.out);

  put(d, 'ro-alt-nume', entry({ text: 'Un text nou despre ceva anume.' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /ro-alt-nume\.json: the file name must be ro-un-text-nou-despre-ceva-anume\.json/);
  fs.rmSync(path.join(d, 'data', 'items', 'ro-alt-nume.json'));

  // duplicat exact (alte majuscule, diacritice, punctuație): eroare
  put(d, 'ro-cine-se-aseamana-se-aduna-3', entry({ text: 'CINE SE ASEAMANA, SE ADUNA!' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /duplicate of data\/items\/ro-cine-se-aseamana-se-aduna\.json/);
  fs.rmSync(path.join(d, 'data', 'items', 'ro-cine-se-aseamana-se-aduna-3.json'));

  // aproape duplicat: avertisment (ieșire 0, dar 1 cu --strict)
  put(d, 'ro-cine-se-aseamana-se-aduna-bine', entry({ text: 'Cine se aseamănă se adună bine' }));
  r = validate(d); assert.equal(r.status, 0, r.out); assert.match(r.out, /warning: .*very similar to .*\(\d\d%\)/);
  r = validate(d, '--strict'); assert.equal(r.status, 1);
  fs.rmSync(path.join(d, 'data', 'items', 'ro-cine-se-aseamana-se-aduna-bine.json'));
  put(d, 'ro-un-text-nou-despre-ceva-anume', entry());
  assert.equal(validate(d, '--strict').status, 0);

  // același text în altă limbă nu este duplicat
  put(d, 'hu-un-text-nou-despre-ceva-anume', entry({ lang: 'hu' }));
  assert.equal(validate(d, '--strict').status, 0);

  // schemă încălcată
  put(d, 'ro-un-text-nou-despre-ceva-anume', entry({ type: 'poem' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /ro-un-text-nou-despre-ceva-anume\.json: type: 'poem' is not one of/);
  put(d, 'ro-un-text-nou-despre-ceva-anume', entry({ region: 'Moldova\n' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /region: no control characters or line breaks allowed/);
  put(d, 'ro-un-text-nou-despre-ceva-anume', entry({ text: 'a\ud800b' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /half of a surrogate pair/);
  put(d, 'ro-un-text-nou-despre-ceva-anume', entry({ id: 'x' }));
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /Additional properties are not allowed/);
  put(d, 'ro-un-text-nou-despre-ceva-anume', 'nu e json');
  r = validate(d); assert.equal(r.status, 1); assert.match(r.out, /not valid JSON/);
  put(d, 'ro-un-text-nou-despre-ceva-anume', '[1]');
  r = validate(d); assert.equal(r.status, 1);
  fs.rmSync(path.join(d, 'data', 'items', 'ro-un-text-nou-despre-ceva-anume.json'));
  fs.rmSync(path.join(d, 'data', 'items', 'hu-un-text-nou-despre-ceva-anume.json'));
  assert.equal(validate(d, '--strict').status, 0);

  // șablonul: doar schema (numele și duplicatele nu se verifică), dar schema da
  put(d, 'example', Object.assign(entry(), { text: 'Cine se aseamănă, se adună.' }));
  assert.equal(validate(d, '--strict').status, 0, 'șablonul poate repeta o intrare');
  put(d, 'example', entry({ type: 'poem' }));
  assert.equal(validate(d).status, 1);
  fs.copyFileSync(path.join(ROOT, 'data', 'items', 'example.json'), path.join(d, 'data', 'items', 'example.json'));
  assert.equal(validate(d, '--strict').status, 0);
});

T('validate.py: plăcile județelor — dublură de cod, poziție ocupată, cod lipsă sau în plus, câmp în plus', () => {
  const d = tree();
  const f = path.join(d, 'data', 'counties.json');
  const orig = JSON.parse(fs.readFileSync(f, 'utf8'));
  const run = (mut, re) => {
    const o = JSON.parse(JSON.stringify(orig)); mut(o);
    fs.writeFileSync(f, JSON.stringify(o));
    const r = validate(d); assert.equal(r.status, 1, re + '\n' + r.out); assert.match(r.out, re);
  };
  run((o) => { o.counties[1].code = o.counties[0].code; }, /duplicate county code|must be exactly the ones/);
  run((o) => { o.counties[1].col = o.counties[0].col; o.counties[1].row = o.counties[0].row; }, /share the cell/);
  run((o) => { o.counties.pop(); }, /counties/);
  run((o) => { o.counties[0].code = 'RO-ZZ'; }, /must be exactly the ones schema\.json accepts|does not match|is not one of/);
  run((o) => { o.counties[0].extra = 1; }, /Additional properties are not allowed/);
  run((o) => { o.counties[0].col = 9; }, /greater than the maximum|9/);
  fs.writeFileSync(f, JSON.stringify(orig));
  assert.equal(validate(d, '--strict').status, 0);
});

// ——— scripts/import_bundle.py ———
T('import_bundle.py: --dry-run nu scrie nimic; scrierea creează fișiere identice cu cele pe care le scrie pagina (itemToJson), cu nume bune, apoi validate.py trece', () => {
  const d = tree();
  const a = E.canonicalItem(entry({ text: 'Ce ție nu-ți place, altuia nu-i face.', translations: { fr: 'Ne fais pas aux autres…', en: 'Do not do to others …' }, county: 'RO-IS', region: 'Moldova' }));
  const b = E.canonicalItem(entry({ type: 'riddle', text: 'Ce are dinți și nu mușcă?\nGhici!', answer: 'Pieptenele', notes: 'tab\\nu' }));
  const c = E.canonicalItem(entry({ lang: 'hu', text: 'Addig nyújtózkodj, amíg a takaród ér.', region: 'Transilvania', translations: { ro: 'Întinde-te cât te ține pătura.' } }));
  const f = bundle(d, JSON.parse(E.makeBundle([a, b, c])).entries);
  const before = list(d);
  let r = importer(d, f, '--dry-run');
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /would write ro-ce-tie-nu-ti-place-altuia-nu-i-face/);
  assert.match(r.out, /3 written, 0 skipped, 0 with problems/);
  assert.deepEqual(list(d), before, 'nimic scris');
  r = importer(d, f);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /^write ro-ce-tie-nu-ti-place-altuia-nu-i-face$/m);
  assert.match(r.out, /^write hu-addig-nyujtozkodj-amig-a-takarod-er$/m);
  for (const [name, o] of [['ro-ce-tie-nu-ti-place-altuia-nu-i-face', a], ['ro-ce-are-dinti-si-nu-musca-ghici', b], ['hu-addig-nyujtozkodj-amig-a-takarod-er', c]]) {
    assert.ok(list(d).includes(name + '.json'), name + ' lipsește din ' + list(d).join(', '));
    assert.equal(fs.readFileSync(path.join(d, 'data', 'items', name + '.json'), 'utf8'), E.itemToJson(o), name + ': același conținut ca la «Descarcă»');
    assert.equal(name, E.itemId(o.lang, o.text));
  }
  assert.equal(validate(d, '--strict').status, 0);
  // a doua rulare: nimic nou, totul sărit
  r = importer(d, f);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /0 written, 3 skipped, 0 with problems/);
  assert.match(r.out, /skip ro-ce-tie-nu-ti-place-altuia-nu-i-face: already present as ro-ce-tie-nu-ti-place-altuia-nu-i-face\.json/);
});

T('import_bundle.py: același început → sufix -2, -3; text la fel (alte litere, punctuație) → sărit; foarte asemănător → scris și raportat; nimic nu se suprascrie', () => {
  const d = tree();
  const orig = fs.readFileSync(path.join(d, 'data', 'items', 'ro-cine-se-aseamana-se-aduna.json'), 'utf8');
  const f = bundle(d, [
    entry({ text: 'Cine se aseamănă, se adună, dar nu oricum și nu oriunde, ci numai unde este loc pentru toți.' }),   // alt text, același început? nu: id mai lung
    entry({ text: 'CINE SE ASEAMANA SE ADUNA' }),                                  // identic cu cel din arbore
    entry({ text: 'Cine se aseamănă se adună bine' }),                              // foarte asemănător
    entry({ text: 'Cine se aseamănă se adună bine', lang: 'hu' }),                  // altă limbă: scris
    entry({ text: 'Alt text', translations: { en: 'Other text' } }),
    entry({ text: 'Alt text. Cu o a doua propoziție pe care nu o mai are cealaltă variantă.' })
  ]);
  const r = importer(d, f);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /skip ro-cine-se-aseamana-se-aduna: already present as ro-cine-se-aseamana-se-aduna\.json/);
  assert.match(r.out, /warning: ro-cine-se-aseamana-se-aduna-bine is very similar to ro-cine-se-aseamana-se-aduna\.json \(\d\d%\)/);
  assert.equal(fs.readFileSync(path.join(d, 'data', 'items', 'ro-cine-se-aseamana-se-aduna.json'), 'utf8'), orig, 'nimic suprascris');
  assert.ok(list(d).includes('hu-cine-se-aseamana-se-aduna-bine.json'));
  assert.ok(list(d).includes('ro-alt-text.json'));
  assert.ok(list(d).includes('ro-alt-text-cu-o-a-doua-propozitie-pe-care-nu-o-mai-are-cealalta-v.json') || list(d).some((n) => n.startsWith('ro-alt-text-cu-o-a-doua')));
  // două intrări cu același început în același fișier de contribuție: -2
  const f2 = bundle(d, [entry({ text: 'Zi bună, dimineață frumoasă' }), entry({ text: 'Zi bună! Dimineață frumoasă? Nu chiar.' }), entry({ text: 'Zi bună; dimineață frumoasă, desigur și altfel' })], 'b2.json');
  assert.equal(importer(d, f2).status, 0);
  assert.ok(list(d).includes('ro-zi-buna-dimineata-frumoasa.json'));
  assert.ok(list(d).some((n) => /^ro-zi-buna-dimineata-frumoasa-(2|nu-chiar)/.test(n)), list(d).join(' '));
  assert.equal(validate(d).status, 0);
});

T('import_bundle.py: intrări ostile — fiecare e raportată cu numărul ei, celelalte se scriu, ieșirea este 1; câmpurile necunoscute (și «id») sunt respinse', () => {
  const d = tree();
  const before = list(d);
  const hostile = [
    5, null, 'text', [],
    entry({ id: 'ro-x' }), entry({ lang: 'RO' }), entry({ region: 'Moldova\n' }), entry({ text: '' }), entry({ text: 'a\ud800b' }), entry({ text: 'x'.repeat(20001) }),
    entry({ type: 'charm', purpose: 'p' }), entry({ source_url: 'http://x.org' }), entry({ county: 'RO-ZZ' }),
    entry({ text: 'Singura intrare bună din fișier.' })
  ];
  const f = bundle(d, JSON.stringify({ format: 'graiul-bundle', version: 1, entries: hostile }));
  const r = importer(d, f);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /1 written, 0 skipped, 13 with problems/);
  assert.match(r.out, /entry 1: not an object/);
  assert.match(r.out, /entry 5 \(.*\): unknown field\(s\): id/);
  assert.deepEqual(list(d), before.concat(['ro-singura-intrare-buna-din-fisier.json']).sort());
  assert.equal(validate(d).status, 0);
});

T('import_bundle.py: formate respinse cu ieșirea 2 și fără nicio scriere (nu e JSON, alt format, altă versiune, prea multe intrări, fișier lipsă, fără argument)', () => {
  const d = tree();
  const before = list(d);
  const code = (f, ...flags) => { const r = importer(d, f, ...flags); assert.deepEqual(list(d), before, 'nimic scris'); return r; };
  const cases = [
    ['nu e json', 'nu e json', /cannot read/],
    ['listă', '[]', /not a GRAIUL contribution file/],
    ['alt format', '{"format":"glosar-bundle","version":1,"entries":[]}', /not a GRAIUL contribution file/],
    ['altă versiune', '{"format":"graiul-bundle","version":2,"entries":[]}', /not a GRAIUL contribution file/],
    ['intrări obiect', '{"format":"graiul-bundle","version":1,"entries":{}}', /not a GRAIUL contribution file/],
    ['fără intrări', '{"format":"graiul-bundle","version":1}', /not a GRAIUL contribution file/],
    ['prea multe', JSON.stringify({ format: 'graiul-bundle', version: 1, entries: Array.from({ length: 501 }, (_, i) => entry({ text: 'Text ' + i })) }), /too many entries \(501; the limit is 500\)/]
  ];
  for (const [name, content, re] of cases) {
    const f = bundle(d, content, 'x.json');
    const r = code(f);
    assert.equal(r.status, 2, name + ': ' + r.out);
    assert.match(r.out, re, name);
  }
  let r = importer(d, path.join(d, 'nu-exista.json'));
  assert.equal(r.status, 2); assert.match(r.out, /cannot read/);
  r = py([path.join(d, 'scripts', 'import_bundle.py')], { cwd: d });
  assert.equal(r.status, 2); assert.match(r.out, /Turn a contribution file/);
  // 500 de intrări sunt în regulă
  const f = bundle(d, Array.from({ length: 500 }, (_, i) => entry({ text: 'Proverb numărul ' + (1000 + i) + ' din listă' })), 'ok500.json');
  r = importer(d, f, '--dry-run');
  assert.equal(r.status, 0, r.out.slice(-400));
  assert.match(r.out, /500 written, 0 skipped, 0 with problems/);
});

T('fișierul de contribuție făcut de pagină (makeBundle) este citit de scriptul Python, iar ce a refuzat parseBundle refuză și el', () => {
  const d = tree();
  const good = [entry({ text: 'Primul text cu diacritice: șțăîâ.' }), entry({ type: 'carol', lang: 'hu', text: 'Egy kolinda\nmásodik sorral', region: 'Transilvania', county: 'RO-CJ', translations: { en: 'A carol' }, source: 'a book', status: 'sourced', source_url: 'https://example.org/k', license: 'public-domain' })];
  const f = path.join(d, 'page.json');
  fs.writeFileSync(f, E.makeBundle(good, '2026-11-17T10:00:00Z'));
  const pb = E.parseBundle(fs.readFileSync(f, 'utf8'));
  assert.equal(pb.errors.length, 0);
  const r = importer(d, f);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /2 written, 0 skipped, 0 with problems/);
  assert.equal(validate(d, '--strict').status, 0);
  // listă de intrări greșite: aceleași pe ambele părți
  const bad = [M({ lang: 'RO' }), M({ type: 'riddle' }), M({ county: 'RO-ZZ' }), M({ status: 'sourced' }), M({ region: 'a\nb' }), M({ source: '' }), M({ translations: {} })];
  const fb = bundle(d, JSON.stringify({ format: 'graiul-bundle', version: 1, entries: bad }), 'bad.json');
  assert.equal(E.parseBundle(fs.readFileSync(fb, 'utf8')).errors.length, bad.length);
  const rb = importer(d, fb);
  assert.equal(rb.status, 1); assert.match(rb.out, /0 written, 0 skipped, 7 with problems/);
});

// ——— scripts/potd.mjs ———
test('scripts/potd.mjs: scrie o pagină statică și potd.json cu același proverb ca motorul; data nevalidă sau fără proverbe dă eroare', async () => {
  const potd = await import(pathToFileURL(path.join(ROOT, 'scripts', 'potd.mjs')).href);
  const out = mktmp();
  const r = potd.run(['--date', '2026-11-17', '--out', out, '--json']);
  const items = potd.loadItems(path.join(ROOT, 'data', 'items'));
  assert.equal(r.id, E.potdPick(items, '2026-11-17').id);
  const j = JSON.parse(fs.readFileSync(path.join(out, 'potd.json'), 'utf8'));
  assert.equal(j.id, r.id); assert.equal(j.date, '2026-11-17');
  const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  assert.ok(html.includes('<title>GRAIUL · 2026-11-17</title>'));
  assert.ok(html.includes(j.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')));
  assert.ok(!/<script|<style|\sstyle=|\son[a-z]+=/i.test(html), 'fără scripturi, stiluri sau atribute de eveniment');
  assert.ok(html.includes("default-src 'none'"));
  // aceeași dată → același proverb; ciclul acoperă toate proverbele
  const ps = items.filter((e) => e.type === 'proverb');
  const seen = new Set();
  for (let n = 0; n < ps.length; n++) seen.add(potd.run(['--date', new Date((20800 + n) * 86400000).toISOString().slice(0, 10), '--out', out]).id);
  assert.equal(seen.size, ps.length);
  assert.throws(() => potd.run(['--date', '2026-02-30', '--out', out]), /data nu este validă/);
  assert.throws(() => potd.run(['--date', 'azi', '--out', out]), /data nu este validă/);
  // fără proverbe
  const empty = mktmp(); fs.mkdirSync(path.join(empty, 'data', 'items'), { recursive: true });
  fs.writeFileSync(path.join(empty, 'data', 'items', 'example.json'), '{}');
  assert.throws(() => potd.run(['--date', '2026-11-17', '--out', path.join(empty, 'o')], empty), /nu există proverbe/);
});

test('scripts/potd.mjs: textul din date este scos în HTML cu escape (nu se poate injecta marcaj) și adresa sursei devine legătură doar dacă este https', async () => {
  const potd = await import(pathToFileURL(path.join(ROOT, 'scripts', 'potd.mjs')).href);
  const evil = { type: 'proverb', lang: 'ro"><b>', text: '<img src=x onerror=alert(1)> & "q" \'a\'\nrând', region: '<r>', source: '<s>', source_url: 'javascript:alert(1)', translations: { en: '<i>t</i>' }, county: 'RO-B' };
  const h = potd.page(evil, '2026-11-17');
  assert.ok(!h.includes('<img') && !h.includes('<b>') && !h.includes('<i>') && !h.includes('<r>') && !h.includes('<s>'), 'marcaj neescapat');
  assert.ok(h.includes('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;q&quot; &#39;a&#39;<br>rând'));
  assert.ok(!h.includes('href="javascript'), 'adresă care nu e https');
  assert.ok(h.includes('<a href="https://graiul.chiuta.ro/">'));
  const h2 = potd.page({ type: 'proverb', lang: 'ro', text: 't', region: 'r', source: 'S', source_url: 'https://x.org/a?b=1&c="2"' }, '2026-11-17');
  assert.ok(h2.includes('<a href="https://x.org/a?b=1&amp;c=&quot;2&quot;" rel="noopener noreferrer">S</a>'));
});

test('package.json: scripturile test, build și check, Node.js 24 sau mai nou, fără dependențe', () => {
  const p = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(p.type, 'module'); assert.equal(p.engines.node, '>=24');
  assert.equal(p.scripts.test, 'node --test "test/*.test.mjs"');
  assert.equal(p.scripts.build, 'node scripts/build.mjs');
  assert.match(p.scripts.check, /build\.mjs --check/); assert.match(p.scripts.check, /validate\.py/);
  assert.equal(p.dependencies, undefined); assert.equal(p.devDependencies, undefined);
  assert.equal(p.version, JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'app.json'), 'utf8')).version);
});
