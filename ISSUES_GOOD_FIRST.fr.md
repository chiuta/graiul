# Bonnes premières tâches

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · **Français** · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Ajouter des proverbes de votre région avec `region` et `county` renseignés et une source pour chacun (d’une œuvre publiée, ou d’une personne qui a accepté : alors aussi `collector` et `consent`)
- [ ] Ajouter des devinettes (ghicitori) avec leur `answer`, d’une source publiée ou du domaine public
- [ ] Ajouter des formules magiques (descântece) avec `purpose`, `collector` et `consent`, seulement avec le consentement éclairé du détenteur et jamais comme conseil médical
- [ ] Ajouter des chants de Noël (colinde) traditionnels ou du domaine public, avec leur source
- [ ] Ajouter des entrées des Hongrois de Roumanie (`lang: hu`, région Transilvania) à partir d’une source citée
- [ ] Ajouter des traductions en français (`translations.fr`) aux proverbes déjà dans l’archive, si vous écrivez le français
- [ ] Faire relire les 10 proverbes de départ par un folkloriste ou des locuteurs natifs et définir `status: reviewed` avec `reviewed_by`
- [ ] Faire relire par des locuteurs natifs les textes de l’interface dans `src/i18n.mjs` (français, italien, espagnol, portugais, allemand, hongrois) ; ils ont été écrits avec un assistant IA
- [ ] Remplacer le schéma de tuiles de la carte par une vraie carte tracée à partir d’un GeoJSON local des comtés du domaine public, en gardant une alternative textuelle et le filtre par comté
- [ ] Faire en sorte que la détection des doublons voie deux proverbes qui disent la même chose avec d’autres mots (par exemple grâce à leurs traductions), avec des tests

Créez-les toutes sur GitHub avec `scripts/create_issues.sh` (nécessite la CLI `gh`).
