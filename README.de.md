# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

🌐 https://graiul.chiuta.ro

> Ein offenes Folklore-Archiv: Sprichwörter, Zaubersprüche, Rätsel und Lieder – mit Region und Quelle.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha, nutzbar: Die eine `index.html` ist ein Offline-Archiv rumänischer Folklore. Es sucht Sprichwörter, Zaubersprüche, Rätsel, Weihnachtslieder, Märchen, Redensarten und Wiegenlieder ohne Rücksicht auf Diakritika, mit Filtern für Art, Sprache, Region, Kreis und Zuverlässigkeit; zeigt ein Sprichwort des Tages; zählt die Einträge jedes Kreises auf einer schematischen Karte; lässt Sie Einträge mit Quelle und Einwilligung hinzufügen, prüft Duplikate und erzeugt eine Beitragsdatei, die `scripts/import_bundle.py` in Datendateien umwandelt. Die 10 Startdatensätze sind rumänische Sprichwörter von einer zitierten öffentlichen Seite; es gibt noch keine Zaubersprüche, Rätsel oder Lieder, und nichts wurde von Folkloristen oder Muttersprachlern geprüft.

## Was es kann

- Suche nach Wörtern aus dem Text, einer Übersetzung, der Antwort, der Region oder dem Kreis, ohne Rücksicht auf Diakritika: Die Eingabe `asteapta` findet `Așteaptă`. Filter für Art, Sprache, Region, Kreis und Zuverlässigkeit (Entwurf, mit Quelle, geprüft); jedes Ergebnis zeigt Quelle (als Link, wenn sie eine Webadresse hat), Lizenz, Einwilligung und Übersetzungen, und ein Rätsel hält seine Antwort verborgen, bis Sie danach fragen.
- Sprichwort des Tages: ein Sprichwort der Sammlung, allein nach dem Datum gewählt, sodass jedes Gerät am selben Tag dasselbe Sprichwort zeigt; Sie können zum vorherigen oder nächsten Tag springen oder ein Datum eintippen.
- Karte: 42 Kacheln (41 Kreise und Bukarest) in schematischer Anordnung, jede mit ihrer Zahl der Einträge; eine Kachel zu wählen zeigt die Einträge dieses Kreises. Es ist ein Diagramm, keine geografische Karte.
- Hinzufügen: ein Formular, das jedes Feld prüft, eine Quelle verlangt und, bei Zaubersprüchen und allem, was von einer Person gesammelt wurde, eine Einwilligung; es weist identische Einträge zurück und lässt Sie sehr ähnliche bestätigen; viele Einträge lassen sich aus einer eingefügten Liste hinzufügen; was Sie hinzufügen, bleibt im Browser, bis Sie es herunterladen.
- Export und Daten: Ihre Einträge als Beitragsdatei, die Sie an das Projekt schicken können, eine Tabelle (TSV) der ganzen Sammlung oder Ihrer Einträge, der Import einer Beitragsdatei und eine Suche nach Duplikaten; eine JSON-Datei pro Eintrag in `data/items/` und die Kreiskacheln in `data/counties.json`; Oberfläche in acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite; ohne Netz, ohne Tracking.
- Als App installierbar und nach dem ersten Besuch offline verfügbar, wenn sie über HTTPS ausgeliefert wird (ein Service Worker behält die Seite; sonst wird nichts gespeichert oder gesendet). Aus einer heruntergeladenen Datei geöffnet, funktioniert sie genauso, ohne Installation.

## Wie es funktioniert

- `schema.json` und `counties.schema.json` beschreiben die Daten; `scripts/validate.py` prüft jede Datei dagegen und gegen die Regeln, die ein Schema nicht ausdrücken kann: den Dateinamen (`<Sprache>-<erste Wörter>`), die Kreiskacheln, eine Webadresse für `sourced` und eine prüfende Person für `reviewed`, eine Einwilligung bei Zaubersprüchen und allem, was von einer Person gesammelt wurde, und Duplikate (ein identischer Text ist ein Fehler, ein sehr ähnlicher eine Warnung).
- `src/engine.mjs` ist der Motor (ohne Bildschirm, ohne Netz): die Normalisierungsregel für Suche, Dateinamen und Duplikate, die Validierung, die Rangfolge der Ergebnisse, das Sprichwort des Tages, der TSV-Export, die Beitragsdatei und der Parser für eingefügte Listen. `scripts/validate.py` und `scripts/import_bundle.py` wenden dieselbe Normalisierungsregel und dasselbe Ähnlichkeitsmaß an (Trigramme, Dice-Koeffizient, 0,85 für „sehr ähnlich“); die Tests vergleichen die Implementierungen.
- `src/ui.js`, `src/i18n.mjs` und `src/app.css` sind die Oberfläche; `node scripts/build.mjs` baut die eine `index.html` mit den eingebetteten Daten (`--check` prüft, ob sie übereinstimmt); `node scripts/potd.mjs` schreibt das Sprichwort eines Datums als kleine statische Seite, nach derselben Regel wie der Reiter.
- `npm test` führt die Tests des Motors, der Daten, der Python-Skripte, des Builds, des Skripts für das Sprichwort des Tages und der Oberflächentexte aus; die Browsertests liegen im Hub. Die Entwicklung braucht Node.js 24 oder neuer und Python 3 mit `jsonschema`; die Seite selbst braucht nur einen Browser, der ES2017 kennt.
- `manifest.webmanifest`, `sw.js` und die Symbole erzeugt `node scripts/build.mjs` über das gemeinsame Kit (Abschnitt `pwa` in `src/app.json`); `--check` prüft sie ebenfalls, und `npm test` stellt sicher, dass Manifest, Service-Worker-Version und CSP zur Seite passen.

## Was diese Seite nicht leistet

- Die Startdaten sind knapp: zehn rumänische Sprichwörter von der Wikiquote-Seite „Romanian proverbs“, mit ihren Quellen, ohne Zaubersprüche, Rätsel oder Lieder und ohne Kreis. Was später hinzukommt, ist nur so verlässlich wie seine Quelle.
- Kein Eintrag der Startdaten wurde von Folkloristen oder Muttersprachlern geprüft; als „geprüft“ markierte Einträge nennen, wer sie geprüft hat. „Mit Quelle“ heißt nur, dass eine Quelle genannt ist. Die Oberflächentexte in anderen Sprachen als Englisch und Rumänisch wurden mit einem KI-Assistenten geschrieben und brauchen eine Prüfung durch Muttersprachler.
- Die Kreiskacheln sind ein Schema, keine Karte: ohne Grenzen, und die Positionen folgen der wirklichen Lage nur grob. Ein Eintrag erscheint nur dann auf einer Kachel, wenn sein Kreis erfasst wurde.
- Was Sie hinzufügen, bleibt in diesem Browser, bis Sie es herunterladen; das Löschen der Website-Daten löscht es. Nichts wird irgendwohin gesendet.
- Die Duplikaterkennung vergleicht Buchstaben und ignoriert Diakritika, Großschreibung und Satzzeichen; sie kann nicht wissen, dass zwei Sprichwörter mit verschiedenen Wörtern dasselbe bedeuten.
- Die Seite kann nicht prüfen, ob die Einwilligung wirklich erteilt wurde: Das liegt bei der Person, die den Text gesammelt hat.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/items/example.json` nach `data/items/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.
5. Ohne Programmieren: Fügen Sie Einträge auf der Seite hinzu (Reiter „Hinzufügen“), laden Sie Ihre Beitragsdatei herunter (Reiter „Export“) und schicken Sie sie in einem Issue oder Pull Request; ein Maintainer importiert sie mit `python scripts/import_bundle.py` (siehe `docs/contributor-guide.md`; wenn Sie bei Menschen sammeln, lesen Sie zuerst `docs/collecting-guide.md`).

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
