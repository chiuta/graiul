# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.1.0 · Última atualização: 2026-11-14

🌐 https://graiul.chiuta.ro

> Um arquivo aberto de folclore: provérbios, esconjuros, adivinhas e cantigas, com região e fonte.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa: o repositório contém a estrutura, o esquema de dados ou os primeiros exemplos e os guias de contribuição. O âmbito abaixo é o plano, não o que funciona hoje.

## Âmbito previsto

- Entradas com a região indicada até ao nível de distrito (județ), fonte e língua: cerca de 50 provérbios, 20 adivinhas com um campo `answer`, 10 encantamentos com um campo `purpose` e fonte etnográfica, e 10 cantigas de Natal tradicionais ou de domínio público.
- Entradas húngaras da Roménia (lang hu, região Transilvânia) e traduções para francês dos 50 provérbios mais comuns.
- Uma vista de mapa (região → elementos) com um GeoJSON local.
- Um gerador estático da página «provérbio do dia» e um detetor de duplicados baseado em texto normalizado.
- Diretrizes para recolher folclore com ética: consentimento e atribuição.

Nada disto está ainda implementado: cada ponto é uma tarefa preparada em `ISSUES_GOOD_FIRST.md`.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/items/example.json` para `data/items/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
