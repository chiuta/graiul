# Közreműködés — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

1. Forkold ezt a tárolót.
2. Másold a `data/items/example.json` fájlt a `data/items/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Szabályok

- Egy bejegyzés = egy fájl.
- Mindig add meg a forrást.
- Csak olyan anyagot küldj, amelyet jogszerűen megoszthatsz (nincs másolt, védett szöveg).
- Légy kedves: lásd az Etikai kódexet.

## Folklór hozzáadása az archívumhoz

1. Nyisd meg az oldalt (`index.html` vagy https://graiul.chiuta.ro), és lépj a „Hozzáadás” lapra: válaszd ki a típust, írd le a szöveget úgy, ahogy mondják (ékezetekkel), add meg a nyelvkódot (`ro`, `hu`, `rom` …), és ha tudod, a régiót és a megyét; a találós kérdéshez kell az `answer`, a ráolvasáshoz a `purpose`. Részletek: `docs/contributor-guide.md`.
2. Mindig add meg a forrást: könyvet vagy weboldalt (a címével), vagy azt a személyt, akitől a szöveget hallottad. Egy bejegyzést csak akkor jelölj `sourced`-nek, ha webcímmel rendelkező, közzétett forrásból másoltad, `reviewed`-nek pedig csak akkor, ha nálad más személy megerősítette, és megadta a nevét.
3. Kérdezz, mielőtt közzéteszed, amit egy személy mondott: közöld, hogy a forrásával együtt, milyen licenccel jelenik meg, és hogy nemet mondhat, vagy kérheti, hogy ne nevezzék meg; ezután jegyezd fel a `collector` és a `consent` mezőt (`informed`, vagy `anonymised`, ha a nevet nem közlik). A ráolvasáshoz mindig kell beleegyezés, és soha nem mutatjuk be kezelésként vagy tanácsként (lásd `docs/collecting-guide.md`).
4. Csak azt másold, amit szabad: közkincs műveket hivatkozással, saját gyűjtést vagy olyan bejegyzéseket, amelyekhez engedélyed van; soha ne egy modern gyűjtemény egészét.
5. Nyomd meg az „Ellenőrzés” gombot (az azonos és a nagyon hasonló bejegyzések látszanak), majd a „Hozzáadás a listámhoz” gombot; ismételd minden bejegyzéssel, vagy illessz be egy listát a „Több hozzáadása egyszerre” résznél.
6. Az „Exportálás” lapon nyomd meg a „A saját bejegyzéseim letöltése hozzájárulási fájlként (JSON)” gombot, és küldd el a fájlt egy issue-ban vagy pull requestben; egy karbantartó lefuttatja a `python scripts/import_bundle.py graiul-contribution-<dátum>.json`, majd a `python scripts/validate.py` parancsot.
7. Ha inkább fájlokkal dolgozol, másold a `data/items/example.json` fájlt a `data/items/<nyelv>-<első szavak>.json` néven (az első szavak ékezetek nélkül: `ro-cine-se-aseamana-se-aduna.json`; az azonos első szavú második bejegyzés `-2`-t kap), szerkeszd, és futtasd a `python scripts/validate.py` parancsot.
