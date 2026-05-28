# Cronograma de implementación por sprints

> Fecha tentativa de inicio del proyecto: **1 de julio de 2026**.

## 1. Supuestos de planificación

- Duración de sprint: 2 semanas.
- Cadencia: Sprint 0 + 8 sprints de construcción.
- Alcance MVP: Document Intelligence Engine multi-tenant con extracción LLM, validación cruzada y salida JSON/CSV.
- Enfoque de entrega: cierre incremental por capacidades operativas para piloto controlado.

## 2. Cronograma por sprint

| Sprint | Fechas tentativas | Objetivo principal | Entregables clave |
|---|---|---|---|
| Sprint 0 | 2026-07-01 a 2026-07-14 | Preparación de plataforma y seguridad base | Ambientes, baseline de seguridad, lineamientos de `tenant_id`, backlog refinado |
| Sprint 1 | 2026-07-15 a 2026-07-28 | Fundaciones multi-tenant | Gestión de tenant/usuario, RBAC base, onboarding operativo inicial |
| Sprint 2 | 2026-07-29 a 2026-08-11 | Ingesta y extracción estructurada LLM | Pipeline de carga (manual/FTP), estrategia de extracción, salida JSON con completitud |
| Sprint 3 | 2026-08-12 a 2026-08-25 | Validación y comparación cruzada | Validation Engine, CrossValidator CSV/JSON, estado por campo (`MATCH`/`MISMATCH`/`PENDIENTE`) |
| Sprint 4 | 2026-08-26 a 2026-09-08 | Gestión de discrepancias y revisión humana | DiscrepancyAlertEngine, tablero de alertas, ciclo de resolución y aprobación |
| Sprint 5 | 2026-09-09 a 2026-09-22 | Integraciones y operación por lotes | Servicios REST MVP, procesamiento batch, historial y descarga de resultados |
| Sprint 6 | 2026-09-23 a 2026-10-06 | Auditoría y observabilidad | Audit Service inmutable, trazas, métricas de calidad de extracción y operación |
| Sprint 7 | 2026-10-07 a 2026-10-20 | Hardening técnico y no funcionales | Pruebas E2E, carga inicial, checklist de seguridad multi-tenant, ajustes de rendimiento |
| Sprint 8 | 2026-10-21 a 2026-11-03 | Estabilización y salida a piloto | UAT con tenant piloto, remediación final y plan de salida controlada |

## 3. Diagrama de Gantt

![Diagrama de Gantt del cronograma de implementación RAG](assets/img/diagramas/cronograma-gantt-rag.png)

<a href="assets/plantuml/cronograma-gantt-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 4. Sprints y alcance por iteración

![Presentación gráfica de sprints y alcance por sprint RAG](assets/img/diagramas/cronograma-sprints-alcance-rag.png)

<a href="assets/plantuml/cronograma-sprints-alcance-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 5. Hitos de control

- Hito 1 (fin Sprint 2): extracción LLM operativa con esquema documental del piloto.
- Hito 2 (fin Sprint 4): validación cruzada y resolución de discrepancias habilitadas.
- Hito 3 (fin Sprint 6): trazabilidad auditada y métricas operativas activas.
- Hito 4 (fin Sprint 8): piloto controlado listo para transición operativa.

## 6. Riesgos y mitigación

![Riesgos y mitigación del plan de implementación RAG](assets/img/diagramas/cronograma-riesgos-mitigacion-rag.png)

<a href="assets/plantuml/cronograma-riesgos-mitigacion-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Calidad heterogénea de documentos de entrada | Alto | Estrategia de extracción por tipo + reglas de completitud en Sprint 2 |
| Baja calidad o ausencia de fuentes de referencia | Alto | Estandarización de plantilla CSV/JSON y validaciones previas en Sprint 3 |
| Latencia/costo en inferencia LLM a escala | Medio | Métricas por lote, límites operativos y afinación de prompts desde Sprint 6 |
| Brechas de aislamiento multi-tenant | Alto | RBAC estricto, auditoría y pruebas de aislamiento desde Sprint 1 |
| Deriva de alcance durante piloto | Medio | Comité de cambios quincenal y backlog cerrado por hitos |

## 7. Dependencias críticas

- Definición y aprobación temprana de esquemas documentales del piloto.
- Disponibilidad de datasets de referencia para validación cruzada.
- Acceso a infraestructura para observabilidad y pruebas de carga.
- Definición de tenant piloto, criterios de aceptación UAT y ventana de despliegue.

---

Trazabilidad: [TO-BE funcional](to-befuncional.html) · [Decisiones de módulos](decisiones-modulos.html) · [Arquitectura TO-BE](arquitectura-tobe.html)
