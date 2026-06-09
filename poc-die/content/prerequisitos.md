# Prerequisitos externos y validaciones

<div class="badge-row">
<span class="badge">Sección 2 de 5</span>
<span class="badge">7 prerequisitos</span>
<span class="badge badge-note">2 bloqueantes para Sprint 1</span>
<span class="badge">PRE-00 primera semana</span>
</div>

> **Qué es esta sección:** identificación, descripción y clasificación de todas las condiciones externas que deben satisfacerse antes o durante la ejecución de la PoC. Cada prerequisito incluye responsable, fecha máxima de entrega y relación explícita con el sprint.

---

## 1. Tabla de prerequisitos

| ID | Descripción | Responsable | Fecha máx. de entrega |
|---|---|---|---|
| **PRE-00** | **Reunión de contexto con Las Galias** — sesión de 1 hora en la que CINTEL presenta a alto nivel el objetivo de la PoC DIE y Las Galias demuestra su flujo actual de trabajo con 2 documentos CTL reales, explicando qué buscan extraer de cada uno y cuáles campos son críticos. Insumo principal para construir el prompt v1 y los few-shots. | CINTEL (convoca y facilita) / Las Galias (demuestra documentos) | **Jun 11, 2026** |
| **PRE-01** | **Credenciales LLM operativas** — API Key activa del proveedor LLM seleccionado (OpenAI GPT-4o o Google Gemini Flash) con cuota suficiente para ~400 invocaciones de prueba. Variable de entorno `LLM_API_KEY` disponible en el ambiente. | CINTEL (aprovisionamiento) | **Jun 9, 2026** |
| **PRE-02** | **Ambiente de desarrollo operativo** — Docker Desktop, Python 3.11+, Git con acceso al repositorio privado, PostgreSQL 15 (o SQLite como fallback). | Ingeniero | **Jun 9, 2026** |
| **PRE-03** | **Corpus documental Las Galias** — mínimo 20 Certificados de Tradición y Libertad (`DOC_CTL`) en PDF. Representativos de la variedad real: distintas ORIP, distintos formatos, mezcla de documentos digitales. Entregados por canal seguro. | Las Galias / CINTEL (recepción) | **Jun 13, 2026** |
| **PRE-04** | **Esquema de campos validado por Las Galias** — confirmación de los campos a extraer por tipo documental (nombre, tipo de dato, obligatoriedad, descripción semántica y ejemplos de valores). Entregado como correo de aprobación o documento firmado. | Las Galias (aprobación) / CINTEL (propuesta) | **Jun 13, 2026** |
| **PRE-05** | **Autorización para tratamiento de datos reales** — aval formal de Las Galias para procesar documentos reales en el ambiente de desarrollo controlado del ingeniero (instancia local + repositorio privado). Permite usar los PDFs de PRE-03 sin restricción. Sin este aval, la PoC continúa con documentos sintéticos. | Las Galias (aprobación) / CINTEL (solicitud) | **Jun 13, 2026** |
| **PRE-06** | **Configuración del template de referencia en el módulo administrativo** — Las Galias usa el módulo administrativo de la PoC para cargar su plantilla Excel y mapear cada columna al campo del JSON del extractor. Esta acción no requiere preparación previa: se hace directamente en la interfaz web durante Sprint 2. | Las Galias (opera módulo) / CINTEL (soporte técnico) | **Jun 17, 2026** |

---

## 2. Mapa de dependencias

<div class="diagram-block">
<p class="diagram-label">Prerequisitos y dependencias de sprint — PoC DIE Las Galias</p>
<img src="assets/img/diagramas/poc-die-prerequisitos.png" alt="Diagrama de prerequisitos PoC DIE">
<div class="diagram-links">
<a href="assets/plantuml/poc-die-prerequisitos.plantuml" download>⬇ Fuente PlantUML</a>
</div>
</div>

---

## 3. Descripción extendida

### PRE-00 — Reunión de contexto con Las Galias

**Por qué es crítico:** el prompt v1 del extractor LLM se construye a partir de:
- comprensión semántica de qué significa cada campo para Las Galias,
- ejemplos de valores reales (few-shots),
- claridad sobre qué campos son operativamente críticos vs. informativos,
- conocimiento de ambigüedades documentales conocidas (campos que aparecen de múltiples formas).

Sin esta reunión, el prompt v1 es una hipótesis sin validar. Con ella, el prompt v1 nace calibrado.

**Agenda (1 hora):**

| Bloque | Duración | Objetivo |
|---|---|---|
| CINTEL: contexto del objetivo a alto nivel | 15 min | Presentar qué es el DIE, qué busca demostrar la PoC y cuál es el valor esperado para Las Galias |
| Las Galias: demostración con documento CTL #1 | 20 min | Las Galias muestra un CTL real y explica qué campos busca, cómo los usa hoy y qué valor critico tienen |
| Las Galias: demostración con documento CTL #2 | 15 min | Segundo ejemplo con un CTL de diferentes características (otra ORIP, otro formato); identificar variaciones |
| Definición de campos BLOCKING vs INFO + próximos pasos | 10 min | Acordar qué campos DEBEN extraerse correctamente; confirmar fechas de entrega del corpus (PRE-03) |

**Salidas esperadas:**
- Borrador del schema de campos validado informalmente (insumo para PRE-04).
- Lista de few-shots (3–5 fragmentos de texto reales con valores de referencia).
- Identificación de campos de alta ambigüedad para priorizar en el prompt.

---

### PRE-06 — Módulo administrativo para template de referencia

A diferencia de versiones anteriores del diseño, **no se pedirá a Las Galias que preparen un archivo CSV con anticipación**. En cambio:

1. Las Galias carga su Excel con los registros de referencia usando el módulo administrativo (disponible desde Sprint 2).
2. El módulo muestra las columnas del Excel y los campos del JSON del extractor.
3. Las Galias mapea cada columna a su campo correspondiente (drag-and-drop o selector).
4. El sistema guarda el mapeo y lo usa automáticamente en el CrossValidator.

Este enfoque elimina la necesidad de preparar un archivo en formato específico y evita errores de columnas con nombres distintos.

---

## 4. Plan de contingencia

| Prerequisito | Contingencia | Impacto |
|---|---|---|
| PRE-00 no se agenda a tiempo | CINTEL construye prompt v1 con base en documentos públicos de CTL + buenas prácticas; se ajusta con feedback de Las Galias | Calidad del prompt v1 reducida; requiere más iteraciones en Sprint 2 |
| PRE-01 API Key no disponible Jun 9 | Usar Google Gemini Free Tier (1 RPM); Sprint 1 avanza muy lento | Solo 1–2 extracciones por minuto; Sprint 1 se completa con muestra reducida |
| PRE-03 corpus no disponible Jun 13 | Usar CTLs públicos descargados del portal de la SNR | Datos reales con menor representatividad de Las Galias |
| PRE-04 schema no validado Jun 13 | Usar schema propuesto por CINTEL como v0; ajustar en Sprint 2 | Puede requerir re-extracción tras validación |
| PRE-05 sin autorización | Trabajar con documentos sintéticos o públicos | PoC técnicamente válida; sin evidencia con datos propios de Las Galias |
| PRE-06 no completado Jun 17 | CrossValidator usa dataset sintético de referencia | Métricas de calidad menos representativas |

---

Trazabilidad: [Alcance](alcance.html) · [Cronograma](cronograma.html) · [Riesgos](riesgos.html)
