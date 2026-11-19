# Jurnal de modificări

[English](CHANGELOG.md) · **Română** · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Nelansat]

## [0.2.1] - 2026-11-20

### Modificat
- fff-kit 1.8.1: când browserul blochează sau nu are stocare (`localStorage`/`sessionStorage` aruncă sau lipsesc), pagina pornește cu o stocare temporară în memorie, în loc să se oprească; datele nu se păstrează după închiderea paginii.
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși).

## [0.2.0] - 2026-11-17

### Adăugat
- Motorul din `src/engine.mjs`: căutare fără să țină seama de diacritice, cu ordonarea rezultatelor, validarea intrărilor, intrări identice și foarte asemănătoare, proverbul zilei, numărătoarea pe județe, export TSV, fișierul de contribuție și analizorul listelor lipite.
- Export TSV pentru foi de calcul: o celulă care începe cu `=`, `+`, `-` sau `@` primește un apostrof în față, ca Excel sau LibreOffice să nu o ruleze ca formulă (un text care chiar începe cu `-` arată deci un apostrof în foaie). Fișierul descărcat de pagină începe și cu un marcaj de ordine a octeților UTF-8, ca diacriticele să se vadă corect.
- Interfața din `src/ui.js`, `src/i18n.mjs` și `src/app.css`: căutare, proverbul zilei, harta județelor, adăugare (o intrare sau mai multe deodată), export, import și ghid; opt limbi, teme întunecată și luminoasă, tastatură, merge de la 360 px lățime, iar harta are o dispunere de rezervă pentru browsere fără CSS Grid.
- Grijă pentru cei care folosesc tastatura sau un cititor de ecran: focusul nu se pierde niciodată (după «Arată toate județele» trece pe placa județului ales; după schimbarea câmpului «Încredere» din formularul de adăugare rămâne pe acel câmp), «Mai multe detalii» rămâne deschis când schimbi tipul, iar filtrele de limbă și de regiune revin la «Toate limbile» și «Toate regiunile» când este ștearsă ultima intrare cu acea valoare.
- Când ceva nu merge, pagina spune asta și îți păstrează munca: rândurile pe care «Adaugă mai multe deodată» le respinge rămân în casetă, fiecare cu numărul rândului și motivul; dacă browserul nu mai are loc pentru intrări, adăugarea și importul sunt anulate și apare o eroare, în loc să fie date drept salvate; starea salvată cu valori ostile sau nevalide (un id ca `__proto__`, o limbă, un județ, o licență sau un acord necunoscute, câmpuri prea lungi) este curățată la pornirea paginii și nu ajunge în formular.
- Căutarea de dubluri rămâne rapidă pe fișiere mari: fiecare text este analizat o singură dată, se compară doar perechile de mărime apropiată, iar comparația se oprește de îndată ce pragul nu mai poate fi atins, cu exact aceleași rezultate ca la definiția simplă (testat); importul unui fișier de câțiva megaocteți nu mai blochează pagina.
- Date: 10 proverbe românești cu sursele lor (echivalentele englezești luate din Wikiquote sunt marcate CC BY-SA 4.0), plăcile județelor `data/counties.json` și un `schema.json` mai strict (tipuri, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: verifică fiecare fișier față de schema lui și de regulile pe care o schemă nu le poate exprima (numele fișierului, plăcile județelor, `sourced` și `reviewed`, acordul, duplicatele); `scripts/import_bundle.py` transformă fișierul de contribuție făcut de pagină în fișiere de date; `scripts/potd.mjs` scrie proverbul unei date ca pagină statică.
- `docs/contributor-guide.md` și `docs/collecting-guide.md` (și în română): cum adaugi intrări și cum culegi folclor etic (acord, atribuire, ce nu publici).
- Teste: `npm test` (motorul, datele, scripturile Python, scriptul pentru proverbul zilei, construcția și textele interfeței) și teste de browser în hub (opt limbi, accesibilitate, stare salvată ostilă, import și export, ecrane mici).
- `src/` și `scripts/build.mjs`: singurul `index.html` este acum construit din surse, cu datele încorporate, iar `--check` îl verifică.
- ISSUES_GOOD_FIRST și CODE_OF_CONDUCT traduse în toate cele opt limbi.
- README în engleză, română, franceză, italiană, spaniolă, portugheză, germană și maghiară: secțiuni de stare și de domeniu planificat (derivate din `ISSUES_GOOD_FIRST.md`).
- Instalabilă (PWA): `manifest.webmanifest`, `sw.js` și pictogramele sunt generate de kitul comun (`fff-kit/pwa`); pagina funcționează offline după prima vizită prin HTTPS.

### Modificat
- Fluxul de lucru rulează pe Ubuntu 26.04 cu Node.js 26 și rulează și testele, verificarea construcției și validarea datelor.
- `schema.json` respinge câmpurile necunoscute și descrie acum tipurile, `answer` pentru ghicitori, `purpose` pentru descântece, `consent` pentru descântece și orice are `collector`, `county`, `translations`, `source_url`, `license`, `status` și `reviewed_by`.
- README nu mai listează un domeniu planificat: descrie ce face pagina și ce nu face încă.

## [0.1.0] - 2026-11-13

### Adăugat
- Schelet inițial: structură, schema de date sau primele exemple, ghiduri de contribuție în opt limbi.
