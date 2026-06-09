# Riesgos y mitigaciones

<div class="badge-row">
<span class="badge">Sección 5 de 5</span>
<span class="badge">10 riesgos identificados</span>
<span class="badge badge-note">3 críticos</span>
</div>

> **Metodología:** cada riesgo se evalúa por probabilidad (Alta/Media/Baja) e impacto (Alto/Medio/Bajo) sobre el cronograma y la calidad de la PoC. Los riesgos con impacto Alto se priorizan con plan de contingencia explícito.

---

## 1. Matriz de riesgos

<div class="diagram-block">
<p class="diagram-label">Matriz de riesgos — PoC DIE Las Galias</p>
<img src="assets/img/diagramas/poc-die-riesgos.png" alt="Matriz de riesgos PoC DIE Las Galias">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-riesgos.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

---

## 2. Riesgos detallados

### 2.1 Riesgos críticos (impacto Alto)

| ID | Riesgo | Prob. | Impacto | Score | Sprint |
|---|---|---|---|---|---|
| **R-01** | Prerequisitos de datos no disponibles a tiempo | Media | Alto | 🔴 Crítico | Sprint 1 |
| **R-02** | Baja calidad de extracción LLM (F1 < 70%) en documentos reales | Media | Alto | 🔴 Crítico | Sprint 1–2 |
| **R-03** | Datos de referencia (PRE-06) incompletos o inconsistentes | Media | Alto | 🔴 Crítico | Sprint 2 |

**R-01 — Prerequisitos de datos no disponibles a tiempo**

- **Descripción**: Las Galias no entrega el corpus documental (PRE-04) o el schema validado (PRE-05) antes del Jun 11, o el dataset de referencia (PRE-06) antes del Jun 16.
- **Consecuencias**: Sprint 1 avanza solo con documentos sintéticos; evaluación de calidad real se retrasa al Sprint 2 o 3; riesgo de no poder demostrar evidencia con datos reales al Jun 30.
- **Mitigación principal**: iniciar coordinación con Las Galias desde Jun 2 (previo al Sprint 1). Enviar templates de PRE-05 y PRE-06 con una semana de anticipación. Generar 20 documentos sintéticos representativos como fallback inmediato.
- **Contingencia**: si PRE-04 llega tarde, Sprint 1 construye el extractor con documentos sintéticos y valida el flujo; Sprint 2 ajusta con datos reales. Cronograma se extiende pero la entrega del Jun 30 se mantiene si el atraso es ≤ 3 días.

---

**R-02 — Baja calidad de extracción LLM en documentos reales**

- **Descripción**: los documentos reales de Las Galias tienen características no anticipadas (tablas complejas, layouts poco convencionales, documentos muy escaneados con baja calidad) que resultan en F1-score < 70% después del prompt v1.
- **Consecuencias**: requiere múltiples iteraciones de ajuste de prompts (v2, v3) que consumen más tiempo del estimado; riesgo de no alcanzar el umbral del 85% al cierre.
- **Mitigación principal**: diseñar prompts con instrucciones explícitas para tablas (Markdown) e imágenes (descripción); incluir ≥ 3 few-shots representativos desde el día 1. Usar modelos recomendados por el experto: GPT-4o o Gemini Flash.
- **Contingencia**: reservar 1.5 días de Sprint 2 para refinamiento intensivo de prompts. Si el umbral de 85% no es alcanzable con los documentos más complejos, redefinir el umbral de éxito como 75% para documentos escaneados (diferenciando de PDFs digitales).

---

**R-03 — Dataset de referencia incompleto o inconsistente**

- **Descripción**: el CSV de referencia entregado por Las Galias (PRE-06) tiene: campos vacíos, formatos de fecha inconsistentes, valores con typos, o no cubre suficientes documentos del corpus.
- **Consecuencias**: el CrossValidator produce falsos MISMATCH, las métricas de calidad son poco confiables, la demo del Jun 30 pierde credibilidad.
- **Mitigación principal**: entregar template estricto a Las Galias con validaciones de formato. Incluir en la entrega del template una guía de llenado con ejemplos. Validar el CSV en cuanto se recibe (Jun 16) con un script de verificación.
- **Contingencia**: si el CSV tiene errores, dedicar el Jun 16 (tarde) a limpiarlo con ayuda de Las Galias. Usar solo los registros válidos para la evaluación; marcar los inválidos como excluidos del análisis.

---

### 2.2 Riesgos moderados (impacto Medio)

| ID | Riesgo | Prob. | Impacto | Score | Sprint |
|---|---|---|---|---|---|
| **R-04** | Costos LLM excedan el presupuesto esperado | Baja | Medio | 🟡 Moderado | Sprint 1–3 |
| **R-05** | Latencia LLM > 30 seg/documento en pruebas de lote | Media | Medio | 🟡 Moderado | Sprint 2–3 |
| **R-06** | Cambios de alcance solicitados por Las Galias durante la PoC | Media | Medio | 🟡 Moderado | Sprint 2–3 |
| **R-07** | Problemas de compatibilidad con formato de documentos de Las Galias | Baja | Medio | 🟡 Moderado | Sprint 1 |

**R-04 — Costos LLM:** estimación: 60 documentos × 2000 tokens promedio × $0.005/1K tokens = ~$0.60 de costo LLM total. Con iteraciones de ajuste: estimación total < $5 USD. Si se usan Gemini Flash (más económico), el costo es aún menor. **Bajo riesgo real**.

**R-05 — Latencia LLM:** para lotes grandes, la latencia acumulada puede ser de 10–20 minutos para 60 documentos en modo síncrono. Mitigación: procesar en paralelo con `asyncio` si la API LLM lo permite (rate-limiting permisivo en PoC). No es bloqueante para la demo.

**R-06 — Cambio de alcance:** Las Galias puede solicitar agregar un tercer tipo documental o cambiar campos en los schemas ya implementados. Mitigación: congelar el scope el Jun 11 (firma de schema). Cualquier cambio posterior se registra como backlog para Sprint 4+ del TO-BE completo.

**R-07 — Compatibilidad de formatos:** algunos documentos de Las Galias pueden estar en formatos inusuales (TIFF, Word antiguo, PDF protegido). Mitigación: incluir en la validación de PRE-04 un checklist de formatos aceptados. Rechazar documentos no conformes con mensaje explícito.

---

### 2.3 Riesgos bajos (impacto Bajo)

| ID | Riesgo | Prob. | Impacto | Score | Sprint |
|---|---|---|---|---|---|
| **R-08** | Ambiente de desarrollo inestable (Docker, dependencias) | Baja | Bajo | 🟢 Bajo | Sprint 1 |
| **R-09** | Disponibilidad del ingeniero afectada por imprevistos | Baja | Bajo | 🟢 Bajo | Sprint 1–3 |
| **R-10** | API LLM con rate limits restrictivos en proveedor gratuito | Media | Bajo | 🟢 Bajo | Sprint 1 |

---

## 3. Registro de seguimiento de riesgos

| ID | Estado | Fecha última revisión | Responsable | Acción tomada / planificada |
|---|---|---|---|---|
| R-01 | 🟡 En seguimiento | Jun 9, 2026 | CINTEL + Las Galias | Template enviado Jun 2; confirmar recepción Jun 9 |
| R-02 | 🟡 En seguimiento | Jun 9, 2026 | Ingeniero | Prompts iniciales con guardrails listos; few-shots en elaboración |
| R-03 | 🟡 En seguimiento | Jun 9, 2026 | Las Galias | Template CSV con guía enviado; script de validación listo |
| R-04 | ✅ Controlado | Jun 9, 2026 | CINTEL | Estimación: <$5 USD; aceptable |
| R-05 | 🟡 En seguimiento | Jun 9, 2026 | Ingeniero | `asyncio` planificado para Sprint 2 si aplica |
| R-06 | 🟡 En seguimiento | Jun 9, 2026 | CINTEL + Las Galias | Congelación de scope: Jun 11 |
| R-07 | ✅ Controlado | Jun 9, 2026 | Ingeniero | Checklist de formatos incluido en PRE-04 |
| R-08 | ✅ Controlado | Jun 9, 2026 | Ingeniero | Docker en ambiente de dev verificado |
| R-09 | ✅ Aceptado | Jun 9, 2026 | CINTEL | Riesgo aceptado; sin sustituto disponible en PoC |
| R-10 | ✅ Controlado | Jun 9, 2026 | CINTEL | API Key de tier pago disponible (PRE-02) |

---

## 4. Relación con riesgos del TO-BE

Estos riesgos están alineados con el análisis del [cronograma de implementación del DIE MultiTenant](../RAG/cronograma-implementacion.html). Los riesgos R-01 a R-03 de la PoC son versiones acotadas de los riesgos del TO-BE "Calidad heterogénea de documentos" y "Baja calidad o ausencia de fuentes de referencia", que ya tienen mitigación planificada en el Sprint 2 del TO-BE completo.

---

Trazabilidad: [Alcance](alcance.html) · [Prerequisitos](prerequisitos.html) · [Cronograma](cronograma.html)
