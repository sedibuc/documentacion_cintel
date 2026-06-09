#!/usr/bin/env python3
"""Write updated prototipo.md for poc-die."""
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = os.path.join(BASE, "poc-die", "content", "prototipo.md")

CONTENT = r"""# Prototipo de la PoC — API, contratos, módulo administrativo y mockup navegable

<div class="badge-row">
<span class="badge">Sección 4 de 5</span>
<span class="badge">FastAPI + Docker Compose</span>
<span class="badge">REST API documentada</span>
<span class="badge">Prototipo navegable incluido</span>
</div>

> **Qué es esta sección:** especificación del prototipo funcional de la PoC: estructura del proyecto, contrato de API REST, módulo administrativo de templates de referencia, ejemplos de entrada y salida para el tipo documental principal `DOC_CTL` (Certificado de Tradición y Libertad) y prototipo navegable de las pantallas de la interfaz.

---

## 1. Prototipo navegable (pantallas)

Explora el flujo completo de la PoC DIE a través de pantallas interactivas. Las pantallas muestran la interfaz propuesta para el sistema completo incluyendo el módulo administrativo de configuración de templates de referencia.

<div class="mockup-launcher">
<a href="assets/mockups/login.html" class="btn-mockup" target="_blank">
  ▶ Abrir prototipo navegable
</a>
<p class="mockup-note">Se abre en una nueva pestaña. Navega entre pantallas usando los botones internos.</p>
</div>

### Pantallas incluidas

| Pantalla | Descripción |
|---|---|
| [Login](assets/mockups/login.html) | Acceso al sistema con credenciales |
| [Dashboard](assets/mockups/dashboard.html) | Lista de documentos y estado de procesamiento |
| [Carga de documento](assets/mockups/upload.html) | Subir PDF con selector de tipo documental |
| [Resultado de extracción](assets/mockups/extraction.html) | Campos extraídos con confianza y logprobs |
| [Validación cruzada](assets/mockups/validation.html) | Comparación MATCH/MISMATCH/PENDIENTE por campo |
| [Alertas](assets/mockups/alerts.html) | Lista de alertas BLOCKING/WARNING/INFO |
| [Módulo admin — template](assets/mockups/admin-template.html) | Carga Excel + mapeo columnas ↔ campos JSON |
| [Historial](assets/mockups/history.html) | Historial de ejecuciones con métricas |

---

## 2. Estructura del proyecto

```
poc-die-las-galias/
├── docker-compose.yml            # Arranque en 1 comando
├── .env.example                  # Template de variables de entorno
├── README.md                     # Instrucciones de arranque
├── requirements.txt
├── alembic/                      # Migraciones BD
│   └── versions/
├── schemas/                      # Schemas documentales JSON
│   ├── DOC_CTL_v1.json
│   └── DOC_ESCRITURA_v1.json
├── prompts/                      # Prompts versionados con guardrails
│   ├── DOC_CTL_v1.txt
│   ├── DOC_CTL_v2.txt            # Ajustado en Sprint 2
│   └── DOC_ESCRITURA_v1.txt
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
│   │   ├── content_extraction.py # ContentExtractionService (PDF nativo + base64→LLM)
│   │   ├── structured_extractor.py # StructuredExtractor (LLM + Pydantic)
│   │   ├── llm_client.py         # LiteLLM wrapper (→ LLM Gateway en TO-BE)
│   │   ├── validation_engine.py  # ValidationEngine determinístico
│   │   ├── cross_validator.py    # CrossValidator con mapeo del módulo admin
│   │   ├── discrepancy_alerts.py # DiscrepancyAlertEngine
│   │   └── audit_service.py      # AuditLog JSONL
│   ├── schemas/
│   │   ├── schema_loader.py      # Carga schemas JSON del disco
│   │   └── prompt_loader.py      # Carga prompts del disco
│   └── routers/
│       ├── documents.py          # /documents
│       ├── extractions.py        # /extractions
│       ├── batches.py            # /batches
│       ├── alerts.py             # /alerts
│       └── admin.py              # /admin/reference-template (módulo admin)
└── tests/
    ├── test_extractor.py
    ├── test_cross_validator.py
    └── fixtures/                 # Documentos sintéticos para tests
```

---

## 3. Docker Compose

```yaml
# docker-compose.yml
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

**Arranque en 1 comando:**
```bash
cp .env.example .env
# Editar .env: agregar LLM_API_KEY
docker-compose up --build
# API disponible en http://localhost:8000
# OpenAPI docs en http://localhost:8000/docs
```

---

## 4. Contrato de API REST

### 4.1 Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/documents/upload` | Cargar un documento PDF para procesamiento |
| `GET` | `/documents/{doc_id}` | Consultar estado de un documento |
| `POST` | `/documents/{doc_id}/process` | Iniciar extracción de un documento cargado |
| `GET` | `/extractions/{extraction_id}` | Consultar resultado de una extracción |
| `GET` | `/extractions/{extraction_id}/alerts` | Consultar alertas de discrepancia |
| `POST` | `/batches` | Crear y ejecutar un lote de documentos |
| `GET` | `/batches/{batch_id}` | Consultar estado y métricas de un lote |
| `GET` | `/batches/{batch_id}/export/csv` | Exportar resultados del lote en CSV |
| `GET` | `/batches/{batch_id}/export/json` | Exportar resultados del lote en JSON |
| `GET` | `/history` | Historial de ejecuciones del tenant |
| `POST` | `/admin/reference-template/upload` | Cargar Excel/CSV de referencia (módulo admin) |
| `GET` | `/admin/reference-template/fields` | Obtener columnas Excel + campos JSON disponibles |
| `POST` | `/admin/reference-template/mapping` | Guardar mapeo columna Excel ↔ campo JSON |
| `GET` | `/admin/reference-template/mapping` | Consultar mapeo activo actual |

### 4.2 Ejemplo completo: procesar un DOC_CTL

**Paso 1 — Cargar documento:**
```bash
curl -X POST http://localhost:8000/documents/upload \
  -H "X-API-Key: poc-las-galias-key" \
  -F "file=@ctl_50C_123456.pdf" \
  -F "doc_type=DOC_CTL"
```

**Respuesta:**
```json
{
  "doc_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "las-galias",
  "filename": "ctl_50C_123456.pdf",
  "doc_type": "DOC_CTL",
  "status": "PENDING",
  "uploaded_at": "2026-06-18T10:30:00Z"
}
```

**Paso 2 — Iniciar extracción:**
```bash
curl -X POST http://localhost:8000/documents/550e8400-.../process \
  -H "X-API-Key: poc-las-galias-key" \
  -H "Content-Type: application/json" \
  -d '{"prompt_version": "v1"}'
```

**Paso 3 — Consultar resultado:**
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
    "matricula_inmobiliaria": { "value": "50C-1234567",             "confidence": "HIGH",          "logprob": 0.98 },
    "codigo_orip":            { "value": "050C",                    "confidence": "HIGH",          "logprob": 0.97 },
    "departamento":           { "value": "Cundinamarca",            "confidence": "HIGH",          "logprob": 0.99 },
    "municipio":              { "value": "Bogotá D.C.",             "confidence": "HIGH",          "logprob": 0.99 },
    "tipo_predio":            { "value": "Propiedad horizontal",    "confidence": "HIGH",          "logprob": 0.94 },
    "direccion":              { "value": "Cra 7 No 24-89 Apt 401", "confidence": "HIGH",          "logprob": 0.95 },
    "propietario_nombre":     { "value": "LAS GALIAS S.A.S.",       "confidence": "HIGH",          "logprob": 0.98 },
    "propietario_cedula":     { "value": "900123456-7",             "confidence": "HIGH",          "logprob": 0.97 },
    "gravamenes":             { "value": ["Hipoteca a favor de Banco de Bogotá"], "confidence": "MEDIUM", "logprob": 0.81 },
    "area_terreno_m2":        { "value": null,                      "confidence": "HIGH",          "logprob": 0.96 },
    "area_construida_m2":     { "value": 82.5,                      "confidence": "HIGH",          "logprob": 0.93 },
    "fecha_expedicion":       { "value": "2026-06-10",              "confidence": "HIGH",          "logprob": 0.99 },
    "folios_anteriores":      { "value": [],                        "confidence": "HIGH",          "logprob": 0.95 },
    "vigente":                { "value": true,                      "confidence": "LOW_CONFIDENCE","logprob": 0.68 }
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

## 5. Módulo administrativo — Template de referencia

El módulo administrativo permite a Las Galias cargar su propia plantilla Excel de referencia y mapear sus columnas a los campos del JSON del extractor LLM. No se requiere ningún formato previo específico.

### 5.1 Flujo del módulo admin

1. **Cargar Excel** — Las Galias sube su archivo con los registros de referencia.
2. **Visualizar columnas** — el sistema muestra las columnas detectadas en el Excel.
3. **Visualizar campos JSON** — el sistema muestra los campos disponibles del schema del extractor para el tipo documental.
4. **Mapear** — Las Galias asigna cada columna del Excel a su campo JSON correspondiente.
5. **Guardar** — el mapeo se persiste en BD y se usa automáticamente en todas las validaciones cruzadas.

### 5.2 API del módulo admin

**Cargar Excel de referencia:**
```bash
curl -X POST http://localhost:8000/admin/reference-template/upload \
  -H "X-API-Key: poc-las-galias-key" \
  -F "file=@registros_ctl_referencia.xlsx" \
  -F "doc_type=DOC_CTL"
```

**Respuesta:**
```json
{
  "upload_id": "tpl-001",
  "doc_type": "DOC_CTL",
  "excel_columns": ["Matricula", "Propietario", "Cedula NIT", "Fecha CTL", "Direccion", "Gravamenes", "Area m2"],
  "json_fields":   ["matricula_inmobiliaria", "propietario_nombre", "propietario_cedula",
                    "fecha_expedicion", "direccion", "gravamenes", "area_construida_m2", "vigente"],
  "rows_loaded": 47,
  "status": "PENDING_MAPPING"
}
```

**Guardar mapeo:**
```bash
curl -X POST http://localhost:8000/admin/reference-template/mapping \
  -H "X-API-Key: poc-las-galias-key" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Respuesta:**
```json
{
  "mapping_id": "map-001",
  "mapping_version": "v1-jun-17",
  "doc_type": "DOC_CTL",
  "mapped_fields": 7,
  "unmapped_json_fields": ["tipo_predio", "codigo_orip", "departamento", "municipio", "folios_anteriores", "vigente"],
  "status": "ACTIVE",
  "created_at": "2026-06-17T14:23:00Z"
}
```

---

## 6. Prompt de extracción (DOC_CTL v1)

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

## 7. Flujo de demostración (Jun 30)

La sesión de demostración de la PoC seguirá este guion en 30–40 minutos:

1. **Arranque** (2 min): `docker-compose up` — sistema en línea en < 2 minutos.
2. **Módulo admin** (5 min): mostrar carga del Excel de referencia de Las Galias, mapeo de columnas a campos JSON y confirmación del mapeo activo.
3. **Ingesta individual DOC_CTL** (5 min): cargar `ctl_50C_123456.pdf`, ejecutar extracción, mostrar JSON de resultado con campos y logprobs.
4. **CrossValidator en acción** (5 min): mostrar resultado de validación cruzada usando el mapeo activo del módulo admin; identificar MATCH/MISMATCH.
5. **Alertas de discrepancia** (5 min): mostrar alertas generadas; explicar severidades BLOCKING/WARNING/INFO.
6. **Procesamiento DOC_ESCRITURA** (3 min): demostrar que el extractor funciona para el segundo tipo documental.
7. **Lote de 10 documentos** (5 min): ejecutar lote, mostrar métricas de resumen, exportar CSV.
8. **Trazabilidad** (3 min): mostrar audit log de todas las ejecuciones.
9. **Métricas de calidad** (5 min): MLflow tracking: F1-score por campo, latencia, tokens, prompt v1 vs v2.

---

Trazabilidad: [Alcance](alcance.html) · [Cronograma](cronograma.html) · [Riesgos](riesgos.html)
"""

with open(TARGET, "w", encoding="utf-8") as f:
    f.write(CONTENT)

print(f"Written: {TARGET}")
