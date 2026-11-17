#!/usr/bin/env python3
"""Check the GRAIUL data: every item against schema.json, then the cross-checks a schema cannot express.

  python scripts/validate.py            errors fail (exit 1); warnings are printed
  python scripts/validate.py --strict   warnings fail too
  python scripts/validate.py --list     also print how many items there are per type, language, county and status

Checked: data/items/*.json (schema.json) and data/counties.json (counties.schema.json); then file name = <lang>-<first words>
(a second item with the same first words gets -2, -3 …), the county tiles match the codes schema.json accepts and do not overlap,
exact duplicates (same language, same text apart from case, diacritics and punctuation) are errors, and near duplicates
(trigram similarity of at least 0.85) are warnings. data/items/example.json is checked against the schema only.
The folding rules (fold, plain, item_id, trigrams, similarity) are the same as in src/engine.mjs; the tests compare the two.
"""
import json
import pathlib
import re
import sys
import unicodedata

try:
    from jsonschema import Draft7Validator
except ImportError:  # pragma: no cover
    sys.exit("jsonschema is required: pip install jsonschema")

ROOT = pathlib.Path(__file__).resolve().parent.parent
NEAR = 0.85
MARKS = re.compile("[\u0300-\u036f]")
EXTRA = {"đ": "d", "ð": "d", "ł": "l", "ø": "o", "ß": "ss", "æ": "ae", "œ": "oe", "ı": "i", "þ": "th", "ħ": "h", "ə": "a", "ɨ": "i", "ʒ": "zh", "ʃ": "sh"}
EXTRA_RE = re.compile("[" + "".join(EXTRA) + "]")
# the same white space as JavaScript's \s, so that the two implementations agree on every string
JS_WS = "\t\n\u000b\u000c\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff"
WS = re.compile("[" + JS_WS + "]+")
WS_EDGES = re.compile("^[" + JS_WS + "]+|[" + JS_WS + "]+$")
PUNCT = re.compile("[" + JS_WS + ".,;:!?\"'`´‘’‚“”„«»‹›()\\[\\]{}<>/\\\\|*_~^=+@#$%&\\-–—…·•¡¿]+")


def strip(s):
    return WS_EDGES.sub("", s)


def fold(s):
    """Lower case, no combining marks, a few letters spelled out, white space collapsed."""
    s = MARKS.sub("", unicodedata.normalize("NFD", str(s).lower()))
    s = EXTRA_RE.sub(lambda m: EXTRA[m.group(0)], s)
    return strip(WS.sub(" ", s))


def plain(s):
    """Like fold, and without punctuation: the key used for duplicates and for searching."""
    return strip(WS.sub(" ", PUNCT.sub(" ", fold(s))))


def item_id(lang, text):
    """<lang>-<first words in plain letters, at most 60 characters>; text without Latin letters: 'u' + the first six code points."""
    words = [w for w in re.sub(r"[^a-z0-9 ]+", " ", plain(text)).split(" ") if w]
    slug = ""
    for w in words:
        nxt = slug + "-" + w if slug else w
        if slug and len(nxt) > 60:
            break
        slug = nxt[:60]
    if not slug:
        slug = "u" + "-".join("%x" % ord(c) for c in list(str(text).lower())[:6])
    return lang + "-" + slug


def trigrams(s):
    cp = list(" " + plain(s) + " ")
    return {"".join(cp[i:i + 3]) for i in range(len(cp) - 2)}


def dice(a, b):
    if not a or not b:
        return 0.0
    return 2 * len(a & b) / (len(a) + len(b))


def similarity(a, b):
    return dice(trigrams(a), trigrams(b))


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


SURROGATE = re.compile("[\ud800-\udfff]")


def strings(doc):
    """Every string in a JSON document, keys included."""
    if isinstance(doc, str):
        yield doc
    elif isinstance(doc, dict):
        for k, v in doc.items():
            yield k
            yield from strings(v)
    elif isinstance(doc, list):
        for v in doc:
            yield from strings(v)


LINE_FIELDS = ("region", "answer", "purpose", "collector", "source", "reviewed_by")
CTRL_LINE = re.compile("[\\x00-\\x1f\\x7f]")
CTRL_TEXT = re.compile("[\\x00-\\x09\\x0b-\\x1f\\x7f]")
LANG = re.compile("[a-z]{2,3}")
URL = re.compile(r"https://[^\u0000-\u0020\u007f-\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{1,500}")


def item_rules(e):
    """What the patterns in schema.json say, checked the way src/engine.mjs checks it. Python's `$` also matches before a final line
    break, so `region: "Moldova\\n"` would pass the schema here and fail in the page."""
    out = []
    if not isinstance(e, dict):
        return out
    for k in LINE_FIELDS:
        if isinstance(e.get(k), str) and CTRL_LINE.search(e[k]):
            out.append("%s: no control characters or line breaks allowed" % k)
    for k in ("text", "notes"):
        if isinstance(e.get(k), str) and CTRL_TEXT.search(e[k]):
            out.append("%s: no control characters allowed (line breaks are fine)" % k)
    if isinstance(e.get("lang"), str) and not LANG.fullmatch(e["lang"]):
        out.append("lang: two or three lower-case letters")
    if isinstance(e.get("source_url"), str) and not URL.fullmatch(e["source_url"]):
        out.append("source_url: an https:// address without spaces (at most 500 characters)")
    tr = e.get("translations")
    if isinstance(tr, dict):
        for k, v in tr.items():
            if not LANG.fullmatch(k):
                out.append("translations: %r is not a language code" % k[:10])
            if isinstance(v, str) and CTRL_TEXT.search(v):
                out.append("translations/%s: no control characters allowed (line breaks are fine)" % k[:10])
    return out


def item_errors(validator, e, label):
    """schema_errors plus item_rules."""
    return schema_errors(validator, e, label) + ["%s: %s" % (label, m) for m in item_rules(e)]


def schema_errors(validator, doc, label):
    out = []
    for err in sorted(validator.iter_errors(doc), key=lambda e: list(map(str, e.absolute_path))):
        where = "/".join(map(str, err.absolute_path)) or "(root)"
        out.append("%s: %s: %s" % (label, where, err.message))
    # JSON allows "\ud800" on its own; UTF-8 (the data files, the exported file) cannot hold it
    if any(SURROGATE.search(s) for s in strings(doc)):
        out.append("%s: (root): a text contains half of a surrogate pair (not valid text)" % label)
    return out


def check(root=ROOT):
    """Return (errors, warnings, stats)."""
    errors, warnings = [], []
    schema = load(root / "schema.json")
    sch_item = Draft7Validator(schema)
    sch_counties = Draft7Validator(load(root / "counties.schema.json"))
    doc = load(root / "data" / "counties.json")
    errors += schema_errors(sch_counties, doc, "data/counties.json")
    tiles = doc.get("counties", []) if isinstance(doc, dict) else []
    codes = [t.get("code") for t in tiles if isinstance(t, dict)]
    allowed = list(schema["properties"]["county"]["enum"])
    if len(set(codes)) != len(codes):
        errors.append("data/counties.json: duplicate county code")
    if sorted(c for c in codes if c) != sorted(allowed):
        errors.append("data/counties.json: the codes must be exactly the ones schema.json accepts for `county`")
    cells = {}
    for t in tiles:
        if not isinstance(t, dict) or "col" not in t or "row" not in t:
            continue
        cell = (t["col"], t["row"])
        if cell in cells:
            errors.append("data/counties.json: %s and %s share the cell %d,%d" % (cells[cell], t.get("code"), cell[0], cell[1]))
        else:
            cells[cell] = t.get("code")

    files = sorted((root / "data" / "items").glob("*.json"), key=lambda p: p.stem)  # xx-a before xx-a-2
    seen, per = {}, {"type": {}, "lang": {}, "county": {}, "status": {}}
    items = []  # (rel, lang, text, trigrams) in order
    for f in files:
        rel = f.relative_to(root).as_posix()
        try:
            e = load(f)
        except ValueError as ex:
            errors.append("%s: not valid JSON (%s)" % (rel, ex))
            continue
        bad = item_errors(sch_item, e, rel)
        errors += bad
        if bad or f.name == "example.json":  # the template is checked against the schema only
            continue
        base = f.name[:-5]
        want = item_id(e["lang"], e["text"])
        if not (base == want or re.fullmatch(re.escape(want) + r"-[2-9]\d?", base)):
            errors.append("%s: the file name must be %s.json (or %s-2.json, -3 … for a second item with the same first words)" % (rel, want, want))
        key = e["lang"] + "|" + plain(e["text"])
        if key in seen:
            errors.append("%s: duplicate of %s (same language and the same text apart from case, diacritics and punctuation)" % (rel, seen[key]))
            continue
        seen[key] = rel
        tri = trigrams(e["text"])
        for other in items:
            if other[1] == e["lang"]:
                score = dice(tri, other[3])
                if score >= NEAR:
                    warnings.append("%s: very similar to %s (%d%%): another item or the same one? (use the notes to tell them apart)" % (rel, other[0], int(score * 100)))
        items.append((rel, e["lang"], e["text"], tri))
        for k, v in (("type", e["type"]), ("lang", e["lang"]), ("county", e.get("county", "-")), ("status", e.get("status", "draft"))):
            per[k][v] = per[k].get(v, 0) + 1
    return errors, warnings, {"items": len(items), "per": per, "counties": len(tiles)}


def main(argv):
    strict, show = "--strict" in argv, "--list" in argv
    errors, warnings, st = check()
    for w in warnings:
        print("warning: " + w)
    for e in errors:
        print("error: " + e)
    if show:
        for k in ("type", "lang", "county", "status"):
            print("%s: %s" % (k, ", ".join("%s %d" % (a, b) for a, b in sorted(st["per"][k].items())) or "-"))
    print("%d items, %d county tiles, %d error(s), %d warning(s)." % (st["items"], st["counties"], len(errors), len(warnings)))
    return 1 if errors or (strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
