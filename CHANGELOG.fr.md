# Journal des modifications

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · **Français** · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non publié]

## [0.2.1] - 2026-11-20

### Modifié
- fff-kit 1.8.1 : lorsque le navigateur bloque le stockage ou en est dépourvu (`localStorage`/`sessionStorage` lèvent une erreur ou sont absents), la page démarre avec un stockage temporaire en mémoire au lieu de s’arrêter ; les données ne sont pas conservées après la fermeture de la page.
- fff-kit 1.8.1 : le dispositif qui agrandit les petits contrôles à 44 px mesure désormais aussi la largeur du corps de la page et de l’élément parent ; une rangée de boutons ne peut donc plus sortir de l’écran (le groupe reste inchangé lorsque l’agrandissement le ferait déborder).

## [0.2.0] - 2026-11-17

### Ajouté
- Le moteur dans `src/engine.mjs` : recherche sans tenir compte des diacritiques avec classement, validation des entrées, entrées identiques et très semblables, proverbe du jour, comptage par comté, export TSV, fichier de contribution et analyseur des listes collées.
- Export TSV pour tableurs : une cellule qui commence par `=`, `+`, `-` ou `@` reçoit une apostrophe devant, pour qu’Excel ou LibreOffice ne l’exécute pas comme une formule (un texte qui commence vraiment par `-` montre donc une apostrophe dans la feuille). Le fichier téléchargé par la page commence aussi par une marque d’ordre des octets UTF-8, pour que les diacritiques s’affichent correctement.
- L’interface dans `src/ui.js`, `src/i18n.mjs` et `src/app.css` : recherche, proverbe du jour, carte des comtés, ajout (une entrée ou plusieurs d’un coup), export, import et guide ; huit langues, thèmes sombre et clair, clavier, utilisable dès 360 px de large, et la carte a une disposition de secours pour les navigateurs sans CSS Grid.
- Attention portée aux utilisateurs du clavier et des lecteurs d’écran : le focus ne se perd jamais (après « Afficher tous les comtés » il passe sur la tuile du comté qui était choisi ; après avoir changé la fiabilité dans le formulaire d’ajout il reste sur ce champ), « Plus de détails » reste ouvert quand on change le type, et les filtres de langue et de région reviennent à « Toutes les langues » et « Toutes les régions » quand la dernière entrée portant cette valeur est supprimée.
- Quand quelque chose ne va pas, la page le dit et garde votre travail : les lignes que « Ajouter plusieurs d’un coup » rejette restent dans la zone, chacune avec son numéro de ligne et son motif ; si le navigateur n’a plus de place pour les entrées, l’ajout et l’import sont annulés et une erreur s’affiche au lieu de les annoncer comme enregistrés ; un état enregistré aux valeurs hostiles ou invalides (un identifiant tel que `__proto__`, une langue, un comté, une licence ou un consentement inconnus, des champs trop longs) est nettoyé au démarrage de la page et n’atteint jamais le formulaire.
- La recherche de doublons reste rapide sur les gros fichiers : chaque texte est analysé une seule fois, seules les paires de taille voisine sont comparées et la comparaison s’arrête dès que le seuil ne peut plus être atteint, avec exactement les mêmes résultats que la définition simple (testé) ; importer un fichier de plusieurs mégaoctets ne bloque plus la page.
- Données : 10 proverbes roumains avec leurs sources (les équivalents anglais pris sur Wikiquote sont marqués CC BY-SA 4.0), les tuiles des comtés `data/counties.json` et un `schema.json` plus strict (types, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py` : vérifie chaque fichier par rapport à son schéma et aux règles qu’un schéma ne peut pas exprimer (nom du fichier, tuiles des comtés, `sourced` et `reviewed`, consentement, doublons) ; `scripts/import_bundle.py` transforme le fichier de contribution fait par la page en fichiers de données ; `scripts/potd.mjs` écrit le proverbe d’une date comme page statique.
- `docs/contributor-guide.md` et `docs/collecting-guide.md` (aussi en roumain) : comment ajouter des entrées et comment collecter le folklore de façon éthique (consentement, attribution, ce qu’il ne faut pas publier).
- Tests : `npm test` (le moteur, les données, les scripts Python, le script du proverbe du jour, la construction et les textes de l’interface) et tests de navigateur dans le hub (huit langues, accessibilité, état enregistré hostile, import et export, petits écrans).
- `src/` et `scripts/build.mjs` : l’unique `index.html` est désormais construit à partir des sources, données intégrées, et `--check` le vérifie.
- ISSUES_GOOD_FIRST et CODE_OF_CONDUCT traduits dans les huit langues.
- README en anglais, roumain, français, italien, espagnol, portugais, allemand et hongrois : sections d’état et de périmètre prévu (dérivées de `ISSUES_GOOD_FIRST.md`).
- Installable (PWA) : `manifest.webmanifest`, `sw.js` et les icônes sont générés par le kit commun (`fff-kit/pwa`) ; la page fonctionne hors ligne après la première visite en HTTPS.

### Modifié
- Le workflow s’exécute sur Ubuntu 26.04 avec Node.js 26 et lance aussi les tests, la vérification de la construction et la validation des données.
- `schema.json` rejette les champs inconnus et décrit maintenant les types, `answer` pour les devinettes, `purpose` pour les formules magiques, `consent` pour les formules magiques et tout ce qui a un `collector`, `county`, `translations`, `source_url`, `license`, `status` et `reviewed_by`.
- Le README ne liste plus un périmètre prévu : il décrit ce que fait la page et ce qu’elle ne fait pas encore.

## [0.1.0] - 2026-11-13

### Ajouté
- Squelette initial : structure, schéma de données ou premiers exemples, guides de contribution en huit langues.
