# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.2.1 · Última actualización: 2026-11-22

🌐 https://graiul.chiuta.ro

> Un archivo abierto de folclore: refranes, conjuros, adivinanzas y villancicos, con región y fuente.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa, utilizable: el único `index.html` es un archivo sin conexión del folclore rumano. Busca refranes, conjuros, adivinanzas, villancicos, cuentos, dichos y nanas sin tener en cuenta los diacríticos, con filtros por tipo, idioma, región, condado y fiabilidad; muestra un refrán del día; cuenta las entradas de cada condado en un mapa esquemático; permite añadir entradas con fuente y consentimiento, comprueba los duplicados y produce un archivo de contribución que `scripts/import_bundle.py` convierte en archivos de datos. Las 10 entradas iniciales son refranes rumanos de una página pública citada; aún no hay conjuros, adivinanzas ni villancicos, y nada ha sido revisado por un folclorista ni por un hablante nativo.

## Qué hace

- Búsqueda por palabras del texto, de una traducción, de la respuesta, de la región o del condado, sin tener en cuenta los diacríticos: al escribir `asteapta` encuentra `Așteaptă`. Filtros por tipo, idioma, región, condado y fiabilidad (borrador, con fuente, revisado); cada resultado muestra su fuente (con enlace si tiene dirección web), la licencia, el consentimiento y las traducciones, y una adivinanza mantiene oculta su respuesta hasta que la pides.
- Refrán del día: un refrán de la colección, elegido solo por la fecha, de modo que todos los dispositivos muestran el mismo refrán el mismo día; puedes pasar al día anterior o siguiente o escribir una fecha.
- Mapa: 42 casillas (41 condados y Bucarest) en una disposición esquemática, cada una con su número de entradas; al elegir una casilla ves las entradas de ese condado. Es un diagrama, no un mapa geográfico.
- Alta: un formulario que comprueba cada campo, exige una fuente y, para los conjuros y para todo lo recogido de una persona, un consentimiento; rechaza las entradas idénticas y te pide confirmar las muy parecidas; se pueden añadir varias entradas desde una lista pegada; lo que añades se queda en el navegador hasta que lo descargues.
- Exportación y datos: tus entradas como archivo de contribución que puedes enviar al proyecto, una tabla (TSV) de toda la colección o de tus entradas, la importación de un archivo de contribución y una búsqueda de duplicados; un archivo JSON por entrada en `data/items/` y las casillas de los condados en `data/counties.json`; interfaz en ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho; sin red, sin rastreo.
- Instalable como aplicación y disponible sin conexión tras la primera visita cuando se sirve por HTTPS (un service worker conserva la página; no se guarda ni se envía nada más). Abierta desde un archivo descargado funciona igual, sin instalación.

## Cómo funciona

- `schema.json` y `counties.schema.json` describen los datos; `scripts/validate.py` comprueba cada archivo con ellos y con las reglas que un esquema no puede expresar: el nombre del archivo (`<idioma>-<primeras palabras>`), las casillas de los condados, una dirección web para `sourced` y un revisor para `reviewed`, un consentimiento para los conjuros y para todo lo recogido de una persona, y los duplicados (un texto idéntico es un error, uno muy parecido una advertencia).
- `src/engine.mjs` es el motor (sin pantalla, sin red): la regla de normalización usada para la búsqueda, los nombres de archivo y los duplicados, la validación, la ordenación de los resultados, el refrán del día, la exportación TSV, el archivo de contribución y el analizador de listas pegadas. `scripts/validate.py` y `scripts/import_bundle.py` aplican la misma regla de normalización y la misma medida de similitud (trigramas, coeficiente de Dice, 0,85 para «muy parecido»); las pruebas comparan las implementaciones.
- `src/ui.js`, `src/i18n.mjs` y `src/app.css` son la interfaz; `node scripts/build.mjs` construye el único `index.html` con los datos incorporados (`--check` verifica que coincide); `node scripts/potd.mjs` escribe el refrán de una fecha como una pequeña página estática, con la misma regla que la pestaña.
- `npm test` ejecuta las pruebas del motor, de los datos, de los scripts de Python, de la compilación, del script del refrán del día y de los textos de la interfaz; las pruebas de navegador están en el hub. El desarrollo necesita Node.js 24 o posterior y Python 3 con `jsonschema`; la página en sí solo necesita un navegador que conozca ES2017.
- `manifest.webmanifest`, `sw.js` y los iconos los produce `node scripts/build.mjs` mediante el kit común (sección `pwa` de `src/app.json`); `--check` también los verifica, y `npm test` comprueba que el manifiesto, la versión del service worker y la CSP coincidan con la página.

## Lo que esta página no hace

- Los datos iniciales son pocos: diez refranes rumanos tomados de la página de Wikiquote «Romanian proverbs», con sus fuentes, sin conjuros, adivinanzas ni villancicos y sin condado. Lo que se añada después es tan fiable como su fuente.
- Ninguna entrada de los datos iniciales ha sido revisada por un folclorista ni por un hablante nativo; las marcadas como «revisado» dicen quién las revisó. «Con fuente» solo significa que se cita una fuente. Los textos de la interfaz en idiomas distintos del inglés y el rumano se escribieron con un asistente de IA y necesitan revisión por hablantes nativos.
- Las casillas de los condados son un esquema, no un mapa: sin fronteras, y sus posiciones solo siguen aproximadamente la disposición real. Una entrada aparece en una casilla solo si se anotó su condado.
- Lo que añades se queda en este navegador hasta que lo descargues; borrar los datos del sitio lo elimina. No se envía nada a ninguna parte.
- La detección de duplicados compara letras, sin tener en cuenta diacríticos, mayúsculas ni puntuación; no puede saber que dos refranes con palabras distintas significan lo mismo.
- La página no puede comprobar que el consentimiento se dio de verdad: eso depende de quien recogió el texto.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/items/example.json` en `data/items/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.
5. Sin programar: añade entradas en la página (pestaña «Añadir»), descarga tu archivo de contribución (pestaña «Exportar») y envíalo en una issue o un pull request; un responsable lo importa con `python scripts/import_bundle.py` (consulta `docs/contributor-guide.md`; si recoges de personas, lee antes `docs/collecting-guide.md`).

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
