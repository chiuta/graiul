# GRAIUL

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.1.0 · Last updated: 2026-11-14

🌐 https://graiul.chiuta.ro

> An open archive of folklore: proverbs, charms, riddles and carols, each with region and source.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha: the repository holds the structure, the data schema or the first examples and the contribution guides. The scope below is the plan, not what works today.

## Planned scope

- Entries with a region filled to county level, source and language: about 50 proverbs, 20 riddles with an `answer` field, 10 charms with a `purpose` field and ethnographic source, and 10 traditional or public-domain carols.
- Hungarian-in-Romania entries (lang hu, region Transylvania) and French translations of the 50 most common proverbs.
- A map view (region → items) using a local GeoJSON.
- A static “proverb of the day” page generator and a duplicates detector based on normalised text.
- Guidelines on collecting folklore ethically: consent and attribution.

None of this is implemented yet: each item is a ready-made task in `ISSUES_GOOD_FIRST.md`.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/items/example.json` into `data/items/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

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
