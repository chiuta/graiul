# Registro delle modifiche

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · **Italiano** · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non rilasciato]

## [0.2.0] - 2026-11-17

### Aggiunto
- Il motore in `src/engine.mjs`: ricerca senza badare ai segni diacritici con ordinamento, convalida delle voci, voci identiche e molto simili, proverbio del giorno, conteggio per distretto, esportazione TSV, file di contributo e analizzatore degli elenchi incollati.
- Esportazione TSV per fogli di calcolo: una cella che inizia con `=`, `+`, `-` o `@` riceve un apostrofo davanti, in modo che Excel o LibreOffice non la eseguano come formula (un testo che inizia davvero con `-` mostra quindi un apostrofo nel foglio). Il file scaricato dalla pagina inizia anche con un indicatore di ordine dei byte UTF-8, in modo che i segni diacritici si vedano correttamente.
- L’interfaccia in `src/ui.js`, `src/i18n.mjs` e `src/app.css`: ricerca, proverbio del giorno, mappa dei distretti, aggiunta (una voce o più insieme), esportazione, importazione e guida; otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza, e la mappa ha una disposizione di riserva per i browser senza CSS Grid.
- Attenzione per chi usa la tastiera o uno screen reader: il focus non si perde mai (dopo «Mostra tutti i distretti» passa alla tessera del distretto che era scelto; dopo aver cambiato l’affidabilità nel modulo di aggiunta resta su quel campo), «Altri dettagli» resta aperto quando cambi il tipo, e i filtri di lingua e di regione tornano a «Tutte le lingue» e «Tutte le regioni» quando viene rimossa l’ultima voce con quel valore.
- Quando qualcosa va storto la pagina lo dice e conserva il tuo lavoro: le righe che «Aggiungi più voci insieme» rifiuta restano nella casella, ciascuna con il numero di riga e il motivo; se il browser non ha più spazio per le voci, l’aggiunta e l’importazione vengono annullate e compare un errore invece di segnalarle come salvate; uno stato salvato con valori ostili o non validi (un id come `__proto__`, una lingua, un distretto, una licenza o un consenso sconosciuti, campi troppo lunghi) viene ripulito all’avvio della pagina e non arriva mai al modulo.
- La ricerca dei duplicati resta veloce sui file grandi: ogni testo viene analizzato una sola volta, si confrontano solo le coppie di dimensioni simili e il confronto si ferma non appena la soglia non può più essere raggiunta, con esattamente gli stessi risultati della definizione semplice (testato); importare un file di diversi megabyte non blocca più la pagina.
- Dati: 10 proverbi rumeni con le loro fonti (gli equivalenti inglesi presi da Wikiquote sono marcati CC BY-SA 4.0), le tessere dei distretti `data/counties.json` e un `schema.json` più rigoroso (tipi, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: controlla ogni file rispetto al suo schema e alle regole che uno schema non può esprimere (nome del file, tessere dei distretti, `sourced` e `reviewed`, consenso, duplicati); `scripts/import_bundle.py` trasforma il file di contributo fatto dalla pagina in file di dati; `scripts/potd.mjs` scrive il proverbio di una data come pagina statica.
- `docs/contributor-guide.md` e `docs/collecting-guide.md` (anche in rumeno): come aggiungere voci e come raccogliere il folklore in modo etico (consenso, attribuzione, cosa non pubblicare).
- Test: `npm test` (il motore, i dati, gli script Python, lo script del proverbio del giorno, la build e i testi dell’interfaccia) e test del browser nell’hub (otto lingue, accessibilità, stato salvato ostile, importazione ed esportazione, schermi piccoli).
- `src/` e `scripts/build.mjs`: l’unico `index.html` è ora costruito dai sorgenti, con i dati incorporati, e `--check` lo verifica.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT tradotti in tutte e otto le lingue.
- README in inglese, rumeno, francese, italiano, spagnolo, portoghese, tedesco e ungherese: sezioni di stato e di ambito previsto (derivate da `ISSUES_GOOD_FIRST.md`).
- Installabile (PWA): `manifest.webmanifest`, `sw.js` e le icone sono generati dal kit comune (`fff-kit/pwa`); la pagina funziona offline dopo la prima visita via HTTPS.

### Modificato
- Il workflow gira su Ubuntu 26.04 con Node.js 26 ed esegue anche i test, il controllo della build e la convalida dei dati.
- `schema.json` rifiuta i campi sconosciuti e ora descrive i tipi, `answer` per gli indovinelli, `purpose` per gli incantesimi, `consent` per gli incantesimi e per tutto ciò che ha un `collector`, `county`, `translations`, `source_url`, `license`, `status` e `reviewed_by`.
- Il README non elenca più un ambito pianificato: descrive cosa fa la pagina e cosa non fa ancora.

## [0.1.0] - 2026-11-13

### Aggiunto
- Scheletro iniziale: struttura, schema dei dati o primi esempi, guide al contributo in otto lingue.
