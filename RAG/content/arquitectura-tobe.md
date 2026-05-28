# Arquitectura TO-BE  Document Intelligence Engine MultiTenant

<div class="badge-row">
<span class="badge">Producto: Document Intelligence Engine</span>
<span class="badge">Arquitectura: MultiTenant  Esencial MVP</span>
<span class="badge badge-note">NER supervisado: evaluación post-producción</span>
<span class="badge">8 vistas de arquitectura</span>
<span class="badge">PlantUML + PNG</span>
</div>

> **Reposicionamiento de producto (2026-05):** El sistema es un **Document Intelligence Engine MultiTenant**: extrae campos estructurados desde documentos tipados, valida los resultados contra fuentes de referencia, genera alertas de discrepancia clasificadas por severidad y opera bajo un modelo multi-cliente (MultiTenant) controlado por CINTEL. Sin chat. Sin vectores. Sin RAG conversacional. NER supervisado es evaluación post-producción.

> **Enfoque LLM-first en extracción de contenido (2026-05):** La arquitectura no asume OCR como mecanismo principal. Para preservar la integridad de la información, el sistema prioriza el procesamiento directo del documento digital, la extracción nativa de texto/estructura o el análisis documental/multimodal con LLM cuando esté disponible y sea compatible con las restricciones de soberanía. OCR se conserva únicamente como mecanismo auxiliar para documentos escaneados, imágenes o archivos sin texto embebido, acompañado de controles de calidad y trazabilidad sobre el documento original.

---

## Principio de separación: IA vs. sistema tradicional

La arquitectura TO-BE distingue con precisión qué capacidades resuelve la IA y cuáles el sistema de información tradicional. Esta separación evita sobreingeniería y mantiene trazabilidad entre decisiones de negocio y componentes técnicos.

### Matriz de capacidades

| Capacidad | Tipo | Implementación sugerida | MVP |
|---|---|---|---|
| **MultiTenant Platform Core** | Tradicional | Backend + PostgreSQL RLS + `tenant_id` |  Esencial |
| Usuarios y roles (RBAC) | Tradicional | JWT + RBAC por tenant |  MVP |
| Gestión documental | Tradicional | API + DB + Object Storage |  MVP |
| Procesamiento por lotes | Tradicional | API + Worker (Celery) + Redis |  MVP |
| DocumentSchemaRegistry | Tradicional | API + DB + JSON Schema |  MVP |
| Prompt Registry (versionado) | IA / LLM | DB relacional + versionado |  MVP |
| Extracción nativa PDF/DOCX/XLSX | Procesamiento | Parsers PDF, python-docx, openpyxl |  MVP |
| LLM multimodal/documental | IA / LLM | Modelo con soporte de archivo/imagen |  MVP condicionado |
| OCR fallback | Procesamiento | Tesseract / API OCR (solo escaneados) |  MVP condicionado |
| Control de integridad de contenido | Tradicional | Heurísticas, hash, calidad |  MVP |
| **Content Extraction Strategy** | Procesamiento  Híbrido | Selección entre nativa/LLM multimodal/OCR |  MVP |
| **StructuredExtractor (LLM)** | **IA / LLM** | LLM + prompt + schema + parser |  MVP |
| **CrossValidator** | Tradicional | Motor determinístico vs. CSV/Excel |  MVP |
| **DiscrepancyAlertEngine** | Tradicional | Motor de reglas + clasificación |  MVP |
| **Alert Dashboard / Human Review** | Tradicional | UI + workflow + DB |  MVP |
| API REST documentada | Tradicional | FastAPI + OpenAPI |  MVP |
| Audit Service (inmutable) | Tradicional | AuditLog en DB |  MVP |
| Observabilidad básica | Tradicional | Logs + métricas |  MVP |
| Chat / Q&A sobre documentos | --- | --- |  Fuera de alcance |
| NER supervisado | Futuro | Spike post-producción | ⏸ Post-producción |
| Fine-tuning LLMs | Futuro | --- |  Fuera de alcance |

---

## Componentes TO-BE  Document Intelligence Engine

| Componente | Tipo | Tecnología sugerida | Responsabilidad principal |
|---|---|---|---|
| API Gateway | Tradicional | Nginx / Kong | TLS, rate-limit, JWT decode |
| Frontend / UI | Tradicional | SPA (HTML/JS) | Portal admin, carga, Alert Dashboard |
| API Backend | Tradicional | FastAPI (Python 3.11+) | Orquesta todas las operaciones REST |
| Auth / RBAC Service | Tradicional | JWT + PostgreSQL | Autenticación, roles, permisos por tenant |
| **Tenant Management Service** | Tradicional | Backend + DB | Gestión de tenants por CINTEL |
| Document Service | Tradicional | Backend + Storage | Registro, almacenamiento, estado |
| Batch Service | Tradicional | Backend + Celery + Redis | Procesamiento asíncrono por lote |
| **DocumentSchemaRegistry** | Tradicional | Backend + DB | Tipos documentales, campos, versiones |
| Prompt Registry | IA / LLM | DB relacional + versionado | Prompts versionados por tipo documental |
| **Content Extraction Strategy Service** | Procesamiento  Híbrido | Python + parsers + OCR + LLM multimodal | Selección de ruta: nativa / LLM multimodal / OCR fallback |
| OCR Engine | Procesamiento (Fallback) | Tesseract / API OCR | Solo documentos escaneados o sin texto embebido |
| **StructuredExtractor** | **IA / LLM** | Python nativo | Extracción de campos via LLM |
| LLM Orchestrator | **IA / LLM** | Python nativo | Contexto, invocación LLM, reintentos |
| Structured Output Parser | **IA / LLM** | Pydantic / JSON mode | Parseo y tipado de respuesta LLM |
| Validation Engine | Híbrido | Motor de reglas determinístico | Validación tipo/formato/obligatorios |
| **CrossValidator** | Tradicional | Motor determinístico | Comparación vs. CSV/Excel de referencia |
| **DiscrepancyAlertEngine** | Tradicional | Motor de reglas | Alertas BLOCKING/WARNING/INFO |
| **Alert Dashboard** | Tradicional | UI + workflow + DB | Human review, resolución de alertas |
| Audit Service | Tradicional | DB inmutable | Trazabilidad por tenant/operación |
| Observability Service | Tradicional | Logs + Prometheus | Tokens, latencia, cobertura |
| PostgreSQL | Tradicional | PostgreSQL 15+ (RLS) | Persistencia con aislamiento por tenant |
| Object Storage | Tradicional | Filesystem / MinIO | Documentos y CSVs de referencia |
| LLM Provider | **IA / LLM** | OpenAI / Groq / Ollama | Motor de inferencia configurable |

---

## Vista 1  Arquitectura de negocio: capacidades del DIE

Muestra todas las capacidades del Document Intelligence Engine MultiTenant clasificadas por tipo: Tradicional (esencial MVP), IA/LLM, Procesamiento documental y Fuera de alcance.

<div class="diagram-block">
<p class="diagram-label">Vista 1  Capacidades del Document Intelligence Engine MultiTenant</p>
<img src="assets/img/diagramas/document-intelligence/01-vista-negocio-capacidades.png" alt="Vista 1: Capacidades del Document Intelligence Engine MultiTenant">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/01-vista-negocio-capacidades.plantuml" download> Fuente PlantUML</a>
</div>
</div>

El diagrama destaca los componentes esenciales MVP (MultiTenant Platform Core, StructuredExtractor, CrossValidator, DiscrepancyAlertEngine, Alert Dashboard) y clarifica los elementos fuera de alcance (Chat/RAG, Q&A, NER en Fase 1, fine-tuning, ERP directo).

---

## Vista 2  Mapa de componentes TO-BE

Muestra los componentes técnicos del Document Intelligence Engine y sus relaciones. Distingue componentes IA de componentes tradicionales y marca Chat/RAG como fuera de alcance.

<div class="diagram-block">
<p class="diagram-label">Vista 2  Mapa de componentes  Document Intelligence Engine</p>
<img src="assets/img/diagramas/document-intelligence/02-mapa-componentes-tobe.png" alt="Vista 2: Mapa de componentes Document Intelligence Engine">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/02-mapa-componentes-tobe.plantuml" download> Fuente PlantUML</a>
</div>
</div>

Los componentes centrales son: **Tenant Management** (MultiTenant), **StructuredExtractor** (LLM-first), **CrossValidator** y **DiscrepancyAlertEngine** (ambos determinísticos). Chat/RAG y NER aparecen explícitamente en la zona Fuera de Alcance MVP.

---

## Vista 3  Flujo completo de procesamiento de documentos

Muestra el flujo de extremo a extremo en 4 carriles: Cliente/Operador, API/Backend (Tradicional), Capa IA/LLM, Validación y Alertas (Tradicional).

<div class="diagram-block">
<p class="diagram-label">Vista 3  Flujo de procesamiento de documentos  DIE MultiTenant</p>
<img src="assets/img/diagramas/document-intelligence/03-flujo-procesamiento-documentos.png" alt="Vista 3: Flujo de procesamiento Document Intelligence Engine">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/03-flujo-procesamiento-documentos.plantuml" download> Fuente PlantUML</a>
</div>
</div>

El flujo incluye: validación MultiTenant (JWT + RBAC), **Content Extraction Strategy** (extracción nativa  LLM multimodal  OCR fallback), Normalized Document Representation, extracción LLM, validación determinística, CrossValidator vs. CSV/Excel de referencia, generación de alertas de discrepancia y revisión humana desde el Alert Dashboard. No hay paso de chat, retrieval ni Q&A en ningún punto del flujo.

---

## Vista 4  Flujo detallado de extracción LLM

Detalla la secuencia completa del StructuredExtractor: desde el texto OCR hasta el JSON estructurado auditado. Muestra el rol del Prompt Registry, LLM Orchestrator, LLM Provider, Structured Output Parser y Audit Service.

<div class="diagram-block">
<p class="diagram-label">Vista 4  Flujo de extracción estructurada con LLM</p>
<img src="assets/img/diagramas/document-intelligence/04-flujo-extraccion-llm.png" alt="Vista 4: Flujo de extracción LLM  StructuredExtractor">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/04-flujo-extraccion-llm.plantuml" download> Fuente PlantUML</a>
</div>
</div>

La secuencia registra `metodo_extraccion`, `tokens_entrada`, `tokens_salida`, `latencia_ms`, `modelo_usado`, `prompt_version` y `tenant_id` en cada ejecución. El StructuredExtractor recibe la `representacion_normalizada` (no necesariamente texto OCR), preservando la integridad del documento original. La nota final del diagrama confirma: sin interacción conversacional, sin chat, sin RAG en ningún paso.

---

## Vista 5  Modelo de datos conceptual

Muestra todas las entidades del DIE: `Tenant`, `TenantUser`, `DocumentType`, `FieldSchema`, `PromptVersion`, `Document`, `Batch`, `ExtractionRun`, `ExtractedField`, `ReferenceDataset`, `CrossValidationRun`, `CrossValidationResult`, `DiscrepancyAlert` y `AuditLog`.

<div class="diagram-block">
<p class="diagram-label">Vista 5  Modelo de datos conceptual  Document Intelligence Engine</p>
<img src="assets/img/diagramas/document-intelligence/05-vista-datos-conceptual.png" alt="Vista 5: Modelo de datos conceptual DIE">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/05-vista-datos-conceptual.plantuml" download> Fuente PlantUML</a>
</div>
</div>

Las entidades clave nuevas respecto a versiones anteriores son: `DocumentContentExtraction` (registra método de extracción: NATIVE_TEXT, LLM_MULTIMODAL, OCR_FALLBACK), `NormalizedDocumentRepresentation` (insumo auditable para el StructuredExtractor), `ReferenceDataset` (fuente de verdad para CrossValidator), `CrossValidationRun`, `CrossValidationResult` (MATCH/MISMATCH/PENDIENTE) y `DiscrepancyAlert` (BLOCKING/WARNING/INFO con ciclo de vida de resolución). La nota del diagrama confirma: sin entidades de conversación ni mensajes (no Chat).

---

## Vista 6  Seguridad y aislamiento MultiTenant

Muestra la arquitectura de seguridad del DIE: cómo CINTEL administra la plataforma, cómo los tenants están aislados entre sí y cómo el LLM Provider se usa sin retención de datos del cliente.

<div class="diagram-block">
<p class="diagram-label">Vista 6  Seguridad y aislamiento MultiTenant  DIE</p>
<img src="assets/img/diagramas/document-intelligence/06-vista-seguridad-multitenant.png" alt="Vista 6: Seguridad y aislamiento MultiTenant DIE">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/06-vista-seguridad-multitenant.plantuml" download> Fuente PlantUML</a>
</div>
</div>

El diagrama muestra tres tenants simultáneos: CINTEL (admin de plataforma), Tenant A (empresa constructora) y Tenant B (aseguradora). Cada tenant tiene sus datos, schemas, prompts y alertas completamente aislados. El LLM Provider opera sin retención de datos del cliente (contrato DPA requerido para nube o Ollama para soberanía total).

---

## Vista 7  Arquitectura de despliegue MVP

Muestra los nodos de despliegue del MVP: API Gateway, DIE Backend (FastAPI), Worker LLM (Celery + Redis), PostgreSQL con RLS, Object Storage y LLM Provider externo o on-premise.

<div class="diagram-block">
<p class="diagram-label">Vista 7  Arquitectura de despliegue MVP  DIE MultiTenant</p>
<img src="assets/img/diagramas/document-intelligence/07-vista-despliegue-mvp.png" alt="Vista 7: Despliegue MVP Document Intelligence Engine">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/07-vista-despliegue-mvp.plantuml" download> Fuente PlantUML</a>
</div>
</div>

El diagrama incluye la zona Fuera de despliegue MVP con: Vector DB (no se usa  no RAG), Chat Service / Embedding Service (no se usa) y NER Service (post-MVP). El LLM Provider soporta OpenAI API, Groq API u Ollama on-premise para soberanía total.

---

## Vista 8  Roadmap arquitectónico por fases

Muestra la evolución del DIE en 5 fases: DIE MVP, Hardening + Conectores Cloud, Conectores ERP y Escalabilidad, Evaluación NER (condicional) y Escala Sectorial.

<div class="diagram-block">
<p class="diagram-label">Vista 8  Roadmap arquitectónico  Document Intelligence Engine</p>
<img src="assets/img/diagramas/document-intelligence/08-roadmap-arquitectonico.png" alt="Vista 8: Roadmap arquitectónico DIE">
<div class="diagram-links">
<a href="assets/plantuml/document-intelligence/08-roadmap-arquitectonico.plantuml" download> Fuente PlantUML</a>
</div>
</div>

| Fase | Contenido | NER | Chat/RAG |
|---|---|---|---|
| **Fase 1**  DIE MVP | MultiTenant, DocSchema, StructuredExtractor, CrossValidator, DiscrepancyAlertEngine, Alert Dashboard, API REST |  Fuera de alcance |  Fuera de alcance |
| **Fase 2**  Hardening + Cloud | Quality scores LLM, Google Workspace, M365, Webhooks |  Fuera de alcance |  Fuera de alcance |
| **Fase 3**  ERP + Escala | SAP/Sinco, K8s, facturación automática |  Fuera de alcance |  Fuera de alcance |
| **Fase 4**  Evaluación NER | Solo si 4 criterios se cumplen en producción | ️ Solo si evidencia lo justifica |  Fuera de alcance |
| **Fase 5**  Escala sectorial | Legal, seguros, logística, salud, marketplace | Depende de Fase 4 |  Fuera de alcance |

---

## Supuestos y límites del MVP

- El MultiTenant Platform Core es esencial desde el día 1: no se puede diferir sin riesgo arquitectónico.
- La **Content Extraction Strategy** selecciona la ruta óptima por documento: extracción nativa para digitales, LLM multimodal si el modelo lo soporta, OCR fallback solo para escaneados. OCR nunca es el paso por defecto.
- El LLM Provider es configurable; GPT-4o mini es el baseline recomendado para el piloto.
- El procesamiento asíncrono por lote usa Redis + Celery worker en contenedor Docker.
- El almacenamiento de documentos usa Object Storage con prefijo `tenant_id/` desde el MVP.
- PostgreSQL con Row-Level Security (RLS) proporciona aislamiento de datos entre tenants en el MVP.
- El CrossValidator compara contra CSV/Excel subido manualmente por el tenant en Fase 1; los conectores a BD externa son Fase 3.
- Las alertas de discrepancia con severidad BLOCKING impiden aprobar el documento; el operador debe resolverlas explícitamente.
- Los prompts están versionados por tipo documental en el `Prompt Registry`; no hay personalización por tenant en Fase 1.

---

## Riesgos y decisiones abiertas

| Riesgo / Decisión | Estado | Mitigación / Nota |
|---|---|---|
| MultiTenant sin esquema RLS correcto | Riesgo crítico | Revisar RLS en todas las queries antes de producción |
| Variabilidad del LLM entre versiones de modelo | Abierta | Persistir versión del modelo en cada `ExtractionRun`; validar periódicamente |
| Costo por token a escala | A evaluar | Medir en Fase 1; definir umbral; Ollama como alternativa on-premise |
| Alucinación en campos críticos | Control activo | `null` obligatorio si no se encuentra el campo; CrossValidator detecta divergencias |
| CrossValidator con demasiados falsos positivos MISMATCH | A calibrar | Implementar normalización configurable por campo (fecha, mayúsculas, espacios) |
| Severidad de alertas mal configurada | A calibrar | CINTEL define defaults; tenant puede ajustar por campo en su `DocumentSchemaRegistry` |
| LLM Provider para on-premise | Decisión pendiente | Ollama con modelos abiertos (Mistral, LLaMA 3) como opción validada |
| NER post-producción | Condicional | Solo evaluar si LLM presenta brechas concretas que prompting no resuelve |

---

## Elementos fuera de alcance  Fase 1 MVP

- **Chat / RAG conversacional**: el sistema no tiene chat, no tiene retrieval semántico y no tiene base vectorial.
- **Q&A libre sobre documentos**: la salida del sistema es siempre JSON/CSV estructurado.
- **Base vectorial** (Pinecone, Chroma, Weaviate, Azure AI Search): no se usa en ningún componente.
- **NER supervisado** como servicio de extracción: evaluación post-producción condicional.
- **Fine-tuning de LLMs**: fuera de alcance y sin justificación en MVP.
- **Conectores ERP directos** (SAP, Sinco, Odoo): Fase 3.
- **SSO / OAuth corporativo**: Fase 2.
- **Kubernetes y orquestación avanzada**: Fase 3.
- **Bases de datos físicamente separadas por tenant**: plan Enterprise futuro.
- **Prompts personalizados por tenant** (solo por tipo documental en Fase 1).
- **Multi-idioma**: fuera del alcance del piloto sectorial.

---

## Análisis técnico TO-BE  Validación de cumplimiento funcional

Esta sección consolida las decisiones arquitectónicas resueltas durante el diseño del DIE MultiTenant. Documenta explícitamente por qué las preguntas de arquitectura tradicional ya no requieren validación con el experto en modelos y cómo la arquitectura propuesta cumple cada requisito funcional.

---

### 1. Posicionamiento del producto: DIE vs RAG

**Decisión tomada:** El DIE no es un RAG. No tiene retrieval semántico, no tiene base vectorial, no tiene interfaz conversacional y no genera texto libre.

La categoría más precisa en la industria es **Intelligent Document Processing (IDP)** o *Structured Data Extraction*. El LLM se usa exclusivamente para extraer campos estructurados desde texto de documento. Las consultas post-extracción se realizan sobre datos estructurados vía API REST o SQL, no sobre documentos brutos.

Agregar Q&A documental en el MVP sería un anti-patrón de producto: duplicaría la carga de ingeniería, confundiría el posicionamiento y diluiría el valor diferencial de la extracción estructurada.

---

### 2. MultiTenant desde el MVP  fundamentos de la decisión

**Decisión tomada:** El aislamiento MultiTenant (`tenant_id`, RBAC, RLS) es parte del MVP desde el día 1. No puede diferirse.

Retroadaptar aislamiento de datos en un sistema single-tenant implica migración de datos, refactor de toda la capa de acceso y riesgo de filtración entre tenants. El costo de implementarlo bien desde el inicio es bajo comparado con el costo y riesgo de diferirlo.

Para el MVP con volumen controlado (<20 tenants, <50K documentos/tenant/mes), PostgreSQL con Row-Level Security (RLS) y `tenant_id` en todas las queries es el mecanismo estándar. Base de datos por tenant se reserva para planes Enterprise con SLA diferenciado o requerimientos regulatorios específicos.

La cola de tareas Celery usa fair-queuing por `tenant_id` en el MVP. Colas por prioridad de plan (ENTERPRISE, PRO, BÁSICO) se activan a partir de Fase 2 con >10 tenants simultáneos.

---

### 3. Garantías de salida estructurada del LLM

**Decisión tomada:** Los modelos modernos (GPT-4o, Gemini 1.5 Pro, Claude 3.5) soportan structured outputs/JSON mode/function calling. Esto es una característica estándar, no un riesgo abierto.

El LLM Orchestrator implementa tres niveles de garantía en cascada: (1) Structured Outputs o JSON Mode del modelo; (2) JSON Schema como instrucción en el system prompt; (3) Validación post-parseo contra el schema del tipo documental con retroalimentación al LLM en caso de fallo, máximo 3 reintentos. Esta cascada ya está incorporada en el diseño del `LLM Orchestrator`.

---

### 4. Versionamiento de schemas y prompts

**Decisión tomada:** Cada `ExtractionRun` registra `prompt_version` y `schema_version`. Los resultados históricos son inmutables con su versión de origen.

El `DocumentSchemaRegistry` mantiene versiones activas e inactivas. El re-procesamiento es siempre una operación explícita, nunca automática. Esta inmutabilidad es crítica para auditoría y para demostrar qué versión del schema produjo qué resultado.

---

### 5. CrossValidator y alertas: diseño determinístico

**Decisión tomada:** El CrossValidator y el DiscrepancyAlertEngine son 100% determinísticos. No usan LLM en ninguna etapa.

Usar LLM para comparar `"123.456 m²"` vs `"123456 m2"` es un anti-patrón: introduce variabilidad, costo y no-auditabilidad donde se requiere exactitud absoluta.

El CrossValidator aplica normalización configurable por campo: (1) normalización básica siempre activa (trim, lowercase, normalización de espacios); (2) normalización de formatos de fecha configurable por tipo de campo; (3) normalización de nombres propios opcional. Los falsos positivos de MISMATCH son peores que los falsos negativos porque erosionan la confianza del operador.

La severidad de alertas (BLOCKING/WARNING/INFO) es configurable por el tenant a nivel de campo en el `DocumentSchemaRegistry`. CINTEL define valores por defecto; cada tenant puede ajustarlos sin intervención de CINTEL.

---

### 6. Integraciones externas y modelo de datos

**Decisión tomada:** Google Workspace y Microsoft 365 son canales de **ingesta de documentos**, no proveedores de LLM. La extracción sigue siendo realizada por el LLM Orchestrator del DIE.

`ReferenceDataset` es una entidad persistente reutilizable. El tenant sube el CSV/Excel una vez y lo reutiliza en múltiples `CrossValidationRun`. Esto permite versionamiento: cuando el tenant actualiza su fuente de referencia (p. ej. nuevo catastro municipal), sube una nueva versión y los lotes siguientes la usan automáticamente.

---

### 7. Observabilidad y despliegue

**Decisión tomada:** Métricas mínimas del MVP: `tokens_entrada`, `tokens_salida`, `latencia_ms`, tasa de fallos de parseo JSON por tipo documental, campos no extraídos por tipo documental, tasa de reintentos. Lo demás se agrega en Fase 2.

El Worker LLM (Celery) se despliega como contenedor persistente (Docker). Las funciones serverless (Lambda 15min, Cloud Run 60min) son demasiado restrictivas para documentos complejos o modelos on-premise lentos. La escalabilidad horizontal se logra con réplicas de contenedor. Kubernetes se evalúa en Fase 3.

---

### 8. Content Extraction Strategy  decisiones ya resueltas

**Decisión tomada:** La estrategia de extracción es una decisión por tipo documental y por capacidades del tenant, con los siguientes defaults:

| Condición | Estrategia |
|---|---|
| Documento digital con texto embebido (PDF/DOCX) | `NATIVE_TEXT`  extracción nativa siempre primero |
| MIME type de imagen (JPEG/PNG/TIFF) | `OCR_FALLBACK` |
| PDF sin texto embebido detectable | `OCR_FALLBACK` |
| PDF con texto < umbral de cobertura configurable | `OCR_FALLBACK` |
| LLM multimodal disponible Y soberanía lo permite | `LLM_MULTIMODAL` (explícito por tenant) |

**Motor OCR:** Tesseract como default para MVP (open-source, sin egreso de datos). Motores comerciales (Google Document AI, AWS Textract) se evalúan en Fase 2 si la precisión de Tesseract es insuficiente para el tipo documental del piloto.

**Quality score:** `quality_score = ratio de caracteres reconocibles / total`. Umbral mínimo: 0.75 configurable por tipo documental. Si `method = OCR_FALLBACK AND quality_score < umbral`  alerta WARNING automática de revisión requerida.

**LLM multimodal en nube:** solo con consentimiento explícito del tenant y DPA vigente (los documentos originales salen de la infraestructura del tenant). Sin DPA, solo `NATIVE_TEXT` o `OCR_FALLBACK` con Tesseract on-premise.

**Reprocesamiento:** operación siempre explícita. No existe cadena de fallback automático entre estrategias. El operador decide cuándo re-procesar y con qué estrategia.

**Registro:** `DocumentContentExtraction.method` con valores `NATIVE_TEXT`, `LLM_MULTIMODAL`, `OCR_FALLBACK`. Vinculado a `NormalizedDocumentRepresentation` y a cada `ExtractionRun`.

---

### 9. Verificación cruzada: requisitos funcionales vs. arquitectura

| Requisito funcional | Componente arquitectónico que lo cumple |
|---|---|
| MultiTenant con aislamiento de datos | PostgreSQL RLS + `tenant_id` en todas las queries |
| Ingesta de documentos (web, API, integración) | Document Service + File Storage + Batch Service |
| Preservar integridad del documento original | Content Extraction Strategy (nativa > multimodal > OCR) |
| Extraer campos estructurados con schema | StructuredExtractor + LLM Orchestrator + Prompt Registry |
| Validar extracción contra fuente de referencia | CrossValidator + ReferenceDataset |
| Alertas de discrepancia configurables | DiscrepancyAlertEngine + Alert Dashboard |
| Trazabilidad completa de cada extracción | AuditLog + DocumentContentExtraction + ExtractionRun |
| Operación sin Chat/RAG/Q&A | Sin Vector DB, sin embeddings, sin capa conversacional |
| API para integración con sistemas externos | API REST (FastAPI) + OpenAPI docs |
| Soberanía de datos configurable por tenant | DPA contractual (cloud) + Ollama/vLLM on-premise |

