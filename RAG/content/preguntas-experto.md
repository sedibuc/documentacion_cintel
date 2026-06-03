# Cuestionario preliminar para experto en modelos — Document Intelligence Engine MultiTenant

<div class="badge-row">
<span class="badge">Audiencia: experto en modelos de lenguaje e IA generativa</span>
<span class="badge">Contexto: Document Intelligence Engine MultiTenant</span>
<span class="badge">8 bloques · 26 preguntas</span>
<span class="badge badge-note">Consulta escrita · concepto técnico preliminar</span>
</div>

> **Propósito y alcance:** Este cuestionario tiene como propósito solicitar al experto un concepto técnico preliminar sobre la factibilidad de implementar un Document Intelligence Engine orientado a extracción estructurada, validación cruzada y generación de alertas. Las respuestas serán utilizadas como insumo para enriquecer el micrositio de análisis y para orientar una evaluación exploratoria posterior. No se espera una selección final de modelos, proveedores ni arquitectura definitiva; cualquier recomendación deberá entenderse como criterio preliminar sujeto a validación con documentos reales del MVP.

Este cuestionario está dirigido a un **experto en modelos de lenguaje e inteligencia artificial generativa**. Las decisiones de arquitectura tradicional (MultiTenant, bases de datos, queues, despliegue) ya fueron resueltas y están documentadas en el [Análisis técnico TO-BE](arquitectura-tobe.html).

---

## Contexto del producto

El **Document Intelligence Engine MultiTenant (DIE)** es un sistema que extrae campos estructurados desde documentos tipados —PDF, imágenes, DOCX—, los valida contra fuentes de referencia externas y genera alertas de discrepancia clasificadas como BLOCKING, WARNING o INFO.

**El producto no es un chat ni un sistema de recuperación conversacional (RAG).** La necesidad central es:

- Extracción estructurada de campos definidos en un schema.
- Validación cruzada contra fuentes de referencia (registros, bases de datos, APIs externas).
- Generación determinística de alertas de discrepancia por campo.
- Trazabilidad y auditoría del resultado por documento.

La arquitectura contempla una capa de **Content Extraction Strategy** que seleccionaría dinámicamente entre extracción nativa del archivo, procesamiento con LLM (texto o multimodal) y OCR como fallback para documentos escaneados o sin texto embebido confiable. Estos supuestos de diseño aún requieren validación con documentos reales.

---

## Orientación para responder

El experto puede responder de forma breve y argumentada. Se valora que diferencie entre:

- **Opinión preliminar basada en experiencia:** criterio técnico que puede orientar sin pruebas formales.
- **Supuestos que deben validarse:** hipótesis técnicas que requieren experimento o muestra documental.
- **Riesgos críticos:** aspectos que, si no se controlan, pueden comprometer la viabilidad del producto.
- **Recomendaciones para prueba posterior:** qué experimentos mínimos deberían hacerse antes de tomar decisiones.
- **Aspectos que no pueden concluirse sin PoC:** preguntas que requieren documentos reales para responderse con suficiente certeza.

> Si alguna pregunta no puede responderse con suficiente certeza sin pruebas técnicas, indique qué información, muestra documental o experimento mínimo sería necesario para responderla.

Las respuestas escritas serán integradas como insumo en el micrositio de análisis del proyecto y como base para diseñar una evaluación exploratoria posterior con documentos reales.

---

## Bloque 1 — Factibilidad general de la necesidad

*¿Es viable, con tecnologías actuales de IA documental, construir un sistema que extraiga campos estructurados desde documentos tipados, los valide contra fuentes de referencia y genere alertas de discrepancia?*

**1.** ¿Qué tan madura considera que es la tecnología disponible hoy para abordar extracción estructurada de documentos complejos como certificados notariales, contratos y pólizas? ¿Cuáles son las principales brechas o limitaciones que anticipa?

> **Respuesta del experto:** La IA generativa es muy madura y siempre ha resuelto capacidades de NLP, entre ellas OCR. No solo los modelos fundacionales sino también VLMs (vision language models) como PaliGemma o DeepSeek-OCR, que permiten tareas de OCR con alta precisión sin necesidad de entrenar con grandes volúmenes de datos. Las principales limitaciones son el hardware requerido para modelos con fine-tuning y la latencia.

**2.** ¿Qué diferencia técnica relevante existe entre extracción estructurada con schema definido y generación de texto libre? ¿Afecta esa diferencia la viabilidad o el riesgo de implementación?

> **Respuesta del experto:** A los LLMs o VLMs se les puede dar un esquema para que detecten exactamente lo que se necesita, los tipos de datos y demás. Esto reduce el riesgo de implementación respecto a la generación de texto libre.

**3.** ¿Considera razonable la hipótesis de priorizar procesamiento nativo o multimodal del documento frente a OCR como paso obligatorio para documentos digitales? ¿Bajo qué condiciones ese supuesto podría fallar?

> **Respuesta del experto:** Los LLMs o VLMs se pueden comportar como OCRs directamente, por lo que la distinción entre procesamiento nativo y OCR como paso separado no es necesaria en este contexto.

---

## Bloque 2 — Enfoques técnicos a explorar

*¿Qué estrategias de extracción documental vale la pena explorar para el MVP?*

**4.** ¿Qué enfoques técnicos considera razonable explorar para procesar documentos en formato PDF digital, PDF escaneado, imagen y documentos ofimáticos? ¿Cuáles priorizaría y por qué?

> **Respuesta del experto:** Uso de LLMs multimodales; la evaluación de cuál usar puede realizarse con herramientas como MLflow o Vertex AI Evaluation. Se recomienda el uso de few-shots como primera medida, outputs estructurados, tools para validar información, y workflows o agentes de tipo evaluador-crítico para mejorar la precisión cuando sea necesario.

**5.** ¿Cuándo tiene sentido usar un LLM multimodal o documental frente a extraer primero el texto y luego procesarlo con un LLM de texto? ¿Qué criterios deberían guiar esa decisión en una exploración inicial?

> **Respuesta del experto:** El LLM hace la extracción de texto directamente; extraer primero y luego procesar es redundante, consume más recursos y aumenta la latencia innecesariamente.

**6.** ¿Qué papel debería tener OCR en una estrategia de extracción documental moderna? ¿Para qué tipos de documentos sería difícil evitarlo? ¿Cuándo sería un paso innecesario o contraproducente?

> **Respuesta del experto:** Un LLM o VLM realiza las tareas de un OCR usando arquitecturas de deep learning más modernas con capacidades de atención y mayor precisión. En un OCR tradicional hay que hacer fine-tuning por cada tipo de documento, lo que es costoso en términos de escalabilidad de negocio. El uso de LLMs o VLMs puede arrojar muy buenos resultados solo con zero-shot o few-shot, haciendo el OCR como paso previo innecesario o contraproducente en la mayoría de los casos.

**26.** *(Decisión adoptada — formalizar criterio)* El MVP adoptó extracción vía LLM (zero-shot / few-shot) y postergó NER supervisado para una fase post-producción condicionada a la disponibilidad de un corpus anotado. ¿Considera que ese orden de prioridad es razonable para un piloto inicial con documentos notariales y pólizas HSE? ¿Bajo qué condiciones —volumen de documentos, variabilidad de formato, nivel de precisión requerido— recomendaría anticipar NER al MVP en lugar de dejarlo como mejora posterior?

> **Respuesta del experto:** La priorización con LLMs es correcta. El orden adoptado es razonable para el MVP.

---

## Bloque 3 — Modelos o familias candidatas

*¿Qué familias de modelos o proveedores valdría la pena explorar para este caso de uso?*

**7.** ¿Qué familias de modelos o proveedores considera razonable incluir en una exploración inicial, tanto opciones cloud certificadas como modelos que podrían ejecutarse localmente? No se busca una selección final, sino candidatos que orienten una evaluación posterior.

> **Respuesta del experto:** Los candidatos recomendados para explorar son: Gemini, OpenAI, DeepSeek-OCR, Gemma4 y PaliGemma.

**8.** ¿Hay modelos o categorías de modelos que, por razones técnicas o de madurez, no recomendaría explorar en esta fase inicial? ¿Por qué?

> **Respuesta del experto:** Claude y otros modelos que no son fuertes en lo multimodal no se recomiendan para esta fase inicial.

**9.** ¿Qué aspectos considera más relevantes para comparar opciones preliminares: soporte de formatos, multimodalidad, salida estructurada, soberanía, costo, latencia u otros? ¿Cuáles son los criterios que no deberían obviarse en una primera evaluación?

> **Respuesta del experto:** Los criterios prioritarios son: precisión, tooling disponible, capacidad multimodal, latencia y costo.

---

## Bloque 4 — Calidad, trazabilidad y control de errores

*¿Cómo se podría evaluar y controlar la calidad de la extracción estructurada?*

**10.** ¿Qué criterios de calidad considera relevantes para evaluar preliminarmente la extracción estructurada? ¿Qué métricas deberían explorarse en una prueba posterior? No se busca establecer umbrales finales, sino identificar qué medir.

> **Respuesta del experto:** Una matriz de confusión junto con las métricas de precisión, recall y F1-score son muy útiles para esta evaluación.

**11.** ¿Qué mecanismos técnicos podrían ayudar a garantizar que los valores extraídos provienen del documento fuente y no del conocimiento interno del modelo? ¿Qué técnicas considera prioritarias explorar?

> **Respuesta del experto:**
> - Colocar guardrails en el prompt (límites explícitos).
> - Técnicas de prompt engineering.
> - Workflows o agentes de tipo evaluador-crítico.
> - Definir un output estructurado.
> - Few-shots.

**12.** ¿Qué lineamientos generales considera importantes para controlar la extracción estructurada y reducir respuestas no sustentadas en el documento? ¿Zero-shot, few-shot u otro enfoque sería un punto de partida razonable para documentos como certificados notariales?

> **Respuesta del experto:**
> - Definir un output estructurado.
> - Técnicas de prompt engineering.
> - Workflows o agentes de tipo evaluador-crítico.
> - Few-shots.
> - Colocar guardrails en el prompt (límites explícitos).

**13.** ¿Cómo podría detectarse que una extracción fue incompleta o de baja calidad antes de confiar en el resultado? ¿Qué señales o indicadores deberían monitorearse?

> **Respuesta del experto:**
> - **Antes de salir a producción:** validaciones y pruebas exhaustivas.
> - **Post-despliegue:** uso de herramientas de monitoreo como MLflow, Ray y Grafana para revisar métricas y permitir evaluación humana con feedback.
> - **En tiempo de ejecución:** validar campos obligatorios en el output estructurado y habilitar `logprobs` de los LLMs —que informan la probabilidad de certeza de los tokens—; si el valor es bajo respecto a un umbral definido, el resultado se marca como pendiente de revisión.

---

## Bloque 5 — Soberanía, privacidad y operación multi-tenant

*¿Qué restricciones y condiciones mínimas aplican para procesar documentos sensibles con LLM?*

**14.** ¿Qué condiciones o garantías mínimas deberían revisarse antes de usar un proveedor LLM cloud para procesar documentos con datos personales o sensibles? ¿Qué aspectos contractuales o técnicos son críticos?

> **Respuesta del experto:**
> - Revisar las políticas de privacidad de datos del proveedor.
> - Verificar los límites de tokens por minuto y requests por minuto.
> - Evaluar el uso de batch prediction para volúmenes altos.

**15.** ¿Existen opciones de procesamiento local u on-premise que considera maduras para este caso de uso? ¿Bajo qué condiciones recomendaría explorarlas frente a opciones cloud certificadas?

> **Respuesta del experto:** Gemma4, DeepSeek-OCR y otros VLMs son opciones viables on-premise; sin embargo, se debe evaluar la infraestructura necesaria para soportar atributos de calidad como tiempo de respuesta y uso de recursos, además de validar la precisión obtenida.

**16.** ¿Qué riesgos o limitaciones anticiparía para una solución que debe operar con múltiples tenants con distintos niveles de sensibilidad documental y distintos requisitos de soberanía?

> **Respuesta del experto:**
> - Limitaciones de tokens o requests por minuto; para esto se recomienda el uso de LLM Gateways.
> - Limitaciones de consumo o uso por cliente; también se mitigan con LLM Gateways.

---

## Bloque 6 — Riesgos críticos de implementación

*¿Cuáles son los riesgos técnicos más importantes a anticipar?*

**17.** ¿Qué riesgos técnicos considera más críticos para este tipo de sistema? Puede incluir aspectos como: documentos escaneados de baja calidad, tablas complejas, sellos, firmas, documentos largos, variabilidad entre lotes o cualquier otro que considere relevante.

> **Respuesta del experto:**
> - **Calidad de documentos:** documentos de mala calidad impactan directamente la precisión.
> - **Tablas complejas:** incluir en los prompts prácticas como extraer la información en Markdown u otros formatos estructurados fáciles de procesar.
> - **Imágenes relevantes:** en los prompts incluir instrucciones para que el modelo las describa cuando sean importantes.
> - **Headers, footers y documentos de muchas páginas:** la precisión puede degradarse; requiere consideración especial en el diseño del prompt.

**18.** ¿Qué limitaciones técnicas conocidas de los modelos LLM actuales podrían ser problemáticas para extracción estructurada de documentos del sector notarial y constructor colombiano?

> **Respuesta del experto:** Las alucinaciones son la principal limitación técnica a controlar.

**19.** ¿Qué factores de costo, latencia o escalabilidad considera que deberían tenerse en cuenta desde el diseño, incluso antes de una prueba exploratoria?

> **Respuesta del experto:** Precisión y latencia son los factores que deben tenerse en cuenta desde el diseño.

---

## Bloque 7 — Evaluación exploratoria posterior

*¿Qué pruebas mínimas deberían hacerse antes de tomar decisiones de implementación?*

**20.** ¿Qué experimentos mínimos recomendaría realizar con documentos reales antes de orientar la selección de un modelo o estrategia de extracción? ¿Cuántos documentos y de qué tipos serían representativos para una primera evaluación?

> **Respuesta del experto:** Realizar pruebas de precisión con al menos 100 documentos de diferente tipo: escaneados, creados digitalmente en PDF, y documentos representativos de los que se usarán en producción. Evaluar con varios modelos en una prueba ciega y complementar con revisión humana.

**21.** ¿Qué criterios utilizaría para decidir si un enfoque vale la pena continuar explorando? ¿Qué señales indicarían que un candidato debe descartarse temprano?

> **Respuesta del experto:** Métricas de precisión y recall por debajo de los umbrales esperados son la señal para descartar un candidato temprano.

**22.** ¿Qué aspectos del diseño actual considera que requieren validación con documentos reales antes de poder afirmar que el enfoque es viable?

> **Respuesta del experto:** La clasificación de documentos, el OCR y la extracción de entidades deben evaluarse obligatoriamente con documentos reales.

---

## Bloque 8 — Recomendaciones y advertencias finales

*Espacio para alertas tempranas, supuestos débiles y recomendaciones generales.*

**23.** ¿Qué supuestos del diseño actual le parecen más débiles o arriesgados desde la perspectiva técnica? ¿Cuáles requieren validación urgente?

> **Respuesta del experto:**
> - Escalabilidad mediante tokens o requests por minuto (requiere validación urgente).
> - Evaluar el uso de batch inference.
> - Uso de herramientas adecuadas para monitoreo y experimentación de LLMs, como MLflow.
> - Uso de LLM Gateway para fallbacks, retries, balanceo de carga y caché.

**24.** ¿Hay aspectos de la necesidad o del diseño que, en su experiencia, suelen subestimarse en proyectos de extracción documental con LLM?

> **Respuesta del experto:** La escalabilidad en términos de tokens o requests por minuto es el aspecto más subestimado en este tipo de proyectos.

**25.** ¿Qué recomendaría priorizar en un análisis exploratorio de 4–6 semanas para avanzar con confianza razonable hacia una prueba de concepto formal?

> **Respuesta del experto:**
> - Precisión de los LLMs.
> - Latencia.
> - Costo.
> - Uso de batch inference.
> - Uso de LLM Gateway.

---

## Plantilla de evaluación comparativa preliminar

> Esta plantilla puede ser utilizada como referencia durante la consulta. El experto puede completar, ajustar o reformular las columnas según su criterio. No representa un ranking final ni una selección cerrada; su propósito es orientar el análisis exploratorio posterior. Las versiones y disponibilidad de modelos deben ser confirmadas por el experto según el estado actual del mercado.

| Modelo / familia | Tipo | Procesa PDF directo | Procesa imágenes | DOCX/XLSX o equiv. | Structured output | Evidencia por campo | Soberanía | On-prem viable | Límite contexto | Costo est. | Latencia | Riesgo principal | ¿Explorar? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GPT-4o / equivalente | Cloud | TBD | Sí | TBD | Sí | TBD | DPA Enterprise | No | TBD | TBD | TBD | TBD | TBD |
| Gemini / equivalente | Cloud | TBD | Sí | TBD | Sí | TBD | DPA Vertex AI | No | TBD | TBD | TBD | TBD | TBD |
| Claude / equivalente | Cloud | TBD | Sí | TBD | Sí | TBD | DPA | No | TBD | TBD | TBD | TBD | TBD |
| Llama / equivalente | Local | No nativo | Con multimodal | TBD | TBD | TBD | Alta | Sí | TBD | TBD | TBD | TBD | TBD |
| Qwen-VL / MiniCPM-V / equiv. | Local | No nativo | Sí | TBD | TBD | TBD | Alta | Sí | TBD | TBD | TBD | TBD | TBD |
| LLaVA / equivalente | Local | No nativo | Sí | TBD | TBD | TBD | Alta | Sí | TBD | TBD | TBD | TBD | TBD |
| Otro candidato (experto) | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

---

*Las respuestas escritas del experto serán integradas en el [micrositio de análisis del proyecto](index.html) y servirán como insumo para diseñar la evaluación exploratoria posterior con documentos reales. Cualquier recomendación preliminar formulada aquí no equivale a un veredicto técnico definitivo ni reemplaza una prueba de concepto formal.*

