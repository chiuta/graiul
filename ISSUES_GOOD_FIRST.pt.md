# Boas primeiras tarefas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · **Português** · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Adicionar provérbios da sua região com `region` e `county` preenchidos e uma fonte para cada um (de uma obra publicada, ou de uma pessoa que aceitou: então também `collector` e `consent`)
- [ ] Adicionar adivinhas (ghicitori) com a sua `answer`, de uma fonte publicada ou de domínio público
- [ ] Adicionar esconjuros (descântece) com `purpose`, `collector` e `consent`, só com o consentimento informado do portador e nunca como conselho médico
- [ ] Adicionar cantigas de Natal (colinde) tradicionais ou de domínio público, com a sua fonte
- [ ] Adicionar entradas dos húngaros da Roménia (`lang: hu`, região Transilvania) de uma fonte citada
- [ ] Adicionar traduções para francês (`translations.fr`) aos provérbios já presentes no arquivo, se escrever francês
- [ ] Pedir a um folclorista ou a falantes nativos que revejam os 10 provérbios iniciais e definir `status: reviewed` com `reviewed_by`
- [ ] Pedir a falantes nativos que revejam os textos da interface em `src/i18n.mjs` (francês, italiano, espanhol, português, alemão, húngaro); foram escritos com um assistente de IA
- [ ] Substituir o diagrama de mosaicos do mapa por um mapa real desenhado a partir de um GeoJSON local dos distritos de domínio público, mantendo uma alternativa em texto e o filtro por distrito
- [ ] Fazer com que a deteção de duplicados veja dois provérbios que dizem o mesmo com outras palavras (por exemplo através das traduções), com testes

Cria-as todas no GitHub com `scripts/create_issues.sh` (requer a CLI `gh`).
