# Guía de Configuración y Despliegue — Agente de Marketing IA

**Versión:** 1.1  
**Fecha:** Marzo 2026  
**Entornos contemplados:** Desarrollo local · Docker Compose

---

## 1. Requisitos del Sistema

### 1.1 Software necesario

| Componente | Versión mínima | Notas |
|---|---|---|
| Python | 3.11+ | El Dockerfile usa `python:3.11-slim` |
| Docker | 24.x+ | Para despliegue en contenedor |
| Docker Compose | 2.x+ | Plugin integrado en Docker Desktop |
| PostgreSQL | 16 | Usado en Docker Compose |
| pip-tools | opcional | Solo si se recompila `requirements.txt` |

### 1.2 Dependencias externas relevantes

| Servicio | Obligatorio | Uso |
|---|---|---|
| OpenAI API | Sí | LLM principal, imágenes y OCR; potencialmente ASR si se configura un modelo válido |
| Google Generative AI | No | LLM alternativo y transcripción alternativa |
| Meta Graph API | No | Integración Instagram |
| Microsoft Graph API | No | Envío de correo |
| PostgreSQL / SQLite | Sí | Persistencia |
| ngrok | No | Exposición pública opcional |

---

## 2. Variables de Entorno

Crear un archivo `.env` en `/code/` y mantenerlo fuera de control de versiones.

```env
# ============================================================
# CORE
# ============================================================
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://agente:agente_pass@postgres:5432/agente_db
JWT_SECRET=CAMBIAR_POR_VALOR_ALEATORIO_SEGURO
JWT_EXPIRES_MINUTES=60
APP_ENV=dev
ENVIRONMENT=production
UPLOAD_FOLDER=./uploads
MAX_UPLOAD_MB=25

# ============================================================
# EJECUCION APP (solo aplica a python app.py)
# ============================================================
PORT=8081
LOG_LEVEL=INFO

# ============================================================
# LLM Y MODELOS
# ============================================================
IMAGE_MODEL=dall-e-3
OCR_MODEL_NAME=gpt-4o
ASR_MODEL=whisper-1
LLM_INVOKE_RETRIES=0
MAX_DYNAMIC_QUESTIONS=10
FILTER_BY_TOPIC_MAX_ROWS=40
MAX_IMAGE_GENERATED=8
CAMPAIGN_VIDEO_OCR_ENABLED=false
GOOGLE_API_KEY=

# ============================================================
# SCRAPING
# ============================================================
SCRAPER_TIMEOUT=10
SCRAPER_MAX_BYTES=2000000
SCRAPER_MAX_PAGES=20
SCRAPER_MAX_LINKS_PER_PAGE=25
SCRAPER_USE_LLM_ENRICHMENT=false
SCRAPER_USE_SELENIUM_ON_BLOCK=false
SCRAPER_USER_AGENT=

# ============================================================
# STREAMING
# ============================================================
STREAM_CHUNK_SIZE=300

# ============================================================
# EMAIL (Microsoft Graph API)
# ============================================================
EMAIL_FROM_EMAIL=
EMAIL_TENANT_ID=
EMAIL_CLIENT_ID=
EMAIL_CLIENT_SECRET=

# ============================================================
# META / INSTAGRAM (runtime)
# ============================================================
FB_APP_ID=
FB_APP_SECRET=
IG_CLIENT_ID=
FB_GRAPH_BASE_URL=https://graph.facebook.com/v24.0
IG_USERNAME=

# ============================================================
# META / INSTAGRAM (solo bootstrap con init_token.py)
# ============================================================
FB_TEMP_TOKEN=
IG_USER_ID=

# ============================================================
# POSTGRESQL (docker-compose)
# ============================================================
POSTGRES_USER=agente
POSTGRES_PASSWORD=agente_pass
POSTGRES_DB=agente_db

# ============================================================
# NGROK (opcional)
# ============================================================
NGROK_AUTHTOKEN=
```

Notas:

- `ASR_MODEL` debe configurarse con un modelo de transcripción válido. El default anterior `gpt-4o-mini-tts` no es adecuado para ASR.
- `FB_TEMP_TOKEN` e `IG_USER_ID` no son variables de runtime del agente; solo se usan para inicializar el token en BD.
- `PORT` aplica a `python app.py`. En Docker el contenedor Flask se ejecuta con `flask run`, que escucha en el puerto interno 5000.

---

## 3. Instalación y Ejecución

### 3.1 Modo Desarrollo Local (sin Docker)

```bash
cd code/

python -m venv .venv
# Linux/Mac:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt

# Inicializar base de datos
python -m infrastructure.db.init_db

# Solo si se usa Instagram y aún no existe token en BD
python devtools/scripts/init_token.py

# Arrancar la app
python app.py
# → http://localhost:8081
```

### 3.2 Modo Docker Compose

```bash
cd code/

docker compose up --build -d

# Inicializar base de datos
docker compose exec flask-app python -m infrastructure.db.init_db

# Bootstrap de Meta si aplica
docker compose exec flask-app python devtools/scripts/init_token.py

docker compose ps
docker compose logs -f flask-app
```

**Servicios levantados:**

| Servicio | Puerto | Observación |
|---|---|---|
| `postgres` | 5432 | Público según compose |
| `flask-app` | 5000 interno | Expuesto a nginx por `expose` |
| `nginx` | 8081 público | Punto de entrada HTTP |
| `ngrok` | túnel | Solo si se usa el contenedor |

### 3.3 Comportamiento real de Docker Compose

- `flask-app` se construye desde el `Dockerfile` del proyecto.
- El contenedor monta el código fuente y `uploads/` como volúmenes.
- El `Dockerfile` ejecuta `flask run`, no `python app.py`.
- `nginx` hace proxy a `flask-app:5000`.
- `postgres` es dependencia explícita del backend.
- `ngrok` depende de `nginx`, no de Flask directamente.

---

## 4. Configuración de Nginx

El `nginx.conf` actual implementa:

- proxy general hacia `flask-app:5000` en `location /`,
- configuración SSE específica para `location /stream`,
- configuración equivalente para `location /stream_test`.

### Aclaración importante

La ruta Flask `/api/stream` existe, pero **no tiene un bloque dedicado en `nginx.conf`**. Si el frontend o una integración usa `/api/stream` detrás de nginx, esa ruta caerá en `location /` y no tendrá `proxy_buffering off`.

### Recomendación operativa

Si `/api/stream` será una ruta pública estable, agregarle la misma configuración especial que ya existe para `/stream`.

### SSL/TLS

La configuración actual no incluye HTTPS. Antes de exponer el servicio en internet:

1. habilitar TLS en nginx,
2. revisar `secure=True` en la cookie JWT,
3. agregar headers de seguridad HTTP.

---

## 5. Inicialización del Token de Meta (Instagram)

```
1. Crear aplicación en developers.facebook.com
2. Obtener token temporal con scopes requeridos
3. Definir en .env: FB_TEMP_TOKEN, IG_USER_ID, FB_APP_ID, FB_APP_SECRET
4. Ejecutar: python devtools/scripts/init_token.py
5. Verificar que el token quede en service_tokens
```

Este paso es manual. No existe un flujo OAuth completo dentro de la aplicación para onboarding de Instagram.

---

## 6. Carga de Campañas Históricas

1. Acceder a la interfaz de campañas históricas.
2. Subir `.xlsx`, `.xls`, `.csv`, `.json`, `.txt`, `.md` o `.pdf` si el flujo lo permite.
3. El parser normaliza las columnas y persiste los datos.
4. El agente reutiliza esos datos como contexto del flujo.

---

## 7. Actualización de Dependencias

```bash
cd code/
pip install pip-tools
pip-compile requirements.in --output-file requirements.txt

docker compose build --no-cache flask-app
docker compose up -d flask-app
```

---

## 8. Advertencias Importantes

| # | Advertencia | Acción recomendada |
|---|---|---|
| A1 | `JWT_SECRET` tiene valor inseguro por defecto | Cambiar obligatoriamente antes de exponer el sistema |
| A2 | `MemorySaver` pierde el estado del grafo al reiniciar | Planificar checkpointer persistente |
| A3 | `ENVIRONMENT=development` simula llamadas LLM | Usar `production` en entornos reales |
| A4 | Selenium no viene instalado en la imagen base | Mantener `SCRAPER_USE_SELENIUM_ON_BLOCK=false` o construir una imagen especializada |
| A5 | `ASR_MODEL` debe ajustarse a un modelo de transcripción válido | Configurar `whisper-1` u otro modelo ASR soportado |
| A6 | `/api/stream` no tiene tuning SSE dedicado en nginx | Alinear `nginx.conf` si la ruta se usará públicamente |
| A7 | `.env` no debe contener credenciales versionadas | Verificar `.gitignore` y rotación de secretos si hubo exposición |
| A8 | `FB_TEMP_TOKEN` e `IG_USER_ID` son solo para bootstrap | No confundir con variables permanentes del runtime |
