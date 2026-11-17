# Buoni primi compiti

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · **Italiano** · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Aggiungere proverbi della tua regione con `region` e `county` compilati e una fonte per ciascuno (da un’opera pubblicata, o da una persona che ha accettato: allora anche `collector` e `consent`)
- [ ] Aggiungere indovinelli (ghicitori) con la loro `answer`, da una fonte pubblicata o di pubblico dominio
- [ ] Aggiungere incantesimi (descântece) con `purpose`, `collector` e `consent`, solo con il consenso informato del portatore e mai come consiglio medico
- [ ] Aggiungere canti natalizi (colinde) tradizionali o di pubblico dominio, con la loro fonte
- [ ] Aggiungere voci degli ungheresi di Romania (`lang: hu`, regione Transilvania) da una fonte citata
- [ ] Aggiungere traduzioni in francese (`translations.fr`) ai proverbi già presenti nell’archivio, se scrivi francese
- [ ] Far rivedere i 10 proverbi iniziali a un folklorista o a madrelingua e impostare `status: reviewed` con `reviewed_by`
- [ ] Far rivedere da madrelingua i testi dell’interfaccia in `src/i18n.mjs` (francese, italiano, spagnolo, portoghese, tedesco, ungherese); sono stati scritti con un assistente IA
- [ ] Sostituire il diagramma a tessere della mappa con una vera mappa disegnata da un GeoJSON locale dei distretti di pubblico dominio, mantenendo un’alternativa testuale e il filtro per distretto
- [ ] Far sì che il rilevamento dei duplicati veda due proverbi che dicono la stessa cosa con parole diverse (per esempio tramite le traduzioni), con test

Crea tutte le issue su GitHub con `scripts/create_issues.sh` (richiede la CLI `gh`).
