# Ajuste arquitectónico: Content Extraction Strategy (OCR como fallback)

**Fecha:** 2026-05  
**Contexto:** Document Intelligence Engine MultiTenant — Ajuste post-reposicionamiento

---

## 1. Resumen del ajuste

Se eliminó `OCR / Text Extraction` como componente principal/obligatorio del flujo del DIE y se reemplazó por una capa de selección estratégica llamada **Content Extraction Strategy**, que representa la elección entre tres rutas de procesamiento de contenido documental:

1. **Extracción nativa** — para documentos digitales con texto embebido (PDF, DOCX, XLSX, CSV, HTML)
2. **LLM multimodal/documental** — si el modelo lo soporta y es compatible con soberanía de datos, costo y trazabilidad
3. **OCR fallback** — solo para documentos escaneados, imágenes o PDFs sin texto embebido

---

## 2. Razón para no modelar OCR como paso obligatorio

OCR introduce riesgos de integridad cuando se aplica innecesariamente sobre documentos digitales:

- Alteración de números críticos (matrículas, valores, porcentajes)
- Pérdida de estructura tabular
- Confusión de caracteres (`0`/`O`, `1`/`I`, `,`/`.`)
- Omisión de texto en columnas o bordes
- Ruptura de encabezados o pies relevantes
- Dificultad para auditar el dato extraído contra el documento original

En un sistema orientado a extracción estructurada y validación cruzada, **preservar la integridad del dato original es crítico**. OCR solo debe activarse cuando no existe mejor opción.

---

## 3. Nueva decisión arquitectónica

> La arquitectura no asume OCR como mecanismo principal. Para preservar la integridad de la información, el sistema prioriza el procesamiento directo del documento digital, la extracción nativa de texto/estructura o el análisis documental/multimodal con LLM cuando esté disponible y sea compatible con las restricciones de soberanía. OCR se conserva únicamente como mecanismo auxiliar para documentos escaneados, imágenes o archivos sin texto embebido, acompañado de controles de calidad y trazabilidad sobre el documento original.

Flujo correcto:
```
Documento original
  ↓
Document Intake
  ↓
Content Extraction Strategy
  ├─ Extracción nativa de texto/estructura
  ├─ LLM multimodal/documental si está disponible
  └─ OCR fallback para escaneados/imágenes
  ↓
Normalized Document Representation
  ↓
StructuredExtractor con LLM
  ↓
Validation Engine
  ↓
CrossValidator
  ↓
DiscrepancyAlertEngine
```

---

## 4. Diagramas modificados

| Diagrama | Cambio |
|---|---|
| `01-vista-negocio-capacidades.puml` | `OCR / Text Extraction` → `Content Extraction Strategy (Procesamiento — Híbrido)` + leyenda actualizada |
| `02-mapa-componentes-tobe.puml` | `[OCR / Text Extraction]` → `[Content Extraction Strategy Service]` + `[OCR Engine] <<Fallback>>` + conexiones actualizadas |
| `03-flujo-procesamiento-documentos.puml` | Paso OCR único → rama de decisión (nativa / LLM multimodal / OCR fallback) + `Normalized Document Representation` |
| `04-flujo-extraccion-llm.puml` | `texto_ocr` → `representacion_normalizada` + `metodo_extraccion` en argumentos y audit log |
| `05-vista-datos-conceptual.puml` | Nuevas entidades: `DocumentContentExtraction` y `NormalizedDocumentRepresentation` + relaciones |

---

## 5. Rutas PlantUML modificadas

- `assets/plantuml/document-intelligence/01-vista-negocio-capacidades.puml`
- `assets/plantuml/document-intelligence/02-mapa-componentes-tobe.puml`
- `assets/plantuml/document-intelligence/03-flujo-procesamiento-documentos.puml`
- `assets/plantuml/document-intelligence/04-flujo-extraccion-llm.puml`
- `assets/plantuml/document-intelligence/05-vista-datos-conceptual.puml`

Los diagramas 06, 07 y 08 no se modificaron (no mostraban OCR como paso obligatorio).

---

## 6. Rutas PNG generadas (re-renderizados)

| Archivo | Tamaño | Dimensiones |
|---|---|---|
| `01-vista-negocio-capacidades.png` | 114 KB | 1614×675 px |
| `02-mapa-componentes-tobe.png` | 148 KB | 1683×1537 px |
| `03-flujo-procesamiento-documentos.png` | 228 KB | 2800×2416 px |
| `04-flujo-extraccion-llm.png` | 110 KB | 2096×894 px |
| `05-vista-datos-conceptual.png` | 211 KB | 1097×2203 px |

Los 3 diagramas no modificados también se re-renderizaron (sin cambios): 06, 07, 08 — 8 OK, 0 fallidos.

---

## 7. Preguntas experto agregadas

Se agregaron **26 preguntas nuevas** (numeradas 19–44) al archivo `content/preguntas-experto.md`, organizadas en 5 grupos:

- **A. Sobre capacidades del modelo** (preguntas 19–25): multimodal, JSON mode, evidencia por campo, límites de tamaño, soberanía
- **B. Sobre integridad y trazabilidad** (preguntas 26–29): trazabilidad del dato, registro del método, detección de baja calidad, controles anti-OCR error
- **C. Sobre OCR como fallback** (preguntas 30–35): activación, tipos que requieren OCR, motor, calidad, precedencia LLM vs OCR, revisión humana obligatoria
- **D. Sobre soberanía, costo y operación** (preguntas 36–39): envío de documentos a nube, alternativas on-premise, costo comparativo, escalabilidad
- **E. Sobre decisión arquitectónica** (preguntas 40–44): estrategia por defecto para digitales, para escaneados, umbrales, reprocesamiento, criterios para eliminar OCR

---

## 8. Contenidos actualizados

| Archivo | Cambio |
|---|---|
| `content/arquitectura-tobe.md` | Nuevo blockquote de enfoque LLM-first; matriz de capacidades actualizada; tabla de componentes actualizada; descripciones de vistas 3, 4 y 5 actualizadas; supuesto sobre Content Extraction Strategy |
| `content/to-be-funcional.md` | Paso 2 reescrito de `OCR / Text Extraction` a `Content Extraction Strategy`; pipeline técnico LLM actualizado con nuevas etapas y rutas |
| `content/preguntas-experto.md` | 26 nuevas preguntas (grupos A–E) sobre estrategia de extracción documental y modelos |

---

## 9. Resultado de validación PlantUML

- 8 diagramas renderizados, 0 fallidos
- Todos los PNGs muestran las nuevas capas (Content Extraction Strategy, OCR Engine fallback, Normalized Document Representation, DocumentContentExtraction, NormalizedDocumentRepresentation)
- OCR no aparece como paso obligatorio en ningún diagrama
- Leyenda actualizada en diagramas 01 y 02

---

## 10. Resultado de validación Chrome DevTools MCP

| Verificación | Resultado |
|---|---|
| `arquitectura-tobe.html` — 8 PNGs cargan | ✅ Todos 200 OK, dimensiones correctas |
| Diagrama 03 ampliado (2800×2416) | ✅ Flujo de decisión visible |
| Diagrama 05 ampliado (1097×2203) | ✅ Nuevas entidades visibles |
| Texto "Content Extraction Strategy" en página | ✅ Presente |
| Texto "OCR fallback" en página | ✅ Presente (como fallback, no como principal) |
| Sin "OCR / Text Extraction" como componente | ✅ Eliminado |
| `preguntasexperto.html` — nuevas preguntas | ✅ 51 encabezados, sección nueva visible |
| Errores JavaScript | ✅ Ninguno |
| Recursos 404 | ✅ Ninguno |

---

## 11. Búsqueda final de consistencia

- No quedan referencias a `OCR / Text Extraction` como componente TO-BE
- No quedan referencias a `texto_ocr` en diagramas de secuencia
- `arquitectura.md` (AS-IS) conserva sus referencias OCR correctamente (documenta el sistema existente)
- `brechas.md` conserva referencia OCR en sección de AS-IS (correcto)
- Todos los archivos TO-BE mencionan OCR solo como fallback

---

## 12. Decisiones abiertas para experto en modelos

1. **Umbral de calidad OCR (`quality_score`)**: ¿Cuál es el valor mínimo aceptable para proceder con extracción estructurada?
2. **Estrategia por defecto para escaneados**: ¿LLM multimodal tiene precedencia sobre OCR cuando el modelo lo soporta y la soberanía lo permite?
3. **Motor OCR recomendado**: ¿Tesseract es suficiente para el piloto construcción, o se requiere Google Document AI / AWS Textract?
4. **Partición de documentos largos**: ¿Cómo manejar certificados de tradición de 30–80 páginas que exceden el contexto del modelo?
5. **Reprocesamiento automático**: ¿El sistema debe intentar otra estrategia automáticamente si la primera falla o produce cobertura baja?
6. **Revisión humana para OCR_FALLBACK**: ¿Es obligatoria, configurable o solo cuando `quality_score < umbral`?
7. **Modelos on-premise multimodales**: ¿Cuál modelo Ollama ofrece calidad suficiente para procesamiento documental en el piloto?
