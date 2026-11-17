import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const DIR = path.join(ROOT, 'data', 'items');
const schema = rd('schema.json');
const cschema = rd('counties.schema.json');
const counties = rd('data/counties.json');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
const dataFiles = files.filter((f) => f !== 'example.json');
const items = dataFiles.map((f) => ({ file: f, base: f.replace(/\.json$/, ''), e: rd('data/items/' + f) }));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('schema.json și motorul au aceleași câmpuri, enumerări și limite', () => {
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['type', 'lang', 'text', 'region', 'source']);
  assert.deepEqual(Object.keys(schema.properties), ['type', 'lang', 'text', 'region', 'county', 'translations', 'answer', 'purpose', 'notes', 'collector', 'consent', 'source', 'source_url', 'license', 'status', 'reviewed_by']);
  const p = schema.properties;
  assert.deepEqual(p.type.enum, E.TYPES);
  assert.deepEqual(p.county.enum, E.COUNTY_CODES);
  assert.deepEqual(p.consent.enum, E.CONSENTS);
  assert.deepEqual(p.license.enum, E.LICENSES);
  assert.deepEqual(p.status.enum, E.STATUSES);
  assert.equal(p.text.maxLength, E.LIMITS.text);
  assert.equal(p.region.maxLength, E.LIMITS.region);
  assert.equal(p.answer.maxLength, E.LIMITS.answer);
  assert.equal(p.purpose.maxLength, E.LIMITS.purpose);
  assert.equal(p.notes.maxLength, E.LIMITS.notes);
  assert.equal(p.collector.maxLength, E.LIMITS.collector);
  assert.equal(p.source.maxLength, E.LIMITS.source);
  assert.equal(p.reviewed_by.maxLength, E.LIMITS.reviewed_by);
  assert.equal(p.translations.maxProperties, E.LIMITS.translations);
  assert.equal(p.translations.additionalProperties.maxLength, E.LIMITS.text);
  assert.match(p.source_url.pattern, new RegExp('\\{1,' + E.LIMITS.url + '\\}\\$$'));
  // a patra regulă: «riddle → answer», «charm → purpose + consent», «collector → consent», «sourced → source_url», «reviewed → reviewed_by»
  assert.equal(schema.allOf.length, 5);
});

test('schema.json: tiparele pentru caractere de control sunt aceleași ca în motor (text și traduceri: rând nou permis; restul: nu)', () => {
  const p = schema.properties;
  const line = new RegExp(p.region.pattern), block = new RegExp(p.text.pattern);
  for (const f of ['region', 'answer', 'purpose', 'collector', 'source', 'reviewed_by']) assert.equal(p[f].pattern, p.region.pattern, f);
  for (const f of ['notes']) assert.equal(p[f].pattern, p.text.pattern, f);
  assert.equal(p.translations.additionalProperties.pattern, p.text.pattern);
  for (const c of ['\u0000', '\u0001', '\t', '\r', '\u001f', '\u007f']) assert.equal(line.test('a' + c + 'b'), false, JSON.stringify(c));
  assert.equal(line.test('a\nb'), false);
  assert.equal(block.test('a\nb'), true);
  for (const c of ['\u0000', '\u0001', '\u0008', '\r', '\u001f', '\u007f']) assert.equal(block.test('a' + c + 'b'), false, JSON.stringify(c));
  assert.equal(block.test('a\tb'), false, 'tab-ul nu e permis în text (separă coloanele din TSV)');
  assert.equal(block.test('ș ț'), true);
});

test('hărțile județelor: 42 de plăci (41 de județe și București), coduri ISO 3166-2:RO unice, poziții unice în grila 9×8', () => {
  const c = counties.counties;
  assert.equal(c.length, 42);
  assert.deepEqual(c.map((x) => x.code).sort(), E.COUNTY_CODES.slice().sort());
  assert.equal(new Set(c.map((x) => x.code)).size, 42);
  assert.equal(new Set(c.map((x) => x.col + ',' + x.row)).size, 42, 'două plăci pe aceeași poziție');
  for (const x of c) {
    assert.deepEqual(Object.keys(x).sort(), ['code', 'col', 'name', 'row']);
    assert.ok(Number.isInteger(x.col) && x.col >= 0 && x.col <= 8, x.code + ' col');
    assert.ok(Number.isInteger(x.row) && x.row >= 0 && x.row <= 7, x.code + ' row');
    assert.ok(x.name.trim() === x.name && x.name.length >= 3, x.code);
  }
  assert.ok(!/[şţŞŢ]/.test(JSON.stringify(c)), 'fără sedilă');
  assert.equal(c.find((x) => x.code === 'RO-B').name, 'București');
  assert.equal(c.find((x) => x.code === 'RO-MM').name, 'Maramureș');
  assert.equal(c.find((x) => x.code === 'RO-TM').name, 'Timiș');
  assert.equal(c.find((x) => x.code === 'RO-CJ').name, 'Cluj');
  // nume unice
  assert.equal(new Set(c.map((x) => x.name)).size, 42);
  // vecinii rămân aproximativ la locul lor: Satu Mare la nord-vest, Constanța la sud-est, Timiș la vest, Iași la est
  const at = (code) => c.find((x) => x.code === code);
  assert.ok(at('RO-SM').col < at('RO-IS').col && at('RO-SM').row <= at('RO-IS').row);
  assert.ok(at('RO-CT').col > at('RO-TM').col && at('RO-CT').row > at('RO-SM').row);
  assert.ok(at('RO-TM').col < at('RO-B').col);
  assert.ok(at('RO-TL').col >= at('RO-CT').col - 1 && at('RO-TL').row <= at('RO-CT').row);
});

test('counties.schema.json descrie aceleași plăci', () => {
  const s = cschema;
  assert.equal(s.additionalProperties, false);
  const t = s.properties.counties;
  assert.equal(t.minItems, 42);
  assert.equal(t.maxItems, 42);
  const tile = t.items;
  assert.equal(tile.additionalProperties, false);
  assert.deepEqual(tile.required.slice().sort(), ['code', 'col', 'name', 'row']);
  assert.equal(tile.properties.col.maximum, 8);
  assert.equal(tile.properties.row.maximum, 7);
  assert.equal(tile.properties.col.minimum, 0);
  assert.equal(tile.properties.row.minimum, 0);
  assert.ok(new RegExp(tile.properties.code.pattern).test('RO-B') && new RegExp(tile.properties.code.pattern).test('RO-MM') && !new RegExp(tile.properties.code.pattern).test('ro-b'));
});

test('fiecare intrare e validă pentru motor, are numele de fișier așteptat, o sursă cu adresă și o licență', () => {
  assert.ok(items.length >= 10, items.length + ' intrări');
  const seen = new Set();
  for (const { file, base, e } of items) {
    assert.deepEqual(E.validateItem(e), [], file);
    const want = E.itemId(e.lang, e.text);
    assert.ok(base === want || new RegExp('^' + esc(want) + '-[2-9]\\d?$').test(base), file + ': numele trebuie să fie ' + want + '.json');
    assert.match(base, E.ID_RE, file);
    assert.ok(!seen.has(base)); seen.add(base);
    assert.ok(e.status === 'sourced' || e.status === 'reviewed', file + ': starea');
    assert.match(e.source_url, /^https:\/\//, file);
    assert.ok(E.LICENSES.includes(e.license), file + ': licența');
    assert.ok(e.region === E.UNLOCATED || e.county || e.region.length > 2, file + ': regiunea');
    assert.ok(e.source.trim() === e.source && e.text.trim() === e.text, file + ': spații la capete');
    assert.ok(!/[şţŞŢ]/.test(e.text), file + ': sedilă în text');
  }
});

test('invariante care rămân adevărate pe măsură ce arhiva crește: textul românesc cu virgulă (nu sedilă), traducerea din Wikiquote cere CC BY-SA, fără colector fără acord', () => {
  for (const { file, e } of items) {
    if (e.lang === 'ro') assert.ok(!/[şţŞŢ]/.test(e.text), file + ': sedilă în textul românesc');
    if (/wikiquote\.org/.test(e.source_url || '')) {
      assert.ok(['CC-BY-SA-4.0', 'public-domain'].includes(e.license), file + ': licența unui text din Wikiquote');
      if (e.translations && e.translations.en) assert.equal(e.license, 'CC-BY-SA-4.0', file + ': traducerea din Wikiquote este CC BY-SA 4.0');
    }
    if (e.type === 'charm') assert.ok(e.consent && e.purpose, file + ': descântec fără acord sau scop');
    if (e.collector) assert.ok(e.consent, file + ': colector fără acord');
    if (e.county) assert.ok(E.COUNTY_CODES.includes(e.county), file);
    if (e.county) assert.notEqual(e.region, E.UNLOCATED, file + ': județ cunoscut, regiune «unlocated»');
  }
});

test('datele nu au duplicate (aceeași limbă și același text, sau foarte asemănătoare)', () => {
  assert.deepEqual(E.duplicates(items.map((x) => x.e)).map((d) => [d.a.text, d.b.text]), []);
});

test('proverbul zilei: cu intrările din depozit fiecare proverb apare o dată pe ciclu, iar ziua de azi are un proverb', () => {
  const ps = items.filter((x) => x.e.type === 'proverb' && x.e.lang === 'ro').map((x) => Object.assign({ id: x.base }, x.e));
  const seen = new Set();
  for (let n = 0; n < ps.length; n++) seen.add(E.potdPick(ps, new Date((20800 + n) * 86400000).toISOString().slice(0, 10)).id);
  assert.equal(seen.size, ps.length);
  assert.ok(E.potdPick(ps, '2026-11-17'));
  assert.equal(E.potdPick(ps, '2026-11-17', 'ro').lang, 'ro');
});

test('data/items/example.json este un șablon valid, fără «translations» (un obiect cu o singură limbă ar fi luat de verificarea de limbi a kitului drept dicționar incomplet; câmpurile opționale sunt numite în «notes»), afișat doar în vitrină (nu în date)', () => {
  const ex = rd('data/items/example.json');
  assert.deepEqual(E.validateItem(ex), []);
  assert.equal(ex.status, 'draft');
  assert.ok(!('id' in ex));
  assert.equal(ex.translations, undefined);
  for (const f of ['county', 'translations', 'answer', 'purpose', 'collector', 'consent', 'source_url', 'license', 'status', 'reviewed_by']) assert.ok(ex.notes.includes(f), 'notes numește câmpul ' + f);
  assert.match(ex.source, /example/);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(!html.includes('"ro-cine-se-scoala-de-dimineata-departe-ajunge-2"'), 'șablonul nu intră în datele paginii');
  assert.equal(html.split('"source":"traditional (example entry)"').length - 1, 1, 'șablonul apare o dată, ca exemplu în vitrină');
  // numele fișierului-șablon nu este un nume de intrare: validate.py îl sare
  assert.ok(!dataFiles.includes('example.json'));
});

test('index.html: fiecare intrare din data/items/ apare o singură dată, iar versiunea paginii este cea din src/app.json', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const cfg = rd('src/app.json');
  for (const { base, e } of items) {
    assert.ok(html.includes('"text":' + JSON.stringify(e.text)), base + ': textul nu e în pagină');
    assert.equal(html.split('"' + base + '":').length - 1, 1, base + ': id-ul trebuie să apară o singură dată ca cheie');
  }
  assert.ok(html.includes('<meta name="application-version" content="' + cfg.version + '">'), 'meta application-version');
  assert.ok(html.includes('<meta name="last-updated" content="' + cfg.updated + '">'), 'meta last-updated');
  assert.ok(html.includes('id="app-version">v ' + cfg.version + ' · ' + cfg.updated), 'versiunea afișată');
});
