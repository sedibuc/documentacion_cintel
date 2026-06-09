# Cronograma de trabajo — Sprints semanales Jun 9–30

<div class="badge-row">
<span class="badge">3 sprints semanales</span>
<span class="badge">Jun 9 – Jun 30, 2026</span>
<span class="badge">1 ingeniero</span>
<span class="badge">~16 días hábiles</span>
</div>

> **Condición habilitadora:** PRE-01 y PRE-02 habilitan el arranque de Sprint 1. El desarrollo puede iniciar con documentos sintéticos o CTLs públicos. PRE-03, PRE-04 y PRE-05 son necesarios a partir de Sprint 2 (trabajo con documentos reales de Las Galias). PRE-06 (configuración del módulo administrativo) se completa durante Sprint 2.

---

## 1. Diagrama de Gantt

<div class="diagram-block">
<p class="diagram-label">Cronograma PoC DIE Las Galias — Jun 9 al 30, 2026</p>
<img src="assets/img/diagramas/poc-die-cronograma.png" alt="Diagrama de Gantt PoC DIE Las Galias">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-cronograma.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

**Sprint 1 (Jun 9–13):** Infraestructura base, ingesta documental, Content Extraction Service, StructuredExtractor LLM con schema `DOC_CTL` v1 y prompt v1 (calibrado con insumos de PRE-00 — reunión de contexto con Las Galias el Jun 11), ValidationEngine. Trabaja con documentos sintéticos o CTLs públicos mientras llega el corpus real.

**Sprint 2 (Jun 16–20):** Módulo administrativo (carga plantilla Excel + mapeo campos JSON↔columnas), CrossValidator con mapeo del admin, DiscrepancyAlertEngine, exportación JSON/CSV, métricas de calidad con corpus real de Las Galias, ajuste prompt v2 con MLflow.

**Sprint 3 (Jun 23–30):** Historial y AuditLog, pruebas E2E completas con corpus, Docker Compose final, documentación técnica y sesión de entrega formal.

---

## 2. Sprints detallados

### Sprint 1 — Jun 9 al 13 (5 días hábiles)
**Objetivo:** ambiente funcional + extractor LLM operativo sobre `DOC_CTL` (Certificado de Tradición y Libertad).

> PRE-00 (reunión de contexto) se agenda para ocurrir el **Jun 11** durante Sprint 1, de modo que los insumos (schema borrador, few-shots, campos críticos) estén disponibles para construir el prompt v1 de calidad en el mismo Sprint.

| Día | Actividad | Prerequisito | Entregable |
|---|---|---|---|
| Jun 9 (Lun) | Setup de ambiente (Docker, Python 3.11, PostgreSQL, repositorio), configuración `LLM_API_KEY`, estructura base FastAPI | PRE-01, PRE-02 | Ambiente funcional; API arranca en localhost |
| Jun 10 (Mar) | Ingesta documental: `POST /documents/upload`, `GET /documents/{id}`. Modelo `Document` con `tenant_id="las-galias"`. | PRE-01 | Ingesta funcional; documentos persisten en BD |
| Jun 11 (Mié) | Content Extraction Service (nativa PDF + base64 → LLM). Schema `DOC_CTL_v1.json`. **Reunión de contexto PRE-00 con Las Galias.** | **PRE-00** | Schema CTL validado informalmente; few-shots disponibles |
| Jun 12 (Jue) | StructuredExtractor LLM: prompt v1 con guardrails y few-shots para `DOC_CTL`. Evaluación de logprobs. Primera extracción sobre documentos de prueba. | PRE-00 (insumos) | Extractor LLM operativo para DOC_CTL |
| Jun 13 (Vie) | ValidationEngine (campos obligatorios, tipos de dato). Ajuste de prompts con base en primeros resultados. Prueba de 10 CTLs de corpus o sintéticos. | — | Extractor CTL ajustado; prompts v1 estables |

**Hito 1 (fin Sprint 1 — Jun 13):** extractor LLM operativo para `DOC_CTL`. CU-01 completado.

---

### Sprint 2 — Jun 16 al 20 (5 días hábiles)
**Objetivo:** CrossValidator con módulo administrativo + DiscrepancyAlertEngine + métricas con corpus real de Las Galias.

> PRE-03, PRE-04 y PRE-05 deben estar disponibles el **Jun 16** (corpus, schema validado, autorización de datos reales). PRE-06 se completa por Las Galias durante esta semana usando el módulo administrativo.

| Día | Actividad | Prerequisito | Entregable |
|---|---|---|---|
| Jun 16 (Lun) | Módulo administrativo: UI y endpoint para cargar plantilla Excel de referencia. Visualización de columnas vs. campos JSON del extractor. | PRE-03, PRE-04, PRE-05 | Módulo admin operativo; Excel cargable |
| Jun 17 (Mar) | Interfaz de mapeo campo JSON ↔ columna Excel en el módulo admin. Las Galias completa mapeo (PRE-06). Persistencia del mapeo en BD. | **PRE-06** | Mapeo JSON↔Excel guardado y disponible |
| Jun 18 (Mié) | CrossValidator: comparación campo a campo usando el mapeo del admin. Clasificación `MATCH`, `MISMATCH`, `PENDIENTE`. | PRE-06 | CrossValidator operativo con datos reales |
| Jun 19 (Jue) | DiscrepancyAlertEngine: alertas con severidad `BLOCKING`/`WARNING`/`INFO`. Endpoints: `GET /extractions/{id}/alerts`. Exportación JSON/CSV por documento y lote. | — | Alertas generadas; exportación funcional |
| Jun 20 (Vie) | Métricas de calidad: F1-score por campo, logprobs review. Ajuste prompt v2 en MLflow. Procesamiento de lote de ~20 documentos del corpus Las Galias. | PRE-03 | Métricas calculadas; prompt v2 disponible |

**Hito 2 (fin Sprint 2 — Jun 20):** CrossValidator con módulo admin, alertas operativas, métricas de calidad con corpus real. CU-02 a CU-07 completados.

---

### Sprint 3 — Jun 23 al 30 (6 días hábiles)
**Objetivo:** integración E2E completa, ajuste final de calidad, documentación y entrega formal.

| Día | Actividad | Entregable |
|---|---|---|
| Jun 23 (Lun) | Historial de ejecuciones (CU-08). AuditLog completo (JSONL) con trazabilidad total por extracción. | CU-08 completado; trazabilidad completa |
| Jun 24 (Mar) | Pruebas E2E con corpus completo (~35 docs reales). Registro de evidencias en MLflow. | Evidencias de ejecución E2E |
| Jun 25 (Mié) | Evaluación prompt v2 vs v1 (CU-09). Ajuste final de thresholds de logprob y severidad de alertas. | Configuración final validada |
| Jun 26 (Jue) | Docker Compose final. README con instrucciones de arranque en 1 comando. Datos de demo (10 docs representativos). | PoC desplegable en 1 comando |
| Jun 27 (Vie) | Documentación técnica: API Reference (OpenAPI), guía de configuración, descripción de schemas. | Documentación técnica completa |
| Jun 30 (Mar) | Sesión de demostración y entrega: flujo completo con datos reales, métricas de calidad, evidencias, resumen de resultados y next steps hacia TO-BE multi-tenant. | **Entrega formal de la PoC** |

**Hito 3 (Jun 30):** PoC entregada con evidencias E2E, métricas de calidad y documentación. CU-09 completado.

---

## 3. Mapa de prerequisitos por sprint

| Prerequisito | Sem. previa (≤Jun 8) | Sprint 1 (Jun 9–13) | Sprint 2 (Jun 16–20) | Sprint 3 (Jun 23–30) |
|---|---|---|---|---|
| PRE-00 — Reunión de contexto Las Galias | Agendada | **Ocurre Jun 11** | Insumos en prompt v2 | — |
| PRE-01 — Credenciales LLM | ✅ Disponibles | Usadas desde Jun 9 | Continúan | Continúan |
| PRE-02 — Ambiente de desarrollo | ✅ Listo | Configurado Jun 9 | Continúa | Continúa |
| PRE-03 — Corpus documental Las Galias | — | Recibido ≤Jun 13 | **Requerido Jun 16** | Evidencias finales |
| PRE-04 — Schema validado por Las Galias | — | Borrador de PRE-00 | **Validado ≤Jun 16** | — |
| PRE-05 — Autorización datos reales | — | Solicitada | **Aprobada ≤Jun 16** | — |
| PRE-06 — Template en módulo admin | — | — | **Completado ≤Jun 17** | — |

---

## 4. Distribución del esfuerzo

| Actividad | Días est. | Sprint(s) |
|---|---|---|
| Setup ambiente + infraestructura base | 1.5 | Sprint 1 |
| Ingesta documental + modelo de datos | 1.0 | Sprint 1 |
| Content Extraction Service | 0.5 | Sprint 1 |
| StructuredExtractor (LLM + schema + prompt DOC_CTL) | 2.5 | Sprint 1 |
| ValidationEngine | 0.5 | Sprint 1 |
| Módulo administrativo (carga Excel + mapeo JSON↔columnas) | 1.5 | Sprint 2 |
| CrossValidator | 1.0 | Sprint 2 |
| DiscrepancyAlertEngine | 1.0 | Sprint 2 |
| Exportación JSON/CSV + API de resultados | 1.0 | Sprint 2 |
| Métricas de calidad + MLflow + prompt v2 | 1.0 | Sprint 2 |
| Historial + AuditLog + pruebas E2E | 1.5 | Sprint 3 |
| Ajuste fino de prompts | 0.5 | Sprint 3 |
| Docker Compose + README | 0.5 | Sprint 3 |
| Documentación técnica + sesión de entrega | 1.5 | Sprint 3 |
| **Total** | **~16 días** | |

---

Trazabilidad: [Alcance](alcance.html) · [Prerequisitos](prerequisitos.html) · [Prototipo](prototipo.html) · [Riesgos](riesgos.html)
