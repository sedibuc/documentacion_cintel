# Micrositio del diagnóstico RAG

Sitio estático en HTML, CSS y JavaScript que carga contenido Markdown desde la carpeta content y lo renderiza en el navegador.

## Requisito para abrirlo

El sitio usa fetch para cargar los archivos Markdown. Por eso debe servirse desde un servidor local simple y no abrirse directamente con file://.

## Opción rápida con Python

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000/
```

## Estructura principal

- index.html
- diagnostico.html
- arquitectura.html
- brechas.html
- despliegue.html
- costos.html
- assets/css/styles.css
- assets/js/markdown-loader.js
- assets/js/app.js
- content/

## Fuente de contenido

El contenido se construyó a partir de source/diagnostico_rag.md.
