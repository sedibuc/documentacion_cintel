# Arquitectura transversal

## Introducción

Esta sección presenta la propuesta de **arquitectura del Core Transversal CINTEL**: el proyecto base desde el cual iniciar implementaciones de inteligencia artificial con seguridad, coherencia y eficiencia. El Core Transversal no es una aplicación en sí misma; es un *scaffolding* de capas, módulos y decisiones arquitectónicas que cada proyecto nuevo hereda y extiende según sus necesidades específicas.

La arquitectura propuesta está directamente derivada del análisis comparativo del *Document Intelligence Engine* (DIE) y del *Adaptador de Contenido Institucional* (Agent), cuyas arquitecturas convergen en más del 70 % de su estructura base.

---

## Diagrama 1 — Arquitectura en capas del Core Transversal

<div class="diagram-block">
<div class="diagram-label">Diagrama 1 — Arquitectura en capas del Core Transversal CINTEL</div>
<img src="assets/img/diagramas/arquitectura-transversal.png" alt="Arquitectura en capas del Core Transversal CINTEL">
<div class="diagram-links">
<a href="assets/plantuml/arquitectura-transversal.puml" download>⬇ Descargar .puml</a>
</div>
</div>

---

## Capas propuestas

La arquitectura del Core Transversal se organiza en **seis capas horizontales**, cada una con responsabilidades bien definidas y límites explícitos hacia las capas adyacentes.

### Capa 1 — Presentación / UI Base

**Responsabilidad:** Proveer la interfaz de usuario y la capa de API pública del sistema.

**Módulos comunes:**
- **API Gateway:** Punto de entrada único para todas las solicitudes externas. Gestiona autenticación, autorización, rate-limiting y enrutamiento.
- **Shell genérico de micrositio:** Infraestructura de documentación técnica reutilizable (HTML/CSS/JS + Markdown loader).
- **Plantillas de interfaz:** Componentes base para paneles de administración, dashboards y revisión humana.

**Límite con capa superior:** Recibe solicitudes del exterior (usuarios, sistemas externos). No tiene acceso directo a la lógica de negocio o a la base de datos.

---

### Capa 2 — Seguridad Transversal

**Responsabilidad:** Garantizar que toda operación en el sistema sea autenticada, autorizada y trazable antes de ejecutarse.

**Módulos comunes:**
- **AuthN Service:** Validación de JWT. Integración con Identity Provider externo (Keycloak, Auth0).
- **RBAC Engine:** Evaluación de permisos por rol, tenant y recurso. Soporta extensión a ABAC para reglas complejas.
- **Security Middleware:** Validación de entradas en fronteras del sistema, cabeceras HTTP de seguridad, protección contra inyección.
- **Secret Manager:** Gestión de credenciales y secretos por ambiente. Integración con HashiCorp Vault o equivalente.

**Límite con proyectos específicos:** Los proyectos extienden los roles base y definen recursos y acciones propias, pero no reimplementan autenticación ni autorización.

---

### Capa 3 — Multi-Tenant Core

**Responsabilidad:** Gestionar el ciclo de vida de los tenants y garantizar el aislamiento de datos entre organizaciones cliente.

**Módulos comunes:**
- **Tenant Registry:** CRUD de organizaciones, configuración por tenant, gestión de estado (activo/inactivo) y cuotas.
- **Tenant Isolation Layer:** Middleware que inyecta `tenant_id` en todas las operaciones y aplica filtros de aislamiento (PostgreSQL RLS o equivalente).
- **Onboarding Orchestrator:** Flujo verificable de incorporación de nuevos clientes en **5 fases**: (1) registro de organización, (2) carga de contexto institucional con extracción web asistida, (3) creación de usuarios y roles, (4) configuración técnica de soluciones, (5) tour guiado y activación. Ver documentación completa en [Onboarding de clientes](onboarding.html) · Prototipo navegable en [Mockup funcional](mockup.html).
- **User Manager:** CRUD de usuarios, asignación de roles por tenant, gestión del ciclo de vida de cuentas.
- **Session Manager y Dashboard Hub:** Gestión de la sesión transversal de usuario. Emite un token con los claims del tenant (`tenant_id`, `user_id`, `role`, `solutions[]`) que comparten todos los micrositios del portafolio sin re-autenticación. El **Dashboard centralizado** es la pantalla principal tras el login: hub de navegación con tarjetas por solución, métricas consolidadas y actividad reciente.

**Límite con proyectos específicos:** Cada proyecto define su configuración específica de tenant (esquemas de extracción en DIE, lineamientos de marca en Agent) como extensión del `TenantRegistry`, sin modificar el núcleo.

---

### Capa 4 — LLM Gateway y Gestión de IA

**Responsabilidad:** Centralizar y controlar el acceso a proveedores de modelos de lenguaje, gestionar el uso de tokens y garantizar la resiliencia ante fallos de proveedores externos.

**Módulos comunes:**
- **LLM Router:** Enrutamiento de solicitudes al proveedor correcto según configuración por tenant y por tipo de operación.
- **Rate Limiter por Tenant:** Control de tokens y RPM (requests per minute) por organización para prevenir escalabilidad no controlada.
- **Retry & Fallback Manager:** Reintentos con backoff exponencial y failover automático a modelo alternativo.
- **Response Cache:** Caché de respuestas para operaciones repetidas o similares, reduciendo costos.
- **Prompt Registry:** Repositorio versionado de prompts con guardrails, few-shots e instrucciones de formato.
- **Cost Controller:** Presupuestos por tenant, alertas de umbral y bloqueo de operaciones al alcanzar el límite.

**Límite con proyectos específicos:** Cada proyecto registra sus propios prompts y configura sus modelos preferidos, pero comparte la infraestructura de enrutamiento, rate-limiting y caché.

---

### Capa 5 — Observabilidad y Auditoría

**Responsabilidad:** Registrar, medir y hacer trazable toda operación del sistema para diagnóstico, cumplimiento y mejora continua.

**Módulos comunes:**
- **Audit Service:** Registro inmutable de operaciones (quién, qué, cuándo, resultado). Obligatorio por proyecto.
- **Metrics Collector:** Métricas base transversales: `tokens_entrada`, `tokens_salida`, `latencia_ms`, `modelo_usado`, `tenant_id`, `error_rate`.
- **MLFlow Integration:** Seguimiento de experimentos, A/B testing de prompts y modelos, evaluación de calidad.
- **Grafana Dashboards:** Plantillas de dashboard base con métricas transversales. Cada proyecto agrega paneles específicos.
- **Log Aggregator:** Logs estructurados con correlación por `request_id` y `tenant_id`. Enrutamiento a Loki o equivalente.

**Límite con proyectos específicos:** Cada proyecto agrega sus métricas específicas (campos de baja confianza en DIE, tasa de aprobación en Agent) sobre las métricas base transversales.

---

### Capa 6 — Infraestructura y DevOps

**Responsabilidad:** Proveer la infraestructura técnica de despliegue, configuración por ambiente y automatización de operaciones.

**Módulos comunes:**
- **CI/CD Pipeline Template:** Pipeline estándar con stages de pruebas, análisis de seguridad, construcción de imágenes y despliegue.
- **Docker Compose Base:** Configuración de contenedores para desarrollo local con todos los servicios del Core.
- **Kubernetes Helm Charts:** Plantillas de despliegue para staging y producción con configuración de recursos y escalado.
- **Config Manager:** Gestión de variables por ambiente (dev/staging/prod) con validación al inicio de la aplicación.
- **Migration Manager:** Gestión de migraciones de base de datos con control de versiones (Alembic o equivalente).

**Límite con proyectos específicos:** Cada proyecto extiende las plantillas de infraestructura con sus servicios específicos (workers Celery en DIE, servidor ADK en Agent) sin modificar la configuración base.

---

## Diagrama 2 — Módulos reutilizables del Core

<div class="diagram-block">
<div class="diagram-label">Diagrama 2 — Módulos reutilizables del Core Transversal</div>
<img src="assets/img/diagramas/modulos-reutilizables.png" alt="Módulos reutilizables del Core Transversal CINTEL">
<div class="diagram-links">
<a href="assets/plantuml/modulos-reutilizables.puml" download>⬇ Descargar .puml</a>
</div>
</div>

---

## Diagrama 3 — Separación entre Core y proyectos específicos

<div class="diagram-block">
<div class="diagram-label">Diagrama 3 — Límites entre Core Transversal y proyectos específicos</div>
<img src="assets/img/diagramas/separacion-core-proyectos.png" alt="Separación Core Transversal vs proyectos DIE y Agent">
<div class="diagram-links">
<a href="assets/plantuml/separacion-core-proyectos.puml" download>⬇ Descargar .puml</a>
</div>
</div>

---

## Separación entre Core Transversal y proyectos específicos

La línea que separa el Core Transversal de los proyectos específicos se define por dos criterios:

**1. Criterio de repetición:** Si la funcionalidad se implementó (o se implementaría) de forma casi idéntica en DIE y en Agent, pertenece al Core.

**2. Criterio de variabilidad:** Si la funcionalidad cambia significativamente según el dominio del proyecto (extracción estructurada vs. generación de contenido), pertenece a la capa específica del proyecto.

| Componente | Core Transversal | Proyecto DIE | Proyecto Agent |
|---|---|---|---|
| Multi-tenancy (`tenant_id`, RLS) | ✅ | Extiende (esquemas) | Extiende (lineamientos) |
| AuthN/AuthZ (JWT + RBAC base) | ✅ | Extiende (roles DIE) | Extiende (roles Agent) |
| LLM Gateway (router, rate-limit, cache) | ✅ | Configura (modelos) | Configura (modelos) |
| Audit Service (inmutable) | ✅ | Registra (extracciones) | Registra (generaciones) |
| Prompt Registry (infraestructura) | ✅ | Registra (extracción/validación) | Registra (agentes/canales) |
| Observabilidad (MLFlow + Grafana base) | ✅ | Agrega (confianza, doc types) | Agrega (aprobación, canal) |
| CI/CD pipeline base | ✅ | Extiende (tests IA) | Extiende (tests agentes) |
| StructuredExtractor | ❌ | ✅ (núcleo DIE) | N/A |
| ValidationLayer + DiscrepancyAlertEngine | ❌ | ✅ (núcleo DIE) | N/A |
| ADK Framework (multi-agent) | ❌ | N/A | ✅ (núcleo Agent) |
| BrandGuidelinesStore | ❌ | N/A | ✅ (núcleo Agent) |
| ChannelAdapters (LinkedIn, Instagram, etc.) | ❌ | N/A | ✅ (núcleo Agent) |
| DocumentSchemaRegistry | ❌ | ✅ (extiende PromptRegistry) | N/A |
| CampaignHistoryStore | ❌ | N/A | ✅ (núcleo Agent) |

---

## Decisiones arquitectónicas

### DA-01 — El Core Transversal es una librería, no un monolito

El Core Transversal se implementa como un conjunto de módulos Python (o paquetes) importables, no como una aplicación monolítica. Cada proyecto incluye los módulos del Core que necesita como dependencias y los extiende mediante interfaces bien definidas (clases abstractas, protocolos).

**Justificación:** Permite evolucionar el Core sin forzar actualizaciones simultáneas en todos los proyectos. Facilita las pruebas unitarias de los módulos del Core de forma independiente.

### DA-02 — El LLM Gateway es el servicio de mayor criticidad

Basado en la validación del experto técnico (junio 2026), el LLM Gateway es el componente con mayor riesgo de escalabilidad y el más subestimado en implementaciones iniciales. Se implementa como servicio independiente (microservicio) con su propia base de datos de métricas y sus propios SLOs.

**Justificación:** Si el LLM Gateway falla o no está disponible, todos los proyectos que dependen de él se ven afectados. Su disponibilidad y resiliencia son prioritarias sobre su funcionalidad avanzada.

### DA-03 — PostgreSQL como base de datos relacional estándar con RLS

La elección de PostgreSQL como base de datos principal para datos persistentes es transversal a todos los proyectos. El uso de Row-Level Security (RLS) para aislamiento multi-tenant está validado y es la estrategia estándar del Core.

**Justificación:** PostgreSQL con RLS ofrece aislamiento lógico sin duplicar bases de datos por tenant, lo que simplifica la operación y reduce costos de infraestructura.

### DA-04 — Redis para estado efímero y colas de trabajo

Redis se utiliza como capa de caché, broker de colas (Celery) y almacén de estado efímero de sesiones. Su uso está estandarizado en el Core para garantizar compatibilidad entre módulos.

**Justificación:** Redis está validado en ambas arquitecturas existentes y provee el rendimiento necesario para operaciones de baja latencia (caché de respuestas LLM, estado de sesiones).

### DA-05 — Logs y métricas siempre incluyen `tenant_id`

Toda entrada de log y toda métrica registrada en el sistema incluye obligatoriamente el campo `tenant_id`. Esta regla es un invariante del Core Transversal que se valida automáticamente en los tests de integración.

**Justificación:** Sin `tenant_id` en logs y métricas, es imposible diagnosticar problemas o analizar el uso por cliente en un sistema multi-tenant. El incumplimiento de esta regla compromete tanto la operación como el cumplimiento regulatorio.

### DA-06 — Versionado semántico para todos los componentes configurables

Prompts, esquemas, lineamientos de marca y cualquier componente configurable se versionan con semántica `major.minor.patch`. Las versiones anteriores se conservan mientras existan registros de auditoría que las referencien.

**Justificación:** La reproducibilidad del comportamiento del sistema en cualquier punto del pasado es un requisito de auditoría. Sin versionado, no es posible determinar qué prompt o esquema produjo un resultado específico.

---

## Integraciones del Core Transversal

| Sistema externo | Módulo del Core | Propósito |
|---|---|---|
| Identity Provider (Keycloak/Auth0) | AuthN Service | Autenticación federada y SSO |
| HashiCorp Vault / Secret Manager | Config Manager | Gestión segura de credenciales |
| OpenAI / Google Generative AI / DeepSeek | LLM Gateway | Acceso a modelos de lenguaje |
| PostgreSQL | Tenant Isolation Layer, Audit Service | Persistencia de datos con RLS |
| Redis | LLM Gateway (caché), Session Store, Celery | Estado efímero y colas |
| MLFlow | Metrics Collector | Experimentos y seguimiento de modelos |
| Grafana + Prometheus | Metrics Collector | Dashboards operacionales |
| Loki / CloudWatch | Log Aggregator | Centralización de logs |

---

## Dependencias entre módulos del Core

```
Config Manager
    └── todos los demás módulos dependen de Config Manager

AuthN Service ──► RBAC Engine ──► Tenant Isolation Layer
                                        └── todos los módulos de negocio

LLM Gateway ──► Prompt Registry
             ──► Cost Controller ──► Metrics Collector
             ──► Response Cache

Audit Service ──► Metrics Collector ──► Log Aggregator

Onboarding Orchestrator ──► Tenant Registry ──► User Manager
                                              ──► RBAC Engine
```

Las dependencias son unidireccionales y acíclicas. Los módulos de capas inferiores no dependen de capas superiores.
