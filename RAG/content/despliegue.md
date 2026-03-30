# Guía técnica inicial de configuración y despliegue

## Prerrequisitos base

El diagnóstico indica como prerrequisitos:

- Docker y Docker Compose disponibles.
- Archivo .env correctamente diligenciado.
- Disponibilidad del proveedor seleccionado para LLM, embeddings y vector DB.
- Servicio OCR accesible si se desea OCR.
- Embedding server accesible cuando EMBEDDINGS_PROVIDER=on-premise.
- Conectividad a LangChain Hub si se mantiene el prompt hub observado en runtime.

## Configuración de entorno

### Archivos y validación

- .env es la fuente principal de configuración operativa.
- config/environment.py carga y valida variables requeridas.

### Riesgo operativo relevante

La validación actual exige credenciales cloud incluso en despliegues on-premise, por lo que conviene revisar esa validación antes de asumir un arranque limpio fuera de cloud.

### Variables realmente relevantes para el arranque observado

- IA_MODELS_PROVIDER
- EMBEDDINGS_PROVIDER
- VECTOR_DB_ENGINE
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- LOG_DIR
- UPLOADS_PATH
- TXT_TMP_DIR
- CHECK_OCR
- OCR_SERVICE_URL
- EMBEDDINGS_PROTOCOL
- EMBEDDINGS_HOST
- EMBEDDINGS_PORT

### Notas de consistencia de configuración

- `WEB_PORT` aparece en docker-compose, pero el proceso Flask observado escucha en el puerto 5000 fijado en código.
- `REQUIRED_ENV_VARS` sigue exigiendo claves cloud incluso en escenarios on-premise.
- `QDRANT_GRPC_PORT` y `QDRANT_STORAGE` participan en despliegue, pero no gobiernan directamente el cliente Python revisado.
- `PGADMIN_PORT`, `PGADMIN_DEFAULT_EMAIL` y `PGADMIN_DEFAULT_PASSWORD` intervienen en el stack operativo cuando se usa pgAdmin.

## Docker y docker-compose

### Servicios mencionados en el diagnóstico

- Aplicación web.
- PostgreSQL.
- Qdrant para escenario on-premise.
- pgAdmin.
- Embedding server para embeddings on-premise.
- Volúmenes y rutas de persistencia según compose y montaje.

### Comando base observado

```bash
docker compose up --build -d
```

## Secuencia operativa mínima

### 1. Preparar variables

- Definir proveedor de IA con IA_MODELS_PROVIDER.
- Definir proveedor de embeddings con EMBEDDINGS_PROVIDER.
- Definir motor vectorial con VECTOR_DB_ENGINE.
- Completar variables de PostgreSQL, OCR, rutas y runtime.

### 2. Revisar rutas locales

- LOG_DIR debe existir y ser accesible.
- UPLOADS_PATH debe resolverse correctamente.
- TXT_TMP_DIR debe estar disponible para cache de texto y OCR.

### 3. Levantar servicios

- Iniciar servicios con docker compose.
- Verificar disponibilidad de PostgreSQL, Qdrant, embedding server y web.
- Confirmar exposición de PGADMIN_PORT según entorno.
- Validar explícitamente que la aplicación Flask observada escucha en el puerto 5000.

### 4. Validar conectividad funcional

- Probar login.
- Probar carga documental.
- Probar indexación.
- Probar consulta y feedback.

## Puntos de atención del despliegue

- Los despliegues on-premise pueden fallar por validación de claves cloud obligatorias.
- El contenedor web observado presenta una incoherencia entre el puerto 5000 usado por Flask y el puerto 8501 expuesto en docker-compose.
- El flujo de consulta depende de que los documentos originales sigan disponibles en las rutas de filesystem registradas durante la ingesta.
- LangChain Hub participa en runtime al crear nuevas instancias del pipeline RAG, por lo que la conectividad externa afecta el chat.
- Los modelos on-premise de Ollama quedan atados a la dirección base definida en el catálogo de modelos observado.
- app.secret_key está hardcodeado en el estado observado.
- Existen credenciales por defecto en la inicialización de usuarios.
- No se observan controles explícitos de CSRF ni rate limiting.
- No se documentan métricas ni dashboards operativos integrados.

## Dependencias externas que afectan la operación

- Proveedor LLM elegido.
- Proveedor de embeddings elegido.
- Motor vectorial elegido.
- OCR_SERVICE_URL cuando CHECK_OCR=1.
- Embedding server cuando se usa embeddings on-premise.
- LangSmith y LangChain Hub si se usan prompt hub y tracing.
- Filesystem con acceso persistente a los documentos fuente indexados.

## Información no disponible en diagnóstico actual

- Procedimiento detallado de migraciones o bootstrap de base de datos.
- Estrategia de backup y restore.
- Pipeline CI/CD asociado al demostrador.
