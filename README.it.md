# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

🌐 https://graiul.chiuta.ro

> Un archivio aperto di folklore: proverbi, incantesimi, indovinelli e canti, con regione e fonte.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alfa, utilizzabile: l’unico `index.html` è un archivio offline del folklore rumeno. Cerca proverbi, incantesimi, indovinelli, canti natalizi, racconti, detti e ninne nanne senza badare ai segni diacritici, con filtri per tipo, lingua, regione, distretto e affidabilità; mostra un proverbio del giorno; conta le voci di ogni distretto su una mappa schematica; permette di aggiungere voci con fonte e consenso, controlla i duplicati e produce un file di contributo che `scripts/import_bundle.py` trasforma in file di dati. Le 10 voci iniziali sono proverbi rumeni di una pagina pubblica citata; non ci sono ancora incantesimi, indovinelli o canti, e nulla è stato rivisto da un folklorista o da un madrelingua.

## Cosa fa

- Ricerca per parole del testo, di una traduzione, della risposta, della regione o del distretto, senza badare ai segni diacritici: digitando `asteapta` trova `Așteaptă`. Filtri per tipo, lingua, regione, distretto e affidabilità (bozza, con fonte, rivisto); ogni risultato mostra la fonte (con un link se ha un indirizzo web), la licenza, il consenso e le traduzioni, e un indovinello tiene nascosta la risposta finché non la chiedi.
- Proverbio del giorno: un proverbio della raccolta, scelto solo in base alla data, così ogni dispositivo mostra lo stesso proverbio nello stesso giorno; puoi passare al giorno precedente o successivo oppure scrivere una data.
- Mappa: 42 tessere (41 distretti e Bucarest) in una disposizione schematica, ciascuna con il numero di voci; scegliendo una tessera vedi le voci di quel distretto. È un diagramma, non una mappa geografica.
- Aggiunta: un modulo che controlla ogni campo, richiede una fonte e, per gli incantesimi e per tutto ciò che è stato raccolto da una persona, un consenso; rifiuta le voci identiche e ti chiede di confermare quelle molto simili; si possono aggiungere più voci da un elenco incollato; ciò che aggiungi resta nel browser finché non lo scarichi.
- Esportazione e dati: le tue voci come file di contributo da inviare al progetto, una tabella (TSV) di tutta la raccolta o delle tue voci, l’importazione di un file di contributo e una ricerca di duplicati; un file JSON per voce in `data/items/` e le tessere dei distretti in `data/counties.json`; interfaccia in otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza; senza rete, senza tracciamento.
- Installabile come app e disponibile offline dopo la prima visita quando è servita via HTTPS (un service worker conserva la pagina; nient’altro viene memorizzato o inviato). Aperta da un file scaricato funziona allo stesso modo, senza installazione.

## Come funziona

- `schema.json` e `counties.schema.json` descrivono i dati; `scripts/validate.py` controlla ogni file rispetto a essi e alle regole che uno schema non può esprimere: il nome del file (`<lingua>-<prime parole>`), le tessere dei distretti, un indirizzo web per `sourced` e un revisore per `reviewed`, un consenso per gli incantesimi e per tutto ciò che è stato raccolto da una persona, e i duplicati (un testo identico è un errore, uno molto simile un avviso).
- `src/engine.mjs` è il motore (senza schermo, senza rete): la regola di normalizzazione usata per la ricerca, i nomi dei file e i duplicati, la convalida, l’ordinamento dei risultati, il proverbio del giorno, l’esportazione TSV, il file di contributo e l’analizzatore degli elenchi incollati. `scripts/validate.py` e `scripts/import_bundle.py` applicano la stessa regola di normalizzazione e la stessa misura di somiglianza (trigrammi, coefficiente di Dice, 0,85 per «molto simile»); i test confrontano le implementazioni.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` sono l’interfaccia; `node scripts/build.mjs` costruisce l’unico `index.html` con i dati incorporati (`--check` verifica che corrisponda); `node scripts/potd.mjs` scrive il proverbio di una data come piccola pagina statica, con la stessa regola della scheda.
- `npm test` esegue i test del motore, dei dati, degli script Python, della build, dello script del proverbio del giorno e dei testi dell’interfaccia; i test del browser sono nell’hub. Lo sviluppo richiede Node.js 24 o più recente e Python 3 con `jsonschema`; la pagina in sé richiede solo un browser che conosca ES2017.
- `manifest.webmanifest`, `sw.js` e le icone sono prodotti da `node scripts/build.mjs` tramite il kit comune (sezione `pwa` di `src/app.json`); anche `--check` li verifica, e `npm test` controlla che il manifest, la versione del service worker e la CSP corrispondano alla pagina.

## Cosa non fa questa pagina

- I dati iniziali sono pochi: dieci proverbi rumeni presi dalla pagina di Wikiquote «Romanian proverbs», con le loro fonti, senza incantesimi, indovinelli o canti e senza distretto. Ciò che si aggiunge dopo è affidabile quanto la sua fonte.
- Nessuna voce dei dati iniziali è stata rivista da un folklorista o da un madrelingua; quelle contrassegnate «rivisto» dicono chi le ha riviste. «Con fonte» significa solo che è citata una fonte. I testi dell’interfaccia in lingue diverse dall’inglese e dal rumeno sono stati scritti con un assistente IA e richiedono la revisione di madrelingua.
- Le tessere dei distretti sono uno schema, non una mappa: senza confini, e le posizioni seguono solo approssimativamente la disposizione reale. Una voce compare su una tessera solo se ne è stato indicato il distretto.
- Ciò che aggiungi resta in questo browser finché non lo scarichi; cancellare i dati del sito lo elimina. Non viene inviato nulla da nessuna parte.
- Il rilevamento dei duplicati confronta le lettere, ignorando segni diacritici, maiuscole e punteggiatura; non può sapere che due proverbi con parole diverse significano la stessa cosa.
- La pagina non può verificare che il consenso sia stato davvero dato: questo spetta a chi ha raccolto il testo.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/items/example.json` in `data/items/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.
5. Senza programmare: aggiungi voci nella pagina (scheda «Aggiunta»), scarica il tuo file di contributo (scheda «Esporta») e invialo in una issue o in una pull request; un maintainer lo importa con `python scripts/import_bundle.py` (vedi `docs/contributor-guide.md`; se raccogli da persone, leggi prima `docs/collecting-guide.md`).

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
