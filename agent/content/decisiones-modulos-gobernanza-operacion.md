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
| Set mínimo MVP | Latencia, errores, costo por sesión, estado de aprobación y trazabilidad por campaña. |
| Riesgos técnicos | Cobertura parcial de eventos y baja calidad de diagnóstico. |
| Controles | Contrato de eventos, correlación por campaign_id y monitoreo de SLO críticos. |

## 3. Decisiones de diseño vigentes

- HumanValidationModule es obligatorio en MVP como control principal de riesgo institucional.
- Export/PublishingAdapter mantiene enfoque offline-first en V1 para reducir riesgo operativo.
- ObservabilityService se instrumenta desde MVP para soportar trazabilidad y mejora continua.

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
<a href="assets/plantuml/decisiones-modulos-gobernanza-operacion-arquitectura.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

## 6. Criterios de aceptación

- Ninguna pieza se exporta sin decisión explícita de validación humana.
- Toda entrega registra estado técnico y metadatos de operación.
- ObservabilityService correlaciona evento por `tenant_id`, `campaign_id` y `piece_id`.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html)
