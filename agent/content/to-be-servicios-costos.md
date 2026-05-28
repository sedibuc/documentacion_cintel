# TO-BE — Servicios y costos proyectados

**Versión:** 1.0  
**Fecha de corte:** 2026-05-27  
**Alcance:** Segunda entrega contractual (enfoque TO-BE)

> Esta sección define el análisis de servicios y costos para la necesidad objetivo TO-BE. No usa costos AS-IS como base de cumplimiento de segunda entrega.

---

## 1. Servicios de IA — Resumen TO-BE

| # | Servicio TO-BE | Tipo | Proveedor previsto | Estado de definición | Validación experta |
|---|---|---|---|---|---|
| 1 | LLM estratégico y de generación textual | Cloud | [Pendiente experto] | Definido a nivel funcional | Pendiente |
| 2 | Orquestación de prompts y contexto persistente | Plataforma | Interno + proveedor IA | Definido en TO-BE | Pendiente |
| 3 | Adaptación por canal (texto/variantes) | Cloud + lógica interna | [Pendiente experto] | Definido en TO-BE | Pendiente |
| 4 | OCR/visión multimodal (si aplica) | Cloud | [Pendiente experto] | Condicional | Pendiente |
| 5 | Generación de imagen (opcional controlada) | Cloud | [Pendiente experto] | Condicional por gobernanza | Pendiente |
| 6 | Integración canales (Meta/Microsoft) | API externa | Meta / Microsoft | Definido en arquitectura | Pendiente |

---

## 2. Detalle por servicio TO-BE

### 2.1 LLM de texto principal y orquestación

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Modelo principal | [Por definir] | [Pendiente] | Debe alinearse a estrategia de calidad/costo |
| Tokens por ejecución promedio | [Pendiente] | [Pendiente] | Estimar con medición real en pruebas TO-BE |
| Número de iteraciones por flujo | [Pendiente] | [Pendiente] | Depende de reglas de validación humana |

### 2.2 Adaptación por canal

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Canales activos en MVP | Instagram, Email, WhatsApp (objetivo) | [Pendiente] | Confirmar alcance mínimo de segunda entrega |
| Variantes por pieza | [Pendiente] | [Pendiente] | Impacta número total de llamadas IA |
| Reintentos por validación | [Pendiente] | [Pendiente] | Gobernanza define costo operativo adicional |

### 2.3 Servicios opcionales (visión e imagen)

| Variable de costo | Valor base (corte actual) | Valor validado por experto | Observación |
|---|---|---|---|
| Uso OCR multimodal | Condicional | [Pendiente] | Activar solo en escenarios requeridos |
| Generación de imagen IA | Condicional | [Pendiente] | Sujeto a restricciones de gobernanza |
| Límite de activos por sesión | [Pendiente] | [Pendiente] | Variable de control de costo |

---

## 3. Infraestructura de soporte TO-BE

| Servicio | Tipo | Impacto de costo | Valor base | Validado experto |
|---|---|---|---|---|
| Base de datos transaccional y de contexto | Infraestructura | Medio | PostgreSQL (objetivo) | [Pendiente] |
| Orquestación de servicios | Infraestructura | Medio | Contenedores / runtime | [Pendiente] |
| Observabilidad y auditoría | Infraestructura | Medio | Logs + métricas + trazabilidad | [Pendiente] |
| Almacenamiento de activos/documentos | Infraestructura | Medio | [Pendiente] | [Pendiente] |

---

## 4. Estimación de costo por sesión TO-BE (estructura)

| Componente | Tendencia de costo esperada | Métrica base actual | Métrica validada |
|---|---|---|---|
| LLM de texto y estrategia | Medio-Alto | [Pendiente] | [Pendiente] |
| Adaptación de piezas por canal | Medio | [Pendiente] | [Pendiente] |
| OCR/visión (si aplica) | Variable | [Pendiente] | [Pendiente] |
| Imagen IA (si aplica) | Variable-Alto | [Pendiente] | [Pendiente] |
| Integraciones externas | Medio | [Pendiente] | [Pendiente] |

---

## 5. Variables de control de costos (a formalizar)

| Variable | Efecto esperado | Valor inicial | Valor objetivo validado |
|---|---|---|---|
| Máximo de iteraciones por flujo | Limita costo de inferencia | [Pendiente] | [Pendiente] |
| Máximo de variantes por canal | Limita costo de generación | [Pendiente] | [Pendiente] |
| Activación de OCR/visión | Evita sobrecostos innecesarios | Condicional | [Pendiente] |
| Umbral de aprobación humana | Control de reprocesos | [Pendiente] | [Pendiente] |

---

## 6. Riesgos de costo TO-BE

| Riesgo | Descripción | Mitigación propuesta | Estado |
|---|---|---|---|
| RC-TOBE-01 | Crecimiento de tokens por exceso de iteraciones | Definir topes por flujo | Pendiente validación |
| RC-TOBE-02 | Sobrecosto por generación masiva de variantes | Política de límites por canal | Pendiente validación |
| RC-TOBE-03 | Activación no controlada de servicios opcionales | Flags de activación y monitoreo | Pendiente validación |
| RC-TOBE-04 | Supuestos de costo sin aprobación experta | Cierre con experto técnico y financiero | Pendiente |

---

## 7. Observaciones para cumplimiento de segunda entrega

1. Esta sección constituye la base de servicios y costos TO-BE del proyecto Agent para segunda entrega.
2. La cuantificación final queda condicionada a validación experta.
3. El documento debe versionarse por fecha de corte y dejar trazabilidad de cambios.
