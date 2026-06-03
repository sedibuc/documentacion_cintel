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
| Tokens promedio por documento | A medir en piloto | Registrar `tokens_entrada`, `tokens_salida`, `logprobs_min` por ejecución | El costo unitario se estima desde tokens acumulados; el valor exacto depende del tipo y tamaño de los documentos reales de producción |
| Reintentos por validación de salida | Máximo 3 reintentos (diseño base) | Monitorear tasa de reintentos con MLflow; el LLM Gateway gestiona retries automáticamente | Ajustar para balance costo/calidad según datos del piloto |

### 2.2 Validación cruzada y alertas

> Los valores base y validados por experto de este bloque se cuantificarán una vez que se formalice la taxonomía documental del cliente (número y tipo de reglas por documento) y se ejecute el piloto con documentos reales de producción.

| Variable de costo | Observación |
|---|---|
| Reglas activas por tipo documental | Afecta costo de cómputo y latencia; su número depende de la taxonomía documental que se defina con el cliente en sesión de cierre técnico |
| Volumen de comparaciones por lote | Depende del número de registros de referencia activos; varía por tenant y tipo de proceso |
| Tasa de generación de alertas | Impacta la carga de revisión humana; se medirá durante el piloto para calibrar umbrales de activación |

### 2.3 Servicios opcionales (OCR/visión)

> La validación experta de los parámetros de este bloque queda condicionada al piloto con documentos reales, donde se medirá la proporción efectiva de documentos que activan el fallback OCR. Hasta entonces no es posible comprometer valores concretos sin riesgo de subestimar o sobreestimar el costo.

| Variable de costo | Estado / Valor base | Observación |
|---|---|---|
| Activación de OCR fallback | Condicional | Solo para documentos sin texto embebido; política LLM-first validada en TO-BE funcional |
| Volumen de procesamiento multimodal | A medir en piloto | Afecta el costo unitario por documento; depende de la proporción real de documentos escaneados o sin texto embebido |
| Límite de casos OCR por lote | A calibrar en piloto | Variable de control de costo; se definirá en función de la tasa de fallback observada y el presupuesto operativo |

---

## 3. Infraestructura de soporte TO-BE

> Los componentes sin validación experta (—) serán revisados en la sesión de cierre técnico. Su configuración definitiva depende de decisiones de arquitectura de despliegue (cloud vs. on-premise, proveedor de almacenamiento) que se tomarán con base en los requisitos de soberanía de datos de cada tenant.

| Infraestructura | Tipo | Impacto de costo | Valor base | Validado experto |
|---|---|---|---|---|
| Core multi-tenant de aplicación | Infraestructura | Medio-Alto | Runtime contenedorizado | — |
| Base de datos operativa y auditoría | Infraestructura | Medio | PostgreSQL con trazabilidad | — |
| Almacenamiento de documentos y resultados | Infraestructura | Medio | Por definir según decisiones de despliegue (S3 / GCS / local por tenant) | — |
| **LLM Gateway** | **Infraestructura LLM** | **Medio** | LiteLLM / Kong AI Gateway / custom | ✅ **Requerido por experto** |
| Observabilidad y monitoreo de flujo | Infraestructura | Medio | **MLflow + Grafana + Ray** (recomendado por experto) | ✅ Validado |

---

## 4. Estimación de costo por lote/sesión TO-BE (estructura)

> Las métricas exactas de costo por componente se determinarán durante el piloto, una vez se cuente con datos reales de procesamiento: tokens promedio por tipo documental, latencia de extracción, tasa de fallback OCR y volumen de validaciones cruzadas. Esta tabla establece las tendencias cualitativas como insumo para el diseño de experimentos del piloto y la definición de umbrales de presupuesto operativo.

| Componente | Tendencia de costo esperada |
|---|---|
| Extracción LLM por documento | Medio-Alto |
| Validación cruzada y reglas | Medio |
| Alertamiento y gestión de discrepancias | Medio |
| OCR fallback (si aplica) | Variable |
| Persistencia y auditoría | Medio |

---

## 5. Variables de control de costos (a formalizar)

> Los valores concretos de estas variables se calibrarán durante la ejecución del piloto. Su configuración depende de métricas operativas aún no disponibles: throughput real de documentos, tasa de reintentos del LLM, proporción de fallbacks OCR y latencia de validaciones cruzadas. El LLM Gateway permite ajustar estas variables en tiempo de ejecución sin redespliegue, lo que facilita la calibración iterativa.

| Variable | Efecto esperado |
|---|---|
| Máximo de documentos por lote | Controla el consumo de inferencia y la latencia de respuesta por sesión |
| Máximo de reintentos LLM | Limita el costo por documento en casos de baja confianza de extracción |
| Umbral de activación OCR fallback | Evita costo multimodal innecesario; se activa solo cuando el documento carece de texto embebido |
| Frecuencia de validación cruzada | Balancea costo computacional y nivel de control de calidad por lote |

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
