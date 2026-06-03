# Presentación ejecutiva

Esta página resume el hilo narrativo para comité directivo: estado actual, visión objetivo, plan de implementación y estimación económica parametrizable.

<div class="presentation-legend">
 <span class="status-pill status-prod">Verde: listo para producción</span>
 <span class="status-pill status-improve">Amarillo: requiere mejora</span>
 <span class="status-pill status-alert">Rojo: alerta crítica</span>
 <span class="status-pill status-v1">Azul: versión 1</span>
 <span class="status-pill status-vnext">Morado: versión posterior</span>
</div>

## 1) Mapa mental AS-IS

<p class="tree-instructions">Haz clic sobre cada nodo para expandir o contraer. El árbol se desplaza horizontalmente para cubrir todo el análisis AS-IS.</p>
> Esta sección presenta una revisión independiente del estado actual del demostrador analizado. Su propósito es describir la funcionalidad, estructura y contenidos existentes, así como los hallazgos identificados dentro del propio material técnico revisado. Este análisis no corresponde a una evaluación frente a la necesidad funcional ni a una validación de cumplimiento contractual.
<div id="asis-tree" class="h-tree" data-tree="asis" aria-label="Árbol AS-IS"></div>

## 2) Mapa mental TO-BE

<p class="tree-instructions">Haz clic sobre cada nodo para expandir o contraer. Este árbol diferencia alcance de versión 1 y versión posterior.</p>
> Esta sección sintetiza la definición funcional y no funcional posterior al estudio de mercado, junto con la arquitectura objetivo necesaria para llevar la solución a un alcance productivo.
<div id="tobe-tree" class="h-tree" data-tree="tobe" aria-label="Árbol TO-BE"></div>

## 3) Análisis complementario frente a requisitos y arquitectura (fuera del AS-IS)

### 3.1 Requisitos funcionales y no funcionales cubiertos por arquitectura

| Requisito | Tipo | Item de arquitectura que lo resuelve |
|---|---|---|
| RF-01 Extracción estructurada de documentos | Funcional | ARQ-01 StructuredExtractor + flujo de extracción LLM |
| RF-02 Validación cruzada entre fuentes | Funcional | ARQ-02 CrossValidator + CrossValidationResult |
| RF-03 Gestión de discrepancias y alertas | Funcional | ARQ-03 DiscrepancyAlertEngine + Alert Dashboard |
| RF-04 Procesamiento por lotes e histórico | Funcional | ARQ-04 Pipeline de lotes + modelo de datos histórico |
| RF-05 Administración de tipos documentales | Funcional | ARQ-05 Módulo administrativo de tipos y estados |
| RF-06 Integración por FTP y servicios REST | Funcional | ARQ-06 Adaptadores de integración (FTP + API) |
| RNF-01 Aislamiento multi-tenant | No funcional | ARQ-07 Tenant isolation layer + políticas de acceso |
| RNF-02 Trazabilidad y auditoría de ejecución | No funcional | ARQ-08 Observabilidad + eventos de ejecución |
| RNF-03 Seguridad de operación | No funcional | ARQ-09 Controles de autenticación/autorización + hardening |
| RNF-04 Escalabilidad por demanda | No funcional | ARQ-10 Arquitectura de despliegue MVP y roadmap de escalado |
| RNF-05 Control de costos operativos | No funcional | ARQ-11 Instrumentación de consumo IA + tableros de costo |

### 3.2 Trazabilidad inversa (cada ítem de arquitectura responde al menos un requisito)

| Item de arquitectura | Requisitos que atiende |
|---|---|
| ARQ-01 StructuredExtractor | RF-01 |
| ARQ-02 CrossValidator | RF-02 |
| ARQ-03 DiscrepancyAlertEngine | RF-03 |
| ARQ-04 Pipeline de lotes e histórico | RF-04 |
| ARQ-05 Módulo administrativo de tipos | RF-05 |
| ARQ-06 Integraciones FTP/REST | RF-06 |
| ARQ-07 Tenant isolation layer | RNF-01 |
| ARQ-08 Observabilidad y trazabilidad | RNF-02 |
| ARQ-09 Seguridad de plataforma | RNF-03 |
| ARQ-10 Despliegue y escalado | RNF-04 |
| ARQ-11 Gestión de costo técnico | RNF-05 |

## 4) Riesgos y plan de mitigación

### 4.1 Matriz de riesgos técnicos priorizados

| ID | Riesgo | Impacto | Probabilidad | Mitigación | Responsable | Horizonte |
|---|---|---|---|---|---|---|
| R-01 | Acoplamiento entre extracción y validación | Alto | Media | Contratos de módulo versionados + pruebas de contrato en CI | Arquitectura / Backend IA | Sprint 2-3 |
| R-02 | Deriva de esquema de salida estructurada | Alto | Media | Esquema canónico, validador estricto y control de compatibilidad | Líder de datos | Sprint 1-2 |
| R-03 | Latencia por lotes por encima del umbral operativo | Medio/Alto | Media | Presupuestos de latencia, colas con backpressure y pruebas de carga | Plataforma / DevOps | Sprint 3-4 |
| R-04 | Cobertura incompleta de observabilidad y trazas | Medio | Media | IDs de correlación, trazas obligatorias y tablero de SLO por tenant | Operación técnica | Sprint 2-4 |
| R-05 | Riesgo de fuga de información entre tenants | Crítico | Baja/Media | Pruebas de aislamiento por release + auditoría de permisos | Seguridad de plataforma | Sprint 2-3 |
| R-06 | Dependencia de fuentes externas no disponibles | Alto | Media | Mocks operativos + cola de reintento desacoplada | Integraciones | Sprint 1-4 |

### 4.2 Relación de riesgos con arquitectura (cobertura bidireccional)

| Riesgo | Componentes/decisiones de arquitectura implicados |
|---|---|
| R-01 | ARQ-01 StructuredExtractor, ARQ-02 CrossValidator |
| R-02 | ARQ-02 CrossValidator, ARQ-04 Pipeline histórico, ARQ-05 Gestión de tipos documentales |
| R-03 | ARQ-04 Pipeline de lotes, ARQ-10 Despliegue y escalado |
| R-04 | ARQ-08 Observabilidad y trazabilidad |
| R-05 | ARQ-07 Tenant isolation layer, ARQ-09 Seguridad de plataforma |
| R-06 | ARQ-06 Integraciones FTP/REST |

## 5) Gantt de sprints de implementación

<div class="gantt-wrap">
 <div class="gantt-grid">
 <div class="gantt-row"><span>Descubrimiento y alineación</span><div class="gantt-track"><i style="--start:0;--span:2"></i></div></div>
 <div class="gantt-row"><span>Base técnica DIE v1</span><div class="gantt-track"><i style="--start:1;--span:3"></i></div></div>
 <div class="gantt-row"><span>Validación y reglas</span><div class="gantt-track"><i style="--start:3;--span:2"></i></div></div>
 <div class="gantt-row"><span>Seguridad y observabilidad</span><div class="gantt-track"><i style="--start:4;--span:2"></i></div></div>
 <div class="gantt-row"><span>Piloto y transferencia</span><div class="gantt-track"><i style="--start:6;--span:2"></i></div></div>
 </div>
 <p class="gantt-caption">Escala de 8 sprints de 2 semanas. Ajustable según capacidad y dependencias.</p>
</div>

## 6) Estimación de costos parametrizable

<div id="presentacion-costos" class="costing-panel">
 <section>
 <h3>4.1 Costos de desarrollo e implementación</h3>
 <table>
 <thead><tr><th>Perfil</th><th>Tarifa hora (COP)</th><th>Horas</th><th>Subtotal</th></tr></thead>
 <tbody>
 <tr><td>Arquitecto solución</td><td><input type="number" min="0" data-input="rate-arquitecto"></td><td><input type="number" min="0" data-input="hours-arquitecto"></td><td data-output="dev-arquitecto"></td></tr>
 <tr><td>Desarrollador backend/IA</td><td><input type="number" min="0" data-input="rate-desarrollador"></td><td><input type="number" min="0" data-input="hours-desarrollador"></td><td data-output="dev-desarrollador"></td></tr>
 <tr><td>QA automatización</td><td><input type="number" min="0" data-input="rate-qa"></td><td><input type="number" min="0" data-input="hours-qa"></td><td data-output="dev-qa"></td></tr>
 <tr><td>DevOps / plataforma</td><td><input type="number" min="0" data-input="rate-devops"></td><td><input type="number" min="0" data-input="hours-devops"></td><td data-output="dev-devops"></td></tr>
 </tbody>
 </table>
 <p><strong>Subtotal desarrollo:</strong> <span data-output="developmentSubtotal"></span></p>
 </section>

 <section>
 <h3>4.2 Costos de consumo de servicios (mensual)</h3>
 <div class="cost-grid">
 <label>Tokens entrada (millones)<input type="number" min="0" step="0.1" data-input="inputTokensM"></label>
 <label>Precio token entrada x millón (COP)<input type="number" min="0" data-input="inputTokenPrice"></label>
 <label>Tokens salida (millones)<input type="number" min="0" step="0.1" data-input="outputTokensM"></label>
 <label>Precio token salida x millón (COP)<input type="number" min="0" data-input="outputTokenPrice"></label>
 <label>OCR fallback (miles de docs/lote)<input type="number" min="0" step="0.1" data-input="ocrDocsK"></label>
 <label>Precio OCR por mil docs (COP)<input type="number" min="0" data-input="ocrPriceK"></label>
 </div>
 <p>Entrada: <strong data-output="inputCost"></strong> | Salida: <strong data-output="outputCost"></strong> | OCR fallback: <strong data-output="ocrCost"></strong></p>
 <p><strong>Subtotal servicios:</strong> <span data-output="servicesSubtotal"></span></p>
 </section>

 <section>
 <h3>4.3 Costos de infraestructura (mensual)</h3>
 <div class="cost-grid">
 <label>App service / cómputo<input type="number" min="0" data-input="infra-appService"></label>
 <label>Base de datos y almacenamiento<input type="number" min="0" data-input="infra-dataStore"></label>
 <label>Observabilidad y monitoreo<input type="number" min="0" data-input="infra-observabilidad"></label>
 <label>Red, seguridad y respaldo<input type="number" min="0" data-input="infra-redSeguridad"></label>
 </div>
 <p><strong>Subtotal infraestructura:</strong> <span data-output="infraSubtotal"></span></p>
 </section>

 <section class="cost-summary">
 <h3>Resumen económico</h3>
 <label>Contingencia (%)<input type="number" min="0" step="0.5" data-input="contingencyPct"></label>
 <p>Operación mensual recurrente: <strong data-output="recurringMonthly"></strong></p>
 <p>Bolsa de contingencia anual: <strong data-output="contingencyCost"></strong></p>
 <p class="grand-total">Costo total año 1: <strong data-output="totalYearOne"></strong></p>
 </section>
</div>

