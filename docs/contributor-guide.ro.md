# GRAIUL — ghidul contribuitorului

[English](contributor-guide.md) · **Română**

Pentru oricine știe un proverb, o ghicitoare, un descântec, o colindă sau o zicătoare din folclorul românesc și vrea să o vadă păstrată. **Nu e nevoie de programare.** Totul se petrece în pagină (`index.html` sau https://graiul.chiuta.ro): adaugi intrări, le verifici și descarci un singur fișier pe care îl trimiți proiectului. Dacă culegi de la alți oameni, citește mai întâi `collecting-guide.ro.md`.

## 1. Ce adaugi și ce nu

- **Texte** exact cum se spun, cu diacriticele lor, și o **sursă**. Tipul (proverb, descântec, ghicitoare, colind, poveste, zicătoare, cântec de leagăn), codul limbii, regiunea și județul, traducerile și o notă fac parte din intrare; obligatorii sunt doar textul, tipul, limba și sursa.
- **Doar ce știi sau poți cita.** Dacă l-ai auzit de la cineva, sursa este acea persoană („bunica mea, satul X”), iar ai nevoie de acordul ei (vezi `collecting-guide.ro.md`). Dacă l-ai citit undeva, dă cartea sau pagina web și adresa ei.
- **Fără culegeri copiate.** Un text cu sursa lui e în regulă; o carte modernă sau un site copiate pagină cu pagină, nu. Lucrările din domeniul public sunt binevenite, cu citarea lor.
- **Descântecele** sunt arătate ca patrimoniu, niciodată ca tratament sau sfat. Scrie în câteva cuvinte pentru ce se spune (`purpose`) și nu publica niciodată unul pe care purtătorul te-a rugat să-l păstrezi privat.

## 2. Cele trei niveluri de încredere

| Nivel | Înseamnă | Ce cer datele |
| --- | --- | --- |
| `draft` | introdus, încă necontrolat de altcineva | o sursă |
| `sourced` | preluat dintr-o sursă publicată | o sursă și adresa ei web (`source_url`, care începe cu `https://`) |
| `reviewed` | confirmat de o altă persoană decât cea care l-a introdus | o sursă și numele celui care a revizuit (`reviewed_by`) |

Căutarea poate arăta doar intrările `sourced` și `reviewed`, sau doar pe cele `reviewed`.

## 3. Adaugă o intrare

1. Deschide fila **Adăugare**.
2. Alege **tipul**, scrie **textul cum se spune** și dă **codul limbii** (`ro`, `hu`, `rom` …).
3. O ghicitoare are nevoie de **răspuns**; un descântec are nevoie de **scop** (pentru ce se spune) și de un **acord**.
4. Scrie **sursa** (obligatorie) și, dacă textul vine de la o persoană, alege **acordul** (vezi mai jos).
5. Deschide **Mai multe detalii** pentru regiune (de exemplu Moldova, Transilvania, Maramureș; lasă-o goală dacă nu o știi), județ, traduceri (câte una pe rând: `en: …`), o notă, adresa web a sursei, licență, cine a cules și încredere. Pagina ține minte ultimele valori, așa că intrarea următoare pornește de la ele.
6. Apasă **Verifică**: pagina listează ce trebuie corectat și arată intrările identice sau foarte asemănătoare cu a ta. Cele identice nu pot fi adăugate; la una foarte asemănătoare, verifică dacă e o altă intrare și apasă **Adaugă oricum**.
7. Apasă **Adaugă în lista mea**. Repetă pentru fiecare intrare.

Pentru o listă lungă folosește **Adaugă mai multe deodată**: un rând pe intrare, textul, apoi ` | ` (sau un tab) și o traducere; tipul, limba, regiunea, județul, sursa și licența vin din formularul de mai sus. Rândurile goale sau care încep cu `#` sunt ignorate, iar pagina îți spune ce rânduri a sărit și de ce.

## 4. Câmpul „acord”

| Valoare | Când |
| --- | --- |
| `published` | textul este luat dintr-o lucrare publicată, pe care o citezi ca sursă |
| `informed` | persoana care ți-a spus textul a fost de acord cu această publicare, cu numele ei |
| `anonymised` | persoana a fost de acord, dar a cerut să nu fie numită |

Un descântec și orice intrare cu `collector` trebuie să aibă una dintre cele trei. Pagina nu poate verifica dacă acordul a fost cu adevărat dat: asta este responsabilitatea ta, iar responsabilii te pot întreba cum l-ai obținut.

## 5. Trimite-l

Ce adaugi rămâne în browserul tău (cel mult 500 de intrări) până deschizi fila **Export** și apeși **Descarcă intrările mele ca fișier de contribuție (JSON)**. Primești `graiul-contribution-<data>.json`. Trimite-l într-unul dintre aceste moduri:

- deschide un issue (șablonul „New entry”) și atașează fișierul;
- sau deschide un pull request care adaugă fișierul în depozit (orice director, de exemplu `contributions/`; un responsabil îl importă);
- sau trimite-l pe e-mail responsabililor.

Aceeași filă descarcă un tabel (TSV) cu toată colecția sau cu intrările tale, importă un fișier de contribuție și caută duplicate în toată colecția.

## 6. Ce fac responsabilii

```
python scripts/import_bundle.py graiul-contribution-2026-11-17.json --dry-run   # arată ce s-ar scrie
python scripts/import_bundle.py graiul-contribution-2026-11-17.json            # scrie data/items/*.json
python scripts/validate.py                                                     # aceleași verificări ca CI
node scripts/build.mjs                                                         # reconstruiește index.html
```

Importul nu suprascrie nimic: o intrare care există deja (aceeași limbă și același text, fără să conteze majusculele, diacriticele și punctuația) este sărită, iar o a doua intrare cu aceleași primele cuvinte primește sufixul `-2`, `-3` … Un text foarte asemănător este scris, dar raportat, ca un responsabil să se uite la el.

## 7. Preferi fișierele? Lucrează cu depozitul

Copiază `data/items/example.json` în `data/items/<lang>-<primele cuvinte>.json`: numele fișierului este codul limbii și primele cuvinte ale textului, fără diacritice (`ro-cine-se-aseamana-se-aduna.json`); un text fără litere latine folosește codurile Unicode ale primelor lui caractere. O intrare = un fișier. Rulează `python scripts/validate.py` (cere Python 3 și `pip install jsonschema`): îți spune exact ce trebuie corectat. `python scripts/validate.py --list` arată câte intrări sunt pe tip, limbă, județ și stare.

## 8. Cum ajuți cel mai mult

- **Revizuiește** proverbele de pornire: deschide un issue cu id-ul intrării (`ro-cine-se-aseamana-se-aduna`), spune ce e corect sau greșit și dă-ți numele; un responsabil setează `status: reviewed` și `reviewed_by`.
- **Adaugă regiunea și județul** unde știi că se spune un proverb.
- **Adaugă traduceri** în limbile în care scrii.
- **Verifică textele interfeței** în limba ta: au fost scrise cu un asistent IA și au nevoie de un cititor nativ.
- **Publică proverbul zilei**: `node scripts/potd.mjs --out public/potd` scrie o pagină statică mică după aceeași regulă ca fila «Proverbul zilei»; rulează-l dintr-o sarcină zilnică.

Fii amabil; vezi Codul de conduită. Mulțumim că ții în viață acest patrimoniu.
