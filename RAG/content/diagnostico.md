# Diagnóstico técnico inicial

## Descripción general

El diagnóstico identifica un sistema RAG funcional con interfaz web, autenticación basada en PostgreSQL, persistencia de conversaciones, pipeline de ingesta documental y capacidad de conmutar entre servicios cloud y on-premise para LLM, embeddings y vector store.

## Modularidad actual

### Evidencias de modularidad

- Separación de capas por carpetas: api, core, db, vector_index_manager, embeddings, document_processor y embedding_server.
- Uso de factorías: IndexManagerFactory para el motor vectorial y EmbeddingsManagerFactory para embeddings.
- Configuración declarativa de modelos en config/seeds/models.json con persistencia en base de datos.

### Limitaciones observadas

- Algunos managers del vector store dependen de streamlit, pese a que el stack principal del demostrador es Flask.
- El core RAG depende de LangChain Hub durante la inicialización del prompt.
- La modularidad existe, pero no elimina por completo acoplamientos entre capas técnicas y decisiones de ejecución.

## Gestión de configuración

### Mecanismo actual

- El archivo .env es cargado por config/environment.py.
- Las variables requeridas se validan mediante REQUIRED_ENV_VARS.

### Hallazgo crítico

config/environment.py exige OPENAI_API_KEY, PINECONE_API_KEY, GOOGLE_API_KEY y LANGSMITH_API_KEY aun cuando el código soporta escenarios on-premise. Esto introduce una contradicción entre la capacidad declarada del sistema y la validación efectiva de arranque.

### Inconsistencias detectadas

- Algunos módulos documentan VECTOR_DB_ENGINE=pinecone|qdrant, pero el código usa cloud|on-premise.
- El catálogo de modelos referencia variables como GROQ_API_KEY que no aparecen en REQUIRED_ENV_VARS.

## Seguridad

### Autenticación y sesiones

- La autenticación se implementa con formulario en /login.
- La sesión se mantiene por cookies de Flask.
- Las credenciales se validan contra PostgreSQL.

### Contraseñas y usuarios por defecto

- db/auth.py usa generate_password_hash y check_password_hash.
- db/db_manager.py crea usuarios por defecto user/user y admin/admin.

Esto es útil para demo, pero constituye un riesgo operativo si no se controla en despliegues reales.

### Autorización y protección web

- El rol se guarda en session["rol"].
- /library exige login.
- Chat y reportes requieren revisión adicional para confirmar enforcement homogéneo.
- app.secret_key está hardcodeado.
- No se observa manejo explícito de CSRF.
- No se observa rate limiting.

## Observabilidad y trazabilidad

### Capacidades existentes

- Logging a consola y archivo rotativo en LOG_DIR.
- Opción de tracing vía variables LANGCHAIN_* y LANGSMITH_API_KEY.
- Persistencia de conversaciones, mensajes, feedback, bibliotecas por motor y catálogo de modelos.

### Vacíos importantes

- No se evidencian métricas técnicas de latencia, throughput o errores por operación.
- No se evidencia correlation-id por request.
- No se instrumentan de forma explícita OCR, embeddings, búsqueda vectorial o llamadas al LLM.
- No se persiste qué documentos o chunks soportaron cada respuesta.
- La auditoría de created_by y updated_by en vector_indexes depende de streamlit.session_state.

## Memoria conversacional

### Estado actual

- Los mensajes multi-turn se guardan en PostgreSQL.
- En RAG.qa(query, messages) se asigna self.memory = messages.

### Limitación funcional

El diagnóstico señala que la memoria no se integra claramente en un mecanismo de prompt robusto orientado a contexto acumulado. La persistencia existe, pero no equivale a una memoria conversacional avanzada.

## Riesgos principales identificados

- Validación de variables incompatible con despliegues on-premise puros.
- Secretos sensibles con manejo parcial o hardcodeado.
- Dependencias cruzadas no alineadas con la arquitectura principal.
- Escasa observabilidad operacional.
- Trazabilidad débil de fuentes usadas en respuestas.
- Credenciales por defecto activas en seeds de demo.

## Información no disponible en diagnóstico actual

- Cobertura exacta de rutas protegidas por rol.
- Métricas de error observadas en un entorno real.
- Historial de incidentes operativos del demostrador.
- Política de rotación de secretos y contraseñas.
