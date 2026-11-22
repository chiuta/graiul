# GRAIUL

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-22

🌐 https://graiul.chiuta.ro

> O arhivă deschisă de folclor: proverbe, descântece, ghicitori și colinde, fiecare cu regiune și sursă.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa, utilizabil: singurul `index.html` este o arhivă offline de folclor românesc. Caută proverbe, descântece, ghicitori, colinde, povești, zicători și cântece de leagăn fără să țină seama de diacritice, cu filtre pentru tip, limbă, regiune, județ și încredere; arată proverbul zilei; numără intrările fiecărui județ pe o hartă schematică; te lasă să adaugi intrări cu sursă și acord, verifică duplicatele și produce un fișier de contribuție pe care `scripts/import_bundle.py` îl transformă în fișiere de date. Cele 10 intrări de pornire sunt proverbe românești de pe o pagină publică citată; încă nu există descântece, ghicitori sau colinde, iar nimic nu a fost revizuit de un folclorist sau de un vorbitor nativ.

## Ce face

- Căutare după cuvinte din text, dintr-o traducere, din răspuns, din regiune sau din județ, fără să țină seama de diacritice: scriind `asteapta` găsește `Așteaptă`. Filtre pentru tip, limbă, regiune, județ și încredere (schiță, cu sursă, revizuit); fiecare rezultat arată sursa (cu legătură, dacă are adresă web), licența, acordul și traducerile, iar o ghicitoare își ține răspunsul ascuns până îl ceri.
- Proverbul zilei: un proverb din colecție, ales doar după dată, așa că orice dispozitiv arată același proverb în aceeași zi; poți merge la ziua precedentă sau următoare ori scrie o dată.
- Hartă: 42 de plăci (41 de județe și București) într-o schemă, fiecare cu numărul ei de intrări; alegând o placă vezi intrările județului. Este o diagramă, nu o hartă geografică.
- Adăugare: un formular care verifică fiecare câmp, cere o sursă și, pentru descântece și pentru orice a fost cules de la o persoană, un acord; refuză intrările identice și îți cere să confirmi pe cele foarte asemănătoare; se pot adăuga mai multe intrări dintr-o listă lipită; ce adaugi rămâne în browser până îl descarci.
- Export și date: intrările tale ca fișier de contribuție pe care îl poți trimite proiectului, un tabel (TSV) cu toată colecția sau cu intrările tale, importul unui fișier de contribuție și o căutare de duplicate; un fișier JSON pe intrare în `data/items/` și plăcile județelor în `data/counties.json`; interfață în opt limbi, teme întunecată și luminoasă, tastatură, merge de la 360 px lățime; fără rețea, fără urmărire.
- Se poate instala ca aplicație și funcționează offline după prima vizită, când e servită prin HTTPS (un service worker păstrează pagina; nu se stochează și nu se trimite nimic altceva). Deschisă dintr-un fișier descărcat, merge la fel, fără instalare.

## Cum funcționează

- `schema.json` și `counties.schema.json` descriu datele; `scripts/validate.py` verifică fiecare fișier față de ele și față de regulile pe care o schemă nu le poate exprima: numele fișierului (`<limbă>-<primele cuvinte>`), plăcile județelor, o adresă web pentru `sourced` și un revizor pentru `reviewed`, un acord pentru descântece și pentru orice a fost cules de la o persoană, și duplicatele (un text identic este o eroare, unul foarte asemănător un avertisment).
- `src/engine.mjs` este motorul (fără ecran, fără rețea): regula de normalizare folosită la căutare, la numele fișierelor și la duplicate, validarea, ordonarea rezultatelor, proverbul zilei, exportul TSV, fișierul de contribuție și analizorul listelor lipite. `scripts/validate.py` și `scripts/import_bundle.py` aplică aceeași regulă de normalizare și aceeași măsură de asemănare (trigrame, coeficientul Dice, 0,85 pentru „foarte asemănător”); testele compară implementările.
- `src/ui.js`, `src/i18n.mjs` și `src/app.css` sunt interfața; `node scripts/build.mjs` construiește singurul `index.html` cu datele încorporate (`--check` verifică dacă se potrivește); `node scripts/potd.mjs` scrie proverbul unei date ca pagină statică mică, după aceeași regulă ca fila.
- `npm test` rulează testele motorului, ale datelor, ale scripturilor Python, ale construcției, ale scriptului pentru proverbul zilei și ale textelor interfeței; testele de browser sunt în hub. Dezvoltarea cere Node.js 24 sau mai nou și Python 3 cu `jsonschema`; pagina în sine cere doar un browser care știe ES2017.
- `manifest.webmanifest`, `sw.js` și pictogramele sunt produse de `node scripts/build.mjs` prin kitul comun (secțiunea `pwa` din `src/app.json`); `--check` le verifică și el, iar `npm test` verifică dacă manifestul, versiunea service worker-ului și CSP-ul corespund paginii.

## Ce nu face această pagină

- Datele de pornire sunt puține: zece proverbe românești luate de pe pagina Wikiquote „Romanian proverbs”, cu sursele lor, fără descântece, ghicitori sau colinde și fără județ. Ce se adaugă după aceea este atât de sigur cât este sursa lui.
- Nicio intrare din datele de pornire nu a fost revizuită de un folclorist sau de un vorbitor nativ; cele marcate „revizuit” spun cine le-a revizuit. „Cu sursă” înseamnă doar că e citată o sursă. Textele interfeței în alte limbi decât engleza și româna au fost scrise cu un asistent IA și cer revizuire de către vorbitori nativi.
- Plăcile județelor sunt o schemă, nu o hartă: fără granițe, iar pozițiile urmează doar aproximativ aranjamentul real. O intrare apare pe o placă doar dacă i s-a notat județul.
- Ce adaugi rămâne în acest browser până îl descarci; ștergerea datelor site-ului îl șterge. Nu se trimite nimic nicăieri.
- Detectarea duplicatelor compară literele, fără diacritice, majuscule și punctuație; nu poate ști că două proverbe cu cuvinte diferite au același sens.
- Pagina nu poate verifica dacă acordul a fost cu adevărat dat: asta cade în sarcina celui care a cules textul.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/items/example.json` în `data/items/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.
5. Fără programare: adaugă intrări în pagină (fila «Adăugare»), descarcă fișierul tău de contribuție (fila «Export») și trimite-l într-un issue sau un pull request; un responsabil îl importă cu `python scripts/import_bundle.py` (vezi `docs/contributor-guide.ro.md`; dacă culegi de la oameni, citește mai întâi `docs/collecting-guide.ro.md`).

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
