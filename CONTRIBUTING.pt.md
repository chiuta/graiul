# Como contribuir — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · **Português** · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

1. Faça um fork deste repositório.
2. Copie `data/items/example.json` para `data/items/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Regras

- Uma entrada = um ficheiro.
- Cite sempre uma fonte.
- Contribua apenas com material que possa partilhar legalmente (sem texto protegido copiado).
- Seja gentil: veja o Código de Conduta.

## Acrescentar folclore ao arquivo

1. Abra a página (`index.html` ou https://graiul.chiuta.ro) e vá ao separador «Adicionar»: escolha o tipo, escreva o texto exatamente como se diz (com os diacríticos), indique o código do idioma (`ro`, `hu`, `rom` …) e, se os souber, a região e o distrito; uma adivinha precisa do seu `answer`, um esconjuro do seu `purpose`. Detalhes: `docs/contributor-guide.md`.
2. Indique sempre a fonte: um livro ou uma página web (com o endereço) ou a pessoa de quem ouviu o texto. Marque uma entrada `sourced` só se a copiou de uma fonte publicada com endereço web, e `reviewed` só se uma pessoa diferente de si a confirmou e deu o seu nome.
3. Pergunte antes de publicar o que uma pessoa lhe disse: diga que será publicado com a sua fonte e sob que licença, e que pode recusar ou pedir para não ser nomeada; depois registe `collector` e `consent` (`informed`, ou `anonymised` quando o nome é omitido). Um esconjuro exige sempre um consentimento e nunca é apresentado como tratamento ou conselho (veja `docs/collecting-guide.md`).
4. Copie só o que pode: obras de domínio público com a sua citação, a sua própria recolha ou entradas para as quais tem permissão; nunca uma coleção moderna inteira.
5. Prima «Verificar» (mostram-se as entradas idênticas e muito semelhantes) e depois «Adicionar à minha lista»; repita para cada entrada, ou cole uma lista em «Adicionar várias de uma vez».
6. No separador «Exportar» prima «Descarregar as minhas entradas como ficheiro de contribuição (JSON)» e envie o ficheiro numa issue ou num pull request; um responsável executa `python scripts/import_bundle.py graiul-contribution-<data>.json` e depois `python scripts/validate.py`.
7. Se preferir ficheiros, copie `data/items/example.json` para `data/items/<idioma>-<primeiras palavras>.json` (as primeiras palavras sem diacríticos: `ro-cine-se-aseamana-se-aduna.json`; uma segunda entrada com as mesmas primeiras palavras recebe `-2`), edite-o e execute `python scripts/validate.py`.
