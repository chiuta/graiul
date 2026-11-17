# Good first issues

**English** · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Add proverbs from your own region with `region` and `county` filled in and a source for each (from a published work, or from a person who agreed: then also `collector` and `consent`)
- [ ] Add riddles (ghicitori) with their `answer`, from a published or public-domain source
- [ ] Add charms (descântece) with `purpose`, `collector` and `consent`, only with the bearer’s informed consent and never as medical advice
- [ ] Add traditional or public-domain carols (colinde) with their source
- [ ] Add Hungarian-in-Romania entries (`lang: hu`, region Transilvania) from a cited source
- [ ] Add French translations (`translations.fr`) to the proverbs already in the archive, if you write French
- [ ] Have a folklorist or native speakers review the 10 starter proverbs and set `status: reviewed` with `reviewed_by`
- [ ] Have native speakers review the interface texts in `src/i18n.mjs` (French, Italian, Spanish, Portuguese, German, Hungarian); they were written with an AI assistant
- [ ] Replace the tile diagram of the map with a real map drawn from a local public-domain GeoJSON of the counties, keeping a text alternative and the county filter
- [ ] Make duplicate detection see two proverbs that say the same thing with different words (for example through their translations), with tests

Create them all on GitHub with `scripts/create_issues.sh` (needs the `gh` CLI).
