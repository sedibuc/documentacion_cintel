# Cronograma de implementación por sprints

> Fecha tentativa de inicio del proyecto: **1 de julio de 2026**.

## 1. Supuestos de planificación

- Duración de sprint: 2 semanas.
- Cadencia: Sprint 0 + 6 sprints de construcción = **7 sprints totales — 14 semanas**.
- Alcance MVP: Document Intelligence Engine multi-tenant con extracción LLM, validación cruzada y salida JSON/CSV.
- Dentro de cada sprint, las actividades de software tradicional y de IA se ejecutan en paralelo. El módulo de IA se expone como **servicio interno** (API REST) a partir del Sprint 3; el sistema tradicional lo consume sin acoplamiento directo al modelo subyacente.
- La condición habilitadora de todo el plan es acordar el **contrato de API interna del módulo IA** (endpoints, esquemas, códigos de error) en Sprint 0; es bloqueante para el Sprint 1.
- **Reducción de plazo estimada: 4 semanas** frente al plan secuencial original (18 semanas → 14 semanas; cierre estimado **6 de octubre de 2026**).

## 2. Equipo por sprint

| Sprint | Objetivo | Equipo requerido |
|---|---|---|
| Sprint 0 | Preparación de plataforma y entorno IA | Tech Lead, DevOps, PO/SM, Ing. IA, Prompt Engineer, Especialista en Seguridad |
| Sprint 1 | Fundaciones multi-tenant + prototipo LLM | Tech Lead, Backend Senior, Backend Mid, Ing. IA, Prompt Engineer |
| Sprint 2 | Ingesta, APIs REST y extracción estructurada | Tech Lead, Backend Senior, Backend Mid, Frontend, Ing. IA, Prompt Engineer, Ing. Datos |
| Sprint 3 | Validación cruzada y módulo IA expuesto como API interna | Tech Lead, Backend Senior, Backend Mid, Frontend, Ing. IA, Ing. Datos, QA |
| Sprint 4 | Revisión humana, procesamiento batch y refinamiento LLM | Tech Lead, Backend Senior, Backend Mid, Frontend, QA, Ing. IA, Prompt Engineer, Ing. Datos |
| Sprint 5 | Convergencia: auditoría, observabilidad y calidad LLM | Tech Lead, Backend Senior, DevOps, Frontend, QA, Ing. IA, Ing. Datos, Especialista en Seguridad |
| Sprint 6 | Hardening técnico, UAT y piloto controlado | Todo el equipo (11 personas) |

> **Equipo total recomendado:** Tech Lead · PO/SM · Backend Senior · Backend Mid · Frontend · DevOps · Especialista en Seguridad · QA · Ing. IA · Prompt Engineer · Ing. Datos = **11 personas**.

## 3. Cronograma por sprint

| Sprint | Fechas | Actividades clave | Entregables |
|---|---|---|---|
| Sprint 0 | 2026-07-01 a 2026-07-14 | Configuración de ambientes, CI/CD, lineamientos `tenant_id`, baseline de seguridad; entorno LLM, selección de modelo base, esquemas documentales del piloto, **contrato de API interna del módulo IA** | Ambientes operativos, backlog refinado, contrato API IA acordado |
| Sprint 1 | 2026-07-15 a 2026-07-28 | Gestión de tenant/usuario, RBAC base, onboarding operativo; prototipo de extracción LLM, diseño de prompts v1, esquema JSON/CSV inicial, métricas de completitud básicas | RBAC funcional, prototipo LLM con esquema inicial |
| Sprint 2 | 2026-07-29 a 2026-08-11 | Pipeline de carga (manual/FTP), APIs REST base, modelo de datos multi-tenant; extracción estructurada por tipo documental, completitud de campos, salida JSON/CSV validada contra esquema | Pipeline de ingesta operativo, extracción LLM con salida estructurada |
| Sprint 3 | 2026-08-12 a 2026-08-25 | Validation Engine, DiscrepancyAlertEngine, tablero de alertas; CrossValidator (LLM ↔ referencia CSV), estados `MATCH`/`MISMATCH`/`PENDIENTE`, **módulo IA expuesto como API interna v1** | API IA v1 consumible por el sistema tradicional, alertas de discrepancia activas |
| Sprint 4 | 2026-08-26 a 2026-09-08 | UI de revisión humana, ciclo de aprobación, procesamiento batch, historial y descarga de resultados; refinamiento de prompts con errores reales, optimización de latencia/costo por tipo documental | Flujo completo de revisión y aprobación, batch operativo |
| Sprint 5 | 2026-09-09 a 2026-09-22 | Audit Service inmutable, trazas, métricas operativas, servicios REST finales; métricas de calidad LLM, afinación de prompts, validación de aislamiento de contexto entre tenants | Sistema integrado E2E, observabilidad activa, calidad LLM medida |
| Sprint 6 | 2026-09-23 a 2026-10-06 | Pruebas E2E, carga inicial, checklist de seguridad multi-tenant, ajustes de rendimiento; UAT con tenant piloto, validación de extracción con datos reales, ajustes finales de prompts, remediación y plan de salida controlada | Sistema productivo listo para piloto |

## 4. Diagrama de Gantt

![Diagrama de Gantt del cronograma de implementación RAG](assets/img/diagramas/cronograma-gantt-rag.png)

<a href="assets/plantuml/cronograma-gantt-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 5. Sprints y alcance por iteración

![Presentación gráfica de sprints y alcance por sprint RAG](assets/img/diagramas/cronograma-sprints-alcance-rag.png)

<a href="assets/plantuml/cronograma-sprints-alcance-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 6. Hitos de control

- Hito 0 (fin Sprint 0): contrato de API interna del módulo IA acordado, ambientes operativos.
- Hito 1 (fin Sprint 2): extracción LLM operativa con esquema del piloto; pipeline de ingesta y fundaciones multi-tenant listos.
- Hito 2 (fin Sprint 3): módulo IA expuesto como API interna v1; validación cruzada y alertas de discrepancia habilitadas.
- Hito 3 (fin Sprint 5): trazabilidad auditada, métricas operativas activas y sistema integrado de extremo a extremo.
- Hito 4 (fin Sprint 6): piloto controlado completado y listo para transición operativa.

## 7. Riesgos y mitigación

![Riesgos y mitigación del plan de implementación RAG](assets/img/diagramas/cronograma-riesgos-mitigacion-rag.png)

<a href="assets/plantuml/cronograma-riesgos-mitigacion-rag.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Contrato de API interna no acordado en Sprint 0 | Alto | Bloqueante para Sprint 1; es el primer entregable del proyecto |
| Calidad heterogénea de documentos de entrada | Alto | Estrategia de extracción por tipo documental y reglas de completitud — Sprint 2 |
| Baja calidad o ausencia de fuentes de referencia | Alto | Estandarización de plantilla CSV/JSON y validaciones previas — Sprint 2–3 |
| Latencia/costo en inferencia LLM a escala | Medio | Métricas por lote, límites operativos y afinación de prompts — Sprints 4–5 |
| Brechas de aislamiento multi-tenant | Alto | RBAC estricto desde Sprint 1, pruebas de aislamiento en Sprint 5 |
| Deriva de alcance durante piloto | Medio | Comité de cambios quincenal y backlog cerrado por hitos |
| Desincronización entre actividades de software e IA | Medio | Sincronización semanal de equipo; contrato de API como interfaz estable |

## 8. Dependencias críticas

- Contrato de API interna del módulo IA acordado en Sprint 0 (bloqueante).
- Esquemas documentales del piloto aprobados en Sprint 0–1.
- Datasets de referencia disponibles para validación cruzada en Sprint 2.
- Infraestructura de observabilidad y pruebas de carga disponible en Sprint 5.
- Tenant piloto, criterios de aceptación UAT y ventana de despliegue definidos antes del Sprint 6.

---

Trazabilidad: [TO-BE funcional](tobefuncional.html) · [Decisiones de módulos](decisiones-modulos.html) · [Arquitectura TO-BE](arquitectura-tobe.html)
