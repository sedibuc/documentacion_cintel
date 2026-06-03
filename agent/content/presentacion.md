# Presentación ejecutiva

Esta página condensa el mensaje para directivos: estado actual del agente, evolución objetivo, plan por sprints y estimación de costos con variables ajustables.

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
| RF-01 Onboarding institucional con contexto inicial | Funcional | ARQ-01 OnboardingService + OrganizationalContextStore |
| RF-02 Planeación estratégica de campaña | Funcional | ARQ-02 StrategicAgent + ContextRetrievalService |
| RF-03 Generación creativa por canal | Funcional | ARQ-03 CreativeAgent + agentes de canal especializados |
| RF-04 Iteración controlada de resultados | Funcional | ARQ-04 HumanValidationModule + ciclo de iteración |
| RF-05 Histórico y reutilización de campañas | Funcional | ARQ-05 CampaignHistoryStore + consultas históricas |
| RF-06 Integración con canales y publicación | Funcional | ARQ-06 Export/PublishingAdapter |
| RNF-01 Trazabilidad y auditoría de prompts/salidas | No funcional | ARQ-07 ObservabilityService + registro de eventos |
| RNF-02 Aislamiento por tenant y seguridad base | No funcional | ARQ-08 TenantIsolationLayer + políticas de acceso |
| RNF-03 Escalabilidad y operación continua | No funcional | ARQ-09 Arquitectura TO-BE + plan de despliegue |
| RNF-04 Control de costos de IA e infraestructura | No funcional | ARQ-10 Modelo de costos + instrumentación de consumo |
| RNF-05 Gobernanza técnica y contractual | No funcional | ARQ-11 Mapa de módulos + criterios de aceptación |

### 3.2 Trazabilidad inversa (cada ítem de arquitectura responde al menos un requisito)

| Item de arquitectura | Requisitos que atiende |
|---|---|
| ARQ-01 OnboardingService + Context Store | RF-01 |
| ARQ-02 StrategicAgent | RF-02 |
| ARQ-03 CreativeAgent + agentes de canal especializados | RF-03 |
| ARQ-04 HumanValidationModule | RF-04 |
| ARQ-05 CampaignHistoryStore | RF-05 |
| ARQ-06 Export/PublishingAdapter | RF-06 |
| ARQ-07 ObservabilityService | RNF-01 |
| ARQ-08 TenantIsolationLayer | RNF-02 |
| ARQ-09 Arquitectura y despliegue TO-BE | RNF-03 |
| ARQ-10 Gestión de costos | RNF-04 |
| ARQ-11 Gobierno por módulos y aceptación | RNF-05 |

## 4) Riesgos y plan de mitigación

### 4.1 Matriz de riesgos técnicos y operativos

| ID | Riesgo | Impacto | Probabilidad | Mitigación | Responsable | Horizonte |
|---|---|---|---|---|---|---|
| A-01 | Aprobaciones funcionales tardías por área | Alto | Media | Ventanas de revisión semanales + responsables definidos por dependencia | Líder funcional | Sprint 1-4 |
| A-02 | Madurez desigual de canales de salida | Medio/Alto | Media | Priorización por canal crítico + plantillas y pruebas de compatibilidad | Equipo de canales | Sprint 2-5 |
| A-03 | Sobrecarga en validación humana de iteraciones | Medio | Alta | Límites WIP, lotes de revisión y automatización de chequeos repetitivos | Operación de contenidos | Sprint 3-6 |
| A-04 | Privilegios amplios de acceso en piloto | Alto | Media | RBAC mínimo, revisión de permisos y bitácora de cambios | Seguridad / Plataforma | Sprint 2-4 |
| A-05 | Escalado sin línea base de uso y costo | Medio/Alto | Media | Línea base por tenant + umbrales de escalamiento automático | DevOps | Sprint 3-5 |
| A-06 | Deriva de calidad de salida entre agentes y canales | Alto | Media | Criterios de calidad unificados y gates de aceptación por versión | Strategic + Creative lead | Sprint 2-5 |

### 4.2 Relación de riesgos con arquitectura (cobertura bidireccional)

| Riesgo | Componentes/decisiones de arquitectura implicados |
|---|---|
| A-01 | ARQ-04 HumanValidationModule, ARQ-11 Gobierno por módulos |
| A-02 | ARQ-03 CreativeAgent + agentes de canal especializados, ARQ-06 PublishingAdapter |
| A-03 | ARQ-04 HumanValidationModule, ARQ-07 ObservabilityService |
| A-04 | ARQ-08 TenantIsolationLayer, ARQ-09 Arquitectura y despliegue TO-BE |
| A-05 | ARQ-09 Arquitectura y despliegue TO-BE, ARQ-10 Gestión de costos |
| A-06 | ARQ-02 StrategicAgent, ARQ-03 CreativeAgent + agentes de canal especializados |

## 5) Gantt de sprints de implementación

<div class="gantt-wrap">
 <div class="gantt-grid">
 <div class="gantt-row"><span>Alineación y definición de alcance</span><div class="gantt-track"><i style="--start:0;--span:2"></i></div></div>
 <div class="gantt-row"><span>Construcción de agentes v1</span><div class="gantt-track"><i style="--start:1;--span:3"></i></div></div>
 <div class="gantt-row"><span>Integraciones y seguridad</span><div class="gantt-track"><i style="--start:3;--span:2"></i></div></div>
 <div class="gantt-row"><span>Pruebas con áreas de negocio</span><div class="gantt-track"><i style="--start:5;--span:2"></i></div></div>
 <div class="gantt-row"><span>Despliegue y estabilización</span><div class="gantt-track"><i style="--start:6;--span:2"></i></div></div>
 </div>
 <p class="gantt-caption">Escala de 8 sprints de 2 semanas con hitos de validación ejecutiva.</p>
</div>

## 6) Estimación de costos parametrizable

<div id="presentacion-costos" class="costing-panel">
 <section>
 <h3>4.1 Costos de desarrollo e implementación</h3>
 <table>
 <thead><tr><th>Perfil</th><th>Tarifa hora (COP)</th><th>Horas</th><th>Subtotal</th></tr></thead>
 <tbody>
 <tr><td>Arquitecto de solución</td><td><input type="number" min="0" name="rate-arquitecto" data-input="rate-arquitecto"></td><td><input type="number" min="0" name="hours-arquitecto" data-input="hours-arquitecto"></td><td data-output="dev-arquitecto"></td></tr>
 <tr><td>Desarrollador plataforma</td><td><input type="number" min="0" name="rate-desarrollador" data-input="rate-desarrollador"></td><td><input type="number" min="0" name="hours-desarrollador" data-input="hours-desarrollador"></td><td data-output="dev-desarrollador"></td></tr>
 <tr><td>QA de automatización</td><td><input type="number" min="0" name="rate-qa" data-input="rate-qa"></td><td><input type="number" min="0" name="hours-qa" data-input="hours-qa"></td><td data-output="dev-qa"></td></tr>
 <tr><td>DevOps / plataforma</td><td><input type="number" min="0" name="rate-devops" data-input="rate-devops"></td><td><input type="number" min="0" name="hours-devops" data-input="hours-devops"></td><td data-output="dev-devops"></td></tr>
 </tbody>
 </table>
 <p><strong>Subtotal desarrollo:</strong> <span data-output="developmentSubtotal"></span></p>
 </section>

 <section>
 <h3>4.2 Costos de consumo de servicios (mensual)</h3>
 <div class="cost-grid">
 <label>Tokens entrada (millones)<input type="number" min="0" step="0.1" name="inputTokensM" data-input="inputTokensM"></label>
 <label>Precio token entrada x millón (COP)<input type="number" min="0" name="inputTokenPrice" data-input="inputTokenPrice"></label>
 <label>Tokens salida (millones)<input type="number" min="0" step="0.1" name="outputTokensM" data-input="outputTokensM"></label>
 <label>Precio token salida x millón (COP)<input type="number" min="0" name="outputTokenPrice" data-input="outputTokenPrice"></label>
 <label>Embeddings (millones)<input type="number" min="0" step="0.1" name="embeddingsM" data-input="embeddingsM"></label>
 <label>Precio embeddings x millón (COP)<input type="number" min="0" name="embeddingsPrice" data-input="embeddingsPrice"></label>
 </div>
 <p>Entrada: <strong data-output="inputCost"></strong> | Salida: <strong data-output="outputCost"></strong> | Embeddings: <strong data-output="embeddingsCost"></strong></p>
 <p><strong>Subtotal servicios:</strong> <span data-output="servicesSubtotal"></span></p>
 </section>

 <section>
 <h3>4.3 Costos de infraestructura (mensual)</h3>
 <div class="cost-grid">
 <label>App service / cómputo<input type="number" min="0" name="infra-appService" data-input="infra-appService"></label>
 <label>Base de datos y almacenamiento<input type="number" min="0" name="infra-dataStore" data-input="infra-dataStore"></label>
 <label>Observabilidad y monitoreo<input type="number" min="0" name="infra-observabilidad" data-input="infra-observabilidad"></label>
 <label>Red, seguridad y respaldo<input type="number" min="0" name="infra-redSeguridad" data-input="infra-redSeguridad"></label>
 </div>
 <p><strong>Subtotal infraestructura:</strong> <span data-output="infraSubtotal"></span></p>
 </section>

 <section class="cost-summary">
 <h3>Resumen económico</h3>
 <label>Contingencia (%)<input type="number" min="0" step="0.5" name="contingencyPct" data-input="contingencyPct"></label>
 <p>Operación mensual recurrente: <strong data-output="recurringMonthly"></strong></p>
 <p>Bolsa de contingencia anual: <strong data-output="contingencyCost"></strong></p>
 <p class="grand-total">Costo total año 1: <strong data-output="totalYearOne"></strong></p>
 </section>
</div>

