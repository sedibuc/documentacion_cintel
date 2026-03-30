# Diagnóstico Técnico Inicial — Agente de Marketing IA

**Versión:** 1.1  
**Fecha de análisis:** Marzo 2026  
**Alcance:** Código fuente en `/code/`  
**Metodología:** Análisis directo del código fuente. La documentación previa fue usada solo como referencia secundaria y se corrigió con evidencia de implementación.

---

## 1. Descripción General del Sistema

El sistema es una aplicación web conversacional para generación de campañas de marketing desarrollada en Python. Expone una interfaz de chat donde un usuario interactúa con un agente de IA que guía un flujo estructurado para producir:

- una propuesta de campaña en Markdown,
- un plan de ejecución,
- imágenes generadas por IA,
- un correo electrónico con el resumen generado.

El agente se denomina internamente **Jarvis** y opera en español.

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión / evidencia |
|---|---|---|
| Runtime | Python | 3.11 en Dockerfile |
| Framework web | Flask | 3.1.1 |
| Orquestación de agente | LangGraph | 0.4.8 |
| Núcleo LLM | LangChain Core | 0.3.65 |
| LLM OpenAI | `langchain-openai` | 0.3.24 |
| LLM Google | `langchain-google-genai` | 2.1.5 |
| SDK OpenAI | `openai` | 1.93.0 |
| SDK Google | `google-genai` | 1.45.0 |
| ORM | SQLAlchemy | 2.x |
| Base de datos | PostgreSQL 16 / SQLite | según `DATABASE_URL` |
| Driver Postgres | `psycopg2-binary` | 2.9.11 |
| Scraping activo | Requests + BeautifulSoup4 | `requests`, `bs4` |
| Scraping opcional | Selenium | fallback condicionado por configuración |
| Procesamiento de datos | Pandas, openpyxl | 2.3.0 / 3.1.5 |
| OCR / visión | OpenCV headless | 4.12.0.88 |
| Autenticación | PyJWT | 2.10.1 |
| Renderizado email | markdown2 | 2.5.3 |
| Validación | Pydantic v2 | 2.11.7 |
| Contenerización | Docker + Docker Compose | — |
| Proxy inverso | Nginx Alpine | — |
| Túnel opcional | ngrok | — |

---

## 3. Arquitectura General

El sistema mantiene una arquitectura tipo **ports & adapters** con separación entre rutas, dominio, aplicación, infraestructura, puertos, streaming y observabilidad.

### 3.1 Capas identificadas

| Capa | Módulos | Responsabilidad |
|---|---|---|
| Routes | `routes/` | Endpoints HTTP, SSE, autenticación, observabilidad |
| Domain | `domain/` | Grafo LangGraph, estado, nodos de decisión |
| Application | `application/` | OCR, transcripción y fachada legacy |
| Infrastructure | `infrastructure/` | LLM, scraping, email, imágenes, DB, adapters externos |
| Ports | `ports/` | Protocols para inversión de dependencias |
| Config | `config/settings.py` | Variables de entorno centralizadas |
| Streaming | `streaming/` | Pipeline SSE: sink → middleware → cliente |
| Observability | `observability/` | Spans, métricas y recorder |

### 3.2 Hechos confirmados

- Existe una única instancia del agente en `app.extensions["agent"]`.
- El estado del grafo se compila con `MemorySaver`.
- El scraper activo del wiring es `RequestsScraper`, no `Scrapper`.
- El envío de email se hace por Microsoft Graph API.
- La integración de Instagram usa Meta Graph API y tokens en base de datos.

### 3.3 Comportamiento opcional o condicionado por configuración

- Selenium solo participa si `SCRAPER_USE_SELENIUM_ON_BLOCK=true`.
- El enriquecimiento LLM del scraper solo se activa si `SCRAPER_USE_LLM_ENRICHMENT=true`.
- El OCR sobre videos de campañas depende de `CAMPAIGN_VIDEO_OCR_ENABLED=true`.
- Google Gemini solo participa si se selecciona un modelo `gemini-*`.
- ngrok solo existe si se levanta el contenedor correspondiente con `NGROK_AUTHTOKEN`.

---

## 4. Flujos Principales

### 4.1 Flujo conversacional del agente (grafo LangGraph)

El agente se implementa en `domain/campaign_agent.py` como `StateGraph(AssistantState)`. Los nodos confirmados en el código son:

| Nodo | Función |
|---|---|
| `introduce` | Genera introducción por LLM con streaming |
| `ask_email` / `save_email` | Captura y validación de email |
| `ask_ig` / `save_ig` | Captura cuenta de Instagram |
| `ask_has_website` | Pregunta si existe sitio web |
| `ask_url` | Solicita URL |
| `process_url` | Ejecuta scraping y guarda metadata |
| `ask_campaign_docs` | Consulta por histórico documental |
| `process_has_campaign_docs` | Decide si habrá upload |
| `get_campaigns` | Activa UI de carga |
| `ask_upload_campaigns` | Solicita archivo |
| `process_campaign_docs` | Parsea archivo y carga histórico |
| `ask_topic` | Captura tema/objetivo |
| `process_topic` | Consulta Instagram, filtra datos y dispara OCR posterior |
| `ask_dynamic_question` | Genera pregunta dinámica |
| `process_dynamic_answer` | Guarda respuesta y decide continuidad |
| `sumaryze_campaign` | Resume necesidad y espera confirmación |
| `confirm_summary` | Evalúa aceptación del resumen |
| `ask_extra_data` | Permite agregar más contexto |
| `generate_campaign` | Nodo compuesto: genera campaña, plan, prompts, imágenes y envío de email |
| `finished` | Nodo final |

**Importante:** `generate_execution_plan`, `generate_image_prompts`, `generate_images` y `send_email` no son nodos LangGraph separados. Son pasos internos de `generate_campaign`.

**Interrupción del flujo:** el grafo usa `interrupt()` para pausar en nodos de pregunta y reanuda con `Command(resume=...)` dentro de `AgentBase`.

### 4.2 Estado del agente (`AssistantState`)

Campos relevantes confirmados en `domain/state.py`:

- identidad: `thread_id`, `user_id`, `model_name`
- conversación: `messages`, `attachments`, `metadata`
- flags de flujo: `intro_done`, `question_loop_continue`, `current_question`, `has_campaign_docs`, `show_upload_campaigns`, `sumary_accepted`
- datos de negocio: `email`, `instagram`, `topic`, `products_services`, `filtered_products_services`, `campaigns_data`, `repo_campaigns_data`, `ig_campaigns_data`, `filtered_campaigns_data`, `ig_filtered_campaigns_data`, `questions`, `answers`
- artefactos: `campaign_markdown`, `campaign_json`, `images`
- observabilidad/idempotencia: `last_tool_called`, `interruptions_count`, `tokens_emitted`, `campaign_generated`, `campaign_generation_ts`, `last_campaign_signature`, `last_response_streamed`
- auditoría: `created_at`, `updated_at`

**Nota técnica:** `messages` es `List[Any]`, no una lista estrictamente tipada de `AIMessage | HumanMessage`.

### 4.3 Flujo de streaming (SSE)

```
POST /api/stream
   → Flask crea hilo separado
   → agent.chat_with_memory()
   → LangGraph invoca nodos
   → on_token() → SseSink → ChunkingMiddleware → ObserveMiddleware
   → Queue → Response(stream_with_context)
   → Cliente recibe eventos SSE: delta / event / done / error
```

### 4.4 Flujo de autenticación

- Login con verificación de password hasheada vía Werkzeug.
- JWT firmado con HS256.
- Cookie `access_token` con `httponly` y `samesite=Lax`.
- Sliding expiration cuando restan menos de 15 minutos.

### 4.5 Flujo de voz (ASR)

El sistema soporta transcripción con OpenAI o Gemini. El código actual permite configurar `ASR_MODEL`, pero el default declarado (`gpt-4o-mini-tts`) no corresponde a un modelo ASR y debe corregirse en despliegue antes de usar esta capacidad en producción.

### 4.6 Flujo de carga de campañas históricas

- Upload de archivos históricos por ruta dedicada.
- Parseo a lista de dicts normalizados.
- Persistencia en `historical_campaigns`.
- Uso posterior como contexto del agente.

---

## 5. Variables y Configuración Relevantes

### 5.1 Variables confirmadas en runtime

| Variable | Default real | Observación |
|---|---|---|
| `OPENAI_API_KEY` | — | Obligatoria para OpenAI |
| `GOOGLE_API_KEY` | — | Opcional |
| `DATABASE_URL` | — | Obligatoria para persistencia |
| `PORT` | `8081` | Usada por `app.py` cuando se ejecuta con `python app.py` |
| `ENVIRONMENT` | `""` | Se normaliza como `APP_ENVIRONMENT` |
| `APP_ENV` | `dev` | Etiqueta adicional de entorno |
| `UPLOAD_FOLDER` | `./uploads` absoluto | Carpeta de uploads |
| `STREAM_CHUNK_SIZE` | `300` | Controla chunking SSE |
| `OCR_MODEL_NAME` | `gpt-4o` | OCR multimodal |
| `ASR_MODEL` | `gpt-4o-mini-tts` | Default inconsistente para ASR |
| `MAX_UPLOAD_MB` | `25` | Límite de archivos |
| `MAX_IMAGE_GENERATED` | `8` | Límite de imágenes |
| `MAX_DYNAMIC_QUESTIONS` | `10` | Límite del loop dinámico |
| `LLM_INVOKE_RETRIES` | `0` | No `3` |
| `FILTER_BY_TOPIC_MAX_ROWS` | `40` | No `50` |
| `CAMPAIGN_VIDEO_OCR_ENABLED` | `false` | OCR de video desactivado por defecto |
| `IMAGE_MODEL` | `dall-e-3` | Generación de imágenes |
| `FB_APP_ID` / `FB_APP_SECRET` / `IG_CLIENT_ID` | — | Integración Meta |
| `FB_GRAPH_BASE_URL` | `https://graph.facebook.com/v24.0` | Graph API |
| `EMAIL_FROM_EMAIL` / `EMAIL_TENANT_ID` / `EMAIL_CLIENT_ID` / `EMAIL_CLIENT_SECRET` | — | Microsoft Graph |

### 5.2 Variables de scraping omitidas en versiones previas

| Variable | Default real | Uso |
|---|---|---|
| `SCRAPER_TIMEOUT` | `10` | Timeout por request |
| `SCRAPER_MAX_BYTES` | `2000000` | Máximo por página |
| `SCRAPER_MAX_PAGES` | `20` | Límite de páginas |
| `SCRAPER_MAX_LINKS_PER_PAGE` | `25` | Límite de enlaces |
| `SCRAPER_USER_AGENT` | UA por defecto | User-Agent del scraper |
| `SCRAPER_USE_LLM_ENRICHMENT` | `false` | Enriquecimiento LLM opcional |
| `SCRAPER_USE_SELENIUM_ON_BLOCK` | `false` | Fallback Selenium opcional |

### 5.3 Variables no runtime pero relevantes para operación

| Variable | Ámbito | Observación |
|---|---|---|
| `JWT_SECRET` | runtime | Tiene default inseguro en `routes/common.py` |
| `JWT_EXPIRES_MINUTES` | runtime | Default `60` |
| `NGROK_AUTHTOKEN` | infraestructura | Solo contenedor ngrok |
| `FB_TEMP_TOKEN` | bootstrap | Solo se usa en `devtools/scripts/init_token.py` |
| `IG_USER_ID` | bootstrap | Solo inicialización de token; el runtime usa BD |

---

## 6. Persistencia y Modelos de Datos

### Tablas identificadas

| Tabla | Descripción |
|---|---|
| `users` | Usuarios del sistema |
| `conversation_registry` | Último snapshot por `thread_id` |
| `conversation_history` | Historial completo de snapshots |
| `historical_campaigns` | Campañas históricas |
| `service_tokens` | Tokens OAuth externos |
| `observed_metric` | Métricas persistidas |
| `conversation_feedback` | Feedback de usuario |

### Notas críticas sobre persistencia

1. El estado del grafo usa `MemorySaver` y no sobrevive reinicios.
2. La base de datos persiste snapshots serializados, no el checkpointer del grafo.
3. SQLite habilita WAL en desarrollo.

---

## 7. Observabilidad

El sistema implementa observabilidad propia mediante:

- `span(name, attrs)` como context manager,
- `record_count(name, value, tags)`,
- `DBRecorder` persistente,
- decorador `@observed` sobre nodos del grafo,
- métricas HTTP en `app.py`,
- dashboard `/metrics`.

---

## 8. Riesgos Técnicos Iniciales

| # | Riesgo | Severidad | Evidencia / observación |
|---|---|---|---|
| R1 | Estado del agente en memoria (`MemorySaver`) | Alta | Se pierde en reinicios |
| R2 | `JWT_SECRET` inseguro por defecto | Alta | `dev-secret-change-me` |
| R3 | Instancia única del agente | Media | Sin multi-tenancy real |
| R4 | Sin rate limiting | Media | Rutas expuestas sin throttling |
| R5 | `/api/stream` no tiene configuración SSE específica en nginx | Media | Solo `/stream` tiene `proxy_buffering off` |
| R6 | `ASR_MODEL` default inconsistente para transcripción | Alta | Default `gpt-4o-mini-tts` |
| R7 | Bug latente en `infrastructure/facade.py` (`social_x`) | Media | No rompe el flujo principal mientras haya `configure_tooling()` |
| R8 | Scraper legado y scraper activo coexisten | Media | Riesgo de ambigüedad operativa |
| R9 | Archivos subidos sin escaneo antivirus | Media | Validación limitada |
| R10 | Credenciales sensibles en `.env` si se versiona | Alta | Riesgo operativo; verificar `.gitignore` |

---

## 9. Conclusiones del Diagnóstico

El sistema está funcionalmente operativo para su flujo principal, pero la documentación debía corregirse en cuatro frentes: modelado real del grafo, defaults de configuración, componentes activos versus legacy y riesgos operativos.

Prioridades de alineación para continuidad arquitectónica:

1. Sustituir `MemorySaver` por persistencia real del grafo.
2. Corregir `ASR_MODEL` a un modelo de transcripción válido.
3. Alinear nginx para SSE en `/api/stream` si esa ruta será expuesta detrás del proxy.
4. Reducir deuda técnica entre fachada activa y fachada legacy.
