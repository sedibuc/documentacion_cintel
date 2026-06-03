# Cronograma de implementación por sprints

> Fecha tentativa de inicio del proyecto: **1 de julio de 2026**.

## 1. Supuestos de planificación

- Duración de sprint: 2 semanas.
- Cadencia: Sprint 0 + 8 sprints de construcción.
- Enfoque: entregar MVP funcional con gobernanza humana y evolución controlada.

## 2. Cronograma por sprint

| Sprint | Fechas tentativas | Objetivo principal | Entregables clave |
|---|---|---|---|
| Sprint 0 | 2026-07-01 a 2026-07-14 | Preparación técnica y base de datos | Modelo de datos, tenant_id transversal, ambientes base, **LLM Gateway configurado**, backlog refinado |
| Sprint 1 | 2026-07-15 a 2026-07-28 | Fundaciones de contexto institucional | OrganizationalContextStore, OnboardingService base, autenticación mínima |
| Sprint 2 | 2026-07-29 a 2026-08-11 | Núcleo de marca y completitud | BrandGuidelinesStore, lectura de marca con LLM/VLM multimodal (sin OCR), CompletenessScorer |
| Sprint 3 | 2026-08-12 a 2026-08-25 | Agente Estratégico | Flujo conversacional estratégico, brief institucional con salida estructurada (schema JSON), guardrails y few-shots |
| Sprint 4 | 2026-08-26 a 2026-09-08 | Agente Creativo y canales especializados | CreativeAgent, LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent (paralelo), CriticAgent |
| Sprint 5 | 2026-09-09 a 2026-09-22 | Gobernanza y validación humana | HumanValidationModule, reglas de aprobación/rechazo, trazabilidad funcional |
| Sprint 6 | 2026-09-23 a 2026-10-06 | Histórico y recuperación de contexto | CampaignHistoryStore, ContextRetrievalService, reutilización de campañas |
| Sprint 7 | 2026-10-07 a 2026-10-20 | Entrega operativa MVP | Export/PublishingAdapter (exportación asistida), **BatchInferenceQueue** para variantes masivas, hardening técnico |
| Sprint 8 | 2026-10-21 a 2026-11-03 | Estabilización y salida a piloto | **ObservabilityService (MLflow + Grafana + Ray)**, pruebas E2E, checklist de seguridad, preparación piloto |

## 3. Diagrama de Gantt

![Diagrama de Gantt del cronograma de implementación](assets/img/diagramas/cronograma-gantt.png)

<a href="assets/plantuml/cronograma-gantt.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 4. Sprints y alcance por iteración

![Presentación gráfica de sprints y alcance por sprint](assets/img/diagramas/cronograma-sprints-alcance.png)

<a href="assets/plantuml/cronograma-sprints-alcance.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

## 5. Hitos de control

- Hito 1 (fin Sprint 2): Perfil institucional persistente operativo.
- Hito 2 (fin Sprint 4): Flujo completo de estrategia + creatividad por canal.
- Hito 3 (fin Sprint 6): Memoria organizacional y recuperación contextual habilitadas.
- Hito 4 (fin Sprint 8): MVP estabilizado y listo para piloto controlado.

## 6. Riesgos y mitigación

![Riesgos y mitigación del plan de implementación](assets/img/diagramas/cronograma-riesgos-mitigacion.png)

<a href="assets/plantuml/cronograma-riesgos-mitigacion.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Insumos de marca incompletos | Alto | Checklist de entrada y gate de calidad en Sprint 1 |
| Retrasos en seguridad multi-organización | Alto | Hardening técnico y checklist de seguridad desde Sprint 0 |
| Variabilidad en calidad de salidas IA | Medio | Salidas estructuradas obligatorias + patrón crítico-evaluador + validación humana obligatoria |
| Escalabilidad por tokens/requests por minuto (multi-tenant) | Alto | **LLM Gateway desde Sprint 0** (rate-limit, retries, fallbacks, caché) — no diferible |
| Deriva de alcance del MVP | Medio | Control de cambios quincenal y priorización estricta de backlog |
| Alucinaciones en salidas de agentes | Medio | Guardrails + few-shots por canal + salidas estructuradas + patrón crítico-evaluador |

## 7. Dependencias críticas

- Disponibilidad de insumos de marca por cliente para validar lectura con LLM/VLM multimodal.
- **LLM Gateway** configurado y operativo en Sprint 0 antes de cualquier integración de agentes (bloqueante).
- Definición temprana de checklist de seguridad multi-organización.
- Aprobación de canales MVP para exportación asistida.
- Experimentos MLflow con datos reales del cliente piloto antes de seleccionar proveedor LLM definitivo.

---

Trazabilidad: [Arquitectura TO-BE](to-be-arquitectura.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html) · [Mapa de módulos](decisiones-modulos.html)
