# Registo de alterações

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · **Português** · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Não lançado]

## [0.2.1] - 2026-11-20

### Alterado
- fff-kit 1.8.1: quando o navegador bloqueia o armazenamento ou não o tem (`localStorage`/`sessionStorage` lançam um erro ou não existem), a página arranca com um armazenamento temporário em memória em vez de parar; os dados não são mantidos depois de fechar a página.
- fff-kit 1.8.1: o guia que aumenta os controlos pequenos para 44 px mede agora também a largura do corpo da página e do elemento pai, pelo que uma fila de botões já não pode sair do ecrã (o grupo fica intacto quando o aumento o tornaria demasiado largo).

## [0.2.0] - 2026-11-17

### Adicionado
- O motor em `src/engine.mjs`: pesquisa sem ter em conta os diacríticos com ordenação, validação das entradas, entradas idênticas e muito semelhantes, provérbio do dia, contagem por distrito, exportação TSV, ficheiro de contribuição e analisador de listas coladas.
- Exportação TSV para folhas de cálculo: uma célula que começa por `=`, `+`, `-` ou `@` recebe um apóstrofo à frente, para que o Excel ou o LibreOffice não a executem como fórmula (um texto que realmente começa por `-` mostra por isso um apóstrofo na folha). O ficheiro descarregado pela página começa também com uma marca de ordem de bytes UTF-8, para que os diacríticos se vejam bem.
- A interface em `src/ui.js`, `src/i18n.mjs` e `src/app.css`: pesquisa, provérbio do dia, mapa dos distritos, adição (uma entrada ou várias de uma vez), exportação, importação e guia; oito línguas, temas escuro e claro, teclado, funciona a partir de 360 px de largura, e o mapa tem uma disposição de reserva para navegadores sem CSS Grid.
- Atenção a quem usa o teclado ou um leitor de ecrã: o foco nunca se perde (depois de «Mostrar todos os distritos» passa para o mosaico do distrito que estava escolhido; depois de mudar a fiabilidade no formulário de adição fica nesse campo), «Mais detalhes» continua aberto quando se muda o tipo, e os filtros de língua e de região voltam a «Todos os idiomas» e «Todas as regiões» quando se remove a última entrada com esse valor.
- Quando algo corre mal, a página diz que falhou e guarda o seu trabalho: as linhas que «Adicionar várias de uma vez» rejeita ficam na caixa, cada uma com o número da linha e o motivo; se o navegador não tiver espaço para guardar as entradas, a adição e a importação são anuladas e aparece um erro em vez de as dar como guardadas; um estado guardado com valores hostis ou inválidos (um id como `__proto__`, uma língua, um distrito, uma licença ou um consentimento desconhecidos, campos demasiado longos) é limpo ao iniciar a página e nunca chega ao formulário.
- A pesquisa de duplicados continua rápida em ficheiros grandes: cada texto é analisado uma só vez, só se comparam os pares de tamanho parecido e a comparação pára assim que o limiar já não pode ser atingido, com exatamente os mesmos resultados da definição simples (testado); importar um ficheiro de vários megabytes já não bloqueia a página.
- Dados: 10 provérbios romenos com as suas fontes (os equivalentes ingleses tirados da Wikiquote estão marcados CC BY-SA 4.0), os mosaicos dos distritos `data/counties.json` e um `schema.json` mais rigoroso (tipos, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: verifica cada ficheiro com o seu esquema e com as regras que um esquema não consegue exprimir (nome do ficheiro, mosaicos dos distritos, `sourced` e `reviewed`, consentimento, duplicados); `scripts/import_bundle.py` transforma o ficheiro de contribuição feito pela página em ficheiros de dados; `scripts/potd.mjs` escreve o provérbio de uma data como página estática.
- `docs/contributor-guide.md` e `docs/collecting-guide.md` (também em romeno): como adicionar entradas e como recolher folclore com ética (consentimento, atribuição, o que não publicar).
- Testes: `npm test` (o motor, os dados, os scripts Python, o script do provérbio do dia, a compilação e os textos da interface) e testes de navegador no hub (oito línguas, acessibilidade, estado guardado hostil, importação e exportação, ecrãs pequenos).
- `src/` e `scripts/build.mjs`: o único `index.html` é agora construído a partir das fontes, com os dados incorporados, e `--check` verifica-o.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT traduzidos para as oito línguas.
- README em inglês, romeno, francês, italiano, espanhol, português, alemão e húngaro: secções de estado e de âmbito previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalável (PWA): `manifest.webmanifest`, `sw.js` e os ícones são gerados pelo kit comum (`fff-kit/pwa`); a página funciona offline após a primeira visita por HTTPS.

### Alterado
- O workflow corre em Ubuntu 26.04 com Node.js 26 e executa também os testes, a verificação da compilação e a validação dos dados.
- `schema.json` rejeita os campos desconhecidos e descreve agora os tipos, `answer` para as adivinhas, `purpose` para os esconjuros, `consent` para os esconjuros e tudo o que tenha um `collector`, `county`, `translations`, `source_url`, `license`, `status` e `reviewed_by`.
- O README já não enumera um âmbito previsto: descreve o que a página faz e o que ainda não faz.

## [0.1.0] - 2026-11-13

### Adicionado
- Esqueleto inicial: estrutura, esquema de dados ou primeiros exemplos, guias de contribuição em oito línguas.
