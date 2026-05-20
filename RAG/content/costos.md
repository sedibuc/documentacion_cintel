# Inventario preliminar de servicios y variables de costo

<div class="badge-row">
<span class="badge">Análisis AS-IS</span>
<span class="badge">Referencia: demostrador RAG actual</span>
<span class="badge badge-note">TO-BE: Document Intelligence Engine — ver sección de nuevas variables</span>
</div>

> **Nota de reposicionamiento (2026-05):** Este inventario está basado en el demostrador RAG actual (AS-IS). El sistema TO-BE — **Document Intelligence Engine MultiTenant** — introduce nuevas variables de costo y elimina algunas de las actuales (especialmente la Vector DB y el stack de embeddings). Ver sección al final de este documento.

## Enfoque del inventario

El diagnóstico distingue costos potenciales según el modo cloud u on-premise. El objetivo aquí es identificar los componentes que introducen gasto o consumo de infraestructura, no estimar un presupuesto definitivo.

## Servicios y componentes observados

| Servicio o componente | Modalidad observada | Variable de costo principal |
| --- | --- | --- |
| OpenAI | Cloud | Consumo por tokens y uso del modelo |
| Groq | Cloud | Consumo del proveedor configurado en seeds |
| Gemini | Cloud | Consumo del proveedor configurado |
| Ollama | On-premise | CPU, GPU y memoria del host |
| Pinecone | Cloud | Capacidad del índice y uso administrado |
| Qdrant | On-premise en Docker | Hardware local, almacenamiento y operación |
| Embedding server | On-premise | CPU, GPU, memoria y red |
| OCR externo | Servicio REST | Uso de cómputo y, si aplica, GPU |
| PostgreSQL | Persistencia operativa | Infraestructura, almacenamiento y administración |
| pgAdmin | Soporte operativo | Infraestructura marginal |
| LangSmith | Tracing y hub | Licenciamiento o consumo asociado |

## Lectura por escenarios

### Escenario cloud

- Mayor dependencia de API keys y consumo por solicitud.
- Menor operación de infraestructura propia para modelos y vector DB cuando se usa Pinecone u otros servicios administrados.

### Escenario on-premise

- Mayor control de datos y de red interna.
- Costo trasladado a hardware, almacenamiento, operación y mantenimiento local.
- Qdrant y Ollama concentran parte importante del costo de capacidad.

## Variables que gobiernan el costo técnico

### Selección de proveedor

- IA_MODELS_PROVIDER
- EMBEDDINGS_PROVIDER
- VECTOR_DB_ENGINE

### Uso de servicios cloud

- OPENAI_API_KEY
- GROQ_API_KEY
- GOOGLE_API_KEY
- PINECONE_API_KEY
- LANGSMITH_API_KEY

### Recursos on-premise y operación

- QDRANT_STORAGE
- OCR_USE_GPU
- WEB_PORT
- LOG_DIR
- UPLOADS_PATH
- TXT_TMP_DIR

## Riesgos de costo identificados en el diagnóstico

- La validación de entorno obliga claves cloud incluso cuando la intención es operar on-premise, lo que puede generar configuraciones híbridas innecesarias.
- No se evidencian métricas de volumen, throughput o latencia que permitan modelar costo con mayor precisión.
- No se documenta versionado o control fino de índices y embeddings, lo cual complica estimar reprocesamientos.

## Información no disponible en diagnóstico actual

- Presupuesto objetivo del demostrador.
- Consumo mensual esperado por proveedor.
- Tamaño actual de índices y volumen documental.
- Requerimientos de hardware mínimos y recomendados.
- Costos de soporte, monitoreo y respaldo.

---

## Variables de costo del Document Intelligence Engine MultiTenant (TO-BE)

El sistema TO-BE introduce las siguientes variables de costo nuevas y elimina algunas del AS-IS:

### Componentes nuevos con costo de desarrollo

| Componente | Tipo de costo | Estimación relativa |
|---|---|---|
| **MultiTenant Platform Core** | Desarrollo backend (mayor esfuerzo) | Alto |
| **DocumentSchemaRegistry** | Desarrollo backend | Medio |
| **CrossValidator** | Desarrollo backend | Medio |
| **DiscrepancyAlertEngine** | Desarrollo backend | Medio |
| **Alert Dashboard** | Desarrollo frontend + backend | Medio |
| **API REST documentada** | Desarrollo + documentación OpenAPI | Medio |
| **Audit Service** | Desarrollo backend (DB inmutable) | Bajo |
| **StructuredExtractor** | Integración LLM + parser | Bajo-Medio |

### Variables de infraestructura TO-BE

| Servicio | Modalidad | Variable de costo principal |
|---|---|---|
| LLM Provider (OpenAI / Groq) | Cloud | Tokens de entrada + salida por extracción |
| Ollama (on-premise) | On-premise | CPU/GPU + memoria del servidor |
| PostgreSQL (RLS MultiTenant) | On-premise / Cloud | Almacenamiento + compute |
| Object Storage (documentos + CSVs) | On-premise / S3 | Almacenamiento + transferencia |
| Redis (broker + cache) | On-premise | Compute + memoria |
| OCR Service | On-premise / API | Compute (Tesseract) o consumo (API) |

### Eliminados respecto al AS-IS

| Componente AS-IS | Motivo de eliminación |
|---|---|
| Vector DB (Pinecone, Qdrant) | No se usa — no hay RAG ni embeddings en el TO-BE |
| Embedding server | No se usa — no hay vectorización en el TO-BE |
| LangSmith / LangChain Hub | No se usa — LLM Orchestrator es nativo |
| Stack de chat / conversación | No se implementa — fuera de alcance |
