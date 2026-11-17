#!/usr/bin/env python3
"""Turn a contribution file made by the app ("Download my entries as a contribution file") into data files.

  python scripts/import_bundle.py graiul-contribution.json            write the files
  python scripts/import_bundle.py graiul-contribution.json --dry-run  only show what would be written

For every entry it writes data/items/<lang>-<first words>.json. An entry whose text already exists (same language, same text apart from
case, diacritics and punctuation) is skipped; one whose first words clash with another item gets a -2, -3 … suffix. A very similar
text is written but reported, so that a maintainer can look at it. Nothing is overwritten. Afterwards it runs the same checks as
scripts/validate.py. Needs the jsonschema package (pip install jsonschema); no network.
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import validate  # noqa: E402

ROOT = validate.ROOT
ORDER = ["type", "lang", "text", "region", "county", "translations", "answer", "purpose", "notes", "collector", "consent", "source", "source_url", "license", "status", "reviewed_by"]
MAX_ENTRIES = 500


def shorten(value, n=40):
    """A few characters of a text for a message: no control characters and no lone surrogates (they cannot be printed)."""
    text = str(value)[:n].encode("utf-8", "replace").decode("utf-8")
    return "".join(" " if ord(c) < 32 or ord(c) == 127 else c for c in text)


def canonical(entry):
    extra = [k for k in entry if k not in ORDER]
    if extra:
        raise ValueError("unknown field(s): " + ", ".join(sorted(extra)))
    out = {k: entry[k] for k in ORDER if k in entry}
    if isinstance(out.get("translations"), dict):
        out["translations"] = {k: out["translations"][k] for k in sorted(out["translations"])}
    return out


def existing(root):
    """{lang|plain text: file name} and the trigram sets of the items already in data/items/."""
    keys, tri = {}, []
    for f in sorted((root / "data" / "items").glob("*.json")):
        if f.name == "example.json":
            continue
        try:
            e = validate.load(f)
            keys[e["lang"] + "|" + validate.plain(e["text"])] = f.name
            tri.append((f.name, e["lang"], validate.trigrams(e["text"])))
        except (ValueError, KeyError, TypeError):
            continue  # validate.py reports broken files
    return keys, tri


def main(argv):
    dry = "--dry-run" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if len(paths) != 1:
        print(__doc__, file=sys.stderr)
        return 2
    try:
        bundle = json.loads(pathlib.Path(paths[0]).read_text(encoding="utf-8"))
    except (OSError, ValueError) as ex:
        print("cannot read %s: %s" % (paths[0], ex), file=sys.stderr)
        return 2
    if not isinstance(bundle, dict) or bundle.get("format") != "graiul-bundle" or bundle.get("version") != 1 or not isinstance(bundle.get("entries"), list):
        print("not a GRAIUL contribution file (format graiul-bundle, version 1)", file=sys.stderr)
        return 2
    if len(bundle["entries"]) > MAX_ENTRIES:
        print("too many entries (%d; the limit is %d)" % (len(bundle["entries"]), MAX_ENTRIES), file=sys.stderr)
        return 2
    sch = validate.Draft7Validator(validate.load(ROOT / "schema.json"))
    keys, tri = existing(ROOT)
    reserved = set()
    written, skipped, problems = 0, 0, 0
    for n, raw in enumerate(bundle["entries"], 1):
        label = "entry %d" % n
        if not isinstance(raw, dict):
            print("%s: not an object" % label)
            problems += 1
            continue
        try:
            entry = canonical(raw)
            bad = validate.item_errors(sch, entry, label)
            if bad:
                raise ValueError("; ".join(b.split(": ", 2)[-1] if ": " in b else b for b in bad))
        except ValueError as ex:
            print("%s (%s): %s" % (label, shorten(raw.get("text", "?")), ex))
            problems += 1
            continue
        key = entry["lang"] + "|" + validate.plain(entry["text"])
        if key in keys:
            print("skip %s: already present as %s" % (validate.item_id(entry["lang"], entry["text"]), keys[key]))
            skipped += 1
            continue
        base = validate.item_id(entry["lang"], entry["text"])
        eid, k = base, 2
        while (ROOT / "data" / "items" / (eid + ".json")).exists() or eid in reserved:
            eid = "%s-%d" % (base, k)
            k += 1
        if k > 100:
            print("%s: too many items start with the same words (%s)" % (label, base))
            problems += 1
            continue
        t = validate.trigrams(entry["text"])
        for name, lang, other in tri:
            if lang == entry["lang"]:
                score = validate.dice(t, other)
                if score >= validate.NEAR:
                    print("warning: %s is very similar to %s (%d%%)" % (eid, name, int(score * 100)))
        print("%s %s" % ("would write" if dry else "write", eid))
        reserved.add(eid)
        keys[key] = eid + ".json"
        tri.append((eid + ".json", entry["lang"], t))
        if not dry:
            (ROOT / "data" / "items" / (eid + ".json")).write_text(json.dumps(entry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        written += 1
    print("%d written, %d skipped, %d with problems" % (written, skipped, problems))
    if not dry and written:
        errors, warnings, _ = validate.check()
        for w in warnings:
            print("warning: " + w)
        for e in errors:
            print("error: " + e)
        if errors:
            return 1
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
