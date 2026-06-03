# TO-BE — Servicios y costos proyectados

**Versión:** 1.0  
**Fecha de corte:** 2026-05-27  
**Alcance:** Segunda entrega contractual (enfoque TO-BE)

> Esta sección define el análisis de servicios y costos para el Document Intelligence Engine TO-BE. No usa costos AS-IS como base de cumplimiento de segunda entrega.

---

## 1. Servicios de IA — Resumen TO-BE

| # | Servicio TO-BE | Tipo | Proveedor previsto | Estado de definición | Validación experta |
|---|---|---|---|---|---|
| 1 | Extracción estructurada LLM | Cloud / On-premise | Gemini / OpenAI (GPT-4o) / DeepSeek-OCR / Gemma4 / PaliGemma | Definido en TO-BE funcional | ✅ Validado (Bloque 1-3) |
| 2 | **LLM Gateway** | Infraestructura LLM | LiteLLM / Kong AI Gateway / custom | **Definido — Crítico MVP** | ✅ Validado (Bloque 5-8) |
| 3 | **Batch inference** | Procesamiento | Celery + Redis + LLM Gateway | Definido | ✅ Validado (Bloque 8) |
| 4 | Validación determinística de campos | Lógica interna | Interno | Definido | ✅ Validado |
| 5 | Validación cruzada contra referencia | Lógica interna + conectores | Interno | Definido | ✅ Validado |
| 6 | Alertamiento de discrepancias | Lógica interna | Interno | Definido | ✅ Validado |
| 7 | OCR/visión multimodal (fallback) | Cloud / On-premise | Tesseract (MVP) / Google Document AI (Fase 2) | Condicional — LLM-first validado | ✅ Validado (Bloque 1-2) |

---

## 2. Detalle por servicio TO-BE

### 2.1 Extracción estructurada LLM

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Modelo principal de extracción | GPT-4o (baseline) | Evaluar con MLflow: Gemini, OpenAI, DeepSeek-OCR, Gemma4 — **No Claude** | La selección final requiere experimentos con 100 documentos reales |
| Tokens promedio por documento | [Pendiente — medir en piloto] | Registrar `tokens_entrada`, `tokens_salida`, `logprobs_min` por ejecución | Estimar costo unitario desde tokens acumulados |
| Reintentos por validación de salida | Máximo 3 reintentos (diseño base) | Monitorear tasa de reintentos con MLflow; el LLM Gateway gestiona retries automáticamente | Ajustar para balance costo/calidad según datos del piloto |

### 2.2 Validación cruzada y alertas

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Reglas activas por tipo documental | [Pendiente] | [Pendiente] | Afecta costo de cómputo y latencia |
| Volumen de comparaciones por lote | [Pendiente] | [Pendiente] | Depende de número de registros de referencia |
| Tasa de generación de alertas | [Pendiente] | [Pendiente] | Impacta operación de revisión humana |

### 2.3 Servicios opcionales (OCR/visión)

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Activación de OCR fallback | Condicional | [Pendiente] | Solo para documentos sin texto embebido |
| Volumen de procesamiento multimodal | [Pendiente] | [Pendiente] | Afecta costo unitario por documento |
| Límite de casos OCR por lote | [Pendiente] | [Pendiente] | Variable de control de costo |

---

## 3. Infraestructura de soporte TO-BE

| Infraestructura | Tipo | Impacto de costo | Valor base | Validado experto |
|---|---|---|---|---|
| Core multi-tenant de aplicación | Infraestructura | Medio-Alto | Runtime contenedorizado | [Pendiente] |
| Base de datos operativa y auditoría | Infraestructura | Medio | PostgreSQL con trazabilidad | [Pendiente] |
| Almacenamiento de documentos y resultados | Infraestructura | Medio | [Pendiente] | [Pendiente] |
| **LLM Gateway** | **Infraestructura LLM** | **Medio** | LiteLLM / Kong AI Gateway / custom | ✅ **Requerido por experto** |
| Observabilidad y monitoreo de flujo | Infraestructura | Medio | **MLflow + Grafana + Ray** (recomendado por experto) | ✅ Validado |

---

## 4. Estimación de costo por lote/sesión TO-BE (estructura)

| Componente | Tendencia de costo esperada | Métrica base actual | Métrica validada |
|---|---|---|---|
| Extracción LLM por documento | Medio-Alto | [Pendiente] | [Pendiente] |
| Validación cruzada y reglas | Medio | [Pendiente] | [Pendiente] |
| Alertamiento y gestión de discrepancias | Medio | [Pendiente] | [Pendiente] |
| OCR fallback (si aplica) | Variable | [Pendiente] | [Pendiente] |
| Persistencia y auditoría | Medio | [Pendiente] | [Pendiente] |

---

## 5. Variables de control de costos (a formalizar)

| Variable | Efecto esperado | Valor inicial | Valor objetivo validado |
|---|---|---|---|
| Máximo de documentos por lote | Controla consumo de inferencia | [Pendiente] | [Pendiente] |
| Máximo de reintentos LLM | Limita costo por caso | [Pendiente] | [Pendiente] |
| Umbral de activación OCR fallback | Evita costo multimodal innecesario | Condicional | [Pendiente] |
| Frecuencia de validación cruzada | Balancea costo y control de calidad | [Pendiente] | [Pendiente] |

---

## 6. Riesgos de costo TO-BE

| Riesgo | Descripción | Mitigación propuesta | Estado |
|---|---|---|---|
| **RC-TOBE-00** | **Escalabilidad por tokens/requests por minuto en multi-tenant** | **LLM Gateway obligatorio: rate-limit por tenant, retries, cache, batch inference** | **Validado por experto — Crítico** |
| RC-TOBE-01 | Alto consumo por esquemas documentales complejos | Definir plantillas optimizadas por tipo; usar batch inference | Pendiente validación |
| RC-TOBE-02 | Sobrecosto por reintentos frecuentes de extracción | Ajustar guardrails y few-shots; el LLM Gateway gestiona retries | Pendiente validación |
| RC-TOBE-03 | Uso extensivo de OCR fallback | Política de activación estricta; LLM/VLM es la ruta principal | Pendiente validación |
| RC-TOBE-04 | Supuestos de costo sin aprobación experta | Cierre con experto técnico y financiero | Pendiente |

---

## 7. Observaciones para cumplimiento de segunda entrega

1. Esta sección constituye la base de servicios y costos TO-BE del proyecto RAG para segunda entrega.
2. La cuantificación final queda condicionada a validación experta.
3. El documento debe versionarse por fecha de corte y dejar trazabilidad de cambios.

---

## 8. Criterio experto para evaluación y selección de proveedor LLM

> **Validación experta (2026-06-02 — Bloque 3, 7-8):** El experto recomienda no seleccionar proveedor por preferencia única sino mediante **experimentos controlados** con las siguientes variables:
>
> - Múltiples prompts de extracción para el mismo tipo documental
> - Múltiples modelos candidatos: **Gemini, OpenAI (GPT-4o), DeepSeek-OCR, Gemma4, PaliGemma**. **No recomendado: Claude** (débil en multimodal)
> - 100 documentos de diferente tipo: escaneados, digitales, documentos representativos de producción
> - Evaluación ciega con varios modelos + revisión humana
> - Descartar candidato temprano si métricas de precisión y recall no son las esperadas
>
> **Herramientas recomendadas:**
> - **MLflow**: experimentos, A/B testing, monitoreo y observabilidad en tiempo real
> - **Grafana**: dashboards operativos y alertas
> - **Ray**: monitoreo LLM en escala
> - **Vertex AI Evaluation**: alternativa cloud-native si el stack es en GCP

**Criterios de evaluación aplicables al DIE (orden de prioridad según experto):**

| Criterio | Peso sugerido | Nota |
|---|---|---|
| Precisión de extracción (F1-score, recall, matriz de confusión) | Alto | Criterio #1 del experto |
| Soporte multimodal nativo (VLM/LLM) | Alto | Requisito central del sistema |
| Soporte de structured outputs / JSON mode | Alto | Requisito técnico del StructuredExtractor |
| Latencia por documento | Alto | Criterio #2 del experto |
| Costo por token (input + output) | Alto | Criterio #3 del experto |
| Tooling disponible (MLflow, gateway, eval) | Medio | Criterio transversal del experto |
| Soberanía y DPA disponible | Medio-Alto | Crítico para tenants con documentos sensibles |
| Disponibilidad on-premise | Medio | Gemma4 / DeepSeek-OCR / PaliGemma para soberanía total |
