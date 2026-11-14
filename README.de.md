# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.1.0 · Letzte Aktualisierung: 2026-11-14

🌐 https://graiul.chiuta.ro

> Ein offenes Folklore-Archiv: Sprichwörter, Zaubersprüche, Rätsel und Lieder – mit Region und Quelle.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha: Das Repository enthält die Struktur, das Datenschema oder die ersten Beispiele und die Beitragsleitfäden. Der Umfang unten ist der Plan, nicht das, was heute funktioniert.

## Geplanter Umfang

- Einträge mit Region bis auf Kreisebene (județ), Quelle und Sprache: rund 50 Sprichwörter, 20 Rätsel mit Feld `answer`, 10 Zaubersprüche mit Feld `purpose` und ethnografischer Quelle sowie 10 traditionelle oder gemeinfreie Weihnachtslieder.
- Ungarische Einträge aus Rumänien (lang hu, Region Siebenbürgen) und französische Übersetzungen der 50 häufigsten Sprichwörter.
- Eine Kartenansicht (Region → Einträge) mit lokalem GeoJSON.
- Ein statischer Generator für die Seite „Sprichwort des Tages“ und ein Duplikatdetektor auf Basis normalisierten Textes.
- Leitlinien zum ethischen Sammeln von Folklore: Einwilligung und Namensnennung.

Nichts davon ist bisher umgesetzt: Jeder Punkt ist eine fertig vorbereitete Aufgabe in `ISSUES_GOOD_FIRST.md`.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/items/example.json` nach `data/items/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
