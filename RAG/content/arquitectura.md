# Arquitectura vigente

## Visión general

La arquitectura actual se compone de una aplicación web Flask conectada a PostgreSQL para autenticación y persistencia conversacional, un pipeline de procesamiento documental, un motor de embeddings configurable, una base vectorial configurable y proveedores de modelos LLM tanto cloud como on-premise.

## Componentes principales y responsabilidades

| Componente | Rol actual | Observaciones del diagnóstico |
| --- | --- | --- |
| Aplicación Flask | Orquesta interfaz web, login, chat, biblioteca y reportes | Es el stack principal del demostrador y corre en Flask, no en Streamlit. |
| PostgreSQL | Persistencia de usuarios, conversaciones, mensajes, feedback, bibliotecas y catálogo de modelos | También soporta autenticación y datos operativos. |
| document_processor | Ingesta documental y OCR | El OCR se activa de forma condicional dentro del procesador documental y usa un servicio REST externo. |
| embeddings / embedding_server | Generación de embeddings | Soporta OpenAI en cloud y un embedding server FastAPI con E5-base-v2 en on-premise. |
| vector_index_manager | Gestión de Pinecone o Qdrant | La selección depende de variables de entorno y factorías; Pinecone fija región y métrica en código. |
| core RAG | Recuperación y respuesta | Instancia el pipeline por conversación, consulta LangChain Hub en cada instancia y arma el contexto final con documentos completos desde filesystem. |
| Proveedores LLM | Respuesta final | Se observan OpenAI, Groq, Gemini y Ollama según configuración y seeds. |

## Flujos principales

### Ingesta

- El usuario carga documentos en una biblioteca.
- El procesamiento documental se lanza en segundo plano mediante un hilo de background.
- El sistema procesa el contenido textual archivo por archivo.
- Si CHECK_OCR=1, el OCR se activa dentro del procesador documental y se invoca OCR_SERVICE_URL.
- El texto resultante pasa a etapas posteriores de embeddings e indexación.

### Indexación

- Se generan embeddings mediante un proveedor cloud u on-premise.
- La dimensión observada es 1536 para OpenAI y 768 para E5-base-v2.
- Los vectores se envían al motor configurado.
- En Pinecone la creación del índice usa región `us-east-1` y métrica `dotproduct` fijadas en código.
- La biblioteca queda asociada al motor vectorial persistido.

### Consulta

- El usuario envía una pregunta en chat.
- El sistema consulta el índice vectorial para recuperar chunks candidatos.
- Los chunks recuperados se usan para priorizar documentos y luego se releen los documentos completos desde filesystem para construir el contexto final.
- Se arma el prompt y se invoca el LLM configurado.
- La inicialización del pipeline consulta LangChain Hub en cada nueva instancia de RAG.
- La memoria conversacional se persiste, pero no se incorpora de forma efectiva al prompt de respuesta.
- La conversación y el mensaje quedan persistidos.

### Feedback

- El usuario registra retroalimentación positiva o negativa sobre mensajes.
- El sistema conserva esa relación mediante message_id.
- Los reportes agregados pueden explotar esa persistencia.

## Conmutación cloud vs on-premise

### Variables eje

| Área | Variable principal | Valores observados |
| --- | --- | --- |
| Modelos IA | IA_MODELS_PROVIDER | cloud o on-premise |
| Vector DB | VECTOR_DB_ENGINE | cloud o on-premise |
| Embeddings | EMBEDDINGS_PROVIDER | cloud o on-premise |

<div class="callout">
<strong>Nota técnica sobre configuración</strong>
<p>El diagnóstico reporta una discrepancia entre referencias documentales y código: algunos módulos o descripciones mencionan valores explícitos como pinecone|qdrant, mientras que la validación y conmutación observada en código trabaja con cloud|on-premise. Antes de automatizar despliegue o parametrización conviene verificar qué convención gobierna cada punto de configuración.</p>
</div>

### Dependencias físicas de infraestructura

- Pinecone aparece como opción cloud administrada.
- Qdrant aparece como opción on-premise en docker-compose, con puertos 6333 y 6334, aunque el cliente Python usa HTTP sobre QDRANT_HOST y QDRANT_PORT.
- PostgreSQL se despliega como servicio persistente.
- pgAdmin aparece como apoyo operativo.
- OCR funciona como dependencia externa tipo REST.
- El embedding server se comporta como microservicio separado implementado con FastAPI, Transformers y PyTorch.

## Dependencias de implementación

- LangChain Hub participa en runtime para obtener el prompt base en cada instancia de RAG.
- El filesystem actúa como fuente de verdad para relectura de documentos completos durante la consulta.
- Streamlit aparece como dependencia importada en managers de vector store, aunque el stack principal de la aplicación es Flask.
- Ollama se usa para modelos on-premise con direcciones base definidas en el catálogo de modelos.
- PyMuPDF y python-pptx participan en extracción y procesamiento documental.
- pandas y plotly soportan la generación de reportes.

## Variables de entorno críticas

### IA y proveedores

- IA_MODELS_PROVIDER
- OPENAI_API_KEY
- GROQ_API_KEY
- GOOGLE_API_KEY
- LANGSMITH_API_KEY

### Base vectorial

- VECTOR_DB_ENGINE
- PINECONE_API_KEY
- QDRANT_HOST
- QDRANT_PORT

### Embeddings

- EMBEDDINGS_PROVIDER
- EMBEDDINGS_PROTOCOL
- EMBEDDINGS_HOST
- EMBEDDINGS_PORT

### OCR

- CHECK_OCR
- OCR_SERVICE_URL
- OCR_USE_GPU

### Persistencia y runtime

- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- LOG_DIR
- UPLOADS_PATH
- TXT_TMP_DIR

### Notas de uso

- `WEB_PORT` aparece en docker-compose, pero la aplicación Flask observada corre en el puerto 5000 fijado en código.
- `config/environment.py` valida claves cloud obligatorias incluso cuando el sistema se configura en modo on-premise.
- `QDRANT_GRPC_PORT` y `QDRANT_STORAGE` aparecen en despliegue, pero no gobiernan el cliente Python observado en runtime.
- `LANGCHAIN_PROJECT` y `LANGCHAIN_TRACING_V2` se cargan con valores por defecto para tracing.

## Diagramas de referencia

Los siguientes diagramas se presentan como apoyo visual de la arquitectura y de los flujos descritos en el diagnóstico. Se muestran como material de referencia para lectura técnica, no como evidencia de una implementación adicional distinta al demostrador analizado.

### Arquitectura general

![Arquitectura lógica general del demostrador RAG](./assets/img/diagramas/arquitectura-general.png)

<a href="assets/plantuml/arquitectura-general.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

Vista resumida de componentes, dependencias y puntos principales de integración del demostrador.

### Flujo de consulta

![Consulta RAG desde interfaz web hasta recuperación e inferencia](./assets/img/diagramas/flujo-consulta.png)

<a href="assets/plantuml/flujo-consulta.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

Secuencia de recuperación, composición de contexto y generación de respuesta para el chat RAG.

### Flujo de ingesta

![Ingesta, OCR, embeddings e indexación](./assets/img/diagramas/flujo-ingesta.png)

<a href="assets/plantuml/flujo-ingesta.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

Recorrido técnico desde carga documental hasta procesamiento, embeddings e indexación vectorial.
