# Objetivos funcionales TO-BE y cobertura arquitectónica

> Esta página consolida los objetivos funcionales del Adaptador de Contenido Institucional y muestra cómo cada objetivo se cumple con los módulos de la arquitectura TO-BE.

## 1. Propósito

Asegurar trazabilidad entre la visión funcional del producto y la implementación técnica propuesta, para evitar brechas entre lo que el sistema promete y lo que la arquitectura soporta.

## 2. Objetivos funcionales del producto

1. Mantener un contexto organizacional persistente por organización.
2. Aplicar lineamientos de marca y restricciones institucionales en cada salida.
3. Producir estrategia y piezas por canal de forma asistida.
4. Garantizar validación humana y trazabilidad antes de publicar o exportar.
5. Preservar histórico de campañas como memoria organizacional reutilizable.
6. Habilitar onboarding institucional con control de completitud de perfil.
7. Asegurar aislamiento multi-organización desde el modelo inicial.
8. Permitir evolución gradual desde MVP hacia automatización controlada.

## 3. Matriz de cumplimiento objetivo-módulo

| Objetivo funcional | Módulos de arquitectura que lo cumplen | Cómo se cumple en la práctica | Estado en roadmap |
|---|---|---|---|
| Contexto organizacional persistente | OrganizationalContextStore, ContextRetrievalService | El contexto institucional se guarda por tenant y se recupera al iniciar cada flujo de trabajo. | MVP |
| Lineamientos de marca y restricciones | BrandGuidelinesStore / BrandProfileService, CreativeAgent, ChannelFormatters | Los agentes usan reglas de marca, activos permitidos y formatos por canal antes de generar o adaptar piezas. | MVP |
| Planeación estratégica institucional | StrategicAgent, ContextRetrievalService, CampaignHistoryStore | El agente propone objetivos, audiencias y mensajes usando contexto vigente e histórico institucional. | MVP |
| Producción creativa multicanal | CreativeAgent, ChannelFormatters, Export/PublishingAdapter | El contenido se adapta por canal (email, Instagram, WhatsApp, web/intranet) y se prepara para entrega controlada. | MVP-V2 |
| Gobernanza y validación humana | HumanValidationModule, ObservabilityService | Cada salida pasa por revisión/aprobación humana y se registra evidencia de decisión, usuario y fecha. | MVP |
| Histórico y memoria organizacional | CampaignHistoryStore, ObservabilityService | Se conservan campañas, piezas, resultados y feedback para continuidad temática y aprendizaje. | MVP-V2 |
| Onboarding institucional persistente | OnboardingService, CompletenessScorer, OrganizationalContextStore | El perfil se construye una vez, se valida por completitud y queda reutilizable para sesiones futuras. | MVP |
| Seguridad multi-organización | TenantIsolationLayer, OrganizationalContextStore, ObservabilityService | El modelo usa tenant_id transversal, control de acceso por organización y trazabilidad de acciones. | Sprint 0-MVP |
| Evolución por fases | Export/PublishingAdapter, ObservabilityService, TenantIsolationLayer | V1 prioriza exportación asistida; V2/V3 agregan automatización, métricas avanzadas y hardening empresarial. | V1-V3 |

## 4. Cobertura de módulos transversales

| Módulo transversal | Objetivos que impacta | Razón de transversalidad |
|---|---|---|
| ObservabilityService | 4, 5, 7, 8 | Sin trazabilidad no hay gobernanza, aprendizaje ni operación auditable. |
| ContextRetrievalService | 1, 2, 3, 5 | Es la capa que conecta perfil institucional, histórico y decisiones de los agentes. |
| HumanValidationModule | 2, 3, 4 | Controla calidad y cumplimiento antes de distribuir contenido. |

## 5. Riesgos de desalineación a vigilar

- Si CreativeAgent genera piezas sin validar BrandGuidelinesStore, se rompe la coherencia institucional.
- Si ContextRetrievalService no trae histórico relevante, StrategicAgent pierde continuidad de campaña.
- Si Export/PublishingAdapter se usa sin HumanValidationModule, se debilita la gobernanza.
- Si TenantIsolationLayer no se implementa desde Sprint 0, aumenta el riesgo de fuga inter-organización.

## 6. Conclusión

La arquitectura TO-BE actual cubre los objetivos funcionales clave del producto y establece un camino de implementación por fases. La prioridad operativa es mantener el acople entre módulos de contexto, agentes y gobernanza para sostener un comportamiento institucional consistente.

---

Trazabilidad: [TO-BE funcional](to-be.html) · [Arquitectura TO-BE](to-be-arquitectura.html) · [Mapa de módulos](decisiones-modulos.html) · [Onboarding](to-be-onboarding.html) · [Contexto organizacional](to-be-contexto.html) · [Agente Estratégico](to-be-agente-estrategico.html) · [Agente Creativo](to-be-agente-creativo.html) · [Histórico](to-be-historico.html)
