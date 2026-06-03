# Cronograma de implementación del Core Transversal

> Fecha tentativa de inicio: **1 de julio de 2026** (misma que los proyectos derivados).

## Introducción

Este cronograma presenta la hoja de ruta para construir el **Core Transversal CINTEL**: la base compartida desde la cual iniciar cualquier nueva solución de IA con infraestructura robusta, segura y multi-tenant desde el primer sprint.

El Core Transversal se concibe como un proyecto de duración **corta y deliberada**: su valor está en habilitar los proyectos derivados (DIE, Agent) rápidamente, no en ser una plataforma de larga duración. El cronograma se organiza en **Sprint 0 + 3 sprints de construcción = 8 semanas**, priorizando los módulos de mayor bloqueo primero.

Los módulos del Core son adoptados de forma **incremental** por los proyectos derivados a medida que se completan: no es necesario esperar a que el Core esté 100 % terminado para iniciar el Sprint 0 de DIE o del Agente.

---

## 1. Supuestos de planificación

- Duración de sprint: 2 semanas.
- Cadencia: Sprint 0 + 3 sprints de construcción = **4 sprints totales — 8 semanas**.
- Equipo mínimo: Tech Lead, Backend Senior, DevOps, Especialista en Seguridad (4 personas con dedicación completa).
- Los proyectos DIE y Agent inician su propio Sprint 0 en paralelo con el Sprint 1 del Core; sus dependencias críticas (AuthN/RBAC, multi-tenancy, LLM Gateway) quedan disponibles al final de los sprints 0, 1 y 2 del Core respectivamente.

---

## 2. Cronograma por sprint

| Sprint | Fechas | Objetivo principal | Entregables clave |
|---|---|---|---|
| Sprint 0 | 2026-07-01 a 2026-07-14 | Seguridad, configuración e infraestructura base | Config Manager, AuthN JWT, RBAC base, Security Middleware, Docker Compose (API + PostgreSQL + Redis), CI/CD pipeline |
| Sprint 1 | 2026-07-15 a 2026-07-28 | Multi-tenancy y gestión de usuarios | Tenant Registry, Tenant Isolation Layer (RLS), User Manager, Onboarding Orchestrator, tests de aislamiento > 90 % |
| Sprint 2 | 2026-07-29 a 2026-08-11 | LLM Gateway y Prompt Registry | LLM Router, Rate Limiter por Tenant (Redis), Retry/Fallback Manager, Response Cache, Prompt Registry con versionado, Cost Controller |
| Sprint 3 | 2026-08-12 a 2026-08-25 | Observabilidad, auditoría y scaffolding | Audit Service inmutable, Metrics Collector + Grafana base, Helm Charts base, CLI `cintel-scaffold`, guía de inicio rápido, checklist OWASP Top 10 |

---

## 3. Detalle de sprints

### Sprint 0 — Seguridad, configuración e infraestructura base

**Objetivo:** Establecer los cimientos de seguridad, configuración y despliegue que desbloquean el arranque de todos los proyectos derivados.

**Actividades:**
1. Definir convenciones del repositorio `cintel-core`: estructura de carpetas, `.gitignore`, `pyproject.toml`.
2. Implementar `Config Manager` con validación de variables requeridas al inicio.
3. Configurar gestión de secretos (`.env` para desarrollo, Vault para staging/prod).
4. Implementar `AuthN Service` con validación de JWT e integración con Identity Provider.
5. Implementar `RBAC Engine` con roles base: `admin`, `operator`, `auditor`.
6. Implementar `Security Middleware`: validación de entradas, cabeceras HTTP de seguridad (CSP, CORS, HSTS).
7. Configurar pipeline CI/CD base: lint, tests, análisis de dependencias, construcción de imagen Docker.
8. Crear `docker-compose.yml` base con API, PostgreSQL y Redis.

**Entregables:**
- Repositorio `cintel-core` inicializado con estructura estándar.
- `AuthN Service` JWT + `RBAC Engine` con roles base operativos.
- `Security Middleware` integrado.
- Pipeline CI/CD funcional. `docker-compose.yml` base funcional.

**Criterios de cierre:**
- Solicitudes sin JWT válido reciben 401; con rol insuficiente, 403.
- Variables de entorno faltantes al inicio detienen la aplicación con mensaje claro.
- Pipeline CI/CD ejecuta sin errores en cada commit.

---

### Sprint 1 — Multi-tenancy, gestión de usuarios y Onboarding

**Objetivo:** Implementar el núcleo multi-tenant del Core: registro de tenants, aislamiento de datos, gestión de usuarios y el módulo de **Onboarding de clientes** con Dashboard centralizado y sesión compartida — los primeros tres módulos del portafolio con experiencia de usuario funcional.

> Ver documentación detallada del módulo: [Onboarding de clientes](onboarding.html) · [Prototipo funcional navegable](mockup.html)

**Actividades:**
1. Definir modelo de datos: `Tenant`, `User`, `Role`, `Permission`. Crear migraciones con Alembic.
2. Implementar `Tenant Registry`: CRUD de organizaciones con configuración por tenant.
3. Implementar `Tenant Isolation Layer`: middleware que inyecta `tenant_id` y aplica filtros. Configurar PostgreSQL RLS.
4. Implementar `User Manager`: CRUD de usuarios, asignación de roles por tenant.
5. Implementar `Onboarding Orchestrator` — flujo de **5 fases** verificables:
   - Fase 1: registro de organización (`tenant_id`, plan, soluciones, cuota)
   - Fase 2: carga de contexto institucional con extracción web asistida y ponderación de tono de marca
   - Fase 3: creación de usuarios y asignación de roles granulares por solución
   - Fase 4: configuración técnica de DIE y Agent para el tenant
   - Fase 5: tour guiado y activación formal con checklist de criterios
6. Implementar `Session Manager y Dashboard Hub`: JWT transversal con claims por tenant + pantalla de dashboard centralizado que agrupa DIE, Agent y Documentación bajo un único punto de acceso.
7. Escribir tests de aislamiento: verificar que un tenant no puede leer ni escribir datos de otro.
8. Documentar API de administración (OpenAPI).

**Entregables:**
- `TenantRegistry`, `TenantIsolationLayer`, `UserManager`, `OnboardingOrchestrator` y `SessionManager` funcionales.
- Migraciones de base de datos versionadas y reproducibles.
- Tests de aislamiento multi-tenant con cobertura > 90 %.
- Documentación de API (OpenAPI/Swagger).
- **Módulo de Onboarding** documentado con las 5 fases, criterios de activación y referencia al prototipo funcional.

**Criterios de cierre:**
- Tests de aislamiento pasan: un tenant no puede acceder a datos de otro.
- El flujo completo de onboarding (5 fases) activa un tenant en < 4 horas de tiempo operativo.
- El Dashboard Hub muestra tarjetas de las soluciones activas del tenant con sesión compartida funcional.
- Todos los pasos del onboarding están registrados en el `AuditService` con usuario, timestamp y hash.

---

### Sprint 2 — LLM Gateway y Prompt Registry

**Objetivo:** Implementar la capa central de acceso a modelos de IA: LLM Gateway con control de costos y Prompt Registry con versionado.

**Actividades:**
1. Implementar `LLM Router`: enrutamiento a proveedores configurados (OpenAI, Google Generative AI, DeepSeek).
2. Implementar `Rate Limiter por Tenant`: control de tokens y RPM en Redis.
3. Implementar `Retry & Fallback Manager`: reintentos con backoff exponencial, fallback a modelo alternativo.
4. Implementar `Response Cache`: caché en Redis para respuestas LLM con TTL configurable.
5. Implementar `Prompt Registry`: CRUD con versionado semántico, guardrails y few-shots.
6. Implementar `Cost Controller`: presupuestos por tenant, alertas al 70 % y 90 %, bloqueo al 100 %.
7. Escribir tests de carga multi-tenant para validar rate-limiting.

**Entregables:**
- `LLM Gateway` completo (router, rate-limiter, retry/fallback, caché).
- `Prompt Registry` con CRUD y versionado operativo.
- `Cost Controller` con alertas y bloqueo de presupuesto.
- Tests de carga documentados.

**Criterios de cierre:**
- Solicitudes que superan cuota reciben 429 con mensaje claro.
- Fallback a modelo alternativo se activa automáticamente ante falla del proveedor primario.
- Prompts recuperables por versión específica.

---

### Sprint 3 — Observabilidad, auditoría y scaffolding

**Objetivo:** Completar la capa de observabilidad, formalizar el Core como scaffolding reutilizable y validar el criterio de éxito del programa.

**Actividades:**
1. Implementar `Audit Service`: registro inmutable `{tenant_id, user_id, operation, input_hash, result_hash, timestamp, model_version, prompt_version}`.
2. Implementar `Metrics Collector` (formato Prometheus) y configurar dashboard base en Grafana.
3. Configurar `Log Aggregator`: logs JSON estructurados con correlación por `request_id` y `tenant_id`.
4. Crear Helm Charts base para Kubernetes: API, PostgreSQL (StatefulSet), Redis (StatefulSet).
5. Configurar health checks y probes (readiness/liveness). Pipeline de CD a staging con aprobación manual a producción.
6. Crear CLI `cintel-scaffold`: genera estructura de carpetas, archivos base, CI/CD y micrositio documental dado nombre y tipo de proyecto.
7. Escribir guía de inicio rápido (< 10 páginas).
8. Realizar prueba de validación: nuevo proyecto de prueba desde scaffolding. Medir tiempo hasta tener multi-tenancy, auth y LLM Gateway en desarrollo local.
9. Completar checklist de seguridad OWASP Top 10.

**Entregables:**
- `Audit Service` inmutable y funcional.
- Dashboard base Grafana con métricas transversales.
- Helm Charts base listos para staging.
- CLI `cintel-scaffold` funcional.
- Guía de inicio rápido.
- Reporte de prueba de validación con tiempo medido.
- Checklist OWASP Top 10 sin hallazgos críticos.

**Criterios de cierre:**
- Toda operación queda registrada en el Audit Service.
- Dashboard Grafana muestra métricas en tiempo real.
- Un desarrollador nuevo levanta el Core en local en menos de 30 minutos.
- Prueba de validación completa en menos de 1 día de trabajo.
- Checklist OWASP Top 10 sin hallazgos críticos abiertos.

---

## 4. Diagrama de Gantt por sprint

<div class="diagram-block">
<div class="diagram-label">Diagrama 1 — Cronograma de implementación del Core Transversal (Gantt por sprint)</div>
<img src="assets/img/diagramas/roadmap-fases.png" alt="Cronograma Gantt por sprint del Core Transversal">
<div class="diagram-links">
<a href="assets/plantuml/roadmap-fases.puml" download>⬇ Descargar .puml</a>
</div>
</div>

---

## 5. Flujo de scaffolding

<div class="diagram-block">
<div class="diagram-label">Diagrama 2 — Flujo de creación de un nuevo proyecto desde el Core Transversal</div>
<img src="assets/img/diagramas/flujo-nuevo-proyecto.png" alt="Flujo de creación de un nuevo proyecto desde el scaffolding">
<div class="diagram-links">
<a href="assets/plantuml/flujo-nuevo-proyecto.puml" download>⬇ Descargar .puml</a>
</div>
</div>

---

## 6. Hitos de control

- **Hito 0** (fin Sprint 0): AuthN/RBAC, CI/CD y Docker Compose operativos. Proyectos derivados pueden iniciar su propio Sprint 0.
- **Hito 1** (fin Sprint 1): Multi-tenancy con aislamiento RLS validado. DIE y Agent pueden integrar autenticación y tenant_id.
- **Hito 2** (fin Sprint 2): LLM Gateway operativo con rate-limiting, caché y control de costos. Proyectos derivados pueden integrar el Gateway desde su Sprint 1.
- **Hito 3** (fin Sprint 3): Core Transversal completo y validado. Scaffolding disponible para futuros proyectos.

---

## 7. Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Complejidad subestimada del RLS multi-tenant | Alto | Prototipar RLS en Sprint 0 como spike técnico; incluir en criterios de cierre del Sprint 1 |
| Integración LLM Gateway con múltiples proveedores | Medio | Iniciar con un proveedor (OpenAI) en Sprint 2; añadir Google/DeepSeek como segunda prioridad |
| Proyectos derivados no adoptan el Core a tiempo | Alto | Definir en Sprint 0 el contrato de API del Core; comunicar hitos de disponibilidad al equipo |
| Alcance del Sprint 3 demasiado amplio | Medio | Helm Charts y scaffolding CLI son descomponibles; priorizar Audit Service y OWASP si hay presión de tiempo |
| Dependencias circulares Core ↔ proyectos | Medio | El Core expone solo interfaces estables; los proyectos son consumidores, no modificadores del Core |

---

## 8. Dependencias críticas

- AuthN/RBAC operativo (fin Sprint 0): bloqueante para que DIE y Agent inicien su Sprint 0.
- Multi-tenancy validado (fin Sprint 1): bloqueante para que DIE y Agent implementen aislamiento de datos.
- LLM Gateway disponible (fin Sprint 2): bloqueante para integraciones LLM en Sprint 1 de los proyectos derivados.
- Helm Charts y pipeline CD listos antes del Sprint 5 del RAG y Sprint 6 del Agent.

---

## Resumen del cronograma

| Sprint | Objetivo | Duración | Dependencias |
|---|---|---|---|
| **Sprint 0** — Seguridad, configuración e infraestructura base | AuthN/JWT, RBAC, Security Middleware, CI/CD, Docker Compose | 2 semanas | Ninguna |
| **Sprint 1** — Multi-tenancy, usuarios y Onboarding | Tenant Registry, RLS, User Manager, Onboarding (5 fases), Session Hub + Dashboard | 2 semanas | Sprint 0 |
| **Sprint 2** — LLM Gateway y Prompt Registry | LLM Router, Rate Limiter, Retry/Fallback, Caché, Cost Controller | 2 semanas | Sprints 0–1 |
| **Sprint 3** — Observabilidad, auditoría y scaffolding | Audit Service, Grafana, Helm Charts, CLI scaffold, OWASP | 2 semanas | Sprints 0–2 |
| **Total** | Core Transversal completo y validado | **8 semanas** | — |

---

## Consideraciones sobre el cronograma

**Adopción incremental:** Los proyectos DIE y Agent no esperan a que el Core esté completo. Inician su Sprint 0 en paralelo con el Sprint 1 del Core y van adoptando los módulos a medida que quedan disponibles: AuthN en Sprint 0, multi-tenancy en Sprint 1, LLM Gateway en Sprint 2.

**Paralelización Sprint 3:** Las actividades de observabilidad (Audit Service, Grafana) y las de scaffolding (CLI, guía) son independientes y pueden ejecutarse en paralelo dentro del Sprint 3 por subequipos.

**Alcance del CLI scaffold:** La herramienta `cintel-scaffold` es un generador básico (script Python o CLI con plantillas). No es un framework completo; su criterio de éxito es que un proyecto funcional arranque en menos de 1 día, no que sea una herramienta de producción.

**Mantenimiento del Core:** Una vez completado, el Core requiere mantenimiento continuo. Se recomienda designar un *Core Maintainer* con al menos 20 % de dedicación para actualizaciones de dependencias y corrección de vulnerabilidades.

**Criterio de éxito del programa:** El Core Transversal se considera exitoso cuando el tiempo de arranque de un nuevo proyecto de IA se reduce de las 4–6 semanas actuales (configuración manual repetida) a **menos de 1 día de trabajo**.
