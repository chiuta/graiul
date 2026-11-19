# Registro de cambios

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · **Español** · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Sin publicar]

## [0.2.1] - 2026-11-20

### Cambiado
- fff-kit 1.8.1: cuando el navegador bloquea el almacenamiento o carece de él (`localStorage`/`sessionStorage` lanzan un error o no existen), la página arranca con un almacenamiento temporal en memoria en lugar de detenerse; los datos no se conservan al cerrar la página.
- fff-kit 1.8.1: la guía que amplía los controles pequeños a 44 px mide ahora también el ancho del cuerpo de la página y del elemento padre, de modo que una fila de botones ya no puede salirse de la pantalla (el grupo se deja intacto cuando la ampliación lo haría demasiado ancho).

## [0.2.0] - 2026-11-17

### Añadido
- El motor en `src/engine.mjs`: búsqueda sin tener en cuenta los diacríticos con ordenación, validación de entradas, entradas idénticas y muy parecidas, refrán del día, recuento por condado, exportación TSV, archivo de contribución y analizador de listas pegadas.
- Exportación TSV para hojas de cálculo: una celda que empieza por `=`, `+`, `-` o `@` recibe un apóstrofo delante, para que Excel o LibreOffice no la ejecuten como fórmula (un texto que de verdad empieza por `-` muestra por tanto un apóstrofo en la hoja). El archivo que descarga la página empieza además con una marca de orden de bytes UTF-8, para que los diacríticos se vean bien.
- La interfaz en `src/ui.js`, `src/i18n.mjs` y `src/app.css`: búsqueda, refrán del día, mapa de condados, alta (una entrada o varias a la vez), exportación, importación y guía; ocho idiomas, temas oscuro y claro, teclado, funciona desde 360 px de ancho, y el mapa tiene una disposición de reserva para navegadores sin CSS Grid.
- Atención a quienes usan el teclado o un lector de pantalla: el foco nunca se pierde (tras «Mostrar todos los condados» pasa a la casilla del condado que estaba elegido; tras cambiar la fiabilidad en el formulario de alta se queda en ese campo), «Más detalles» sigue abierto al cambiar el tipo, y los filtros de idioma y de región vuelven a «Todos los idiomas» y «Todas las regiones» cuando se elimina la última entrada con ese valor.
- Cuando algo sale mal la página lo dice y conserva tu trabajo: las líneas que «Añadir varias a la vez» rechaza se quedan en el cuadro, cada una con su número de línea y su motivo; si el navegador no tiene sitio para guardar las entradas, el alta y la importación se deshacen y aparece un error en lugar de darlas por guardadas; un estado guardado con valores hostiles o no válidos (un id como `__proto__`, un idioma, un condado, una licencia o un consentimiento desconocidos, campos demasiado largos) se limpia al iniciar la página y nunca llega al formulario.
- La búsqueda de duplicados sigue siendo rápida con archivos grandes: cada texto se analiza una sola vez, solo se comparan los pares de tamaño parecido y la comparación se detiene en cuanto ya no se puede alcanzar el umbral, con exactamente los mismos resultados que la definición simple (probado); importar un archivo de varios megabytes ya no bloquea la página.
- Datos: 10 refranes rumanos con sus fuentes (los equivalentes ingleses tomados de Wikiquote están marcados CC BY-SA 4.0), las casillas de los condados `data/counties.json` y un `schema.json` más estricto (tipos, `answer`, `purpose`, `consent`, `county`, `translations`, `status`, `license`).
- `scripts/validate.py`: comprueba cada archivo con su esquema y con las reglas que un esquema no puede expresar (nombre del archivo, casillas de los condados, `sourced` y `reviewed`, consentimiento, duplicados); `scripts/import_bundle.py` convierte el archivo de contribución hecho por la página en archivos de datos; `scripts/potd.mjs` escribe el refrán de una fecha como página estática.
- `docs/contributor-guide.md` y `docs/collecting-guide.md` (también en rumano): cómo añadir entradas y cómo recoger folclore con ética (consentimiento, atribución, qué no publicar).
- Pruebas: `npm test` (el motor, los datos, los scripts de Python, el script del refrán del día, la compilación y los textos de la interfaz) y pruebas de navegador en el hub (ocho idiomas, accesibilidad, estado guardado hostil, importación y exportación, pantallas pequeñas).
- `src/` y `scripts/build.mjs`: el único `index.html` se construye ahora a partir de las fuentes, con los datos incorporados, y `--check` lo verifica.
- ISSUES_GOOD_FIRST y CODE_OF_CONDUCT traducidos a los ocho idiomas.
- README en inglés, rumano, francés, italiano, español, portugués, alemán y húngaro: secciones de estado y de alcance previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalable (PWA): `manifest.webmanifest`, `sw.js` y los iconos los genera el kit común (`fff-kit/pwa`); la página funciona sin conexión tras la primera visita por HTTPS.

### Cambiado
- El workflow se ejecuta en Ubuntu 26.04 con Node.js 26 y ejecuta también las pruebas, la comprobación de la compilación y la validación de los datos.
- `schema.json` rechaza los campos desconocidos y ahora describe los tipos, `answer` para las adivinanzas, `purpose` para los conjuros, `consent` para los conjuros y todo lo que tenga un `collector`, `county`, `translations`, `source_url`, `license`, `status` y `reviewed_by`.
- El README ya no enumera un alcance previsto: describe lo que hace la página y lo que aún no hace.

## [0.1.0] - 2026-11-13

### Añadido
- Esqueleto inicial: estructura, esquema de datos o primeros ejemplos, guías de contribución en ocho idiomas.
