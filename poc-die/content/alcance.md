# Alcance funcional, arquitectura y definición técnica

<div class="badge-row">
<span class="badge">Sección 1 de 5</span>
<span class="badge">PoC mono-tenant</span>
<span class="badge">Subconjunto del TO-BE DIE</span>
<span class="badge">Diseñado para escalar a MultiTenant</span>
</div>

---

## 1. Alcance funcional

### 1.1 Qué incluye la PoC

La PoC cubre el flujo principal de procesamiento documental estructurado del DIE para el cliente Las Galias:

1. **Ingesta documental**: carga manual de documentos PDF vía API REST y módulo de administración web. Tipo documental único: `DOC_CTL` (Certificado de Tradición y Libertad). La PoC se limita exclusivamente a este tipo documental.
2. **Extracción de contenido**: el documento PDF se envía directamente al LLM/VLM en modo multimodal (base64). **No se realiza detección previa del tipo de contenido** (texto embebido / escaneado / imagen): el modelo procesa el archivo tal como llega. Esta simplificación es válida para v1 y no afecta la calidad del logprob. **El fallback OCR queda fuera del alcance de la PoC**.
3. **Extracción estructurada (LLM)**: invocación del modelo de lenguaje con prompt versionado + guardrails explícitos + few-shots + schema JSON de campos obligatorios. Evaluación de `logprobs` por campo para marcar confianza baja.
4. **Validación interna**: verificación determinística de tipos de dato, formatos y campos obligatorios contra el esquema del tipo documental.
5. **Validación cruzada**: comparación campo a campo del resultado extraído contra el archivo de referencia CSV/Excel de Las Galias. Clasificación por campo: `MATCH`, `MISMATCH`, `PENDIENTE`.
6. **Alertas de discrepancia**: generación de alertas por cada `MISMATCH` con severidad `BLOCKING`, `WARNING` o `INFO`.
7. **Salida estructurada**: exportación de resultados en JSON y CSV por documento y por lote.
8. **Trazabilidad mínima**: registro inmutable de cada ejecución con: tenant_id, documento, modelo, prompt_version, tokens, latencia, logprobs_min, resultado.

### 1.2 Qué excluye la PoC (pero está en el TO-BE)

| Exclusión de PoC | Razón | Habilitación en TO-BE |
|---|---|---|
| Multi-tenant management (UI, onboarding) | Fuera de alcance mono-tenant | Sprint 0–1 TO-BE |
| RBAC completo por tenant | Un solo usuario admin en PoC | Sprint 1 TO-BE |
| LLM Gateway con fallbacks y load balancing | Proveedor único en PoC | Sprint 0 TO-BE |
| Procesamiento batch asíncrono (Celery + Redis) | Síncrono en PoC; suficiente para 30–50 docs/día | Sprint 2 TO-BE |
| UI completa de revisión humana (Alert Dashboard) | Solo API + CLI en PoC | Sprint 4 TO-BE |
| DocumentSchemaRegistry dinámico | Schemas hardcoded en archivos JSON/YAML en PoC | Sprint 2 TO-BE |
| Prompt Registry versionado en BD | Prompts en archivos con versión en nombre | Sprint 1 TO-BE |
| Audit Service inmutable (BD separada) | Log estructurado en JSONL en PoC | Sprint 5 TO-BE |
| OCR fallback (para docs escaneados sin texto) | Fuera de alcance PoC; LLM-first cubre todos los casos | Sprint 2 TO-BE condicionado |
| Observabilidad MLFlow/Grafana completa | MLflow local para experimentos LLM | Sprint 5 TO-BE |
| Integración por servicio web (SOAP/REST externo) | Fuera del alcance de la PoC; requiere acuerdos de integración con Las Galias | Fase de implementación post-PoC |
| Integración por FTP / SFTP | Fuera del alcance de la PoC; carga manual suficiente para validar el extractor | Fase de implementación post-PoC |
| Soporte a `DOC_ESCRITURA` (Escritura Pública) | La PoC se limita exclusivamente a `DOC_CTL` para mantener el foco y la profundidad de validación | Post-PoC; extensible con nuevo schema + prompt |

### 1.3 Casos de uso cubiertos

| ID | Caso de uso | Sprint |
|---|---|---|
| CU-01 | Procesar un `DOC_CTL` individual y obtener salida estructurada JSON | Sprint 1 |
| CU-02 | Cargar y procesar un lote de hasta 20 documentos `DOC_CTL` | Sprint 2 |
| CU-04 | Configurar template de referencia desde el módulo administrativo (cargar Excel) | Sprint 2 |
| CU-05 | Comparar campos extraídos contra template cargado por admin (match JSON ↔ columnas Excel) | Sprint 2 |
| CU-06 | Identificar y clasificar discrepancias con severidad BLOCKING/WARNING/INFO | Sprint 2 |
| CU-07 | Exportar resultados de un lote (JSON resumen + CSV por documento) | Sprint 2 |
| CU-08 | Consultar historial de ejecuciones por tenant | Sprint 3 |
| CU-09 | Evaluar prompt v2 vs v1 con MLflow y ajustar thresholds | Sprint 3 |

> **Fuera de alcance de la PoC:** procesamiento de `DOC_ESCRITURA`, integración por servicio web externo e integración por FTP/SFTP. Estos casos quedan documentados para la fase de implementación post-PoC.

---

## 2. Arquitectura de la PoC

### 2.1 Principio de diseño: subconjunto técnico del TO-BE

La arquitectura de la PoC replica la **estructura de capas y contratos** del TO-BE del DIE, con implementaciones simplificadas donde la complejidad no está justificada a escala de un cliente y un ingeniero en 3 semanas.

**Regla clave**: cualquier componente de la PoC debe poder ser **reemplazado o extendido** por su equivalente del TO-BE sin cambiar el contrato de datos ni la estructura del código.

### 2.2 Diagrama de arquitectura PoC

<div class="diagram-block">
<p class="diagram-label">Arquitectura PoC DIE — Las Galias (mono-tenant, simplificada)</p>
<img src="assets/img/diagramas/poc-die-arquitectura.png" alt="Diagrama de arquitectura PoC DIE — Las Galias">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-arquitectura.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

### 2.3 Componentes de la PoC

| Componente PoC | Equivalente TO-BE | Tecnología | Simplificación |
|---|---|---|---|
| FastAPI REST API | API Backend | FastAPI (Python 3.11+) | Sin RBAC complejo; auth básica por API Key |
| Módulo Administrativo | Alert Dashboard + SchemaRegistry UI | FastAPI + HTML/JS simple | Carga de template Excel + mapeo campos; sin OCR |
| Content Extraction Service | Content Extraction Strategy Service | PDF base64 → LLM directo (sin extracción nativa) | **Sin OCR fallback en PoC**; LLM-first directo |
| LLM Client (simplificado) | LLM Gateway | `litellm` o `openai` SDK | Sin fallback multi-proveedor; solo rate-limit básico |
| StructuredExtractor | StructuredExtractor | Python + Pydantic | Idéntico al TO-BE; same interface |
| Schema Loader | DocumentSchemaRegistry | Archivos JSON/YAML en disco | Sin BD; precargado al inicio |
| Prompt Loader | Prompt Registry | Archivos `.txt`/`.yaml` con versión | Sin BD; versionado en nombre de archivo |
| ValidationEngine | Validation Engine | Python determinístico | Idéntico al TO-BE |
| CrossValidator | CrossValidator | Python + pandas | Idéntico al TO-BE |
| DiscrepancyAlertEngine | DiscrepancyAlertEngine | Python | Idéntico al TO-BE |
| AuditLog (JSONL) | Audit Service | Archivos JSONL rotativos | Sin BD inmutable separada |
| PostgreSQL / SQLite | PostgreSQL RLS | PostgreSQL (o SQLite para dev) | Sin RLS activado; `tenant_id` presente |
| Docker Compose | Kubernetes / Cloud Deploy | Docker Compose single-node | Sin orquestación de contenedores |

### 2.4 Modelo de datos mínimo

Todos los modelos incluyen `tenant_id` desde la PoC:

```python
# document.py
class Document(Base):
    __tablename__ = "documents"
    id: UUID
    tenant_id: str = "las-galias"   # fijo en PoC; parametrizable en TO-BE
    doc_type: str                    # "DOC_CTL" — único tipo en PoC
    filename: str
    status: str                      # PENDING | PROCESSING | DONE | ERROR
    uploaded_at: datetime
    processed_at: datetime | None

# extraction.py
class DocumentExtraction(Base):
    __tablename__ = "document_extractions"
    id: UUID
    tenant_id: str
    document_id: UUID
    model_used: str
    prompt_version: str
    extracted_fields: dict           # JSON con campos extraídos
    logprobs_min: float | None
    low_confidence_fields: list[str]
    tokens_input: int
    tokens_output: int
    latency_ms: int
    created_at: datetime

# alert.py
class DiscrepancyAlert(Base):
    __tablename__ = "discrepancy_alerts"
    id: UUID
    tenant_id: str
    extraction_id: UUID
    field_name: str
    extracted_value: str
    reference_value: str
    severity: str                    # BLOCKING | WARNING | INFO
    status: str                      # OPEN | RESOLVED | DISMISSED
    created_at: datetime
```

### 2.5 Flujo de extracción

<div class="diagram-block">
<p class="diagram-label">Flujo de extracción estructurada — PoC DIE Las Galias</p>
<img src="assets/img/diagramas/poc-die-flujo-extraccion.png" alt="Flujo de extracción PoC DIE">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-flujo-extraccion.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

---

## 3. Definición técnica

### 3.1 Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Runtime | Python 3.11+ | Alineado con TO-BE; ecosistema LLM nativo |
| API Framework | FastAPI + Uvicorn | Idéntico al TO-BE; OpenAPI automático |
| ORM / BD | SQLAlchemy + PostgreSQL 15 | Mismo ORM que TO-BE; habilita RLS multi-tenant |
| LLM SDK | LiteLLM | Abstracción proveedor-agnóstica desde PoC |
| Structured Output | Pydantic v2 | Validación y parsing JSON schema |
| Cross Validation | pandas + Python | Determinístico; portable al TO-BE |
| Contenerización | Docker Compose | Un solo comando de arranque |
| Observabilidad LLM | MLflow (local) | Tracking de experimentos; mismo que TO-BE |
| Configuración | python-dotenv + `.env` | Variables de entorno seguras |

### 3.2 Variables de entorno críticas

```bash
# .env (nunca en control de versiones)
TENANT_ID=las-galias
LLM_PROVIDER=openai               # openai | google | anthropic
LLM_MODEL=gpt-4o                  # modelo primario
LLM_API_KEY=sk-...                # clave API del proveedor LLM
DATABASE_URL=postgresql://...     # o sqlite:///./poc_die.db
STORAGE_PATH=./data/documents     # ruta de almacenamiento de archivos
LOG_LEVEL=INFO
LOGPROB_CONFIDENCE_THRESHOLD=0.85 # umbral para LOW_CONFIDENCE
MAX_RETRIES_LLM=3                 # reintentos en caso de error LLM
```

### 3.3 Esquemas documentales (PoC)

El tipo documental principal de la PoC es el **Certificado de Tradición y Libertad (DOC_CTL)**. Los schemas se definen como archivos JSON en `schemas/`; el módulo administrativo los cargará dinámicamente en el TO-BE.

```json
// schemas/DOC_CTL_v1.json  — Certificado de Tradición y Libertad
{
  "doc_type": "DOC_CTL",
  "version": "1.0",
  "fields": [
    { "name": "matricula_inmobiliaria", "type": "string", "required": true,  "description": "Número de matrícula inmobiliaria (ej: 50C-1234567)" },
    { "name": "codigo_orip",           "type": "string", "required": true,  "description": "Código de la Oficina de Registro (ORIP)" },
    { "name": "departamento",          "type": "string", "required": true,  "description": "Departamento donde está registrado el inmueble" },
    { "name": "municipio",             "type": "string", "required": true,  "description": "Municipio de registro" },
    { "name": "tipo_predio",           "type": "string", "required": false, "description": "Urbano / Rural / Propiedad horizontal" },
    { "name": "direccion",             "type": "string", "required": true,  "description": "Dirección del inmueble" },
    { "name": "propietario_nombre",    "type": "string", "required": true,  "description": "Nombre del propietario actual" },
    { "name": "propietario_cedula",    "type": "string", "required": true,  "description": "Cédula o NIT del propietario" },
    { "name": "gravamenes",            "type": "array",  "required": false, "description": "Lista de gravámenes, hipotecas o limitaciones vigentes" },
    { "name": "area_terreno_m2",       "type": "number", "required": false, "description": "Área del terreno en metros cuadrados" },
    { "name": "area_construida_m2",    "type": "number", "required": false, "description": "Área construida en metros cuadrados" },
    { "name": "fecha_expedicion",      "type": "date",   "required": true,  "description": "Fecha de expedición del certificado (YYYY-MM-DD)" },
    { "name": "folios_anteriores",     "type": "array",  "required": false, "description": "Números de folios anteriores vinculados" },
    { "name": "vigente",               "type": "boolean","required": true,  "description": "Si el certificado está vigente o fue reemplazado" }
  ]
}
```

### 3.4 Criterios técnicos de éxito de la PoC

La PoC se considera exitosa si cumple **todos** los criterios mínimos:

| Criterio | Umbral mínimo | Cómo se mide |
|---|---|---|
| CU-01 ejecutable E2E sin bloqueo | 100% de 10 docs de prueba | Ejecución manual + log de resultados |
| Completitud de campos extraídos | ≥ 80% de campos obligatorios | `completeness_score` por extracción |
| Precisión de extracción (campos críticos) | ≥ 85% F1-score vs referencia | CrossValidator + revisión humana |
| CrossValidator operativo | 100% de ejecuciones sin error | Test E2E con dataset referencia |
| Trazabilidad registrada | 100% de ejecuciones con audit log | Verificación en BD/JSONL |
| Tiempo de procesamiento individual | < 30 seg/documento (excl. LLM cold start) | Medición en 10 ejecuciones |

---

## 4. Relación PoC → TO-BE MultiTenant

<div class="diagram-block">
<p class="diagram-label">Evolución PoC mono-tenant → DIE MultiTenant</p>
<img src="assets/img/diagramas/poc-die-evolucion.png" alt="Diagrama de evolución PoC a MultiTenant">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-evolucion.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

| Capa | En PoC | En TO-BE | Esfuerzo de transición |
|---|---|---|---|
| Datos | `tenant_id` fijo "las-galias" | `tenant_id` dinámico + RLS PostgreSQL | Activar RLS; agregar TenantManagementService |
| Autenticación | API Key simple | JWT + RBAC por tenant | Reemplazar middleware de auth |
| LLM | LiteLLM directo | LLM Gateway (rate-limit, fallback, cache) | Encapsular en LLMGateway service |
| Schemas | JSON en disco | DocumentSchemaRegistry en BD | Migrar JSONs a BD con API de gestión |
| Prompts | Archivos en disco | Prompt Registry en BD versionado | Migrar archivos a BD con API de gestión |
| Queue | Síncrono | Celery + Redis | Envolver invocaciones en tareas Celery |
| UI | API + CLI | Alert Dashboard completo | Construir frontend; consumir API existente |
| Audit | JSONL local | BD inmutable + API de consulta | Migrar logging a AuditService |

---

Trazabilidad: [Prerequisitos](prerequisitos.html) · [Cronograma](cronograma.html) · [Prototipo](prototipo.html) · [TO-BE DIE](../RAG/tobefuncional.html)
