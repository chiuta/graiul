# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.1.0 · Utolsó frissítés: 2026-11-14

🌐 https://graiul.chiuta.ro

> Nyílt folklórarchívum: közmondások, ráolvasások, találós kérdések és énekek, régióval és forrással.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa: a tároló a szerkezetet, az adatsémát vagy az első példákat és a közreműködési útmutatókat tartalmazza. Az alábbi terjedelem a terv, nem a ma működő állapot.

## Tervezett terjedelem

- Bejegyzések megyei szintig kitöltött régióval, forrással és nyelvvel: kb. 50 közmondás, 20 találós kérdés `answer` mezővel, 10 varázsige `purpose` mezővel és néprajzi forrással, valamint 10 hagyományos vagy közkincs kántálás.
- Romániai magyar bejegyzések (lang hu, régió: Erdély) és a 50 leggyakoribb közmondás francia fordítása.
- Térképnézet (régió → elemek) helyi GeoJSON-nal.
- Statikus „a nap közmondása” oldalgenerátor és normalizált szövegen alapuló duplikátumkereső.
- Irányelvek a néprajzi anyag etikus gyűjtéséhez: beleegyezés és forrásmegjelölés.

Ezek közül még semmi sincs megvalósítva: minden pont kész feladat az `ISSUES_GOOD_FIRST.md` fájlban.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/items/example.json` fájlt a `data/items/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
