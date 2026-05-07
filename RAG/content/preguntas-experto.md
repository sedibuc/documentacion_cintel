# Consulta al experto en modelos NER

<div class="badge-row">
<span class="badge">Contexto: TO-BE NER</span>
<span class="badge">Destinatario: experto en modelos</span>
<span class="badge">Pre-resueltas: 8 · Abiertas: 5</span>
</div>

## Resumen ejecutivo

Este documento transforma el esquema original de investigación abierta en una **consulta estructurada de validación técnica**. El equipo ha elaborado propuestas iniciales razonables para los ítems que pueden resolverse desde estándares de industria, benchmarks conocidos y la arquitectura definida en el TO-BE. El experto dedica su tiempo únicamente donde existe incertidumbre crítica que no puede inferirse sin experiencia empírica directa.

| Concepto | Valor |
|---|---|
| Bloque 1 — Validación rápida de propuestas pre-resueltas | 8 ítems |
| Bloque 2 — Análisis especializado de preguntas abiertas | 5 preguntas |

> Las propuestas del Bloque 1 son **baselines técnicos iniciales**, no decisiones finales. El experto puede aprobar, rechazar o ajustar cada una. Las preguntas del Bloque 2 no tienen propuesta previa porque dependen de criterio empírico no inferible.

---

## Bloque 1 — Propuestas pre-resueltas para validación rápida

El equipo propone un baseline técnico para cada ítem. El experto revisa y responde: **Sí / No / Ajustar**.

---

### B1-1 — Motor OCR y política de aceptación de documentos

**Pregunta**: ¿Qué motor OCR usar según el tipo de documento y en qué umbral de calidad rechazar un documento sin pasar al NER?

**Propuesta técnica del equipo**

- **PDF nativo con capa de texto**: extracción directa con PyMuPDF (sin OCR). Costo cero de inferencia OCR.
- **PDF escaneado o imagen**: Google Document AI como motor cloud principal para el MVP. Ofrece coordenadas de bloque (bounding boxes), confianza por token y soporte nativo para documentos colombianos multi-resolución. Tesseract como alternativa local de respaldo si el presupuesto no admite cloud.
- **Preprocesamiento mínimo recomendado**: deskew automático + binarización adaptativa antes de enviar al OCR en documentos escaneados.
- **Política de aceptación**: confianza OCR promedio < 0.6 → documento marcado como `ERROR` con código `OCR_QUALITY_LOW` sin pasar al NER. Confianza entre 0.6 y 0.8 → procesado con advertencia visible en el resultado.

**Justificación resumida**: Google Document AI tiene el mejor desempeño documentado en formularios y documentos legales en español con layouts heterogéneos, preserva la posición de bloques necesaria si P2 deriva a layout-aware, y opera sobre HTTPS sin infraestructura adicional en el MVP. PyMuPDF para nativos elimina costo OCR en el escenario más frecuente (certificados digitales de la SNR).

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la propuesta
- [ ] No, propongo otro motor o política
- [ ] Ajustar parcialmente — comentario:

---

### B1-2 — Arquitectura base del modelo NER supervisado

**Pregunta**: ¿Qué arquitectura y modelo base de NER supervisado usar para el piloto con documentos legales en español?

**Propuesta técnica del equipo**

- **Modelo base**: `dccuchile/bert-base-spanish-wwm-cased` con capa de clasificación de tokens fine-tuned para NER de dominio.
- **Razón**: es el modelo BERT más adoptado para español en tareas NER legales/administrativas, tiene benchmarks publicados en español y está disponible en Hugging Face sin restricciones de licencia comercial.
- **Operación en MVP**: CPU (4 vCPU, 16 GB RAM). Throughput estimado: 30–60 documentos/hora en batch asíncrono con documentos de 2–5 páginas. GPU solo si el volumen del piloto supera 500 documentos/día de forma sostenida.
- **Alternativa a evaluar si el experto rechaza**: `PlanTL-GOB-ES/roberta-base-bne` — mayor precisión en texto jurídico, mayor latencia.

**Justificación resumida**: El procesamiento es batch, no tiempo real. La latencia de CPU (2–5 s/documento) es aceptable para el volumen piloto. El modelo BERT en español tiene la mayor base de referencia para comparación de resultados y facilita la transición del equipo de desarrollo. GPU se reserva para escalar, no para iniciar.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la propuesta
- [ ] No, propongo otra arquitectura
- [ ] Ajustar parcialmente — comentario:

---

### B1-3 — Formato de anotación y herramienta para el corpus

**Pregunta**: ¿En qué formato anotar las entidades del corpus, con qué herramienta y qué nivel de acuerdo entre anotadores es aceptable?

**Propuesta técnica del equipo**

- **Formato de etiquetado**: BIO (Beginning-Inside-Outside). BIOES añade precisión para entidades de un solo token, pero incrementa la complejidad de las guías de anotación y el tiempo de formación de anotadores. Para el piloto con 3 tipos documentales y equipo pequeño, BIO es suficiente y más fácil de mantener.
- **Herramienta**: Label Studio (open source, auto-hospedado). Permite importar PDFs, exportar en CoNLL-2003 y JSONL, y soporta flujos multi-anotador con cálculo de IAA integrado.
- **Control de calidad**: inter-annotator agreement con Cohen's Kappa ≥ 0.80 antes de incluir documentos al corpus de entrenamiento. Documentos con Kappa < 0.80 pasan a revisión de árbitro.
- **Casos límite definidos**: entidad ausente → no se anota (el modelo aprende a no extraer); entidad en tabla → se anota la celda como span completo; entidad parcial (e.g., año sin mes) → se anota lo disponible con etiqueta `_PARCIAL` en el nombre.

**Justificación resumida**: BIO + Label Studio es la combinación más adoptada en proyectos NER de dominio con presupuesto controlado. Cohen's Kappa ≥ 0.80 es el estándar de referencia en NLP para considerar un corpus confiable. Label Studio elimina la necesidad de infraestructura de anotación propietaria.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la propuesta
- [ ] No, propongo otro formato o herramienta
- [ ] Ajustar parcialmente — comentario:

---

### B1-4 — Estrategia de segmentación documental

**Pregunta**: ¿Cómo dividir documentos de múltiples páginas para alimentar el modelo NER respetando el límite de tokens de BERT?

**Propuesta técnica del equipo**

- **Unidad de procesamiento NER**: página individual. Cada página se procesa como una secuencia independiente. El modelo recibe el texto de una página a la vez.
- **Manejo de límite de tokens**: si una página supera 512 tokens (límite de BERT), se aplica ventana deslizante con solapamiento de 64 tokens entre ventanas. Las entidades detectadas en el solapamiento se deduplicaban por posición de carácter.
- **Tablas**: extraídas como texto linealizado antes de pasar al NER (fila por fila, celda separada por `|`). No se usa detección estructural de tabla en el MVP.
- **Trazabilidad**: cada entidad extraída lleva metadato de `página_origen` y `posición_carácter` en el resultado JSON.

**Justificación resumida**: La segmentación por página es el balance estándar entre contexto disponible y gestión de tokens. El solapamiento de 64 tokens preserva el contexto en fronteras de ventana. La linealización de tablas es compatible con NER textual y no requiere infraestructura adicional en el MVP.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la propuesta
- [ ] No, propongo otra estrategia de segmentación
- [ ] Ajustar parcialmente — comentario:

---

### B1-5 — Score de confianza y estrategia de fallback por entidad

**Pregunta**: ¿Qué umbrales de confianza definen cuándo aceptar, marcar como pendiente o descartar una entidad extraída, y qué hacer cuando el modelo supervisado falla?

**Propuesta técnica del equipo**

- **Fuente de confianza**: score softmax promedio de los tokens que componen cada entidad detectada. Exportado como campo `confianza` (0.0–1.0) por entidad en el JSON de salida.
- **Umbrales de decisión**:
  - `confianza ≥ 0.75` → entidad aceptada, incluida en el resultado.
  - `0.50 ≤ confianza < 0.75` → entidad en `PENDIENTE` con flag `BAJA_CONFIANZA`. Se incluye el valor extraído como referencia pero no como dato confirmado.
  - `confianza < 0.50` → campo marcado como no extraído (`PENDIENTE`), sin valor sugerido.
- **Fallback**: si el NER supervisado no detecta una entidad requerida (campo obligatorio del esquema) con confianza aceptable, se lanza automáticamente un reintento con NER zero-shot/LLM. Si el reintento tampoco produce resultado, el campo pasa a `ERROR` con código `ENTITY_NOT_FOUND`.

**Justificación resumida**: El umbral 0.75 es conservador y coherente con la criticidad de documentos legales. El rango de baja confianza (0.50–0.75) preserva información útil sin afirmarla como válida. El fallback a zero-shot/LLM protege el flujo de comparación cruzada sin detener el lote.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con umbrales y fallback
- [ ] No, propongo umbrales distintos
- [ ] Ajustar parcialmente — comentario:

---

### B1-6 — Normalización de entidades antes de la comparación cruzada

**Pregunta**: ¿Cómo normalizar cada tipo de entidad extraída para que la comparación cruzada entre documentos no genere falsos `MISMATCH` por diferencias de formato?

**Propuesta técnica del equipo**

| Tipo de entidad | Normalización propuesta | Comparación |
|---|---|---|
| Fechas | ISO 8601 (`YYYY-MM-DD`). Parser: `dateparser` con locale `es_CO`. | Exact match |
| Montos y valores | Eliminar símbolo `$`, separadores de miles (`.`) y espacios. Resultado: entero o decimal con `.` como separador. | Exact match numérico |
| Matrículas inmobiliarias | Formato canónico `NNN-NNNNNNN` sin espacios adicionales. | Exact match |
| Nombres de personas | Unicode normalizado (NFC), mayúsculas, sin artículos iniciales. | Fuzzy match (Levenshtein ≤ 2) |
| NIT / Cédula | Solo dígitos, sin guiones ni puntos. | Exact match |
| Vigencias y plazos | Convertidos a días enteros desde fecha base. | Exact match numérico |

- Fuzzy match aplicado **únicamente** a nombres de persona, con umbral de distancia Levenshtein ≤ 2 para tolerar variaciones tipográficas menores.
- Todos los demás tipos: exact match sobre valor normalizado.

**Justificación resumida**: Exact match sobre valor normalizado elimina la mayoría de falsos `MISMATCH` sin introducir ambigüedad. Fuzzy match acotado a nombres es el único caso donde la variación ortográfica es estructural (tildes, partículas, orden). La librería `dateparser` maneja correctamente los formatos de fecha en español colombiano.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la estrategia de normalización
- [ ] No, propongo otra estrategia
- [ ] Ajustar parcialmente — comentario:

---

### B1-7 — Versionado de modelos y trazabilidad de resultados

**Pregunta**: ¿Qué esquema de versionado usar para los modelos NER y cómo garantizar que cada resultado de extracción sea trazable al modelo que lo produjo?

**Propuesta técnica del equipo**

- **Esquema de versión**: `{tipo_documental}_v{major}.{minor}.{patch}`. Ejemplo: `certificado_tradicion_v1.2.0`. `major` cambia ante redefinición del esquema de entidades; `minor` ante reentrenamiento significativo; `patch` ante ajustes de hiperparámetros.
- **Artefactos versionados**: pesos del modelo (carpeta Hugging Face), esquema de entidades (JSON), configuración de entrenamiento (YAML), métricas de evaluación (JSON con F1 por entidad).
- **Almacenamiento**: DVC sobre repositorio Git existente, o carpeta versionada en el almacenamiento del servidor si DVC no está disponible en el MVP.
- **Trazabilidad en resultados**: cada resultado de extracción incluye campo `modelo_version` en el JSON de salida. El historial de lotes en PostgreSQL almacena `modelo_version` junto al ID de lote.
- **Rollback**: recargar el modelo de la versión anterior y re-procesar el lote afectado. La versión anterior permanece disponible hasta que la nueva supera 7 días en producción sin alertas.

**Justificación resumida**: El esquema semver es inmediatamente comprensible para el equipo. La trazabilidad `modelo_version` en resultados responde directamente a la auditabilidad requerida para tipos documentales con consecuencias legales. La política de retención de 7 días da margen de rollback sin acumular modelos indefinidamente.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con la estrategia de versionado
- [ ] No, propongo otro esquema
- [ ] Ajustar parcialmente — comentario:

---

### B1-8 — Instrumentación del pipeline para observabilidad operativa

**Pregunta**: ¿Qué métricas registrar por ejecución y qué umbrales de alerta configurar para detectar degradación del modelo antes de que afecte la operación?

**Propuesta técnica del equipo**

Métricas a registrar en PostgreSQL por cada ejecución de documento dentro de un lote:

| Métrica | Granularidad | Tipo |
|---|---|---|
| `latencia_ocr_ms` | Por documento | Numérico |
| `latencia_ner_ms` | Por documento | Numérico |
| `entidades_detectadas` | Por documento | Entero |
| `entidades_esperadas` | Por documento | Entero |
| `tasa_pendiente` | Por documento | Float (0–1) |
| `confianza_promedio` | Por documento | Float (0–1) |
| `estado_final` | Por documento | Enum: OK / WARN / ERROR |

Métricas de alerta a nivel de lote:
- `tasa_pendiente` del lote > línea base del tipo + 20 % → alerta de revisión de modelo.
- `tasa_error` del lote > 10 % → alerta de revisión de infraestructura.
- `confianza_promedio` del lote < 0.65 → alerta de posible degradación.

Canales de alerta para MVP: registro en tabla `alertas` de PostgreSQL + log estructurado. Notificaciones externas (webhook, correo) marcadas como evolución futura.

**Justificación resumida**: Las métricas propuestas son las mínimas necesarias para detectar degradación (señal de P-abierta-4) y diagnosticar fallos sin revisar cada documento. Almacenar en PostgreSQL reutiliza la infraestructura existente del sistema y no requiere stack de observabilidad dedicado para el MVP.

**Validación del experto**
- [ ] Sí, estoy de acuerdo con el esquema de instrumentación
- [ ] No, propongo otro esquema de métricas
- [ ] Ajustar parcialmente — comentario:

---

## Bloque 2 — Preguntas abiertas que requieren criterio especializado

Estas preguntas no tienen propuesta previa porque dependen de experiencia empírica en datasets similares, conocimiento de la operación real del dominio legal colombiano, o trade-offs que el equipo no puede resolver sin referencia de casos reales. Se mantienen abiertas y enfocadas.

---

### A1 — ¿NER textual puro es suficiente para el certificado de tradición y libertad?

**Contexto**: El certificado de tradición y libertad varía estructuralmente según la Oficina de Registro que lo emite. La matrícula inmobiliaria, los gravámenes y las anotaciones pueden aparecer en posiciones de página distintas, dentro de tablas con diagramaciones variables, o en texto continuo según la versión del formulario SNR. Un NER textual puro (sobre texto OCR linealizado) puede fallar cuando la posición relativa del campo es determinante para desambiguar la entidad —por ejemplo, el mismo número puede ser matrícula o folio según dónde aparece en la página. La respuesta condiciona la arquitectura completa del pipeline: si se necesita layout-aware, el OCR debe entregar bounding boxes, la arquitectura del modelo cambia (LayoutLM v3, LiLT), y el esfuerzo de implementación aumenta significativamente.

**Respuesta esperada**: Evaluación basada en experiencia con documentos reales similares. ¿Puede un NER textual con contexto de ventana ampliada desambiguar correctamente las entidades del certificado de tradición? ¿O la variabilidad posicional hace inviable el enfoque textual para alcanzar precisión de producción? Si recomienda layout-aware: indicar si el esfuerzo incremental es viable dentro de un MVP y cuál es la arquitectura mínima viable (LayoutLM v3 base vs. fine-tuned vs. Donut).

---

### A2 — ¿Cuántos documentos anotados se necesitan para alcanzar el umbral BETA?

**Contexto**: El proceso de entrenamiento parte de cero para los tres tipos del piloto. El equipo necesita saber cuántos documentos reales deben recolectarse y anotarse antes de iniciar el entrenamiento, para planificar el tiempo de anotación (que es el cuello de botella del piloto) y dimensionar el esfuerzo de preparación del corpus. Los tres tipos tienen distinta complejidad de esquema: el certificado de tradición tiene 7 campos clave con alta variabilidad posicional; el contrato de obra tiene 6 campos con redacción libre; la póliza HSE tiene 5 campos con formatos relativamente estandarizados. La respuesta impacta directamente el cronograma del piloto.

**Respuesta esperada**: Número mínimo de documentos anotados recomendado para arrancar el entrenamiento y obtener un modelo que pueda ser validado como BETA (no necesariamente con calidad de producción). Indicar si la recomendación varía significativamente entre los tres tipos del piloto. Si existen benchmarks publicados en dominios similares (documentos legales, formularios gubernamentales en español), referenciarlos como base.

---

### A3 — ¿Qué umbrales de F1 definen BETA y PRODUCCIÓN para documentos con consecuencias legales?

**Contexto**: El TO-BE establece que PRODUCCIÓN implica "garantía de precisión validada", pero no cuantifica el umbral. Para el certificado de tradición y libertad, un error en `PROPIETARIO_ACTUAL` o en `GRAVAMENES` tiene consecuencias patrimoniales directas. Para un contrato de obra, un error en `VALOR` tiene consecuencias contractuales. El umbral aceptable no es el mismo que para un formulario administrativo de bajo riesgo, y el equipo no tiene criterio para fijar ese número sin referencia de operación real en documentos similares.

**Respuesta esperada**: F1 mínimo por entidad recomendado para la transición EN DESARROLLO → BETA y BETA → PRODUCCIÓN, diferenciado por nivel de riesgo (entidades con consecuencias patrimoniales vs. entidades descriptivas). Indicación de si el umbral aplica por entidad individual o como promedio ponderado del tipo. Recomendación sobre el tamaño mínimo del conjunto de evaluación para que el F1 sea estadísticamente representativo.

---

### A4 — ¿Qué señales de degradación son observables en producción real con documentos legales colombianos?

**Contexto**: El equipo propone como señales proxy la tasa de `PENDIENTE`, la tasa de `MISMATCH` en comparación cruzada y la confianza promedio (Bloque 1, ítem B1-8). Sin embargo, en producción real pueden existir patrones de degradación no capturados por estas métricas: por ejemplo, una entidad específica que empieza a fallar sistemáticamente mientras el promedio del lote sigue siendo aceptable, o una degradación estacional ligada a cambios en los formularios SNR o en los formatos notariales. El equipo necesita saber si las señales propuestas son suficientes o si existen señales adicionales críticas que la experiencia indica monitorear.

**Respuesta esperada**: Validación de si las tres señales proxy propuestas son suficientes para detectar degradación en producción con documentos legales colombianos, o si se deben agregar señales adicionales. Si existen patrones de degradación específicos del dominio (formularios SNR, cambios normativos, variaciones regionales), describirlos para incorporarlos al diseño del sistema de alertas. Criterio sobre la frecuencia de revisión manual recomendada en ausencia de alertas activas.

---

### A5 — ¿A partir de qué escala el throughput de CPU resulta insuficiente y el costo OCR cloud se vuelve un cuello de botella?

**Contexto**: El equipo estima throughput de 30–60 documentos/hora en CPU (4 vCPU, 16 GB RAM) para el modelo BERT propuesto (B1-2), con Google Document AI como motor OCR cloud para documentos escaneados a un costo aproximado de USD 1.50 por 1.000 páginas. El equipo no dispone de referencia empírica para saber a partir de qué volumen diario esta combinación deja de ser viable operativamente, ni qué señales técnicas indican que la GPU es necesaria desde el arranque y no como decisión de escalado posterior.

**Respuesta esperada**: Basándose en experiencia con implementaciones NER similares en producción (no en el piloto específico, cuyo volumen no está definido): ¿a partir de qué volumen diario el throughput de CPU de 30–60 docs/hora genera un backlog operativamente inaceptable? ¿Existe alguna característica del tipo documental —longitud, densidad de entidades, variabilidad de layout— que haga que el CPU sea insuficiente independientemente del volumen? ¿El costo por página de OCR cloud es el factor limitante habitual en pilotos de este tipo, o suele quedar absorbido por otros costos?

---

## Tabla de respuesta

Se solicita al experto completar la columna **Estimación** con el tiempo que considera necesario para analizar y responder cada pregunta, y enviar la tabla completa por correo electrónico a **mcubides@cintel.org.co** con copia a **drodriguez@cintel.org.co** para su aceptación.

| Tipo de pregunta | Pregunta | Estimación |
|---|---|---|
| Pre-Resuelta | ¿Qué motor OCR usar según el tipo de documento y en qué umbral de calidad rechazar un documento sin pasar al NER? | |
| Pre-Resuelta | ¿Qué arquitectura y modelo base de NER supervisado usar para el piloto con documentos legales en español? | |
| Pre-Resuelta | ¿En qué formato anotar las entidades del corpus, con qué herramienta y qué nivel de acuerdo entre anotadores es aceptable? | |
| Pre-Resuelta | ¿Cómo dividir documentos de múltiples páginas para alimentar el modelo NER respetando el límite de tokens de BERT? | |
| Pre-Resuelta | ¿Qué umbrales de confianza definen cuándo aceptar, marcar como pendiente o descartar una entidad extraída, y qué hacer cuando el modelo supervisado falla? | |
| Pre-Resuelta | ¿Cómo normalizar cada tipo de entidad extraída para que la comparación cruzada entre documentos no genere falsos MISMATCH por diferencias de formato? | |
| Pre-Resuelta | ¿Qué esquema de versionado usar para los modelos NER y cómo garantizar que cada resultado de extracción sea trazable al modelo que lo produjo? | |
| Pre-Resuelta | ¿Qué métricas registrar por ejecución y qué umbrales de alerta configurar para detectar degradación del modelo antes de que afecte la operación? | |
| Abierta | ¿NER textual puro es suficiente para el certificado de tradición y libertad, o la variabilidad posicional hace necesario un enfoque layout-aware? | |
| Abierta | ¿Cuántos documentos anotados se necesitan para arrancar el entrenamiento y obtener un modelo que pueda ser validado como BETA? | |
| Abierta | ¿Qué umbrales de F1 definen las transiciones EN DESARROLLO → BETA y BETA → PRODUCCIÓN para documentos con consecuencias legales? | |
| Abierta | ¿Qué señales de degradación son observables en producción real con documentos legales colombianos, más allá de las métricas proxy propuestas? | |
| Abierta | ¿A partir de qué escala el throughput de CPU resulta insuficiente y el costo OCR cloud se vuelve un cuello de botella operativo? | |
