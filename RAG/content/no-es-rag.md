# Por qué esta solución NO es un RAG ni un sistema de Q&A

<div class="badge-row">
<span class="badge">Análisis técnico</span>
<span class="badge">Producto: Document Intelligence Engine MultiTenant</span>
<span class="badge">RAG: Fuera del alcance</span>
<span class="badge">Chat / Q&A: Fuera del alcance</span>
<span class="badge">Audiencia: técnica · arquitectura · producto</span>
</div>

Este documento argumenta con precisión técnica por qué el **Document Intelligence Engine MultiTenant (DIE)** no es un RAG (Retrieval-Augmented Generation) **ni tampoco un sistema de Q&A documental** con LLM. Son tres paradigmas de procesamiento fundamentalmente distintos que resuelven problemas diferentes. Esta distinción es una decisión de producto, no un matiz de implementación.

> **Resumen ejecutivo:** El DIE convierte documentos tipados en datos estructurados, valida esos datos contra fuentes de referencia y gestiona alertas de discrepancia. No responde preguntas. No tiene chat. No tiene vectores. No recupera fragmentos. No genera texto libre.

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

El sistema es el **Document Intelligence Engine MultiTenant (DIE)**: convierte documentos tipados en datos estructurados, valida esos datos contra fuentes de referencia, genera alertas de discrepancia clasificadas por severidad y opera bajo un modelo multi-cliente (MultiTenant) controlado por CINTEL.

No hay chat. No hay preguntas. No hay corpus de búsqueda. No hay generación de texto como salida. No hay base vectorial. No hay Q&A.

### Capacidades principales del sistema

| Capacidad | Descripción |
|---|---|
| **MultiTenant Platform Core** | Múltiples empresas cliente con datos completamente aislados |
| **Extracción estructurada** | Lectura de campos predefinidos desde documentos tipados vía LLM |
| **CrossValidator** | Comparación campo a campo contra CSV/Excel de referencia |
| **DiscrepancyAlertEngine** | Alertas de discrepancia BLOCKING/WARNING/INFO con ciclo de vida |
| **Alert Dashboard** | Human review, resolución de alertas, aprobación de documentos |
| **API REST** | Canal principal de integración con sistemas clientes |
| **Audit Service** | Trazabilidad inmutable por tenant/documento/operación |

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
| Extracción de campos | LLM con esquema como prompt (zero-shot / few-shot) | Estructuración puntual, no generación libre |

En todos los casos, la IA es un **instrumento de estructuración**, no el eje del producto. La salida no es texto generado: es un JSON con campos y valores.

---

## 3. RAG vs. Q&A con LLM vs. Document Intelligence Engine

| Dimensión | RAG | Q&A con LLM (sin vectores) | **Document Intelligence Engine** |
|---|---|---|---|
| **Problema que resuelve** | Responder preguntas sobre corpus | Responder preguntas sobre documentos | Convertir documentos en datos estructurados |
| **Entrada** | Query en lenguaje natural | Pregunta libre + documento | Documento tipado + esquema de extracción |
| **Procesamiento** | Búsqueda semántica + generación | LLM responde en lenguaje natural | LLM extrae campos + CrossValidator + Alertas |
| **Salida** | Texto generado | Texto generado | JSON/CSV estructurado + alertas clasificadas |
| **Embeddings / Vector DB** | Esencial | No requerido | **No requerido** |
| **Chat / historial conversacional** | Presente | Presente | **No existe** |
| **MultiTenant** | Raro | Raro | **Esencial MVP** |
| **CrossValidator** | No aplica | No aplica | **Componente MVP** |
| **DiscrepancyAlertEngine** | No aplica | No aplica | **Componente MVP** |
| **Determinismo** | Bajo | Bajo | **Alto** (campos vs. nó encontrados) |
| **Trazabilidad** | Conversacional | Conversacional | Por tenant/documento/operación |
| **Integración empresarial** | API de chat | API de completions | **API REST estructurada** |
| **Escalabilidad operativa** | Requiere reindexado | N/A | Configuración de tipo documental |

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

**Esta solución no es un RAG ni un sistema de Q&A.** No tiene corpus de búsqueda, no vectoriza documentos, no usa retrieval semántico y no genera texto libre. Intentar encuadrarlo como RAG o Q&A sería un error conceptual con consecuencias técnicas concretas: introduciría complejidad innecesaria (vector DB, indexado, gestión de conversaciones), reduciría el determinismo de los resultados y haría el sistema más difícil de auditar.

El valor real del **Document Intelligence Engine MultiTenant** está en cuatro capacidades:

1. **Extracción estructurada** — convertir documentos tipados en datos operativos vía LLM.
2. **CrossValidator** — contrastar resultados contra fuentes de referencia campo a campo.
3. **DiscrepancyAlertEngine** — gestionar alertas de discrepancia con severidad y ciclo de vida.
4. **MultiTenant** — operar para múltiples empresas cliente bajo control de CINTEL.

RAG es la herramienta correcta para Q&A y exploración de corpus. El DIE es la herramienta correcta para extracción, validación y gestión de discrepancias documentales. Son productos diferentes para mercados diferentes.

</div>
