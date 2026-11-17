# GRAIUL

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

🌐 https://graiul.chiuta.ro

> An open archive of folklore: proverbs, charms, riddles and carols, each with region and source.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha, usable: the single `index.html` is an offline archive of Romanian folklore. It searches proverbs, charms, riddles, carols, tales, sayings and lullabies without regard to diacritics, with filters for type, language, region, county and reliability; shows a proverb of the day; counts the entries of each county on a schematic map; lets you add entries with a source and a consent, checks duplicates, and produces a contribution file that `scripts/import_bundle.py` turns into data files. The 10 starter entries are Romanian proverbs from a cited public page; there are no charms, riddles or carols yet, and nothing has been reviewed by a folklorist or a native speaker.

## What it does

- Search by words from the text, a translation, the answer, the region or the county, ignoring diacritics: typing `asteapta` finds `Așteaptă`. Filters for type, language, region, county and reliability (draft, sourced, reviewed); every result shows its source (a link when it has a web address), licence, consent and translations, and a riddle keeps its answer hidden until you ask for it.
- Proverb of the day: one proverb of the collection, chosen by the date alone, so that every device shows the same proverb on the same day; step to the previous or the next day, or type a date.
- Map: 42 tiles (41 counties and Bucharest) in a schematic layout, each with its number of entries; choosing a tile shows the entries of that county. It is a diagram, not a geographic map.
- Add: a form that checks every field, requires a source and, for charms and anything collected from a person, a consent; it refuses identical entries and asks you to confirm very similar ones; many entries can be added from a pasted list; what you add stays in the browser until you download it.
- Export and data: your entries as a contribution file that you can send to the project, a table (TSV) of the whole collection or of your entries, import of a contribution file and a search for duplicates; one JSON file per entry in `data/items/` and the county tiles in `data/counties.json`; interface in eight languages, dark and light themes, keyboard, works from 360 px wide; no network, no tracking.
- Installable as an app and available offline after the first visit when served over HTTPS (a service worker keeps the page; nothing else is stored or sent). Opened from a downloaded file it works the same, without installation.

## How it works

- `schema.json` and `counties.schema.json` describe the data; `scripts/validate.py` checks every file against them and against the rules a schema cannot express: the file name (`<lang>-<first words>`), the county tiles, a web address for `sourced` and a reviewer for `reviewed`, a consent for charms and anything collected from a person, and duplicates (an identical text is an error, a very similar one a warning).
- `src/engine.mjs` is the engine (no screen, no network): the folding rule used for searching, file names and duplicates, validation, ranking of results, the proverb of the day, TSV export, the contribution file and the parser for pasted lists. `scripts/validate.py` and `scripts/import_bundle.py` apply the same folding rule and the same similarity measure (trigrams, Dice coefficient, 0.85 for “very similar”); the tests compare the implementations.
- `src/ui.js`, `src/i18n.mjs` and `src/app.css` are the interface; `node scripts/build.mjs` builds the single `index.html` with the data embedded (`--check` verifies that it matches); `node scripts/potd.mjs` writes the proverb of a date as a small static page, by the same rule as the tab.
- `npm test` runs the tests of the engine, the data, the Python scripts, the build, the proverb-of-the-day script and the interface texts; the browser tests are in the hub. Development needs Node.js 24 or newer and Python 3 with `jsonschema`; the page itself only needs a browser that knows ES2017.
- `manifest.webmanifest`, `sw.js` and the icons are produced by `node scripts/build.mjs` through the shared kit (`pwa` in `src/app.json`); `--check` also verifies them, and `npm test` checks that the manifest, the service worker version and the CSP match the page.

## What this page does not do

- The starter data is small: ten Romanian proverbs taken from Wikiquote’s page “Romanian proverbs”, with their sources, without charms, riddles or carols and without a county. What is added later is only as reliable as its source.
- No entry of the starter data has been reviewed by a folklorist or a native speaker; entries marked “reviewed” name who reviewed them. “Sourced” only means that a source is cited. The interface texts in languages other than English and Romanian were written with an AI assistant and need native review.
- The county tiles are a schematic, not a map: no borders, and positions only roughly follow the real layout. An entry appears on a tile only if its county was recorded.
- What you add stays in this browser until you download it; clearing the site’s data deletes it. Nothing is sent anywhere.
- Duplicate detection compares letters, ignoring diacritics, capitals and punctuation; it cannot know that two proverbs with different words mean the same.
- The page cannot check that consent was really given: that rests on the person who collected the text.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/items/example.json` into `data/items/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.
5. No coding needed: add entries on the page (tab “Add”), download your contribution file (tab “Export”) and send it in an issue or a pull request; a maintainer imports it with `python scripts/import_bundle.py` (see `docs/contributor-guide.md`; if you collect from people, read `docs/collecting-guide.md` first).

## Good first issues

See `ISSUES_GOOD_FIRST.md` for ready-made tasks.

## License

Code: MIT. Contributed data: state its source; it is released under the same licence unless the file says otherwise.

## Support

If this project is useful, you can [buy me a coffee](https://buymeacoffee.com/echo.of.the.strings).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Add yourself with `@all-contributors please add @you for data` in your pull request.
