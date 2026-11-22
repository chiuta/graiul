# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.2.1 · Última atualização: 2026-11-22

🌐 https://graiul.chiuta.ro

> Um arquivo aberto de folclore: provérbios, esconjuros, adivinhas e cantigas, com região e fonte.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa, utilizável: o único `index.html` é um arquivo offline do folclore romeno. Pesquisa provérbios, esconjuros, adivinhas, cantigas de Natal, contos, ditos e canções de embalar sem ter em conta os diacríticos, com filtros por tipo, idioma, região, distrito e fiabilidade; mostra um provérbio do dia; conta as entradas de cada distrito num mapa esquemático; permite adicionar entradas com fonte e consentimento, verifica os duplicados e produz um ficheiro de contribuição que `scripts/import_bundle.py` transforma em ficheiros de dados. As 10 entradas iniciais são provérbios romenos de uma página pública citada; ainda não há esconjuros, adivinhas nem cantigas, e nada foi revisto por um folclorista ou por um falante nativo.

## O que faz

- Pesquisa por palavras do texto, de uma tradução, da resposta, da região ou do distrito, sem ter em conta os diacríticos: ao escrever `asteapta` encontra `Așteaptă`. Filtros por tipo, idioma, região, distrito e fiabilidade (rascunho, com fonte, revisto); cada resultado mostra a sua fonte (com ligação se tiver endereço web), a licença, o consentimento e as traduções, e uma adivinha mantém a resposta escondida até a pedir.
- Provérbio do dia: um provérbio da coleção, escolhido só pela data, de modo que todos os dispositivos mostram o mesmo provérbio no mesmo dia; pode passar ao dia anterior ou seguinte ou escrever uma data.
- Mapa: 42 mosaicos (41 distritos e Bucareste) numa disposição esquemática, cada um com o seu número de entradas; ao escolher um mosaico vê as entradas desse distrito. É um diagrama, não um mapa geográfico.
- Adicionar: um formulário que verifica cada campo, exige uma fonte e, para esconjuros e tudo o que foi recolhido de uma pessoa, um consentimento; recusa as entradas idênticas e pede-lhe que confirme as muito semelhantes; podem adicionar-se várias entradas a partir de uma lista colada; o que adiciona fica no navegador até o descarregar.
- Exportação e dados: as suas entradas como ficheiro de contribuição que pode enviar ao projeto, uma tabela (TSV) de toda a coleção ou das suas entradas, a importação de um ficheiro de contribuição e uma pesquisa de duplicados; um ficheiro JSON por entrada em `data/items/` e os mosaicos dos distritos em `data/counties.json`; interface em oito línguas, temas escuro e claro, teclado, funciona a partir de 360 px de largura; sem rede, sem rastreio.
- Instalável como aplicação e disponível offline após a primeira visita quando servida por HTTPS (um service worker guarda a página; nada mais é guardado ou enviado). Aberta a partir de um ficheiro descarregado funciona da mesma forma, sem instalação.

## Como funciona

- `schema.json` e `counties.schema.json` descrevem os dados; `scripts/validate.py` verifica cada ficheiro com eles e com as regras que um esquema não consegue exprimir: o nome do ficheiro (`<idioma>-<primeiras palavras>`), os mosaicos dos distritos, um endereço web para `sourced` e um revisor para `reviewed`, um consentimento para esconjuros e para tudo o que foi recolhido de uma pessoa, e os duplicados (um texto idêntico é um erro, um muito semelhante um aviso).
- `src/engine.mjs` é o motor (sem ecrã, sem rede): a regra de normalização usada na pesquisa, nos nomes dos ficheiros e nos duplicados, a validação, a ordenação dos resultados, o provérbio do dia, a exportação TSV, o ficheiro de contribuição e o analisador de listas coladas. `scripts/validate.py` e `scripts/import_bundle.py` aplicam a mesma regra de normalização e a mesma medida de semelhança (trigramas, coeficiente de Dice, 0,85 para «muito semelhante»); os testes comparam as implementações.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` são a interface; `node scripts/build.mjs` constrói o único `index.html` com os dados incorporados (`--check` verifica se coincide); `node scripts/potd.mjs` escreve o provérbio de uma data como uma pequena página estática, pela mesma regra do separador.
- `npm test` executa os testes do motor, dos dados, dos scripts Python, da compilação, do script do provérbio do dia e dos textos da interface; os testes de navegador estão no hub. O desenvolvimento precisa de Node.js 24 ou mais recente e de Python 3 com `jsonschema`; a própria página só precisa de um navegador que conheça ES2017.
- `manifest.webmanifest`, `sw.js` e os ícones são produzidos por `node scripts/build.mjs` através do kit comum (secção `pwa` de `src/app.json`); `--check` também os verifica, e `npm test` confirma que o manifesto, a versão do service worker e a CSP correspondem à página.

## O que esta página não faz

- Os dados iniciais são poucos: dez provérbios romenos tirados da página «Romanian proverbs» da Wikiquote, com as suas fontes, sem esconjuros, adivinhas nem cantigas e sem distrito. O que se acrescentar depois é tão fiável quanto a sua fonte.
- Nenhuma entrada dos dados iniciais foi revista por um folclorista ou por um falante nativo; as marcadas como «revisto» dizem quem as reviu. «Com fonte» significa apenas que há uma fonte citada. Os textos da interface em línguas que não o inglês e o romeno foram escritos com um assistente de IA e precisam de revisão por falantes nativos.
- Os mosaicos dos distritos são um esquema, não um mapa: sem fronteiras, e as posições seguem só aproximadamente a disposição real. Uma entrada só aparece num mosaico se o seu distrito foi registado.
- O que adiciona fica neste navegador até o descarregar; apagar os dados do sítio elimina-o. Nada é enviado para lado nenhum.
- A deteção de duplicados compara letras, ignorando diacríticos, maiúsculas e pontuação; não pode saber que dois provérbios com palavras diferentes significam o mesmo.
- A página não pode verificar se o consentimento foi realmente dado: isso cabe a quem recolheu o texto.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/items/example.json` para `data/items/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.
5. Sem programar: adicione entradas na página (separador «Adicionar»), descarregue o seu ficheiro de contribuição (separador «Exportar») e envie-o numa issue ou num pull request; um responsável importa-o com `python scripts/import_bundle.py` (veja `docs/contributor-guide.md`; se recolhe de pessoas, leia primeiro `docs/collecting-guide.md`).

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
