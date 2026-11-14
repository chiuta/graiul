# GRAIUL

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.1.0 · Ultima actualizare: 2026-11-14

🌐 https://graiul.chiuta.ro

> O arhivă deschisă de folclor: proverbe, descântece, ghicitori și colinde, fiecare cu regiune și sursă.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa: depozitul conține structura, schema de date sau primele exemple și ghidurile de contribuție. Domeniul de mai jos este planul, nu ceea ce funcționează azi.

## Domeniu planificat

- Intrări cu regiunea completată până la nivel de județ, sursă și limbă: circa 50 de proverbe, 20 de ghicitori cu un câmp `answer`, 10 descântece cu un câmp `purpose` și sursă etnografică și 10 colinde tradiționale sau din domeniul public.
- Intrări maghiare din România (lang hu, regiunea Transilvania) și traduceri în franceză ale celor mai răspândite 50 de proverbe.
- O vizualizare pe hartă (regiune → intrări) cu un GeoJSON local.
- Un generator static pentru pagina „proverbul zilei” și un detector de duplicate pe baza textului normalizat.
- Ghid pentru culegerea etică a folclorului: consimțământ și atribuire.

Nimic din asta nu este implementat încă: fiecare punct este o sarcină gata pregătită în `ISSUES_GOOD_FIRST.md`.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/items/example.json` în `data/items/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
