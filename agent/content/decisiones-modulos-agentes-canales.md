# Módulos de agentes y canales

## 1. Alcance

Esta página define las características técnicas de los módulos que transforman contexto en estrategia, piezas y salidas por canal.

## 2. Fichas técnicas por módulo

### 2.1 StrategicAgent

| Característica | Definición técnica |
|---|---|
| Propósito | Proponer estrategia institucional: objetivo, audiencia, mensajes, tono y canales. |
| Entradas | Context package, histórico de campañas y restricciones institucionales. |
| Salidas | **Brief estratégico estructurado** (schema JSON obligatorio). Nunca texto libre cuando el destino es el CreativeAgent. |
| Contrato de salida | Objetivo, hipótesis, audiencias, mensajes, canales, supuestos y riesgos — en schema reutilizable. |
| Salidas estructuradas | **Siempre definir schema de salida explícito en el prompt** (lineamiento transversal #2). Mejora precisión, reduce alucinaciones y facilita validación automática antes de pasar al siguiente agente. |
| GuardRails en prompt | Instrucciones explícitas sobre límites: no usar afirmaciones no autorizadas, respetar tono ponderado, referirse solo a canales activos para la organización. |
| Few-shots | Ejemplos de planes estratégicos alineados a marca para anclar el comportamiento del modelo. |
| Riesgos técnicos | Estrategias genéricas sin anclaje institucional. |
| Controles | Schema obligatorio de salida, checklist de coherencia y trazabilidad de fuentes. |

### 2.2 CreativeAgent (orquestador multi-agente)

| Característica | Definición técnica |
|---|---|
| Propósito | Orquestar la producción de contenido creativo: genera el brief, delega a agentes de canal especializados y consolida los resultados para revisión humana. |
| Entradas | Brief estratégico, perfil de marca (BrandGuidelinesStore), activos permitidos y reglas de publicación. |
| Salidas | Variantes de piezas textuales/visuales por canal, con score de alineación institucional. |
| Arquitectura | **Sistema multi-agente**: CreativeAgent como orquestador + LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent (especializados). |
| Ejecución | Agentes de canal ejecutan en **paralelo** para minimizar latencia total. |
| Restricciones clave | Respeto de tono ponderado, blacklist/whitelist, claims permitidos, derechos de imagen y límites de formato. |
| Riesgos técnicos | Deriva de estilo o uso de activos no autorizados. |
| Controles | Validación previa contra BrandGuidelinesStore, CriticAgent para alineación institucional y control humano obligatorio. |
| Generación de imagen | Patrón crítico-evaluador: un agente genera la imagen y otro evalúa alineación con lineamientos institucionales. Uso de few-shots de diseños previos como referencia. |
| Validado por experto | ✅ P-04 / P-05 / P-06 — Junio 2026 |

### 2.3 Agentes de canal especializados

> **Decisión técnica:** Los ChannelFormatters han sido reemplazados por agentes especializados por canal. La diferencia es que cada agente incorpora el conocimiento del canal en su rol (no como configuración externa), lo que mejora la calidad y reduce la necesidad de instruccionarlo en cada solicitud.

| Agente | Canal | Conocimiento especializado incorporado | Tools |
|---|---|---|---|
| **LinkedInAgent** | LinkedIn | Longitud óptima (150–300 palabras), estructura hook-cuerpo-CTA, hashtags profesionales, formato artículo vs. post | Ver historial LinkedIn, consultar marca, crear artefactos |
| **InstagramAgent** | Instagram | Visual-first, ratio 1:1 o 4:5, caption breve + hashtags, stories vs. reels, engagement por formato | Ver historial Instagram, crear artefactos visuales (ADK Artifacts) |
| **EmailAgent** | Email | Asunto + preheader + cuerpo + CTA, evitar spam triggers, tasa de apertura, plantillas aprobadas | Plantillas aprobadas, métricas históricas de apertura |
| **WhatsAppAgent** | WhatsApp | Brevedad máxima, tono conversacional, CTA directo, plantillas aprobadas HSM, límite de caracteres | Plantillas aprobadas, historial de conversaciones |
| **CriticAgent** | Todos los canales | Evalúa alineación institucional post-generación: tono, blacklist/whitelist, restricciones de marca | BrandGuidelinesStore, score de alineación |

| Característica | Definición técnica |
|---|---|
| Propósito | Producir entregables listos para exportación o publicación asistida, con las convenciones específicas del canal de destino. |
| Entradas | Brief aprobado por el CreativeAgent (orquestador) y lineamientos de marca institucional. |
| Salidas | Piezas finales por canal, evaluadas por CriticAgent antes de presentarse al comunicador. |
| Ejecución | Paralela — todos los agentes de canal activos reciben el brief simultáneamente. |
| Skills y artefactos | ADK Skills para plan/razonamiento/actuación; ADK Artifacts para activos pesados (imágenes, videos). |
| Validado por experto | ✅ P-05 — Junio 2026 |

## 3. Decisiones de diseño vigentes

- StrategicAgent y CreativeAgent se mantienen separados para facilitar gobernanza y explicabilidad. **Cada agente tiene entre 1 y 3 objetivos cohesionados** para evitar degradación de exactitud. (✅ P-06)
- El CreativeAgent es un **orquestador multi-agente**: genera el brief y delega la producción a agentes de canal especializados (LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent). (✅ P-05 / P-06)
- Los agentes de canal se ejecutan en **paralelo** para minimizar la latencia total. (✅ P-05)
- **Salidas estructuradas obligatorias**: todos los agentes del sistema deben definir un schema explícito en el prompt. Ningún flujo de inferencia devuelve texto libre cuando el destino es procesamiento posterior. (✅ Lineamiento transversal #2)
- **GuardRails explícitos en prompts**: límites de comportamiento definidos como parte del diseño del prompt, no como ajuste posterior. Blacklist/whitelist, tono, perspectiva narrativa y restricciones institucionales. (✅ Lineamiento transversal #5)
- **Few-shots por canal y por tipo de tarea**: corpus de ejemplos representativos por caso de uso. Primera medida de mejora de calidad antes de evaluar fine-tuning. (✅ Lineamiento transversal #4)
- Un **CriticAgent** evalúa la alineación institucional de cada pieza antes de presentarla al comunicador. (✅ P-05 / P-06)
- Los agentes se equipan con **ADK Skills** (plan, razonamiento, actuación) y **ADK Artifacts** (storage de activos pesados). (✅ P-05)
- Toda llamada al proveedor LLM pasa por el **LLM Gateway** (rate-limit, retries, fallbacks, caché) — ningún agente llama directamente al proveedor. (✅ Lineamiento transversal #10)
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

`CreativeBrief`

```json
{
	"brief_id": "brf_001",
	"plan_id": "plan_001",
	"channel": "linkedin",
	"message": "mensaje principal",
	"tone": "institucional",
	"cta": "Descarga el estudio",
	"restrictions": ["no usar imágenes generadas por IA"]
}
```

`CreativeOutput`

```json
{
	"brief_id": "brf_001",
	"agent": "LinkedInAgent",
	"pieces": [{"piece_id": "pcs_001", "channel": "linkedin"}],
	"alignment_score": 0.92,
	"status": "ready_for_review"
}
```

### 4.2 API mínima

- `POST /api/strategic/plan`
- `POST /api/strategic/plan/{plan_id}/iterate`
- `POST /api/creative/brief`
- `POST /api/creative/brief/{brief_id}/generate` — orquesta a todos los agentes de canal en paralelo
- `GET /api/creative/brief/{brief_id}/pieces` — devuelve todas las piezas generadas por canal

## 5. Reglas técnicas transversales

- Toda salida creativa debe pasar por el CriticAgent (validación de alineación institucional) y por revisión humana (validación de publicación).
- Los agentes de canal no alteran la intención semántica del mensaje; solo adaptan formato y convenciones del destino.
- El paso a publicación/exportación requiere estado `ready_for_review` o `approved`.
- Cada pieza generada registra el agente de canal que la produjo, facilitando auditoría y trazabilidad.

## 6. Diagrama técnico del dominio

![Arquitectura de agentes y canales](assets/img/diagramas/decisiones-modulos-agentes-canales-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-agentes-canales-arquitectura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

## 7. Criterios de aceptación

- El plan estratégico debe ser consumible por CreativeAgent sin transformación manual.
- Cada pieza generada registra canal, variante y trazabilidad al brief.
- Los agentes de canal (LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent) producen salida válida por canal en al menos 4 canales MVP.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Módulos de gobernanza y operación](decisiones-modulos-gobernanza-operacion.html)

