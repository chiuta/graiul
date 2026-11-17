# GRAIUL — contributor guide

**English** · [Română](contributor-guide.ro.md)

For anyone who knows a proverb, a riddle, a charm, a carol or a saying of Romanian folklore and wants to see it kept. **No coding is needed.** Everything happens on the page (`index.html`, or https://graiul.chiuta.ro): you add entries, check them, and download one file that you send to the project. If you collect from other people, read `collecting-guide.md` first.

## 1. What to add, and what not to

- **Texts** exactly as they are said, with their diacritics, and a **source**. The type (proverb, charm, riddle, carol, tale, saying, lullaby), the language code, the region and the county, translations and a note are part of the entry; only the text, the type, the language and the source are required.
- **Only what you know or can cite.** If you heard it from someone, the source is that person (“my grandmother, village X”), and you need their consent (see `collecting-guide.md`). If you read it somewhere, give the book or the web page and its address.
- **No copied collections.** One text with its source is fine; copying a modern book or website page by page is not. Public-domain works are welcome, with their citation.
- **Charms** are shown as heritage, never as treatment or advice. Write what a charm is said for in a few words (`purpose`), and never publish one that its bearer asked you to keep private.

## 2. The three reliability levels

| Level | Meaning | What the data needs |
| --- | --- | --- |
| `draft` | entered, not yet checked by anyone else | a source |
| `sourced` | taken from a published source | a source and its web address (`source_url`, starting with `https://`) |
| `reviewed` | confirmed by a person other than the one who entered it | a source and the reviewer’s name (`reviewed_by`) |

Search can show only `sourced` and `reviewed` entries, or only `reviewed` ones.

## 3. Add an entry

1. Open the **Add** tab.
2. Choose the **type**, write the **text as it is said** and give the **language code** (`ro`, `hu`, `rom` …).
3. A riddle needs its **answer**; a charm needs what it is said **for** (its purpose) and a **consent**.
4. Write the **source** (required) and, if the text comes from a person, choose the **consent** (see below).
5. Open **More details** for the region (for example Moldova, Transilvania, Maramureș; leave it empty if you do not know), the county, translations (one per line: `en: …`), a note, the web address of the source, the licence, who collected it and the reliability. The page remembers the last values, so the next entry starts from them.
6. Press **Check**: the page lists what to fix and shows entries that are identical or very similar to yours. Identical ones cannot be added; for a very similar one, check that it is a different entry and press **Add anyway**.
7. Press **Add to my list**. Repeat for every entry.

For a long list use **Add many at once**: one line per entry, the text then ` | ` (or a tab) and a translation; type, language, region, county, source and licence come from the form above. Lines that are empty or start with `#` are ignored, and the page tells you which lines it skipped and why.

## 4. The consent field

| Value | When |
| --- | --- |
| `published` | the text is taken from a published work, which you cite as the source |
| `informed` | the person who told you the text agreed to this publication, with their name |
| `anonymised` | the person agreed, but asked not to be named |

A charm, and any entry with a `collector`, must have one of the three. The page cannot check that consent was really given: that is your responsibility, and the maintainers may ask you how it was obtained.

## 5. Send it

What you add stays in your browser (500 entries at most) until you open the **Export** tab and press **Download my entries as a contribution file (JSON)**. That gives you `graiul-contribution-<date>.json`. Send it in one of these ways:

- open an issue (template “New entry”) and attach the file;
- or open a pull request that adds the file to the repository (any folder, for example `contributions/`; a maintainer imports it);
- or send it to the maintainers by e-mail.

The same tab downloads a table (TSV) of the whole collection or of your entries, imports a contribution file, and searches the whole collection for duplicates.

## 6. What the maintainers do

```
python scripts/import_bundle.py graiul-contribution-2026-11-17.json --dry-run   # shows what would be written
python scripts/import_bundle.py graiul-contribution-2026-11-17.json            # writes data/items/*.json
python scripts/validate.py                                                     # same checks as the CI
node scripts/build.mjs                                                         # rebuilds index.html
```

The importer never overwrites anything: an entry that already exists (same language and the same text apart from case, diacritics and punctuation) is skipped, and a second entry with the same first words gets a `-2`, `-3` … suffix. A very similar text is written but reported, so that a maintainer can look at it.

## 7. Prefer files? Work with the repository

Copy `data/items/example.json` to `data/items/<lang>-<first words>.json`: the file name is the language code and the first words of the text without diacritics (`ro-cine-se-aseamana-se-aduna.json`); a text without Latin letters uses the Unicode codes of its first characters. One entry = one file. Run `python scripts/validate.py` (needs Python 3 and `pip install jsonschema`): it tells you exactly what to fix. `python scripts/validate.py --list` shows how many entries there are per type, language, county and status.

## 8. How you can help most

- **Review** the starter proverbs: open an issue with the entry id (`ro-cine-se-aseamana-se-aduna`), say what is right or wrong, and give your name; a maintainer sets `status: reviewed` and `reviewed_by`.
- **Add the region and the county** where you know a proverb is said.
- **Add translations** into the languages you write.
- **Check the interface texts** in your language: they were written with an AI assistant and need a native reader.
- **Publish the proverb of the day**: `node scripts/potd.mjs --out public/potd` writes a small static page by the same rule as the “Proverb of the day” tab; run it from a daily job.

Be kind; see the Code of Conduct. Thank you for keeping this heritage alive.
