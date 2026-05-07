# TO-BE funcional — Agente de procesamiento documental

<div class="badge-row">
<span class="badge">Pivot validado: 2026-04</span>
<span class="badge">Sector piloto: construcción</span>
<span class="badge">Formatos base: JSON · CSV</span>
<span class="badge">REST · FTP · Lotes</span>
<span class="badge">Extracción: NER supervisado · NER zero-shot</span>
</div>

Este documento describe el TO-BE funcional de la iniciativa después del pivot estratégico validado en las reuniones de alineación. El sistema es un **agente especializado de procesamiento documental basado en NER (Named Entity Recognition)**: recibe documentos tipados, aplica modelos de reconocimiento de entidades nombradas para extraer campos de dominio específico, valida los resultados contra fuentes de referencia y expone los resultados por API REST. El RAG conversacional queda **fuera del alcance funcional del producto**.

---

## Objetivo funcional del sistema

### Qué problema resuelve

Las organizaciones que operan con grandes volúmenes de documentos tipados —certificados, contratos, pólizas, documentos HSE— invierten tiempo manual en extraer datos, contrastarlos contra fuentes de referencia y producir reportes operativos. Este proceso es lento, propenso a errores y difícil de escalar.

El sistema resuelve ese problema convirtiendo documentos tipados en **datos estructurados y comparables**, de forma automatizada, con salida directamente consumible por operación.

### Quién lo usa

- **Operadores documentales** en empresas del sector construcción, legal o inmobiliario.
- **Administradores de procesos** que necesitan resultados consolidados por lote.
- **Equipos de auditoría o cumplimiento** que validan datos contra fuentes de referencia.
- **Equipos de integración** que consumen resultados vía API REST desde sistemas externos.

### Qué entradas recibe

- Documentos tipados en PDF o imagen, cargados manualmente o leídos desde servidor FTP del cliente.
- Tipo documental configurado con el esquema de campos a extraer.
- Archivo de referencia en CSV o JSON para comparación cruzada (cuando aplique).
- Formato de salida deseado: JSON o CSV.

### Qué procesamiento realiza

1. **OCR**: conversión del PDF o imagen a texto plano con preservación de estructura posicional.
2. **NER — Reconocimiento de entidades**: el modelo identifica y clasifica spans de texto como entidades de dominio según el esquema del tipo documental (p. ej. `MATRICULA_INMOBILIARIA`, `PROPIETARIO`, `FECHA_EXPEDICION`, `VALOR_CONTRATO`).
3. **Mapeo al esquema**: las entidades detectadas se alinean con los campos configurados en el tipo documental; los campos sin entidad detectada se marcan explícitamente como no extraídos.
4. **Validación de completitud**: campos extraídos vs. campos esperados del esquema.
5. **Comparación cruzada** contra una fuente de referencia, campo a campo.
6. **Clasificación de resultados** por estado: `MATCH`, `MISMATCH`, `PENDIENTE`, `ERROR`.
7. **Consolidación por lote**: agrupación de ejecuciones bajo un ID único de lote.
8. **Persistencia del historial** de lotes para consulta y descarga posterior.

### Pipeline técnico NER

```
PDF / Imagen
    ↓
OCR  (texto plano + posición de bloques)
    ↓
Modelo NER  (entidades de dominio según tipo documental)
    ↓
Mapeo al esquema  (entidad → campo configurado)
    ↓
Validación de completitud
    ↓
Comparación cruzada (opcional, si hay fuente de referencia)
    ↓
JSON / CSV estructurado
```

La técnica NER se aplica en dos modalidades según el tipo documental:

- **NER supervisado**: modelo entrenado con corpus anotado del tipo documental. Alta precisión en entidades de dominio específico que no existen en datasets genéricos (p. ej. matrícula inmobiliaria colombiana).
- **NER zero-shot / LLM**: el esquema del tipo documental se entrega como prompt al LLM, que extrae entidades sin entrenamiento previo. Menor esfuerzo de configuración, precisión variable.

### Qué salidas entrega

- Resultado estructurado por documento en JSON o CSV.
- Reporte de comparación con columna de estado por campo y registro.
- Resumen estadístico del lote (total, completados, errores, tiempo de procesamiento).
- Historial de lotes consultable y descargable.
- Respuesta JSON por API REST (procesamiento individual, batch y comparación).

### Cómo se integra con el ecosistema del cliente

El sistema opera como una **capa de procesamiento documental** que se integra con los sistemas existentes:

- Acepta documentos desde **servidor FTP del cliente** (sin carga manual) o por carga directa.
- Expone resultados por **API REST** en JSON, consumible desde ERP, BI, Power Automate, Google Apps Script u otros sistemas.
- Los resultados en JSON o CSV son directamente importables en herramientas de análisis (Excel, Google Sheets, BI).
- Las integraciones con Copilot Studio o Vertex AI Agents se marcan como **evolución futura planificada**, no como capacidades del MVP.

> El valor principal **no es buscar ni resumir documentos**. El valor es convertir documentos tipados en datos estructurados, validados y consumibles por operación.

---

## Módulo administrativo de tipos documentales

Cada tipo de documento que el sistema puede procesar requiere un proceso de configuración y entrenamiento previo. Este módulo es gestionado por el equipo administrador del sistema, no por los operadores de empresa.

### Funcionalidad del módulo

- Crear un nuevo tipo documental con nombre, descripción y sector.
- Definir los campos a extraer (nombre, tipo de dato, requerido o no).
- Subir documentos de entrenamiento reales (mínimo requerido según el tipo).
- Configurar el esquema de salida: JSON, CSV o ambos.
- Definir la **modalidad de extracción**: tipo entrenado o tipo basado en LLM.
- Cambiar el estado del tipo documental entre ciclos de validación.

### Proceso de entrenamiento del modelo NER

1. Carga de múltiples documentos reales representativos del tipo (corpus de entrenamiento).
2. **Anotación de entidades**: marcado manual de spans de texto con la etiqueta de entidad correspondiente al esquema del tipo, en formato BIO o BIOES (p. ej. `B-MATRICULA`, `I-MATRICULA`, `B-PROPIETARIO`).
3. **Entrenamiento del modelo NER** sobre el corpus anotado.
4. **Evaluación de métricas**: precisión, recall y F1 por tipo de entidad sobre conjunto de validación.
5. Ajuste iterativo por parte del equipo hasta alcanzar el umbral de precisión definido por estado.
6. Promoción del tipo al siguiente estado (de EN DESARROLLO a BETA o a PRODUCCIÓN).

> Todo nuevo tipo documental requiere corpus anotado y modelo NER validado antes de estar disponible para empresas. No es posible activar un tipo documental sin haber completado el ciclo de anotación, entrenamiento y evaluación.

### Estados del tipo documental

| Estado | Visibilidad | Garantía de precisión | Uso recomendado |
|---|---|---|---|
| **EN DESARROLLO** | No visible para empresas | Sin garantía | Entrenamiento interno del sistema |
| **BETA** | Visible con advertencia de riesgo | Sin garantía | Validación piloto con empresas seleccionadas |
| **PRODUCCIÓN** | Visible y recomendado | Validado | Operación regular y confiable |

### Modalidad NER: supervisado vs. zero-shot

Cada tipo documental tiene asignada una modalidad de extracción NER:

| Propiedad | NER supervisado (entrenado) | NER zero-shot / LLM |
|---|---|---|
| Técnica base | Modelo fine-tuned (SpaCy, BERT, RoBERTa) | LLM con prompt de esquema (zero-shot o few-shot) |
| Precisión | Alta y estable por tipo de entidad | Variable; sensible a redacción y layout |
| Dataset requerido | Sí — corpus anotado en formato BIO/BIOES | No (o mínimo para few-shot) |
| Entidades de dominio | Excelente — aprende patrones específicos del tipo | Limitado — depende del conocimiento previo del LLM |
| Costo de construcción | Mayor — anotación + entrenamiento + evaluación | Menor — configuración de prompt y esquema |
| Velocidad de configuración | Más lenta | Más rápida |
| Uso recomendado | Operación en producción con volumen alto | Exploración, validación inicial y tipos de bajo volumen |

---

## Tipos documentales del piloto

### PRODUCCIÓN (disponible para operación)

| Tipo documental | Campos clave | Estado |
|---|---|---|
| Certificado de tradición y libertad | Matrícula inmobiliaria, propietario actual, área, gravámenes, anotaciones, municipio, fecha de expedición | ✅ PRODUCCIÓN |

### BETA (disponible con advertencia)

| Tipo documental | Campos clave | Estado |
|---|---|---|
| Contrato de obra | Partes, objeto, valor, plazo, garantías, firma | ⚠️ BETA |

### EN DESARROLLO (solo uso interno)

| Tipo documental | Campos clave | Estado |
|---|---|---|
| Póliza de seguro HSE | Asegurado, vigencia, coberturas, valor asegurado, beneficiarios | 🔧 EN DESARROLLO |

---

## Integración por FTP

El sistema permite leer documentos directamente desde el servidor FTP del cliente, eliminando la necesidad de carga manual cuando el volumen es alto o el proceso es automatizado.

### Configuración de la conexión FTP

- Host del servidor FTP.
- Puerto (por defecto 21 o 22 para SFTP).
- Credenciales de acceso (usuario y contraseña).
- Carpeta raíz de lectura en el servidor.
- Frecuencia de sondeo (manual bajo demanda o automática).

### Uso en procesamiento

- El operador puede seleccionar **origen FTP** al configurar un lote.
- El sistema lista los archivos disponibles en la carpeta configurada.
- El operador selecciona los archivos a procesar o procesa toda la carpeta.
- Los resultados se generan y persisten en el sistema igual que en carga manual.

---

## Servicios REST

El sistema expone tres servicios REST en JSON para integración con sistemas externos. Todos los endpoints requieren autenticación por API key.

### Servicio 1 — Procesamiento individual

**POST** `/api/v1/documentos/procesar`

- **Entrada**: documento (multipart/form-data o URL / ruta FTP) + tipo documental + formato de salida.
- **Salida**: JSON estructurado con los campos extraídos, estado de completitud e ID de ejecución.

### Servicio 2 — Procesamiento batch

**POST** `/api/v1/lotes/procesar`

- **Entrada**: múltiples documentos (multipart, URLs o ruta FTP) + tipo documental + nombre de lote + formato de salida.
- **Salida**: ID de lote generado. Los resultados se consultan de forma asíncrona por ID de lote.

**GET** `/api/v1/lotes/{id}`

- **Salida**: estado del lote, progreso, resultados individuales por documento.

### Servicio 3 — Comparación cruzada

**POST** `/api/v1/comparacion/ejecutar`

- **Entrada**: ID de lote de extracción ya ejecutado + archivo de referencia (CSV o JSON).
- **Salida**: reporte de comparación con estado `MATCH`, `MISMATCH`, `PENDIENTE` o `ERROR` por campo y registro.

> Los servicios son REST/JSON. **No se expone SOAP ni XML**. El protocolo FTP se usa exclusivamente como canal de entrada de documentos, no como protocolo de integración de resultados.

---

## Flujos funcionales TO-BE

Los diagramas representan los flujos operativos del sistema actualizados. Incluyen FTP como origen de documentos, el proceso de entrenamiento previo y los servicios REST como canal de exposición.

### Flujo 1 — Onboarding funcional de empresa

El administrador registra la empresa, configura su perfil, establece la conexión FTP opcional y habilita los tipos documentales disponibles para esa organización.

![Flujo de onboarding funcional de empresa](assets/img/diagramas/tobefuncional/flujo-onboarding.png)

### Flujo 2 — Extracción estructurada de documentos

El operador selecciona el tipo documental, elige el origen (carga manual o FTP), configura el formato de salida y ejecuta la extracción. El agente procesa el documento y devuelve los campos definidos en el esquema.

![Flujo de extracción estructurada de documentos](assets/img/diagramas/tobefuncional/flujo-extraccion.png)

Los campos no encontrados se marcan explícitamente como no extraídos. No hay respuesta en lenguaje natural ni interacción conversacional.

### Flujo 3 — Comparación y validación cruzada

El operador carga una fuente de referencia (CSV o JSON) y ejecuta la comparación contra los resultados de extracción. El sistema clasifica cada campo como `MATCH`, `MISMATCH` o `PENDIENTE`.

![Flujo de comparación y validación cruzada](assets/img/diagramas/tobefuncional/flujo-comparacion.png)

### Flujo 4 — Procesamiento por lotes e historial

El operador define el lote (nombre, tipo documental, formato de salida), elige el origen de los documentos (carga manual o FTP) y ejecuta. El sistema procesa en paralelo, asigna ID de lote y persiste el historial.

![Flujo de procesamiento por lotes e historial](assets/img/diagramas/tobefuncional/flujo-lotes.png)

### Flujo 5 — Consulta y descarga de resultados

El operador accede al historial, selecciona un lote y descarga los resultados consolidados en JSON o CSV. Los mismos resultados son accesibles por API REST.

![Flujo de consulta y descarga de resultados](assets/img/diagramas/tobefuncional/flujo-resultados.png)

### Flujo 6 — Administración de tipo documental

El equipo administrador crea un nuevo tipo documental, define los campos, carga el dataset de entrenamiento, ejecuta el proceso y promueve el tipo entre estados hasta PRODUCCIÓN.

![Flujo de administración de tipo documental](assets/img/diagramas/tobefuncional/flujo-admin-tipos.png)

---

## Mockup navegable del módulo TO-BE

<div class="callout">
<strong>Mockup interactivo disponible</strong><br>
Cubre 13 pantallas: dashboard, onboarding, administración de tipos documentales, configuración FTP, procesamiento individual, procesamiento batch, comparación cruzada, detalle de lote, resultados, historial, configuración API.<br><br>
<a href="mockup-to-be.html"><strong>Abrir mockup navegable →</strong></a>
</div>

---

## Posicionamiento: antes y ahora

| Dimensión | ANTES (RAG conversacional) | AHORA (Agente documental NER) |
|---|---|---|
| Propuesta de valor | "Consulta tus documentos" | "Convierte documentos en datos" |
| Tecnología central | RAG + LLM conversacional | NER supervisado + NER zero-shot/LLM |
| Técnica de extracción | Recuperación semántica + generación | Reconocimiento de entidades nombradas (NER) |
| Interacción principal | Chat libre con documentos | Operación estructurada por flujo |
| Salida principal | Respuesta en lenguaje natural | JSON / CSV con entidades extraídas |
| RAG / Q&A conversacional | Capacidad central | **Fuera del alcance del producto** |
| Entidades de dominio específico | No diferenciadas | Definidas en el esquema del tipo documental |
| Comparación cruzada | No disponible | Flujo nativo del producto |
| Procesamiento batch | No disponible | Flujo nativo con ID de lote |
| FTP | No disponible | Canal de entrada nativo |
| REST API | No disponible | Tres endpoints documentados |
| Trazabilidad | Conversacional | Por lote, por ejecución, descargable |

---

## Restricciones funcionales del TO-BE

- El sistema **no utiliza RAG** como parte del flujo funcional. El RAG queda fuera del alcance del producto.
- **No hay capacidades de chat ni consulta conversacional**. El sistema está orientado 100% a procesamiento estructurado.
- El sistema **no es** un chatbot ni un asistente conversacional de ningún tipo.
- El sistema **no reemplaza** Microsoft Copilot ni Google Gemini.
- El sistema **no es** un gestor documental tradicional.
- **XML no** es formato de salida. Los formatos base son JSON y CSV.
- Todo nuevo tipo documental **requiere proceso de entrenamiento** antes de estar disponible. No es posible activar tipos documentales sin pasar por el ciclo EN DESARROLLO → BETA → PRODUCCIÓN.
- Las integraciones con notificaciones automáticas (correo, webhook) se marcan como **evolución futura, no MVP**.
- La integración con ecosistemas corporativos (Copilot Studio, Vertex AI Agents) se marca como **evolución planificada**, no capacidad del MVP.


Este documento describe el TO-BE funcional de la iniciativa luego del pivot estratégico validado en las reuniones de alineación. El sistema ya **no se presenta como un RAG conversacional** cuyo valor principal sea "chatear con documentos". El producto se reorienta hacia un **agente especializado de procesamiento documental basado en NER**.

<div class="callout">
<strong>Consulta al experto en modelos NER</strong><br>
Documento estructurado en dos bloques: 8 propuestas técnicas pre-resueltas para validación rápida (Sí / No / Ajustar) y 5 preguntas abiertas que requieren criterio especializado.<br><br>
<a href="preguntasexperto.html"><strong>Ver consulta al experto →</strong></a>
</div>


