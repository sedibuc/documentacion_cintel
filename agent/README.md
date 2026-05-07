# Documentación Técnica — Agente de Marketing IA

Microsite de documentación técnica para el **Agente de Marketing IA** ("CINTELIO"), generado a partir del análisis del código fuente en `../code/`.

---

## Estructura del proyecto

```
docs/
├── index.html                  ← Página de inicio del microsite
├── diagnostico.html            ← Diagnóstico técnico inicial
├── arquitectura.html           ← Arquitectura del sistema
├── brechas.html                ← Brechas técnicas y oportunidades
├── despliegue.html             ← Guía de despliegue y configuración
├── costos.html                 ← Inventario de servicios IA y costos
│
├── content/                    ← Archivos Markdown (fuente del contenido)
│   ├── inicio.md
│   ├── diagnostico.md
│   ├── arquitectura.md
│   ├── brechas.md
│   ├── despliegue.md
│   └── costos.md
│
├── source/                     ← Referencia técnica consolidada
│   └── diagnostico_marketing_agent.md  ← Documento base para PlantUML
│
├── notes/                      ← Registro de decisiones
│   └── decisiones.md
│
└── assets/
    ├── css/
    │   └── styles.css          ← Hoja de estilos del microsite
    ├── js/
    │   ├── app.js              ← Inicialización (lee DOC_PAGE / DOC_MD)
    │   ├── page-shell.js       ← Carga la navegación compartida
    │   └── markdown-loader.js  ← Fetcha y renderiza el .md con marked.js
    ├── partials/
    │   └── site-shell.html     ← Fragmento HTML de la barra lateral
    └── img/
        └── diagramas/          ← Directorio para diagramas exportados
```

---

## Ejecutar localmente

El microsite usa `fetch()` para cargar los archivos `.md`, por lo que **no funciona abriendo los HTML directamente** desde el explorador de archivos. Necesitas un servidor HTTP local:

```bash
# Desde la raíz de /docs/
python -m http.server 8000
```

Luego abre http://localhost:8000 en tu navegador.

---

## Editar el contenido

Solo necesitas editar los archivos en `content/`. Los HTML no contienen texto de negocio; solo apuntan al `.md` correspondiente.

| Para editar | Modifica |
|---|---|
| Página de inicio | `content/inicio.md` |
| Diagnóstico técnico | `content/diagnostico.md` |
| Arquitectura | `content/arquitectura.md` |
| Brechas y oportunidades | `content/brechas.md` |
| Guía de despliegue | `content/despliegue.md` |
| Inventario de costos | `content/costos.md` |

---

## Agregar una nueva página

1. Crea `content/nueva-pagina.md`.
2. Crea `nueva-pagina.html` copiando cualquier HTML shell existente. Cambia:
   - `<title>` en el `<head>`.
   - `window.DOC_PAGE = 'nueva-pagina'`
   - `window.DOC_MD   = 'content/nueva-pagina.md'`
3. Agrega el enlace de navegación en `assets/partials/site-shell.html`.

---

## Referencia técnica consolidada

`source/diagnostico_marketing_agent.md` es el documento base con todas las especificaciones técnicas en un solo archivo: stack, capas, componentes, flujos de datos, variables de entorno, riesgos. Está diseñado para:

- Generar diagramas PlantUML sin necesidad de revisar el código.
- Servir como brief técnico para nuevos miembros del equipo.
- Alimentar herramientas de documentación automatizada o LLMs con contexto del proyecto.

---

## Relación con el código fuente

El código del agente está en `../code/`. Esta documentación fue generada analizando:
- `code/app.py`, `code/config/settings.py`
- `code/domain/`, `code/infrastructure/`, `code/routes/`
- `code/streaming/`, `code/observability/`, `code/ports/`
- `code/docker-compose.yml`, `code/Dockerfile`, `code/nginx.conf`

Las copias de trabajo originales están en `../code/devtools/documentation/`.  
**La fuente de verdad desde ahora es esta carpeta (`/docs/`).**

---

## Decisiones de diseño

Ver `notes/decisiones.md` para el registro detallado de decisiones de organización y arquitectura.
