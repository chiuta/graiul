# Cum contribui — GRAIUL

[English](CONTRIBUTING.md) · **Română** · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-20

1. Fă fork acestui depozit.
2. Copiază `data/items/example.json` în `data/items/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Reguli

- O intrare = un fișier.
- Citează întotdeauna o sursă.
- Contribuie doar cu material pe care ai voie să-l partajezi (fără texte copiate protejate de drepturi de autor).
- Fii amabil: vezi Codul de conduită.

## Adăugarea de folclor în arhivă

1. Deschide pagina (`index.html` sau https://graiul.chiuta.ro) și mergi la fila «Adăugare»: alege tipul, scrie textul exact cum se spune (cu diacritice), dă codul limbii (`ro`, `hu`, `rom` …) și, dacă le știi, regiunea și județul; o ghicitoare are nevoie de `answer`, un descântec de `purpose`. Detalii: `docs/contributor-guide.md`.
2. Dă mereu sursa: o carte sau o pagină web (cu adresa ei) ori persoana de la care ai auzit textul. Marchează o intrare `sourced` doar dacă ai copiat-o dintr-o sursă publicată cu adresă web și `reviewed` doar dacă o altă persoană decât tine a confirmat-o și și-a spus numele.
3. Întreabă înainte să publici ce ți-a spus o persoană: spune-i că va fi publicat cu sursa lui și sub ce licență, și că poate refuza sau cere să rămână nenumită; apoi notează `collector` și `consent` (`informed`, sau `anonymised` când numele e păstrat secret). Un descântec cere mereu un acord și nu e prezentat niciodată drept tratament sau sfat (vezi `docs/collecting-guide.ro.md`).
4. Copiază doar ce ai voie: lucrări din domeniul public cu citarea lor, propriile culegeri sau intrări pentru care ai permisiune; niciodată o culegere modernă întreagă.
5. Apasă «Verifică» (se arată intrările identice și foarte asemănătoare), apoi «Adaugă în lista mea»; repetă pentru fiecare intrare sau lipește o listă la «Adaugă mai multe deodată».
6. În fila «Export» apasă «Descarcă intrările mele ca fișier de contribuție (JSON)» și trimite fișierul într-un issue sau un pull request; un responsabil rulează `python scripts/import_bundle.py graiul-contribution-<data>.json`, apoi `python scripts/validate.py`.
7. Dacă preferi fișierele, copiază `data/items/example.json` în `data/items/<lang>-<primele cuvinte>.json` (primele cuvinte fără diacritice: `ro-cine-se-aseamana-se-aduna.json`; a doua intrare cu aceleași primele cuvinte primește `-2`), editează-l și rulează `python scripts/validate.py`.
