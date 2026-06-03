# Arquitectura TO-BE optimizada de la solución

> Esta página presenta la arquitectura objetivo del Adaptador de Contenido Institucional como una propuesta completa, autosuficiente y ejecutable. Define el modelo técnico para operar con contexto organizacional persistente, gobernanza humana, trazabilidad y adaptación multicanal.

## Síntesis de la arquitectura objetivo

La arquitectura TO-BE optimizada consolida una estructura técnica lista para implementación por fases. Mantiene el contexto organizacional como activo central y lo operacionaliza con servicios, flujos y decisiones técnicas concretas.

La decisión de arquitectura para el micrositio es:

```text
Arquitectura TO-BE optimizada = visión funcional institucional + componentes técnicos implementables + roadmap por fases
```

---

## 1. Propósito de la arquitectura TO-BE optimizada

La arquitectura TO-BE optimizada define componentes, flujos y decisiones técnicas para materializar un sistema agéntico institucional que:

- recuerda el contexto de cada organización sin reiniciar la conversación en cada sesión;
- aplica lineamientos de marca y restricciones institucionales en la generación;
- mantiene validación humana obligatoria y trazabilidad;
- adapta contenido por canal con salida exportable desde MVP;
- escala por fases sin rediseñar el núcleo.

Esta arquitectura no reemplaza el enfoque funcional TO-BE. Lo vuelve ejecutable con componentes técnicos concretos y una ruta de entrega por fases.

---

## 2. Principios de diseño

| Principio | Descripción |
|---|---|
| Contexto persistente como núcleo | OrganizationalContextStore y BrandGuidelinesStore son el corazón funcional y técnico del MVP. |
| Gobernanza humana obligatoria | No hay publicación automática obligatoria en MVP; toda salida pasa por validación humana. |
| Offline-first en MVP | V1 prioriza exportación asistida para reducir riesgo regulatorio y operativo. |
| Multi-cliente desde el modelo inicial | Se adopta aislamiento mínimo viable por tenant desde Sprint 0 para evitar rediseño posterior. |
| Servicios modulares | Cada componente tiene responsabilidad explícita y evolución por fases V1/V2/V3. |
| Trazabilidad integral | Cada acción registra usuario, organización, contexto usado, salida y decisión humana. |
| Evolución gradual de complejidad | V1 resuelve valor diferencial; V2/V3 agregan automatización y escalamiento. |

---

## 3. Roadmap técnico propuesto por fases

| Fase | Objetivo | Componentes principales | Resultado esperado | Riesgo controlado |
|---|---|---|---|---|
| Sprint 0 | Preparación técnica y modelo base de datos | Modelo de organización, usuarios, tenant, contexto, marca, campañas | Base mínima para arquitectura multi-organización | Evita rediseño posterior de datos |
| V1 MVP | Contexto persistente + generación/adaptación asistida + exportación | OrganizationalContextStore, BrandGuidelinesStore, OnboardingService, CompletenessScorer, StrategicAgent, CreativeAgent (orquestador), Agentes de canal (LinkedIn/Instagram/Email/WhatsApp), CriticAgent, HumanValidationModule | Flujo completo controlado sin publicación automática obligatoria | Reduce riesgo regulatorio y de alcance |
| V2 | Automatización controlada y métricas avanzadas | Integraciones API, programación de publicaciones, métricas por canal, aprendizaje histórico | Mayor cierre operativo del ciclo de campaña | Evita automatizar antes de validar gobernanza |
| V3 | Escalamiento multi-cliente y optimización avanzada | Multi-tenant avanzado, analítica comparativa, recomendaciones, evaluación automática | Producto escalable y gobernado | Controla complejidad empresarial |

---

## 4. Vista lógica de alto nivel

> Validado: P-05 / P-06 / P-08 — Junio 2026.

El sistema se organiza en ocho capas lógicas, con agentes especializados, LLM Gateway y framework ADK para aislamiento multi-tenant:

```text
Experiencia: web/chat guiado + onboarding + preview + histórico
Orquestación: StrategicAgent + CriticAgent + CreativeAgent[por canal] + flujo de aprobación
Contexto: ContextRetrievalService + filtros por tenant + restricciones
Datos: OrganizationalContextStore + BrandGuidelinesStore + CampaignHistoryStore
IA: ADK framework + salidas estructuradas (schema en prompt) + LLM/VLM provider abstraction
LLM Gateway: rate-limit por tenant + retries + fallbacks + caché + batch routing
Canales: LinkedInAgent || InstagramAgent || WhatsAppAgent || EmailAgent (paralelo)
Infraestructura: TenantIsolationLayer + ObservabilityService (MLflow + Grafana + Ray)
```

<div class="diagram-block">
<p class="diagram-label">Vista Lógica de Alto Nivel — 7 Capas del Sistema</p>
<img src="assets/img/diagramas/to-be-arquitectura-capas-logicas.png" alt="Vista Lógica de Alto Nivel — Adaptador de Contenido Institucional">
<div class="diagram-links">
<a href="assets/plantuml/to-be-arquitectura-capas-logicas.plantuml" download> Fuente PlantUML</a>
</div>
</div>

**Agentes en el sistema TO-BE validado:**

| Agente | Rol | Objetivos (max 3) |
|---|---|---|
| **StrategicAgent** | Construye el plan de comunicación institucional | 1. Interpretar objetivo y contexto institucional. 2. Generar plan de comunicación con audiencia, canales y mensaje. |
| **CriticAgent** | Evalúa alineación institucional del plan estratégico | 1. Verificar coherencia con marca, tono y restricciones. 2. Devolver feedback accionable. |
| **CreativeAgent** | Genera briefs y coordina agentes de canal | 1. Transformar el plan en brief creativo. 2. Coordinar producción multicanal. |
| **LinkedInAgent** | Produce piezas optimizadas para LinkedIn | 1. Aplicar mejores prácticas LinkedIn. 2. Respetar lineamientos de marca. |
| **InstagramAgent** | Produce piezas optimizadas para Instagram | 1. Aplicar mejores prácticas Instagram. 2. Gestionar artefactos visuales. |
| **WhatsAppAgent** | Produce piezas optimizadas para WhatsApp | 1. Aplicar brevedad y tono conversacional. 2. Usar plantillas aprobadas. |
| **EmailAgent** | Produce piezas optimizadas para email | 1. Aplicar estructura de mailing. 2. Optimizar asunto y preheader. |
| **ImageCriticAgent** | Evalúa piezas visuales contra lineamientos | 1. Score de cumplimiento visual por iteración. 2. Devolver feedback con correcciones específicas. |

![Arquitectura TO-BE - visión general de componentes](assets/img/diagramas/to-be-arquitectura.png)
<a href="assets/plantuml/to-be-arquitectura.plantuml" download class="diagram-download">⬇ Descargar fuente (.plantuml)</a>

---

## 5. Componentes técnicos de la arquitectura TO-BE optimizada

> Validado: P-03 / P-05 / P-06 / P-07 / P-08 — Junio 2026.

| Componente | Responsabilidad | Rol en la arquitectura | Estado propuesto |
|---|---|---|---|
| OrganizationalContextStore | Persistir identidad, audiencias, tono ponderado, restricciones, blacklist/whitelist y contexto institucional | Núcleo de contexto persistente | Núcleo MVP |
| BrandGuidelinesStore / BrandProfileService | Gestionar los 5 atributos de alta señal para el modelo: tono ponderado, blacklist/whitelist, perspectiva narrativa, restricciones y misión/valores | Núcleo de identidad institucional | Núcleo MVP |
| CompletenessScorer | Medir qué tan completo está el perfil institucional (incluyendo los 5 atributos de alta señal) antes de generar piezas | Control de calidad de onboarding | Núcleo MVP |
| OnboardingService | Guiar la creación del perfil institucional persistente con captura de atributos de alta señal | Entrada y validación del perfil | Núcleo MVP |
| CampaignHistoryStore | Guardar campañas, piezas, briefs, métricas y feedback; consultable vía Text-SQL | Memoria organizacional y aprendizaje | Núcleo MVP |
| ContextRetrievalService | Recuperar contexto estructurado con herramientas/Text-SQL; RAG solo para documentos no estructurados | Recuperación contextual para agentes | MVP con diseño simplificado |
| StrategicAgent | Proponer estrategia, objetivos, audiencia, canales y restricciones (1–2 objetivos) | Planeación institucional asistida | Núcleo MVP |
| CriticAgent | Evaluar alineación del plan con marca, tono y restricciones institucionales; devolver score y feedback | Gobernanza de calidad estratégica | Núcleo MVP |
| CreativeAgent | Coordinar brief y producción multicanal (1 objetivo: transformar plan en piezas alineadas) | Orquestador creativo | Núcleo MVP |
| LinkedInAgent | Producir piezas LinkedIn con mejores prácticas del canal + ADK Skills | Agente especializado de canal | Núcleo MVP |
| InstagramAgent | Producir piezas Instagram con mejores prácticas del canal + ADK Artifacts para visuales | Agente especializado de canal | Núcleo MVP |
| WhatsAppAgent | Producir piezas WhatsApp con brevedad y plantillas aprobadas | Agente especializado de canal | Núcleo MVP |
| EmailAgent | Producir mailings con estructura asunto/preheader/cuerpo/CTA | Agente especializado de canal | Núcleo MVP |
| ImageCriticAgent | Evaluar piezas visuales contra lineamientos institucionales; score por iteración | Patrón crítico-evaluador para imagen | V1 (organizaciones sin restricciones regulatorias) |
| HumanValidationModule | Revisar, aprobar, rechazar y registrar decisiones humanas | Gobernanza y control humano | Núcleo MVP |
| Export/PublishingAdapter | Exportación asistida en V1; publicación automática gradual en V2 | Entrega por canal y evolución operativa | V1/V2 |
| ObservabilityService (MLflow + Grafana + Ray) | Registrar tokens, latencia, costos, scores de calidad y métricas de campaña; experimentos A/B con MLflow; dashboards operativos con Grafana; observabilidad distribuida con Ray | Auditoría técnica y selección de modelos | Núcleo MVP |
| **LLM Gateway** | Gestionar todas las llamadas al proveedor LLM: rate-limit por tenant, retries con backoff, fallbacks entre proveedores, caché de respuestas y enrutamiento batch vs. online | Escalabilidad y control de costos en escenarios multi-tenant | **Núcleo MVP** |
| **BatchInferenceQueue** | Cola de tareas asíncronas para generación masiva de variantes de campaña o procesamiento de múltiples organizaciones en simultáneo; enruta al LLM Gateway | Control de costos en operación de alto volumen | V1 (activar según demanda) |
| TenantIsolationLayer (ADK) | Sesiones aisladas por usuario vía ADK; memory banks por tenant_id con callbacks explícitos | Seguridad y aislamiento multi-organización | Sprint 0 / MVP |

---

## 6. Estrategia multi-cliente y aislamiento mínimo viable

La arquitectura TO-BE optimizada implementa diseño multi-cliente temprano con despliegue gradual y controlado.

Lineamientos de implementación inicial:

- tenant_id como llave transversal en entidades de contexto, campañas, piezas, métricas y trazas;
- separación lógica inicial por organización en la base de datos;
- control de acceso por usuario y organización (usuario solo opera dentro de su tenant);
- trazabilidad de acciones por usuario, tenant y timestamp;
- prohibición de compartir campañas, activos o contexto entre clientes;
- endurecimiento progresivo del aislamiento en V2/V3 (políticas, auditoría y hardening).

Resultado esperado en MVP: aislamiento mínimo viable seguro, sin bloquear salida temprana de producto.

---

## 7. Estrategia de recuperación de contexto

> **Decisión validada por experto técnico — P-02 — Junio 2026.**

La estrategia híbrida se mantiene pero se **simplifica** según validación experta: si la información está almacenada de forma estructurada, no es necesario RAG. Con herramientas (tools) que permitan al agente ir a la base de datos —vía queries predefinidos o Text-to-SQL— la información retornada es completa y confiable. RAG aplica solo para información no estructurada (documentos, manuales extensos).

```text
REGLA 1: Datos estructurados → herramientas del agente / Text-SQL
REGLA 2: Documentos no estructurados → RAG / vector DB
REGLA 3: No se activa vector DB por defecto en V1 si el contexto crítico está modelado relacionalmente
```

<div class="diagram-block">
<p class="diagram-label">Estrategia de Recuperación de Contexto — Reglas de decisión (P-02)</p>
<img src="assets/img/diagramas/to-be-estrategia-recuperacion-contexto.png" alt="Estrategia de Recuperación de Contexto — Árbol de decisión">
<div class="diagram-links">
<a href="assets/plantuml/to-be-estrategia-recuperacion-contexto.plantuml" download> Fuente PlantUML</a>
</div>
</div>

| Tipo de contexto | Estrategia validada | Mecanismo de acceso | Justificación |
|---|---|---|---|
| Identidad institucional | Relacional / JSON estructurado | Tool: Text-SQL sobre OrganizationalContextStore | Alta gobernanza y actualización controlada |
| Lineamientos de marca (5 atributos) | Relacional estructurado | Tool: consulta directa a BrandGuidelinesStore | Los 5 atributos de alta señal están modelados relacionalmente |
| Histórico de campañas | Relacional | Tool: Text-SQL sobre CampaignHistoryStore | Necesita métricas, filtros y queries específicos |
| Manuales de marca (PDF) | LLM multimodal + validación humana | Extracción a BrandGuidelinesStore en onboarding | Cobertura ≥80% confirmada; sin OCR en V1 |
| Manuales extensos / anexos no estructurados | RAG / vector DB | Búsqueda semántica sobre documentos | Solo cuando no es posible estructurar el contenido |
| Evidencias e imágenes | ADK Artifacts + metadatos | Almacenamiento con referencia estructurada | Control de derechos y reutilización entre agentes |

---

## 8. MVP técnico recomendado

El MVP técnico debe demostrar el diferencial del TO-BE sin intentar automatizar todo el ciclo de publicación. La prioridad es probar que el sistema puede recordar la organización, aplicar sus lineamientos y producir entregables revisables por humanos.

Capacidades mínimas del MVP:

1. creación de organización/tenant con aislamiento ADK;
2. onboarding institucional con captura de los 5 atributos de alta señal;
3. carga de lineamientos de marca vía LLM/VLM multimodal + validación humana (sin OCR en V1);
4. evaluación de completitud del perfil (CompletenessScorer);
5. carga de histórico básico de campañas consultable vía Text-SQL;
6. generación de plan estratégico con StrategicAgent — **salida estructurada obligatoria** (schema en prompt); 1–2 objetivos;
7. evaluación del plan por CriticAgent de alineación institucional (patrón crítico-evaluador);
8. adaptación de pieza para email e Instagram con agentes especializados — few-shots por canal incluidos;
9. validación humana de salida obligatoria;
10. exportación asistida por canal;
11. registro de feedback y trazabilidad técnica/funcional;
12. **LLM Gateway** activo desde MVP (rate-limit por tenant, retries, fallbacks, caché);
13. instrumentación de observabilidad con **MLflow + Grafana + Ray** (tokens, latencia, costo, scores).

Fuera de alcance MVP: publicación automática completa multicanal, evaluación automática compleja de calidad, analítica avanzada inter-tenant y generación de imagen IA para instituciones con restricciones regulatorias.

---

## 9. Decisiones técnicas — estado post-validación experta

> Decisiones cerradas con base en respuestas del experto técnico — Junio 2026.

| Decisión técnica | Estado | Decisión validada | Fuente |
|---|---|---|---|
| Lectura de manual de marca | ✅ Cerrada | LLM multimodal + validación humana. Sin OCR en V1. Cobertura ≥80% confirmada para documentos institucionales estándar. | P-00 / P-01 |
| Recuperación de contexto | ✅ Cerrada | Estructurado → herramientas/Text-SQL. No estructurado → RAG. Sin vector DB por defecto en V1 si el contexto crítico está modelado relacionalmente. | P-02 |
| Atributos de marca para el modelo | ✅ Cerrada | 5 atributos de alta señal: tono ponderado, blacklist/whitelist, perspectiva narrativa, restricciones, misión/valores. Paleta/tipografías diferibles a V2. | P-03 |
| Generación de imagen con IA | ✅ Cerrada | Viable con patrón crítico-evaluador (ImageCriticAgent). No es flujo principal para instituciones con restricciones regulatorias (ej. CRC). | P-04 |
| Adaptación multicanal | ✅ Cerrada | Agentes especializados por red social ejecutados en paralelo. ADK Skills para razonamiento. ADK Artifacts para activos pesados. | P-05 |
| Separación estratégico/creativo | ✅ Cerrada | Separación mantenida. Cada agente con 1–3 objetivos cohesionados. Agregar CriticAgent de alineación institucional. | P-06 |
| Framework de orquestación | ✅ Cerrada | **ADK (Agent Development Kit)** como framework de referencia para multi-agente, sesiones, memoria y aislamiento multi-tenant. | P-08 |
| Aislamiento multi-tenant | ✅ Cerrada | ADK genera sesión única por usuario. Memory banks por tenant_id con callbacks explícitos. Aislamiento estructural, no solo lógico. | P-08 |
| Observabilidad y evaluación | ✅ Cerrada | **MLflow** para experimentos y A/B testing. **Grafana** para dashboards operativos. **Ray** para observabilidad distribuida a escala. Métricas: tokens, latencia, costo, scores de calidad, número de iteraciones crítico-evaluador. | P-07 + lineamiento transversal #8-9 |
| Selección de proveedor LLM | ✅ Cerrada | Selección basada en **experimentos con MLflow o Vertex AI Evaluation** para cada tarea específica del sistema. Candidatos: Gemini, OpenAI (GPT-4o), Gemma4. Para tareas multimodales: también PaliGemma. **No recomendado: Claude** (débil en multimodal). No se usa matriz de pesos estática. | P-09 + lineamiento transversal #14 |
| **Salidas estructuradas** | ✅ Cerrada | **Siempre definir un schema de salida explícito en el prompt** para todos los agentes. Mejora precisión, reduce alucinaciones y facilita validación automática. El schema es parte del diseño del prompt, no del postprocesamiento. | Lineamiento transversal #2 |
| **LLM Gateway** | ✅ Cerrada | **LLM Gateway obligatorio desde MVP** para escenarios multi-tenant. Gestiona rate-limit por tenant, retries con backoff, fallbacks entre proveedores, caché de respuestas y enrutamiento batch. Evita el riesgo más subestimado: escalabilidad por tokens/requests por minuto. | Lineamiento transversal #10 |
| **Batch inference** | ✅ Cerrada | Generación masiva de variantes de campaña para múltiples canales o múltiples organizaciones en simultáneo se enruta por cola asíncrona (BatchInferenceQueue) al LLM Gateway. Optimiza costo y gestiona límites de rate. | Lineamiento transversal #11 |
| Publicación por canal | Abierta V2 | Offline-first en V1. Publicación automática gradual en V2 según restricciones API por canal. | — |

---

## 10. Flujo funcional extremo a extremo

<div class="diagram-block">
<p class="diagram-label">Flujo Funcional Extremo a Extremo — 7 Fases del Sistema</p>
<img src="assets/img/diagramas/to-be-flujo-funcional-e2e.png" alt="Flujo Funcional Extremo a Extremo — Adaptador de Contenido Institucional">
<div class="diagram-links">
<a href="assets/plantuml/to-be-flujo-funcional-e2e.plantuml" download> Fuente PlantUML</a>
</div>
</div>

---

## 11. Riesgos técnicos principales y mitigación

| Riesgo | Mitigación validada |
|---|---|
| TO-BE quede aspiracional y no ejecutable | Roadmap por fases + componentes concretos + MVP delimitado |
| Recuperación de contexto innecesariamente compleja | Simplificación validada: estructurado → Text-SQL; no estructurado → RAG |
| Riesgo regulatorio por automatización temprana | Offline-first + validación humana obligatoria + ImageCriticAgent solo para organizaciones sin restricciones |
| Exposición de datos entre clientes | ADK framework: sesiones aisladas por usuario + memory banks por tenant_id |
| Sobrecosto por decisiones IA prematuras | Selección de modelos por experimentación (MLflow) + evolución gradual V1/V2/V3 |
| Degradación de calidad del agente por sobrecarga | Regla validada: máximo 1–3 objetivos por agente; tools mínimas y bien definidas |
| Escalabilidad por tokens/requests por minuto (multi-tenant) | **LLM Gateway desde MVP**: rate-limit, retries, fallbacks, caché — riesgo más subestimado en proyectos LLM multi-tenant |
| Alucinaciones en salidas de agentes | Salidas estructuradas obligatorias + guardrails en prompts + few-shots por canal + patrón crítico-evaluador |
| Falta de visibilidad sobre calidad del modelo | Instrumentación MLFlow desde MVP: tokens, latencia, costo, scores de calidad |
| Inconsistencia de marca entre piezas | CriticAgent de alineación institucional + BrandGuidelinesStore con 5 atributos de alta señal |

---

## 12. Observabilidad técnica — MLFlow

> Validado: P-07 — Junio 2026.

El sistema instrumenta un conjunto mínimo de señales para evaluar calidad, costo y estabilidad del modelo desde el piloto controlado, sin depender exclusivamente de juicio subjetivo humano.

**Herramienta principal: MLFlow** — para registro de experimentos, A/B testing y monitoreo en tiempo real.

| Flujo | Métricas instrumentadas |
|---|---|
| **Todos los flujos (base)** | Tokens de entrada y salida · Tokens de *thinking* (modelos con razonamiento explícito) · Latencia por solicitud · Uso de recursos (RAM, CPU, red) · Costo estimado por tokens |
| **Extracción LLM (marca, OCR)** | Entidades detectadas vs. entidades esperadas · `logit_probs` de entidades críticas |
| **Patrón crítico-evaluador** | Número de feedbacks por iteración · Score de imagen vs. lineamientos por iteración · Score de estrategia generada · Score de posts por canal |
| **Selección de modelos** | Experimentos con múltiples prompts, hiperparámetros y proveedores · Evaluación por tarea específica del sistema |

---

## 13. Framework ADK — aislamiento multi-tenant y memoria

> Validado: P-08 — Junio 2026.

**ADK (Agent Development Kit)** es el framework de referencia para la arquitectura multi-agente. Garantiza aislamiento de sesión estructural: cada usuario obtiene una sesión con contexto y estado nuevos, sin riesgo de contaminación entre tenants.

**Modelo de memoria en ADK:**

| Memory bank | Alcance | Contenido |
|---|---|---|
| **Memory bank por usuario** | Exclusivo del tenant | Memoria a largo plazo de la organización; recuperada con callbacks por tenant_id |
| **Memory bank compartido controlado** | Multi-tenant controlado | Datos que enriquecen la aplicación en general, sin exponer contexto sensible entre organizaciones |

Configuración mínima para MVP: `tenant_id` como clave primaria de todos los memory banks + callbacks explícitos para recuperar sesiones anteriores del mismo usuario.

---

## 14. Relación con validación experta

Todas las decisiones de esta arquitectura están cerradas con base en las respuestas del experto técnico. La página [Preguntas para experto técnico](preguntas-experto-tecnico.html) registra cada decisión con su criterio de validación, umbral y acción resultante.

---

Trazabilidad: [TO-BE funcional](to-be.html) · [Objetivos funcionales](to-be-objetivos-funcionales.html) · [Contexto organizacional](to-be-contexto.html) · [Onboarding](to-be-onboarding.html) · [Agente Estratégico](to-be-agente-estrategico.html) · [Agente Creativo](to-be-agente-creativo.html) · [Histórico](to-be-historico.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html)

