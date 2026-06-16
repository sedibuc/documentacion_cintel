# PoC DIE — Las Galias · Contexto completo para implementación

> Este archivo contiene **toda la información técnica y funcional** necesaria para implementar la Prueba de Concepto del Document Intelligence Engine (DIE) para el cliente Las Galias. Coloca este archivo en una carpeta vacía y úsalo como contexto inicial para el agente de desarrollo.

---

## 0. Resumen ejecutivo

**Nombre del proyecto:** PoC DIE Las Galias  
**Cliente:** Las Galias (empresa del sector inmobiliario)  
**Desarrollador:** CINTEL — 1 ingeniero  
**Período:** Jun 9 – Jun 30, 2026 (3 sprints semanales, ~16 días hábiles)  
**Objetivo:** construir una Prueba de Concepto funcional del Document Intelligence Engine capaz de extraer campos estructurados de Certificados de Tradición y Libertad (CTL) usando LLMs, validar los resultados contra referencias provistas por el cliente y generar alertas de discrepancia.

**Tipo documental único:** `DOC_CTL` — Certificado de Tradición y Libertad emitido por la SNR (Superintendencia de Notariado y Registro) colombiana.

**Restricción crítica:** la PoC se limita **exclusivamente** a `DOC_CTL`. No incluye `DOC_ESCRITURA` ni ningún otro tipo documental. No incluye integración por servicio web externo ni por FTP/SFTP.

---

## 1. Alcance funcional

### 1.1 Qué incluye

1. **Ingesta documental**: carga manual de PDFs vía API REST. `tenant_id = "las-galias"` fijo. `doc_type = "DOC_CTL"` único.
2. **Extracción de contenido**: el PDF se convierte a base64 y se envía **directamente** al LLM en modo multimodal. No hay detección previa del tipo de contenido (texto embebido / escaneado / imagen). No hay OCR. El LLM procesa el archivo tal como llega. Esta decisión es válida para v1 y no afecta la evaluación de logprobs.
3. **Extracción estructurada (LLM)**: invocación del LLM con prompt versionado + guardrails + few-shots + schema JSON de 14 campos obligatorios. Evaluación de `logprobs` por campo para marcar confianza baja.
4. **Validación interna**: verificación determinística de tipos de dato, formatos y campos obligatorios contra el schema del tipo documental.
5. **Módulo administrativo**: interfaz web + API para que Las Galias cargue su Excel de referencia y mapee sus columnas a los campos JSON del extractor.
6. **Validación cruzada (CrossValidator)**: comparación campo a campo del resultado extraído contra el archivo de referencia cargado por el admin. Clasificación: `MATCH`, `MISMATCH`, `PENDIENTE`.
7. **Alertas de discrepancia**: generación de alertas por cada `MISMATCH` con severidad `BLOCKING`, `WARNING` o `INFO`.
8. **Salida estructurada**: exportación de resultados en JSON y CSV por documento y por lote (hasta 20 docs).
9. **Trazabilidad**: registro inmutable en JSONL de cada ejecución: tenant_id, documento, modelo, prompt_version, tokens, latencia, logprobs_min, resultado.
10. **Observabilidad LLM**: MLflow local para tracking de experimentos, F1-score por campo, comparación prompt v1 vs v2.

### 1.2 Qué excluye (pero está en el TO-BE futuro)

| Exclusión | Razón |
|---|---|
| Multi-tenant management (UI, onboarding) | PoC mono-tenant; `tenant_id` fijo |
| RBAC completo | Un solo usuario admin |
| LLM Gateway con fallbacks y load balancing | Proveedor único |
| Procesamiento batch asíncrono (Celery + Redis) | Síncrono suficiente para la PoC |
| UI completa de revisión humana | Solo API + CLI |
| DocumentSchemaRegistry dinámico | Schemas en archivos JSON en disco |
| Prompt Registry en BD | Prompts en archivos con versión en nombre |
| Audit Service inmutable en BD separada | JSONL local suficiente |
| OCR fallback | LLM-first cubre todos los casos en v1 |
| Observabilidad Grafana completa | MLflow local suficiente |
| Integración por servicio web externo (SOAP/REST) | Requiere acuerdos post-PoC |
| Integración por FTP/SFTP | Carga manual suficiente para validar el extractor |
| Soporte a DOC_ESCRITURA (Escritura Pública) | Fuera de alcance explícito de la PoC |

### 1.3 Casos de uso cubiertos

| ID | Caso de uso | Sprint |
|---|---|---|
| CU-01 | Procesar un `DOC_CTL` individual y obtener salida estructurada JSON | Sprint 1 |
| CU-02 | Cargar y procesar un lote de hasta 20 documentos `DOC_CTL` | Sprint 2 |
| CU-04 | Configurar template de referencia desde el módulo admin (cargar Excel) | Sprint 2 |
| CU-05 | Comparar campos extraídos contra template (match JSON ↔ columnas Excel) | Sprint 2 |
| CU-06 | Identificar y clasificar discrepancias BLOCKING/WARNING/INFO | Sprint 2 |
| CU-07 | Exportar resultados de un lote (JSON resumen + CSV por documento) | Sprint 2 |
| CU-08 | Consultar historial de ejecuciones por tenant | Sprint 3 |
| CU-09 | Evaluar prompt v2 vs v1 con MLflow y ajustar thresholds | Sprint 3 |

### 1.4 Criterios técnicos de éxito

| Criterio | Umbral mínimo |
|---|---|
| CU-01 ejecutable E2E sin bloqueo | 100% sobre 10 docs de prueba |
| Completitud de campos obligatorios extraídos | ≥ 80% |
| Precisión de extracción (campos críticos) | ≥ 85% F1-score vs referencia |
| CrossValidator operativo | 100% sin error |
| Trazabilidad en 100% de ejecuciones | Verificado en BD/JSONL |
| Latencia de procesamiento individual | < 30 seg/doc (excl. LLM cold start) |

---

## 2. Arquitectura

### 2.1 Principio de diseño

La PoC replica la **estructura de capas y contratos** del TO-BE DIE, con implementaciones simplificadas. Regla clave: cualquier componente debe poder ser **reemplazado** por su equivalente TO-BE sin cambiar contratos de datos ni estructura de código.

### 2.2 Componentes

| Componente PoC | Equivalente TO-BE | Tecnología | Simplificación |
|---|---|---|---|
| FastAPI REST API | API Backend | FastAPI (Python 3.11+) | Sin RBAC; auth por API Key |
| Módulo Administrativo | Alert Dashboard + SchemaRegistry UI | FastAPI + HTML/JS simple | Carga Excel + mapeo campos |
| Content Extraction Service | Content Extraction Strategy Service | PDF base64 → LLM directo | Sin OCR fallback |
| LLM Client | LLM Gateway | LiteLLM | Sin multi-proveedor; solo rate-limit básico |
| StructuredExtractor | StructuredExtractor | Python + Pydantic v2 | Idéntico al TO-BE |
| Schema Loader | DocumentSchemaRegistry | Archivos JSON en disco | Sin BD; precargado al inicio |
| Prompt Loader | Prompt Registry | Archivos `.txt` con versión en nombre | Sin BD |
| ValidationEngine | Validation Engine | Python determinístico | Idéntico al TO-BE |
| CrossValidator | CrossValidator | Python + pandas | Idéntico al TO-BE |
| DiscrepancyAlertEngine | DiscrepancyAlertEngine | Python | Idéntico al TO-BE |
| AuditLog | Audit Service | Archivos JSONL rotativos | Sin BD inmutable separada |
| PostgreSQL / SQLite | PostgreSQL RLS | PostgreSQL 15 (SQLite para dev) | Sin RLS; `tenant_id` presente |
| Docker Compose | Kubernetes | Docker Compose single-node | Sin orquestación |

### 2.3 Flujo de extracción (resumen)

```
POST /documents/upload (PDF + doc_type="DOC_CTL")
  → Registrar Document en PostgreSQL (tenant_id="las-galias")
  → Almacenar archivo en STORAGE_PATH
  → Convertir PDF a base64
  → Cargar schema DOC_CTL_v1.json
  → Cargar prompt versionado (guardrails + few-shots)
  → Invocar LLM (GPT-4o / Gemini Flash) vía LiteLLM con PDF base64 + schema + prompt
  → Parsear respuesta con Pydantic (JSON mode)
  → Evaluar logprobs por campo
    → Si logprob < 0.85: marcar campo como LOW_CONFIDENCE
    → Si salida inválida: reintento hasta 3 veces → ERROR si falla
  → ValidationEngine (tipos, formatos, campos obligatorios)
  → CrossValidator (si mapeo admin disponible: MATCH/MISMATCH/PENDIENTE)
    → DiscrepancyAlertEngine: generar alertas BLOCKING/WARNING/INFO
  → Persistir DocumentExtraction (campos + logprobs + tokens + latencia)
  → AuditLog JSONL + MLflow métricas
  → GET /extractions/{id} → JSON con campos + alertas
```

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Runtime | Python | 3.11+ |
| API Framework | FastAPI + Uvicorn | latest |
| ORM | SQLAlchemy | 2.x |
| Base de datos | PostgreSQL | 15 (o SQLite para dev) |
| LLM SDK | LiteLLM | latest |
| Structured Output | Pydantic | v2 |
| Cross Validation | pandas | latest |
| Contenerización | Docker Compose | latest |
| Observabilidad LLM | MLflow | local |
| Config | python-dotenv | latest |

---

## 4. Estructura del proyecto

```
poc-die-las-galias/
├── docker-compose.yml            # Arranque en 1 comando
├── .env.example                  # Template de variables de entorno
├── README.md                     # Instrucciones de arranque
├── requirements.txt
├── alembic/                      # Migraciones BD
│   └── versions/
├── schemas/                      # Schemas documentales JSON
│   └── DOC_CTL_v1.json
├── prompts/                      # Prompts versionados con guardrails
│   ├── DOC_CTL_v1.txt
│   └── DOC_CTL_v2.txt            # Ajustado en Sprint 2
├── data/
│   ├── documents/                # PDFs cargados (montado como volumen Docker)
│   └── reference_mappings/       # Configuración de mapeos Excel↔JSON por tenant
├── app/
│   ├── main.py                   # FastAPI + routers
│   ├── config.py                 # Settings desde .env
│   ├── models/
│   │   ├── document.py           # Document, DocumentExtraction, DiscrepancyAlert
│   │   ├── reference_mapping.py  # ReferenceMapping (config módulo admin)
│   │   └── audit.py              # AuditLog
│   ├── services/
│   │   ├── content_extraction.py # ContentExtractionService (PDF base64 → LLM directo)
│   │   ├── structured_extractor.py # StructuredExtractor (LLM + Pydantic)
│   │   ├── llm_client.py         # LiteLLM wrapper
│   │   ├── validation_engine.py  # ValidationEngine determinístico
│   │   ├── cross_validator.py    # CrossValidator con mapeo del módulo admin
│   │   ├── discrepancy_alerts.py # DiscrepancyAlertEngine
│   │   └── audit_service.py      # AuditLog JSONL
│   ├── schemas/                  # Pydantic schemas de request/response
│   │   ├── document.py
│   │   ├── extraction.py
│   │   └── alert.py
│   └── routers/
│       ├── documents.py
│       ├── extractions.py
│       ├── batches.py
│       ├── history.py
│       └── admin.py
└── mlruns/                       # MLflow tracking local
```

---

## 5. Variables de entorno

```bash
# .env (nunca en control de versiones)
TENANT_ID=las-galias
LLM_PROVIDER=openai               # openai | google | anthropic
LLM_MODEL=gpt-4o                  # gpt-4o | gemini/gemini-1.5-flash
LLM_API_KEY=sk-...                # clave API del proveedor LLM
DATABASE_URL=postgresql://poc_user:poc_pass@db:5432/poc_die
# Para desarrollo local sin Docker:
# DATABASE_URL=sqlite:///./poc_die.db
STORAGE_PATH=./data/documents
LOG_LEVEL=INFO
LOGPROB_CONFIDENCE_THRESHOLD=0.85 # umbral para marcar campo como LOW_CONFIDENCE
MAX_RETRIES_LLM=3                 # reintentos en fallo LLM
API_KEY=poc-las-galias-key        # clave de autenticación simple de la API
```

---

## 6. Modelos de datos (SQLAlchemy)

```python
# app/models/document.py
class Document(Base):
    __tablename__ = "documents"
    id: UUID                          # PK
    tenant_id: str = "las-galias"     # fijo en PoC; parametrizable en TO-BE
    doc_type: str                     # "DOC_CTL" — único tipo en PoC
    filename: str
    file_path: str                    # ruta en STORAGE_PATH
    status: str                       # PENDING | PROCESSING | DONE | ERROR
    uploaded_at: datetime
    processed_at: datetime | None

class DocumentExtraction(Base):
    __tablename__ = "document_extractions"
    id: UUID                          # PK
    tenant_id: str
    document_id: UUID                 # FK → documents.id
    model_used: str                   # "gpt-4o"
    prompt_version: str               # "DOC_CTL_v1"
    extracted_fields: dict            # JSON con campos extraídos + logprob por campo
    logprobs_min: float | None        # mínimo logprob en la extracción
    low_confidence_fields: list[str]  # campos con logprob < umbral
    completeness_score: float         # % de campos obligatorios extraídos
    tokens_input: int
    tokens_output: int
    latency_ms: int
    status: str                       # DONE | ERROR
    created_at: datetime

class DiscrepancyAlert(Base):
    __tablename__ = "discrepancy_alerts"
    id: UUID
    tenant_id: str
    extraction_id: UUID               # FK → document_extractions.id
    field_name: str
    extracted_value: str
    reference_value: str
    severity: str                     # BLOCKING | WARNING | INFO
    status: str                       # OPEN | RESOLVED | DISMISSED
    created_at: datetime

class ReferenceMapping(Base):
    __tablename__ = "reference_mappings"
    id: UUID
    tenant_id: str
    doc_type: str
    mapping_version: str              # "v1-jun-17"
    excel_columns: list[str]          # columnas del Excel de Las Galias
    field_mapping: dict               # { "columna_excel": "campo_json" }
    rows_count: int
    is_active: bool
    created_at: datetime
```

---

## 7. Schema documental DOC_CTL

```json
{
  "doc_type": "DOC_CTL",
  "version": "1.0",
  "fields": [
    { "name": "matricula_inmobiliaria", "type": "string",  "required": true,  "description": "Número de matrícula inmobiliaria (ej: 50C-1234567)" },
    { "name": "codigo_orip",           "type": "string",  "required": true,  "description": "Código de la Oficina de Registro (ORIP)" },
    { "name": "departamento",          "type": "string",  "required": true,  "description": "Departamento donde está registrado el inmueble" },
    { "name": "municipio",             "type": "string",  "required": true,  "description": "Municipio de registro" },
    { "name": "tipo_predio",           "type": "string",  "required": false, "description": "Urbano / Rural / Propiedad horizontal" },
    { "name": "direccion",             "type": "string",  "required": true,  "description": "Dirección del inmueble" },
    { "name": "propietario_nombre",    "type": "string",  "required": true,  "description": "Nombre del propietario actual" },
    { "name": "propietario_cedula",    "type": "string",  "required": true,  "description": "Cédula o NIT del propietario" },
    { "name": "gravamenes",            "type": "array",   "required": false, "description": "Lista de gravámenes, hipotecas o limitaciones vigentes" },
    { "name": "area_terreno_m2",       "type": "number",  "required": false, "description": "Área del terreno en m²" },
    { "name": "area_construida_m2",    "type": "number",  "required": false, "description": "Área construida en m²" },
    { "name": "fecha_expedicion",      "type": "date",    "required": true,  "description": "Fecha de expedición del certificado (YYYY-MM-DD)" },
    { "name": "folios_anteriores",     "type": "array",   "required": false, "description": "Números de folios anteriores vinculados" },
    { "name": "vigente",               "type": "boolean", "required": true,  "description": "Si el certificado está vigente o fue reemplazado" }
  ]
}
```

**Campos requeridos (7):** `matricula_inmobiliaria`, `codigo_orip`, `departamento`, `municipio`, `direccion`, `propietario_nombre`, `propietario_cedula`, `fecha_expedicion`, `vigente`  
**Campos opcionales (5):** `tipo_predio`, `gravamenes`, `area_terreno_m2`, `area_construida_m2`, `folios_anteriores`

---

## 8. Prompt de extracción DOC_CTL v1

```
Eres un extractor de datos estructurado para documentos legales colombianos del sector inmobiliario.
Tu tarea es extraer los campos indicados del Certificado de Tradición y Libertad adjunto
y devolver ÚNICAMENTE un JSON válido sin explicaciones adicionales.

TIPO DOCUMENTAL: Certificado de Tradición y Libertad (CTL)
ENTIDAD EMISORA: Superintendencia de Notariado y Registro (SNR) — Oficina de Registro de Instrumentos Públicos (ORIP)
CLIENTE: Las Galias

CAMPOS A EXTRAER:
- matricula_inmobiliaria: número de matrícula inmobiliaria (ej: "50C-1234567") (string)
- codigo_orip: código de la ORIP (ej: "050C") (string)
- departamento: departamento de registro (string)
- municipio: municipio de registro (string)
- tipo_predio: Urbano / Rural / Propiedad horizontal (string o null)
- direccion: dirección del inmueble (string)
- propietario_nombre: nombre o razón social del propietario actual (string)
- propietario_cedula: cédula o NIT del propietario, SOLO CARACTERES ALFANUMÉRICOS (string)
- gravamenes: lista de gravámenes, hipotecas o limitaciones vigentes (array de strings, vacío [] si ninguno)
- area_terreno_m2: área del terreno en m², NÚMERO DECIMAL (number o null)
- area_construida_m2: área construida en m², NÚMERO DECIMAL (number o null)
- fecha_expedicion: fecha de expedición del certificado en formato YYYY-MM-DD (string)
- folios_anteriores: lista de números de folios anteriores vinculados (array de strings, vacío [] si ninguno)
- vigente: true si el certificado está vigente; false si fue reemplazado (boolean)

GUARDRAILS — NO DEBES:
- Inventar datos que no aparecen explícitamente en el documento
- Asumir valores cuando el documento es ambiguo; usa null en su lugar
- Incluir puntos de miles ni caracteres especiales en áreas numéricas
- Devolver texto fuera del JSON

EJEMPLO (few-shot):
Entrada fragmento CTL: "MATRÍCULA: 50C-1234567 | PROPIETARIO: LAS GALIAS S.A.S. | NIT: 900123456-7 | HIPOTECA a favor de: Banco de Bogotá"
Salida: {"matricula_inmobiliaria": "50C-1234567", "propietario_nombre": "LAS GALIAS S.A.S.", "propietario_cedula": "900123456-7", "gravamenes": ["Hipoteca a favor de Banco de Bogotá"], ...}

Devuelve ÚNICAMENTE el JSON con los campos solicitados.
```

---

## 9. Contrato de API REST

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/documents/upload` | Cargar un PDF para procesamiento |
| `GET` | `/documents/{doc_id}` | Consultar estado de un documento |
| `POST` | `/documents/{doc_id}/process` | Iniciar extracción de un documento cargado |
| `GET` | `/extractions/{extraction_id}` | Consultar resultado completo de una extracción |
| `GET` | `/extractions/{extraction_id}/alerts` | Consultar alertas de discrepancia de una extracción |
| `POST` | `/batches` | Crear y ejecutar un lote de documentos (hasta 20) |
| `GET` | `/batches/{batch_id}` | Consultar estado y métricas de un lote |
| `GET` | `/batches/{batch_id}/export/csv` | Exportar resultados del lote en CSV |
| `GET` | `/batches/{batch_id}/export/json` | Exportar resultados del lote en JSON |
| `GET` | `/history` | Historial de ejecuciones del tenant |
| `POST` | `/admin/reference-template/upload` | Cargar Excel de referencia |
| `GET` | `/admin/reference-template/fields` | Ver columnas Excel + campos JSON disponibles |
| `POST` | `/admin/reference-template/mapping` | Guardar mapeo columna Excel ↔ campo JSON |
| `GET` | `/admin/reference-template/mapping` | Consultar mapeo activo actual |

**Autenticación:** header `X-API-Key: poc-las-galias-key` en todos los endpoints.

### 9.1 Ejemplo de respuesta de extracción

```json
{
  "extraction_id": "abc123-def456-...",
  "tenant_id": "las-galias",
  "doc_id": "550e8400-...",
  "doc_type": "DOC_CTL",
  "model_used": "gpt-4o",
  "prompt_version": "DOC_CTL_v1",
  "status": "DONE",
  "completeness_score": 0.93,
  "extracted_fields": {
    "matricula_inmobiliaria": { "value": "50C-1234567",           "confidence": "HIGH",          "logprob": 0.98 },
    "codigo_orip":            { "value": "050C",                  "confidence": "HIGH",          "logprob": 0.97 },
    "departamento":           { "value": "Cundinamarca",          "confidence": "HIGH",          "logprob": 0.99 },
    "municipio":              { "value": "Bogotá D.C.",           "confidence": "HIGH",          "logprob": 0.99 },
    "tipo_predio":            { "value": "Propiedad horizontal",  "confidence": "HIGH",          "logprob": 0.94 },
    "direccion":              { "value": "Cra 7 No 24-89 Apt 401","confidence": "HIGH",          "logprob": 0.95 },
    "propietario_nombre":     { "value": "LAS GALIAS S.A.S.",     "confidence": "HIGH",          "logprob": 0.98 },
    "propietario_cedula":     { "value": "900123456-7",           "confidence": "HIGH",          "logprob": 0.97 },
    "gravamenes":             { "value": ["Hipoteca Banco Bogotá"],"confidence": "MEDIUM",       "logprob": 0.81 },
    "area_terreno_m2":        { "value": null,                    "confidence": "HIGH",          "logprob": 0.96 },
    "area_construida_m2":     { "value": 82.5,                    "confidence": "HIGH",          "logprob": 0.93 },
    "fecha_expedicion":       { "value": "2026-06-10",            "confidence": "HIGH",          "logprob": 0.99 },
    "folios_anteriores":      { "value": [],                      "confidence": "HIGH",          "logprob": 0.95 },
    "vigente":                { "value": true,                    "confidence": "LOW_CONFIDENCE","logprob": 0.68 }
  },
  "cross_validation": {
    "mapping_version": "v1-jun-17",
    "results": {
      "matricula_inmobiliaria": "MATCH",
      "propietario_nombre":     "MATCH",
      "propietario_cedula":     "MATCH",
      "fecha_expedicion":       "MATCH",
      "direccion":              "MISMATCH",
      "gravamenes":             "PENDIENTE",
      "vigente":                "PENDIENTE"
    },
    "summary": { "MATCH": 4, "MISMATCH": 1, "PENDIENTE": 2 }
  },
  "tokens_input": 2140,
  "tokens_output": 380,
  "latency_ms": 3870,
  "logprobs_min": 0.68,
  "low_confidence_fields": ["vigente"],
  "created_at": "2026-06-18T10:31:22Z"
}
```

---

## 10. Docker Compose

```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    volumes:
      - ./data/documents:/app/data/documents
      - ./data/reference_mappings:/app/data/reference_mappings
      - ./prompts:/app/prompts
      - ./schemas:/app/schemas
    depends_on:
      db:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: poc_die
      POSTGRES_USER: poc_user
      POSTGRES_PASSWORD: poc_pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U poc_user -d poc_die"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Arranque:**
```bash
cp .env.example .env
# Editar .env: agregar LLM_API_KEY
docker-compose up --build
# API: http://localhost:8000
# OpenAPI docs: http://localhost:8000/docs
```

---

## 11. Prerequisitos externos

| ID | Descripción | Responsable | Fecha máx. |
|---|---|---|---|
| **PRE-00** | **Reunión de contexto con Las Galias** — 1 hora. CINTEL presenta el objetivo a alto nivel (15 min). Las Galias demuestra su flujo actual con CTL real #1 (20 min) y CTL real #2 (15 min). Definición de campos BLOCKING vs INFO + próximos pasos (10 min). Entregables: schema borrador validado informalmente, 3-5 few-shots, lista de campos de alta ambigüedad. | CINTEL convoca / Las Galias demuestra | **Jun 11, 2026** |
| **PRE-01** | **Credenciales LLM operativas** — API Key activa (OpenAI GPT-4o o Google Gemini Flash) con cuota para ~400 invocaciones. | CINTEL | **Jun 9, 2026** |
| **PRE-02** | **Ambiente de desarrollo** — Docker Desktop, Python 3.11+, Git, PostgreSQL 15. | Ingeniero | **Jun 9, 2026** |
| **PRE-03** | **Corpus documental Las Galias** — mínimo 20 CTLs en PDF. Variados: distintas ORIP, formatos, mezcla digitales/escaneados. Canal seguro. | Las Galias / CINTEL | **Jun 13, 2026** |
| **PRE-04** | **Schema de campos validado** — confirmación de los 14 campos (nombre, tipo, obligatoriedad, descripción, ejemplos). Correo de aprobación o documento firmado. | Las Galias aprueba / CINTEL propone | **Jun 13, 2026** |
| **PRE-05** | **Autorización para tratamiento de datos reales** — aval formal para procesar PDFs reales en ambiente controlado. Sin aval: la PoC continúa con documentos sintéticos. | Las Galias aprueba / CINTEL solicita | **Jun 13, 2026** |
| **PRE-06** | **Template Excel en módulo admin** — Las Galias usa el módulo admin de la PoC (disponible en Sprint 2) para cargar su Excel y mapear columnas a campos JSON. No requiere preparación previa. | Las Galias opera / CINTEL soporta | **Jun 17, 2026** |

**Contingencias:**
- PRE-00 no se agenda: construir prompt v1 con CTLs públicos del portal SNR.
- PRE-01 no disponible Jun 9: usar Gemini Free Tier (1 RPM); Sprint 1 avanza lento.
- PRE-03 no disponible Jun 13: usar CTLs públicos de la SNR como fallback.
- PRE-05 sin autorización: trabajar con documentos sintéticos. PoC técnicamente válida.

---

## 12. Cronograma — Sprints semanales

### Sprint 1 — Jun 9–13 (5 días hábiles)
**Objetivo:** ambiente funcional + extractor LLM operativo sobre DOC_CTL.  
**Hito 1 (Jun 13):** extractor LLM operativo para DOC_CTL. CU-01 completado.

| Día | Actividad | Entregable |
|---|---|---|
| Jun 9 (Lun) | Setup ambiente (Docker, Python 3.11, PostgreSQL), configuración `LLM_API_KEY`, estructura base FastAPI | Ambiente funcional; API arranca |
| Jun 10 (Mar) | Ingesta documental: `POST /documents/upload`, `GET /documents/{id}`, modelo `Document` con `tenant_id="las-galias"` | Ingesta funcional; docs en BD |
| Jun 11 (Mié) | Content Extraction Service (PDF base64 → LLM). Schema `DOC_CTL_v1.json`. **PRE-00: Reunión de contexto con Las Galias.** | Schema validado; few-shots disponibles |
| Jun 12 (Jue) | StructuredExtractor LLM: prompt v1 con guardrails y few-shots. Evaluación de logprobs. Primera extracción. | Extractor LLM operativo |
| Jun 13 (Vie) | ValidationEngine (campos obligatorios, tipos). Ajuste prompts. Prueba de 10 CTLs. | Extractor CTL ajustado; prompt v1 estable |

### Sprint 2 — Jun 16–20 (5 días hábiles)
**Objetivo:** CrossValidator con módulo admin + AlertEngine + métricas con corpus real.  
**Hito 2 (Jun 20):** CrossValidator operativo, alertas, métricas con datos reales. CU-02 a CU-07.

| Día | Actividad | Prerequisito | Entregable |
|---|---|---|---|
| Jun 16 (Lun) | Módulo admin: UI + endpoint para cargar Excel de referencia. Visualización columnas vs. campos JSON. | PRE-03, PRE-04, PRE-05 | Módulo admin operativo |
| Jun 17 (Mar) | Interfaz de mapeo columna Excel ↔ campo JSON. Las Galias completa PRE-06. Persistencia del mapeo. | **PRE-06** | Mapeo guardado y activo |
| Jun 18 (Mié) | CrossValidator: comparación campo a campo usando el mapeo del admin. | PRE-06 | CrossValidator con datos reales |
| Jun 19 (Jue) | DiscrepancyAlertEngine: BLOCKING/WARNING/INFO. Exportación JSON/CSV. | — | Alertas; exportación funcional |
| Jun 20 (Vie) | Métricas de calidad: F1-score, logprobs. Prompt v2 en MLflow. Lote de ~20 docs. | PRE-03 | Métricas; prompt v2 |

### Sprint 3 — Jun 23–30 (6 días hábiles)
**Objetivo:** integración E2E, ajuste final, documentación y entrega formal.  
**Hito 3 (Jun 30):** PoC entregada con evidencias E2E, métricas y documentación. CU-09.

| Día | Actividad | Entregable |
|---|---|---|
| Jun 23 (Lun) | Historial de ejecuciones (CU-08). AuditLog completo (JSONL). | CU-08; trazabilidad completa |
| Jun 24 (Mar) | Pruebas E2E con corpus completo (~35 docs reales). Evidencias en MLflow. | Evidencias E2E |
| Jun 25 (Mié) | Evaluación prompt v2 vs v1 (CU-09). Ajuste thresholds logprob y severidades. | Configuración final validada |
| Jun 26 (Jue) | Docker Compose final. README con arranque en 1 comando. Datos de demo (10 docs). | PoC desplegable |
| Jun 27 (Vie) | Documentación técnica: OpenAPI, guía de configuración, descripción de schemas. | Docs técnicos completos |
| Jun 30 (Lun) | Sesión de demostración y entrega formal con Las Galias. | **Entrega de la PoC** |

---

## 13. Módulo administrativo — Flujo de template de referencia

Las Galias NO entrega un CSV con formato previo. En cambio usa el módulo admin de la propia PoC:

1. **Cargar Excel** — Las Galias sube su archivo con registros de referencia.
2. **Ver columnas** — el sistema muestra columnas detectadas del Excel.
3. **Ver campos JSON** — el sistema muestra los campos del schema del extractor.
4. **Mapear** — Las Galias asigna cada columna a su campo JSON correspondiente.
5. **Guardar** — el mapeo se persiste en BD y el CrossValidator lo usa automáticamente.

```bash
# Cargar Excel
POST /admin/reference-template/upload
  file=registros_ctl_referencia.xlsx
  doc_type=DOC_CTL

# Guardar mapeo
POST /admin/reference-template/mapping
{
  "upload_id": "tpl-001",
  "mapping": {
    "Matricula":    "matricula_inmobiliaria",
    "Propietario":  "propietario_nombre",
    "Cedula NIT":   "propietario_cedula",
    "Fecha CTL":    "fecha_expedicion",
    "Direccion":    "direccion",
    "Gravamenes":   "gravamenes",
    "Area m2":      "area_construida_m2"
  }
}
```

---

## 14. Riesgos principales

| ID | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R-01 | Corpus de datos de Las Galias no disponible a tiempo | Media | Alto | Generar 20 CTLs sintéticos como fallback desde el día 1 |
| R-02 | Baja calidad LLM (F1 < 70%) en documentos reales | Media | Alto | Prompt con guardrails estrictos + ≥ 3 few-shots. Reservar 1.5 días Sprint 2 para refinamiento |
| R-03 | Dataset de referencia (PRE-06) incompleto o inconsistente | Media | Alto | Entregar template + guía a Las Galias con anticipación. Script de validación de Excel en cuanto llega |
| R-04 | Costos LLM exceden presupuesto | Baja | Medio | Estimación total < $5 USD (60 docs × ~2000 tokens × $0.005/1K) |
| R-05 | Latencia LLM > 30 seg/doc | Media | Medio | `asyncio` paralelo si la API LLM lo permite |
| R-06 | Cambio de alcance solicitado por Las Galias | Media | Medio | Congelar scope el Jun 11 (firma de schema) |

---

## 15. Sesión de demostración (Jun 30) — Guion

Duración: 30–40 minutos.

1. **Arranque** (2 min): `docker-compose up` — sistema en línea en < 2 min.
2. **Módulo admin** (5 min): carga del Excel de referencia de Las Galias, mapeo de columnas a campos JSON.
3. **Ingesta individual DOC_CTL** (5 min): cargar `ctl_50C_123456.pdf`, ejecutar extracción, mostrar JSON con campos y logprobs.
4. **CrossValidator** (5 min): resultado de validación cruzada con el mapeo activo; identificar MATCH/MISMATCH.
5. **Alertas** (5 min): alertas generadas; explicar severidades BLOCKING/WARNING/INFO.
6. **Lote de 10 documentos CTL** (5 min): ejecutar lote, mostrar métricas de resumen, exportar CSV.
7. **Trazabilidad** (3 min): audit log de todas las ejecuciones.
8. **Métricas de calidad** (5 min): MLflow tracking — F1-score por campo, latencia, tokens, prompt v1 vs v2.

---

## 16. Decisiones de diseño clave (no cambiar)

1. **`tenant_id = "las-galias"` fijo** en todos los modelos. Parametrizable en TO-BE sin refactorización.
2. **PDF → base64 → LLM directo.** Sin detección previa de tipo de contenido. Sin OCR. El LLM multimodal (GPT-4o, Gemini) procesa el archivo completo. Esto es válido para v1 y suficiente para la evaluación de logprobs.
3. **LLM-first extraction.** No se usa PyMuPDF ni ninguna extracción nativa de texto.
4. **logprob threshold = 0.85.** Campos con logprob < 0.85 se marcan como `LOW_CONFIDENCE`.
5. **Reintentos LLM = 3.** Si después de 3 intentos la salida no es JSON válido, el estado de la extracción es `ERROR`.
6. **Módulo admin en lugar de CSV pre-preparado.** Las Galias usa directamente la UI del módulo admin para cargar su Excel y mapear columnas. No se le pide ningún formato específico.
7. **Schemas y prompts en disco** (no en BD). Versionados en el nombre del archivo: `DOC_CTL_v1.json`, `DOC_CTL_v1.txt`, `DOC_CTL_v2.txt`.
8. **Sin integración por servicio web ni FTP** en la PoC. Carga manual vía API REST es suficiente para validar el extractor.
9. **CrossValidator solo se ejecuta si el mapeo admin está activo.** Si no hay mapeo (PRE-06 no completado), los campos de cross_validation se marcan como `PENDIENTE`.
10. **MLflow local.** No se requiere servidor MLflow remoto. `mlruns/` en el directorio del proyecto.

---

## 17. Evolución PoC → TO-BE MultiTenant (referencia)

| Capa | En PoC | En TO-BE |
|---|---|---|
| Datos | `tenant_id` fijo "las-galias" | `tenant_id` dinámico + RLS PostgreSQL |
| Autenticación | API Key simple | JWT + RBAC por tenant |
| LLM | LiteLLM directo | LLM Gateway (rate-limit, fallback, cache) |
| Schemas | JSON en disco | DocumentSchemaRegistry en BD con API |
| Prompts | Archivos en disco | Prompt Registry en BD versionado |
| Queue | Síncrono | Celery + Redis |
| UI | API + CLI | Alert Dashboard completo |
| Audit | JSONL local | BD inmutable + API de consulta |

---

*Última actualización: Jun 9, 2026 — CINTEL*
