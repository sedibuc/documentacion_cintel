# Registro de Decisiones — Agente Marketing IA

Documento que registra las decisiones de diseño y organización tomadas durante el análisis y reestructuración de la documentación del proyecto.

---

## D1 — Separar documentación del código fuente

**Fecha:** Marzo 2026  
**Estado:** Implementado  

**Decisión:** Mover toda la documentación técnica fuera de `/code/devtools/documentation/` y crear un proyecto independiente en `/docs/`.

**Alternativas consideradas:**
- Mantener la documentación dentro de `/code/devtools/` (descartada: acopla dos proyectos distintos).
- Usar un servicio externo (Notion, Confluence) como repositorio de docs (descartada: rompe la trazabilidad con el repositorio).

**Razón:** La documentación pertenece conceptualmente al proyecto en su totalidad, no a la implementación. Separarla permite versionarla de forma independiente, publicarla como microsite estático, y consultarla sin necesidad de acceso al código.

**Consecuencias:** Los archivos en `/code/devtools/documentation/` se consideran copias de trabajo desactualizadas. La fuente de verdad es `/docs/`.

---

## D2 — Arquitectura de microsite: HTML shells + JS + Markdown

**Fecha:** Marzo 2026  
**Estado:** Implementado  

**Decisión:** El microsite usa HTML shells mínimas que cargan Markdown dinámicamente a través de `marked.js` (CDN), en lugar de generar HTML estático con un SSG (Jekyll, Hugo, MkDocs).

**Alternativas consideradas:**
- MkDocs con tema Material (descartada: requiere instalación Python, build step, y dependencias adicionales).
- Jekyll / GitHub Pages (descartada: requiere Ruby; agrega complejidad innecesaria para un equipo que ya usa Python).
- HTML estático manual (descartada: duplica todo el contenido en formato HTML; más costoso de mantener).

**Razón:** El enfoque elegido permite editar únicamente los archivos `.md` en `/content/` sin recompilar nada. El único requisito es un servidor HTTP local simple (`python -m http.server 8000`). No hay build step.

**Consecuencias:** El sitio no funciona abriendo los HTML directamente desde el sistema de archivos (protocolo `file://`) debido a restricciones CORS del navegador al hacer `fetch()`. Se requiere un servidor local. Este riesgo está documentado en el mensaje de error del componente `markdown-loader.js`.

---

## D3 — Un archivo consolidado en `/source/`

**Fecha:** Marzo 2026  
**Estado:** Implementado  

**Decisión:** Crear `source/diagnostico_marketing_agent.md` como documento técnico consolidado, que agrupa todos los elementos arquitecturales en un solo lugar.

**Razón principal:** Los 5 documentos de `/content/` están orientados a la presentación (cada uno cubre un tema específico). El archivo `/source/` está diseñado para ser base de diagramas PlantUML y referencia técnica sin intermediarios: variables de entorno, modelos de estado, componentes, flujos de datos, todo en un solo archivo.

**Consecuencias:** Este archivo debe mantenerse sincronizado con el código fuente cuando haya cambios significativos de arquitectura.

---

## D4 — Reutilización de contenido de `/code/devtools/documentation/`

**Fecha:** Marzo 2026  
**Estado:** Implementado  

**Decisión:** Los 5 documentos en `/code/devtools/documentation/` fueron usados como base directa para los archivos en `/docs/content/`. No se inventó contenido nuevo; todo proviene del análisis del código fuente.

**Contenido reutilizado:**

| Origen | Destino | Observaciones |
|---|---|---|
| `code/devtools/documentation/diagnostico.md` | `docs/content/diagnostico.md` | Adaptado al formato del microsite |
| `code/devtools/documentation/arquitectura.md` | `docs/content/arquitectura.md` | PlantUML preservado íntegro |
| `code/devtools/documentation/brechas.md` | `docs/content/brechas.md` | Formato condensado; contenido idéntico |
| `code/devtools/documentation/despliegue.md` | `docs/content/despliegue.md` | Template .env condensado |
| `code/devtools/documentation/costos.md` | `docs/content/costos.md` | Tablas y estimaciones preservadas |

**Contenido creado de cero en esta segunda sesión:**
- `docs/content/inicio.md` — página de aterrizaje del microsite.
- `docs/source/diagnostico_marketing_agent.md` — referencia consolidada.
- `docs/notes/decisiones.md` — este archivo.
- `docs/README.md` — descripción del proyecto de documentación.
- `docs/assets/css/styles.css` — hoja de estilos del microsite.
- `docs/assets/js/app.js` — inicialización del microsite.
- `docs/assets/js/page-shell.js` — carga de navegación compartida.
- `docs/assets/js/markdown-loader.js` — renderizador de Markdown.
- `docs/assets/partials/site-shell.html` — fragmento de navegación.
- `docs/index.html` y 5 HTML shells — estructura del sitio.

---

## D5 — Gestión del estado del agente (observación, no decisión)

**Fecha:** Marzo 2026  
**Estado:** Pendiente (decisión de arquitectura futura)

**Contexto:** El agente usa `MemorySaver` de LangGraph, que almacena el estado del grafo únicamente en RAM. Al reiniciar el proceso, todo el estado conversacional se pierde.

**Opciones técnicas disponibles:**
- `langgraph-checkpoint-postgres` — reemplaza `MemorySaver` con persistencia PostgreSQL. Sería el camino natural dado que ya hay PostgreSQL en el stack.
- `langgraph-checkpoint-redis` — alternativa para entornos con Redis disponible.
- `langgraph-checkpoint-sqlite` — para desarrollo/testing local.

**Evaluación pendiente:** Esta decisión tiene impacto en el esquema de base de datos y en la estrategia de escalado horizontal. No debe tomarse sin definir también la estrategia de multi-tenancy (ver B2 en `brechas.md`).

---

## D6 — Evidencia y cobertura documental

**Fecha:** Marzo 2026  

Todo el contenido documental produjido se basó en lectura directa del código fuente. Archivos principales analizados:

- `code/app.py`
- `code/config/settings.py`
- `code/requirements.txt`
- `code/domain/campaign_agent.py`, `agent_base.py`, `state.py`, `agent_nodes.py`
- `code/infrastructure/facade.py`, `llm_wrapper.py`, `llm_factory.py`, `llm_image_wrapper.py`
- `code/infrastructure/adapters/instagram_tool.py`, `legacy_adapters.py`, `requests_scraper.py`, `x_tool.py`
- `code/infrastructure/db/` (todos los modelos ORM)
- `code/application/tools_facade.py`, `services/`
- `code/routes/` (todos los blueprints)
- `code/streaming/` (`contracts.py`, `sinks.py`, `middleware/`)
- `code/observability/observe.py`, `recorder.py`
- `code/ports/tools.py`, `service_token_repo.py`
- `code/docker-compose.yml`, `Dockerfile`, `nginx.conf`

**Incertidumbres no resueltas (no fue posible confirmar desde el código):**
- U1: Forma exacta de recuperación del estado en `MemorySaver` tras reinicio.
- U2: Comportamiento exacto de Selenium cuando Chromium no está disponible en el contenedor.
- U3: Configuración completa del `x_tool.py` (adaptador de X/Twitter).
- U4: Flujo exacto de renovación de token OAuth de Meta en producción.
