# Inventario preliminar de servicios y variables de costo

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
