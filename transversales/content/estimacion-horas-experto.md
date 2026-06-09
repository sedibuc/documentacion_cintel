# Estimación de consumo de horas — Consulta con experto técnico

> Esta página consolida el registro de sesiones ejecutadas y la estimación de horas de la consulta con el experto técnico por micrositio.
>
> **Total estimado: 38 horas** — 34 horas de trabajo técnico por micrositio + 2 horas de revisión y sugerencias de arquitectura (Agent) + 2 horas de revisión y sugerencias de arquitectura (DIE) + 2 horas de reuniones de coordinación.

---

## 1. Registro de sesiones (real)

Las siguientes sesiones han sido ejecutadas y registradas por el experto. Representan las horas consumidas a la fecha de corte.

| # | Horas | Descripción | Fecha |
|---|---|---|---|
| 1 | 1.0 | Análisis y entendimiento de todos los documentos | 05/10/2026 |
| 2 | 1.0 | Debate y diálogo sobre el uso de LLMs como OCR y NER | 05/11/2026 |
| 3 | 6.0 | Respuestas dudas sobre DIE | 06/01/2026 |
| 4 | 4.0 | Respuestas dudas Agente Marketing | 06/01/2026 |
| **Total consumido** | **12.0** | | |

---

## 2. Estimación técnica — Adaptador de Contenido Institucional (Agent)

Enlace: [Preguntas para experto técnico](../agent/preguntas-experto-tecnico.html)

| Código | Pregunta / Decisión validada | Tipo de respuesta | Complejidad | Horas est. |
|---|---|---|---|---|
| P-00 | Formalización de lectura de marca con LLM sin OCR | Confirmación + condiciones de calidad | Baja | 0.5 |
| P-01 | Cobertura de LLM multimodal en manuales de marca | Tabla por tipo de documento + riesgo operativo | Media | 1.0 |
| P-02 | Estrategia híbrida de recuperación de contexto | Análisis de arquitectura + condición de activación vector DB | Alta | 1.5 |
| P-03 | Representación mínima de marca útil para el modelo | Lista priorizada de atributos de alta señal | Media | 1.0 |
| P-04 | Modelos generativos de imagen bajo restricciones de marca | Evaluación de viabilidad + mecanismos de control | Alta | 1.5 |
| P-05 | Adaptación de salidas por canal con modelos | Lista por canal + recomendación técnica | Media | 1.0 |
| P-06 | Separación entre agente estratégico y agente creativo | Comparativa pipeline por etapas vs. inferencia única | Media | 1.0 |
| P-07 | Evaluación y observabilidad de calidad del modelo | Lista priorizada de métricas + herramienta recomendada | Media-Alta | 1.0 |
| P-08 | Privacidad y aislamiento en flujos soportados por modelos | Riesgos + salvaguardas técnicas por flujo | Alta | 2.0 |
| P-09 | Criterios para selección de proveedor LLM | Candidatos + criterios de evaluación ponderados | Alta | 1.5 |
| **Subtotal Agent** | | | | **12.0** |

---

## 3. Estimación técnica — Document Intelligence Engine MultiTenant (DIE)

Enlace: [Cuestionario preliminar para experto en modelos](../RAG/preguntasexperto.html)

| Bloque | Tema | Preguntas | Tipo de respuesta | Complejidad | Horas est. |
|---|---|---|---|---|---|
| Bloque 1 | Factibilidad general de la necesidad (incl. P-26 NER) | 4 | Opinión técnica preliminar + condiciones de fallo | Media | 2.0 |
| Bloque 2 | Enfoques técnicos a explorar | 3 | Comparativa de estrategias de extracción | Media | 1.5 |
| Bloque 3 | Modelos o familias candidatas | 3 | Lista de candidatos con justificación técnica | Media | 1.0 |
| Bloque 4 | Calidad, trazabilidad y control de errores | 4 | Métricas, mecanismos de control, señales de detección | Alta | 2.5 |
| Bloque 5 | Soberanía, privacidad y operación multi-tenant | 3 | Condiciones contractuales + riesgos técnicos por tenant | Alta | 1.5 |
| Bloque 6 | Riesgos críticos de implementación | 3 | Lista de riesgos con contexto de documentos notariales | Alta | 1.5 |
| Bloque 7 | Evaluación exploratoria posterior | 3 | Experimentos mínimos + criterios de descarte | Alta | 1.5 |
| Bloque 8 | Recomendaciones y advertencias finales | 3 | Supuestos débiles + prioridades exploratorias | Alta | 1.0 |
| — | Plantilla de evaluación comparativa de modelos | 1 | Completar / ajustar tabla de candidatos | Media | 1.5 |
| **Subtotal DIE** | | **26 preguntas** | | | **14.0** |

---

## 4. Revisión y sugerencias de arquitectura

Tarea adicional aplicada a ambos micrositios: revisión crítica de las decisiones de arquitectura TO-BE, comentarios sobre consistencia, riesgos no cubiertos y sugerencias de mejora accionables.

La distribución de horas es proporcional a la complejidad de cada sistema: DIE concentra mayor carga por su arquitectura de extracción multietapa, LLM Gateway, batch y capa de validación cruzada; el Agente es más acotado en capas pero requiere revisión del pipeline multi-agente y del patrón crítico-evaluador.

| Tarea | Micrositio | Alcance | Complejidad | Horas est. |
|---|---|---|---|---|
| Revisión de arquitectura multi-agente y decisiones TO-BE | Agent | ADK, memoria por tenant, pipeline estratégico-creativo, canales | Alta | 1.5 |
| Comentarios sobre patrón crítico-evaluador, observabilidad y privacidad | Agent | Métricas, logprobs, aislamiento multi-tenant, selección LLM | Alta | 1.5 |
| Revisión de estrategia de extracción, quality control y validación cruzada | DIE | Content Extraction Strategy, StructuredExtractor, guardrails, few-shots, CrossValidator | Alta | 2.5 |
| Comentarios sobre LLM Gateway, batch, escalabilidad y arquitectura TO-BE | DIE | LLM Gateway, Celery/Redis, RLS, Validation Layer, DocumentSchemaRegistry, roadmap | Alta | 2.5 |
| **Subtotal revisión** | **DIE 5.0 h · Agent 3.0 h** | | | **8.0** |

---

## 5. Resumen por micrositio

| Concepto | DIE | Agente | Total |
|---|---|---|---|
| Preparación inicial (análisis de documentos + debate LLMs/OCR/NER) | 1.0 h | 1.0 h | 2.0 h |
| Respuestas técnicas (preguntas / bloques) | 14.0 h | 12.0 h | 26.0 h |
| Revisión y sugerencias de arquitectura | 5.0 h | 3.0 h | 8.0 h |
| **Subtotal técnico** | **20.0 h** | **16.0 h** | **36.0 h** |
| Reuniones de coordinación y seguimiento | 1.0 h | 1.0 h | 2.0 h |
| **Total estimado** | **21.0 h** | **17.0 h** | **38.0 h** |

---

## 6. Estado de avance

| Concepto | DIE | Agente | Total |
|---|---|---|---|
| Preparación inicial | 1.0 h | 1.0 h | 2.0 h |
| Respuestas técnicas | 14.0 h | 12.0 h | 26.0 h |
| Revisión y sugerencias de arquitectura | 5.0 h | 3.0 h | 8.0 h |
| Reuniones | 1.0 h | 1.0 h | 2.0 h |
| **Total** | **21.0 h** | **17.0 h** | **38.0 h** |

> Las horas consumidas corresponden al registro de sesiones de la sección 1. Las horas pendientes representan la estimación restante para cerrar la consulta completa.

---

## 7. Trazabilidad

- **Agent** → [Preguntas P-00 a P-09](../agent/preguntas-experto-tecnico.html) · [Arquitectura TO-BE optimizada](../agent/to-be-arquitectura.html)
- **DIE** → [Cuestionario preliminar](../RAG/preguntasexperto.html) · [Arquitectura TO-BE](../RAG/arquitectura-tobe.html)
- **Transversal** → [Funcionalidades transversales](funcionalidades.html) · [Arquitectura transversal](arquitectura.html)
