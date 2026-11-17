# Változásnapló

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · **Magyar**

Formátum: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Kiadatlan]

## [0.2.0] - 2026-11-17

### Hozzáadva
- A motor a `src/engine.mjs` fájlban: ékezetektől független keresés rangsorolással, a bejegyzések ellenőrzése, azonos és nagyon hasonló bejegyzések, a nap közmondása, megyénkénti számlálás, TSV-export, hozzájárulási fájl és a beillesztett listák elemzője.
- TSV-export táblázatkezelőknek: az `=`, `+`, `-` vagy `@` jellel kezdődő cella elé aposztróf kerül, hogy az Excel vagy a LibreOffice ne futtassa képletként (az a szöveg, amely valóban `-` jellel kezdődik, ezért aposztrófot mutat a táblázatban). Az oldal által letöltött fájl UTF-8 bájtsorrend-jelzővel is kezdődik, hogy az ékezetes betűk helyesen jelenjenek meg.
- A felület a `src/ui.js`, `src/i18n.mjs` és `src/app.css` fájlokban: keresés, a nap közmondása, megyetérkép, hozzáadás (egy bejegyzés vagy több egyszerre), exportálás, importálás és útmutató; nyolc nyelv, sötét és világos téma, billentyűzet, 360 px szélességtől használható, és a térképnek van tartalék elrendezése a CSS Grid nélküli böngészőkhöz.
- Figyelem a billentyűzetet és a képernyőolvasót használókra: a fókusz soha nem vész el (a «Minden megye megjelenítése» után a korábban kiválasztott megye csempéjére ugrik; a hozzáadó űrlapon a megbízhatóság módosítása után ezen a mezőn marad), a «További adatok» nyitva marad, ha a típust módosítod, a nyelv- és a régiószűrő pedig visszaáll a «Minden nyelv» és a «Minden régió» értékre, ha eltávolítod az utolsó bejegyzést, amelyben az az érték szerepelt.
- Ha valami elromlik, az oldal szól, és megőrzi a munkádat: a «Több hozzáadása egyszerre» által elutasított sorok a mezőben maradnak, mindegyik a sor számával és az okkal; ha a böngészőben nincs hely a bejegyzések tárolására, a hozzáadás és az importálás visszavonódik, és hibaüzenet jelenik meg ahelyett, hogy mentettnek jelentené őket; az ellenséges vagy érvénytelen értékeket tartalmazó mentett állapotot (például a `__proto__` azonosítót, ismeretlen nyelvet, megyét, licencet vagy beleegyezést, túl hosszú mezőket) az oldal induláskor megtisztítja, és az soha nem jut el az űrlapig.
- A kettős bejegyzések keresése nagy fájlokon is gyors marad: minden szöveget csak egyszer elemez, csak a hasonló méretű párokat hasonlítja össze, és az összehasonlítás abbamarad, amint a küszöb már nem érhető el, pontosan ugyanazokkal az eredményekkel, mint az egyszerű meghatározás (tesztelve); több megabájtos fájl importálása már nem akasztja meg az oldalt.
- Adatok: 10 román közmondás a forrásaikkal (a Wikiquote-ról átvett angol megfelelők CC BY-SA 4.0 jelölésűek), a megyecsempék a `data/counties.json` fájlban és egy szigorúbb `schema.json` (típusok, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: minden fájlt ellenőriz a sémája és azok a szabályok szerint, amelyeket egy séma nem tud kifejezni (fájlnév, megyecsempék, `sourced` és `reviewed`, beleegyezés, ismétlődések); a `scripts/import_bundle.py` az oldal által készített hozzájárulási fájlt adatfájlokká alakítja; a `scripts/potd.mjs` egy dátum közmondását statikus oldalként írja ki.
- `docs/contributor-guide.md` és `docs/collecting-guide.md` (románul is): hogyan adhatsz hozzá bejegyzéseket, és hogyan gyűjts folklórt etikusan (beleegyezés, forrásmegjelölés, mit nem szabad közzétenni).
- Tesztek: `npm test` (a motor, az adatok, a Python-szkriptek, a nap közmondása szkript, az építés és a felületi szövegek) és böngészőtesztek a hubban (nyolc nyelv, akadálymentesség, ellenséges mentett állapot, import és export, kis képernyők).
- `src/` és `scripts/build.mjs`: az egyetlen `index.html` mostantól forrásokból épül, beágyazott adatokkal, és a `--check` ellenőrzi.
- Az ISSUES_GOOD_FIRST és a CODE_OF_CONDUCT lefordítva mind a nyolc nyelvre.
- README angolul, románul, franciául, olaszul, spanyolul, portugálul, németül és magyarul: állapot- és tervezett terjedelem-szakaszok (az `ISSUES_GOOD_FIRST.md` alapján).
- Telepíthető (PWA): a `manifest.webmanifest`, az `sw.js` és az ikonok a közös kitből (`fff-kit/pwa`) készülnek; az oldal az első HTTPS-látogatás után offline is működik.

### Módosítva
- A munkafolyamat Ubuntu 26.04 és Node.js 26 alatt fut, és a teszteket, a build-ellenőrzést meg az adatok ellenőrzését is futtatja.
- A `schema.json` elutasítja az ismeretlen mezőket, és most már leírja a típusokat, a találós kérdések `answer`, a ráolvasások `purpose`, a ráolvasások és a `collector` mezővel rendelkező bejegyzések `consent`, valamint a `county`, `translations`, `source_url`, `license`, `status` és `reviewed_by` mezőit.
- A README már nem sorol fel tervezett hatókört: azt írja le, mit tud az oldal, és mit nem tud még.

## [0.1.0] - 2026-11-13

### Hozzáadva
- Kezdeti váz: szerkezet, adatséma vagy első példák, hozzájárulási útmutatók nyolc nyelven.
