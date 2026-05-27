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
| V1 MVP | Contexto persistente + generación/adaptación asistida + exportación | OrganizationalContextStore, BrandGuidelinesStore, OnboardingService, CompletenessScorer, StrategicAgent, CreativeAgent, ChannelFormatters, HumanValidationModule | Flujo completo controlado sin publicación automática obligatoria | Reduce riesgo regulatorio y de alcance |
| V2 | Automatización controlada y métricas avanzadas | Integraciones API, programación de publicaciones, métricas por canal, aprendizaje histórico | Mayor cierre operativo del ciclo de campaña | Evita automatizar antes de validar gobernanza |
| V3 | Escalamiento multi-cliente y optimización avanzada | Multi-tenant avanzado, analítica comparativa, recomendaciones, evaluación automática | Producto escalable y gobernado | Controla complejidad empresarial |

---

## 4. Vista lógica de alto nivel

El sistema se mantiene en seis capas lógicas, con mayor definición de servicios concretos:

```text
Experiencia: web/chat guiado + onboarding + preview + histórico
Orquestación: StrategicAgent + CreativeAgent + flujo de aprobación
Contexto: ContextRetrievalService + filtros por tenant + restricciones
Datos: OrganizationalContextStore + BrandGuidelinesStore + CampaignHistoryStore
IA: LLM provider abstraction + multimodal
Canales: ChannelFormatters + Export/PublishingAdapter
```

![Arquitectura TO-BE - visión general de componentes](assets/img/diagramas/to-be-arquitectura.png)
<a href="assets/plantuml/to-be-arquitectura.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

---

## 5. Componentes técnicos de la arquitectura TO-BE optimizada

| Componente | Responsabilidad | Rol en la arquitectura | Estado propuesto |
|---|---|---|---|
| OrganizationalContextStore | Persistir identidad, audiencias, tono, restricciones y contexto institucional | Núcleo de contexto persistente | Núcleo MVP |
| BrandGuidelinesStore / BrandProfileService | Gestionar marca, logos, colores, tipografías, activos y reglas por canal | Núcleo de identidad institucional | Núcleo MVP |
| CompletenessScorer | Medir qué tan completo está el perfil institucional antes de generar piezas | Control de calidad de onboarding | Núcleo MVP |
| OnboardingService | Guiar la creación del perfil institucional persistente | Entrada y validación del perfil | Núcleo MVP |
| CampaignHistoryStore | Guardar campañas, piezas, briefs, métricas y feedback | Memoria organizacional y aprendizaje | Núcleo MVP |
| ContextRetrievalService | Recuperar contexto estructurado, histórico y documentos relevantes | Recuperación contextual para agentes | MVP con diseño flexible |
| StrategicAgent | Proponer estrategia, objetivos, audiencia, canales y restricciones | Planeación institucional asistida | Núcleo MVP |
| CreativeAgent | Adaptar textos y piezas a canal y marca | Producción creativa con restricciones | Núcleo MVP |
| ChannelFormatters | Convertir contenido en formatos de email, Instagram, WhatsApp, web/intranet | Adaptación de salida por canal | Núcleo MVP |
| HumanValidationModule | Revisar, aprobar, rechazar y registrar decisiones humanas | Gobernanza y control humano | Núcleo MVP |
| Export/PublishingAdapter | Exportación asistida en V1; publicación automática gradual en V2 | Entrega por canal y evolución operativa | V1/V2 |
| ObservabilityService | Registrar trazabilidad, errores, tiempos, costos y métricas de campaña | Auditoría técnica y funcional | Núcleo MVP |
| TenantIsolationLayer | Separar datos por organización/cliente desde el modelo inicial | Seguridad y aislamiento multi-organización | Sprint 0 / MVP |

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

Decisión inicial propuesta: recuperación híbrida gradual.

```text
1. Datos estructurados para perfil institucional, marca, audiencias, canales y restricciones.
2. Repositorio histórico estructurado para campañas, métricas y feedback.
3. Recuperación documental/vectorial solo para documentos largos, manuales, anexos y conocimiento no estructurado.
4. Lectura de manuales de marca con LLM multimodal en flujo principal (sin OCR en MVP).
```

| Tipo de contexto | Estrategia inicial | Justificación |
|---|---|---|
| Identidad institucional | Relacional / JSON estructurado | Alta gobernanza y actualización controlada |
| Lineamientos de marca | Relacional + archivos versionados + extracción LLM multimodal | Requiere trazabilidad y activos |
| Histórico de campañas | Relacional/documental | Necesita métricas y filtros |
| Manuales extensos | Documental/vectorial opcional | Puede requerir búsqueda semántica |
| Evidencias e imágenes | Almacenamiento de archivos + metadatos | Control de derechos y trazabilidad |

Punto de validación experta: confirmar umbrales de volumen, costo y latencia para activar vector DB desde MVP o diferir a V2.

---

## 8. MVP técnico recomendado

El MVP técnico debe demostrar el diferencial del TO-BE sin intentar automatizar todo el ciclo de publicación. La prioridad es probar que el sistema puede recordar la organización, aplicar sus lineamientos y producir entregables revisables por humanos.

Capacidades mínimas del MVP:

1. creación de organización/tenant;
2. onboarding institucional;
3. carga de lineamientos de marca;
4. evaluación de completitud del perfil (CompletenessScorer);
5. carga de histórico básico de campañas;
6. generación de plan estratégico;
7. adaptación de pieza para email e Instagram;
8. validación humana de salida;
9. exportación asistida por canal;
10. registro de feedback y trazabilidad técnica/funcional.

Fuera de alcance MVP: publicación automática completa multicanal, evaluación automática compleja de calidad y analítica avanzada inter-tenant.

---

## 9. Decisiones iniciales propuestas y validación experta

En esta arquitectura no se dejan decisiones abiertas sin hipótesis inicial. Cada frente queda formulado como: decisión inicial propuesta + punto de validación experta.

| Decisión técnica | Decisión inicial propuesta | Punto de validación experta | Impacto si se contradice |
|---|---|---|---|
| Lectura de manual de marca | LLM multimodal directo como camino principal, sin OCR en MVP | Confirmar cobertura real en PDFs institucionales complejos | Si no cumple calidad objetivo, se replantea alcance documental de V1 |
| Recuperación de contexto | Híbrida gradual con base estructurada | Confirmar si >70% del contexto crítico queda cubierto estructuradamente | Se adelanta diseño RAG/vectorial desde V1 |
| Motor de orquestación | Mantener LangGraph para estados y human-in-the-loop | Validar complejidad real de ramas y persistencia | Se evalúa motor alterno o simplificación de flujo |
| Publicación por canal | Offline-first y exportación asistida en V1 | Validar restricciones API por canal | Se acelera o difiere automatización por canal |
| Multi-tenancy | tenant_id transversal desde Sprint 0 | Validar controles mínimos de seguridad y compliance | Se endurece aislamiento antes de salir a pilotos |
| Imagen institucional | Activos licenciados como flujo principal; IA como opción controlada | Validar límites regulatorios por tipo de cliente | Se restringe o habilita IA por segmento |

---

## 10. Flujo funcional extremo a extremo

```text
1. ONBOARDING por organización
URL + documentos + validación de usuario
-> OrganizationalContextStore / BrandGuidelinesStore

2. INICIO OPERATIVO
Carga automática de contexto del tenant

3. PLANEACIÓN
StrategicAgent propone objetivo, audiencia, mensajes, canales

4. PRODUCCIÓN
CreativeAgent + ChannelFormatters generan piezas por canal

5. GOBERNANZA
HumanValidationModule aprueba/rechaza y registra trazabilidad

6. ENTREGA
Export/PublishingAdapter ejecuta exportación asistida en V1

7. MEMORIA
CampaignHistoryStore registra resultados y feedback
```

---

## 11. Riesgos técnicos principales y mitigación

| Riesgo | Mitigación en TO-BE optimizado |
|---|---|
| TO-BE quede aspiracional y no ejecutable | Roadmap por fases + componentes concretos + MVP delimitado |
| Ambigüedad en recuperación de contexto | Estrategia híbrida inicial con umbrales de validación |
| Riesgo regulatorio por automatización temprana | Offline-first + validación humana obligatoria |
| Exposición de datos entre clientes | TenantIsolationLayer desde Sprint 0 |
| Sobrecosto por decisiones IA prematuras | Evolución gradual y criterios de activación V2/V3 |

---

## 12. Relación con preguntas al experto técnico

La página [Preguntas para experto técnico](preguntas-experto-tecnico.html) valida decisiones iniciales ya propuestas, no reabre la arquitectura desde cero. Cada pregunta debe confirmar límites, riesgos y ajustes en máximo 20 horas de análisis.

---

Trazabilidad: [TO-BE funcional](to-be.html) · [Objetivos funcionales](to-be-objetivos-funcionales.html) · [Contexto organizacional](to-be-contexto.html) · [Onboarding](to-be-onboarding.html) · [Agente Estratégico](to-be-agente-estrategico.html) · [Agente Creativo](to-be-agente-creativo.html) · [Histórico](to-be-historico.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html)
