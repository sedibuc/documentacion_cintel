# PoC DIE — Las Galias

<div class="badge-row">
<span class="badge">PoC: Document Intelligence Engine</span>
<span class="badge">Cliente: Las Galias</span>
<span class="badge">1 ingeniero · 20 días de trabajo</span>
<span class="badge">Jun 9 – Jun 30, 2026</span>
<span class="badge badge-note">Mono-tenant · Diseñado para escalar a MultiTenant</span>
</div>

> **Qué es esta sección:** documentación completa de la Prueba de Concepto (PoC) del Document Intelligence Engine aplicada al proyecto Las Galias. Esta PoC es un subconjunto funcional y técnico de la arquitectura TO-BE del DIE MultiTenant definida en el [micrositio RAG](../RAG/index.html), ejecutable por un solo ingeniero en un ciclo de 3 sprints semanales (Jun 9 – Jun 30, 2026).

---

## ¿Qué es la PoC DIE · Las Galias?

La PoC es un sistema funcional mínimo que demuestra la viabilidad del enfoque TO-BE del Document Intelligence Engine extrayendo campos estructurados de documentos tipados del proyecto Las Galias, validando los resultados contra fuentes de referencia y generando alertas de discrepancia clasificadas.

La PoC **no es** un sistema productivo multi-cliente. Es la demostración controlada, con datos reales de un cliente específico, de que la arquitectura TO-BE del DIE funciona técnicamente y puede escalar.

### Lo que la PoC demuestra

| Capacidad | ¿Incluida en PoC? | Referencia TO-BE |
|---|---|---|
| Ingesta de documentos tipados (PDF/DOCX) | ✅ Sí | Content Extraction Strategy |
| Extracción estructurada con LLM + guardrails | ✅ Sí | StructuredExtractor |
| Validación de formato y campos obligatorios | ✅ Sí | Validation Engine |
| Comparación cruzada contra referencia CSV | ✅ Sí | CrossValidator |
| Alertas de discrepancia BLOCKING/WARNING/INFO | ✅ Sí | DiscrepancyAlertEngine |
| Exportación estructurada JSON/CSV | ✅ Sí | Salida estructurada |
| Trazabilidad mínima por ejecución | ✅ Sí | Audit Service (simplificado) |
| API REST documentada | ✅ Sí | FastAPI + OpenAPI |
| Gestión multi-tenant | ❌ PoC mono-tenant | TO-BE completo |
| RBAC por tenant | ❌ Simplificado | TO-BE completo |
| UI completa de revisión humana | ❌ API + CLI | TO-BE completo |
| Procesamiento batch asíncrono (Celery/Redis) | ❌ Síncrono en PoC | TO-BE completo |
| LLM Gateway completo con fallbacks | ❌ Simplificado | TO-BE completo |

### Por qué `tenant_id` está presente desde el día 1

Aunque la PoC opera con un solo cliente (Las Galias), **todos los modelos de datos incluyen el campo `tenant_id`** fijo al valor `"las-galias"`. Esta decisión deliberada garantiza que la PoC sea **ampliable al sistema MultiTenant sin refactorización mayor**: al agregar multi-tenant se activa la gestión de tenants, el RBAC completo y el LLM Gateway con rate-limiting por tenant, pero la estructura de datos no cambia.

---

## Documentos de Las Galias en scope

Las Galias es un proyecto del sector construcción e inmobiliario. La PoC cubre la extracción estructurada de **dos tipos documentales** con alta frecuencia operativa:

| Código | Tipo documental | Campos clave extraídos | Fuente de referencia |
|---|---|---|---|
| `DOC_PROMESA` | Promesa de Compraventa | Comprador, vendedor, precio, forma de pago, fecha firma, número notaría, matrícula inmobiliaria, área | CSV maestro de promesas Las Galias |
| `DOC_ESCRITURA` | Escritura Pública | Número escritura, notaría, fecha, precio declarado, partes (cédulas), matrícula inmobiliaria, linderos | CSV maestro de escrituras Las Galias |

> **Criterio de selección:** Estos dos tipos concentran el mayor volumen de validación manual actual en Las Galias y tienen esquemas de campos bien definidos, lo que los hace ideales para la PoC. Un tercer tipo (`DOC_CERTIF_TRADICION`) se evaluará como extensión si el cronograma lo permite.

---

## Relación con la arquitectura TO-BE

Esta PoC es un subconjunto **técnico y funcional** del DIE MultiTenant:

- **Mismos patrones**: LLM-first extraction, few-shots, guardrails, logprobs, structured output, cross-validation, discrepancy alerts.
- **Mismos componentes técnicos** (simplificados): StructuredExtractor, CrossValidator, DiscrepancyAlertEngine, Audit Log.
- **Mismo contrato de datos**: todos los modelos tienen `tenant_id`, los mismos campos de trazabilidad y el mismo formato de salida JSON/CSV.
- **Diferencia principal**: la PoC no tiene UI de gestión, no tiene Celery/Redis, no tiene LLM Gateway con fallback multi-proveedor, no tiene RBAC completo. Estas capas **se añaden** en la evolución al sistema completo.

---

## Estructura de esta sección

| Página | Contenido |
|---|---|
| [Alcance, arquitectura y definición técnica](alcance.html) | Qué está in/out, diagramas de arquitectura PoC vs TO-BE |
| [Prerequisitos y validaciones externas](prerequisitos.html) | Datos, credenciales y aprobaciones requeridos con sus hitos de entrega |
| [Cronograma de trabajo](cronograma.html) | 3 sprints semanales Jun 9–30 con entregables y milestones |
| [Prototipo de la PoC](prototipo.html) | Contrato de API, ejemplos input/output, Docker Compose, estructura de carpetas |
| [Riesgos y mitigaciones](riesgos.html) | Matriz de riesgos con probabilidad, impacto y planes de contingencia |

---

Trazabilidad: [TO-BE funcional DIE](../RAG/tobefuncional.html) · [Arquitectura TO-BE](../RAG/arquitectura-tobe.html) · [Especificación PoC RAG](../Especificacion-PoC-RAG.md)
