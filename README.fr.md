# GRAIUL

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.2.0 · Dernière mise à jour : 2026-11-17

🌐 https://graiul.chiuta.ro

> Une archive ouverte de folklore : proverbes, formules magiques, devinettes et chants, avec région et source.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha, utilisable : l’unique `index.html` est une archive hors ligne du folklore roumain. Il cherche proverbes, formules magiques, devinettes, chants de Noël, contes, dictons et berceuses sans tenir compte des diacritiques, avec des filtres par type, langue, région, comté et fiabilité ; affiche un proverbe du jour ; compte les entrées de chaque comté sur une carte schématique ; permet d’ajouter des entrées avec source et consentement, vérifie les doublons et produit un fichier de contribution que `scripts/import_bundle.py` transforme en fichiers de données. Les 10 entrées de départ sont des proverbes roumains d’une page publique citée ; il n’y a pas encore de formules magiques, de devinettes ni de chants, et rien n’a été relu par un folkloriste ou un locuteur natif.

## Ce que fait l’application

- Recherche par mots du texte, d’une traduction, de la réponse, de la région ou du comté, sans tenir compte des diacritiques : taper `asteapta` trouve `Așteaptă`. Filtres par type, langue, région, comté et fiabilité (brouillon, sourcé, relu) ; chaque résultat montre sa source (un lien si elle a une adresse web), sa licence, le consentement et les traductions, et une devinette garde sa réponse cachée jusqu’à ce que vous la demandiez.
- Proverbe du jour : un proverbe de la collection, choisi par la seule date, de sorte que tous les appareils affichent le même proverbe le même jour ; passez au jour précédent ou suivant, ou saisissez une date.
- Carte : 42 tuiles (41 comtés et Bucarest) en disposition schématique, chacune avec son nombre d’entrées ; choisir une tuile montre les entrées de ce comté. C’est un schéma, pas une carte géographique.
- Ajout : un formulaire qui vérifie chaque champ, exige une source et, pour les formules magiques et tout ce qui a été recueilli auprès d’une personne, un consentement ; il refuse les entrées identiques et vous demande de confirmer celles qui sont très semblables ; on peut ajouter plusieurs entrées à partir d’une liste collée ; ce que vous ajoutez reste dans le navigateur jusqu’à ce que vous le téléchargiez.
- Export et données : vos entrées sous forme de fichier de contribution à envoyer au projet, un tableau (TSV) de toute la collection ou de vos entrées, l’import d’un fichier de contribution et une recherche de doublons ; un fichier JSON par entrée dans `data/items/` et les tuiles des comtés dans `data/counties.json` ; interface en huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large ; sans réseau, sans pistage.
- Installable comme une application et disponible hors ligne après la première visite lorsqu’elle est servie en HTTPS (un service worker conserve la page ; rien d’autre n’est stocké ni envoyé). Ouverte depuis un fichier téléchargé, elle fonctionne de la même manière, sans installation.

## Comment ça marche

- `schema.json` et `counties.schema.json` décrivent les données ; `scripts/validate.py` vérifie chaque fichier par rapport à eux et aux règles qu’un schéma ne peut pas exprimer : le nom du fichier (`<langue>-<premiers mots>`), les tuiles des comtés, une adresse web pour `sourced` et un relecteur pour `reviewed`, un consentement pour les formules magiques et tout ce qui a été recueilli auprès d’une personne, et les doublons (un texte identique est une erreur, un texte très semblable un avertissement).
- `src/engine.mjs` est le moteur (sans écran, sans réseau) : la règle de normalisation utilisée pour la recherche, les noms de fichiers et les doublons, la validation, le classement des résultats, le proverbe du jour, l’export TSV, le fichier de contribution et l’analyseur des listes collées. `scripts/validate.py` et `scripts/import_bundle.py` appliquent la même règle de normalisation et la même mesure de similarité (trigrammes, coefficient de Dice, 0,85 pour « très semblable ») ; les tests comparent les implémentations.
- `src/ui.js`, `src/i18n.mjs` et `src/app.css` forment l’interface ; `node scripts/build.mjs` construit l’unique `index.html` avec les données intégrées (`--check` vérifie qu’il correspond) ; `node scripts/potd.mjs` écrit le proverbe d’une date comme petite page statique, selon la même règle que l’onglet.
- `npm test` lance les tests du moteur, des données, des scripts Python, de la construction, du script du proverbe du jour et des textes de l’interface ; les tests de navigateur sont dans le hub. Le développement demande Node.js 24 ou plus récent et Python 3 avec `jsonschema` ; la page elle-même n’a besoin que d’un navigateur qui connaît ES2017.
- `manifest.webmanifest`, `sw.js` et les icônes sont produits par `node scripts/build.mjs` via le kit commun (section `pwa` de `src/app.json`) ; `--check` les vérifie aussi, et `npm test` contrôle que le manifeste, la version du service worker et la CSP correspondent à la page.

## Ce que cette page ne fait pas

- Les données de départ sont peu nombreuses : dix proverbes roumains pris sur la page Wikiquote « Romanian proverbs », avec leurs sources, sans formules magiques, devinettes ni chants et sans comté. Ce qui est ajouté ensuite n’est fiable que dans la mesure de sa source.
- Aucune entrée des données de départ n’a été relue par un folkloriste ou un locuteur natif ; celles marquées « relu » disent qui les a relues. « Sourcé » signifie seulement qu’une source est citée. Les textes de l’interface dans d’autres langues que l’anglais et le roumain ont été écrits avec un assistant IA et demandent une relecture par des locuteurs natifs.
- Les tuiles des comtés sont un schéma, pas une carte : sans frontières, et leurs positions ne suivent que grossièrement la disposition réelle. Une entrée n’apparaît sur une tuile que si son comté a été noté.
- Ce que vous ajoutez reste dans ce navigateur jusqu’à ce que vous le téléchargiez ; effacer les données du site le supprime. Rien n’est envoyé nulle part.
- La détection des doublons compare les lettres, sans tenir compte des diacritiques, des majuscules ni de la ponctuation ; elle ne peut pas savoir que deux proverbes aux mots différents ont le même sens.
- La page ne peut pas vérifier que le consentement a vraiment été donné : cela relève de la personne qui a recueilli le texte.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/items/example.json` dans `data/items/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.
5. Sans programmer : ajoutez des entrées dans la page (onglet « Ajout »), téléchargez votre fichier de contribution (onglet « Export ») et envoyez-le dans une issue ou une pull request ; un mainteneur l’importe avec `python scripts/import_bundle.py` (voir `docs/contributor-guide.md` ; si vous recueillez auprès de personnes, lisez d’abord `docs/collecting-guide.md`).

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
