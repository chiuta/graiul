# Cómo contribuir — GRAIUL

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · **Español** · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versión: 0.2.1 · Última actualización: 2026-11-20

1. Haz un fork de este repositorio.
2. Copia `data/items/example.json` en `data/items/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Reglas

- Una entrada = un archivo.
- Cita siempre una fuente.
- Aporta solo material que puedas compartir legalmente (sin texto protegido copiado).
- Sé amable: consulta el Código de conducta.

## Añadir folclore al archivo

1. Abre la página (`index.html` o https://graiul.chiuta.ro) y ve a la pestaña «Añadir»: elige el tipo, escribe el texto tal como se dice (con sus diacríticos), indica el código del idioma (`ro`, `hu`, `rom` …) y, si los sabes, la región y el condado; una adivinanza necesita su `answer`, un conjuro su `purpose`. Detalles: `docs/contributor-guide.md`.
2. Da siempre la fuente: un libro o una página web (con su dirección) o la persona de quien oíste el texto. Marca una entrada `sourced` solo si la copiaste de una fuente publicada con dirección web, y `reviewed` solo si una persona distinta de ti la confirmó y dio su nombre.
3. Pregunta antes de publicar lo que una persona te contó: di que se publicará con su fuente y bajo qué licencia, y que puede negarse o pedir que no se la nombre; después anota `collector` y `consent` (`informed`, o `anonymised` cuando el nombre se reserva). Un conjuro siempre necesita un consentimiento y nunca se presenta como tratamiento o consejo (consulta `docs/collecting-guide.md`).
4. Copia solo lo que puedes: obras de dominio público con su cita, tu propia recopilación o entradas con permiso; nunca una colección moderna entera.
5. Pulsa «Comprobar» (se muestran las entradas idénticas y muy parecidas) y luego «Añadir a mi lista»; repite con cada entrada, o pega una lista en «Añadir varias a la vez».
6. En la pestaña «Exportar» pulsa «Descargar mis entradas como archivo de contribución (JSON)» y envía el archivo en una issue o un pull request; un responsable ejecuta `python scripts/import_bundle.py graiul-contribution-<fecha>.json` y después `python scripts/validate.py`.
7. Si prefieres archivos, copia `data/items/example.json` a `data/items/<idioma>-<primeras palabras>.json` (las primeras palabras sin diacríticos: `ro-cine-se-aseamana-se-aduna.json`; una segunda entrada con las mismas primeras palabras recibe `-2`), edítalo y ejecuta `python scripts/validate.py`.
