# Preguntas para experto técnico

> Esta página valida decisiones iniciales de la arquitectura TO-BE optimizada. No abre la arquitectura desde cero.
>
> Enfoque de consulta: confirmar decisiones ya propuestas, definir umbrales medibles y cerrar riesgos clave en máximo 20 horas.

---

## 1. Objetivo de la consulta

Validar y ajustar decisiones técnicas de alto impacto para el Adaptador de Contenido Institucional, con salida accionable para cerrar MVP y roadmap V2/V3.

## 2. Restricción de tiempo y forma de respuesta

| Parámetro | Valor |
|---|---|
| Tiempo máximo total | 20 horas hábiles |
| Enfoque | Validar decisiones iniciales propuestas |
| Formato esperado | Respuesta estructurada con umbral y recomendación |
| Lo que no se pide | Implementación completa, PoC extensa, benchmark exhaustivo |

---

## 3. Estimación de tiempo

Por definir

---

## 4. Preguntas priorizadas para validación

### P-00. Formalización de lectura de marca con LLM (sin OCR)

**Decisión propuesta para formalizar:**
La lectura de manuales de marca institucional en MVP se realiza con LLM multimodal como camino principal. OCR no forma parte del flujo objetivo de V1.

**Flujo al que aplica:**
Aplica al flujo de onboarding o actualización de contexto institucional, cuando un usuario administrador carga manuales de marca, guías visuales o documentos de lineamientos para que el sistema los convierta en reglas reutilizables por los agentes. La pregunta busca confirmar si ese flujo puede operar con lectura multimodal directa del documento, sin introducir OCR como paso estándar de V1.

**Pregunta al experto:**
¿Se formaliza esta decisión como lineamiento técnico vigente para MVP, con revisión humana de los campos críticos extraídos?

**Respuesta esperada:**
Sí/No con condiciones explícitas de calidad mínima, tipos documentales cubiertos y excepciones permitidas.

**Criterio de validación:**
Si la respuesta es afirmativa, el diseño base de BrandGuidelinesStore se congela con pipeline LLM multimodal + validación humana, sin incorporar OCR en V1.

---

### P-01. Cobertura de LLM multimodal en manuales de marca

**Decisión inicial propuesta:**
Usar LLM multimodal directo para PDF/DOCX/imágenes de marca en el flujo principal.

**Flujo al que aplica:**
Aplica al mismo flujo de carga y lectura de documentos de marca, pero ya no desde la decisión conceptual sino desde su cobertura real en operación. El usuario sube PDFs, DOCX o imágenes institucionales y el sistema debe extraer tono, restricciones, activos y lineamientos aun cuando el documento tenga tablas, anexos, capturas o páginas parcialmente escaneadas.

**Pregunta al experto:**
¿Qué cobertura real de calidad se espera para documentos institucionales complejos (tablas, anexos, versiones escaneadas parciales)?

**Respuesta esperada:**
Tabla por tipo de documento, calidad esperada, riesgo y recomendación operativa.

**Criterio de validación:**
La cobertura objetivo para operación estable de V1 debe ser >=80% en los documentos típicos del segmento.

---

### P-02. Estrategia híbrida de recuperación de contexto

**Decisión inicial propuesta:**
Usar recuperación híbrida gradual: base estructurada para contexto crítico y capa documental/vectorial para anexos extensos.

**Flujo al que aplica:**
Aplica al flujo en el que un usuario quiere generar una campaña nueva o reutilizar campañas anteriores y el sistema debe recuperar contexto útil desde dos fuentes: datos estructurados persistidos y documentos históricos extensos, como briefs, aprobaciones, piezas previas o anexos largos. La pregunta busca validar si ese flujo debe resolverse con una estrategia híbrida o si conviene irse desde V1 por un enfoque más simple y único.

**Pregunta al experto:**
¿La estrategia híbrida propuesta es adecuada para MVP multicliente con memoria organizacional y restricciones institucionales?

**Respuesta esperada:**
Riesgos, ajustes recomendados y condición para activar vector DB desde V1.

**Criterio de validación:**
Si >70% del contexto crítico queda modelado estructuradamente, se mantiene prioridad estructurada.

---

### P-03. Representacion minima de marca util para el modelo

**Decisión inicial propuesta:**
Extraer y persistir un conjunto acotado de atributos de marca que realmente mejore el comportamiento del modelo en generación de campañas.

**Flujo al que aplica:**
Aplica al flujo donde un usuario carga manuales de marca y luego espera que el modelo genere campañas alineadas con identidad, tono y restricciones institucionales. La pregunta no busca definir todo el modelo de datos del producto, sino identificar qué atributos realmente condicionan la inferencia y mejoran la calidad de salida del modelo.

**Pregunta al experto:**
¿Qué atributos de marca o contexto institucional suelen aportar más señal útil al modelo en generación controlada y cuáles aportan poco valor práctico en una primera versión?

**Respuesta esperada:**
Lista de atributos de alta señal para el modelo + atributos secundarios o diferibles, con justificación.

**Criterio de validación:**
La salida debe permitir priorizar un conjunto pequeño de variables que mejore consistencia, tono y restricciones sin sobrecargar el contexto de inferencia.

---

### P-04. Uso de modelos generativos de imagen bajo restricciones de marca

**Decisión inicial propuesta:**
Tratar la generacion de imagen con IA como capacidad opcional y controlada, evaluando si los modelos actuales permiten respetar lineamientos institucionales con suficiente consistencia.

**Flujo al que aplica:**
Aplica al flujo de producción de piezas visuales cuando, además del texto, se evalúa si un modelo generativo puede proponer o producir imágenes alineadas con lineamientos institucionales. El foco aquí es estrictamente técnico: qué tan controlable es hoy la generación o adaptación de imagen respecto a estilo, consistencia de marca, restricciones visuales y variabilidad no deseada.

**Pregunta al experto:**
¿Qué tan viable es usar modelos generativos de imagen o edición asistida para producir piezas institucionales con restricciones de marca estrictas, y qué mecanismos de control recomendaría explorar?

**Respuesta esperada:**
Evaluacion de viabilidad, riesgos tecnicos y tecnicas recomendadas de control (prompting, reference images, adapters, human review).

**Criterio de validación:**
Si el experto identifica alta variabilidad o bajo control sobre identidad visual, la generacion de imagen no debe tratarse como capacidad central del MVP.

---

### P-05. Adaptacion de salidas por canal con modelos

**Decisión inicial propuesta:**
Usar el sistema para generar variantes de contenido por canal a partir de un mismo contexto institucional y una misma intención de campaña.

**Flujo al que aplica:**
Aplica al flujo donde, a partir de una estrategia o brief, el sistema debe producir piezas distintas para email, Instagram, WhatsApp o web/intranet. La pregunta busca entender si esa adaptación puede resolverse con un solo modelo y buen prompting, o si conviene usar especialización por tipo de salida, plantillas o validaciones distintas según canal.

**Pregunta al experto:**
¿Qué tan realista es esperar que un mismo modelo genere salidas consistentes y de calidad para varios canales, y en qué casos recomendaría separar prompts, validadores o incluso familias de modelos por tipo de pieza?

**Respuesta esperada:**
Tabla o lista por canal con nivel de dificultad, riesgos de calidad y recomendacion tecnica de especializacion.

**Criterio de validación:**
La respuesta debe permitir decidir si la adaptacion multicanal puede construirse sobre un nucleo comun de inferencia o si requiere tratamiento diferenciado desde el MVP.

---

### P-06. Separacion entre agente estrategico y agente creativo

**Decisión inicial propuesta:**
Mantener una separacion entre una etapa de generacion estrategica y una etapa de generacion creativa, en lugar de resolver todo con una sola inferencia monolitica.

**Flujo al que aplica:**
Aplica al flujo donde primero se produce un encuadre estrategico de campaña y luego se generan piezas concretas. La pregunta busca saber si, desde el punto de vista de modelos, conviene separar esas tareas para reducir confusiones de instruccion, mejorar control y permitir evaluacion intermedia, o si un solo paso de inferencia podria ser suficiente.

**Pregunta al experto:**
¿La separacion entre etapa estrategica y etapa creativa suele mejorar calidad, control y trazabilidad del resultado frente a una sola inferencia end-to-end? ¿En que condiciones no valdria la pena?

**Respuesta esperada:**
Comparativa entre pipeline por etapas vs inferencia unica, con riesgos y condiciones de uso.

**Criterio de validación:**
Si el experto considera que separar tareas mejora control y reduce errores de instruccion, se mantiene el enfoque modular para V1.

---

### P-07. Evaluacion y observabilidad de calidad del modelo

**Decisión inicial propuesta:**
Instrumentar en V1 un conjunto minimo de señales para medir calidad, costo y estabilidad del comportamiento del modelo.

**Flujo al que aplica:**
Aplica al seguimiento de todos los pasos donde interviene inferencia: lectura de marca, recuperacion de contexto, generacion estrategica y produccion de piezas. La pregunta busca definir que debe observarse para saber si el modelo esta fallando por costo, latencia, deriva de calidad, baja adherencia a marca o uso deficiente del contexto.

**Pregunta al experto:**
¿Qué metricas o señales considera criticas para evaluar la calidad del modelo en V1 y detectar fallas relevantes sin depender solo de juicio subjetivo humano?

**Respuesta esperada:**
Lista priorizada de metricas o señales de evaluacion: adherencia a instrucciones, consistencia de tono, grounding, latencia, costo, tasa de retrabajo u otras.

**Criterio de validación:**
La salida debe permitir definir un set minimo de evaluacion continua del modelo para piloto controlado.

---

### P-08. Privacidad y aislamiento en flujos soportados por modelos

**Decisión inicial propuesta:**
Operar modelos o proveedores de IA sobre informacion de multiples organizaciones sin contaminar contexto, caches, prompts ni trazas entre tenants.

**Flujo al que aplica:**
Aplica a todos los flujos donde el sistema envia contexto institucional a modelos para leer documentos, recuperar historico o generar piezas. La pregunta no se centra en RBAC o arquitectura general, sino en los riesgos propios del uso de modelos: mezcla accidental de contexto, retencion en logs, entrenamiento no deseado, fugas via prompts o caches compartidos.

**Pregunta al experto:**
¿Qué riesgos especificos de privacidad o contaminacion de contexto deben vigilarse cuando un mismo sistema de modelos atiende multiples organizaciones, y que salvaguardas considera minimas?

**Respuesta esperada:**
Lista de riesgos y salvaguardas tecnicas relacionadas con uso de modelos, memoria, logs, caches, fine-tuning y politicas del proveedor.

**Criterio de validación:**
La respuesta debe permitir definir controles minimos para usar modelos con informacion institucional sensible sin riesgo alto de mezcla o exposicion entre tenants.

---

### P-09. Criterios para proveedor LLM

**Decisión inicial propuesta:**
Seleccionar proveedor con matriz ponderada, no por preferencia única.

**Flujo al que aplica:**
Aplica a varios flujos donde interviene IA, especialmente lectura de contexto institucional, generación estratégica y producción creativa. La pregunta busca definir con qué criterios debe elegirse el proveedor o familia de modelos que soportará esos flujos, considerando español institucional colombiano, costo, latencia, seguridad, calidad de salida y facilidad de operación.

**Pregunta al experto:**
¿Qué criterios y pesos recomienda para español institucional colombiano?

**Respuesta esperada:**
Matriz con pesos (100%) y candidatos prioritarios.

**Criterio de validación:**
La matriz debe ser utilizable por comité técnico para decisión de MVP.

---


## 5. Matriz resumida de uso de respuestas

| Pregunta | Decisión que valida | Umbral principal | Acción si se cumple | Acción si no se cumple |
|---|---|---|---|---|
| P-00/P-01 | Lectura de marca con LLM | Cobertura documental >=80% | Mantener LLM multimodal sin OCR en V1 | Replantear alcance documental de V1 |
| P-02 | Recuperación de contexto | Contexto estructurable >70% | Base estructurada + vectorial opcional | Priorizar diseño vectorial desde V1 |
| P-03 | Variables de marca para inferencia | Alta señal util para el modelo | Priorizar set corto de contexto | Reducir o rediseñar atributos cargados al prompt |
| P-04 | Generación visual con IA | Control aceptable de consistencia | Explorar uso controlado de imagen IA | Sacar esa capacidad del núcleo MVP |
| P-05 | Adaptación multicanal | Calidad consistente por canal | Mantener núcleo común con especialización ligera | Separar prompts, validadores o modelos |
| P-06 | Pipeline por etapas | Mejora control/calidad frente a inferencia única | Mantener separación estratégico/creativo | Simplificar o rediseñar pipeline |
| P-07 | Evaluación del modelo | Set mínimo de señales objetivas | Instrumentar evaluación continua | Reforzar medición antes del piloto |
| P-08 | Privacidad en uso de modelos | Sin riesgo alto de contaminación entre tenants | Operar con salvaguardas mínimas definidas | Restringir proveedores o memoria compartida |
| P-09 | Selección LLM | Matriz ponderada lista | Seleccionar candidato MVP | Ajustar criterios |

---

## 6. Resultado esperado para el micrositio

Las respuestas de esta página alimentan directamente la [Arquitectura TO-BE optimizada](to-be-arquitectura.html) para pasar decisiones de estado propuesta a estado validada.

Trazabilidad: [Arquitectura TO-BE](to-be-arquitectura.html) · [Mapa de módulos](decisiones-modulos.html) · [Objetivos funcionales](to-be-objetivos-funcionales.html)
