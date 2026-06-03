# Funcionalidades transversales

## Introducción

Esta sección presenta el catálogo de **26 funcionalidades transversales** identificadas como candidatas para abstraerse en el *Core Transversal CINTEL*. Cada funcionalidad se analiza desde su aplicación actual en el *Document Intelligence Engine* (DIE) y en el *Adaptador de Contenido Institucional* (Agent), su valor como componente reutilizable y su prioridad de implementación.

El objetivo es mostrar cómo estas capacidades podrían empaquetarse como un **proyecto base (scaffolding)** desde el cual iniciar RAG/DIE, Agent y futuras soluciones de IA con coherencia arquitectónica, seguridad integrada y menor tiempo de arranque.

---

## Criterios de prioridad

- **Alta:** Bloquea el inicio seguro de cualquier proyecto. Sin este componente no se puede operar en multi-tenant o producción.
- **Media:** Aporta valor operativo significativo y reduce deuda técnica a corto plazo.
- **Baja:** Mejora la experiencia del equipo o del usuario, pero puede incorporarse en iteraciones posteriores.

---

## Catálogo de funcionalidades

### F-01 — Multi-tenancy

**Descripción:** Capacidad de aislar datos, configuraciones y operaciones por organización cliente (`tenant_id`), garantizando que ningún cliente acceda a información de otro.

**Aplicación en DIE:** `tenant_id` transversal en todos los modelos persistentes (Document, DocumentExtraction, Alert, AuditLog). PostgreSQL RLS (Row-Level Security) para aislamiento lógico. Rate-limiting por tenant en el LLM Gateway.

**Aplicación en Agent:** `tenant_id` en todos los modelos de contexto organizacional, lineamientos de marca, historial de campañas y logs. Aislamiento mediante ADK framework con memory banks independientes por tenant y callbacks explícitos.

**Valor como componente reutilizable:** Es el cimiento de toda la plataforma. Sin multi-tenancy, no es posible ofrecer el servicio a múltiples clientes de forma segura. Su implementación una sola vez y reutilización en todos los proyectos elimina riesgos de fuga de datos entre clientes.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar desde Sprint 0 en todos los proyectos. Incluir `TenantIsolationLayer` como middleware obligatorio. Validar con pruebas de aislamiento antes de cada despliegue a producción.

---

### F-02 — Autenticación y autorización (AuthN / AuthZ)

**Descripción:** Sistema de autenticación basado en JWT (JSON Web Tokens) y autorización basada en roles (RBAC), integrado con el API Gateway para validar identidad y permisos en cada solicitud.

**Aplicación en DIE:** JWT decode en el API Gateway. RBAC por tenant para controlar acceso a extracción, validación y alertas. Roles: administrador, operador, auditor.

**Aplicación en Agent:** JWT para autenticar sesiones. RBAC para controlar acceso a campañas, lineamientos de marca y configuración de agentes. Roles: administrador, creativo, aprobador.

**Valor como componente reutilizable:** Una capa de autenticación robusta, probada y configurable evita implementaciones ad hoc con vulnerabilidades. Reduce el tiempo de securización inicial de cualquier nuevo proyecto.

**Prioridad:** Alta

**Observaciones técnicas:** Usar librería estándar de JWT (PyJWT o equivalente). No implementar autenticación propia. Configurar expiración de tokens, rotación y revocación. Validar OWASP A07 (Identification and Authentication Failures).

---

### F-03 — Gestión de usuarios y roles

**Descripción:** CRUD de usuarios, asignación de roles por organización y gestión del ciclo de vida de cuentas (alta, baja, cambio de rol, suspensión).

**Aplicación en DIE:** Usuarios con roles por tenant para acceso diferenciado a documentos, extracciones y alertas. Administración de permisos granulares por tipo de documento.

**Aplicación en Agent:** Usuarios con roles para gestión de campañas, aprobación de contenido y administración de lineamientos de marca por organización.

**Valor como componente reutilizable:** Evitar reimplementar gestión de usuarios en cada proyecto. Un módulo estándar reduce tiempo de desarrollo y asegura consistencia en políticas de acceso.

**Prioridad:** Alta

**Observaciones técnicas:** Separar autenticación (quién eres) de autorización (qué puedes hacer). Implementar auditoría de cambios de roles. Integrar con Identity Provider externo (Keycloak, Auth0) si es posible.

---

### F-04 — Administración de organizaciones o clientes

**Descripción:** Módulo para registrar, configurar y gestionar las organizaciones cliente (tenants): nombre, dominio, plan de servicio, cuotas, configuración personalizada y estado (activo/inactivo).

**Aplicación en DIE:** Configuración por tenant de tipos de documentos, esquemas de extracción, fuentes de referencia y umbrales de validación. Onboarding de nuevos clientes con flujo estandarizado.

**Aplicación en Agent:** Configuración por tenant de lineamientos de marca, canales activos, plantillas de campaña y parámetros de calidad. Onboarding con carga de contexto organizacional inicial.

**Valor como componente reutilizable:** La lógica de gestión de clientes es idéntica en ambas soluciones. Un Tenant Registry centralizado con API de configuración elimina duplicación y facilita la incorporación de nuevos clientes.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar `TenantRegistry` como servicio independiente. Versionar la configuración por tenant para auditoría de cambios. Soportar configuración por ambiente (dev/staging/prod).

---

### F-05 — Gestión documental

**Descripción:** Ingesta, almacenamiento, indexación y recuperación de documentos (PDF, DOCX, XLSX, imágenes). Incluye gestión del ciclo de vida del documento: recepción, procesamiento, archivo y eliminación.

**Aplicación en DIE:** Módulo central del sistema. Ingesta de documentos → normalización → extracción → validación → resultado. Soporte para procesamiento nativo (digital) y LLM/VLM (imágenes, documentos complejos).

**Aplicación en Agent:** Ingesta de documentos de contexto organizacional (lineamientos de marca, historial de campañas, ejemplos de contenido) para alimentar los agentes. Gestión de archivos adjuntos en campañas.

**Valor como componente reutilizable:** La capa de ingesta y normalización de documentos puede abstraerse como `DocumentIngestionService` reutilizable, separando la lógica de procesamiento específica de cada proyecto.

**Prioridad:** Media

**Observaciones técnicas:** Implementar `NormalizedDocumentRepresentation` como formato interno. Registrar método de extracción (nativo, LLM/VLM, OCR) en metadatos. Implementar storage abstraction para compatibilidad con S3, Azure Blob, GCS.

---

### F-06 — Auditoría y trazabilidad

**Descripción:** Registro inmutable de todas las operaciones realizadas en el sistema: qué acción, quién la ejecutó, con qué datos de entrada, qué resultado produjo y cuándo. Trazabilidad por `tenant_id`, `user_id`, `operation_id` y `timestamp`.

**Aplicación en DIE:** `AuditService` con logs inmutables por operación de extracción, validación y alerta. Métricas de trazabilidad incluyen `tokens_entrada`, `tokens_salida`, `latencia_ms`, `modelo_usado`, `prompt_version`.

**Aplicación en Agent:** Logs de generación de contenido, validaciones del crítico, aprobaciones humanas y publicaciones por canal. Correlación por `tenant_id` y `campaign_id`.

**Valor como componente reutilizable:** La auditoría es un requisito regulatorio y operativo universal. Un `AuditService` centralizado evita la implementación repetida y garantiza consistencia en los registros de todas las soluciones.

**Prioridad:** Alta

**Observaciones técnicas:** Usar almacenamiento append-only o inmutable (PostgreSQL con particionado temporal, o event store). No permitir actualización ni borrado de registros de auditoría. Retención mínima de 12 meses.

---

### F-07 — Configuración por ambiente

**Descripción:** Gestión de configuración diferenciada por ambiente de despliegue (desarrollo, staging, producción), con variables de entorno, secretos y parámetros específicos por ambiente.

**Aplicación en DIE:** Variables críticas por ambiente: conexiones a bases de datos, claves de API de proveedores LLM, umbrales de validación, configuración de Celery/Redis, límites de rate-limiting por tenant.

**Aplicación en Agent:** Variables por ambiente: endpoints de proveedores de IA, configuración de canales de publicación, modelos predeterminados, parámetros de generación (temperatura, max tokens), límites de imágenes.

**Valor como componente reutilizable:** Un sistema de configuración por ambiente estandarizado evita errores de configuración que comprometan la seguridad o el funcionamiento en producción. Se puede implementar una vez y reutilizar con un archivo de plantilla por proyecto.

**Prioridad:** Alta

**Observaciones técnicas:** Usar `.env` con python-dotenv o equivalente. Nunca comprometer secretos en el repositorio. Integrar con Vault (HashiCorp) o Secret Manager de la nube para producción. Validar variables requeridas al inicio de la aplicación.

---

### F-08 — Observabilidad

**Descripción:** Conjunto integrado de herramientas para monitorear el comportamiento del sistema en tiempo real: MLFlow para experimentos y seguimiento de modelos, Grafana para dashboards operacionales, y Ray para monitoreo de carga distribuida.

**Aplicación en DIE:** MLFlow para experimentos de selección de modelos LLM (evaluación con 100 documentos reales), Grafana para métricas operacionales por tenant, Ray para procesamiento en lote a escala.

**Aplicación en Agent:** MLFlow para A/B testing de prompts y estrategias de generación, Grafana para métricas de calidad de contenido y latencia por canal, `ObservabilityService` para correlación de eventos por `tenant_id` y `campaign_id`.

**Valor como componente reutilizable:** El stack MLFlow + Grafana + Ray se repite exactamente en ambas soluciones. Centralizar la configuración de observabilidad y las definiciones de métricas base permite visibilidad unificada de toda la plataforma.

**Prioridad:** Media

**Observaciones técnicas:** Definir un conjunto de métricas base obligatorias para todos los proyectos: `tokens_entrada`, `tokens_salida`, `latencia_ms`, `modelo_usado`, `tenant_id`, `error_rate`. Cada proyecto agrega métricas específicas sobre esta base.

---

### F-09 — Manejo de logs

**Descripción:** Sistema de logging estructurado (JSON) con niveles de severidad (DEBUG, INFO, WARNING, ERROR, CRITICAL), correlación por `request_id` y `tenant_id`, y enrutamiento a destinos configurables (consola, archivo, servicio centralizado).

**Aplicación en DIE:** Logs estructurados de cada etapa del pipeline: ingesta, extracción, validación, alertas. Correlación de logs con registros de auditoría para trazabilidad completa.

**Aplicación en Agent:** Logs de ciclos de generación, iteraciones del crítico, validaciones humanas y publicaciones. Identificación de operaciones fallidas por agente y canal.

**Valor como componente reutilizable:** Una configuración de logging estandarizada y centralizada facilita el diagnóstico de problemas en producción y el análisis post-incidente. Evita logs fragmentados o sin correlación entre componentes.

**Prioridad:** Media

**Observaciones técnicas:** Usar `structlog` o logging JSON estándar. Configurar niveles por ambiente (DEBUG en dev, INFO en prod). Integrar con sistema de centralización de logs (Loki, Elasticsearch, CloudWatch).

---

### F-10 — Seguridad

**Descripción:** Conjunto de controles de seguridad aplicados transversalmente: validación de entradas en fronteras del sistema, sanitización de datos, cabeceras de seguridad HTTP, protección contra inyección, cifrado en tránsito y en reposo.

**Aplicación en DIE:** Validación de documentos en ingesta (tipo, tamaño, contenido). Sanitización de campos extraídos antes de almacenamiento. Cifrado de datos sensibles en reposo. Protección contra path traversal en gestión de archivos.

**Aplicación en Agent:** Validación de contenido generado antes de publicación. Sanitización de lineamientos de marca (prevenir inyección de prompts). Cabeceras de seguridad en la API REST. Cifrado de credenciales de canales de publicación.

**Valor como componente reutilizable:** Un `SecurityMiddleware` configurado con las mejores prácticas del OWASP Top 10 puede aplicarse a todos los proyectos como capa obligatoria, garantizando un nivel de seguridad base consistente.

**Prioridad:** Alta

**Observaciones técnicas:** Validar contra OWASP Top 10 en cada release. Implementar Content Security Policy (CSP), CORS configurado, rate-limiting a nivel de API Gateway. Nunca confiar en datos de entrada sin validación.

---

### F-11 — Gestión de permisos granulares

**Descripción:** Sistema de control de acceso basado en recursos y acciones (RBAC extendido o ABAC), que permite definir quién puede hacer qué sobre qué recurso, con granularidad de operación (leer, crear, editar, aprobar, eliminar).

**Aplicación en DIE:** Permisos por tipo de documento, por operación (extracción, validación, alerta) y por estado del documento (en revisión, aprobado, archivado).

**Aplicación en Agent:** Permisos por campaña, por agente (acceso a lineamientos de marca, historial), por canal de publicación y por estado de la campaña (borrador, revisión, publicado).

**Valor como componente reutilizable:** Un motor de permisos configurado externamente (sin lógica hardcoded) permite adaptar los controles de acceso sin modificar el código de negocio. Reduce errores de autorización y facilita auditorías de cumplimiento.

**Prioridad:** Media

**Observaciones técnicas:** Considerar Open Policy Agent (OPA) o Casbin para externalizar políticas. Registrar todas las evaluaciones de permisos en el `AuditService`. Revisar permisos en cada cambio de rol o desactivación de usuario.

---

### F-12 — Integración con modelos de IA (LLM Gateway)

**Descripción:** Capa centralizada para gestionar el acceso a proveedores de modelos de lenguaje (OpenAI, Google Generative AI, DeepSeek, Gemma). Incluye rate-limiting por tenant, reintentos, fallbacks, balanceo de carga, caché de respuestas y enrutamiento de lotes.

**Aplicación en DIE:** Componente crítico de MVP. Gestiona el acceso al `StructuredExtractor` y al `Critic-Evaluator Agent`. Controla tokens por tenant y por operación. Implementa retry exponencial con fallback a modelo alternativo.

**Aplicación en Agent:** Gestiona el acceso de los agentes estratégico, crítico, creativo y de canal a los proveedores LLM. Aplica presupuesto de tokens por campaña y por tenant.

**Valor como componente reutilizable:** El LLM Gateway es el componente de mayor riesgo de escalabilidad en ambas soluciones. Implementarlo una sola vez con todas las capacidades (rate-limit, retry, fallback, caché, batch) y reutilizarlo elimina el riesgo de cuello de botella por tenant en todas las soluciones futuras.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar como servicio independiente (microservicio o librería con interfaz estable). Exponer métricas de uso de tokens por tenant en tiempo real. Soportar configuración de modelo predeterminado y de fallback por tenant.

---

### F-13 — Conectores externos

**Descripción:** Adaptadores configurables para integrar el sistema con servicios externos: CRMs, ERPs, bases de datos de referencia, APIs de terceros, sistemas de almacenamiento en la nube y plataformas de comunicación.

**Aplicación en DIE:** Conector a fuentes de referencia (CSV/Excel) para validación cruzada. Adaptador de almacenamiento (S3/Azure Blob). Conector a sistemas de notificación para alertas de discrepancia.

**Aplicación en Agent:** Conectores a canales de publicación (LinkedIn API, Instagram Graph API, servicio de email, WhatsApp Business API). Adaptador de exportación de contenido aprobado.

**Valor como componente reutilizable:** Un `ConnectorRegistry` con adaptadores estándar y un protocolo de integración bien definido permite agregar conectores a nuevos sistemas sin modificar el núcleo de la solución.

**Prioridad:** Baja

**Observaciones técnicas:** Definir una interfaz abstracta `ExternalConnector` que todos los adaptadores implementen. Manejar errores de conectores externos con circuit breaker. Registrar todas las llamadas a sistemas externos en el `AuditService`.

---

### F-14 — Administración de prompts (Prompt Registry)

**Descripción:** Repositorio centralizado de prompts con versionado, guardrails, ejemplos few-shot, instrucciones de formato y metadatos de uso. Permite actualizar y experimentar con prompts sin redesplegar el sistema.

**Aplicación en DIE:** `PromptRegistry` con prompts por tipo de documento, esquema de extracción y tarea (extracción, validación, descripción de imágenes). Guardrails explícitos para prevenir alucinaciones. Evaluación por MLFlow.

**Aplicación en Agent:** Registry de prompts por agente (estratégico, crítico, creativo) y por canal. Plantillas de prompts con variables de contexto organizacional. Versionado para A/B testing de estrategias de generación.

**Valor como componente reutilizable:** Un Prompt Registry centralizado con API de consulta permite que todos los proyectos gestionen sus prompts de forma consistente, facilita la experimentación y reduce el riesgo de regresiones al cambiar prompts en producción.

**Prioridad:** Media

**Observaciones técnicas:** Versionar prompts con semántica mayor.menor (e.g., `v2.1`). Registrar la versión del prompt usada en cada operación del `AuditService`. Implementar validación de prompts al guardar (longitud máxima, variables requeridas).

---

### F-15 — Gestión de sesiones y dashboard centralizado

**Descripción:** Módulo unificado de gestión de sesiones de usuario con dos capas complementarias: (a) estado de flujos de trabajo internos (procesamiento por lotes, ciclos de generación, aprobaciones), y (b) sesión transversal de usuario compartida entre todas las aplicaciones del portafolio con un **dashboard centralizado** como hub de navegación.

**Aplicación en DIE:** Gestión del estado de procesamiento por lote (Celery + Redis): documentos en cola, en proceso, completados, fallidos. Persistencia del estado entre reintentos y notificación de cambios de estado.

**Aplicación en Agent:** ADK framework gestiona el estado de las sesiones de generación: contexto acumulado entre iteraciones, historial de versiones del contenido, estado de aprobación por canal. La sesión persiste el perfil institucional activo para no requerir re-carga de contexto.

**Componente transversal — Session Hub:**

El `SessionManager` del Core Transversal emite un **JWT de sesión compartida** al autenticarse el usuario, que propaga su identidad (`tenant_id`, `user_id`, `role`, `solutions`) a todos los micrositios sin re-autenticación:

```
[Login centralizado]
        │  JWT emitido
        ▼
[Dashboard Hub — hub de navegaciones]
   ├──→ [DIE / RAG Micrositio]  (lee JWT de localStorage)
   ├──→ [Agent Micrositio]       (lee JWT de localStorage)
   └──→ [Transversal Docs]       (indicador de sesión en topbar)
```

El **Dashboard centralizado** es la pantalla principal tras el login. Muestra:
- Tarjetas de acceso a cada solución activa para el tenant
- Métricas consolidadas: documentos procesados, campañas activas, consumo de tokens
- Actividad reciente unificada (DIE + Agent + Onboarding)
- Estado de la sesión con tiempo restante y botón de logout global

**Valor como componente reutilizable:** Un `SessionManager` estándar con dashboard integrado elimina la necesidad de re-autenticación entre aplicaciones, centraliza el control de acceso y da al usuario una vista unificada del ecosistema CINTEL. Es el diferencial de experiencia de usuario del portafolio.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar JWT con claims de soluciones activas (`["die", "agent"]`). Usar `localStorage` para propagación entre micrositios del mismo origen. Implementar expiración configurable (8h por defecto, con aviso a los 30 min). Registrar `session.create`, `session.refresh` y `session.close` en el `AuditService`. Ver prototipo funcional en [Mockup — Prototipo navegable](mockup.html).

---

### F-16 — Manejo de archivos

**Descripción:** Servicio de gestión de archivos que abstrae el almacenamiento subyacente: subida segura, validación de tipo y tamaño, almacenamiento con metadatos, generación de URLs firmadas para acceso temporal y eliminación segura.

**Aplicación en DIE:** Ingesta de documentos (PDF, DOCX, imágenes) con validación de formato y tamaño. Almacenamiento en S3 o Azure Blob con metadatos por tenant. URLs firmadas para acceso temporal a documentos procesados.

**Aplicación en Agent:** Gestión de archivos de lineamientos de marca (imágenes, documentos de identidad visual), assets de campañas y contenido exportado. Control de versiones de archivos por campaña.

**Valor como componente reutilizable:** Un `FileService` que abstrae el proveedor de almacenamiento facilita el cambio entre proveedores (AWS, Azure, GCP, local) sin modificar el código de negocio. Reduce vulnerabilidades por gestión incorrecta de archivos.

**Prioridad:** Media

**Observaciones técnicas:** Validar extensión y MIME type por separado. Implementar escaneo antivirus en archivos subidos. Usar prefijos de path que incluyan `tenant_id` para evitar colisiones. Implementar policy de retención y limpieza automática.

---

### F-17 — Monitoreo de uso

**Descripción:** Seguimiento en tiempo real y analítica histórica del uso del sistema por tenant: número de operaciones, volumen de documentos procesados, tokens consumidos, latencia promedio, errores y tendencias de crecimiento.

**Aplicación en DIE:** Métricas de uso por tenant: documentos procesados, tokens por extracción, tasa de errores de validación, tiempo promedio de procesamiento. Dashboard en Grafana.

**Aplicación en Agent:** Métricas de uso por tenant: campañas generadas, tokens por campaña por canal, tasa de aprobación, tiempo de ciclo desde solicitud hasta publicación.

**Valor como componente reutilizable:** Un `UsageMetricsService` centralizado permite aplicar cuotas, generar reportes de facturación, detectar anomalías de uso y planificar capacidad para todos los proyectos desde una sola fuente de verdad.

**Prioridad:** Media

**Observaciones técnicas:** Implementar métricas en tiempo real (Prometheus/Grafana) y analítica histórica (PostgreSQL con agregaciones). Exponer API de consulta de uso para el módulo de control de costos.

---

### F-18 — Control de costos

**Descripción:** Módulo para gestionar el gasto en servicios externos (principalmente proveedores LLM): presupuestos por tenant, alertas de umbral, reportes de gasto, proyecciones y mecanismos de control (cuotas, pausas automáticas).

**Aplicación en DIE:** Variables de control: modelo LLM seleccionado, tokens por documento, tasa de reintentos, activación de OCR y frecuencia de validación cruzada. Riesgo crítico identificado: escalabilidad de tokens/RPM en multi-tenant.

**Aplicación en Agent:** Variables de control: modelo de generación, presupuesto por campaña, límite de imágenes generadas (`MAX_IMAGE_GENERATED=8`), volumen de campañas simultáneas.

**Valor como componente reutilizable:** Un `CostController` centralizado que se integra con el LLM Gateway permite aplicar límites de gasto a nivel de tenant y de operación en todos los proyectos, previniendo sorpresas en la factura de proveedores de IA.

**Prioridad:** Media

**Observaciones técnicas:** Implementar alertas de umbral al 70 % y 90 % del presupuesto mensual por tenant. Integrar con el LLM Gateway para bloquear operaciones cuando se alcanza el límite. Generar reportes de gasto en formato descargable.

---

### F-19 — Despliegue

**Descripción:** Configuración de despliegue contenerizado (Docker + Kubernetes o Docker Compose para ambientes locales) con definiciones de infraestructura como código (IaC), políticas de escalado y estrategias de rollout.

**Aplicación en DIE:** Despliegue con Docker Compose para desarrollo local. Kubernetes para staging y producción. Componentes: API, workers Celery, Redis, PostgreSQL, servicios de observabilidad.

**Aplicación en Agent:** Despliegue similar con componentes adicionales: servidor ADK, workers de agentes, servicio de almacenamiento de contexto. Mismas herramientas de infraestructura.

**Valor como componente reutilizable:** Una plantilla de `docker-compose.yml` y archivos Helm/Kubernetes base permite iniciar cualquier nuevo proyecto con la infraestructura correctamente configurada en minutos en lugar de días.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar health checks en todos los servicios. Configurar límites de recursos (CPU/memoria) desde el inicio. Usar imágenes base oficiales y escanearlas en CI/CD.

---

### F-20 — CI/CD

**Descripción:** Pipeline de integración y despliegue continuo que automatiza: pruebas unitarias, pruebas de integración, análisis de seguridad (SAST), construcción de imágenes Docker, despliegue a staging y promoción a producción.

**Aplicación en DIE:** Sprint 0 incluye CI/CD como bloquea (`BLOCKER`). Pipeline con pruebas automáticas, contrato de API para el módulo de IA, y gates de calidad previos a despliegue.

**Aplicación en Agent:** CI/CD para despliegue de agentes y actualizaciones de prompts. Pruebas de regresión de calidad de contenido generado.

**Valor como componente reutilizable:** Una plantilla de pipeline CI/CD (GitHub Actions, GitLab CI o equivalente) que incluya todos los stages estándar permite que cada nuevo proyecto arranque con automatización de calidad desde el día 1.

**Prioridad:** Alta

**Observaciones técnicas:** Incluir stage de escaneo de vulnerabilidades (Trivy, Snyk). Separar pipelines de CI (en cada PR) y CD (en merge a main). Implementar gates de calidad: cobertura mínima de pruebas, análisis de dependencias, revisión de secretos.

---

### F-21 — Parametrización

**Descripción:** Sistema para gestionar parámetros de comportamiento del sistema en tiempo de ejecución sin redespliegue: umbrales de calidad, modelos predeterminados, cuotas, activación de funcionalidades (feature flags) y configuración de flujos.

**Aplicación en DIE:** Parámetros configurables: `MAX_DYNAMIC_QUESTIONS`, umbral de OCR, frecuencia de validación cruzada, modelo LLM predeterminado por tipo de documento.

**Aplicación en Agent:** Parámetros configurables: `MAX_IMAGE_GENERATED`, temperatura de generación, número máximo de iteraciones del crítico, modelos por canal.

**Valor como componente reutilizable:** Un `ConfigService` con soporte para feature flags y parámetros en tiempo de ejecución permite ajustar el comportamiento del sistema sin interrupciones, facilita las pruebas A/B y reduce el riesgo de cambios en producción.

**Prioridad:** Baja

**Observaciones técnicas:** Implementar con `python-decouple` o equivalente para ambiente. Agregar feature flags con LaunchDarkly o implementación propia simple (tabla en PostgreSQL). Registrar cambios de configuración en el `AuditService`.

---

### F-22 — Versionamiento de componentes

**Descripción:** Gestión de versiones de componentes críticos que evolucionan con el tiempo: esquemas de extracción (DIE), prompts (ambos), lineamientos de marca (Agent), modelos de IA utilizados y versiones de la API.

**Aplicación en DIE:** `DocumentSchemaRegistry` con versiones de esquemas por tipo de documento y tenant. `PromptRegistry` con versionado semántico. Registro de versión de modelo LLM usado en cada extracción.

**Aplicación en Agent:** Versionado de lineamientos de marca, plantillas de campaña y prompts por agente. Historial de versiones de contenido generado por campaña.

**Valor como componente reutilizable:** Un `VersionRegistry` centralizado para componentes configurables (esquemas, prompts, modelos) permite reproducir exactamente el comportamiento del sistema en cualquier punto del pasado, lo cual es crítico para auditoría y depuración.

**Prioridad:** Media

**Observaciones técnicas:** Usar versionado semántico (major.minor.patch). Nunca eliminar versiones anteriores mientras haya operaciones que las referencien. Exponer historial de versiones en la API de administración.

---

### F-23 — Reutilización de UI

**Descripción:** Biblioteca de componentes de interfaz de usuario compartidos: sistema de diseño (tokens de color, tipografía, espaciado), componentes base (botones, tablas, formularios, tarjetas, navegación) y patrones de layout.

**Aplicación en DIE:** Micrositio documental con shell SPA, navegación lateral, cargador de Markdown, tabla de contenidos dinámica y estilos de documentación técnica.

**Aplicación en Agent:** Micrositio documental con arquitectura idéntica: mismo shell SPA, mismo sistema de estilos, mismo cargador de Markdown.

**Valor como componente reutilizable:** Los dos micrositios existentes ya son casi idénticos en su implementación. Extraer el shell, los estilos base y los scripts JS como una librería de componentes comunes eliminaría la duplicación actual y garantizaría consistencia visual entre todos los proyectos de documentación.

**Prioridad:** Baja

**Observaciones técnicas:** Este Core Transversal es en sí mismo la primera materialización de esta idea: reutiliza exactamente la infraestructura técnica de RAG y Agent con un esquema de colores diferenciado. El siguiente paso es formalizar este patrón como librería npm o paquete Python.

---

### F-24 — Navegación base

**Descripción:** Estructura de navegación estándar para aplicaciones de la plataforma: menú lateral, navegación entre secciones, tabla de contenidos dinámica, búsqueda en sitio y navegación entre páginas (anterior/siguiente).

**Aplicación en DIE:** Implementada en `site-shell.html` + `app.js` + `page-shell.js`. Menú lateral con secciones AS-IS y TO-BE. Búsqueda full-text sobre contenido Markdown.

**Aplicación en Agent:** Implementada con exactamente la misma arquitectura: mismos scripts, mismo shell, misma lógica de navegación y búsqueda.

**Valor como componente reutilizable:** La navegación base ya está implementada dos veces. Extraerla como módulo compartido con parámetros de configuración (secciones del menú, colores) permitiría crear nuevos micrositios en minutos.

**Prioridad:** Baja

**Observaciones técnicas:** Este micrositio transversales ya es la tercera instancia del mismo patrón. Formalizar como scaffolding con un generador de sitios (script Python o plantilla) es el paso natural.

---

### F-25 — Estructura de documentación técnica

**Descripción:** Plantilla estándar de documentación técnica para proyectos de la plataforma: secciones mínimas requeridas (contexto, arquitectura AS-IS, arquitectura TO-BE, decisiones de módulos, cronograma, preguntas para experto, conclusiones), formato Markdown y convenciones de redacción.

**Aplicación en DIE:** 17 páginas organizadas en secciones AS-IS, TO-BE y Transversal. Contenido en Markdown cargado dinámicamente. Diagramas PlantUML con PNG exportado y enlace de descarga.

**Aplicación en Agent:** 44 páginas con la misma estructura modular. Mismas convenciones de contenido y diagrams.

**Valor como componente reutilizable:** Una plantilla de documentación estándar con las secciones requeridas, convenciones de nomenclatura y ejemplos por sección reduce el tiempo de documentación de nuevos proyectos y garantiza completitud desde el inicio.

**Prioridad:** Baja

**Observaciones técnicas:** Crear un generador de micrositio (`scaffolding-tool`) que, dado el nombre del proyecto y el tipo (extracción, generación, agente), produzca automáticamente la estructura de carpetas, páginas HTML, archivos Markdown con placeholder y scripts de renderizado de diagramas.

---

### F-26 — Onboarding de nuevos clientes

**Descripción:** Flujo estandarizado de **5 fases** para incorporar un nuevo tenant al portafolio CINTEL. Es el primer punto de contacto funcional del cliente con la plataforma y el módulo que garantiza que el sistema cuente con toda la información necesaria para operar con identidad institucional desde el primer día.

| Fase | Nombre | Responsable | Duración est. |
|---|---|---|---|
| 1 | Registro de organización | Admin CINTEL | 15 min |
| 2 | Carga de contexto institucional | Cliente (asistido) | 30–60 min |
| 3 | Creación de usuarios y roles | Admin cliente | 15 min |
| 4 | Configuración técnica de soluciones | Técnico CINTEL | 30 min |
| 5 | Tour guiado y activación | Cliente + CINTEL | 30 min |

**Aplicación en DIE:** El `OnboardingOrchestrator` crea el registro de tenant, configura esquemas de extracción iniciales, crea usuario administrador y valida la configuración antes de activar la extracción. La Fase 2 captura los tipos de documentos contratados y los umbrales de validación.

**Aplicación en Agent:** La Fase 2 carga el contexto organizacional completo (tono de marca ponderado, audiencias, canales, restricciones regulatorias, manual de marca PDF) mediante extracción automática desde la web + enriquecimiento manual. Esto alimenta el `OrganizationalContextStore` que el agente consultará en cada generación.

**Funcionalidad clave — Extracción web asistida (Fase 2):**
El sistema analiza el sitio web institucional del cliente e intenta pre-poblar: nombre, sector, servicios, canales de comunicación y paleta de colores. El resultado se presenta para revisión y corrección antes de persistirse. El principio es: *el sistema asiste; el usuario decide*.

**Criterios de activación:**
- `tenant_id` creado y en estado `active`
- Contexto institucional validado y persistido (completitud ≥ 80 %)
- Al menos 1 usuario `org_admin` activo
- Configuración técnica de todas las soluciones validada
- Tour completado y confirmado
- Evento de activación registrado en `AuditService`

**Valor como componente reutilizable:** Un `OnboardingOrchestrator` que ejecute este flujo de 5 fases — con pasos específicos configurables por tipo de proyecto — garantiza que ningún tenant quede con configuración incompleta, reduce el tiempo de activación a menos de 4 horas y mejora decisivamente la experiencia del cliente en su primer contacto con la plataforma.

**Prioridad:** Alta

**Observaciones técnicas:** Implementar como wizard navegable (pasos 1–5 verificables). Soportar onboarding parcial: guardar progreso por fase y permitir reanudar. Registrar cada paso en el `AuditService` con usuario, timestamp y hash. Validar completitud con `CompletenessScorer` antes de activar. Ver el flujo completo en el [prototipo funcional](mockup.html) del Core Transversal.

---

## Resumen de prioridades

| Prioridad | Funcionalidades |
|-----------|----------------|
| **Alta** | F-01 Multi-tenancy · F-02 AuthN/AuthZ · F-03 Gestión de usuarios · F-04 Administración de organizaciones · F-06 Auditoría · F-07 Configuración por ambiente · F-10 Seguridad · F-12 LLM Gateway · F-15 Sesiones y dashboard · F-19 Despliegue · F-20 CI/CD · F-26 Onboarding |
| **Media** | F-05 Gestión documental · F-08 Observabilidad · F-09 Manejo de logs · F-11 Gestión de permisos · F-14 Prompt Registry · F-16 Manejo de archivos · F-17 Monitoreo de uso · F-18 Control de costos · F-22 Versionamiento |
| **Baja** | F-13 Conectores externos · F-21 Parametrización · F-23 Reutilización de UI · F-24 Navegación base · F-25 Estructura de documentación |

Las 10 funcionalidades de prioridad **Alta** conforman el núcleo mínimo viable del *Core Transversal* y deben implementarse en las primeras dos fases del cronograma antes de que cualquier proyecto nuevo arranque sobre este scaffolding.
