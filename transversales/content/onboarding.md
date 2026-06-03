# Onboarding — Módulo transversal de incorporación de clientes

> Módulo compartido del *Core Transversal CINTEL*. Define el flujo estándar para registrar nuevas organizaciones y usuarios en cualquier solución del portafolio (DIE, Agent y futuras). Su objetivo es que **cada nuevo cliente opere en producción en menos de 4 horas**, con contexto institucional completo y acceso controlado desde el primer momento.

---

## Propósito del módulo

El **Onboarding Transversal** es el punto de entrada unificado al ecosistema CINTEL. En lugar de que cada solución implemente su propia lógica de incorporación — con formularios diferentes, flujos de aprobación distintos y bases de datos separadas — este módulo centraliza:

- El **registro de organizaciones** (tenants) con sus datos, plan de servicio y configuración inicial.
- El **aprovisionamiento de accesos** para usuarios y roles por organización.
- La **captura del contexto institucional** que las soluciones de IA necesitan para operar con identidad de marca.
- El **tour guiado** a las funcionalidades disponibles según el plan contratado.

Este diseño garantiza que el onboarding sea consistente, auditable y reutilizable independientemente de qué solución contrate el cliente.

---

## Arquitectura del módulo

El módulo de onboarding se organiza en **cinco fases secuenciales**, con puntos de retorno y validación humana en cada transición:

```
┌─────────────────────────────────────────────────────────────────┐
│                  ONBOARDING TRANSVERSAL CINTEL                  │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│ Fase 1   │ Fase 2   │ Fase 3   │ Fase 4   │ Fase 5             │
│ Registro │ Contexto │ Accesos  │ Config.  │ Tour y activación  │
│ org.     │ inst.    │ usuarios │ solución │                    │
└──────────┴──────────┴──────────┴──────────┴────────────────────┘
```

| Fase | Nombre | Duración estimada | Responsable |
|---|---|---|---|
| 1 | Registro de organización | 15 min | Administrador CINTEL |
| 2 | Carga de contexto institucional | 30–60 min | Cliente (asistido) |
| 3 | Creación de usuarios y roles | 15 min | Administrador cliente |
| 4 | Configuración de la solución | 30 min | Técnico CINTEL |
| 5 | Tour guiado y activación | 30 min | Cliente + CINTEL |

---

## Fase 1 — Registro de la organización

### Descripción

El administrador de CINTEL registra la organización cliente en el *Tenant Registry*. Este registro crea el `tenant_id` único que identificará a la organización en todos los sistemas del portafolio: bases de datos, logs de auditoría, métricas de uso y facturación.

### Datos requeridos

| Campo | Descripción | Ejemplo |
|---|---|---|
| Nombre legal | Razón social de la organización | Centro Internacional de Inteligencia en TIC |
| Nombre corto | Identificador operativo | CINTEL |
| Dominio corporativo | Dominio de correo institucional | @cintel.co |
| NIT / ID fiscal | Identificador tributario | 830.057.647-1 |
| País / Ciudad | Sede principal | Colombia, Bogotá |
| Plan de servicio | Nivel de acceso contratado | Professional / Enterprise |
| Soluciones activas | Módulos habilitados | DIE, Agent |
| Cuota mensual de tokens LLM | Límite de consumo asignado | 5.000.000 tokens/mes |
| Fecha de inicio | Inicio del período de servicio | 2026-07-01 |

### Salida

Al completar esta fase, el sistema genera:

```json
{
  "tenant_id": "cintel-co-001",
  "status": "pending_onboarding",
  "plan": "enterprise",
  "solutions": ["die", "agent"],
  "token_quota_monthly": 5000000,
  "created_at": "2026-06-03T10:00:00Z"
}
```

---

## Fase 2 — Carga de contexto institucional

### Descripción

Esta fase captura el **contexto organizacional** que las soluciones de IA utilizarán para adaptar su comportamiento a la identidad de la organización. Es el diferencial clave que hace que el sistema *recuerde* quién es el cliente sin que el usuario deba re-explicarlo en cada sesión.

El proceso es **asistido**: el sistema extrae información automáticamente desde la web de la organización y la presenta para revisión y enriquecimiento manual.

### Paso 1 — Extracción automática desde la web

El cliente ingresa la URL de su sitio institucional. El sistema analiza las páginas principales y extrae:

| Campo detectado | Fuente probable | Certeza |
|---|---|---|
| Nombre de la organización | `<title>`, `<h1>`, metadatos OG | Alta |
| Descripción general | Sección "Quiénes somos" | Media |
| Propuesta de valor | Página principal, hero section | Media |
| Sector / industria | Contenido general, categorías | Baja–Media |
| Servicios o productos | Menú, secciones de servicios | Media |
| Canales de comunicación | Footer, íconos sociales | Alta |
| Paleta de colores (inferida) | CSS / estilos del sitio | Media |

> **Principio de diseño:** La extracción asiste al usuario; no reemplaza su juicio. Todo lo detectado requiere confirmación antes de ser persistido.

### Paso 2 — Enriquecimiento manual

El usuario completa o corrige la información detectada y añade campos que no son públicamente accesibles:

**Atributos de marca de alto impacto en el modelo:**

| Atributo | Descripción | Ejemplo |
|---|---|---|
| Tono de comunicación | Registro lingüístico ponderado (0–10) | Profesional: 8 / Cercano: 6 / Técnico: 7 |
| Audiencias objetivo | Segmentos con peso relativo | Gobierno: 40% / Empresa privada: 35% / Academia: 25% |
| Canales activos | Plataformas de publicación con nivel de actividad | LinkedIn: alto / Email: medio / Instagram: bajo |
| Restricciones regulatorias | Temas o afirmaciones que no pueden publicarse | No publicar proyecciones financieras sin aprobación legal |
| Ejemplos de contenido aprobado | 2–3 piezas representativas del estilo deseado | Links o archivos |

**Parámetros visuales de marca:**

| Parámetro | Descripción |
|---|---|
| Paleta de colores corporativa | Hex primario, secundario, acento |
| Tipografía corporativa | Familia(s) tipográfica(s) aprobadas |
| Logo | SVG/PNG en versiones color/monocromo |
| Manual de marca (PDF) | Documento de lineamientos completo |

### Paso 3 — Validación y persistencia

El administrador del cliente revisa el perfil completo y lo aprueba. El sistema persiste el contexto en el `OrganizationalContextStore` asociado al `tenant_id`.

```
OrganizationalContextStore
├── brand_profile.json          ← tono, audiencias, restricciones
├── visual_assets/              ← logos, paleta, tipografías
├── brand_examples/             ← piezas de referencia
└── brand_guidelines.pdf        ← manual de marca completo
```

---

## Fase 3 — Creación de usuarios y roles

### Descripción

El administrador de la organización cliente crea los usuarios que tendrán acceso a las soluciones. El modelo de roles es **granular por solución** y **compartido entre sesiones** a través del módulo de sesión transversal.

### Roles disponibles

| Rol | Solución | Permisos |
|---|---|---|
| `org_admin` | Todas | Gestión de usuarios, configuración, acceso completo |
| `die_operator` | DIE / RAG | Carga de documentos, revisión de extracciones, aprobación de alertas |
| `die_auditor` | DIE / RAG | Solo lectura: documentos, extracciones, alertas y audit log |
| `agent_creator` | Agent | Generación y edición de campañas |
| `agent_approver` | Agent | Aprobación/rechazo de contenido generado |
| `agent_viewer` | Agent | Solo lectura: campañas e histórico |

### Proceso de creación

1. El administrador introduce el correo corporativo del usuario.
2. El sistema valida que el dominio coincida con el `tenant_id` registrado.
3. Se asignan uno o más roles.
4. El sistema envía invitación de activación con enlace de duración limitada (48 h).
5. El usuario activa su cuenta y completa el registro personal.

### Datos del perfil de usuario

| Campo | Descripción |
|---|---|
| Nombre y apellido | Nombre completo |
| Correo corporativo | Dominio validado contra el tenant |
| Cargo | Rol organizacional (no rol técnico) |
| Roles técnicos | Permisos asignados por el administrador |
| Idioma preferido | Para localización de la interfaz |

---

## Fase 4 — Configuración de la solución

### Descripción

CINTEL configura los parámetros técnicos específicos de cada solución habilitada para el cliente. Esta configuración es independiente del contexto institucional (que captura *quién es* el cliente) y se centra en *cómo opera* el sistema para ese tenant.

### Configuración DIE / Document Intelligence Engine

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| Tipos de documento | Esquemas de extracción activos | Facturas, contratos, PQRS |
| Fuentes de referencia | Bases de datos para validación cruzada | RUES, DIAN, CRM interno |
| Umbral de confianza | Score mínimo para auto-aprobación | 0.85 |
| Flujo de aprobación | Número de revisores requeridos | 1 aprobador por tipo |
| Formato de exportación | Salida esperada de extracciones | JSON, CSV, integración REST |
| Webhooks | Endpoints de notificación en alertas | `POST /api/alertas` |

### Configuración Agent / Adaptador de Contenido Institucional

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| Canales habilitados | Plataformas de publicación activas | LinkedIn, email, Instagram |
| Modelos LLM asignados | Modelo primario y fallback por canal | GPT-4o (principal), GPT-4o-mini (fallback) |
| Guardrails activos | Filtros de contenido habilitados | Sin afirmaciones no verificadas |
| Ciclo de aprobación | Flujo para publicación de contenido | Creación → Revisión → Aprobación |
| Memoria activa | Módulos de contexto habilitados | Historial de campañas, contexto org. |
| Rate limits | Campañas máximas por mes | 50 campañas/mes |

---

## Fase 5 — Tour guiado y activación

### Descripción

La última fase introduce a los usuarios en las funcionalidades del sistema mediante un **tour interactivo** contextualizado con los datos reales del cliente. A diferencia de una demo genérica, el tour usa el perfil institucional cargado en la Fase 2, por lo que el usuario ve ejemplos con su propia marca desde el primer momento.

### Contenido del tour

**Para DIE:**
1. Carga de un documento de prueba del tipo configurado para el cliente.
2. Revisión del resultado de extracción.
3. Gestión de una alerta de discrepancia de ejemplo.
4. Acceso al audit log de operaciones.

**Para Agent:**
1. Generación de una campaña de ejemplo usando el perfil institucional del cliente.
2. Revisión del contenido generado por canal.
3. Ciclo de ajuste y aprobación.
4. Visualización del histórico de campañas.

### Activación

Al concluir el tour, el administrador confirma la activación. El sistema:

1. Cambia el estado del tenant a `active`.
2. Registra el evento en el audit log con marca de tiempo.
3. Habilita el consumo del cuota mensual de tokens.
4. Envía al administrador un resumen de configuración por correo.

```json
{
  "tenant_id": "cintel-co-001",
  "status": "active",
  "activated_at": "2026-06-03T14:30:00Z",
  "activated_by": "admin@cintel.co",
  "solutions_active": ["die", "agent"],
  "users_created": 4
}
```

---

## Modelo de sesión compartida

Una vez completado el onboarding, los usuarios acceden a las soluciones mediante un **token de sesión compartido** que mantiene la identidad y el contexto activos a través de todas las aplicaciones del portafolio.

### Estructura del token de sesión

```json
{
  "session_id": "sess_abc123def456",
  "user_id": "usr_maria_gonzalez",
  "tenant_id": "cintel-co-001",
  "org_name": "CINTEL",
  "role": "org_admin",
  "solutions": ["die", "agent"],
  "issued_at": "2026-06-03T09:00:00Z",
  "expires_at": "2026-06-03T17:00:00Z",
  "last_activity": "2026-06-03T11:45:00Z"
}
```

### Comportamiento de la sesión

| Evento | Acción del sistema |
|---|---|
| Login exitoso | Se emite token JWT firmado + se almacena referencia de sesión |
| Navegación entre soluciones | Token validado por API Gateway sin re-autenticación |
| Inactividad > 30 min | Sesión suspendida; se requiere PIN para reactivar |
| Inactividad > 8 h | Sesión expirada; requiere login completo |
| Cambio de rol durante sesión | Invalidación y re-emisión del token |
| Cierre de sesión explícito | Token revocado; sesión eliminada del registro |

### Dashboard de sesión

Los usuarios cuentan con un **dashboard centralizado** desde el cual pueden:

- Ver el estado actual de su sesión (organización, rol, tiempo restante).
- Navegar entre las soluciones habilitadas para su organización.
- Revisar el consumo de tokens del mes en curso.
- Acceder al historial de actividad de la sesión.
- Cerrar sesión de todas las aplicaciones simultáneamente.

> Consulte el [Mockup interactivo](mockup.html) para ver la representación visual del dashboard y el flujo de onboarding.

---

## Diagrama de flujo del onboarding completo

```
[Solicitud de contratación]
         │
         ▼
[Fase 1: Registro de organización]
  Admin CINTEL crea tenant_id
  Configura plan y soluciones
         │
         ▼
[Fase 2: Contexto institucional]
  URL del cliente → extracción automática
  Enriquecimiento manual (tono, marca, canales)
  Aprobación del perfil
         │
         ▼
[Fase 3: Usuarios y roles]
  Admin cliente crea usuarios
  Asigna roles por solución
  Usuarios activan cuentas
         │
         ▼
[Fase 4: Configuración técnica]
  CINTEL configura parámetros por solución
  Pruebas de conectividad y validación
         │
         ▼
[Fase 5: Tour y activación]
  Tour guiado con datos reales del cliente
  Confirmación de activación
  Estado: active ✓
         │
         ▼
[Acceso al dashboard centralizado]
  Sesión compartida entre soluciones
  DIE ↔ Agent ↔ Transversal docs
```

---

## Criterios de cierre del onboarding

El onboarding se considera **completado exitosamente** cuando:

- [ ] `tenant_id` creado y en estado `active`
- [ ] Contexto institucional validado y persistido en `OrganizationalContextStore`
- [ ] Al menos un usuario con rol `org_admin` activo
- [ ] Configuración técnica de todas las soluciones contratadas validada
- [ ] Tour completado por el administrador del cliente
- [ ] Evento de activación registrado en audit log
- [ ] Correo de bienvenida con resumen de configuración enviado

---

## Consideraciones de seguridad

- El `tenant_id` nunca se expone en URLs ni en respuestas de API. Se propaga únicamente a través de claims JWT.
- Los datos del perfil institucional (contexto de marca) se cifran en reposo con clave derivada del `tenant_id`.
- El dominio de correo del tenant valida automáticamente que los usuarios pertenezcan a la organización registrada.
- Toda acción del onboarding (creación de tenant, aprobación de contexto, activación) queda registrada en el `AuditService` con usuario, timestamp y hash de la acción.
- Los enlaces de invitación de usuarios expiran a las 48 horas y son de un solo uso.

---

## Métricas de éxito del módulo

| Métrica | Objetivo | Fuente |
|---|---|---|
| Tiempo total de onboarding | < 4 horas | AuditService |
| Tasa de completitud del perfil institucional | > 80 % de campos cubiertos | OrganizationalContextStore |
| Tasa de activación de usuarios invitados | > 90 % en < 48 h | AuthService |
| Errores de configuración detectados post-onboarding | 0 en primeros 7 días | MonitoringService |
| Satisfacción del cliente en el tour | ≥ 4/5 | Encuesta post-onboarding |
