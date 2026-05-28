# Arquitectura Vigente — Agente de Marketing IA

**Versión:** 1.1  
**Fecha:** Marzo 2026  
**Nivel:** Lógico y de implementación (basado en código fuente)

---

## 1. Descripción de Componentes

### 1.1 Capa de Presentación / Rutas (`routes/`)

| Módulo | Blueprint | Responsabilidad |
|---|---|---|
| `auth.py` | `auth` | Registro, login, logout. Emisión y validación de JWT vía cookie. |
| `chat.py` | `chat` | Renderizado del UI de chat. Resolución de `thread_id` y construcción del estado inicial para el frontend. |
| `stream.py` | `stream` | Endpoints SSE `/stream` y `/api/stream`. Coordina hilo de ejecución del agente con la cola de eventos. |
| `voice.py` | `voice` | Recepción de audio, transcripción y devolución de texto. |
| `historical_campaigns.py` | `historical_campaigns` | Upload, preview, listado y gestión de campañas históricas. |
| `api_conversations.py` | `api_conversations` | API REST para consulta de conversaciones persistidas. |
| `api_feedback.py` | `api_feedback` | API REST para registro de feedback de usuarios. |
| `observability.py` | `observability` | Dashboard y API de métricas del sistema. |
| `misc.py` | `misc` | Rutas auxiliares (home, static, health check). |
| `common.py` | — | Funciones compartidas: `login_required`, `create_access_token`, `get_current_user`. |

### 1.2 Capa de Dominio (`domain/`)

| Módulo | Responsabilidad |
|---|---|
| `state.py` — `AssistantState` | Modelo Pydantic v2 del estado completo del agente. Incluye mensajes, productos, campañas, metadata, flags de flujo e indicadores de idempotencia. |
| `agent_base.py` — `AgentBase` | Clase abstracta base. Provee streaming, locks por `thread_id`, idempotencia, tool runner, validación de archivos y compilación del grafo con `MemorySaver`. |
| `agent_nodes.py` — `AgentNodes` | Funciones estáticas de clasificación y decisión: `last_user_content()`, `is_url_include()`, `is_affirmative()` y `should_continue_asking()`. Usa regex con fallback al LLM. |
| `campaign_agent.py` — `CampaignAgent` | Implementación concreta del grafo LangGraph del agente de campañas. |

### 1.3 Capa de Aplicación (`application/`)

| Módulo | Responsabilidad |
|---|---|
| `tools_facade.py` — `ToolsFacade` (legacy) | Fachada histórica con herramientas decoradas como `@tool` de LangChain. Sigue existiendo como base de algunos adapters legacy. |
| `services/campaign_ocr_service.py` | Servicio de OCR para campañas de Instagram: descarga medios, extrae texto de imágenes y, opcionalmente, de videos. Controlado por `CAMPAIGN_VIDEO_OCR_ENABLED`. |
| `services/transcriber.py` | Transcripción de audio a texto. Soporta OpenAI y Gemini. |
| `services/ocr.py` | Cliente OCR genérico apoyado en visión multimodal. |

### 1.4 Capa de Infraestructura (`infrastructure/`)

| Módulo | Responsabilidad |
|---|---|
| `facade.py` — `ToolsFacade` (infra) | Fachada activa del agente. Despacha llamadas a `Tooling` y a los puertos concretos. |
| `tooling.py` — `Tooling` | Dataclass contenedor de adapters concretos: `llm`, `scraper`, `campaign`, `image`, `email`, `social`. |
| `llm_factory.py` — `LLMFactory` | Factory de clientes LLM con `lru_cache`. Soporta OpenAI (`gpt-*`) y Google (`gemini-*`). |
| `llm_wrapper.py` — `LLMWrapper` | Capa de prompts, clasificación, streaming de texto y estimación heurística de tokens. |
| `llm_image_wrapper.py` | Generación de imágenes con DALL-E 3 o `gpt-image-1`, con fallback. |
| `adapters/requests_scraper.py` — `RequestsScraper` | Scraper activo del sistema. Implementa `ScraperPort`, usa Requests + BeautifulSoup y activa enriquecimiento LLM o Selenium solo por configuración. |
| `scrapper_site.py` — `Scrapper` | Implementación legacy de scraping multi-página. Existe en el repositorio, pero no es la que se inyecta actualmente en `app.py`. |
| `email_handler.py` — `EmailHandler` | Envío de email vía Microsoft Graph API. Construye HTML con historial, campaña e imágenes. |
| `data_retrieval.py` — `CampaignHistoryParser` | Parser de archivos Excel/CSV/JSON a lista de dicts normalizados. |
| `adapters/legacy_adapters.py` | Adaptadores puente que implementan los puertos delegando a `LLMWrapper`, `EmailHandler`, generadores de imagen y fachada legacy. |
| `adapters/instagram_tool.py` — `IGFilterCampaigns` | Implementa `SocialPort`. Obtiene posts/campañas del Graph API de Instagram y aplica filtros. |
| `adapters/x_tool.py` — `XFilterCampaigns` | Código disponible para X/Twitter, pero no forma parte del wiring activo del agente. |
| `db/session.py` | Sesión SQLAlchemy. Soporta SQLite con WAL y PostgreSQL. |
| `db/models/` | Modelos ORM del sistema. |
| `db/conversation_logging.py` | Persistencia de snapshots en `conversation_registry` y `conversation_history`. |
| `services/instagram_client.py` — `IGApiClient` | Cliente HTTP para Meta Graph API. |
| `services/token_refresh.py` | Renovación de tokens de Meta. |
| `repositories/service_token_repo.py` | Repositorio SQLAlchemy para `service_tokens`. |

### 1.5 Capa de Puertos (`ports/`)

Define los contratos de inversión de dependencias como `Protocol` de Python:

- `LLMPort`
- `ScraperPort`
- `CampaignPort`
- `ImageGenPort`
- `EmailPort`
- `SocialPort`

### 1.6 Capa de Streaming (`streaming/`)

| Módulo | Responsabilidad |
|---|---|
| `stream_sink.py` — `StreamSink` | Contrato base. Métodos: `on_token`, `on_event`, `on_done`, `on_error`. |
| `sinks.py` — `SseSink` | Implementación SSE: serializa eventos `data: {...}\n\n`. |
| `middleware/chunking_middleware.py` — `ChunkingMiddleware` | Divide tokens en trozos de `CHUNKING_MAX_SIZE` caracteres. |
| `middleware/observer_middleware.py` — `ObserveMiddleware` | Emite métricas por evento/token del streaming. |

### 1.7 Capa de Observabilidad (`observability/`)

| Módulo | Responsabilidad |
|---|---|
| `observe.py` | `span`, `record_count`, `set_recorder`, `current_span`. |
| `recorder.py` — `DBRecorder` | Persistencia de eventos y métricas en `observed_metric`. |

---

## 2. Relaciones entre Componentes

```
app.py
 ├── configure_tooling(Tooling(...))    → infrastructure/facade.py · _TOOLING
 ├── app.extensions["agent"] = CampaignAgent()
 └── register_blueprints(app)           → routes/__init__.py

routes/stream.py
 └── agent.chat_with_memory()
      └── domain/agent_base.py (AgentBase)
           ├── LangGraph StateGraph.invoke() / stream()
           │    └── domain/campaign_agent.py (nodos)
           │         ├── ToolsFacade (infrastructure/facade.py)
           │         │    └── _TOOLING (Tooling)
           │         │         ├── llm     → LegacyLLMAdapter   → LLMWrapper → LLMFactory → OpenAI/Gemini
           │         │         ├── scraper → RequestsScraper    → Requests/BS4/(Selenium opcional)
           │         │         ├── campaign→ LegacyCampaignAdapter → CampaignHistoryParser / DB
           │         │         ├── image   → LegacyImageGenAdapter → DALL-E 3 / gpt-image-1
           │         │         ├── email   → LegacyEmailAdapter → EmailHandler → MS Graph API
           │         │         └── social  → IGFilterCampaigns  → IGApiClient → Meta Graph API
           │         └── AgentNodes (clasificadores)
           └── StreamSink → SseSink → Queue → SSE Response
```

---

## 3. Diagramas Arquitectónicos y de Flujo

La sección de diagramas se reorganiza para mostrar el sistema desde siete perspectivas complementarias: estructura lógica, recorrido real del grafo, generación de campaña, streaming, scraping, integración con Instagram y persistencia conversacional. Se sustituyen diagramas anteriores que ya quedaban solapados o menos precisos frente a esta vista consolidada.

### 3.1 Arquitectura lógica general

Este diagrama resume la topología lógica del sistema y las dependencias entre capas, persistencia, streaming y servicios externos. Es la vista de entrada más útil para lectores técnicos y ejecutivos porque ubica rápidamente qué piezas están activas y cuáles permanecen como legado.

![Arquitectura lógica general](assets/img/diagramas/arquitectura-general.png)

<a href="assets/plantuml/arquitectura-general.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.2 Flujo conversacional real del grafo

Este flujo refleja la secuencia real del `CampaignAgent` definida en LangGraph. Se ajusta respecto de versiones previas para mostrar nodos que sí existen en código, como `ask_url` y `ask_campaign_docs`, y para dejar explícito que la confirmación del resumen puede devolver al lazo de captura adicional.

![Flujo conversacional real del grafo](assets/img/diagramas/flujo-grafo.png)

<a href="assets/plantuml/flujo-grafo.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.3 Flujo interno de `generate_campaign`

Este diagrama descompone el nodo más costoso y más relevante del sistema. La idea central es que plan de ejecución, prompts, imágenes y envío de email no son nodos del grafo, sino pasos internos de `generate_campaign` con controles de idempotencia y bifurcaciones paralelas.

![Flujo interno de generate_campaign](assets/img/diagramas/flujo-generate-campaign.png)

<a href="assets/plantuml/flujo-generate-campaign.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.4 Flujo SSE / streaming

La ruta SSE es crítica porque condiciona la experiencia conversacional y la observabilidad del sistema. El diagrama muestra el encadenamiento real entre `Routes /api/stream`, `CampaignAgent`, `LangGraph`, `SseSink` y los middlewares de chunking y métricas antes de volver al navegador.

![Flujo SSE](assets/img/diagramas/flujo-sse.png)

<a href="assets/plantuml/flujo-sse.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.5 Flujo de scraping + enriquecimiento

Este diagrama documenta el recorrido desde la URL proporcionada por el usuario hasta la generación de contexto estructurado para el agente. Es relevante porque el scraper activo es `RequestsScraper`, mientras que el enriquecimiento con LLM y el fallback con Selenium solo dependen de configuración.

![Flujo de scraping y extracción de contexto](assets/img/diagramas/flujo-scraping.png)

<a href="assets/plantuml/flujo-scraping.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.6 Flujo de Instagram + OCR opcional

La integración con Instagram aporta campañas previas y señales de contexto; el OCR es un paso posterior y opcional, no parte de la obtención inicial desde Meta. El diagrama deja explícito ese desacople para evitar confundir la llamada al Graph API con el enriquecimiento multimodal.

![Flujo de Instagram y OCR opcional](assets/img/diagramas/flujo-instagram-ocr.png)

<a href="assets/plantuml/flujo-instagram-ocr.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### 3.7 Flujo de persistencia conversacional

La persistencia conversacional se resuelve con snapshot actual y bitácora append-only. Esta vista es importante porque complementa la memoria en RAM de LangGraph con una traza durable para auditoría, reconsulta y análisis histórico.

![Persistencia de conversación](assets/img/diagramas/flujo-persistencia.png)

<a href="assets/plantuml/flujo-persistencia.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

---

## 4. Grafo Real de `CampaignAgent`

Los nodos definidos explícitamente en `domain/campaign_agent.py` son:

| Nodo | Tipo | Observación |
|---|---|---|
| `introduce` | nodo LLM | Genera introducción con streaming. |
| `ask_email` | interrupt | Pregunta email. |
| `save_email` | validación | Aplica regex de email. |
| `ask_ig` | interrupt | Pregunta cuenta de Instagram. |
| `save_ig` | captura | Guarda handle. |
| `ask_has_website` | interrupt | Pregunta si existe sitio web. |
| `ask_url` | interrupt | Solicita URL. |
| `process_url` | scraping | Ejecuta scraping y publica evento SSE. |
| `ask_campaign_docs` | interrupt | Consulta si hay histórico documental. |
| `process_has_campaign_docs` | decisión | Define si se solicita upload o se continúa. |
| `get_campaigns` | UI/evento | Activa bandera `show_upload_campaigns`. |
| `ask_upload_campaigns` | interrupt | Solicita archivo cargado. |
| `process_campaign_docs` | parseo | Lee archivo y carga histórico. |
| `ask_topic` | interrupt | Solicita tema/objetivo de campaña. |
| `process_topic` | integración + filtrado | Consulta Instagram, filtra productos/campañas y dispara OCR posterior. |
| `ask_dynamic_question` | interrupt + LLM | Genera y emite pregunta dinámica. |
| `process_dynamic_answer` | decisión | Guarda respuesta y evalúa `should_continue_asking`. |
| `sumaryze_campaign` | resumen | Sintetiza necesidades y espera confirmación. |
| `confirm_summary` | decisión | Evalúa si se acepta el resumen. |
| `ask_extra_data` | interrupt | Permite agregar más contexto. |
| `generate_campaign` | nodo compuesto | Dentro de este mismo nodo se genera la campaña, el plan de ejecución, los prompts de imagen, las imágenes en paralelo y el envío de email en background. |
| `finished` | final | Nodo terminal vacío. |

Punto clave: `generate_execution_plan`, `generate_images` y `send_email` no son nodos independientes del grafo. Son pasos internos del nodo `generate_campaign`.

---

## 5. Responsabilidades por Módulo

| Módulo | Responsabilidad Principal | Acoplamiento |
|---|---|---|
| `app.py` | Bootstrap y wiring de dependencias | Alto |
| `domain/campaign_agent.py` | Lógica conversacional del agente | Medio |
| `domain/agent_base.py` | Infraestructura transversal del agente | Alto |
| `infrastructure/llm_wrapper.py` | Prompts y clasificación | Alto |
| `infrastructure/facade.py` | Entrada unificada a herramientas | Medio |
| `routes/stream.py` | Entrega de respuestas por SSE | Medio |
| `infrastructure/db/*` | Persistencia | Bajo |
| `observability/*` | Trazabilidad y métricas | Bajo |

---

## 6. Incertidumbres Arquitectónicas

| ID | Descripción |
|---|---|
| U1 | `x_tool.py` existe, pero no forma parte del wiring activo del agente en `app.py`. |
| U2 | `Scrapper` sigue presente en el repositorio, pero el scraper activo es `RequestsScraper`; la convivencia de ambas rutas indica transición incompleta. |
| U3 | `application/tools_facade.py` y `infrastructure/facade.py` coexisten con responsabilidades superpuestas. |
| U4 | La renovación exacta de tokens Meta depende de servicios y repositorios auxiliares no modelados en esta página. |
| U5 | El wiring por defecto de `infrastructure/facade.py` contiene un bug (`social_x` en lugar de `social`), pero no impacta el flujo principal mientras `configure_tooling()` se ejecute antes del uso. |
