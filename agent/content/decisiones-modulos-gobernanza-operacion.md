# Módulos de gobernanza y operación

## 1. Alcance

Esta página detalla los módulos responsables de control humano, entrega operativa y observabilidad del sistema.

## 2. Fichas técnicas por módulo

### 2.1 HumanValidationModule

| Característica | Definición técnica |
|---|---|
| Propósito | Garantizar revisión, aprobación o rechazo humano de resultados antes de salida final. |
| Entradas | Propuestas de estrategia y piezas, contexto usado y advertencias de riesgo. |
| Salidas | Estado aprobado/rechazado, justificación y versión validada. |
| Reglas de operación | Sin aprobación humana no se permite exportación/publicación. |
| Riesgos técnicos | Cuellos de botella por exceso de pasos manuales. |
| Controles | Bandeja priorizada, trazabilidad de decisiones y reglas de escalamiento. |

### 2.2 Export/PublishingAdapter

| Característica | Definición técnica |
|---|---|
| Propósito | Entregar contenido por canal mediante exportación asistida en V1 y automatización gradual en V2. |
| Entradas | Piezas aprobadas, metadatos de campaña y configuración de canal. |
| Salidas | Paquetes exportables o envío automatizado según madurez del canal. |
| Estrategia V1 | Offline-first con exportación asistida y registro de entrega. |
| Riesgos técnicos | Fallas de integración API, diferencias regulatorias por canal. |
| Controles | Feature flags por canal, reintentos, fallback manual y registro de errores. |

### 2.3 ObservabilityService

| Característica | Definición técnica |
|---|---|
| Propósito | Medir y auditar ejecución técnica y funcional de extremo a extremo. |
| Entradas | Eventos de agentes, decisiones humanas, métricas de canal y costos de IA. |
| Salidas | Tableros operativos, trazas por campaña, alertas y reportes de auditoría. |
| Set mínimo MVP — Base | Tokens de input/output, tokens de *thinking*, latencia por solicitud, estimación de costos, uso de recursos (RAM, CPU, red). |
| Set mínimo MVP — Extracción | Entidades detectadas vs. esperadas; `logit_probs` de entidades críticas (para flujos OCR/NER). |
| Set mínimo MVP — Crítico-evaluador | Score de imagen/estrategia/post por iteración; número de feedbacks generados por ciclo; **número de iteraciones del ciclo** (variable de control de costo). |
| Set mínimo MVP — Operación | Estado de aprobación, trazabilidad por campaña, errores por canal. |
| Stack de herramientas recomendado | **MLflow** para experimentos, A/B testing y monitoreo en tiempo real. **Grafana** para dashboards operativos y alertas. **Ray** para observabilidad distribuida en inferencia a escala. |
| Riesgos técnicos | Cobertura parcial de eventos y baja calidad de diagnóstico. |
| Controles | Contrato de eventos, correlación por campaign_id y monitoreo de SLO críticos. |
| Validado por experto | ✅ P-07 / lineamiento transversal #8-9 — Junio 2026 |

## 3. Decisiones de diseño vigentes

- HumanValidationModule es obligatorio en MVP como control principal de riesgo institucional.
- Export/PublishingAdapter mantiene enfoque offline-first en V1 para reducir riesgo operativo.
- ObservabilityService se instrumenta desde MVP con métricas validadas por el experto técnico (tokens, latencia, costos, scores del patrón crítico-evaluador). Stack recomendado: **MLflow + Grafana + Ray**. (✅ P-07 + lineamiento transversal #8-9)
- El número de iteraciones del ciclo crítico-evaluador es una **variable de control de costo** que debe monitorearse con MLflow y ajustarse por configuración.
- La selección del proveedor LLM se realiza mediante experimentos en MLflow o Vertex AI Evaluation, no con una matriz estática. Candidatos validados: Gemini, OpenAI (GPT-4o), Gemma4. **No recomendado: Claude** (multimodal débil). La selección se basa en evidencia experimental para las tareas concretas del sistema. (✅ P-09)

## 4. Contratos técnicos y eventos

### 4.1 Contratos mínimos

`ValidationDecision`

```json
{
	"piece_id": "pcs_001",
	"decision": "approved",
	"reviewer": "usr_045",
	"reason": "cumple lineamientos"
}
```

`DeliveryResult`

```json
{
	"piece_id": "pcs_001",
	"channel": "linkedin",
	"mode": "assisted_export",
	"status": "delivered"
}
```

### 4.2 API mínima

- `POST /api/validation/decision`
- `POST /api/export/run`
- `POST /api/publishing/run`
- `POST /api/observability/event`

Eventos:

- `validation.decision.recorded`
- `delivery.completed`
- `delivery.failed`
- `observability.alert.raised`

## 5. Diagrama técnico del dominio

![Arquitectura de gobernanza y operación](assets/img/diagramas/decisiones-modulos-gobernanza-operacion-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-gobernanza-operacion-arquitectura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

## 6. Criterios de aceptación

- Ninguna pieza se exporta sin decisión explícita de validación humana.
- Toda entrega registra estado técnico y metadatos de operación.
- ObservabilityService correlaciona evento por `tenant_id`, `campaign_id` y `piece_id`.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html)

