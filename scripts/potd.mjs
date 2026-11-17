#!/usr/bin/env node
// GRAIUL · proverbul zilei ca pagină statică, după aceeași regulă ca fila «Proverbul zilei» din aplicație (src/engine.mjs: potdPick).
//   node scripts/potd.mjs                       azi (data UTC) → potd/index.html
//   node scripts/potd.mjs --date 2026-12-01     o dată dată
//   node scripts/potd.mjs --out dir             scrie dir/index.html (implicit: potd/)
//   node scripts/potd.mjs --json                scrie și potd.json (date, id, text, traduceri, sursă) lângă pagină
// Citește data/items/*.json (fără example.json); id-ul unei intrări este numele fișierului. Pagina nu are scripturi și nici stiluri proprii.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { potdPick, dayNumber } from '../src/engine.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NAMES = { ro: 'română', en: 'English', fr: 'français', de: 'Deutsch', es: 'español', it: 'italiano', hu: 'magyar', pt: 'português' };

function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function today() { return new Date().toISOString().slice(0, 10); }

export function loadItems(dir) {
  const items = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json') && x !== 'example.json').sort()) {
    const o = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    o.id = f.replace(/\.json$/, '');
    items.push(o);
  }
  return items;
}

export function page(e, date) {
  const tr = Object.keys(e.translations || {}).sort();
  const src = /^https:\/\/\S+$/.test(e.source_url || '') ? `<a href="${esc(e.source_url)}" rel="noopener noreferrer">${esc(e.source)}</a>` : esc(e.source);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; form-action 'none'">
<title>GRAIUL · ${esc(date)}</title>
</head>
<body>
<main>
<h1>GRAIUL · ${esc(date)}</h1>
<blockquote lang="${esc(e.lang)}"><p>${esc(e.text).replace(/\n/g, '<br>')}</p></blockquote>
${tr.map((k) => `<p lang="${esc(k)}">${esc(NAMES[k] || k)}: ${esc(e.translations[k])}</p>`).join('\n')}
<p>Region: ${esc(e.region)}${e.county ? ' · ' + esc(e.county) : ''} · Source: ${src}${e.license ? ' · Licence: ' + esc(e.license) : ''}</p>
<p><a href="https://graiul.chiuta.ro/">graiul.chiuta.ro</a></p>
</main>
</body>
</html>
`;
}

export function run(argv, base = root) {
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const date = arg('--date') || today();
  if (dayNumber(date) !== dayNumber(date)) throw new Error('data nu este validă (AAAA-LL-ZZ): ' + date);
  const out = path.resolve(arg('--out') || path.join(base, 'potd'));
  const e = potdPick(loadItems(path.join(base, 'data', 'items')), date);
  if (!e) throw new Error('nu există proverbe în data/items/');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), page(e, date));
  if (argv.includes('--json')) {
    const j = { date, id: e.id, type: e.type, lang: e.lang, text: e.text, region: e.region, translations: e.translations || {}, source: e.source, source_url: e.source_url || null, license: e.license || null };
    fs.writeFileSync(path.join(out, 'potd.json'), JSON.stringify(j, null, 2) + '\n');
  }
  return { date, id: e.id, out };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = run(process.argv.slice(2));
    console.log(`${r.date}: ${r.id} → ${path.relative(process.cwd(), r.out) || '.'}/index.html`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
