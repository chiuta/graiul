# Mitmachen — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · **Deutsch** · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

1. Forke dieses Repository.
2. Kopiere `data/items/example.json` nach `data/items/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Regeln

- Ein Eintrag = eine Datei.
- Gib immer eine Quelle an.
- Steuere nur Material bei, das du rechtmäßig teilen darfst (keine kopierten geschützten Texte).
- Sei freundlich: siehe Verhaltenskodex.

## Folklore zum Archiv beitragen

1. Öffnen Sie die Seite (`index.html` oder https://graiul.chiuta.ro) und gehen Sie zum Reiter „Hinzufügen“: Wählen Sie die Art, schreiben Sie den Text genau so, wie er gesprochen wird (mit Diakritika), geben Sie den Sprachcode an (`ro`, `hu`, `rom` …) und, falls bekannt, Region und Kreis; ein Rätsel braucht seine `answer`, ein Zauberspruch seinen `purpose`. Einzelheiten: `docs/contributor-guide.md`.
2. Geben Sie immer die Quelle an: ein Buch oder eine Webseite (mit Adresse) oder die Person, von der Sie den Text gehört haben. Markieren Sie einen Eintrag nur dann als `sourced`, wenn Sie ihn aus einer veröffentlichten Quelle mit Webadresse übernommen haben, und als `reviewed` nur, wenn eine andere Person als Sie ihn bestätigt und ihren Namen genannt hat.
3. Fragen Sie, bevor Sie veröffentlichen, was Ihnen eine Person erzählt hat: Sagen Sie, dass es mit seiner Quelle und unter welcher Lizenz veröffentlicht wird und dass die Person ablehnen oder anonym bleiben darf; notieren Sie dann `collector` und `consent` (`informed`, oder `anonymised`, wenn der Name zurückgehalten wird). Ein Zauberspruch braucht immer eine Einwilligung und wird nie als Behandlung oder Rat dargestellt (siehe `docs/collecting-guide.md`).
4. Kopieren Sie nur, was erlaubt ist: gemeinfreie Werke mit Quellenangabe, Ihre eigene Sammlung oder Einträge, für die Sie eine Erlaubnis haben; nie eine moderne Sammlung als Ganzes.
5. Drücken Sie „Prüfen“ (identische und sehr ähnliche Einträge werden gezeigt), dann „Zu meiner Liste hinzufügen“; wiederholen Sie das für jeden Eintrag oder fügen Sie unter „Viele auf einmal hinzufügen“ eine Liste ein.
6. Drücken Sie im Reiter „Export“ auf „Meine Einträge als Beitragsdatei herunterladen (JSON)“ und schicken Sie die Datei in einem Issue oder Pull Request; ein Maintainer führt `python scripts/import_bundle.py graiul-contribution-<Datum>.json` und dann `python scripts/validate.py` aus.
7. Wenn Sie Dateien bevorzugen, kopieren Sie `data/items/example.json` nach `data/items/<Sprache>-<erste Wörter>.json` (die ersten Wörter ohne Diakritika: `ro-cine-se-aseamana-se-aduna.json`; ein zweiter Eintrag mit denselben ersten Wörtern erhält `-2`), bearbeiten Sie sie und führen Sie `python scripts/validate.py` aus.
