# Contribuer — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · **Français** · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version : 0.2.0 · Dernière mise à jour : 2026-11-17

1. Forkez ce dépôt.
2. Copiez `data/items/example.json` dans `data/items/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Règles

- Une entrée = un fichier.
- Citez toujours une source.
- Ne contribuez qu'avec du matériel que vous pouvez légalement partager (pas de texte protégé copié).
- Soyez bienveillant : voir le Code de conduite.

## Ajouter du folklore à l’archive

1. Ouvrez la page (`index.html` ou https://graiul.chiuta.ro) et allez à l’onglet « Ajout » : choisissez le type, écrivez le texte tel qu’on le dit (avec ses diacritiques), donnez le code de langue (`ro`, `hu`, `rom` …) et, si vous les connaissez, la région et le comté ; une devinette a besoin de son `answer`, une formule magique de son `purpose`. Détails: `docs/contributor-guide.md`.
2. Donnez toujours la source : un livre ou une page web (avec son adresse), ou la personne dont vous tenez le texte. Marquez une entrée `sourced` seulement si vous l’avez copiée d’une source publiée avec une adresse web, et `reviewed` seulement si une autre personne que vous l’a confirmée et a donné son nom.
3. Demandez avant de publier ce qu’une personne vous a dit : dites que cela sera publié avec sa source et sous quelle licence, et qu’elle peut refuser ou demander à rester anonyme ; notez ensuite `collector` et `consent` (`informed`, ou `anonymised` quand le nom est tenu secret). Une formule magique exige toujours un consentement et n’est jamais présentée comme un traitement ou un conseil (voir `docs/collecting-guide.md`).
4. Ne copiez que ce que vous pouvez : œuvres du domaine public avec leur citation, votre propre collecte ou entrées pour lesquelles vous avez une permission ; jamais une collection moderne en entier.
5. Appuyez sur « Vérifier » (les entrées identiques et très semblables sont montrées), puis sur « Ajouter à ma liste » ; répétez pour chaque entrée, ou collez une liste sous « Ajouter plusieurs d’un coup ».
6. Dans l’onglet « Export », appuyez sur « Télécharger mes entrées comme fichier de contribution (JSON) » et envoyez le fichier dans une issue ou une pull request ; un mainteneur lance `python scripts/import_bundle.py graiul-contribution-<date>.json`, puis `python scripts/validate.py`.
7. Si vous préférez les fichiers, copiez `data/items/example.json` vers `data/items/<langue>-<premiers mots>.json` (les premiers mots sans diacritiques : `ro-cine-se-aseamana-se-aduna.json` ; une deuxième entrée avec les mêmes premiers mots reçoit `-2`), modifiez-le et lancez `python scripts/validate.py`.
