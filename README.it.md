# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.1.0 · Ultimo aggiornamento: 2026-11-14

🌐 https://graiul.chiuta.ro

> Un archivio aperto di folklore: proverbi, incantesimi, indovinelli e canti, con regione e fonte.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha: il repository contiene la struttura, lo schema dati o i primi esempi e le guide al contributo. L’ambito qui sotto è il piano, non ciò che funziona oggi.

## Ambito previsto

- Voci con regione compilata fino al livello di distretto (județ), fonte e lingua: circa 50 proverbi, 20 indovinelli con un campo `answer`, 10 incantesimi con un campo `purpose` e fonte etnografica, e 10 canti natalizi tradizionali o di pubblico dominio.
- Voci ungheresi di Romania (lang hu, regione Transilvania) e traduzioni in francese dei 50 proverbi più comuni.
- Una vista su mappa (regione → elementi) con un GeoJSON locale.
- Un generatore statico della pagina «proverbio del giorno» e un rilevatore di duplicati basato sul testo normalizzato.
- Linee guida per raccogliere il folklore in modo etico: consenso e attribuzione.

Nulla di tutto ciò è ancora implementato: ogni voce è un compito pronto in `ISSUES_GOOD_FIRST.md`.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/items/example.json` in `data/items/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
