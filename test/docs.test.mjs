import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import I18N from '../src/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu'];
const sfx = (l) => (l === 'en' ? '' : '.' + l);
const GUIDE = { en: read('docs/contributor-guide.md'), ro: read('docs/contributor-guide.ro.md') };
const COLL = { en: read('docs/collecting-guide.md'), ro: read('docs/collecting-guide.ro.md') };
const ui = read('src/ui.js');
const pkg = JSON.parse(read('package.json'));
const app = JSON.parse(read('src/app.json'));
const items = fs.readdirSync(path.join(ROOT, 'data', 'items')).filter((f) => f.endsWith('.json') && f !== 'example.json');

// Blocuri de cod, fără comentariile de la sfârșitul rândurilor (ele sunt scrise în limba ghidului).
function blocks(t) { return [...t.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)].map((m) => ({ info: m[1].trim(), body: m[2].split('\n').map((l) => l.replace(/\s+#.*$/, '')).join('\n') })); }
const h2 = (t) => (t.match(/^## /gm) || []).length;

test('ghidurile există în engleză și română, au aceleași blocuri de comenzi, aceleași secțiuni și trimit unul la altul', () => {
  assert.deepEqual(blocks(GUIDE.en), blocks(GUIDE.ro));
  assert.equal(blocks(COLL.en).length, 0); assert.equal(blocks(COLL.ro).length, 0);
  assert.match(GUIDE.en, /\[Română\]\(contributor-guide\.ro\.md\)/);
  assert.match(GUIDE.ro, /\[English\]\(contributor-guide\.md\)/);
  assert.match(COLL.en, /\[Română\]\(collecting-guide\.ro\.md\)/);
  assert.match(COLL.ro, /\[English\]\(collecting-guide\.md\)/);
  assert.equal(h2(GUIDE.en), 8); assert.equal(h2(GUIDE.ro), 8);
  assert.equal(h2(COLL.en), 5); assert.equal(h2(COLL.ro), 5);
  assert.match(GUIDE.en, /`collecting-guide\.md`/); assert.match(GUIDE.ro, /`collecting-guide\.ro\.md`/);
  assert.match(COLL.en, /`contributor-guide\.md`/); assert.match(COLL.ro, /`contributor-guide\.ro\.md`/);
});

test('numele butoanelor și filelor din ghidul de contribuție sunt exact cele din interfață, în engleză și în română', () => {
  const MAP = ['tab_add', 'tab_export', 'a_check', 'a_add', 'a_add_any', 'a_more', 'b_h', 'x_json'];
  for (const lang of ['en', 'ro']) {
    const text = GUIDE[lang];
    const bold = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]);
    for (const key of MAP) assert.ok(bold.includes(I18N[lang][key]), lang + ': eticheta «' + I18N[lang][key] + '» (' + key + ') nu apare ca text îngroșat în ghid');
    // fiecare nume după «press / apasă / open the / deschide fila» este un text din interfață
    const all = Object.values(I18N[lang]);
    const named = [...text.matchAll(/(?:[Pp]ress|[Aa]pasă|[Oo]pen the|[Dd]eschide fila|[Uu]nder|[Ll]a) \*\*([^*]+)\*\*/g)].map((m) => m[1]);
    assert.ok(named.length >= 5, lang + ': ' + named.length + ' nume de butoane');
    for (const b of named) assert.ok(all.some((s) => s === b || s.startsWith(b)), lang + ': «' + b + '» nu e un text din interfață');
  }
});

test('numele din interfață folosite în textul de contribuție din CONTRIBUTING sunt cele din I18N, în fiecare limbă', () => {
  const QU = { en: ['“', '”'], ro: ['«', '»'], fr: ['« ', ' »'], it: ['«', '»'], es: ['«', '»'], pt: ['«', '»'], de: ['„', '“'], hu: ['„', '”'] };
  for (const l of LANGS) {
    const t = read('CONTRIBUTING' + sfx(l) + '.md');
    for (const k of ['tab_add', 'tab_export', 'a_check', 'a_add', 'b_h', 'x_json']) assert.ok(t.includes(QU[l][0] + I18N[l][k] + QU[l][1]), 'CONTRIBUTING' + sfx(l) + ': ' + k);
    assert.ok(t.includes('scripts/validate.py') && t.includes('scripts/import_bundle.py'), 'CONTRIBUTING' + sfx(l));
    assert.ok(t.includes('docs/contributor-guide') && t.includes('docs/collecting-guide'), 'CONTRIBUTING' + sfx(l) + ': ghidurile');
  }
});

test('limitele din ghiduri și din mesaje sunt cele din cod: 500 de intrări în lista ta, 200 de rânduri o dată, 500 într-un fișier de contribuție, 8 MB, 4 milioane de caractere în browser', () => {
  assert.equal(E.LIMITS.own, 500); assert.equal(E.LIMITS.bulk, 200); assert.equal(E.LIMITS.bundle, 500);
  assert.match(ui, /MAX_FILE = 8000000/); assert.match(ui, /MAX_STORE_CHARS = 4000000/);
  assert.ok(/500 entries at most/.test(GUIDE.en), 'en: 500'); assert.ok(/500 de intrări/.test(GUIDE.ro), 'ro: 500');
  assert.ok(/8 MB/.test(GUIDE.en) || !/MB/.test(GUIDE.en));
  // mesajele primesc limitele din LIMITS (nu numere scrise în text), iar textele au loc pentru ele
  for (const [key, lim] of [['a_full', 'own'], ['b_help', 'bulk'], ['e_many', 'bundle']]) {
    assert.ok(new RegExp("L\\.f\\('" + key + "', LIMITS\\." + lim + "\\)").test(ui), key + ' primește LIMITS.' + lim);
    for (const l of LANGS.filter((x) => I18N[x])) assert.ok(/\{0\}/.test(I18N[l][key]), l + '/' + key + ' are {0}');
  }
  assert.ok(/8 MB/.test(I18N.en.e_big) || /e_big/.test(ui));
});

test('fișierele și comenzile din ghiduri există: scripturi, opțiuni și exemple de nume de fișier', () => {
  for (const lang of ['en', 'ro']) {
    const t = GUIDE[lang] + '\n' + COLL[lang];
    const paths = new Set([...t.matchAll(/`((?:docs|scripts|data|src)\/[A-Za-z0-9_.\-/<>àâăîșțéèêëçüöäőűíóúñ ]+)`/g)].map((m) => m[1]).filter((p) => !/[<> ]/.test(p)));
    assert.ok(paths.size >= 1, lang + ': ' + paths.size + ' căi');
    for (const b of blocks(t)) for (const m of b.body.matchAll(/(?:scripts|docs)\/[A-Za-z0-9_.\-]+/g)) assert.ok(fs.existsSync(path.join(ROOT, m[0])), lang + ': lipsește ' + m[0] + ' (din blocul de cod)');
    for (const p of paths) assert.ok(fs.existsSync(path.join(ROOT, p)), lang + ': lipsește ' + p);
  }
  // opțiunile folosite în ghid sunt cele din scripturi
  assert.match(read('scripts/import_bundle.py'), /"--dry-run"/);
  assert.match(read('scripts/validate.py'), /"--strict"/);
  assert.match(read('scripts/validate.py'), /"--list"/);
  assert.match(read('scripts/potd.mjs'), /'--out'/); assert.match(read('scripts/potd.mjs'), /'--date'/); assert.match(read('scripts/potd.mjs'), /'--json'/);
  // numele din exemple sunt chiar intrări sau reguli ale motorului
  assert.ok(items.includes('ro-cine-se-aseamana-se-aduna.json'));
  assert.equal(E.itemId('ro', 'Cine se aseamănă, se adună.'), 'ro-cine-se-aseamana-se-aduna');
  assert.equal(E.itemId('ro', 'Cine se aseamănă, se adună.'), E.itemId('ro', 'cine se aseamana se aduna'), 'cu sau fără diacritice, același nume de fișier');
});

test('README, CHANGELOG, CONTRIBUTING și ISSUES_GOOD_FIRST au aceeași versiune și dată în toate cele opt limbi', () => {
  assert.equal(pkg.version, app.version);
  const WORD = { en: ['Version', 'Last updated'], ro: ['Versiune', 'Ultima actualizare'] };
  for (const l of LANGS) {
    for (const base of ['README', 'CONTRIBUTING']) {
      const t = read(base + sfx(l) + '.md');
      const m = t.match(/^(.+?): (\d+\.\d+\.\d+) · (.+?): (\d{4}-\d{2}-\d{2})$/m);
      assert.ok(m, base + sfx(l) + ': linia de versiune');
      assert.equal(m[2], pkg.version, base + sfx(l)); assert.equal(m[4], app.updated, base + sfx(l));
      if (WORD[l]) assert.deepEqual([m[1], m[3]], WORD[l], base + sfx(l));
    }
    const c = read('CHANGELOG' + sfx(l) + '.md');
    assert.ok(c.includes('## [' + pkg.version + '] - ' + app.updated), 'CHANGELOG' + sfx(l));
    assert.ok(c.indexOf('## [Unreleased]') < c.indexOf('## [' + pkg.version + ']') && c.indexOf('## [' + pkg.version + ']') < c.indexOf('## [0.1.0]'), 'CHANGELOG' + sfx(l) + ': ordinea versiunilor');
  }
});

test('README: cifrele (zece intrări de pornire, 42 de plăci), legăturile spre ghiduri, scripturi și cerințele (ES2017, Node.js 24) în toate limbile', () => {
  assert.ok(items.length >= 10);
  for (const l of LANGS) {
    const t = read('README' + sfx(l) + '.md');
    assert.ok(/\b10\b/.test(t), 'README' + sfx(l) + ': 10');
    assert.ok(/\b42\b/.test(t), 'README' + sfx(l) + ': 42');
    assert.ok(t.includes('docs/contributor-guide') && t.includes('docs/collecting-guide') && t.includes('scripts/import_bundle.py') && t.includes('scripts/validate.py') && t.includes('scripts/potd.mjs'), 'README' + sfx(l));
    assert.ok(t.includes('https://graiul.chiuta.ro'));
    assert.ok(/ES2017/.test(t) && /Node\.js 24/.test(t), 'README' + sfx(l) + ': cerințele');
  }
  assert.equal(pkg.engines.node, '>=24');
  assert.equal(fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim(), 'graiul.chiuta.ro');
  // sarcinile de început: zece, aceleași în toate limbile, iar fișierul pentru create_issues.sh are titlurile englezești
  const issue = (l) => [...read('ISSUES_GOOD_FIRST' + sfx(l) + '.md').matchAll(/^- \[ \] (.+)$/gm)].map((m) => m[1]);
  for (const l of LANGS) assert.equal(issue(l).length, 10, 'ISSUES_GOOD_FIRST' + sfx(l));
  assert.deepEqual(read('good-first-issues.txt').trim().split('\n'), issue('en'));
});

test('limitele din README sunt aceleași texte ca în interfață, în fiecare limbă', () => {
  for (const l of LANGS) {
    const t = read('README' + sfx(l) + '.md');
    for (let i = 1; i <= 6; i++) assert.ok(t.includes(I18N[l]['lim_' + i]), 'README' + sfx(l) + ': lim_' + i);
    assert.ok(t.includes('## ' + I18N[l].h_limits), 'README' + sfx(l) + ': titlul');
  }
});

test('fluxul de lucru rulează validarea, testele și verificarea construcției pe Ubuntu 26.04 cu Node.js 26', () => {
  const y = read('.github/workflows/validate.yml');
  assert.match(y, /runs-on: ubuntu-26\.04/);
  assert.match(y, /node-version: 26/);
  for (const c of ['python scripts/validate.py', 'node --test "test/*.test.mjs"', 'node scripts/build.mjs --check', 'pip install jsonschema']) assert.ok(y.includes(c), c);
  assert.ok(!/ubuntu-latest/.test(y));
});

test('șabloanele de pe GitHub trimit la pagină, la ghidul de culegere și la validator', () => {
  const n = read('.github/ISSUE_TEMPLATE/new-entry.md'), p = read('.github/PULL_REQUEST_TEMPLATE.md');
  assert.match(n, /labels: data/);
  assert.ok(n.includes('“' + I18N.en.x_json + '”'), 'numele butonului din interfață');
  assert.ok(n.includes('tab “' + I18N.en.tab_add + '”') && n.includes('tab “' + I18N.en.tab_export + '”'));
  assert.ok(n.includes('docs/collecting-guide.md') && fs.existsSync(path.join(ROOT, 'docs', 'collecting-guide.md')));
  for (const c of E.CONSENTS) assert.ok(n.includes('`' + c + '`'), c);
  assert.match(p, /scripts\/validate\.py/); assert.match(p, /npm test/); assert.match(p, /consent/);
});

test('fișierele de proiect: licență MIT, codul de conduită în opt limbi, FUNDING, .gitignore și CNAME', () => {
  assert.match(read('LICENSE'), /MIT License/);
  for (const l of LANGS) assert.ok(fs.existsSync(path.join(ROOT, 'CODE_OF_CONDUCT' + sfx(l) + '.md')), 'CODE_OF_CONDUCT' + sfx(l));
  assert.ok(fs.existsSync(path.join(ROOT, '.github', 'FUNDING.yml')));
  assert.match(read('.gitignore'), /node_modules/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'node_modules')), 'nu sunt dependențe');
});
