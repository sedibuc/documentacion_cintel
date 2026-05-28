# Módulos de agentes y canales

## 1. Alcance

Esta página define las características técnicas de los módulos que transforman contexto en estrategia, piezas y salidas por canal.

## 2. Fichas técnicas por módulo

### 2.1 StrategicAgent

| Característica | Definición técnica |
|---|---|
| Propósito | Proponer estrategia institucional: objetivo, audiencia, mensajes, tono y canales. |
| Entradas | Context package, histórico de campañas y restricciones institucionales. |
| Salidas | Brief estratégico estructurado y justificable. |
| Contrato de salida | Objetivo, hipótesis, audiencias, mensajes, canales, supuestos y riesgos. |
| Riesgos técnicos | Estrategias genéricas sin anclaje institucional. |
| Controles | Plantillas obligatorias de salida, checklist de coherencia y trazabilidad de fuentes. |

### 2.2 CreativeAgent

| Característica | Definición técnica |
|---|---|
| Propósito | Generar y adaptar contenido creativo con reglas institucionales y de canal. |
| Entradas | Brief estratégico, perfil de marca, activos permitidos y reglas de publicación. |
| Salidas | Variantes de piezas textuales/visuales con justificación por canal. |
| Restricciones clave | Respeto de tono, claims permitidos, derechos de imagen y límites de formato. |
| Riesgos técnicos | Deriva de estilo o uso de activos no autorizados. |
| Controles | Validación previa contra BrandGuidelinesStore y control humano obligatorio. |

### 2.3 ChannelFormatters

| Característica | Definición técnica |
|---|---|
| Propósito | Convertir contenido base a formatos operables por canal (email, Instagram, WhatsApp, web/intranet). |
| Entradas | Piezas propuestas por CreativeAgent y reglas técnicas por canal. |
| Salidas | Entregables listos para exportación o publicación asistida. |
| Reglas técnicas | Longitud, estructura, dimensiones, metadatos y restricciones de cada canal. |
| Riesgos técnicos | Inconsistencias entre versiones de canal o pérdida de intención del mensaje. |
| Controles | Pruebas por plantilla, validaciones de formato y revisión humana previa a salida. |

## 3. Decisiones de diseño vigentes

- StrategicAgent y CreativeAgent se mantienen separados para facilitar gobernanza y explicabilidad.
- ChannelFormatters es obligatorio para preservar consistencia multicanal del MVP.
- El sistema prioriza calidad y control institucional sobre automatización total temprana.

## 4. Contratos técnicos y APIs

### 4.1 Contratos mínimos

`StrategicPlan`

```json
{
	"plan_id": "plan_001",
	"objective": "generar leads",
	"channels": ["linkedin", "email"],
	"messages": ["mensaje principal"]
}
```

`CreativeOutput`

```json
{
	"brief_id": "brf_001",
	"pieces": [{"piece_id": "pcs_001", "channel": "linkedin"}],
	"status": "ready_for_review"
}
```

### 4.2 API mínima

- `POST /api/strategic/plan`
- `POST /api/strategic/plan/{plan_id}/iterate`
- `POST /api/creative/brief`
- `POST /api/creative/brief/{brief_id}/generate`
- `POST /api/channel/format/{piece_id}`

## 5. Reglas técnicas transversales

- Toda salida creativa debe pasar por validación de marca y derechos.
- ChannelFormatters no altera intención semántica del mensaje, solo adapta formato.
- El paso a publicación/exportación requiere estado `ready_for_review` o `approved`.

## 6. Diagrama técnico del dominio

![Arquitectura de agentes y canales](assets/img/diagramas/decisiones-modulos-agentes-canales-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-agentes-canales-arquitectura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

## 7. Criterios de aceptación

- El plan estratégico debe ser consumible por CreativeAgent sin transformación manual.
- Cada pieza generada registra canal, variante y trazabilidad al brief.
- ChannelFormatters produce salida válida por canal en al menos 4 canales MVP.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Módulos de gobernanza y operación](decisiones-modulos-gobernanza-operacion.html)

