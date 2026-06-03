# Lineamientos transversales del experto técnico

**Fuente:** Sesión de validación experta — junio 2026  
**Alcance:** Recomendaciones genéricas que aplican a ambos micrositios:  
- **Agent** — MultiAgents System Marketing (Adaptador de Contenido Institucional)  
- **RAG** — Document Intelligence Engine MultiTenant  

> Este documento abstrae exclusivamente los lineamientos con aplicabilidad cruzada. Las recomendaciones específicas de cada micrositio permanecen en sus carpetas de contexto respectivas.

---

## 1. LLM/VLM como procesamiento multimodal nativo

**Posición del experto:** Los LLMs y VLMs reemplazan el OCR tradicional con ventajas de contexto, precisión y escalabilidad. El OCR con fine-tuning por documento es costoso e innecesario para la mayoría de casos.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Lectura de manuales de marca, guías visuales y documentos de lineamientos institucionales |
| RAG | Extracción de texto, tablas y entidades de certificados notariales, contratos y pólizas |

**Implicación:** En ninguno de los dos sistemas se debe incorporar OCR tradicional como paso obligatorio en V1. El flujo principal usa LLM/VLM directo con zero-shot o few-shot.

---

## 2. Salidas estructuradas (structured output)

**Posición del experto:** Siempre definir un esquema de salida explícito al modelo. Mejora precisión, reduce alucinaciones y facilita validación automática de campos.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Extracción de atributos de marca (tono, blacklist, restricciones, valores) en esquema reutilizable por agentes |
| RAG | Extracción de entidades (fechas, partes, montos, cláusulas) con tipos de datos definidos por schema |

**Implicación:** Ningún flujo de inferencia debe devolver texto libre cuando el destino es procesamiento posterior. El schema es parte del diseño del prompt, no del postprocesamiento.

---

## 3. Patrón crítico-evaluador

**Posición del experto:** Un agente genera, otro evalúa si el resultado cumple los lineamientos. Este patrón mejora precisión de forma iterativa sin requerir fine-tuning.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Agente creativo genera imagen/texto → agente evaluador verifica adherencia a marca (tono, palabras, restricciones visuales) |
| RAG | Agente extractor procesa documento → agente validador verifica que los campos provengan del documento fuente y no del conocimiento interno del modelo |

**Implicación:** Diseñar este patrón desde V1 en los flujos de mayor riesgo de calidad. El número de iteraciones del ciclo es una variable de control de costo.

---

## 4. Few-shots en prompts

**Posición del experto:** Los few-shots son la primera medida de mejora de calidad antes de evaluar fine-tuning o enfoques más costosos.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Ejemplos de campañas alineadas a marca para guiar generación estratégica y creativa |
| RAG | Ejemplos de extracciones correctas por tipo de documento para guiar extracción estructurada |

**Implicación:** Construir y mantener un corpus de ejemplos representativos por caso de uso. Es la inversión de menor costo con mayor retorno inmediato en calidad.

---

## 5. GuardRails explícitos en prompts

**Posición del experto:** Definir límites explícitos en el prompt para acotar el comportamiento del modelo y reducir respuestas no sustentadas.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Blacklist/whitelist de palabras; restricciones de tono; perspectiva narrativa definida; valores y misión de la organización |
| RAG | Restricción de responder solo con información presente en el documento fuente; indicación de devolver campo vacío o nulo si no está presente |

**Implicación:** Los guardRails son parte del diseño funcional del prompt, no un ajuste posterior. Deben documentarse como atributos de configuración del agente.

---

## 6. Agentes con roles únicos y acotados

**Posición del experto:** Cada agente debe tener entre uno y tres objetivos cohesionados. Instrucciones largas con muchas herramientas degradan la precisión del modelo e incrementan alucinaciones y latencia.

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Separar agente estratégico, agente creativo, agentes por canal, agente evaluador. No concentrar todo en un agente orquestador con docenas de herramientas |
| RAG | Separar agente clasificador de documentos, agente extractor por tipo, agente validador. No resolver clasificación + extracción + validación en un solo paso |

**Implicación:** El diseño modular por agente es una práctica de calidad, no solo de arquitectura. La granularidad de roles impacta directamente la precisión de los resultados.

---

## 7. Skills para agentes (ADK)

**Posición del experto:** Dar skills a los agentes mejora su capacidad de planificación, razonamiento y actuación (plan, reasoning, acting). Referencia: [adk.dev/skills](https://adk.dev/skills/)

| Micrositio | Aplicación concreta |
|---|---|
| Agent | Skills de mejores prácticas por red social; skill de alineación con marca institucional |
| RAG | Skills de validación documental; skill de clasificación por tipo de documento |

---

## 8. Métricas de observabilidad base

**Posición del experto:** Instrumentar desde V1 un conjunto mínimo de señales para detectar problemas de costo, calidad y comportamiento.

**Métricas transversales (aplican a ambos):**

| Métrica | Propósito |
|---|---|
| Tokens de entrada y salida | Control de costo y detección de prompts excesivos |
| Tokens de thinking (si aplica) | Costo de razonamiento en modelos con cadena de pensamiento |
| Latencia por inferencia | Calidad de experiencia y detección de degradación |
| Uso de recursos (RAM, CPU, red) | Planificación de infraestructura y alertas |
| Costo estimado por ejecución | Proyección y control de presupuesto operativo |

**Métricas específicas por tipo de tarea:**

| Tarea | Métrica adicional |
|---|---|
| Extracción de entidades (RAG) | Precisión, recall y F1-score; logprobs de entidades detectadas |
| Generación evaluada (Agent + RAG) | Score de adherencia por iteración en patrón crítico-evaluador |
| Número de iteraciones del ciclo evaluador | Variable de control de costo y calidad convergente |

---

## 9. Herramientas de experimentación y monitoreo

**Posición del experto:** Usar herramientas especializadas para LLMs en lugar de soluciones genéricas de logging.

| Herramienta | Uso recomendado |
|---|---|
| **MLflow** | A/B testing de modelos, hiperparámetros y prompts; monitoreo en producción |
| **Vertex AI Evaluation** | Evaluación sistemática de calidad de modelos candidatos |
| **Ray** | Observabilidad distribuida en inferencia a escala |
| **Grafana** | Dashboards de métricas operativas en tiempo real |

**Implicación:** Antes de decidir modelo o estrategia de inferencia en cualquiera de los dos micrositios, se deben ejecutar experimentos medidos con estas herramientas. No tomar decisiones por preferencia sin evidencia experimental.

---

## 10. LLM Gateway

**Posición del experto:** Ante carga multi-tenant y límites de tokens/requests por minuto, un LLM Gateway es la solución de escalabilidad recomendada.

**Capacidades que debe proveer:**

- Fallbacks automáticos entre proveedores/modelos
- Retries con backoff ante errores transitorios
- Balanceo de carga entre instancias o proveedores
- Caché de respuestas para consultas repetidas
- Control de cuota por tenant o cliente

| Micrositio | Escenario de activación |
|---|---|
| Agent | Múltiples organizaciones generando campañas en simultáneo; generación masiva de variantes por canal |
| RAG | Múltiples tenants procesando lotes de documentos; picos de ingesta documental |

---

## 11. Batch inference

**Posición del experto:** Evaluar el uso de batch inference/batch prediction para optimizar costo y gestionar límites de rate en operaciones no urgentes.

| Micrositio | Casos de uso |
|---|---|
| Agent | Generación masiva de variantes de campaña para múltiples canales |
| RAG | Procesamiento de lotes grandes de documentos (ingesta inicial o actualizaciones periódicas) |

---

## 12. Aislamiento de contexto por tenant

**Posición del experto:** Frameworks como ADK generan sesiones con contexto y estado únicos por usuario/organización. No hay contaminación de contexto entre tenants si se diseña correctamente.

**Mecanismos recomendados:**
- Sesión nueva por usuario/organización (contexto aislado)
- Memory bank privado por tenant (memoria a largo plazo de la organización)
- Memory bank compartido opcional para enriquecer la aplicación en general (sin datos sensibles)
- Callbacks para recuperar sesiones anteriores del mismo tenant

| Micrositio | Dato sensible a aislar |
|---|---|
| Agent | Contexto de marca, historial de campañas, lineamientos institucionales |
| RAG | Documentos, extracciones y esquemas de cada organización cliente |

---

## 13. Experimentación con datos reales antes de MVP

**Posición del experto:** No tomar decisiones de modelo o estrategia sin experimentar con datos reales representativos del caso de uso productivo.

| Micrositio | Mínimo recomendado |
|---|---|
| Agent | Probar con documentos de marca y campañas reales de al menos un cliente piloto; evaluar múltiples prompts e hiperparámetros por tarea |
| RAG | 100 documentos de diferentes tipos (digitales nativos, escaneados, PDFs generados); evaluación a ciegas con revisión humana |

**Criterio de descarte temprano:** Métricas de precisión y recall por debajo de lo esperado son señal de descarte del candidato, no de ajuste incremental.

---

## 14. Modelos candidatos y criterios de selección

**Posición del experto:** Evaluar mediante experimentos, no por preferencia. Usar una matriz ponderada con múltiples criterios.

**Candidatos mencionados:**

| Modelo / Familia | Fortaleza relevante |
|---|---|
| Gemini (Google) | Multimodal, alto rendimiento en español, buena integración con ADK |
| OpenAI (GPT-4o y familia) | Multimodal, amplio soporte de herramientas, structured output maduro |
| Gemma 4 | Open source, opción local/on-premise, multimodal |
| PaliGemma | VLM especializado en visión-lenguaje, opción local |
| DeepseekOCR | Especializado en tareas de OCR/extracción visual |

**Nota del experto:** Modelos no fuertes en multimodal (ej. Claude en versiones anteriores) no son recomendados para tareas de extracción visual o lectura de documentos.

**Criterios de evaluación (por orden de relevancia indicado):**

1. Precisión en la tarea específica
2. Latencia
3. Costo por token / por operación
4. Capacidad multimodal
5. Tooling y ecosistema de integración

---

## 15. Alucinaciones como riesgo transversal

**Posición del experto:** Las alucinaciones son el riesgo técnico más importante en ambos sistemas. No son eliminables, pero sí controlables con múltiples mecanismos combinados.

**Mecanismos de mitigación (aplicables a ambos):**

| Mecanismo | Efecto |
|---|---|
| Structured output | Restringe el espacio de respuesta a un schema predefinido |
| GuardRails en prompt | Instruye explícitamente al modelo sobre límites de respuesta |
| Few-shots | Ancla el comportamiento a ejemplos correctos conocidos |
| Patrón crítico-evaluador | Detecta y corrige respuestas incorrectas antes de usarlas |
| Logprobs de entidades | Señal cuantitativa de certeza del modelo por campo extraído |
| Validación de campos obligatorios | Detecta extracciones incompletas antes de persistir resultados |
| Revisión humana en flujos críticos | Última línea de control en decisiones de alto impacto |

---

## Referencias cruzadas

| Lineamiento | Pregunta Agent | Pregunta RAG |
|---|---|---|
| LLM como OCR/multimodal | P-00, P-01 | Q3, Q5, Q6 |
| Structured output | P-03 | Q10, Q11, Q12 |
| Patrón crítico-evaluador | P-04, P-06 | Q4, Q11, Q12 |
| Few-shots | P-00, P-01 | Q4, Q12 |
| GuardRails | P-03 | Q11, Q12 |
| Roles acotados por agente | P-06 | Q4 |
| Métricas de observabilidad | P-07 | Q10, Q13 |
| MLflow / herramientas | P-07, P-09 | Q4, Q13, Q25 |
| LLM Gateway | P-08 (implícito) | Q16, Q23, Q24, Q25 |
| Batch inference | — | Q14, Q25 |
| Aislamiento multi-tenant | P-08 | Q14, Q15, Q16 |
| Experimentación previa | P-09 | Q20, Q21, Q25 |
| Modelos candidatos | P-09 | Q7, Q8, Q9 |
| Alucinaciones | P-06 | Q18 |
