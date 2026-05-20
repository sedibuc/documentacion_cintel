# Document Intelligence Engine MultiTenant

<div class="badge-row">
<span class="badge">Producto: Document Intelligence Engine</span>
<span class="badge">Arquitectura: MultiTenant · Esencial MVP</span>
<span class="badge">Sector piloto: construcción</span>
<span class="badge">Salida: JSON · CSV</span>
<span class="badge">Motor de extracción: LLM (zero-shot / few-shot)</span>
<span class="badge badge-note">NER supervisado: evaluación post-producción</span>
</div>

Este micrositio documenta el **Document Intelligence Engine MultiTenant** propuesto por CINTEL: un sistema que convierte documentos tipados en datos estructurados, valida esos datos contra fuentes de referencia, genera alertas de discrepancia y opera bajo un modelo multi-cliente controlado por CINTEL.

> **Reposicionamiento de producto (2026-05):** El sistema deja de ser un RAG conversacional o agente de Q&A documental. El producto central es un **Document Intelligence Engine MultiTenant** orientado a extracción estructurada, validación cruzada y gestión de alertas de discrepancia. Sin chat. Sin respuesta libre. Sin vectores.

## Qué problema resuelve

Las organizaciones que operan con grandes volúmenes de documentos tipados —certificados de tradición, contratos de obra, pólizas HSE— invierten tiempo manual en extraer datos, contrastarlos contra fuentes de referencia y gestionar las discrepancias encontradas. Este proceso es lento, inconsistente entre operadores y difícil de auditar.

El Document Intelligence Engine convierte documentos tipados en **datos estructurados, comparables y auditables**, de forma automatizada, con salida directamente consumible por operación.

## Pipeline del sistema

| Etapa | Componente | Tipo |
|---|---|---|
| **OCR / Extracción de texto** | OCR Service | Procesamiento |
| **Extracción estructurada** | StructuredExtractor + LLM Orchestrator | IA / LLM |
| **Mapeo al esquema** | DocumentSchemaRegistry | Tradicional |
| **Validación determinística** | Validation Engine | Híbrido |
| **Comparación cruzada** | CrossValidator (CSV / Excel de referencia) | Tradicional |
| **Motor de alertas** | DiscrepancyAlertEngine | Tradicional |
| **Revisión y aprobación** | Alert Dashboard / Human Review | Tradicional |
| **Exposición de resultados** | API REST + JSON / CSV | Tradicional |

## Componentes clave del MVP

| Componente | Función | MVP |
|---|---|---|
| **MultiTenant Platform Core** | Empresas cliente, usuarios, RBAC, aislamiento total por tenant | ✓ Esencial |
| **DocumentSchemaRegistry** | Tipos documentales, campos esperados, versiones | ✓ MVP |
| **StructuredExtractor** | Extracción de campos vía LLM con salida JSON estructurada | ✓ MVP |
| **Prompt Registry** | Prompts versionados por tipo documental | ✓ MVP |
| **CrossValidator** | Comparación campo a campo contra CSV/Excel de referencia | ✓ MVP |
| **DiscrepancyAlertEngine** | Alertas de discrepancia con severidad BLOCKING/WARNING/INFO | ✓ MVP |
| **Alert Dashboard** | Human review, resolución de alertas, trazabilidad | ✓ MVP |
| **API REST** | Canal principal de integración con sistemas clientes | ✓ MVP |
| **Audit Service** | Trazabilidad inmutable por tenant/documento | ✓ MVP |
| NER supervisado | Extracción con modelos entrenados en corpus anotado | ○ Post-producción |
| Chat / RAG conversacional | Respuesta libre a preguntas sobre documentos | ✗ Fuera de alcance |
| Fine-tuning de LLM | Entrenamiento de modelos propios | ✗ Fuera de alcance |

## Tipos documentales del piloto

| Tipo documental | Estado |
|---|---|
| Certificado de tradición y libertad | PRODUCCIÓN ✓ |
| Contrato de obra | BETA ○ |
| Póliza de seguro HSE | EN DESARROLLO ○ |

## Modelo de operación MultiTenant

El sistema opera bajo un modelo de múltiples clientes (**tenants**) administrado por CINTEL:

- **CINTEL** administra la plataforma: gestión de tenants, modelos LLM, configuraciones globales.
- **Cada empresa cliente (tenant)** tiene sus tipos documentales, usuarios, prompts y resultados completamente aislados de los demás.
- El aislamiento es a nivel de datos (Row-Level Security), almacenamiento (prefijo `tenant_id/`) y auditoría.
- No existe acceso cruzado entre tenants en ninguna capa del sistema.

## Secciones de este sitio

- [TO-BE funcional](tobefuncional.html) — Especificación completa del Document Intelligence Engine, componentes, pipeline y restricciones de alcance.
- [Arquitectura TO-BE](arquitecturatobe.html) — 8 vistas arquitectónicas del Document Intelligence Engine MultiTenant.
- [Preguntas para el experto](preguntasexperto.html) — Cuestionario preliminar para validación especializada en arquitectura DIE MultiTenant.
- [Por qué no es un RAG](no-es-rag.html) — Argumentación técnica de por qué el sistema es un motor de extracción estructurada, no un RAG ni un sistema de Q&A.
- [Diagnóstico técnico](diagnostico.html) — Análisis del demostrador RAG existente que origina este reposicionamiento.
- [Arquitectura vigente](arquitectura.html) — Componentes y flujos del demostrador RAG actual (AS-IS).
- [Brechas y oportunidades](brechas.html) — Brechas entre el demostrador actual y el Document Intelligence Engine.
- [Configuración y despliegue](despliegue.html) — Guía técnica del sistema base actual.
- [Servicios y costos](costos.html) — Inventario de servicios y variables de costo.