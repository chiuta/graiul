# Gute erste Aufgaben

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · **Deutsch** · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Sprichwörter aus Ihrer Region mit ausgefüllten `region` und `county` und je einer Quelle ergänzen (aus einem veröffentlichten Werk oder von einer Person, die zugestimmt hat: dann auch `collector` und `consent`)
- [ ] Rätsel (ghicitori) mit ihrer `answer` aus einer veröffentlichten oder gemeinfreien Quelle ergänzen
- [ ] Zaubersprüche (descântece) mit `purpose`, `collector` und `consent` ergänzen, nur mit der informierten Einwilligung der Überlieferungsträger und nie als medizinischer Rat
- [ ] Traditionelle oder gemeinfreie Weihnachtslieder (colinde) mit ihrer Quelle ergänzen
- [ ] Einträge der Ungarn in Rumänien (`lang: hu`, Region Transilvania) aus einer zitierten Quelle ergänzen
- [ ] Den Sprichwörtern im Archiv französische Übersetzungen (`translations.fr`) hinzufügen, wenn Sie Französisch schreiben
- [ ] Die 10 Startsprichwörter von einer Folkloristin oder von Muttersprachlern prüfen lassen und `status: reviewed` mit `reviewed_by` setzen
- [ ] Die Oberflächentexte in `src/i18n.mjs` (Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch, Ungarisch) von Muttersprachlern prüfen lassen; sie wurden mit einem KI-Assistenten geschrieben
- [ ] Das Kachel-Diagramm der Karte durch eine echte Karte ersetzen, gezeichnet aus einem lokalen gemeinfreien GeoJSON der Kreise, mit Textalternative und Kreisfilter
- [ ] Die Duplikaterkennung so erweitern, dass sie zwei Sprichwörter erkennt, die dasselbe mit anderen Wörtern sagen (zum Beispiel über ihre Übersetzungen), mit Tests

Lege sie alle auf GitHub mit `scripts/create_issues.sh` an (benötigt die `gh`-CLI).
