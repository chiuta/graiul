# Sarcini bune pentru început

[English](ISSUES_GOOD_FIRST.md) · **Română** · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Adaugă proverbe din regiunea ta, cu `region` și `county` completate și cu o sursă pentru fiecare (dintr-o lucrare publicată sau de la o persoană care a fost de acord: atunci și `collector` și `consent`)
- [ ] Adaugă ghicitori cu `answer`, dintr-o sursă publicată sau din domeniul public
- [ ] Adaugă descântece cu `purpose`, `collector` și `consent`, doar cu acordul informat al purtătorului și niciodată ca sfat medical
- [ ] Adaugă colinde tradiționale sau din domeniul public, cu sursa lor
- [ ] Adaugă intrări ale maghiarilor din România (`lang: hu`, regiunea Transilvania) dintr-o sursă citată
- [ ] Adaugă traduceri în franceză (`translations.fr`) la proverbele din arhivă, dacă scrii franceză
- [ ] Roagă un folclorist sau vorbitori nativi să revizuiască cele 10 proverbe de pornire și setează `status: reviewed` cu `reviewed_by`
- [ ] Roagă vorbitori nativi să revizuiască textele interfeței din `src/i18n.mjs` (franceză, italiană, spaniolă, portugheză, germană, maghiară); au fost scrise cu un asistent IA
- [ ] Înlocuiește diagrama de plăci a hărții cu o hartă adevărată, desenată dintr-un GeoJSON local al județelor din domeniul public, păstrând o alternativă text și filtrul pe județ
- [ ] Fă detectarea duplicatelor să vadă două proverbe care spun același lucru cu alte cuvinte (de exemplu prin traducerile lor), cu teste

Creează-le pe toate pe GitHub cu `scripts/create_issues.sh` (cere CLI-ul `gh`).
