# Portafolio de micrositios documentales

Este repositorio contiene dos micrositios HTML estáticos orientados a documentación ejecutiva y técnica de proyectos de IA.

## Micrositios incluidos

- `RAG/`: proyecto de Document Intelligence (evolución desde un demostrador RAG a un DIE multi-tenant).
- `agent/`: proyecto de agentes de IA (agente estratégico, agente creativo y arquitectura por módulos).

## Cómo abrir el home principal

1. Levantar un servidor local desde la raíz del repositorio.
2. Abrir la URL local del servidor en el navegador.

Ejemplo:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000/
```

## Portal principal

El punto de entrada consolidado está en `index.html` y enlaza a:

- `RAG/index.html`
- `agent/index.html`

## Estructura general

- `index.html`: portal de entrada a los micrositios.
- `RAG/`: micrositio del proyecto Document Intelligence.
- `agent/`: micrositio del proyecto de agentes de IA.
- `tree.txt`: inventario de árbol de carpetas (referencial).

## Nota técnica

Ambos micrositios cargan archivos Markdown mediante `fetch()`. Por eso no deben abrirse con `file://`; requieren servidor HTTP local.
