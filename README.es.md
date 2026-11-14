# GRAIUL

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.1.0 · Última actualización: 2026-11-14

🌐 https://graiul.chiuta.ro

> Un archivo abierto de folclore: refranes, conjuros, adivinanzas y villancicos, con región y fuente.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa: el repositorio contiene la estructura, el esquema de datos o los primeros ejemplos y las guías de contribución. El alcance de abajo es el plan, no lo que funciona hoy.

## Alcance previsto

- Entradas con la región indicada hasta el nivel de distrito (județ), fuente e idioma: unos 50 proverbios, 20 adivinanzas con un campo `answer`, 10 conjuros con un campo `purpose` y fuente etnográfica, y 10 villancicos tradicionales o de dominio público.
- Entradas húngaras de Rumanía (lang hu, región Transilvania) y traducciones al francés de los 50 proverbios más comunes.
- Una vista de mapa (región → elementos) con un GeoJSON local.
- Un generador estático de la página «proverbio del día» y un detector de duplicados basado en texto normalizado.
- Pautas para recopilar folclore con ética: consentimiento y atribución.

Nada de esto está implementado todavía: cada punto es una tarea preparada en `ISSUES_GOOD_FIRST.md`.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/items/example.json` en `data/items/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
