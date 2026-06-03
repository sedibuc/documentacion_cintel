# Conclusiones y recomendaciones

## Validaciones técnicas del experto (2026-06-01)

La siguiente tabla consolida las confirmaciones y ajustes derivados de la consulta al experto técnico (sesión 2026-06-01). Aplican exclusivamente a las secciones TO-BE; el AS-IS no se modifica.

| Pregunta / Tema | Posición experta | Impacto en diseño TO-BE |
|---|---|---|
| **P-00/P-01** — LLM como extractor documental (sin OCR como paso principal) | Confirmado: alta calidad en tablas, imágenes, documentos con defectos de escaneo. LLM aporta interpretación semántica más allá de la transcripción. | Estrategia LLM-first con OCR-fallback queda técnicamente validada. |
| **P-02** — Estrategia híbrida de recuperación de contexto | Si la información es estructurada → no se necesita RAG; usar tools con queries predefinidos o Text-SQL. RAG aplica solo para información no estructurada. | Refuerza la decisión de no usar RAG en el DIE; la consulta se hace sobre datos estructurados vía API/SQL. |
| **P-07 + lineamiento #8-9** — Métricas de observabilidad y herramientas | Tokens entrada/salida/thinking, latencia, recursos, costo estimado; para extracción: entidades detectadas/esperadas y logit probabilities. Stack recomendado: **MLflow + Grafana + Ray**. Vertex AI Evaluation como alternativa cloud-native. | Se incorpora el stack completo MLflow + Grafana + Ray como infraestructura de observabilidad del piloto. |
| **P-08** — Privacidad e aislamiento multi-tenant | Framework de sesiones adecuado garantiza contexto único por usuario, sin contaminación cruzada. Memory banks por tenant para largo plazo. | El patrón `tenant_id` + RLS + sesiones aisladas del DIE cumple las garantías de aislamiento. |
| **P-09 + lineamiento #14** — Criterio de selección de proveedor LLM | Evaluar mediante experimentos (MLflow / Vertex AI Evaluation) con múltiples prompts, modelos e hiperparámetros. Candidatos validados: Gemini, OpenAI (GPT-4o), DeepSeek-OCR, Gemma4, PaliGemma. **No recomendado: Claude** (débil en multimodal). | La selección de modelo se pospone a fase de experimentación con documentos reales del piloto. |
| **Lineamiento #3** — Patrón crítico-evaluador | El agente evaluador-crítico debe diseñarse **desde V1 en los flujos de mayor riesgo de calidad** (campos críticos: montos, fechas, partes en documentos notariales y pólizas). El número de iteraciones es variable de control de costo. | Critic-Evaluator promovido de componente opcional a **requerido en flujos de alta criticidad**. |
| **Lineamiento #10** — LLM Gateway | Ante carga multi-tenant y límites de tokens/requests por minuto, el LLM Gateway es la solución de escalabilidad crítica desde MVP. | LLM Gateway declarado componente crítico MVP — no diferible. |

---

## Síntesis ejecutiva
La evolución del demostrador hacia un Document Intelligence Engine es técnicamente viable y estratégicamente adecuada para un caso de extracción estructurada con gobernanza y operación multi-tenant.

## Hallazgos centrales
- El reposicionamiento DIE evita ambiguedad funcional frente a soluciones RAG conversacionales.
- La combinación de extracción asistida por IA y validación determinística mejora control y trazabilidad.
- El mayor valor del TO-BE está en gobernanza de datos, alertamiento y operación sostenible.

## Recomendaciones prioritarias
1. Formalizar contratos de salida estructurada (schema en prompt) desde la primera iteración. El schema es parte del diseño del prompt, no del postprocesamiento.
2. Asegurar versionado de esquemas, prompts (con guardrails y few-shots por tipo documental) y reglas por tenant.
3. Definir SLA operativos y métricas de calidad de extracción; instrumentar MLflow + Grafana + Ray desde el piloto.
4. Implementar el **patrón crítico-evaluador en flujos de alta criticidad** (montos, fechas, partes): requerido en V1, no diferible.
5. Activar el **LLM Gateway desde MVP** (rate-limit, retries, fallbacks, caché): riesgo más subestimado en entornos multi-tenant.
6. Ejecutar un piloto con alcance acotado (mínimo 100 documentos reales de diferente tipo) antes de expansión.

## Criterios de éxito del MVP
- Extracción confiable en la familia documental priorizada.
- Discrepancias relevantes detectadas y trazables.
- Aislamiento multi-tenant validado en pruebas.
- Capacidad de operación con monitoreo y auditoría.

## Próximo paso recomendado
Ejecutar la evaluación exploratoria con documentos reales del piloto usando MLFlow para medir calidad de extracción por tipo documental, comparar modelos candidatos y ajustar umbrales de confianza antes de abrir producción controlada.
