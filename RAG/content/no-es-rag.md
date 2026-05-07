# Por qué esta solución NO es un RAG

<div class="badge-row">
<span class="badge">Análisis técnico</span>
<span class="badge">Paradigma: Procesamiento estructurado</span>
<span class="badge">RAG: Fuera del alcance</span>
<span class="badge">Audiencia: técnica · arquitectura · producto</span>
</div>

Este documento argumenta con precisión técnica por qué el sistema en construcción **no es un RAG** (Retrieval-Augmented Generation). No es un matiz de implementación ni una decisión de diseño reversible: son dos paradigmas de procesamiento fundamentalmente distintos que resuelven problemas diferentes.

---

## 1. ¿Qué es un RAG?

### Definición formal

RAG (Retrieval-Augmented Generation) es una arquitectura de IA que combina un **motor de recuperación de información** (retrieval) con un **modelo de lenguaje** (generation) para responder preguntas o generar texto enriquecido con información extraída de un corpus externo en tiempo de inferencia.

El término fue formalizado en el artículo *"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"* (Lewis et al., 2020, Facebook AI Research / NeurIPS 2020) y ha sido adoptado y extendido por Microsoft, Google, OpenAI y otros actores del ecosistema IA.

> "RAG applications commonly work as follows: 1. Retrieve — given a user input, relevant splits are retrieved from storage using a Retriever. 2. Generate — a model produces an answer using a prompt that includes both the question with the retrieved data." — [LangChain — Build a RAG agent (Tutorial)](https://docs.langchain.com/oss/python/langchain/rag)

> "Retrieval augmented generation (RAG) is an architecture that augments the capabilities of a Large Language Model (LLM) by adding an information retrieval system that provides grounding data." — [Microsoft Azure AI Search — RAG overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)

### Componentes técnicos de un RAG

| Componente | Descripción | Tecnologías típicas |
|---|---|---|
| **Corpus de conocimiento** | Colección de documentos, páginas, fragmentos | PDF, DOCX, HTML, bases de datos |
| **Chunking** | División del corpus en fragmentos manejables | LangChain TextSplitter, llamaindex |
| **Embeddings / Vectorización** | Conversión de texto en vectores numéricos semánticos | text-embedding-ada-002 (OpenAI), Vertex AI Embeddings |
| **Vector store** | Almacenamiento y búsqueda eficiente por similitud | Pinecone, Weaviate, Azure AI Search, Chroma |
| **Retrieval** | Búsqueda semántica de los fragmentos más relevantes a la consulta | Cosine similarity, HNSW, BM25 híbrido |
| **Context augmentation** | Concatenación de los fragmentos recuperados con la query | Prompt engineering |
| **LLM (generation)** | Modelo que genera la respuesta usando el contexto aumentado | GPT-4, Gemini, Claude, Llama |

### Flujo de ejecución típico de un RAG

```
[INGESTA / OFFLINE]
Documentos del corpus
       ↓
  Chunking (fragmentación)
       ↓
  Embeddings (vectorización semántica)
       ↓
  Almacenamiento en Vector DB
       ↓
[INDEX CONSTRUIDO]

[INFERENCIA / ONLINE]
Query del usuario (lenguaje natural)
       ↓
  Embedding de la query
       ↓
  Búsqueda semántica en Vector DB
  → recupera top-k chunks relevantes
       ↓
  Construcción del prompt aumentado:
  [SISTEMA] + [CONTEXTO: chunk1, chunk2...] + [PREGUNTA]
       ↓
  LLM genera respuesta en lenguaje natural
       ↓
Respuesta al usuario (texto generado)
```

### Casos de uso típicos de RAG

- **Chat con documentos**: "¿Qué dice el contrato sobre penalizaciones?"
- **Asistentes internos**: Q&A sobre manuales, políticas, bases de conocimiento.
- **Copilots conversacionales**: Microsoft Copilot, Google Gemini for Workspace.
- **Knowledge base Q&A**: soporte técnico con contexto de documentación.
- **Exploración de corpus**: síntesis y comparación de múltiples documentos.

### Referencias técnicas

<div class="ref-block">

**Lewis et al. (2020) — Artículo original RAG**
Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 2020. Facebook AI Research.
→ [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)

**Microsoft — RAG overview en Azure AI Search**
"Retrieval augmented generation (RAG) is an architecture that augments the capabilities of a Large Language Model (LLM) by adding an information retrieval system..."
→ [https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)

**Google — RAG en Vertex AI**
"Grounding and RAG allows you to connect model responses to a specified corpus of information."
→ [https://cloud.google.com/vertex-ai/generative-ai/docs/rag-overview](https://cloud.google.com/vertex-ai/generative-ai/docs/rag-overview)

**Amazon Web Services — What is Retrieval-Augmented Generation?**
Describe los tres componentes base del RAG: (1) *Create external data* — embedding language models convierten los documentos en vectores numéricos almacenados en una vector database; (2) *Retrieve relevant information* — la query del usuario se convierte en vector y se busca por similitud en la vector DB; (3) *Augment the LLM prompt* — los fragmentos recuperados se concatenan con la consulta en un prompt aumentado para que el LLM genere la respuesta.
→ [https://aws.amazon.com/what-is/retrieval-augmented-generation/](https://aws.amazon.com/what-is/retrieval-augmented-generation/)

**OpenAI — Vector embeddings**
"OpenAI's text embeddings measure the relatedness of text strings. Embeddings are commonly used for: Search (where results are ranked by relevance to a query string), Clustering, Recommendations, Anomaly detection, Classification." — Los embeddings son el componente que hace posible el retrieval semántico en una arquitectura RAG.
→ [https://developers.openai.com/api/docs/guides/embeddings](https://developers.openai.com/api/docs/guides/embeddings)

**LangChain — Build a RAG agent (Tutorial)**
Tutorial técnico completo: indexing, chunking, embeddings, vector store, retrieval y generación. Cubre tanto el patrón de agente RAG como el patrón de cadena RAG en dos pasos.
→ [https://docs.langchain.com/oss/python/langchain/rag](https://docs.langchain.com/oss/python/langchain/rag)

</div>

---

## 2. ¿Qué es la solución propuesta?

### Definición del sistema

El sistema es un **agente especializado de procesamiento documental**: recibe documentos tipados (PDF o imagen), extrae los campos definidos en un esquema estructurado, valida los resultados contra fuentes de referencia y expone los datos por API REST.

No hay chat. No hay preguntas. No hay corpus de búsqueda. No hay generación de texto como salida.

### Capacidades principales del sistema

| Capacidad | Descripción |
|---|---|
| **Extracción estructurada** | Lectura de campos predefinidos desde documentos tipados |
| **Validación de completitud** | Campos extraídos vs. campos esperados en el esquema |
| **Comparación cruzada** | Contraste campo a campo contra fuente de referencia externa |
| **Procesamiento batch** | Ejecución en paralelo sobre múltiples documentos bajo un ID de lote |
| **Trazabilidad** | Historial persistente por lote, por ejecución, con estado y descarga |
| **API REST** | Tres endpoints JSON: individual, batch asíncrono y comparación |
| **Integración FTP** | Lectura de documentos desde servidor del cliente sin carga manual |

### Naturaleza del procesamiento

El sistema trabaja sobre documentos **individuales** o **lotes**, no sobre un corpus global. Cada documento se procesa de forma independiente contra un esquema predefinido:

1. Se recibe el documento (PDF o imagen) y el tipo documental asociado.
2. Se aplica el esquema de campos del tipo documental.
3. Se extraen los campos o se marcan como no extraídos.
4. Se genera el resultado estructurado en JSON o CSV.
5. El resultado es persistido, exportable y accesible por API.

No existe ninguna etapa de:
- búsqueda semántica en un índice de vectores
- recuperación de fragmentos de un corpus
- construcción de prompt con contexto recuperado
- generación de respuesta en lenguaje natural

### Uso de IA en la solución

La solución puede usar modelos de IA en etapas específicas y acotadas:

| Etapa | Uso de IA | Naturaleza |
|---|---|---|
| Entrenamiento del tipo documental | Inferencia de estructura de campos | Clasificación / extracción supervisada |
| Extracción en modo LLM | Llamada al LLM para inferir valores de campos | Estructuración puntual, no generación libre |
| Extracción en modo entrenado | Modelo propio entrenado con dataset del tipo | Clasificación determinística |

En todos los casos, la IA es un **instrumento de estructuración**, no el eje del producto. La salida no es texto generado: es un JSON con campos y valores.

---

## 3. RAG vs. Solución propuesta — Comparación

| Dimensión | RAG | Solución propuesta |
|---|---|---|
| **Tipo de problema que resuelve** | Responder preguntas sobre un corpus de conocimiento | Convertir documentos tipados en datos estructurados |
| **Tipo de entrada** | Query en lenguaje natural | Documento tipado + esquema de extracción |
| **Tipo de procesamiento** | Búsqueda semántica + generación de texto | Extracción estructurada + validación de campos |
| **Tipo de salida** | Texto generado en lenguaje natural | JSON / CSV con campos y valores |
| **Dependencia de embeddings** | Esencial (vectorización del corpus y la query) | No requerida |
| **Uso de vector DB** | Esencial (Pinecone, Weaviate, Chroma, AI Search...) | No requerida |
| **Uso de LLM** | Central y obligatorio (generación de respuesta) | Opcional e instrumental (modo LLM del tipo) |
| **Interacción con usuario** | Conversacional — el usuario pregunta libremente | Operacional — el usuario ejecuta procesos definidos |
| **Naturaleza del contexto** | Dinámico — construido con chunks recuperados | Estático — esquema fijo predefinido por tipo |
| **Persistencia del conocimiento** | En un índice vectorial del corpus | En el esquema del tipo documental entrenado |
| **Casos de uso** | Chat, Q&A, copilots, exploración de conocimiento | Extracción, validación, comparación, reporting |
| **Nivel de determinismo** | Bajo — respuesta probabilística del LLM | Alto — campos extraídos o marcados no encontrados |
| **Trazabilidad** | Conversacional (historial de chat) | Por lote, por ejecución, por campo, descargable |
| **Integración empresarial** | API de chat / completions | API REST estructurada con JSON tipado |
| **Escalabilidad de corpus** | Requiere reindexado al cambiar el corpus | No hay corpus — se entrena el tipo, no un índice |
| **Comportamiento ante ambigüedad** | El LLM genera algo plausible (hallucination risk) | El campo se marca como no extraído (sin fabricación) |

---

## 4. Diferencias clave explicadas

### Diferencia 1 — Retrieval vs. procesamiento directo

En un RAG, el sistema **busca** en un corpus antes de responder. La calidad de la respuesta depende de qué tan bien el retrieval recupera los fragmentos correctos. El sistema no "sabe" dónde está la información: la busca dinámicamente en el índice.

En la solución propuesta, el sistema **procesa** un documento concreto contra un esquema conocido. No busca nada. Lee el documento que se le entrega y extrae los campos que el tipo documental define. La información no está en un índice: está en el documento recibido.

> El sistema no tiene que "buscar" el propietario del predio. Le entregan el certificado de tradición y libertad del predio específico. Su trabajo es extraer ese campo, no encontrarlo entre miles de documentos.

### Diferencia 2 — Generación de texto vs. estructuración de datos

Un RAG genera **texto** como respuesta. El LLM puede expresar la misma información de múltiples formas, con mayor o menor detalle, y con riesgo de alucinación.

La solución propuesta genera **datos estructurados**. El campo `propietario_actual` tiene un valor o no lo tiene. No hay paráfrasis, no hay elaboración narrativa, no hay síntesis. Si el campo no se encuentra, se marca `null`. No se fabrica una respuesta.

> Esto no es un defecto: es una propiedad deseable para operación empresarial. Los datos estructurados son verificables, importables y comparables. El texto generado no lo es directamente.

### Diferencia 3 — Contexto dinámico vs. esquema definido

En RAG, el "conocimiento" que usa el LLM para responder se construye en tiempo de ejecución: se recuperan los chunks más relevantes a la query y se inyectan en el prompt. El contexto es distinto para cada pregunta.

En la solución propuesta, el "conocimiento" sobre qué extraer está codificado en el **esquema del tipo documental**: qué campos buscar, qué tipo de dato tienen, cuáles son requeridos. Este esquema es estable, predecible y auditable.

### Diferencia 4 — Interacción conversacional vs. operación estructurada

RAG está orientado a un modelo de interacción donde el **usuario pregunta** en lenguaje libre y el sistema responde. El valor del sistema se mide en parte por la naturalidad de la interacción.

La solución propuesta está orientada a **operación documental**: el usuario selecciona un tipo, elige un origen, ejecuta un lote. El valor se mide en completitud de campos, tasa de match y reducción de trabajo manual. No hay conversación.

### Diferencia 5 — Determinismo y verificabilidad

Los LLMs son inherentemente **probabilísticos**: dado el mismo input, pueden producir outputs distintos, y pueden fabricar información que no existe en el contexto (alucinaciones). Esto es aceptable en un copilot conversacional; es inaceptable en un proceso de validación documental.

La solución propuesta apunta a **resultados consistentes y verificables**: el mismo documento procesado dos veces debe producir el mismo resultado. El campo está presente o no está. El valor extraído es auditable contra el documento fuente.

---

## 5. ¿Cuándo SÍ usar RAG?

RAG es la arquitectura correcta cuando:

- El usuario necesita **explorar** un corpus de documentos heterogéneos sin saber exactamente qué busca.
- Se requiere **síntesis narrativa** de múltiples fuentes.
- La interacción es **conversacional por naturaleza**: el usuario pregunta, refina, contraargumenta.
- El corpus cambia frecuentemente y el valor está en la **búsqueda dinámica** sobre ese corpus.
- No se requiere determinismo estricto ni trazabilidad campo a campo.

Ejemplos donde RAG es adecuado:

| Escenario | Por qué RAG encaja |
|---|---|
| Asistente interno sobre manuales técnicos | El usuario hace preguntas libres sobre contenido no estructurado |
| Chat sobre contratos históricos de una empresa | El usuario explora un corpus amplio sin saber dónde está la info |
| Copilot para análisis legal | El usuario quiere síntesis de múltiples documentos |
| FAQ conversacional | La interacción es por naturaleza conversacional |

**Este proyecto no pertenece a ninguna de esas categorías.** El problema que resuelve es extraer campos predefinidos de documentos tipados, validarlos contra referencias y reportar resultados. Eso no requiere búsqueda semántica, no requiere vector DB, no requiere generación de texto.

---

## 6. Conclusión técnica

<div class="callout">

**Esta solución no es un RAG.** No tiene corpus de búsqueda, no vectoriza documentos, no usa retrieval semántico y no genera texto. Intentar encuadrarlo como RAG sería un error conceptual con consecuencias técnicas concretas: introduciría complejidad innecesaria (vector DB, indexado, prompt engineering), reduciría el determinismo de los resultados y haría el sistema más difícil de auditar.

El valor real del sistema está en tres capacidades:

1. **Extracción estructurada** — convertir documentos tipados en datos operativos.
2. **Validación cruzada** — contrastar resultados contra fuentes de referencia campo a campo.
3. **Operación escalable** — procesamiento batch, trazabilidad por lote, integración por API.

RAG podría ser una herramienta complementaria para escenarios de exploración o Q&A sobre el historial de lotes pero **no es necesario, no es adecuado ni es parte del MVP** para resolver el problema central de procesamiento documental estructurado.

</div>
