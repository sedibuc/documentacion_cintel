# TO-BE — Servicios y costos proyectados

**Versión:** 1.0  
**Fecha de corte:** 2026-05-27  
**Alcance:** Segunda entrega contractual (enfoque TO-BE)

> Esta sección define el análisis de servicios y costos para el Document Intelligence Engine TO-BE. No usa costos AS-IS como base de cumplimiento de segunda entrega.

---

## 1. Servicios de IA — Resumen TO-BE

| # | Servicio TO-BE | Tipo | Proveedor previsto | Estado de definición | Validación experta |
|---|---|---|---|---|---|
| 1 | Extracción estructurada LLM | Cloud / On-premise | [Pendiente experto] | Definido en TO-BE funcional | Pendiente |
| 2 | Validación determinística de campos | Lógica interna | Interno | Definido | Pendiente |
| 3 | Validación cruzada contra referencia | Lógica interna + conectores | Interno | Definido | Pendiente |
| 4 | Alertamiento de discrepancias | Lógica interna | Interno | Definido | Pendiente |
| 5 | OCR/visión multimodal (fallback) | Cloud / On-premise | [Pendiente experto] | Condicional | Pendiente |

---

## 2. Detalle por servicio TO-BE

### 2.1 Extracción estructurada LLM

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Modelo principal de extracción | [Por definir] | [Pendiente] | Debe cumplir precisión objetivo por tipo documental |
| Tokens promedio por documento | [Pendiente] | [Pendiente] | Depende de complejidad del esquema |
| Reintentos por validación de salida | [Pendiente] | [Pendiente] | Ajustar para balance costo/calidad |

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

| Servicio | Tipo | Impacto de costo | Valor base | Validado experto |
|---|---|---|---|---|
| Core multi-tenant de aplicación | Infraestructura | Medio-Alto | Runtime contenedorizado | [Pendiente] |
| Base de datos operativa y auditoría | Infraestructura | Medio | PostgreSQL con trazabilidad | [Pendiente] |
| Almacenamiento de documentos y resultados | Infraestructura | Medio | [Pendiente] | [Pendiente] |
| Observabilidad y monitoreo de flujo | Infraestructura | Medio | Logs + métricas + trazas | [Pendiente] |

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
| RC-TOBE-01 | Alto consumo por esquemas documentales complejos | Definir plantillas optimizadas por tipo | Pendiente validación |
| RC-TOBE-02 | Sobrecosto por reintentos frecuentes de extracción | Ajustar reglas de salida estructurada | Pendiente validación |
| RC-TOBE-03 | Uso extensivo de OCR fallback | Política de activación estricta | Pendiente validación |
| RC-TOBE-04 | Supuestos de costo sin aprobación experta | Cierre con experto técnico y financiero | Pendiente |

---

## 7. Observaciones para cumplimiento de segunda entrega

1. Esta sección constituye la base de servicios y costos TO-BE del proyecto RAG para segunda entrega.
2. La cuantificación final queda condicionada a validación experta.
3. El documento debe versionarse por fecha de corte y dejar trazabilidad de cambios.
