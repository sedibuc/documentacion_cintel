# Reorientación: Guía exploratoria para experto en modelos

**Fecha:** 2026-05-17  
**Archivo ajustado:** `content/preguntas-experto.md`  
**Archivo HTML:** `preguntasexperto.html`  
**Título actualizado en:** `assets/js/app.js`

---

## 1. Resumen del ajuste

El documento de preguntas al experto fue reestructurado para pasar de una lista de preguntas exploratorias genéricas a un documento de **insumos exploratorios requeridos para orientar el análisis técnico posterior**. El objetivo de la sesión con el experto no es obtener una selección final de modelo, sino recibir orientación preliminar accionable: candidatos, criterios, hipótesis, riesgos y una ruta de evaluación.

---

## 2. Archivo Markdown activo modificado

```text
content/preguntas-experto.md
```

Este es el archivo cargado por `preguntasexperto.html`, confirmado en `assets/js/app.js` línea 11.

---

## 3. Cambio principal: de preguntas abiertas a insumos exploratorios

### Antes
- Título: `# Preguntas para el experto en modelos — Document Intelligence Engine MultiTenant`
- Badge: "18 preguntas · ~3h 30min"
- Formulación: preguntas tipo `¿El modelo puede...?`, `¿Es posible...?`, `¿Qué ocurre si...?`
- Tabla de proyección con columnas: `# | Pregunta | Grupo | Tiempo`
- Sin secciones de propósito, requisitos base ni insumos esperados

### Después
- Título: `# Guía exploratoria para experto en modelos — Document Intelligence Engine MultiTenant`
- Badge: "18 insumos exploratorios · ~3h 30min" + "Orientación preliminar · no selección final de modelos"
- Formulación: verbos accionables — `Proponga`, `Clasifique`, `Evalúe`, `Recomiende`, `Defina`, `Estime`, `Compare`, `Valide`, `Identifique`, `Especifique`, `Documente`
- Tabla de proyección ampliada: `# | Insumo exploratorio requerido | Tipo | Grupo | Tiempo est. | Resultado esperado`
- Secciones nuevas: Propósito (§1), Insumos esperados (§2), Requisitos base (§3)

---

## 4. Aclaración incorporada sobre no exigir selección final

Incorporada como bloque `>` visible al inicio del documento:

> **Aclaración importante:** La sesión con el experto no busca obtener una selección final de modelo ni reemplaza una PoC técnica con documentos reales. El resultado esperado es una **recomendación preliminar y argumentada** que sirva como insumo para diseñar el análisis exploratorio posterior, priorizar candidatos, identificar riesgos y definir criterios de evaluación. La selección definitiva del modelo deberá validarse posteriormente mediante pruebas controladas con documentos representativos del MVP.

Reforzada en Sección 2 ("No se pide un veredicto definitivo ni una selección cerrada") y en el insumo 1 del Grupo A.

---

## 5. Preguntas transformadas en requisitos/insumos

| # | Antes (pregunta) | Después (insumo exploratorio) | Verbo rector |
|---|---|---|---|
| 1 | ¿El modelo puede procesar directamente PDF, imágenes o DOCX? | Proponga top N candidatos por tipo de archivo del MVP | Proponga |
| 2 | ¿El modelo soporta entrada multimodal o solo texto? | Clasifique modelos candidatos según capacidad de entrada | Clasifique |
| 3 | ¿El modelo conserva estructura de tablas, formularios y columnas? | Evalúe qué modelos podrían preservar mejor la estructura documental | Evalúe |
| 4 | ¿El modelo puede operar on-premise o en cloud certificado? | Clasifique los modelos candidatos por compatibilidad con soberanía de datos | Clasifique |
| 5 | ¿Qué límites tiene en tamaño, páginas, tokens o imágenes? | Documente los límites operativos conocidos de los modelos candidatos | Documente |
| 6 | ¿El riesgo de alucinación en extracción estructurada es comparable al de generación libre? | Valide preliminarmente los controles de alucinación en extracción estructurada | Valide |
| 7 | ¿El modelo puede citar o ubicar la evidencia dentro del documento? | Indique qué modelos o estrategias permitirían evidencia por campo | Indique |
| 8 | ¿Cómo se garantiza que el valor extraído proviene del documento original? | Recomiende técnicas para garantizar extracción desde el documento original | Recomiende |
| 9 | ¿Cómo se detecta que una extracción fue incompleta o de baja calidad? | Defina métricas y heurísticas candidatas para detectar extracción incompleta | Defina |
| 10 | ¿Qué tipos de documentos requieren OCR inevitablemente? | Identifique tipos documentales que probablemente requieran OCR fallback | Identifique |
| 11 | ¿Qué ocurre si OCR y LLM multimodal entregan resultados diferentes? | Proponga regla de precedencia y reconciliación OCR vs LLM multimodal | Proponga |
| 12 | ¿Existe alternativa local/on-premise para procesamiento multimodal? | Proponga alternativas on-premise viables para procesamiento multimodal/documental | Proponga |
| 13 | ¿Qué criterios permiten evaluar si el modelo puede reemplazar OCR? | Defina protocolo exploratorio y umbrales candidatos para reducir o desactivar OCR | Defina |
| 14 | ¿Qué contratos o configuraciones garantizan soberanía con el LLM provider? | Especifique condiciones mínimas para usar LLM cloud con documentos sensibles | Especifique |
| 15 | ¿Cuáles son los criterios objetivos para activar NER supervisado post-MVP? | Valide y ajuste criterios para activar NER supervisado post-MVP | Valide |
| 16 | ¿La estrategia por defecto es zero-shot o few-shot? | Recomiende la estrategia inicial de prompting para el MVP | Recomiende |
| 17 | ¿Cuál es el costo comparativo entre las tres estrategias de extracción? | Estime comparativamente el costo por documento por estrategia de extracción | Estime |
| 18 | ¿Qué estrategia escala mejor para procesamiento por lotes? | Compare preliminarmente las estrategias de extracción para procesamiento por lotes | Compare |

---

## 6. Matriz comparativa preliminar agregada

Se agregó al final del documento una matriz de 7 filas (candidatos) × 14 columnas:

- GPT-4o / equivalente (Cloud)
- Gemini 1.5 Pro / equivalente (Cloud)
- Claude 3 / equivalente (Cloud)
- Llama 3 / equivalente (Local)
- Qwen-VL / MiniCPM-V / equivalente (Local)
- LLaVA / equivalente (Local)
- Otro candidato (experto)

Columnas: Tipo | Procesa PDF directo | Procesa imágenes | DOCX/XLSX o equiv. | Structured output | Evidencia por campo | Soberanía | On-prem viable | Límite contexto/doc | Costo est. | Latencia | Riesgo | Prioridad eval. | Observaciones

Valores pre-llenados donde se conocen (ej. multimodalidad, soberanía cloud vs local). Resto marcado TBD para que el experto complete durante la sesión.

---

## 7. Insumos esperados del experto (Sección 2)

Se agregaron 7 categorías de insumos mínimos:

1. **Top N preliminar de modelos candidatos** — cloud, on-premise, fallback ligero
2. **Matriz comparativa preliminar de modelos** — plantilla para diligenciar en sesión
3. **Estrategia preliminar por tipo de documento** — tabla de 7 tipos documentales
4. **Criterios de activación de OCR fallback** — cuándo activar, evitar, medir, reconciliar
5. **Criterios de evaluación de calidad** — métricas, umbrales, revisión humana, quality_score
6. **Criterios de soberanía de datos** — modelos/proveedores viables, contratos, on-premise
7. **Criterios post-MVP y ruta de evaluación** — NER, fine-tuning, volumen mínimo, pruebas

---

## 8. Resultado de validación Chrome DevTools MCP

- **Página cargada:** `http://localhost:8080/preguntasexperto.html` — HTTP 200 ✓
- **CSS:** `assets/css/styles.css` — HTTP 304 ✓
- **JS:** `app.js`, `markdown-loader.js`, `page-shell.js` — HTTP 200 ✓
- **site-shell.html:** HTTP 200 ✓
- **Markdown activo:** `content/preguntas-experto.md` — HTTP 200 ✓
- **Errores JS:** ninguno ✓
- **404 esperados:** `favicon.ico` únicamente (no afecta funcionalidad)
- **Título renderizado:** "Guía exploratoria para experto en modelos — Document Intelligence Engine MultiTenant" ✓
- **Badges:** "18 insumos exploratorios · ~3h 30min" + "Orientación preliminar · no selección final de modelos" ✓
- **Aclaración importante:** visible al inicio del contenido ✓
- **Tabla proyección:** columnas "Tipo", "Grupo", "Tiempo est.", "Resultado esperado" ✓
- **Matriz comparativa:** renderiza con scroll horizontal ✓
- **Navegación interna:** sidebar derecho muestra §1, §2, §2.1, §2.2, §2.3, grupos A-E, Matriz ✓
- **Navegación prev/next:** visible al final ✓

---

## 9. Búsqueda final de consistencia

| Patrón buscado | Resultado | Acción |
|---|---|---|
| `¿El modelo puede` | 0 ocurrencias en doc activo | ✓ Eliminado |
| `¿Es posible` | 0 ocurrencias en doc activo | ✓ Eliminado |
| `selección final` | 4 ocurrencias — todas en contexto de negar que sea el objetivo | ✓ Correcto |
| `veredicto definitivo` | 1 ocurrencia — en contexto "No se pide un veredicto definitivo" | ✓ Correcto |
| `OCR obligatorio` / `OCR principal` | 0 ocurrencias | ✓ Correcto |
| `chat` / `RAG conversacional` | 0 ocurrencias (sólo "no es un chat ni un sistema RAG") | ✓ Correcto |
| `NER en MVP` / `fine-tuning en MVP` | 0 ocurrencias (ambos marcados explícitamente como post-MVP) | ✓ Correcto |

---

## 10. Pendientes y decisiones abiertas

1. **Versiones específicas de modelos:** La matriz usa denominaciones como "GPT-4o / equivalente" para evitar hardcodear versiones. El experto deberá actualizar con versiones vigentes al momento de la sesión.
2. **Valores TBD de la matriz:** El experto debe completar los campos durante la sesión. El equipo puede pre-poblar algunos antes de la sesión basado en documentación pública.
3. **Estrategia de partición para documentos largos:** definida como "alto riesgo" en la tabla de estrategia por tipo. Requiere diseño antes del piloto.
4. **Sesión en dos partes:** La sugerencia de dos sesiones de 1h 45min puede requerir ajuste dependiendo de disponibilidad del experto.
5. **Consistencia en `arquitectura-tobe.md`:** La sección "Análisis técnico TO-BE" (ya existente) documenta las decisiones de arquitectura que fueron removidas del documento de preguntas. Ambos documentos son complementarios y deben revisarse en conjunto.
