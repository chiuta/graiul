# Come contribuire — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · **Italiano** · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

1. Fai il fork di questo repository.
2. Copia `data/items/example.json` in `data/items/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Regole

- Una voce = un file.
- Cita sempre una fonte.
- Contribuisci solo con materiale che puoi condividere legalmente (niente testi protetti copiati).
- Sii gentile: vedi il Codice di condotta.

## Aggiungere folklore all’archivio

1. Apri la pagina (`index.html` o https://graiul.chiuta.ro) e vai alla scheda «Aggiunta»: scegli il tipo, scrivi il testo esattamente come si dice (con i segni diacritici), indica il codice della lingua (`ro`, `hu`, `rom` …) e, se li conosci, la regione e il distretto; un indovinello richiede il suo `answer`, un incantesimo il suo `purpose`. Dettagli: `docs/contributor-guide.md`.
2. Indica sempre la fonte: un libro o una pagina web (con il suo indirizzo) o la persona da cui hai sentito il testo. Contrassegna una voce `sourced` solo se l’hai copiata da una fonte pubblicata con indirizzo web, e `reviewed` solo se una persona diversa da te l’ha confermata e ha indicato il proprio nome.
3. Chiedi prima di pubblicare ciò che una persona ti ha detto: di’ che sarà pubblicato con la sua fonte e con quale licenza, e che può rifiutare o chiedere di restare anonima; poi annota `collector` e `consent` (`informed`, oppure `anonymised` quando il nome è tenuto riservato). Un incantesimo richiede sempre un consenso e non è mai presentato come cura o consiglio (vedi `docs/collecting-guide.md`).
4. Copia solo ciò che puoi: opere di pubblico dominio con la loro citazione, la tua raccolta o voci per cui hai un permesso; mai una raccolta moderna per intero.
5. Premi «Controlla» (si mostrano le voci identiche e molto simili), poi «Aggiungi alla mia lista»; ripeti per ogni voce, oppure incolla un elenco sotto «Aggiungi più voci insieme».
6. Nella scheda «Esporta» premi «Scarica le mie voci come file di contributo (JSON)» e invia il file in una issue o in una pull request; un maintainer esegue `python scripts/import_bundle.py graiul-contribution-<data>.json` e poi `python scripts/validate.py`.
7. Se preferisci i file, copia `data/items/example.json` in `data/items/<lingua>-<prime parole>.json` (le prime parole senza segni diacritici: `ro-cine-se-aseamana-se-aduna.json`; una seconda voce con le stesse prime parole riceve `-2`), modificalo ed esegui `python scripts/validate.py`.
