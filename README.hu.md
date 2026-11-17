# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

🌐 https://graiul.chiuta.ro

> Nyílt folklórarchívum: közmondások, ráolvasások, találós kérdések és énekek, régióval és forrással.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa, használható: az egyetlen `index.html` a román folklór offline archívuma. Ékezetektől függetlenül keres közmondások, ráolvasások, találós kérdések, kolindák, mesék, szólások és altatódalok között, típus, nyelv, régió, megye és megbízhatóság szerinti szűrőkkel; megmutatja a nap közmondását; egy vázlatos térképen megyénként számolja a bejegyzéseket; lehetővé teszi bejegyzések felvételét forrással és beleegyezéssel, ellenőrzi az ismétlődéseket, és hozzájárulási fájlt készít, amelyet a `scripts/import_bundle.py` adatfájlokká alakít. A 10 kezdő bejegyzés egy idézett nyilvános oldalról származó román közmondás; még nincs ráolvasás, találós kérdés vagy kolinda, és semmit nem nézett át folklorista vagy anyanyelvi beszélő.

## Mit tud

- Keresés a szöveg, egy fordítás, a válasz, a régió vagy a megye szavai alapján, ékezetektől függetlenül: az `asteapta` beírása megtalálja az `Așteaptă` szót. Szűrők típus, nyelv, régió, megye és megbízhatóság (piszkozat, forrással, ellenőrzött) szerint; minden találat mutatja a forrását (hivatkozással, ha van webcíme), a licencet, a beleegyezést és a fordításokat, a találós kérdés pedig addig rejtve tartja a megfejtését, amíg nem kéred.
- A nap közmondása: a gyűjtemény egy közmondása, csak a dátum alapján kiválasztva, így minden eszköz ugyanazon a napon ugyanazt a közmondást mutatja; léphetsz az előző vagy a következő napra, vagy beírhatsz egy dátumot.
- Térkép: 42 csempe (41 megye és Bukarest) vázlatos elrendezésben, mindegyiken a bejegyzések száma; egy csempét kiválasztva az adott megye bejegyzései jelennek meg. Ez egy ábra, nem földrajzi térkép.
- Hozzáadás: egy űrlap, amely minden mezőt ellenőriz, forrást kér, a ráolvasásokhoz és mindenhez, amit személytől gyűjtöttek, beleegyezést is; elutasítja az azonos bejegyzéseket, és a nagyon hasonlók megerősítését kéri; több bejegyzés is hozzáadható beillesztett listából; amit hozzáadsz, a böngészőben marad, amíg le nem töltöd.
- Exportálás és adatok: a bejegyzéseid hozzájárulási fájlként, amelyet elküldhetsz a projektnek, a teljes gyűjtemény vagy a saját bejegyzéseid táblázata (TSV), hozzájárulási fájl importálása és ismétlődések keresése; bejegyzésenként egy JSON-fájl a `data/items/` mappában és a megyecsempék a `data/counties.json` fájlban; felület nyolc nyelven, sötét és világos téma, billentyűzet, 360 px szélességtől használható; hálózat és követés nélkül.
- Alkalmazásként telepíthető, és az első látogatás után offline is elérhető, ha HTTPS-en keresztül szolgálják ki (egy service worker megőrzi az oldalt; semmi mást nem tárol és nem küld). Letöltött fájlból megnyitva ugyanígy működik, telepítés nélkül.

## Hogyan működik

- A `schema.json` és a `counties.schema.json` írja le az adatokat; a `scripts/validate.py` minden fájlt ellenőriz ezek szerint és azok a szabályok szerint, amelyeket egy séma nem tud kifejezni: a fájlnév (`<nyelv>-<első szavak>`), a megyecsempék, a `sourced` webcíme és a `reviewed` ellenőrzője, a ráolvasások és a személytől gyűjtött anyagok beleegyezése, valamint az ismétlődések (az azonos szöveg hiba, a nagyon hasonló figyelmeztetés).
- A `src/engine.mjs` a motor (képernyő és hálózat nélkül): a keresésnél, a fájlnevekben és az ismétlődéseknél használt normalizálási szabály, az ellenőrzés, a találatok rangsorolása, a nap közmondása, a TSV-export, a hozzájárulási fájl és a beillesztett listák elemzője. A `scripts/validate.py` és a `scripts/import_bundle.py` ugyanazt a normalizálási szabályt és ugyanazt a hasonlósági mértéket használja (trigramok, Dice-együttható, 0,85 a „nagyon hasonló” küszöbe); a tesztek összevetik a megvalósításokat.
- A `src/ui.js`, a `src/i18n.mjs` és a `src/app.css` a felület; a `node scripts/build.mjs` az egyetlen `index.html` fájlt építi a beágyazott adatokkal (a `--check` ellenőrzi, hogy egyezik-e); a `node scripts/potd.mjs` egy dátum közmondását kis statikus oldalként írja ki, ugyanazzal a szabállyal, mint a lap.
- Az `npm test` lefuttatja a motor, az adatok, a Python-szkriptek, az építés, a nap közmondása szkript és a felületi szövegek tesztjeit; a böngészőtesztek a hubban vannak. A fejlesztéshez Node.js 24 vagy újabb, valamint Python 3 és `jsonschema` kell; maga az oldal csak egy ES2017-et ismerő böngészőt igényel.
- A `manifest.webmanifest`, az `sw.js` és az ikonok a `node scripts/build.mjs` futtatásakor készülnek a közös kit révén (az `src/app.json` `pwa` szakasza); a `--check` is ellenőrzi őket, az `npm test` pedig azt, hogy a manifeszt, a service worker verziója és a CSP megegyezik az oldalval.

## Amit ez az oldal nem tud

- A kezdő adatok kevesek: tíz román közmondás a Wikiquote „Romanian proverbs” oldaláról, forrásaikkal, ráolvasás, találós kérdés vagy ének nélkül és megye nélkül. Ami később kerül hozzá, annyira megbízható, mint a forrása.
- A kezdő adatok egyik bejegyzését sem ellenőrizte folklórkutató vagy anyanyelvi beszélő; az „ellenőrzött” jelölésűek megnevezik, ki ellenőrizte őket. A „forrással” csak annyit jelent, hogy van megadott forrás. Az angoltól és a romántól eltérő nyelvű felületi szövegeket MI-asszisztenssel írtuk, anyanyelvi ellenőrzésre szorulnak.
- A megyecsempék vázlatok, nem térkép: határok nélkül, és a helyzetük csak nagyjából követi a valódi elrendezést. Egy bejegyzés csak akkor jelenik meg egy csempén, ha fel van tüntetve a megyéje.
- Amit hozzáadsz, az ebben a böngészőben marad, amíg le nem töltöd; a webhelyadatok törlése törli. Semmi sem kerül sehová elküldésre.
- Az ismétlődés-keresés a betűket hasonlítja össze, az ékezeteket, a nagybetűket és az írásjeleket figyelmen kívül hagyva; nem tudhatja, hogy két eltérő szavú közmondás ugyanazt jelenti.
- Az oldal nem tudja ellenőrizni, hogy a beleegyezést valóban megadták-e: ez annak a felelőssége, aki a szöveget gyűjtötte.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/items/example.json` fájlt a `data/items/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.
5. Programozás nélkül: vegyél fel bejegyzéseket az oldalon („Hozzáadás” lap), töltsd le a hozzájárulási fájlt („Exportálás” lap), és küldd el egy issue-ban vagy pull requestben; egy karbantartó a `python scripts/import_bundle.py` paranccsal importálja (lásd `docs/contributor-guide.md`; ha embereknél gyűjtesz, előbb olvasd el a `docs/collecting-guide.md` fájlt).

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
