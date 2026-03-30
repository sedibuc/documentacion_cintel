# Diagnóstico de coherencia entre documentación y código

> **Fecha de auditoría:** 2026-03-29  
> **Alcance:** Archivos en `/content/*.md` vs implementación en `/code/`  
> **Auditor:** Revisión estática de código fuente (sin ejecución)

---

## 1. Resumen ejecutivo

| Dimensión | Nivel |
|---|---|
| Coherencia arquitectónica general | **Medio** |
| Exactitud de flujos documentados | **Medio-bajo** |
| Variables de entorno | **Medio** |
| Dependencias y servicios | **Bajo** (varias omisiones críticas) |
| Persistencia y modelo de datos | **Alto** |
| Brechas documentadas | **Medio** (correctas pero incompletas) |

### Principales desviaciones detectadas

1. **El sistema no es desplegable por Docker en su estado actual.** `app.py` corre Flask en el puerto `5000` (hardcodeado), pero `docker-compose.yml` expone el servicio en el puerto `8501` (el puerto por defecto de Streamlit). El contenedor iniciaría y quedaría inaccesible.
2. **Ambos managers de vector store importan `streamlit`** (`pinecone_index_manager.py` y `qdrant_index_manager.py`). Esto introduce una dependencia estructuralmente incompatible con el stack Flask principal. En tiempo de ejecución, `st.session_state` siempre estará vacío y los campos de auditoría `created_by`/`updated_by` siempre serán `"sistema"`.
3. **LangChain Hub es consultado en cada mensaje del chat**, no solo al arrancar. Cada conversación instancia `RAG()` desde cero, que dentro de `__init__` llama `hub.pull("rlm/rag-prompt")`. Una interrupción de conectividad con `api.hub.langchain.com` bloquea todos los chats.
4. **El pipeline de consulta depende del filesystem**. El índice vectorial se usa únicamente para identificar qué archivos son relevantes. El sistema luego re-lee el archivo original desde su ruta en disco (`metadata["source"]`). Si los archivos no están disponibles en la ruta original, la consulta falla.
5. **`/chat` y `/report` no tienen verificación de autenticación.** Solo `/library` verifica `"usuario" not in session`. Ambas rutas son accesibles sin login.
6. **`correct_text_with_llm()` es un stub.** La función en `document_processor/llm_interface.py` retorna el texto sin modificar. La corrección de OCR por LLM no está implementada.

### Riesgos más relevantes

- Despliegue Docker completamente roto (puerto 5000 vs 8501).
- Exposición de rutas sin autenticación.
- Secret key hardcodeado y `debug=True` activo.
- Credenciales por defecto `user/user` y `admin/admin` en seeds.
- Dependencia de red externa en cada mensaje de chat (LangChain Hub).
- URLs de servidor Ollama hardcodeadas a IP privada interna (`10.15.1.30`).

---

## 2. Coherencia arquitectónica

### Hallazgos

| Componente documentado | Existe en código | Rol real | ¿Coincide con documentación? |
|---|---|---|---|
| Aplicación Flask | `app.py` | Orquesta web, blueprints, logging | ✅ Sí |
| PostgreSQL | `db/` | Usuarios, conversaciones, mensajes, feedback, modelos, índices | ✅ Sí |
| `document_processor` | `document_processor/` | Carga e ingesta con OCR opcional | ✅ Sí |
| `embedding_server` | `embedding_server/` | Microservicio FastAPI con E5-base-v2 | ✅ Sí |
| `embeddings/` | `embeddings/` | Fábrica con OpenAI y E5 | ✅ Sí |
| `vector_index_manager` | `vector_index_manager/` | Fábrica con Pinecone y Qdrant | ✅ Sí |
| Core RAG | `core/rag.py` | Pipeline RAG con LangChain | ✅ Sí, con matices |
| Proveedores LLM | `core/model_config.py` + seeds | OpenAI, Groq, Gemini, Ollama | ✅ Sí |
| pgAdmin | `docker-compose.yml` | Soporte operativo | ✅ Sí |

### Inconsistencias

**IC-01 — Puerto Flask vs Docker (CRÍTICO)**  
`app.py` línea final: `app.run(debug=True, host="0.0.0.0", port=5000)`. El puerto es fijo y no lee `WEB_PORT`.  
`docker-compose.yml`, servicio `ragfunc`: `ports: - "${WEB_PORT:-8501}:8501"`. El default 8501 corresponde a Streamlit.  
Resultado: en cualquier despliegue Docker, Flask escucha en 5000 pero el contenedor expone 8501 → la aplicación es inaccesible.

**IC-02 — Importación de Streamlit en managers Flask (CRÍTICO)**  
`pinecone_index_manager.py` línea 5: `import streamlit as st`  
`qdrant_index_manager.py` línea 5: `import streamlit as st`  
Ambos usan `st.session_state.get("usuario", "sistema")` para poblar `created_by`/`updated_by`.  
En un contexto Flask, `st.session_state` es siempre un dict vacío → estos campos de auditoría nunca reflejan el usuario real.

**IC-03 — `rag_pipeline.py` es un wrapper trivial**  
`core/rag_pipeline.py` contiene solo una línea funcional (`return RAG(index_name)`). No agrega ninguna lógica y da la impresión de ser una capa arqutectónica que no existe.

**IC-04 — El nombre del índice default revela la instancia original**  
`core/rag.py`: `DEFAULT_INDEX_NAME = "Agendas CINTEL"`. Este default no corresponde a una configuración genérica del demostrador.

**IC-05 — Log message dice "Pinecone" aunque el backend puede ser Qdrant**  
`core/rag.py`, función `load_docs_from_initial_folder_into_vectorstore_chain`:  
`logging.info("Documentos cargados exitosamente al índice Pinecone.")` — aparece independientemente del motor vectorial configurado.

---

## 3. Validación de flujos

### Ingesta

**Estado documentado:**  
Usuario carga documentos → procesamiento textual → si `CHECK_OCR=1`, invoca `OCR_SERVICE_URL` → embeddings → indexación.

**Estado real:**  
`api/library.py` → `process_documents_in_background()` → inicia hilo de background que:  
1. Crea una instancia `RAG(index_name)` (con `hub.pull` interno).
2. Itera archivos en batches de 50.
3. Por cada archivo llama `rag.load_docs_from_initial_folder_into_vectorstore_chain(overwrite=True, file_path=...)`.
4. Dentro de esa función: carga el documento → genera embeddings → hace upsert al índice vectorial.
5. OCR se activa dentro de `OCRDocumentProcessor.enhance_documents_with_ocr()` si `CHECK_OCR == "1"`.

**Diferencias:**  
- La documentación describe OCR como paso de decisión explícito. En realidad, OCR se activa por un condicional interno dentro del procesador; no es un paso separado en el flujo de alto nivel.
- No se documenta la existencia del procesamiento en **hilo de background** (`threading.Thread`), lo que tiene implicaciones de supervisión y manejo de errores.
- La instanciación de `RAG()` dentro del proceso de ingesta implica `hub.pull()` también durante la carga de documentos, no solo durante la consulta.
- **`correct_text_with_llm()` retorna el texto sin cambios** — la corrección de OCR vía LLM no está implementada.

### Indexación

**Estado documentado:**  
Embeddings vía proveedor cloud u on-premise → vectores enviados al motor configurado → biblioteca asociada al motor persistida.

**Estado real:**  
- `EmbeddingsManagerFactory` selecciona correctamente entre `OpenAIEmbeddingsManager` (cloud) y `E5BaseV2EmbeddingsManager` (on-premise) según `EMBEDDINGS_PROVIDER`.
- `IndexManagerFactory` selecciona entre `PineconeIndexManager` y `QdrantIndexManager` según `VECTOR_DB_ENGINE` con valores `cloud`/`on-premise`.
- El registro de la biblioteca en la tabla `vector_indexes` ocurre dentro de `PineconeIndexManager.create_index_if_not_exists()` usando `VectorIndexRegistryDB`.

**Diferencias:**  
- La documentación no menciona que las dimensiones de los vectores (1536 para OpenAI, 768 para E5) son implícitamente asumidas en `api/library.py` con un condicional `if EMBEDDINGS_PROVIDER == "cloud" else 768`. No existe validación cruzada entre el motor vectorial y el proveedor de embeddings.
- Pinecone crea índices **siempre con `metric='dotproduct'`** y `cloud='aws', region='us-east-1'` — ambos valores hardcodeados, no configurables.
- `QdrantIndexManager.create_index_if_not_exists()` usa `recreate_collection()`, método deprecado en versiones recientes del cliente Qdrant.

### Consulta

**Estado documentado:**  
Usuario envía pregunta → consulta índice vectorial → arma prompt → invoca LLM → persiste conversación y mensaje.

**Estado real:**  
`api/chat.py` → `ChatService.process_user_input()` →
1. Llama `load_rag_pipeline(library_name)` → instancia un nuevo `RAG()` incluye `hub.pull()`.
2. Llama `rag_pipe.change_model(model_name)` → carga el LLM.
3. Persiste el mensaje del usuario.
4. Llama `rag_pipe.qa(user_input, context)`.
5. Dentro de `qa()`: llama `__create_retrieval_chain()` que:
   a. Genera el embedding de la query.
   b. Consulta el índice vectorial (`top_k=5`).
   c. Evalúa los resultados usando métrica combinada (`freq_ratio * 0.5 + avg_score * 0.5`).
   d. Selecciona los **2 documentos top** (`top_doc_ids[:2]`).
   e. **Re-lee los documentos completos desde el filesystem** (`load_document_from_file(doc_id)`).
   f. Construye la cadena LangChain y genera la respuesta.
6. Persiste respuesta del asistente.

**Diferencias:**  
- La documentación describe un flujo estándar RAG (retrieval por chunks → prompt). El flujo real es híbrido: los chunks solo sirven para ranking de documentos; el contexto enviado al LLM son los **documentos completos** (no los chunks). Esto puede causar problemas de límite de contexto con documentos largos y no está documentado.
- El historial conversacional (`messages`) se pasa a `qa()` como `self.memory = messages` pero **no se incorpora al prompt**. La variable `self.memory` no se usa en la cadena RAG construida en `__create_retrieval_chain()` → la memoria conversacional existe en DB pero no se usa para generar respuestas.
- Se crea **una nueva instancia de `RAG` por cada mensaje**, incluyendo una llamada de red a LangChain Hub.

### Feedback

**Estado documentado:**  
Usuario registra retroalimentación positiva o negativa → se conserva relación con `message_id` → reportes explotan persistencia.

**Estado real:**  
`api/chat.py` → `/chat/feedback/<message_id>` → `FeedbackService.save_feedback_and_update_message()`:
1. Llama `FeedbackDB.save_feedback()` → upsert en tabla `feedback` (agregados: `good`/`bad` como enteros).
2. Llama `ConversationDB.update_feedback()` → actualiza campo `feedback` en `conversation_messages`.

**Diferencias:**  
- El feedback se persiste en **dos tablas distintas** (`feedback` y `conversation_messages`), lo cual no está documentado. La tabla `feedback` es un registro agregado; la tabla `conversation_messages` tiene el flag individual.
- La tabla `feedback` tiene `message_id` como **PRIMARY KEY**, lo que limita a un solo feedback por mensaje (correcto), pero el `upsert` permite cambiar el feedback, aunque conceptualmente no se documenta si está permitido modificar un feedback ya emitido.

---

## 4. Configuración y variables

### Coincidencias

Las siguientes variables documentadas en `arquitectura.md` existen y se usan correctamente:

| Variable | Módulo | Uso verificado |
|---|---|---|
| `IA_MODELS_PROVIDER` | `core/model_config.py` | Filtra modelos activos por proveedor en BD |
| `VECTOR_DB_ENGINE` | `vector_index_manager/index_manager_factory.py` | Selecciona Pinecone o Qdrant |
| `EMBEDDINGS_PROVIDER` | `embeddings/embeddings_factory.py` | Selecciona OpenAI o E5 |
| `OPENAI_API_KEY` | `embeddings/open_ai_embeddings.py` | Pasado a `OpenAIEmbeddings` |
| `LANGSMITH_API_KEY` | `core/rag.py` | Pasado a `hub.pull()` |
| `QDRANT_HOST` / `QDRANT_PORT` | `vector_index_manager/qdrant_index_manager.py` | Configura cliente Qdrant |
| `EMBEDDINGS_PROTOCOL/HOST/PORT` | `embeddings/e5_base_v2_embeddings.py` | URL del embedding server |
| `CHECK_OCR` | `document_processor/document_loader.py` | Activa/desactiva OCR |
| `OCR_SERVICE_URL` | `utils/external_rest_services.py` | POST al servicio OCR |
| `OCR_USE_GPU` | `utils/external_rest_services.py` | Parámetro `modo` en request OCR |
| `POSTGRES_*` | `db/connection.py` | Conexión a PostgreSQL |
| `LOG_DIR` | `app.py` | Logging rotativo a archivo |
| `UPLOADS_PATH` | `api/library.py` | Ruta raíz de archivos subidos |
| `TXT_TMP_DIR` | `document_processor/document_loader.py` | Caché de texto procesado |

### Inconsistencias

**VAR-01 — `REQUIRED_ENV_VARS` fuerza claves cloud en despliegues on-premise**  
`config/environment.py` declara como obligatorias:
```python
REQUIRED_ENV_VARS = ["OPENAI_API_KEY", "PINECONE_API_KEY", "GOOGLE_API_KEY", "LANGSMITH_API_KEY"]
```
Esto hace imposible un arranque limpio en modo `on-premise` sin ingresar credenciales cloud inútiles. Brecha correctamente documentada pero el código no ha sido corregido.

**VAR-02 — `GROQ_API_KEY` no está en `REQUIRED_ENV_VARS`**  
Los modelos Groq (`ChatGroq`) están configurados en seeds con `env_var: "GROQ_API_KEY"`. Esta variable no está en las variables requeridas y no se documenta explícitamente como variable de entorno opcional de primer orden.

**VAR-03 — `WEB_PORT` es ignorado por Flask**  
`arquitectura.md` lo lista como variable crítica. En `app.py` el puerto está hardcodeado a `5000`. El docker-compose usa `8501` como default, que corresponde a Streamlit, no a Flask.

**VAR-04 — `model_config.py` lógica de API key invertida**  
```python
if not model.get("ia_models_provider", "cloud") == 'cloud' and model.get("env_var"):
    api_key = os.getenv(model["env_var"])
    params["api_key"] = api_key
```
La condición es verdadera cuando el modelo **NO es cloud**. Esto significa que los modelos cloud (Groq, OpenAI, Gemini) **no reciben** la API key inyectada vía `params`. Funcionan únicamente porque las clases LangChain (`ChatGroq`, `ChatOpenAI`) también leen las variables de entorno directamente. Para Ollama (on-premise), que no necesita API key, este código intentaría inyectar `None`.

**VAR-05 — `QDRANT_GRPC_PORT` documentado pero no usado en código**  
`arquitectura.md` lista `QDRANT_GRPC_PORT` como variable crítica. El `QdrantIndexManager` usa solo HTTP (`host`/`port`), sin referencia a gRPC en el código fuente.

**VAR-06 — `QDRANT_STORAGE` documentado pero no usado en código Python**  
Solo aparece como volumen en `docker-compose.yml`. El código Python no lo consume.

**VAR-07 — `OCR_USE_GPU` se evalúa al importar, no al llamar**  
`external_rest_services.py`:
```python
OCR_USE_GPU = os.environ.get("OCR_USE_GPU", "0") == "1"
```
Se evalúa al cargar el módulo. Si la variable cambia en tiempo de ejecución (raro pero posible), no tiene efecto.

### Variables no documentadas

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `PGADMIN_PORT` | `docker-compose.yml` | Puerto externo de pgAdmin |
| `PGADMIN_DEFAULT_EMAIL` | `docker-compose.yml` | Credencial de acceso de pgAdmin |
| `PGADMIN_DEFAULT_PASSWORD` | `docker-compose.yml` | Credencial de acceso de pgAdmin |
| `LANGCHAIN_PROJECT` | `config/environment.py` (default) | Nombre del proyecto en LangSmith |
| `LANGCHAIN_TRACING_V2` | `config/environment.py` (default) | Activa tracing LangChain |

---

## 5. Dependencias y servicios

### Dependencias verificadas en código

| Servicio / librería | Estado documentado | Estado real |
|---|---|---|
| OpenAI (`langchain-openai`) | Documentado | ✅ Usado en embeddings y LLM (GPT) |
| Groq (`langchain-groq`) | Documentado | ✅ Usado para modelos cloud en seeds |
| Gemini (`langchain-google-genai`) | Documentado | ✅ Usado para modelos cloud en seeds |
| Ollama (`langchain-ollama`) | Documentado | ✅ Usado via `OllamaLLM` para on-premise |
| Pinecone (`langchain-pinecone`, `pinecone`) | Documentado | ✅ Implementado en `PineconeIndexManager` |
| Qdrant (`qdrant-client`) | Documentado | ✅ Implementado en `QdrantIndexManager` |
| LangChain Hub | Documentado como brecha | ✅ Confirmado, llamada real en `RAG.__init__()` |
| LangSmith tracing | Documentado | ✅ Variables configuradas en defaults |
| PostgreSQL + psycopg2 | Documentado | ✅ Uso directo de psycopg2 (sin ORM) |
| Flask | Implícito | ✅ Stack principal confirmado |
| PyMuPDF (fitz) | No documentado | ✅ Usado en OCR para renderizar páginas |
| Streamlit | **No documentado** | ⚠️ **Importado en `pinecone_index_manager.py` y `qdrant_index_manager.py`** |
| FastAPI + Transformers + PyTorch | No documentado | ✅ Embedding server usa FastAPI, Transformers, Torch |
| python-pptx | No documentado | ✅ Usado en `image_extraction.py` para extraer imágenes de PPTX |
| pandas + plotly | No documentado | ✅ Usados en `core/report.py` para reportes |
| python-dotenv | No documentado | ✅ Usado en `config/environment.py` |
| werkzeug | No documentado | ✅ Usado para hash de contraseñas |

### Dependencias ocultas no documentadas

**DEP-01 — Streamlit como dependencia estructural implícita**  
`requirements.txt` incluye `streamlit==...` y `altair` (dependencia de Streamlit), evidenciando que es una dependencia real del proyecto. Sin embargo, ambos managers de vectores la usan exclusivamente para leer `session_state`, lo cual no funciona en Flask. La dependencia debería eliminarse y reemplazarse por el contexto de sesión Flask.

**DEP-02 — Servidor Ollama en IP privada hardcodeada**  
Todos los modelos on-premise en `config/seeds/models.json` tienen `base_url: "http://10.15.1.30:21434"`. Esta es una IP privada interna específica. Si el servidor Ollama está en otra dirección, todos los modelos on-premise fallan sin posibilidad de configuración via `.env`.

**DEP-03 — Conectividad externa requerida al arrancar cada conversación**  
`hub.pull("rlm/rag-prompt")` requiere acceso a `api.hub.langchain.com` en cada instanciación de `RAG`. Esto ocurre por cada mensaje enviado en el chat.

**DEP-04 — Archivos originales deben persistir en disco para consultas**  
El path almacenado en `metadata["source"]` durante la ingesta es la ruta local del archivo al momento de procesarlo. Al consultar, `__create_retrieval_chain()` re-lee ese archivo. En despliegues containerizados, si el volumen no está montado con esas rutas exactas, las consultas fallan.

**DEP-05 — PaddleOCR / PaddlePaddle en requirements.txt**  
`requirements.txt` incluye `paddleocr` y `paddlepaddle`, lo que implica una dependencia pesada de OCR local. Sin embargo, el código del procesador de documentos no importa PaddleOCR directamente —usa un servicio REST externo (`OCR_SERVICE_URL`). Se desconoce si PaddleOCR se usa internamente dentro del servicio OCR externo o si es un remanente.

---

## 6. Persistencia

### Modelo de datos verificado

| Entidad documentada | Tabla real | Campos en código | ¿Coincide? |
|---|---|---|---|
| Usuarios | `users` | `username`, `password`, `rol` | ✅ Sí |
| Conversaciones | `conversations` | `id`, `name`, `model_name`, `vector_db_engine`, `library_name`, `created_by`, `created_at` | ✅ Sí |
| Mensajes | `conversation_messages` | `id`, `conversation_id`, `role`, `content`, `selected_model`, `selected_library`, `feedback`, `created_at` | ✅ Sí, con anotación |
| Feedback | `feedback` | `message_id`, `model`, `library`, `vector_db_engine`, `good`, `bad` | ✅ Sí |
| Modelos IA | `ia_model_config` | 13 campos incluyendo `rating`, `image_support`, `is_experimental` | ✅ Sí, más campos de los documentados |
| Bibliotecas / índices vectoriales | `vector_indexes` | `id`, `name`, `technical_name`, `vector_db_engine`, `created_at`, `created_by`, `updated_at`, `updated_by` | ✅ Sí |

### Diferencias y anomalías

**PERS-01 — Feedback persistido en dos tablas simultáneamente**  
Al registrar feedback se actualiza tanto `feedback` (tabla de agregados con `good`/`bad` como contadores enteros) como `conversation_messages.feedback` (campo string `'good'`/`'bad'`). La documentación solo menciona la relación con `message_id` pero no detalla esta dualidad.

**PERS-02 — `created_by`/`updated_by` en `vector_indexes` siempre vale `"sistema"`**  
Como se documentó en IC-02, los managers de vector store usan `st.session_state.get("usuario", "sistema")`. En Flask este valor nunca es el usuario real. Los campos de auditoría en `vector_indexes` son inútiles en el estado actual.

**PERS-03 — Conversaciones siloed por `vector_db_engine`**  
`ConversationDB.list_conversations()` filtra por `created_by` **y** `vector_db_engine`. Si se cambia el valor de `VECTOR_DB_ENGINE` en el entorno, las conversaciones existentes desaparecen del listado del usuario. No está documentado.

**PERS-04 — La memoria conversacional se persiste pero no se usa en el prompt**  
El historial de mensajes se guarda en `conversation_messages` y se recupera al cargar el contexto de chat. Se pasa a `rag.qa(query, messages)` que asigna `self.memory = messages`. Sin embargo, `__create_retrieval_chain()` construye el prompt sin incluir `self.memory`. La memoria existe en base de datos pero no influye en las respuestas generadas.

**PERS-05 — No se persiste información sobre qué documentos o chunks sustentaron cada respuesta**  
Documentado como brecha en `brechas.md`. Confirmado: no hay persistencia de fuentes usadas, top-k ni scores.

---

## 7. Evaluación de brechas documentadas

### Brecha 1: Coherencia técnica de configuración y dependencias

- **Brecha:** REQUIRED_ENV_VARS contradice escenarios on-premise; dependencia de Streamlit en managers.
- **Estado en código:** No implementada (persiste).
- **Observación:** Correctamente identificada y más grave de lo descrito. La dependencia de Streamlit no es solo "pérdida de cohesión" —hace que los campos de auditoría `created_by`/`updated_by` sean siempre incorrectos y agrega una dependencia innecesaria de ~50 MB al contenedor Flask.

---

### Brecha 2: Tool registry y ejecución controlada

- **Brecha:** Falta registro explícito de herramientas, validación de parámetros y permisos.
- **Estado en código:** No implementada.
- **Observación:** Correctamente identificada. No existe ninguna capa de herramientas adicional más allá del flujo RAG puro.

---

### Brecha 3: Estado persistente extendido

- **Brecha:** No se persisten decisiones de planificación, ejecución de tools, citas, métricas por consulta ni versiones de índices/embeddings/prompt.
- **Estado en código:** No implementada.
- **Observación:** Correctamente identificada. El esquema de base de datos no incluye ninguna de estas entidades. Adicionalmente, no se persiste el vector de embedding de la query, el score de los resultados recuperados, ni el `top_k` usado.

---

### Brecha 4: Memoria avanzada

- **Brecha:** Falta resumen incremental, memoria episódica y de preferencias.
- **Estado en código:** No implementada.
- **Observación:** Correctamente identificada. Se agrega observación crítica: la memoria conversacional **sí se persiste en DB** pero **no se usa en el prompt**. Esto es una brecha más profunda de la documentada —no es solo que falta "memoria avanzada", es que la memoria básica existente tampoco está activa en el pipeline RAG.

---

### Brecha 5: Evaluación automática de calidad

- **Brecha:** No hay tests de regresión, evaluación de factualidad ni benchmarks internos.
- **Estado en código:** No implementada.
- **Observación:** Correctamente identificada.

---

### Brecha 6: Gobernanza

- **Brecha:** Falta política de acceso a documentos, clasificación de fuentes, retención y auditoría.
- **Estado en código:** No implementada.
- **Observación:** Correctamente identificada. Se suma observación: no hay mecanismo de roles que controle el acceso a bibliotecas específicas —cualquier usuario autenticado puede ver y usar todas las bibliotecas disponibles.

---

## 8. Nuevas brechas identificadas

**NBR-01 — Puerto Flask hardcodeado a 5000, docker-compose usa 8501 [BLOQUEANTE]**  
Impide despliegue funcional via Docker. Requiere corrección inmediata. Además, `WEB_PORT` está documentada como variable de control del puerto web, pero no está conectada al código Flask.

**NBR-02 — LangChain Hub llamado en cada mensaje de chat [RENDIMIENTO / DISPONIBILIDAD]**  
`RAG.__init__()` es ejecutado por `load_rag_pipeline()` en cada mensaje. El `hub.pull()` es una llamada de red síncrona que añade latencia en cada conversación y crea una dependencia de disponibilidad externa en el camino crítico del chat.

**NBR-03 — Pipeline de consulta depende del filesystem local [ESCALABILIDAD / ROTURA EN DOCKER]**  
`__create_retrieval_chain()` re-lee archivos originales de disco usando las rutas almacenadas en `metadata["source"]`. Si los archivos se subieron durante una sesión anterior desde una ruta temporal (por ejemplo `/tmp/session_uuid/archivo.pdf`) y esa carpeta temporal ya no existe, la consulta falla con `FileNotFoundError`. Esto ocurre especialmente en despliegues containerizados donde los volúmenes no son persistentes o las rutas cambian.

**NBR-04 — Rutas `/chat` y `/report` accesibles sin autenticación [SEGURIDAD]**  
`api/chat.py` y `api/report.py` no verifican `"usuario" in session`. Un usuario no autenticado puede acceder a `/chat` y a `/report`. El chat con `user_id=None` retorna las conversaciones de todos los usuarios donde `created_by = None` (si existen) o lista vacía, pero no bloquea el acceso.

**NBR-05 — `app.run(debug=True)` hardcodeado [SEGURIDAD]**  
Flask en modo `debug=True` expone el Werkzeug debugger interactivo, que permite ejecución de código arbitrario si es accesible desde la red. Debe ser configurable vía variable de entorno.

**NBR-06 — `correct_text_with_llm()` es un stub [FUNCIONALIDAD NO IMPLEMENTADA]**  
`document_processor/llm_interface.py` contiene solo `return text`. La corrección de texto OCR via LLM, que sería parte del flujo de ingesta de calidad, no está implementada.

**NBR-07 — URLs de servidor Ollama hardcodeadas en seeds [PORTABILIDAD]**  
`config/seeds/models.json`: todos los modelos on-premise tienen `"base_url": "http://10.15.1.30:21434"`. No existe una variable de entorno para configurar la URL base de Ollama. Cambiar de infraestructura requiere modificar el JSON.

**NBR-08 — `QdrantIndexManager` usa API deprecada [COMPATIBILIDAD]**  
`recreate_collection()` fue deprecado en `qdrant-client >= 1.4`. Versiones recientes del cliente pueden eliminar este método, causando fallos en despliegues con Qdrant actualizado.

**NBR-09 — Embedding server usa pooling incorrecto [CALIDAD DE EMBEDDINGS]**  
`embedding_server/main.py` usa `outputs.last_hidden_state[:, 0, :]` (CLS token). El modelo `intfloat/e5-base-v2` recomienda **mean pooling** para mejor representación semántica. El uso de CLS token puede degradar la calidad de los embeddings y por tanto la relevancia del retrieval.

**NBR-10 — Memoria conversacional persistida pero inactiva en el prompt**  
Los mensajes se guardan en DB y se recuperan (`context = messages.copy()`), mas la cadena RAG construida en `__create_retrieval_chain()` no los incluye. Esto significa que el chatbot no tiene continuidad conversacional real a pesar de que la arquitectura sugiere que sí.

**NBR-11 — Instancia RAG creada por cada mensaje [RENDIMIENTO]**  
No existe caché ni pooling de instancias RAG. Cada mensaje crea una instancia nueva con inicialización completa (hub.pull, fábricas de embeddings e índice). En carga concurrente, esto multiplicará las llamadas externas y el uso de memoria.

**NBR-12 — Pinecone hardcodea región y métricas de similitud**  
`PineconeIndexManager.create_index_if_not_exists()`: `ServerlessSpec(cloud='aws', region='us-east-1')` y `metric='dotproduct'` son valores fijos. No configurables sin modificar código.

**NBR-13 — `QDRANT_GRPC_PORT` documentado pero no implementado**  
La variable aparece en `arquitectura.md` como variable crítica pero no existe ninguna referencia a gRPC en el código Python (solo HTTP). Genera expectativa funcional falsa.

---

## 9. Recomendaciones para actualización de documentación

### `arquitectura.md`

- **Corregir** la tabla de variables críticas: eliminar `QDRANT_GRPC_PORT` como variable crítica o aclarar que solo aplica al docker-compose, no al código Python.
- **Agregar** nota sobre el flujo real de consulta: el contexto enviado al LLM son **documentos completos**, no chunks. Documentar implicación en límite de contexto.
- **Agregar** advertencia sobre el puerto Flask: la variable `WEB_PORT` no está conectada al código Flask actual.
- **Agregar** en la lista de componentes: el embedding server usa FastAPI + `intfloat/e5-base-v2` + PyTorch.
- **Aclarar** que la memoria conversacional está persistida en PostgreSQL pero no se incorpora actualmente al prompt RAG.
- **Agregar** la nota de auditoría `created_by`/`updated_by` en `vector_indexes` como no funcional en el estado actual.

### `brechas.md`

- **Escalar** la brecha de Streamlit: no es solo "pérdida de cohesión", es una dependencia que rompe la auditabilidad y que podría causar errores en tiempo de ejecución si Streamlit falla al importarse fuera de su contexto.
- **Escalar** la brecha de LangChain Hub: el problema no es solo en el arranque del sistema —ocurre en **cada mensaje de chat**.
- **Agregar brecha NBR-01**: puerto Flask hardcodeado vs docker-compose → sistema no desplegable via Docker.
- **Agregar brecha NBR-04**: rutas `/chat` y `/report` sin autenticación.
- **Agregar brecha NBR-06**: `correct_text_with_llm()` es un stub → OCR correction no está implementada.
- **Agregar brecha NBR-07**: URLs Ollama hardcodeadas en seeds → no portables.
- **Agregar brecha NBR-10**: memoria conversacional guardada pero no activa en el prompt.
- **Agregar brecha NBR-11**: no hay caché de instancias RAG → una llamada a hub.pull por mensaje.

### `despliegue.md`

- **Corregir** la sección de comando base: el docker-compose mapea al puerto 8501 pero Flask corre en 5000. Esto debe documentarse como issue conocido o corregirse.
- **Agregar** paso de validación de `WEB_PORT` con la nota de que actualmente está desconectado del código Flask.
- **Agregar** bajo "Puntos de atención" la dependencia de filesystem: los archivos ingestados deben persistir en la misma ruta original para que las consultas funcionen.
- **Agregar** bajo "Dependencias externas" la conectividad a LangChain Hub como requerida en cada mensaje de chat.
- **Agregar** la URL del servidor Ollama como variable a confirmar antes del despliegue on-premise.
- **Agregar** las variables de pgAdmin (`PGADMIN_PORT`, `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD`) en la lista de configuración.

### Otros documentos que podrían ser necesarios

- **`seguridad.md` (nuevo)**: documentar hardcoded `secret_key`, `debug=True`, credenciales default, ausencia de CSRF y rate limiting, rutas sin auth.
- **`modelo_datos.md` (nuevo)**: documentar el esquema real de tablas con todos sus campos, incluida la dualidad de persistencia de feedback.

---

## 10. Notas para siguiente iteración

Los siguientes puntos deberían convertirse en prompt de actualización técnica prioritaria:

1. **[BLOQUEANTE]** Resolver inconsistencia de puerto: alinear `app.run(port=...)` con `WEB_PORT` y actualizar docker-compose para mapear `${WEB_PORT:-5000}:5000`, o hacer Flask leer `WEB_PORT` del entorno.

2. **[CRÍTICO]** Eliminar `import streamlit as st` de `pinecone_index_manager.py` y `qdrant_index_manager.py`. Reemplazar `st.session_state.get("usuario", "sistema")` por un mecanismo compatible con Flask (por ejemplo, pasar el usuario como parámetro explícito).

3. **[CRÍTICO]** Cachear la instancia RAG (o al menos el `rag_prompt` de Hub) para evitar llamadas de red en cada mensaje. Evaluar si `hub.pull()` puede reemplazarse por una definición local del prompt.

4. **[ALTO]** Agregar verificación de autenticación `if "usuario" not in session: return redirect(url_for("auth.login"))` al inicio de las rutas `/chat` y `/report`.

5. **[ALTO]** Corregir la lógica invertida de API key en `core/model_config.py`: la condición debe ser `if model.get("ia_models_provider") == 'cloud' and model.get("env_var")`.

6. **[ALTO]** Implementar `correct_text_with_llm()` o documentar explícitamente que la corrección LLM post-OCR no está activa.

7. **[MEDIO]** Externalizar `base_url` de Ollama a una variable de entorno (`OLLAMA_BASE_URL`). Actualizar seeds para usar una variable placeholder o configurar desde entorno al cargar los modelos.

8. **[MEDIO]** Reemplazar `recreate_collection()` por `create_collection()` con manejo de `CollectionAlreadyExistsException` en `QdrantIndexManager`.

9. **[MEDIO]** Corregir el pooling del embedding server: cambiar de CLS token a mean pooling para `e5-base-v2`.

10. **[MEDIO]** Evaluar si la memoria conversacional debe incorporarse al prompt y, si se decide que sí, implementar la inyección en `__create_retrieval_chain()`.

11. **[BAJO]** Incluir `GROQ_API_KEY` en la documentación de variables de entorno y evaluar si debe estar en `REQUIRED_ENV_VARS` (condicional a `IA_MODELS_PROVIDER=cloud`).

12. **[BAJO]** Corregir log message en `rag.py`: `"Documentos cargados exitosamente al índice Pinecone."` → hacer genérico o condicional al motor.
