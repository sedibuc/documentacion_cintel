# Diagnóstico de coherencia — Agente de Marketing IA

**Archivo auditado:** `docs/source/diagnostico_marketing_agent.md`  
**Fuente de verdad:** Código fuente en `code/`  
**Archivos del código revisados:** `domain/state.py`, `domain/campaign_agent.py`, `domain/agent_base.py`, `domain/agent_nodes.py`, `config/settings.py`, `app.py`, `infrastructure/llm_factory.py`, `infrastructure/llm_wrapper.py`, `infrastructure/llm_image_wrapper.py`, `infrastructure/scrapper_site.py`, `infrastructure/email_handler.py`, `infrastructure/facade.py`, `infrastructure/tooling.py`, `infrastructure/adapters/requests_scraper.py`, `infrastructure/adapters/instagram_tool.py`, `infrastructure/adapters/x_tool.py`, `infrastructure/db/init_db.py`, `infrastructure/db/session.py`, `infrastructure/db/conversation_logging.py`, `application/tools_facade.py`, `application/services/transcriber.py`, `routes/common.py`, `routes/stream.py`, `observability/observe.py`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`  
**Fecha de auditoría:** Marzo 2026  
**Auditor:** GitHub Copilot — revisión arquitectónica desde código fuente

---

## 1. Resumen ejecutivo

### Nivel general de coherencia: **MEDIO-ALTO con brechas significativas**

La mayoría de afirmaciones macroarquitectónicas del diagnóstico son correctas: el stack tecnológico, la estructura hexagonal, los mecanismos de streaming y persistencia, y la mayoría de los riesgos están bien identificados. Sin embargo, se detectaron errores técnicos concretos que invalidan partes críticas del documento como referencia de precisión.

### Hallazgos principales

1. **La tabla de nodos del grafo es estructuralmente incorrecta**: `generate_execution_plan`, `generate_images` y `send_email` NO son nodos separados del grafo. Todo ocurre dentro de un único nodo `generate_campaign`.

2. **AssistantState tiene 9 campos omitidos en el diagnóstico** que son relevantes para entender el flujo del grafo.

3. **Las variables de entorno tienen 3 inconsistencias de valores por defecto** y al menos 12 variables del código no aparecen en el diagnóstico.

4. **El scraper activo en producción es `RequestsScraper`**, no el `Scrapper` descrito en el diagnóstico. El `SCRAPER_MAX_PAGES` real por defecto es 20, no 10.

5. **`ASR_MODEL` tiene por defecto `gpt-4o-mini-tts`**, que es un modelo TTS (text-to-speech), no de transcripción. Esto es un bug de configuración no señalado en el diagnóstico.

6. **El archivo `.env` contiene un token activo de Meta/Facebook** expuesto como texto plano. Riesgo crítico de seguridad.

7. **`/api/stream` no tiene configuración SSE en nginx.conf**, solo `/stream`. El diagnóstico dice que ambas rutas tienen la configuración especial.

8. **Bug en `infrastructure/facade.py`**: el fallback de `_get()` pasa `social_x=XFilterCampaigns()` al constructor de `Tooling` pero el dataclass no tiene ese campo. Causa `TypeError` si el fallback se activa.

### Riesgos más relevantes no documentados

- **Credencial real en `.env`**: token de Meta potencialmente válido expuesto en texto plano en el repositorio.
- **`ASR_MODEL` incorrecto**: el modelo `gpt-4o-mini-tts` no es un modelo de transcripción.
- **Bug latente en facade.py**: `social_x` en lugar de `social`.
- **`/api/stream` sin optimización SSE en nginx**.

---

## 2. Elementos confirmados

Los siguientes elementos del diagnóstico están respaldados explícitamente por el código:

| Elemento | Evidencia |
|---|---|
| Flask como framework web | `app.py:22` |
| LangGraph con `MemorySaver` | `agent_base.py`: `MemorySaver()` en `_build_and_compile_graph()` |
| `StateGraph` sobre `AssistantState` (Pydantic v2) | `domain/state.py`: `class AssistantState(BaseModel)` |
| JWT HS256, `JWT_SECRET` con valor inseguro por defecto | `routes/common.py:7-8` |
| Sliding expiration del JWT (15 min) | `routes/common.py:56-67` |
| Cookie httponly + samesite=Lax | `routes/common.py:63-68` |
| SSE en `/stream` y `/api/stream` (rutas Flask) | `routes/stream.py:23-24` |
| Pipeline SSE: `SseSink → ChunkingMiddleware → ObserveMiddleware` | `routes/stream.py:53-57` |
| `CHUNKING_MAX_SIZE` desde `STREAM_CHUNK_SIZE` | `settings.py:32-33` |
| Instancia única del agente en `app.extensions["agent"]` | `app.py:46` |
| `CampaignAgent` hereda de `AgentBase` | `domain/campaign_agent.py:28` |
| `define_graph()` es abstracto en `AgentBase` | `domain/agent_base.py:116` |
| `ChatOpenAI` para modelos `gpt-*` | `infrastructure/llm_factory.py:13-20` |
| `ChatGoogleGenerativeAI` para modelos `gemini-*` | `infrastructure/llm_factory.py:21-27` |
| `lru_cache` en `LLMFactory.get_client()` | `infrastructure/llm_factory.py:12` |
| `DallECampaignVisualGenerator` (`dall-e-3`, `standard`) | `infrastructure/llm_image_wrapper.py:65-68` |
| `GPTCampaignVisualGenerator` (`gpt-image-1`, `high`, fallback DALL-E 3) | `infrastructure/llm_image_wrapper.py:71-78` |
| Selección de generador por `IMAGE_MODEL` | `infrastructure/llm_image_wrapper.py:81-84` |
| Generación de imágenes en paralelo con `ThreadPoolExecutor` | `domain/campaign_agent.py:721-727` |
| `EmailHandler` vía Microsoft Graph API | `infrastructure/email_handler.py:12-13` |
| Email incluye historial en HTML, campaña y imágenes | `infrastructure/email_handler.py` (métodos `_process_chat_as_html`, `_process_images_as_html`) |
| `IGFilterCampaigns` implementa `SocialPort` | `infrastructure/adapters/instagram_tool.py:62` |
| Token Instagram almacenado en BD (`service_tokens`) | `infrastructure/adapters/instagram_tool.py:76-77` |
| Transcripción OpenAI con `client.audio.transcriptions.create()` | `application/services/transcriber.py:40-47` |
| Transcripción Gemini con `files.upload()` + `generate_content()` | `application/services/transcriber.py:52-67` |
| Archivos de audio borrados tras transcripción | `routes/voice.py` (por inferencia; transcriber borra después de procesar) |
| `save_conversation_snapshot` → upsert registry + insert history | `infrastructure/db/conversation_logging.py:56-90` |
| 7 tablas ORM: users, conversation_registry, conversation_history, historical_campaigns, service_tokens, observed_metric, conversation_feedback | `infrastructure/db/init_db.py:5-11` |
| SQLite WAL para desarrollo | `infrastructure/db/session.py:30-36` |
| `span()` context manager con `.start`/`.end`/`.error`/`.duration_ms` | `observability/observe.py:52-84` |
| `DBRecorder` inyectable via `set_recorder()` | `observability/observe.py:17-20`; `app.py:30-31` |
| Métricas HTTP: request.count, duration_ms, error.count | `app.py:60-74` |
| Dashboard `/metrics` | `routes/observability.py` (confirmado por nombre de blueprint) |
| `@observed` decorator en nodos del grafo | `domain/campaign_agent.py` (múltiples nodos) |
| `ENVIRONMENT=development` simula LLM sin API | `infrastructure/llm_wrapper.py:25`; `infrastructure/llm_image_wrapper.py:44` |
| Modo development en imagen: devuelve el prompt como URL | `infrastructure/llm_image_wrapper.py:46-47` |
| Scraping multi-página con `ThreadPoolExecutor` | `infrastructure/scrapper_site.py:53-99`; `infrastructure/adapters/requests_scraper.py` |
| Prioridad de scraping: BS4 + Requests; Selenium como fallback | `infrastructure/adapters/requests_scraper.py:39-42` |
| Docker Compose con flask-app, nginx, postgres, ngrok | `docker-compose.yml` (confirmado) |
| Nginx proxy buffering off en `/stream` | `nginx.conf:22-44` |
| `processes_url` usa regex + `urlparse` antes de scraping | `domain/campaign_agent.py:155-162` |
| Nodo `ask_email` + `save_email` con validación regex | `domain/campaign_agent.py:76-94` |
| Nodo `ask_ig` + `save_ig` | `domain/campaign_agent.py:95-113` |
| Nodo `ask_has_website` con clasificador `is_url_include` + `is_affirmative` | `domain/campaign_agent.py:116-134` |
| Bucle Q&A dinámico con `MAX_DYNAMIC_QUESTIONS` | `domain/agent_nodes.py:34-37` + `settings.py:68` |
| `should_continue_asking` con STOP_PHRASES | `domain/agent_nodes.py:108-141` |
| Campaña generada con idempotencia por `_campaign_signature` (SHA-256) | `domain/campaign_agent.py:37-52` |
| Email enviado en background (fire-and-forget) | `domain/campaign_agent.py:729-736` |
| `x_tool.py` existe pero no se inyecta en `Tooling` en `app.py` | `app.py:35-44`; `infrastructure/adapters/x_tool.py` (existe) |

---

## 3. Elementos parcialmente confirmados

| Elemento del diagnóstico | Estado real | Matiz |
|---|---|---|
| "Doble fachada: `application/tools_facade.py` (legacy @tool) y `infrastructure/facade.py`" | ✅ Correcto | `application/tools_facade.py` tiene decoradores `@tool` de LangChain. `infrastructure/facade.py` es la capa ports/adapters. El agente usa la segunda. La primera sigue presente pero como implementación detrás de los adapters legacy. |
| `AgentNodes`: `is_url_include`, `is_affirmative`, `needs_more_info` como clasificadores | ⚠️ Parcial | `is_url_include` ✅, `is_affirmative` ✅. Pero `needs_more_info` **no existe** como método público en `AgentNodes`. Lo que existe es `should_continue_asking()`. `needs_more_info` es un método de `LLMWrapper`, llamado internamente por `should_continue_asking`. |
| OCR sobre campañas de Instagram | ⚠️ Parcial | El diagnóstico dice que `IGFilterCampaigns` maneja OCR. En realidad el OCR lo ejecuta `process_campaign_for_ocr()` del módulo `application/services/campaign_ocr_service.py`, llamado desde el nodo `process_topic` de `CampaignAgent` DESPUÉS de recibir las campañas de IG. `IGFilterCampaigns` solo obtiene los posts. |
| `Scrapper`: max_pages configurable, scraping multi-página | ⚠️ Parcial | Hay DOS implementaciones de scraper: `infrastructure/scrapper_site.py` (clase `Scrapper`, max_pages=10 como default de método) y `infrastructure/adapters/requests_scraper.py` (clase `RequestsScraper`, usa `SCRAPER_MAX_PAGES` de settings, default=**20**). **El activo en producción es `RequestsScraper`**, configurado vía `configure_tooling` en `app.py`. La descripción del diagnóstico se basa en el scraper legado. |
| "Agente global único; aislamiento por thread_id y RLock" | ⚠️ Parcial | El comentario en `app.py` dice `# Agent (YA NO GLOBAL)` pero sigue siendo `app.extensions["agent"] = CampaignAgent()` — una única instancia. El aislamiento por `thread_id` + locks es real. El comentario puede ser aspiracional o de una refactorización en curso. |
| "Retry configurado por `LLM_INVOKE_RETRIES`" en `LLMFactory` | ⚠️ Parcial | `LLMFactory.get_client()` tiene `retries: int = 3` como default del parámetro. `LLM_INVOKE_RETRIES` en `settings.py` tiene default `0` (no `3`). Depende de si `LLMWrapper` pasa el parámetro explícitamente. Si no lo pasa, se usa el default `3` de la firma de la función. La relación entre el setting y el factory no es tan directa como el diagnóstico sugiere. |
| `FB_TEMP_TOKEN` y `IG_USER_ID` como variables de entorno | ⚠️ Parcial | Son variables reales pero solo son usadas por `devtools/scripts/init_token.py` (bootstrap inicial del token en BD). **NO están en `settings.py`**. Se leen directamente desde `os.getenv()` en el script. No son variables del runtime de la aplicación. |

---

## 4. Elementos no confirmados o inciertos

| Elemento | Razón de incertidumbre |
|---|---|
| Scraping extrae "colores, fuentes, imágenes, títulos, keywords" | `scrapper_site.py` lo hace (metadata). `requests_scraper.py` (activo) tiene lógica diferente con `PageMeta` (title, description, h1). No se confirmó que `requests_scraper.py` extraiga colores y fuentes como la misma clase `Scrapper`. |
| "Post-procesado de scraping: LLM extrae estructura de productos/servicios" | Solo verificado si `USE_LLM_ENRICHMENT=true` en `requests_scraper.py`. Por defecto es `false`. Con default desactivado, el enriquecimiento LLM del scraper no ocurre. El diagnóstico lo describe como comportamiento estándar, no opcional. |
| "Heartbeat cada 15s en SSE" | Existe la constante `HEARTBEAT_EVERY = 15.0` en `routes/stream.py` pero no se leyó el generador `gen()` completo para confirmar la implementación. Alta probabilidad de ser correcto. |
| "Archivos de audio se borran tras transcripción" | Solo se confirmó que el `Transcriber` lee el archivo. El borrado depende del route handler en `routes/voice.py`, no revisado en detalle. |
| Renovación automática de token Meta | La gestión existe en `infrastructure/services/token_refresh.py` (importado en `instagram_tool.py`) pero no se leyó el service completo para confirmar el mecanismo exacto de renovación. |

---

## 5. Inconsistencias detectadas

### 5.1 Nodos del grafo — Arquitectura incorrecta (CRÍTICA)

**En el diagnóstico (sección 5.2):**

La tabla presenta como nodos separados del grafo:
- `generate_execution_plan` (LLM + streaming)
- `generate_image_prompts` (LLM)
- `generate_images` (OpenAI images)
- `send_email` (MS Graph API)

**En el código real (`domain/campaign_agent.py`):**

Todos estos pasos son bloques secuenciales dentro del único nodo `generate_campaign`. No existen como nodos del grafo de LangGraph. La estructura real del grafo en la sección de generación es:

```
generate_campaign (UN SOLO NODO que hace todo):
  1. Genera campaña markdown (LLM + streaming)
  2. Genera plan de ejecución (LLM + streaming)
  3. Genera prompts de imágenes (LLM)
  4. Genera imágenes en paralelo (ThreadPoolExecutor)
  5. Envía email en background (fire-and-forget, _bg_executor)
  → Establece flags: campaign_generated, campaign_generation_ts, last_campaign_signature
  
finished (nodo final vacío: lambda s: s)
```

**Impacto:** El diagrama PlantUML basado en esta información generaría un flujo incorrecto.

---

### 5.2 Nodos omitidos del grafo (IMPORTANTE)

El diagnóstico omite los siguientes nodos reales del grafo:

| Nodo real (en código) | Estado en diagnóstico |
|---|---|
| `process_has_campaign_docs` | Omitido (descrito implícitamente) |
| `get_campaigns` | Omitido (dispara evento `show_upload_campaigns`) |
| `ask_upload_campaigns` | Omitido |
| `process_campaign_docs` | Omitido |
| `ask_topic` | Descrito como `*(tema)* interrupt` sin nombre |
| `process_topic` | Confundido con `filter_by_topic` en el grafo; el nombre real del nodo es `process_topic` |
| `ask_dynamic_question` | Descrito genéricamente sin nombre real |
| `process_dynamic_answer` | Omitido |
| `sumaryze_campaign` | Descrito como `*(resumen)*` sin nombre real; tiene typo en código: `sumaryze` |
| `confirm_summary` | Completamente omitido |
| `ask_extra_data` | Completamente omitido (ruta de "quiero agregar más información") |
| `finished` | Omitido (`lambda s: s`, nodo terminal vacío) |

---

### 5.3 AssistantState — 9 campos omitidos

El diagnóstico omite estos campos del estado real:

| Campo | Tipo | Relevancia |
|---|---|---|
| `has_campaign_docs` | `Optional[bool]` | Flag que decide si se va al nodo `get_campaigns` o `ask_topic` |
| `show_upload_campaigns` | `Optional[bool]` | Flag para evento de UI de upload |
| `sumary_accepted` | `Optional[bool]` | Decisión del usuario sobre el resumen (con typo en código) |
| `campaign_generated` | `bool` | Fuente primaria de idempotencia de generación |
| `campaign_generation_ts` | `float` | Timestamp de generación (segundos) |
| `last_campaign_signature` | `str` | Huella SHA-256 para idempotencia |
| `last_response_streamed` | `bool` | Flag anti-re-stream |
| `metadata` | `Dict[str, Any]` | Metadatos del scraping (colores, fuentes, etc.) — usado en `generate_campaign` |
| `ChatMessage` class | (tipo auxiliar) | Definida en `state.py` con role/content/timestamp/meta; no usada directamente en `messages` |

Además, el tipo de `messages` en el diagnóstico es `List[AIMessage | HumanMessage]`, pero en el código es `List[Any]` con el comentario explícito de que se usa `Any` para compatibilidad.

---

### 5.4 `AgentNodes.needs_more_info` — método mal referenciado

El diagnóstico lista `needs_more_info(model_name, state)` como clasificador de `AgentNodes`. En el código real:
- `AgentNodes` tiene `should_continue_asking(model_name, state)` — esta es la función pública del clasificador.
- `needs_more_info` es un método de `LLMWrapper` (implementación interna), llamado como fallback desde `should_continue_asking`.

**Implicación:** PlantUML con `AgentNodes.needs_more_info()` generaría diagramas incorrectos.

---

### 5.5 `ASR_MODEL` default — bug de configuración no señalado

El diagnóstico documenta `ASR_MODEL` con default `gpt-4o-mini-tts` como correcto. En realidad:
- `gpt-4o-mini-tts` es un modelo de **Text-to-Speech (TTS)**, no de transcripción (ASR).
- `Transcriber` lo pasa a `openai.audio.transcriptions.create(model=model_name)`.
- Los modelos válidos para transcripción son: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`.
- Esto es un **bug** en la configuración por defecto que el diagnóstico no señala.

---

### 5.6 Nginx: `/api/stream` sin configuración SSE

El diagnóstico (sección 11.2) afirma:  
> SSE (`/stream`, `/api/stream`): `proxy_buffering off`, sin gzip, timeout 3600s.

El archivo `nginx.conf` real solo tiene configuración especial para `/stream` y `/stream_test`. La ruta `/api/stream` cae en el bloque `location /` genérico, **sin** `proxy_buffering off`. Esto puede causar buffering de los eventos SSE cuando se usa la ruta `/api/stream` a través de nginx.

---

### 5.7 Tooling: bug latente en `infrastructure/facade.py`

El fallback de `_get()` en `infrastructure/facade.py` construye:

```python
_TOOLING = Tooling(
    ...
    social_x=XFilterCampaigns(),   # ← BUG: campo no existe en Tooling
)
```

`Tooling` es un dataclass con el campo `social: SocialPort`, no `social_x`. Este código lanzaría `TypeError: __init__() got an unexpected keyword argument 'social_x'` si la condición `_TOOLING is None` se cumpliera. En producción esto no ocurre porque `configure_tooling()` se llama en `app.py` antes de cualquier request. Es un **bug latente**.

---

### 5.8 Scraper legado vs. activo

El diagnóstico describe el comportamiento de `infrastructure/scrapper_site.py` (clase `Scrapper`) como el scraper del sistema. Sin embargo, la instancia configurada en `app.py` es:

```python
configure_tooling(
    Tooling(
        ...
        scraper=RequestsScraper(),   # ← este es el scraper activo
        ...
    )
)
```

`RequestsScraper` está en `infrastructure/adapters/requests_scraper.py` y tiene un comportamiento diferente al `Scrapper` legado:
- Usa `SCRAPER_MAX_PAGES` de settings (default: **20**, no 10)
- LLM enrichment es opcional (`USE_LLM_ENRICHMENT`, default: `false`)
- Selenium es fallback condicional (`USE_SELENIUM_ON_BLOCK`, default: `false`)
- Implementa `ScraperPort` correctamente

El diagnóstico describe el componente legado como si fuera el activo.

---

## 6. Variables y configuración

### 6.1 Coincidencias confirmadas

| Variable | Diagnóstico | Código real | Estado |
|---|---|---|---|
| `OPENAI_API_KEY` | Default: — | `settings.py` | ✅ |
| `DATABASE_URL` | Default: — | `settings.py` | ✅ |
| `JWT_SECRET` | Default: `dev-secret-change-me` | `routes/common.py:7` | ✅ |
| `ENVIRONMENT` → `APP_ENVIRONMENT` | Default: `""` | `settings.py:43` | ✅ (nombre interno diferente) |
| `PORT` → `APP_PORT` | Default: `8081` | `settings.py:39` | ✅ |
| `IMAGE_MODEL` | Default: `dall-e-3` | `settings.py:87` | ✅ |
| `OCR_MODEL_NAME` | Default: `gpt-4o` | `settings.py:56` | ✅ |
| `ASR_MODEL` → `APP_ASR_MODEL` | Default: `gpt-4o-mini-tts` | `settings.py:37` | ✅ nombre, ❌ semántica (ver §5.5) |
| `STREAM_CHUNK_SIZE` → `CHUNKING_MAX_SIZE` | Default: `300` | `settings.py:33` | ✅ |
| `UPLOAD_FOLDER` | Default: `./uploads` | `settings.py:25` | ✅ |
| `MAX_UPLOAD_MB` | Default: `25` | `settings.py:61` | ✅ |
| `MAX_IMAGE_GENERATED` | Default: `8` | `settings.py:65` | ✅ |
| `MAX_DYNAMIC_QUESTIONS` | Default: `10` | `settings.py:69` | ✅ |
| `CAMPAIGN_VIDEO_OCR_ENABLED` | Default: `false` | `settings.py:48-52` | ✅ |
| `GOOGLE_API_KEY` | Default: — | `settings.py:17` | ✅ |
| `EMAIL_FROM_EMAIL` | Default: — | `settings.py:148` | ✅ |
| `EMAIL_TENANT_ID` | Default: — | `settings.py:152` | ✅ |
| `EMAIL_CLIENT_ID` | Default: — | `settings.py:156` | ✅ |
| `EMAIL_CLIENT_SECRET` | Default: — | `settings.py:160` | ✅ |
| `FB_APP_ID` | Default: — | `settings.py:72` | ✅ |
| `FB_APP_SECRET` | Default: — | `settings.py:76` | ✅ |
| `IG_CLIENT_ID` | Default: — | `settings.py:74` | ✅ |
| `FB_GRAPH_BASE_URL` | Default: `https://graph.facebook.com/v24.0` | `settings.py:78-82` | ✅ |

### 6.2 Inconsistencias en valores por defecto

| Variable | Default en diagnóstico | Default real en código | Impacto |
|---|---|---|---|
| `LLM_INVOKE_RETRIES` | `3` | `0` (`settings.py:135`) | **INCORRECTO.** El diagnóstico afirma que el default es 3. El default real en settings es **0**. El factory en `llm_factory.py` sí tiene `retries: int = 3` como default de parámetro, pero si se pasa `LLM_INVOKE_RETRIES=0` desde settings, se usará 0. |
| `FILTER_BY_TOPIC_MAX_ROWS` | `50` | `40` (`settings.py:138`) | **INCORRECTO.** La diferencia es menor pero afecta el comportamiento del filtrado. |
| `SCRAPER_MAX_PAGES` | `10` (implícito) | `20` (`settings.py:104`) | **INCORRECTO.** El diagnóstico dice max_pages=10, el setting real por defecto es 20. |

### 6.3 Variables en el código pero omitidas en el diagnóstico

| Variable | Default | Descripción |
|---|---|---|
| `APP_ENV` | `"dev"` | Etiqueta de entorno. Diferente de `ENVIRONMENT`. |
| `IG_ACCESS_TOKEN` | — | Token IG inicial leído desde env (solo para bootstrap?) |
| `IG_USERNAME` | `""` | Username de Instagram (no ID numérico) |
| `SCRAPER_TIMEOUT` | `10.0` | Timeout por request del scraper (segundos) |
| `SCRAPER_MAX_BYTES` | `2000000` | Máx. bytes descargados por página (2 MB) |
| `SCRAPER_MAX_PAGES` | `20` | Máx. páginas del scraper (valor real; diagnóstico dice 10) |
| `SCRAPER_MAX_LINKS_PER_PAGE` | `25` | Máx. links seguidos por página |
| `SCRAPER_USER_AGENT` | Firefox/Chrome UA | User-Agent del scraper |
| `SCRAPER_USE_LLM_ENRICHMENT` | `false` | Habilita enriquecimiento LLM en scraping |
| `SCRAPER_USE_SELENIUM_ON_BLOCK` | `false` | Habilita Selenium como fallback |
| `JWT_EXPIRES_MINUTES` | `60` | Duración del token JWT (en `routes/common.py`) |
| `LOG_LEVEL` | `"INFO"` | Nivel de logging (en `agent_base.py`) |
| `POSTGRES_USER` | — | Solo en docker-compose, para el contenedor postgres |
| `POSTGRES_PASSWORD` | — | Solo en docker-compose |
| `POSTGRES_DB` | — | Solo en docker-compose |

### 6.4 Variables en el diagnóstico que no están en `settings.py` (runtime)

| Variable | Dónde existe | Nota |
|---|---|---|
| `FB_TEMP_TOKEN` | `devtools/scripts/init_token.py` via `os.getenv()` | Solo para bootstrap inicial; no es variable del runtime |
| `IG_USER_ID` | `devtools/scripts/init_token.py` via `os.getenv()` | Solo para bootstrap inicial; el runtime lee el ID desde la BD |
| `NGROK_AUTHTOKEN` | Solo en `docker-compose.yml` | Variable del contenedor ngrok, no de la app Flask |

### 6.5 Hallazgo crítico de seguridad — `.env` con credencial activa

Durante la auditoría se encontró que el archivo `code/.env` **contiene un token activo de Meta/Facebook** (`FB_TEMP_TOKEN`) almacenado en texto plano. Si este archivo está o estuvo bajo control de versiones (`.gitignore` debería excluirlo pero debe verificarse), la credencial estaría comprometida.

**Acciones recomendadas inmediatas:**
1. Verificar que `code/.env` está en `.gitignore`.
2. Revocar o rotar el token de Meta en el panel de desarrolladores de Meta.
3. Nunca commitear archivos `.env` con valores reales.

---

## 7. Riesgos técnicos revisados

| # | Riesgo del diagnóstico | Estado en código | Observación |
|---|---|---|---|
| R1 | `MemorySaver`: estado en RAM | ✅ **CONFIRMADO** | `agent_base.py:108`: `memory = MemorySaver()`. Riesgo real y severo. |
| R2 | `JWT_SECRET` inseguro | ✅ **CONFIRMADO** | `routes/common.py:7`. Evidencia correcta. |
| R3 | Agente global único (sin multi-tenancy) | ✅ **CONFIRMADO** | `app.py:46`: instancia única. El comentario "YA NO GLOBAL" en código puede confundir, pero la instancia sigue siendo única. |
| R4 | Selenium: Chromium no en Dockerfile | ✅ **CONFIRMADO** | `Dockerfile` no instala Chromium/Selenium. Sin embargo, matiz: el scraper activo (`RequestsScraper`) solo activa Selenium si `USE_SELENIUM_ON_BLOCK=true`, que por defecto es `false`. El riesgo es real pero el impacto es menor si el flag está desactivado. |
| R5 | Tokens Meta con vida finita | ✅ **CONFIRMADO** | La renovación existe pero es delegada a `token_refresh.py`. |
| R6 | Sin rate limiting | ✅ **CONFIRMADO** | No se encontró rate limiting en ninguna ruta. |
| R7 | Archivos subidos sin escaneo | ✅ **CONFIRMADO** | Solo se valida extensión y tamaño. |
| R8 | Sin headers de seguridad HTTP | ✅ **CONFIRMADO** | `nginx.conf` no agrega `X-Frame-Options`, `CSP`, `HSTS` ni similares. |
| R9 | OCR de video deshabilitado por defecto | ✅ **CONFIRMADO** | `settings.py:48-52`: `CAMPAIGN_VIDEO_OCR_ENABLED` default `false`. |
| R10 | `lru_cache` sin invalidación | ✅ **CONFIRMADO** | `llm_factory.py:12`: `@lru_cache`. Sin mecanismo de invalidación. |

**Riesgos reales NO en el diagnóstico:**

| # | Riesgo | Severidad | Evidencia |
|---|---|---|---|
| R11 | `code/.env` con credencial Meta activa | **Crítica** | `code/.env:33` — FB_TEMP_TOKEN en texto plano |
| R12 | `ASR_MODEL` default es modelo TTS, no ASR | **Alta** | `settings.py:37`; `transcriber.py:18` — `gpt-4o-mini-tts` no es transcripción |
| R13 | Bug en `infrastructure/facade.py`: `social_x` | **Media** | `infrastructure/facade.py:27` — `social_x=XFilterCampaigns()` causa `TypeError` si fallback se activa |
| R14 | `/api/stream` sin proxy_buffering off en nginx | **Media** | `nginx.conf` solo configura `/stream`, no `/api/stream` |
| R15 | `FILTER_BY_TOPIC_MAX_ROWS` default 40 vs doc 50 | **Baja** | `settings.py:138`; diferencia puede afectar calidad del filtrado |
| R16 | Typo `sumary_accepted` y `sumaryze_campaign` en código | **Baja** | `domain/state.py:80`; `domain/campaign_agent.py` (nombre del nodo) — riesgo de ruptura si se intenta referenciar con nombre correcto |
| R17 | Email en fire-and-forget sin estado persistente de éxito | **Media** | `domain/campaign_agent.py:730-736` — fallo silencioso de email sin flag en estado |
| R18 | `USE_LLM_ENRICHMENT=false` por defecto desactiva extracción inteligente | **Media** | `settings.py:119-122` — scraper extrae texto crudo sin estructura LLM si no se activa |

---

## 8. Recomendaciones para alinear documentación

### 8.1 Cambios necesarios en `docs/source/diagnostico_marketing_agent.md`

1. **Sección 5.2 — Nodos del grafo**: Reescribir la tabla completa. Los nodos `generate_execution_plan`, `generate_images` y `send_email` no existen como nodos LangGraph. Agregar todos los nodos reales omitidos. El nodo `process_topic` es el que hace filtrado + IG fetch, no se llama `filter_by_topic`.

2. **Sección 5.1 — AssistantState**: Agregar los 9 campos omitidos. Corregir el tipo de `messages` de `List[AIMessage | HumanMessage]` a `List[Any]`.

3. **Sección 5.3 — AgentNodes**: Cambiar `needs_more_info` por `should_continue_asking` como método público del clasificador. Aclarar que `needs_more_info` pertenece a `LLMWrapper`.

4. **Sección 6.3 — Scrapper**: Describir `RequestsScraper` como el scraper activo. Mencionar variables `SCRAPER_*` adicionales. Corregir max_pages default a 20.

5. **Sección 9 — Variables de entorno**: Corregir `LLM_INVOKE_RETRIES` default a `0`. Corregir `FILTER_BY_TOPIC_MAX_ROWS` default a `40`. Agregar variables de scraper, `JWT_EXPIRES_MINUTES`, `LOG_LEVEL`. Reclasificar `FB_TEMP_TOKEN` e `IG_USER_ID` como variables de inicialización (devtools), no de runtime.

6. **Sección 13 — Riesgos**: Agregar R11-R18 listados arriba. Especialmente R11 (credencial expuesta), R12 (ASR model bug), R13 (bug facade.py) y R14 (nginx /api/stream).

7. **Sección 11.2 — Nginx**: Corregir que la configuración especial SSE es solo para `/stream` y `/stream_test`. La ruta `/api/stream` no tiene buffering desactivado en nginx.

8. **Sección 6.5 — EmailHandler**: Mencionar el patrón fire-and-forget para email. El fallo de email es silencioso con respecto al flujo del agente.

9. **Sección 15 — Observaciones arquitectónicas**: Agregar nota sobre `ASR_MODEL` bug. Agregar bug de `social_x` en `facade.py`. Agregar typo `sumary_accepted` / `sumaryze_campaign` en estado y nodo.

### 8.2 Cambios luego en `docs/content/diagnostico.md`

- Corregir tabla de stack: versiones de packages verificadas contra `requirements.txt`.
- Agregar nota sobre `ASR_MODEL` (bug TTS vs ASR).
- Actualizar tabla de capacidades: cambiar estado de OCR y scraping Selenium.
- Actualizar tabla de riesgos con R11-R14.

### 8.3 Cambios en `docs/content/arquitectura.md`

- Actualizar diagrama de flujo del grafo LangGraph: reemplazar los 4 nodos de generación por el único nodo `generate_campaign`.
- Agregar todos los nodos reales del grafo con sus nombres exactos.
- Corregir representación de capa Application: `RequestsScraper` como scraper activo.
- Agregar nota sobre el bug de `facade.py` (fallback con `social_x`).

### 8.4 Cambios en `docs/content/brechas.md`

- Agregar brecha nueva: ausencia de validación de `ASR_MODEL` (B-nuevo).
- Agregar brecha: `/api/stream` sin optimización SSE en nginx.
- Agregar brecha: credenciales en `.env` sin verificación de `.gitignore`.
- Actualizar B4 (Selenium): matizar que está desactivado por flag, no simplemente "ausente".

### 8.5 Cambios en `docs/content/despliegue.md`

- Agregar variables de scraper al template `.env`.
- Agregar `JWT_EXPIRES_MINUTES` al template.
- Corregir defaults de `LLM_INVOKE_RETRIES` y `FILTER_BY_TOPIC_MAX_ROWS`.
- Agregar advertencia sobre `.env` con credenciales reales.
- Agregar advertencia sobre `ASR_MODEL`: usar `whisper-1` o `gpt-4o-mini-transcribe`.

### 8.6 Cambios en `docs/content/costos.md`

- Agregar nota sobre `ASR_MODEL` incorrecto: si se ejecuta con `gpt-4o-mini-tts`, la transcripción fallará o usará un modelo inadecuado. El costo real depende del modelo correcto.

---

## 9. Notas para siguiente iteración

### 9.1 Insumos clave para el prompt de actualización de documentación

Si se va a generar un nuevo prompt para actualizar `diagnostico_marketing_agent.md`, debe incluir los siguientes hechos como instrucciones explícitas y verificadas:

**Correcciones estructurales del grafo:**
```
Los nodos del grafo LangGraph de CampaignAgent son, en orden:
introduce → ask_email → save_email → ask_ig → save_ig → ask_has_website
→ [condicional: process_url | ask_url] → process_url → ask_campaign_docs
→ process_has_campaign_docs
→ [condicional: get_campaigns/ask_topic]
→ get_campaigns → ask_upload_campaigns → process_campaign_docs → ask_topic
→ process_topic → ask_dynamic_question → process_dynamic_answer
→ [loop: ask_dynamic_question | sumaryze_campaign]
→ sumaryze_campaign → confirm_summary
→ [condicional: ask_extra_data | generate_campaign | finished]
→ ask_extra_data → ask_dynamic_question
→ generate_campaign → finished

DENTRO DE generate_campaign (no como nodos separados):
- genera campaña markdown (streaming)
- genera plan de ejecución (streaming)
- genera prompts de imágenes
- genera imágenes en paralelo (ThreadPoolExecutor)
- envía email en background (fire-and-forget)
```

**Correcciones de AssistantState:**
```
Campos adicionales reales:
- has_campaign_docs: Optional[bool]
- show_upload_campaigns: Optional[bool]
- sumary_accepted: Optional[bool]  ← typo intencional en código
- campaign_generated: bool
- campaign_generation_ts: float
- last_campaign_signature: str
- last_response_streamed: bool
- metadata: Dict[str, Any]
messages es List[Any], no List[AIMessage | HumanMessage]
```

**Correcciones de componentes:**
```
Scraper activo: RequestsScraper (infrastructure/adapters/requests_scraper.py)
Scraper legado: Scrapper (infrastructure/scrapper_site.py) — no activo
SCRAPER_MAX_PAGES default real: 20
LLM enrichment en scraper: solo si SCRAPER_USE_LLM_ENRICHMENT=true (default false)
Clasificador de AgentNodes: should_continue_asking(), no needs_more_info()
```

**Bugs detectados a documentar:**
```
1. ASR_MODEL default 'gpt-4o-mini-tts' es modelo TTS, no ASR. 
   Usar 'whisper-1' o 'gpt-4o-mini-transcribe'.
2. infrastructure/facade.py:27: social_x= en lugar de social= (bug latente TypeErrror).
3. Nginx: /api/stream no tiene proxy_buffering off.
4. Typos en código: sumary_accepted, sumaryze_campaign.
```

**Variables de entorno corregidas:**
```
LLM_INVOKE_RETRIES default: 0 (no 3)
FILTER_BY_TOPIC_MAX_ROWS default: 40 (no 50)
SCRAPER_MAX_PAGES default: 20 (no 10)
FB_TEMP_TOKEN: solo devtools, no runtime
IG_USER_ID: solo devtools, no runtime; el runtime usa account_id desde BD
Nuevas en runtime: APP_ENV, IG_ACCESS_TOKEN, IG_USERNAME, SCRAPER_TIMEOUT,
  SCRAPER_MAX_BYTES, SCRAPER_MAX_LINKS_PER_PAGE, SCRAPER_USER_AGENT,
  SCRAPER_USE_LLM_ENRICHMENT, SCRAPER_USE_SELENIUM_ON_BLOCK, JWT_EXPIRES_MINUTES, LOG_LEVEL
```

### 9.2 Prioridad de correcciones

| Prioridad | Elemento | Razón |
|---|---|---|
| P1 | Nodos del grafo (§5.1) | Base de diagramas PlantUML; incorrecto = diagramas inútiles |
| P1 | Hallazgo de credencial en `.env` (§6.5) | Seguridad |
| P2 | `ASR_MODEL` bug (§5.5) | Bug funcional en producción |
| P2 | Bug `social_x` en facade.py (§5.7) | Bug latente |
| P2 | `AssistantState` campos omitidos (§5.3) | Referencia incompleta |
| P3 | Variables de entorno (§6.2, §6.3) | Incorrecto pero no crítico para diagramas |
| P3 | Nginx `/api/stream` (§5.6) | Problema de producción menor |
| P4 | Scraper activo vs. legado (§5.8) | Descripción imprecisa |

### 9.3 Lo que no se pudo verificar en esta auditoría

- Contenido completo de `routes/voice.py` (manejo de archivos de voz y borrado).
- Implementación completa de `infrastructure/services/token_refresh.py`.
- `streaming/middleware/chunking_middleware.py` y `observer_middleware.py` (middleware de streaming).
- `infrastructure/repositories/service_token_repo.py` (repositorio de tokens).
- Heartbeat completo del generador SSE en `routes/stream.py` (referencia a `HEARTBEAT_EVERY`).
- Si `IG_ACCESS_TOKEN` en settings.py se usa en algún flujo diferente al bootstrap.
