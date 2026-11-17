# Jó első feladatok

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · **Magyar**

- [ ] Közmondások felvétele a saját régiódból kitöltött `region` és `county` mezővel, mindegyikhez forrással (közzétett műből, vagy olyan személytől, aki beleegyezett: ekkor `collector` és `consent` is)
- [ ] Találós kérdések (ghicitori) felvétele `answer` mezővel, közzétett vagy közkincs forrásból
- [ ] Ráolvasások (descântece) felvétele `purpose`, `collector` és `consent` mezővel, csak a hagyományőrző tájékozott beleegyezésével, és soha nem orvosi tanácsként
- [ ] Hagyományos vagy közkincs kolindák felvétele a forrásukkal
- [ ] Romániai magyar bejegyzések felvétele (`lang: hu`, Transilvania régió) idézett forrásból
- [ ] Francia fordítások (`translations.fr`) hozzáadása az archívumban már meglévő közmondásokhoz, ha írsz franciául
- [ ] A 10 kezdő közmondás átnézetése folkloristával vagy anyanyelvi beszélőkkel, és a `status: reviewed` beállítása `reviewed_by` mezővel
- [ ] A `src/i18n.mjs` felületi szövegeinek (francia, olasz, spanyol, portugál, német, magyar) átnézetése anyanyelvi beszélőkkel; MI-asszisztenssel íródtak
- [ ] A térkép csempeábrájának lecserélése valódi térképre, amelyet a megyék közkincs, helyi GeoJSON-ból rajzol, szöveges alternatívával és a megyeszűrővel
- [ ] Az ismétlődés-keresés megtanítása arra, hogy két, másképp megfogalmazott, de azonos jelentésű közmondást is észrevegyen (például a fordításaik alapján), tesztekkel

Hozd létre mindet GitHubon a `scripts/create_issues.sh` szkripttel (a `gh` CLI szükséges).
