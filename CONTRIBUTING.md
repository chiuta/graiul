# Contributing — GRAIUL

**English** · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

1. Fork this repository.
2. Copy `data/items/example.json` into `data/items/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

## Rules

- One entry = one file.
- Always cite a source.
- Contribute only material you may legally share (no copied copyrighted text).
- Be kind: see the Code of Conduct.

## Adding folklore to the archive

1. Open the page (`index.html`, or https://graiul.chiuta.ro) and go to the “Add” tab: choose the type, write the text exactly as it is said (with its diacritics), give the language code (`ro`, `hu`, `rom` …) and, if you know them, the region and the county; a riddle needs its `answer`, a charm its `purpose`. Details: `docs/contributor-guide.md`.
2. Always give the source: a book or a web page (with its address), or the person you heard the text from. Mark an entry `sourced` only when you copied it from a published source with a web address, and `reviewed` only when a person other than you confirmed it and gave their name.
3. Ask before you publish what a person told you: say that it will be published with its source and under which licence, and that they may say no or ask to stay unnamed; then note `collector` and `consent` (`informed`, or `anonymised` when the name is withheld). A charm always needs a consent and is never presented as treatment or advice (see `docs/collecting-guide.md`).
4. Copy only what you may: public-domain works with their citation, your own collecting, or entries you have permission for; never a modern collection whole.
5. Press “Check” (identical and very similar entries are shown), then “Add to my list”; repeat for each entry, or paste a list under “Add many at once”.
6. In the “Export” tab press “Download my entries as a contribution file (JSON)” and send the file in an issue or a pull request; a maintainer runs `python scripts/import_bundle.py graiul-contribution-<date>.json` and then `python scripts/validate.py`.
7. If you prefer files, copy `data/items/example.json` to `data/items/<lang>-<first words>.json` (the first words without diacritics: `ro-cine-se-aseamana-se-aduna.json`; a second item with the same first words gets `-2`), edit it and run `python scripts/validate.py`.
