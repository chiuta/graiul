# Änderungsprotokoll

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · **Deutsch** · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Unveröffentlicht]

## [0.2.1] - 2026-11-20

### Geändert
- fff-kit 1.8.1: Blockiert der Browser den Speicher oder fehlt er (`localStorage`/`sessionStorage` lösen einen Fehler aus oder fehlen), startet die Seite mit einem temporären Arbeitsspeicher, statt anzuhalten; die Daten bleiben nach dem Schließen der Seite nicht erhalten.
- fff-kit 1.8.1: Die Hilfe, die kleine Bedienelemente auf 44 px vergrößert, misst jetzt auch die Breite des Seitenkörpers und des übergeordneten Elements; eine Schaltflächenreihe kann den Bildschirm also nicht mehr verlassen (die Gruppe bleibt unverändert, wenn die Vergrößerung sie zu breit machen würde).

## [0.2.0] - 2026-11-17

### Hinzugefügt
- Der Motor in `src/engine.mjs`: Suche ohne Rücksicht auf Diakritika mit Rangfolge, Validierung der Einträge, identische und sehr ähnliche Einträge, Sprichwort des Tages, Zählung je Kreis, TSV-Export, Beitragsdatei und Parser für eingefügte Listen.
- TSV-Export für Tabellenkalkulationen: Eine Zelle, die mit `=`, `+`, `-` oder `@` beginnt, erhält ein Apostroph davor, damit Excel oder LibreOffice sie nicht als Formel ausführt (ein Text, der wirklich mit `-` beginnt, zeigt deshalb ein Apostroph in der Tabelle). Die von der Seite heruntergeladene Datei beginnt außerdem mit einer UTF-8-Bytereihenfolge-Marke, damit die Diakritika richtig angezeigt werden.
- Die Oberfläche in `src/ui.js`, `src/i18n.mjs` und `src/app.css`: Suche, Sprichwort des Tages, Kreiskarte, Hinzufügen (ein Eintrag oder viele auf einmal), Export, Import und Anleitung; acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite, und die Karte hat eine Ersatzanordnung für Browser ohne CSS Grid.
- Rücksicht auf Tastatur- und Screenreader-Nutzer: Der Fokus geht nie verloren (nach «Alle Kreise anzeigen» springt er auf die Kachel des gewählten Kreises; nach dem Ändern der Zuverlässigkeit im Formular zum Hinzufügen bleibt er in diesem Feld), «Weitere Angaben» bleibt beim Ändern der Art geöffnet, und die Filter für Sprache und Region springen auf «Alle Sprachen» und «Alle Regionen» zurück, wenn der letzte Eintrag mit diesem Wert entfernt wird.
- Wenn etwas schiefgeht, sagt die Seite es und behält Ihre Arbeit: Die Zeilen, die «Viele auf einmal hinzufügen» ablehnt, bleiben im Feld, jeweils mit Zeilennummer und Grund; hat der Browser keinen Platz mehr für die Einträge, werden Hinzufügen und Import rückgängig gemacht und es erscheint ein Fehler, statt sie als gespeichert zu melden; ein gespeicherter Zustand mit feindlichen oder ungültigen Werten (eine ID wie `__proto__`, eine unbekannte Sprache, ein unbekannter Kreis, eine unbekannte Lizenz oder Einwilligung, zu lange Felder) wird beim Start der Seite bereinigt und gelangt nie ins Formular.
- Die Suche nach Duplikaten bleibt bei großen Dateien schnell: Jeder Text wird nur einmal analysiert, nur Paare ähnlicher Größe werden verglichen, und der Vergleich bricht ab, sobald die Schwelle nicht mehr erreichbar ist, mit genau denselben Ergebnissen wie die einfache Definition (getestet); der Import einer Datei von mehreren Megabyte lässt die Seite nicht mehr hängen.
- Daten: 10 rumänische Sprichwörter mit ihren Quellen (die von Wikiquote übernommenen englischen Entsprechungen sind mit CC BY-SA 4.0 gekennzeichnet), die Kreiskacheln `data/counties.json` und ein strengeres `schema.json` (Arten, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: prüft jede Datei gegen ihr Schema und die Regeln, die ein Schema nicht ausdrücken kann (Dateiname, Kreiskacheln, `sourced` und `reviewed`, Einwilligung, Duplikate); `scripts/import_bundle.py` wandelt die von der Seite erzeugte Beitragsdatei in Datendateien um; `scripts/potd.mjs` schreibt das Sprichwort eines Datums als statische Seite.
- `docs/contributor-guide.md` und `docs/collecting-guide.md` (auch auf Rumänisch): wie man Einträge hinzufügt und wie man Folklore ethisch sammelt (Einwilligung, Namensnennung, was man nicht veröffentlicht).
- Tests: `npm test` (der Motor, die Daten, die Python-Skripte, das Skript für das Sprichwort des Tages, der Build und die Oberflächentexte) und Browsertests im Hub (acht Sprachen, Barrierefreiheit, feindlicher gespeicherter Zustand, Import und Export, kleine Bildschirme).
- `src/` und `scripts/build.mjs`: Die eine `index.html` wird jetzt aus den Quellen gebaut, mit eingebetteten Daten, und `--check` prüft sie.
- ISSUES_GOOD_FIRST und CODE_OF_CONDUCT in alle acht Sprachen übersetzt.
- README auf Englisch, Rumänisch, Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch: Abschnitte zu Status und geplantem Umfang (abgeleitet aus `ISSUES_GOOD_FIRST.md`).
- Installierbar (PWA): `manifest.webmanifest`, `sw.js` und die Symbole werden vom gemeinsamen Kit (`fff-kit/pwa`) erzeugt; die Seite funktioniert nach dem ersten Besuch über HTTPS offline.

### Geändert
- Der Workflow läuft auf Ubuntu 26.04 mit Node.js 26 und führt auch die Tests, die Build-Prüfung und die Datenvalidierung aus.
- `schema.json` lehnt unbekannte Felder ab und beschreibt jetzt die Arten, `answer` für Rätsel, `purpose` für Zaubersprüche, `consent` für Zaubersprüche und alles mit einem `collector`, `county`, `translations`, `source_url`, `license`, `status` und `reviewed_by`.
- Die README listet keinen geplanten Umfang mehr auf: Sie beschreibt, was die Seite kann und was sie noch nicht kann.

## [0.1.0] - 2026-11-13

### Hinzugefügt
- Erstes Gerüst: Struktur, Datenschema oder erste Beispiele, Beitragsanleitungen in acht Sprachen.
