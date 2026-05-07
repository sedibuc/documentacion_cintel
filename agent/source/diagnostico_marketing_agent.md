# Diagnóstico Técnico Consolidado — Agente de Marketing IA

**Propósito de este archivo:** Fuente base consolidada para diagramación PlantUML y referencia técnica unificada del sistema.  
**Versión:** 1.1  
**Fecha:** Marzo 2026  
**Fuente primaria:** Código fuente en `/code/`  
**Nota:** Este documento agrupa los puntos estructurales de todos los documentos de diagnóstico. Para detalle completo, ver los archivos individuales en `/content/`.

---

## 1. Descripción General

El **Agente de Marketing IA** es una aplicación web conversacional construida en Python + Flask que guía a un usuario de negocio a través de un flujo estructurado para generar:

- Propuesta de campaña de marketing (Markdown).
- Plan de ejecución detallado.
- Imágenes generadas por IA (DALL-E 3 / gpt-image-1).
- Email de cierre con el resumen completo de la campaña.

El agente se denomina internamente **"CINTELIO"**. Opera en español y está orientado al mercado hispanoparlante.

---

## 2. Objetivo Funcional

Automatizar el proceso de diseño de campañas de marketing mediante un agente de IA que:

1. Recopila contexto del negocio: sitio web (scraping), campañas históricas (Excel/CSV/BD), publicaciones de Instagram (Meta Graph API).
2. Formula preguntas de profundización dinámicas adaptadas al tema de la campaña.
3. Genera una campaña coherente con el contexto del negocio.
4. Produce imágenes de activos visuales en paralelo.
5. Consolida y entrega el resultado vía email corporativo (Microsoft Graph API).

---

## 3. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | Python | 3.11 |
| Framework web | Flask | 3.1.1 |
| Orquestación agente | LangGraph | 0.4.8 |
| LangChain Core | langchain-core | 0.3.65 |
| LLM OpenAI | langchain-openai | 0.3.24 |
| LLM Google | langchain-google-genai | 2.1.5 |
| SDK OpenAI | openai | 1.93.0 |
| SDK Google | google-genai | 1.45.0 |
| ORM | SQLAlchemy | ≥ 2.0 |
| Base de datos | PostgreSQL 16 / SQLite | — |
| Driver Postgres | psycopg2-binary | 2.9.11 |
| Scraping | BeautifulSoup4 + Requests | 4.13.4 / 2.32.4 |
| Scraping JS | Selenium | — |
| Datos | Pandas, openpyxl | 2.3.0 / 3.1.5 |
| OCR / Visión | OpenCV headless | 4.12.0.88 |
| Autenticación | PyJWT | 2.10.1 |
| Email render | markdown2 | 2.5.3 |
| Validación | Pydantic v2 | 2.11.7 |
| Contenerización | Docker + Docker Compose | — |
| Proxy inverso | Nginx Alpine | — |
| Túnel (opcional) | ngrok | — |

---

## 4. Arquitectura — Capas del Sistema

El sistema implementa una separación arquitectónica consistente con un enfoque **ports & adapters**, con algunas rutas legacy todavía presentes:

```
┌──────────────────────────────────────────────────┐
│  PRESENTACIÓN: Flask Templates + SSE/JS           │
└────────────────────┬─────────────────────────────┘
                     │ HTTP + SSE
┌────────────────────▼─────────────────────────────┐
│  ROUTES (Flask Blueprints)                        │
│  chat / stream / voice / auth / observability     │
│  historical_campaigns / api_conversations         │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│  DOMAIN (LangGraph)                               │
│  CampaignAgent → AgentBase → StateGraph           │
│  AssistantState (Pydantic v2) · AgentNodes        │
└──────┬──────────────────────────┬────────────────┘
       │ ToolsFacade               │
┌──────▼───────────┐  ┌───────────▼───────────────┐
│  APPLICATION     │  │  INFRASTRUCTURE              │
│  ToolsFacade     │  │  LLMWrapper / LLMFactory     │
│  (legacy @tool)  │  │  RequestsScraper / EmailHandler │
│  OCR service     │  │  ImageWrapper / DataRetrieval │
│  Transcriber     │  │  Adapters: IG, legacy         │
└──────────────────┘  │  DB: SQLAlchemy models       │
                      │  Services: IG client, token  │
                      └──────────────────────────────┘
```

### 4.1 Descripción de Capas

| Capa | Módulos Principales | Responsabilidad |
|---|---|---|
| Routes | `routes/` | HTTP, SSE, autenticación, observabilidad |
| Domain | `domain/` | Grafo LangGraph, estado Pydantic, nodos de decisión |
| Application | `application/` | Fachada legacy @tool, OCR, ASR |
| Infrastructure | `infrastructure/` | LLM, scraping, email, imágenes, BD, adaptadores |
| Ports | `ports/` | Interfaces (Protocol Python) para DI |
| Config | `config/settings.py` | Variables de entorno centralizadas |
| Streaming | `streaming/` | Pipeline SSE: Sink → Middleware → Cola → Cliente |
| Observability | `observability/` | Spans, métricas, recorder (DBRecorder) |

---

## 5. Componentes del Dominio

### 5.1 AssistantState (Pydantic v2)

Estado completo del agente que fluye por el grafo LangGraph:

```
AssistantState:
  # Identidad
  thread_id: Optional[str]
  user_id: Optional[str]
  model_name: str = "gpt-4.1"

  # Conversación
  messages: List[Any]

  # Ingesta / metadata
  attachments: List[Attachment]
  metadata: Dict[str, Any]

  # Flags de flujo
  intro_done: bool
  question_loop_continue: bool
  current_question: Optional[int]
  has_campaign_docs: Optional[bool]
  show_upload_campaigns: Optional[bool]
  sumary_accepted: Optional[bool]

  # Datos de negocio capturados
  email: Optional[str]
  instagram: Optional[str]
  topic: Optional[str]
  products_services: List[Dict]          # scraping del sitio web
  filtered_products_services: List[Dict] # post-filtrado por tema
  campaigns_data: List[Dict]             # desde archivo subido
  repo_campaigns_data: List[Dict]        # desde BD histórica
  ig_campaigns_data: List[Dict]          # desde Instagram
  filtered_campaigns_data: List[Dict]
  ig_filtered_campaigns_data: List[Dict]
  questions: List[str]                   # preguntas dinámicas generadas
  answers: List[str]                     # respuestas del usuario

  # Artefactos generados
  campaign_markdown: Optional[str]
  campaign_json: Optional[Dict]
  images: List[Dict]                     # {title, prompt, img_url}

  # Observabilidad
  last_tool_called: Optional[str]
  interruptions_count: int
  tokens_emitted: int

  # Idempotencia / control de respuesta
  campaign_generated: bool
  campaign_generation_ts: float
  last_campaign_signature: str
  last_response_streamed: bool

  # Auditoría
  created_at: datetime
  updated_at: datetime
```

### 5.2 Nodos del Grafo (CampaignAgent)

| Nodo | Tipo | Descripción |
|---|---|---|
| `introduce` | LLM + streaming | Genera saludo inicial |
| `ask_email` | interrupt | Captura email del usuario |
| `save_email` | validación | Valida formato de email (regex) |
| `ask_ig` | interrupt | Captura cuenta de Instagram |
| `save_ig` | datos | Guarda handle de IG |
| `ask_has_website` | interrupt | Pregunta si tiene sitio web |
| `ask_url` | interrupt | Solicita URL del sitio |
| `process_url` | scraping + LLM | Extrae productos/servicios del sitio |
| `ask_campaign_docs` | interrupt | Pregunta si tiene campañas previas |
| `process_has_campaign_docs` | decisión | Define si se solicita carga documental o se continúa |
| `get_campaigns` | evento/UI | Activa la UI de carga de campañas |
| `ask_upload_campaigns` | interrupt | Solicita el archivo de campañas |
| `process_campaign_docs` | upload + parse | Procesa archivo y carga campañas históricas |
| `ask_topic` | interrupt | Captura tema/objetivo de la campaña |
| `process_topic` | integración + filtrado | Consulta Instagram, filtra datos y dispara OCR posterior |
| `ask_dynamic_question` | LLM + interrupt | Genera preguntas adaptadas |
| `process_dynamic_answer` | decisión | Guarda respuesta y decide continuidad |
| `sumaryze_campaign` | LLM + interrupt | Sintetiza necesidades y espera confirmación |
| `confirm_summary` | decisión | Evalúa si el usuario acepta el resumen |
| `ask_extra_data` | interrupt | Permite agregar más contexto |
| `generate_campaign` | nodo compuesto | Genera campaña, plan, prompts, imágenes y envío de email |
| `finished` | final | Nodo terminal |

**Mecanismo clave:** El grafo usa `interrupt()` de LangGraph para pausar en nodos de pregunta y `Command(resume=...)` para reanudar con el input del usuario. `generate_execution_plan`, `generate_image_prompts`, `generate_images` y `send_email` no son nodos independientes; son pasos internos del nodo `generate_campaign`.

### 5.3 AgentNodes — Clasificadores

Funciones estáticas que evalúan el estado para enrutar condicionales:

- `last_user_content(state)` → extrae respuesta del último mensaje humano.
- `is_url_include(model_name, state)` → regex rápida + fallback LLM.
- `is_affirmative(model_name, state)` → regex por YES_TERMS/NO_TERMS + fallback LLM.
- `should_continue_asking(model_name, state)` → decide si conviene seguir preguntando; usa `LLMWrapper.needs_more_info(...)` como fallback.

---

## 6. Componentes de Infraestructura

### 6.1 LLMFactory

- Crea clientes con `lru_cache`.
- Soporte: `gpt-*` (ChatOpenAI) y `gemini-*` (ChatGoogleGenerativeAI).
- Retry configurado por `LLM_INVOKE_RETRIES`.

### 6.2 LLMWrapper

Contiene todos los prompts del sistema:

| Método | Uso |
|---|---|
| `generate_intro` | Introducción del agente |
| `generate_question`, `ask_generic` | Preguntas estructuradas |
| `generate_comment`, `comment_generic` | Comentarios y transiciones |
| `is_url_include`, `is_affirmative`, `needs_more_info` | Clasificadores |
| `filter_by_topic` | Filtrado semántico |
| `summarize_need` | Síntesis de necesidades |
| `generate_next_question` | Pregunta dinámica adaptada |
| `generate_campaign` | Campaña en Markdown |
| `generate_execution_plan` | Plan de ejecución |
| `generate_image_prompt` | Prompts de imágenes |
| `_execute_prompt` | Núcleo de ejecución con streaming |

**Modo development:** Simula streaming sin consumir tokens de API (`ENVIRONMENT=development`).

### 6.3 Scraping

- **Activo:** `RequestsScraper`, inyectado en `app.py`.
- **Legacy:** `Scrapper`, aún presente en el repositorio pero no en el wiring principal.
- El scraper activo usa Requests + BeautifulSoup4.
- `SCRAPER_MAX_PAGES` tiene default real `20`.
- El enriquecimiento por LLM es opcional mediante `SCRAPER_USE_LLM_ENRICHMENT=false` por defecto.
- Selenium existe como fallback opcional mediante `SCRAPER_USE_SELENIUM_ON_BLOCK=false` por defecto.

### 6.4 EmailHandler

- Envío vía Microsoft Graph API (`/sendMail`).
- Construye HTML que incluye: chat histórico, campaña Markdown renderizada, imágenes.
- Autenticación: Client Credentials OAuth 2.0 (token de cliente, no de usuario).

### 6.5 Generación de Imágenes

| Clase | Modelo | Quality | Fallback |
|---|---|---|---|
| `DallECampaignVisualGenerator` | `dall-e-3` | `standard` | — |
| `GPTCampaignVisualGenerator` | `gpt-image-1` | `high` | DALL-E 3 |

Selección vía `IMAGE_MODEL` env. Generación en paralelo con `ThreadPoolExecutor`.

### 6.6 IGFilterCampaigns (Instagram)

- Implementa `SocialPort`.
- Obtiene medios del perfil de Instagram via `IGApiClient` (Meta Graph API v24.0).
- Aplica filtros: keywords, fechas, tipo de media.
- El OCR posterior de campañas se dispara desde `process_topic`; no lo resuelve directamente `IGFilterCampaigns`.
- Gestión automática de renovación de token (`service_tokens` en BD).

### 6.7 Transcriber (ASR)

- OpenAI: `client.audio.transcriptions.create()` (Whisper).
- Google: `client.files.upload()` + `models.generate_content()`.
- El default actual de `ASR_MODEL` en configuración es inconsistente con ASR (`gpt-4o-mini-tts`) y debe corregirse en despliegue.

---

## 7. Persistencia

### 7.1 Base de Datos

Compatible con SQLite (desarrollo, WAL habilitado) y PostgreSQL 16 (producción).  
URL definida por `DATABASE_URL`.

### 7.2 Modelos ORM (SQLAlchemy)

| Tabla | Descripción |
|---|---|
| `users` | Usuarios: username, password_hash, is_active |
| `conversation_registry` | Último snapshot de estado por thread_id |
| `conversation_history` | Historial completo de snapshots (append-only) |
| `historical_campaigns` | Campañas de referencia (JSONB flexible, esquema dinámico) |
| `service_tokens` | Tokens OAuth externos (Meta/Facebook) |
| `observed_metric` | Métricas del sistema (eventos, duraciones, conteos) |
| `conversation_feedback` | Feedback de usuarios sobre conversaciones |

### 7.3 Estado del Grafo (LangGraph)

- **Checkpointer:** `MemorySaver` (RAM únicamente).
- **Crítico:** El estado del grafo se pierde al reiniciar el proceso.
- La BD almacena snapshots del estado como JSON (no es el checkpointer del grafo).

---

## 8. Flujos de Datos

### 8.1 Flujo SSE completo

```
Cliente (browser)
  ↓ POST /api/stream {thread_id, message, model}
Flask (routes/stream.py)
  ↓ Hilo separado
  ↓ agent.chat_with_memory(selected_model, user_input, thread_id)
AgentBase
  ↓ LangGraph StateGraph.stream()  [Command(resume=user_input)]
CampaignAgent (nodos)
  ↓ _run_tool(ToolsFacade.*) → Tooling → Adapters → APIs externas
  ↓ on_token(delta)
StreamSink (SseSink)
  ↓ ChunkingMiddleware (CHUNKING_MAX_SIZE chars)
  ↓ ObserveMiddleware (métricas por token)
Queue (thread-safe)
  ↓ Response(stream_with_context)
Cliente recibe: data: {"type":"delta","content":"..."}\n\n
              data: {"type":"event","name":"products_services","data":{...}}\n\n
              data: {"type":"done"}\n\n
```

### 8.2 Flujo de Autenticación

```
POST /login → Werkzeug check_password_hash → JWT encode (HS256) 
→ Set-Cookie: access_token (httponly, samesite=Lax)
→ Sliding expiration: renueva si remaining < 15min
→ login_required decorator en todas las rutas protegidas
```

### 8.3 Flujo de Persistencia de Conversación

```
AgentBase.chat_with_memory() al finalizar
→ save_conversation_snapshot(username, thread_id, state_dict)
→ conversation_registry: upsert por thread_id (último estado)
→ conversation_history: insert siempre (historial completo)
```

---

## 9. Variables de Entorno

| Variable | Default | Descripción |
|---|---|---|
| `OPENAI_API_KEY` | — | API Key de OpenAI (obligatoria) |
| `DATABASE_URL` | — | Conexión a BD (obligatoria) |
| `JWT_SECRET` | `dev-secret-change-me` | Secret JWT (cambiar en prod) |
| `JWT_EXPIRES_MINUTES` | `60` | Vigencia del token JWT |
| `APP_ENV` | `dev` | Etiqueta adicional de entorno |
| `ENVIRONMENT` | `""` | `development` simula LLM |
| `PORT` | `8081` | Puerto usado por `python app.py` |
| `LOG_LEVEL` | `INFO` | Nivel de logging |
| `IMAGE_MODEL` | `dall-e-3` | Modelo de generación de imágenes |
| `OCR_MODEL_NAME` | `gpt-4o` | Modelo para OCR |
| `ASR_MODEL` | `gpt-4o-mini-tts` | Default actual, inconsistente para ASR |
| `LLM_INVOKE_RETRIES` | `0` | Default real en `settings.py` |
| `MAX_DYNAMIC_QUESTIONS` | `10` | Máx. preguntas dinámicas |
| `FILTER_BY_TOPIC_MAX_ROWS` | `40` | Máx. filas en filter_by_topic |
| `MAX_IMAGE_GENERATED` | `8` | Máx. imágenes por sesión |
| `CAMPAIGN_VIDEO_OCR_ENABLED` | `false` | OCR en videos de IG |
| `STREAM_CHUNK_SIZE` | `300` | Tamaño de chunk SSE (chars) |
| `UPLOAD_FOLDER` | `./uploads` | Carpeta de uploads |
| `MAX_UPLOAD_MB` | `25` | Máx. tamaño de archivo subido |
| `GOOGLE_API_KEY` | — | API Key de Google (opcional) |
| `SCRAPER_TIMEOUT` | `10` | Timeout por request de scraping |
| `SCRAPER_MAX_BYTES` | `2000000` | Máximo de bytes por página |
| `SCRAPER_MAX_PAGES` | `20` | Máx. páginas del scraper activo |
| `SCRAPER_MAX_LINKS_PER_PAGE` | `25` | Máx. enlaces seguidos por página |
| `SCRAPER_USER_AGENT` | UA por defecto | User-Agent del scraper |
| `SCRAPER_USE_LLM_ENRICHMENT` | `false` | Enriquecimiento LLM opcional |
| `SCRAPER_USE_SELENIUM_ON_BLOCK` | `false` | Fallback Selenium opcional |
| `EMAIL_FROM_EMAIL` | — | Email remitente (MS Graph) |
| `EMAIL_TENANT_ID` | — | Azure AD Tenant ID |
| `EMAIL_CLIENT_ID` | — | Azure App Client ID |
| `EMAIL_CLIENT_SECRET` | — | Azure App Client Secret |
| `FB_APP_ID` | — | ID de App de Meta |
| `FB_APP_SECRET` | — | Secret de App de Meta |
| `IG_CLIENT_ID` | — | Client ID Instagram |
| `IG_USERNAME` | `""` | Referencia de usuario Instagram |
| `FB_GRAPH_BASE_URL` | `https://graph.facebook.com/v24.0` | URL base Graph API |
| `NGROK_AUTHTOKEN` | — | Token de ngrok (opcional) |

### 9.1 Variables de bootstrap y operación auxiliar

| Variable | Ámbito | Descripción |
|---|---|---|
| `FB_TEMP_TOKEN` | bootstrap | Token temporal usado por `devtools/scripts/init_token.py` |
| `IG_USER_ID` | bootstrap | ID numérico usado por el script de inicialización |

---

## 10. Dependencias Externas

| Servicio | Uso | Tipo | Auth |
|---|---|---|---|
| OpenAI API | LLM texto, imágenes, OCR y potencial ASR | Cloud | `OPENAI_API_KEY` |
| Google Generative AI | LLM alternativo (Gemini), ASR alternativo | Cloud | `GOOGLE_API_KEY` |
| Meta Graph API v24.0 | Posts de Instagram | Cloud REST | OAuth token en BD |
| Microsoft Graph API | Envío de email corporativo | Cloud REST | Client credentials |
| PostgreSQL 16 | Base de datos principal | On-premise/Cloud | `DATABASE_URL` |
| ngrok | Túnel público | Cloud | `NGROK_AUTHTOKEN` |

---

## 11. Despliegue

### 11.1 Infraestructura Docker Compose

| Contenedor | Imagen | Puerto |
|---|---|---|
| `flask-app` | `python:3.11-slim` (build local) | 5000 (interno) |
| `nginx` | `nginx:alpine` | 8081:80 (público) |
| `postgres` | `postgres:16` | 5432 |
| `ngrok` | `ngrok/ngrok:latest` | túnel |

### 11.2 Configuración Nginx

- Proxy pass a `flask-app:5000` para todas las rutas.
- Configuración SSE explícita para `/stream` y `/stream_test`.
- `/api/stream` existe en Flask, pero no tiene bloque dedicado en `nginx.conf`; detrás de nginx caerá en `location /`.

### 11.3 Inicialización

```bash
# Base de datos
python -m infrastructure.db.init_db

# Token de Meta (solo una vez)
python devtools/scripts/init_token.py
```

---

## 12. Observabilidad

El sistema tiene un framework de observabilidad propio:

- **`span(name, attrs)`:** Context manager. Emite eventos `.start`, `.end`, `.error` y métrica `.duration_ms`.
- **`record_count(name, value, tags)`:** Contador de métricas numéricas.
- **`@observed` decorator:** Aplicado en nodos del grafo para trazabilidad automática.
- **`DBRecorder`:** Persiste en `observed_metric`. Inyectable via `set_recorder()`.
- **Métricas HTTP:** `http_request.count`, `http_request.duration_ms`, `http_error.count` registrados en cada request.
- **Dashboard:** Ruta `/metrics` con datos de los últimos 7 días.

---

## 13. Riesgos Técnicos

| # | Riesgo | Severidad | Evidencia |
|---|---|---|---|
| R1 | `MemorySaver`: estado del agente solo en RAM | Alta | `agent_base.py` |
| R2 | `JWT_SECRET` inseguro por defecto | Alta | `routes/common.py:8` |
| R3 | Instancia de agente global única (sin multi-tenancy) | Media | `app.py:44` |
| R4 | Selenium: Chromium no instalado en Dockerfile | Media | `scrapper_site.py` |
| R5 | Tokens Meta API con vida finita | Media | `instagram_tool.py` |
| R6 | Sin rate limiting en rutas de streaming | Media | Ausente en `routes/` |
| R7 | Archivos subidos sin escaneo antivirus | Media | `historical_campaigns.py` |
| R8 | Sin headers de seguridad HTTP | Media | Nginx / Flask |
| R9 | OCR de video por defecto deshabilitado | Baja | `settings.py` |
| R10 | `lru_cache` en LLMFactory sin invalidación | Baja | `llm_factory.py` |
| R11 | `ASR_MODEL` default inconsistente para transcripción | Alta | `settings.py` / `transcriber.py` |
| R12 | Bug latente en `infrastructure/facade.py` (`social_x`) | Media | `facade.py` |
| R13 | `/api/stream` sin tuning SSE dedicado en nginx | Media | `nginx.conf` |
| R14 | Credenciales sensibles en `.env` si se versiona | Alta | Hallazgo de auditoría |

---

## 14. Capacidades Actuales

| Capacidad | Estado |
|---|---|
| Chat conversacional con streaming SSE | ✅ Implementado |
| Generación de campaña en Markdown | ✅ Implementado |
| Generación de plan de ejecución | ✅ Implementado |
| Generación de imágenes (DALL-E 3) | ✅ Implementado |
| Envío de email corporativo (MS Graph) | ✅ Implementado |
| Scraping de sitio web | ✅ Implementado (`RequestsScraper`; Selenium solo por flag) |
| Integración Instagram (Meta Graph API) | ✅ Implementado |
| OCR en imágenes de campañas IG | ✅ Implementado (habilitado por flag) |
| OCR en videos de campañas IG | ⚠️ Implementado pero deshabilitado por defecto |
| Transcripción de voz (OpenAI / Gemini) | ⚠️ Implementado, pero requiere corregir `ASR_MODEL` en despliegue |
| Carga de campañas históricas (Excel/CSV) | ✅ Implementado |
| Persistencia de conversaciones en BD | ✅ Implementado (snapshots) |
| Persistencia del estado del grafo | ❌ Solo en RAM (`MemorySaver`) |
| Multi-tenancy | ❌ No implementado |
| Rate limiting | ❌ No implementado |
| RAG sobre campañas históricas | ❌ No implementado |
| Flujo OAuth completo para Meta | ❌ Solo bootstrapping manual |
| Dashboard de observabilidad | ✅ Implementado (últimos 7 días) |

---

## 15. Observaciones Arquitectónicas

1. **Doble fachada:** `application/tools_facade.py` (legacy `@tool`) y `infrastructure/facade.py` (ports/adapters) coexisten. El agente usa la segunda; la primera persiste como dependencia interna de los adaptadores.

2. **`x_tool.py` inactivo:** El adaptador para X (Twitter) existe en `infrastructure/adapters/x_tool.py` pero no se inyecta en `Tooling` en `app.py`. Estado: código latente no activo.

3. **`MemorySaver` como checkpointer:** Esta es la limitación más crítica para producción. LangGraph provee `langgraph-checkpoint-postgres` como reemplazo directo.

4. **Modo development:** `ENVIRONMENT=development` simula los llamados al LLM sin llamar a la API real, útil para desarrollo y testing local sin costo.

5. **Defaults corregidos:** `FILTER_BY_TOPIC_MAX_ROWS` tiene default real `40` y `LLM_INVOKE_RETRIES` tiene default real `0` en `settings.py`.

6. **Agente global único:** La instancia de `CampaignAgent` en `app.extensions["agent"]` es compartida por todos los usuarios. El aislamiento se logra únicamente por `thread_id` y los `RLock` por thread.

7. **Bug de ASR:** El default actual de `ASR_MODEL` (`gpt-4o-mini-tts`) no corresponde a un modelo de transcripción y debe corregirse en la configuración de despliegue.

8. **Bug latente de tooling:** El fallback de `infrastructure/facade.py` usa `social_x` en lugar de `social`; no afecta el flujo principal mientras `configure_tooling()` se ejecute correctamente.

9. **Credenciales operativas:** `FB_TEMP_TOKEN` e `IG_USER_ID` pertenecen al bootstrap de Meta, no al runtime principal. Si existen valores reales en `.env`, deben tratarse como secretos rotables.
