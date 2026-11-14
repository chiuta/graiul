# GRAIUL

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.1.0 · Dernière mise à jour : 2026-11-14

🌐 https://graiul.chiuta.ro

> Une archive ouverte de folklore : proverbes, formules magiques, devinettes et chants, avec région et source.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha : le dépôt contient la structure, le schéma de données ou les premiers exemples et les guides de contribution. Le périmètre ci-dessous est le plan, pas ce qui fonctionne aujourd’hui.

## Périmètre prévu

- Des entrées avec région renseignée jusqu’au département (județ), source et langue : environ 50 proverbes, 20 devinettes avec un champ `answer`, 10 incantations avec un champ `purpose` et source ethnographique, et 10 chants de Noël traditionnels ou du domaine public.
- Des entrées hongroises de Roumanie (lang hu, région Transylvanie) et des traductions en français des 50 proverbes les plus courants.
- Une vue cartographique (région → éléments) avec un GeoJSON local.
- Un générateur statique de page « proverbe du jour » et un détecteur de doublons fondé sur le texte normalisé.
- Des lignes directrices pour collecter le folklore avec éthique : consentement et attribution.

Rien de tout cela n’est encore implémenté : chaque point est une tâche prête dans `ISSUES_GOOD_FIRST.md`.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/items/example.json` dans `data/items/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
