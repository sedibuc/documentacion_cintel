# Contexto del proyecto — Agente de Marketing IA (microsite de documentación)

> Documento generado para onboarding de agentes. Resume el estado real del proyecto al 18 de abril de 2026.

---

## ¿Qué es este repositorio?

Este repositorio **no es el código del agente**. Es el **microsite de documentación técnica** del Agente de Marketing IA ("CINTELIO"), construido como proyecto estático independiente.

- El código fuente del agente está en `../code/` (fuera de este workspace).
- Este microsite vive en la carpeta `agent/` (raíz de este workspace).
- La fuente de verdad de la documentación es **esta carpeta**; las copias antiguas en `../code/devtools/documentation/` están desactualizadas.

---

## El sistema documentado: Agente de Marketing IA ("CINTELIO")

### ¿Qué hace?

Aplicación web conversacional en Python que guía al usuario a través de un flujo estructurado para producir:

1. Una propuesta de campaña de marketing (Markdown).
2. Un plan de ejecución detallado.
3. Imágenes generadas por IA (redes sociales).
4. Un correo electrónico de resumen enviado automáticamente al cliente.

El agente opera en **español** y está orientado al mercado hispanoparlante.

### Stack tecnológico confirmado por código fuente

| Categoría | Tecnología |
|---|---|
| Runtime | Python 3.11 |
| Framework web | Flask 3.1.1 |
| Orquestación IA | LangGraph 0.4.8 + LangChain Core 0.3.65 |
| LLM principal | OpenAI GPT-4.1 |
| LLM alternativo | Google Gemini (configurable) |
| Generación de imágenes | DALL-E 3 / gpt-image-1 |
| Transcripción de voz | OpenAI Whisper / Gemini Audio |
| Base de datos | PostgreSQL 16 / SQLite (según `DATABASE_URL`) |
| ORM | SQLAlchemy 2.x |
| Validación de estado | Pydantic v2 |
| Autenticación | PyJWT (JWT HS256, cookie httponly) |
| Email | Microsoft Graph API |
| Instagram | Meta Graph API |
| Scraping activo | Requests + BeautifulSoup4 (`RequestsScraper`) |
| Scraping legacy/fallback | Selenium (solo si `SCRAPER_USE_SELENIUM_ON_BLOCK=true`) |
| Despliegue | Docker Compose + Nginx Alpine |
| Proxy inverso | Nginx |
| Túnel opcional | ngrok |

### Arquitectura del agente

**Patrón:** Ports & Adapters (hexagonal).

| Capa | Módulos | Responsabilidad |
|---|---|---|
| Routes | `routes/` | HTTP, SSE, auth, observabilidad |
| Domain | `domain/` | Grafo LangGraph, estado (`AssistantState`), nodos |
| Application | `application/` | OCR, transcripción, fachada legacy |
| Infrastructure | `infrastructure/` | LLM, scraping, email, imágenes, DB, adapters |
| Ports | `ports/` | Protocols para inversión de dependencias |
| Config | `config/settings.py` | Variables de entorno centralizadas |
| Streaming | `streaming/` | Pipeline SSE: `SseSink → ChunkingMiddleware → ObserveMiddleware` |
| Observability | `observability/` | Spans, métricas, recorder |

**Puertos definidos:** `LLMPort`, `ScraperPort`, `CampaignPort`, `ImageGenPort`, `EmailPort`, `SocialPort`.

### Flujo conversacional del grafo LangGraph

Nodos confirmados en `domain/campaign_agent.py`:

`introduce` → `ask_email / save_email` → `ask_ig / save_ig` → `ask_has_website` → `ask_url` → `process_url` → `ask_campaign_docs` → ... → **`generate_campaign`** (nodo único que ejecuta: generación de campaña, plan de ejecución, imágenes y envío de email).

> **Importante:** `generate_execution_plan`, `generate_images` y `send_email` NO son nodos separados del grafo. Todo ocurre dentro de `generate_campaign`.

---

## El microsite (este repositorio)

### Tecnología

- HTML shells mínimos que cargan Markdown dinámicamente con `marked.js` (CDN).
- Sin build step. Sin SSG (no Jekyll, no Hugo, no MkDocs).
- Requiere un servidor HTTP local para funcionar (no abre desde `file://` por restricciones CORS).

```bash
# Desde la raíz del workspace
python -m http.server 8000
# Luego abrir http://localhost:8000
```

### Estructura de archivos

```
agent/
├── index.html              ← Shell de inicio
├── diagnostico.html        ← Shell de diagnóstico
├── arquitectura.html       ← Shell de arquitectura
├── brechas.html            ← Shell de brechas
├── despliegue.html         ← Shell de despliegue
├── costos.html             ← Shell de costos
│
├── content/                ← Fuente editable del contenido (solo editar aquí)
│   ├── inicio.md
│   ├── diagnostico.md      ← Diagnóstico técnico inicial (v1.1)
│   ├── arquitectura.md     ← Arquitectura vigente (v1.1)
│   ├── brechas.md          ← Brechas y oportunidades (v1.1)
│   ├── despliegue.md       ← Guía de despliegue y variables de entorno
│   └── costos.md           ← Inventario de servicios IA y estimación de costos
│
├── source/
│   └── diagnostico_marketing_agent.md  ← Referencia técnica consolidada (base PlantUML)
│
├── notes/
│   ├── decisiones.md                           ← Registro de decisiones de diseño
│   └── diagnostico_coherencia_marketing_agent.md ← Auditoría de coherencia doc vs código
│
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js              ← Lee DOC_PAGE / DOC_MD del HTML shell
│   │   ├── page-shell.js       ← Carga navegación desde site-shell.html
│   │   └── markdown-loader.js  ← Fetcha y renderiza el .md con marked.js
│   ├── partials/
│   │   └── site-shell.html     ← Fragmento HTML de la barra lateral (nav)
│   └── img/diagramas/          ← Diagramas exportados
│
├── README.md               ← Documentación del microsite
└── contexto.md             ← Este archivo
```

### Cómo agregar una nueva página

1. Crear `content/nueva-pagina.md`.
2. Copiar cualquier HTML shell existente como `nueva-pagina.html`. Cambiar:
   - `<title>` en el `<head>`.
   - `window.DOC_PAGE = 'nueva-pagina'`
   - `window.DOC_MD   = 'content/nueva-pagina.md'`
3. Agregar el enlace en `assets/partials/site-shell.html`.

---

## Brechas críticas conocidas del agente

| Brecha | Severidad |
|---|---|
| `MemorySaver` no persiste entre reinicios del proceso (sin checkpointer externo) | Alta |
| No hay multi-tenancy: aislamiento solo por `thread_id` | Alta |
| `JWT_SECRET` tiene default inseguro; cookie con `secure=False` | Alta |
| No hay rate limiting en `/stream` ni `/api/stream` | Alta |
| Credenciales sensibles detectadas en `.env` en el repositorio | Alta |
| `ASR_MODEL` tenía por defecto `gpt-4o-mini-tts` (modelo TTS, no ASR) | Media |
| Bug latente en `infrastructure/facade.py`: `social_x=XFilterCampaigns()` pasado a `Tooling` que no tiene ese campo | Media |
| `/api/stream` sin configuración SSE en `nginx.conf` (solo `/stream` la tiene) | Media |
| `XFilterCampaigns` (X/Twitter) no está en el wiring activo del agente | Baja |

---

## Variables de costo principales del agente

| Variable de entorno | Impacto |
|---|---|
| `MAX_DYNAMIC_QUESTIONS` (default 10) | Número de llamadas al LLM por sesión |
| `MAX_IMAGE_GENERATED` (default 8) | Costo de imágenes por sesión |
| `FILTER_BY_TOPIC_MAX_ROWS` (default 40) | Contexto enviado al LLM para filtrado |
| `IMAGE_MODEL` (`dall-e-3` o `gpt-image-1`) | Costo unitario por imagen |
| `selected_model` / `model_name` | Costo unitario por token de texto |

---

## Archivos clave para entender el agente (código fuente, fuera de este workspace)

| Archivo | Contiene |
|---|---|
| `code/domain/state.py` | `AssistantState` — estado completo del grafo |
| `code/domain/campaign_agent.py` | Definición del grafo LangGraph |
| `code/domain/agent_nodes.py` | Nodos de decisión y clasificación |
| `code/config/settings.py` | Todas las variables de entorno |
| `code/infrastructure/facade.py` | Wiring activo de adapters |
| `code/routes/stream.py` | Endpoints SSE |
| `code/app.py` | Inicialización Flask e instancia del agente |

---

## Convenciones del microsite

- **Solo se editan los archivos en `content/`**. Los HTML shells no contienen texto de negocio.
- Los archivos `.md` en `content/` son la única fuente editable del sitio.
- `source/diagnostico_marketing_agent.md` es el documento técnico consolidado, diseñado para generar diagramas PlantUML y servir como brief técnico. Debe mantenerse sincronizado con el código cuando haya cambios arquitectónicos.
- Todas las versiones de contenido son `v1.1` (auditadas contra el código fuente en marzo 2026).
