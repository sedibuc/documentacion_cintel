# TO-BE funcional — Document Intelligence Engine MultiTenant

<div class="badge-row">
<span class="badge">Producto: Document Intelligence Engine</span>
<span class="badge">Arquitectura: MultiTenant — Esencial MVP</span>
<span class="badge">Sector piloto: construcción</span>
<span class="badge">Salida: JSON · CSV</span>
<span class="badge">REST · FTP · Lotes</span>
<span class="badge">Motor de extracción: LLM (zero-shot / few-shot)</span>
<span class="badge badge-note">NER supervisado: evaluación post-producción</span>
</div>

> **Reposicionamiento de producto (2026-05):** El producto es un **Document Intelligence Engine MultiTenant**: convierte documentos tipados en datos estructurados, valida esos datos contra fuentes de referencia, genera alertas de discrepancia y opera bajo un modelo multi-cliente controlado por CINTEL. Sin chat. Sin Q&A. Sin RAG conversacional. Sin vectores.

Este documento describe el TO-BE funcional del Document Intelligence Engine (DIE) después del reposicionamiento estratégico validado. El sistema recibe documentos tipados, extrae campos estructurados mediante LLM, valida los resultados contra fuentes de referencia y gestiona las discrepancias encontradas a través de alertas clasificadas por severidad. Todo ello bajo una arquitectura **MultiTenant** donde CINTEL administra la plataforma y cada empresa cliente opera en un entorno completamente aislado.

---

## Objetivo funcional del sistema

### Qué problema resuelve

Las organizaciones que operan con grandes volúmenes de documentos tipados —certificados, contratos, pólizas, documentos HSE— invierten tiempo manual en extraer datos, contrastarlos contra fuentes de referencia y producir reportes operativos. Este proceso es lento, propenso a errores y difícil de escalar.

El sistema resuelve ese problema convirtiendo documentos tipados en **datos estructurados y comparables**, de forma automatizada, con salida directamente consumible por operación.

### Quién lo usa

- **Operadores documentales** en empresas del sector construcción, legal o inmobiliario: cargan documentos, revisan resultados de extracción, gestionan alertas de discrepancia.
- **Administradores de empresa (tenant)**: configuran usuarios, tipos documentales habilitados y fuentes de referencia.
- **Equipos de auditoría o cumplimiento**: validan datos extraídos, resuelven alertas BLOCKING y aprueban documentos.
- **Equipos de integración**: consumen resultados estructurados vía API REST desde ERP, BI u otros sistemas.
- **CINTEL (operador de la plataforma)**: administra tenants, gestiona modelos LLM, monitorea métricas globales.

### Qué entradas recibe

- Documentos tipados en PDF o imagen, cargados manualmente o leídos desde servidor FTP del cliente.
- Tipo documental configurado con el esquema de campos a extraer.
- Archivo de referencia en CSV o JSON para comparación cruzada (cuando aplique).
- Formato de salida deseado: JSON o CSV.

### Qué procesamiento realiza

1. **MultiTenant Auth**: el API Gateway valida el token JWT, extrae el `tenant_id` y aplica RBAC antes de cualquier operación.
2. **Content Extraction Strategy**: selección de la ruta de extracción más adecuada según el tipo de archivo y las capacidades disponibles: (a) extracción nativa para documentos digitales con texto embebido (PDF/DOCX/XLSX/CSV), (b) LLM multimodal/documental si el modelo lo soporta y es compatible con soberanía de datos, (c) OCR fallback solo para documentos escaneados, imágenes o archivos sin texto embebido. El método usado queda registrado en la `DocumentContentExtraction` y vinculado a la `NormalizedDocumentRepresentation` que alimenta al StructuredExtractor.
3. **StructuredExtractor (LLM)**: el modelo de lenguaje recibe la representación normalizada del documento (no necesariamente texto OCR), el esquema del tipo documental (campos, tipos de dato, descripciones semánticas) y el prompt versionado. Extrae los valores de cada campo sin corpus anotado (zero-shot) o con ejemplos representativos mínimos (few-shot). Salida: JSON estructurado con confianza por campo.
4. **Mapeo al esquema**: los valores extraídos se alinean con los campos del `DocumentSchemaRegistry`; campos sin valor detectado se marcan explícitamente como no extraídos.
5. **Validation Engine**: validación determinística de tipo de dato, formato, campos obligatorios y rangos esperados.
6. **CrossValidator**: comparación campo a campo contra la fuente de referencia (CSV o Excel) proporcionada. Clasifica por campo: `MATCH`, `MISMATCH`, `PENDIENTE`.
7. **DiscrepancyAlertEngine**: genera alertas de discrepancia para cada `MISMATCH` detectado. Clasifica la severidad: `BLOCKING` (impide aprobar el documento), `WARNING` (requiere revisión), `INFO` (informativo).
8. **Alert Dashboard / Human Review**: el operador o auditor ve los documentos con alertas, puede corregir valores, aprobar con observación o rechazar el documento.
9. **Consolidación por lote**: agrupación de ejecuciones bajo un ID único de lote con métricas de resumen.
10. **Audit Service**: persiste trazabilidad inmutable de cada operación (tenant, documento, modelo, prompt versión, tokens, latencia, actor, decisión).

### Pipeline técnico LLM

```
PDF / Imagen / DOCX / XLSX
    ↓
Document Intake
    ↓
Content Extraction Strategy
    ├─ Extracción nativa (texto digital / DOCX / XLSX)
    ├─ LLM multimodal/documental (si modelo y soberanía lo permiten)
    └─ OCR fallback (solo escaneados/imágenes/sin texto embebido)
    ↓
Normalized Document Representation  (contenido + método + hash + uri original)
    ↓
Composición del prompt  (esquema del tipo + instrucciones + representación normalizada)
    ↓
Inferencia LLM  (extracción zero-shot / few-shot)
    ↓
Parseo de salida estructurada  (JSON schema / function calling)
    ↓
Validación de completitud
    ↓
Comparación cruzada (opcional, si hay fuente de referencia)
    ↓
JSON / CSV estructurado
```

> **Sobre NER supervisado:** La modalidad de extracción basada en modelos NER entrenados con corpus anotado (NER supervisado) **no es parte del alcance del MVP**. Se evaluará como evolución planificada una vez el piloto con LLM esté en producción y se disponga de datos empíricos sobre los tipos documentales donde el LLM podría presentar limitaciones de precisión o costo a escala.

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

## Componentes esenciales del MVP

### MultiTenant Platform Core

El MultiTenant Platform Core **no es un módulo opcional**: es la fundación arquitectónica del producto. Sin él, el sistema sería un piloto de una sola empresa, no un producto comercializable por CINTEL.

| Capacidad | Descripción |
|---|---|
| **Tenant Management** | CINTEL crea, configura y suspende empresas cliente (tenants) |
| **User Management** | Cada tenant gestiona sus propios usuarios con roles OPERADOR, ADMIN, REVISOR |
| **RBAC** | Control de acceso por rol y por endpoint; cada operación valida permisos |
| **Aislamiento de datos** | Row-Level Security por `tenant_id` en PostgreSQL; sin acceso cruzado entre tenants |
| **Aislamiento de storage** | Archivos organizados por prefijo `tenant_id/` en Object Storage |
| **Configuración por tenant** | Cada tenant puede tener tipos documentales, prompts y fuentes de referencia propios |
| **Audit por tenant** | Log inmutable de todas las operaciones del tenant |

### CrossValidator

El CrossValidator recibe los campos extraídos por el `StructuredExtractor` y los compara contra una fuente de referencia cargada por el tenant (archivo CSV o Excel). La comparación es campo a campo.

| Aspecto | Detalle |
|---|---|
| **Entrada** | JSON de extracción + archivo de referencia (CSV/Excel) del tenant |
| **Salida** | Por cada campo: resultado `MATCH`, `MISMATCH` o `PENDIENTE` con valores de ambas fuentes |
| **Detección de diferencias** | Comparación exacta o con normalización configurable (mayúsculas, espacios, formatos de fecha) |
| **Trazabilidad** | `CrossValidationRun` con `cross_validation_result` por campo |
| **Alcance MVP** | Comparación contra CSV/Excel de referencia subido manualmente por el tenant |
| **Post-MVP** | Comparación contra BD externa o API del cliente (requiere conector) |

### DiscrepancyAlertEngine

El DiscrepancyAlertEngine convierte los resultados `MISMATCH` del CrossValidator en alertas de discrepancia clasificadas y accionables.

| Severidad | Criterio | Comportamiento |
|---|---|---|
| **BLOCKING** | Campo obligatorio con `MISMATCH` en dato crítico | Impide aprobación del documento; requiere resolución explícita |
| **WARNING** | Campo importante con `MISMATCH` tolerable | Requiere revisión; el operador puede aprobar con observación |
| **INFO** | Diferencia menor o campo no obligatorio | Registro informativo; no requiere acción |

Cada alerta tiene un estado de ciclo de vida: `PENDIENTE` → `EN_REVISION` → `RESUELTA` / `IGNORADA`.

---

## Módulo administrativo de tipos documentales

Cada tipo de documento que el sistema puede procesar requiere un proceso de configuración y validación previo. Este módulo es gestionado por el equipo administrador del sistema, no por los operadores de empresa. Dado que el MVP usa LLM como motor de extracción, **no se requiere corpus anotado ni entrenamiento de modelos**: el proceso es de configuración de esquema y validación de calidad de extracción.

### Funcionalidad del módulo

- Crear un nuevo tipo documental con nombre, descripción y sector.
- Definir los campos a extraer (nombre, tipo de dato, descripción semántica para el LLM, requerido o no).
- Cargar documentos de validación representativos del tipo (mínimo recomendado según la complejidad del esquema).
- Revisar la salida LLM sobre los documentos de validación y ajustar las descripciones de campos o el prompt base si la extracción no es precisa.
- Configurar el esquema de salida: JSON, CSV o ambos.
- Cambiar el estado del tipo documental entre ciclos de validación.

### Proceso de configuración y validación del tipo LLM

1. Definición del esquema de campos: nombre canónico, tipo de dato, descripción semántica clara para el LLM (p. ej. "Número de matrícula inmobiliaria en formato NNN-NNNNNNN").
2. Carga de documentos de validación reales representativos del tipo.
3. **Ejecución de extracción de prueba** con el LLM sobre el conjunto de validación.
4. **Revisión de calidad**: verificación manual de campos extraídos vs. campos esperados. Identificación de campos con extracción inconsistente.
5. Ajuste iterativo de las descripciones de campos o del prompt base del tipo hasta alcanzar la calidad requerida.
6. Promoción del tipo al siguiente estado (de EN DESARROLLO a BETA o a PRODUCCIÓN).

> Con LLM no se requieren corpus anotados, archivos BIO/BIOES ni ciclos de entrenamiento de modelos. El esfuerzo se concentra en definir con precisión el esquema de campos y validar la calidad de extracción con documentos representativos.

### Estados del tipo documental

| Estado | Visibilidad | Garantía de precisión | Uso recomendado |
|---|---|---|---|
| **EN DESARROLLO** | No visible para empresas | Sin garantía | Configuración y validación interna del esquema LLM |
| **BETA** | Visible con advertencia de riesgo | Sin garantía | Validación piloto con empresas seleccionadas |
| **PRODUCCIÓN** | Visible y recomendado | Validado | Operación regular y confiable |

### Modalidad de extracción en el MVP

El MVP utiliza **LLM (zero-shot / few-shot)** como única modalidad de extracción para todos los tipos documentales.

| Propiedad | LLM (zero-shot / few-shot) — **Alcance MVP** | NER supervisado (entrenado) — **Evaluación post-MVP** |
|---|---|---|
| Técnica base | LLM con prompt de esquema (zero-shot o few-shot) | Modelo fine-tuned (SpaCy, BERT, RoBERTa) |
| Dataset requerido | No (o ejemplos mínimos para few-shot) | Sí — corpus anotado en formato BIO/BIOES |
| Velocidad de configuración | Alta — solo requiere definir esquema y prompt | Baja — requiere anotación + entrenamiento + evaluación |
| Costo de construcción | Bajo | Alto |
| Precisión | Variable; puede degradar en documentos con layout complejo o entidades de dominio muy específico | Alta y estable en entidades de dominio con suficiente corpus |
| Disponibilidad en MVP | ✅ Sí | ❌ No — evaluación planificada post-MVP |

> **NER supervisado no es parte del alcance de este MVP.** Se evaluará una vez que el piloto LLM esté en producción y se hayan identificado tipos documentales específicos donde la precisión LLM presente limitaciones operativas relevantes o donde el costo por token a escala justifique el esfuerzo de entrenamiento.

---

## Tipos documentales del piloto

Todos los tipos del piloto utilizan LLM como modalidad de extracción en el MVP.

### PRODUCCIÓN (disponible para operación)

| Tipo documental | Campos clave | Modalidad | Estado |
|---|---|---|---|
| Certificado de tradición y libertad | Matrícula inmobiliaria, propietario actual, área, gravámenes, anotaciones, municipio, fecha de expedición | LLM | ✅ PRODUCCIÓN |

### BETA (disponible con advertencia)

| Tipo documental | Campos clave | Modalidad | Estado |
|---|---|---|---|
| Contrato de obra | Partes, objeto, valor, plazo, garantías, firma | LLM | ⚠️ BETA |

### EN DESARROLLO (solo uso interno)

| Tipo documental | Campos clave | Modalidad | Estado |
|---|---|---|---|
| Póliza de seguro HSE | Asegurado, vigencia, coberturas, valor asegurado, beneficiarios | LLM | 🔧 EN DESARROLLO |

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

<a href="assets/plantuml/flujo-onboarding.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### Flujo 2 — Extracción estructurada de documentos

El operador selecciona el tipo documental, elige el origen (carga manual o FTP), configura el formato de salida y ejecuta la extracción. El agente procesa el documento y devuelve los campos definidos en el esquema.

![Flujo de extracción estructurada de documentos](assets/img/diagramas/tobefuncional/flujo-extraccion.png)

<a href="assets/plantuml/flujo-extraccion.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

Los campos no encontrados se marcan explícitamente como no extraídos. No hay respuesta en lenguaje natural ni interacción conversacional.

### Flujo 3 — Comparación y validación cruzada

El operador carga una fuente de referencia (CSV o JSON) y ejecuta la comparación contra los resultados de extracción. El sistema clasifica cada campo como `MATCH`, `MISMATCH` o `PENDIENTE`.

![Flujo de comparación y validación cruzada](assets/img/diagramas/tobefuncional/flujo-comparacion.png)

<a href="assets/plantuml/flujo-comparacion.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### Flujo 4 — Procesamiento por lotes e historial

El operador define el lote (nombre, tipo documental, formato de salida), elige el origen de los documentos (carga manual o FTP) y ejecuta. El sistema procesa en paralelo, asigna ID de lote y persiste el historial.

![Flujo de procesamiento por lotes e historial](assets/img/diagramas/tobefuncional/flujo-lotes.png)

<a href="assets/plantuml/flujo-lotes.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### Flujo 5 — Consulta y descarga de resultados

El operador accede al historial, selecciona un lote y descarga los resultados consolidados en JSON o CSV. Los mismos resultados son accesibles por API REST.

![Flujo de consulta y descarga de resultados](assets/img/diagramas/tobefuncional/flujo-resultados.png)

<a href="assets/plantuml/flujo-resultados.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

### Flujo 6 — Administración de tipo documental

El equipo administrador crea un nuevo tipo documental, define los campos, carga el dataset de entrenamiento, ejecuta el proceso y promueve el tipo entre estados hasta PRODUCCIÓN.

![Flujo de administración de tipo documental](assets/img/diagramas/tobefuncional/flujo-admin-tipos.png)

<a href="assets/plantuml/flujo-admin-tipos.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

---

## Mockup navegable del módulo TO-BE

<div class="callout">
<strong>Mockup interactivo disponible</strong><br>
Cubre 13 pantallas: dashboard, onboarding, administración de tipos documentales, configuración FTP, procesamiento individual, procesamiento batch, comparación cruzada, detalle de lote, resultados, historial, configuración API.<br><br>
<a href="mockup-to-be.html"><strong>Abrir mockup navegable →</strong></a>
</div>

---

## Posicionamiento: antes y ahora

| Dimensión | DEMOSTRADOR RAG (AS-IS) | DOCUMENT INTELLIGENCE ENGINE (TO-BE) |
|---|---|---|
| Nombre del producto | RAG conversacional CINTEL | Document Intelligence Engine MultiTenant |
| Propuesta de valor | "Consulta tus documentos" | "Documentos tipados → datos estructurados + alertas" |
| Arquitectura | Single-tenant (un cliente) | MultiTenant (N clientes aislados bajo CINTEL) |
| Tecnología central | RAG + LLM conversacional + Vector DB | LLM para extracción estructurada (sin vectores) |
| Interacción principal | Chat libre con documentos | Procesamiento por flujo estructurado |
| Salida principal | Respuesta en lenguaje natural | JSON / CSV con campos y valores |
| CrossValidator | No disponible | ✅ Componente MVP — comparación vs. CSV/Excel |
| DiscrepancyAlertEngine | No disponible | ✅ Componente MVP — alertas BLOCKING/WARNING/INFO |
| Alert Dashboard | No disponible | ✅ Componente MVP — human review y resolución |
| MultiTenant | No disponible | ✅ Esencial MVP — múltiples empresas aisladas |
| Chat / Q&A conversacional | Capacidad central | ❌ Fuera del alcance — no implementar |
| NER supervisado | No disponible | ⏸ Post-producción — solo si LLM muestra limitaciones |
| Vector DB (Pinecone/Chroma) | Componente central | ❌ Fuera del alcance — no se usa |
| API REST | No disponible | ✅ Canal principal — endpoints documentados |
| Audit / trazabilidad | Conversacional | ✅ Inmutable por tenant/documento/operación |

---

## Restricciones funcionales del TO-BE — Fuera de alcance

| Capacidad excluida | Motivo |
|---|---|
| **Chat / RAG conversacional** | Paradigma diferente: el sistema extrae, no responde preguntas libres |
| **Q&A libre sobre documentos** | No es el posicionamiento del producto; confunde a compradores |
| **Respuesta en lenguaje natural** | La salida es siempre JSON/CSV estructurado, nunca texto libre |
| **Base vectorial (Pinecone, Chroma, etc.)** | No se usa: el sistema no hace recuperación semántica |
| **Fine-tuning de LLMs** | Costo y complejidad injustificados en MVP |
| **NER supervisado en MVP** | Se evalúa post-producción si LLM presenta limitaciones documentadas |
| **Conectores ERP directos** | Post-MVP (SAP, Sinco, Odoo) |
| **Multi-idioma** | Fuera del alcance del piloto sectorial |
| **Reemplazar Copilot / Gemini** | No es el posicionamiento — complementa, no reemplaza |

> El sistema **no es** un chatbot, un asistente conversacional ni un motor de búsqueda semántica. El sistema convierte documentos tipados en datos estructurados, valida esos datos y gestiona las discrepancias. Eso es el Document Intelligence Engine.
- El sistema **no es** un gestor documental tradicional.
- **XML no** es formato de salida. Los formatos base son JSON y CSV.
- El motor de extracción del MVP es **exclusivamente LLM (zero-shot / few-shot)**. El NER supervisado no es parte del alcance actual y se evaluará únicamente después de que el piloto MVP con LLM esté operativo en producción.
- Todo nuevo tipo documental **requiere proceso de validación de calidad LLM** antes de estar disponible. No es posible activar tipos documentales sin haber validado la extracción sobre documentos representativos.
- Las integraciones con notificaciones automáticas (correo, webhook) se marcan como **evolución futura, no MVP**.
- La integración con ecosistemas corporativos (Copilot Studio, Vertex AI Agents) se marca como **evolución planificada**, no capacidad del MVP.


Este documento describe el TO-BE funcional de la iniciativa luego del pivot estratégico validado en las reuniones de alineación. El sistema ya **no se presenta como un RAG conversacional** cuyo valor principal sea "chatear con documentos". El producto se reorienta hacia un **agente especializado de procesamiento documental basado en LLM**.

<div class="callout">
<strong>Consulta al experto en arquitectura LLM</strong><br>
Documento estructurado en dos bloques: propuestas técnicas pre-resueltas para validación rápida (Sí / No / Ajustar) y preguntas abiertas que requieren criterio especializado, todas orientadas al uso de LLM en la arquitectura de extracción documental.<br><br>
<a href="preguntasexperto.html"><strong>Ver consulta al experto →</strong></a>
</div>


