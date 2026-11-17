# Buenas primeras tareas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · **Español** · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Añadir refranes de tu región con `region` y `county` rellenos y una fuente para cada uno (de una obra publicada, o de una persona que aceptó: entonces también `collector` y `consent`)
- [ ] Añadir adivinanzas (ghicitori) con su `answer`, de una fuente publicada o de dominio público
- [ ] Añadir conjuros (descântece) con `purpose`, `collector` y `consent`, solo con el consentimiento informado del portador y nunca como consejo médico
- [ ] Añadir villancicos (colinde) tradicionales o de dominio público, con su fuente
- [ ] Añadir entradas de los húngaros de Rumanía (`lang: hu`, región Transilvania) de una fuente citada
- [ ] Añadir traducciones al francés (`translations.fr`) a los refranes que ya están en el archivo, si escribes francés
- [ ] Hacer que un folclorista o hablantes nativos revisen los 10 refranes iniciales y fijar `status: reviewed` con `reviewed_by`
- [ ] Hacer que hablantes nativos revisen los textos de la interfaz en `src/i18n.mjs` (francés, italiano, español, portugués, alemán, húngaro); se escribieron con un asistente de IA
- [ ] Sustituir el diagrama de casillas del mapa por un mapa real dibujado a partir de un GeoJSON local de los condados de dominio público, manteniendo una alternativa de texto y el filtro por condado
- [ ] Hacer que la detección de duplicados vea dos refranes que dicen lo mismo con otras palabras (por ejemplo a través de sus traducciones), con pruebas

Créalas todas en GitHub con `scripts/create_issues.sh` (requiere la CLI `gh`).
