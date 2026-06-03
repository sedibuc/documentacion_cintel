# Prototipo funcional — Core Transversal CINTEL

> El prototipo del Core Transversal es una aplicación HTML navegable e interactiva que demuestra las funcionalidades transversales que comparten todas las soluciones CINTEL: login con sesión compartida, dashboard centralizado, flujo completo de onboarding de clientes, administración de usuarios y roles, y la integración entre DIE, Agent y la documentación técnica.

**[→ Abrir prototipo funcional](mockup.html)**

---

## ¿Qué demuestra el prototipo?

A diferencia de un documento de wireframes, este prototipo es navegable: los botones funcionan, los formularios tienen datos de ejemplo, los pasos del onboarding se completan secuencialmente y la sesión persiste entre pantallas usando `localStorage`. Su propósito es validar los flujos de usuario, no documentarlos.

### Módulos incluidos

| Módulo | Pantalla | Qué demuestra |
|---|---|---|
| **Login con sesión compartida** | Pantalla inicial | Punto de entrada unificado con JWT simulado y persistencia entre soluciones |
| **Dashboard centralizado** | Principal tras login | Hub con tarjetas de aplicación, estadísticas consolidadas y actividad reciente |
| **Onboarding — Paso 1** | Registro de organización | Formulario de alta de tenant con plan, soluciones y cuota de tokens |
| **Onboarding — Paso 2** | Contexto institucional | Extracción web automática + configuración de tono de marca (sliders interactivos) |
| **Onboarding — Paso 3** | Usuarios y roles | Invitación de usuarios, asignación de roles granulares por solución |
| **Onboarding — Paso 4** | Configuración de soluciones | Parámetros técnicos de DIE y Agent por tenant |
| **Onboarding — Paso 5** | Tour y activación | Demo de extracción DIE y campaña Agent con datos reales del cliente |
| **Mi sesión activa** | Panel de sesión | Detalle de JWT, tiempo restante, navegación a micrositios y logout |
| **Administración de usuarios** | CRUD usuarios | Tabla de usuarios, roles, estados e invitaciones pendientes |
| **Vista DIE (integrada)** | Resumen DIE | Métricas + últimas extracciones + enlace al micrositio completo |
| **Vista Agent (integrada)** | Resumen Agent | Métricas + últimas campañas + enlace al micrositio completo |
| **Audit log** | Registro inmutable | Tabla de operaciones por usuario, solución, acción y resultado |
| **Consumo de tokens** | LLM Gateway | Cuota mensual por solución con barra de progreso y desglose |

---

## Flujo recomendado de recorrido

**Primera vez (onboarding completo):**
1. En la pantalla de login, hace clic en **"Iniciar onboarding →"** (sin escribir credenciales).
2. Completa los 5 pasos del onboarding: registro de org., contexto, usuarios, config. y tour.
3. En el paso 2, usa el botón **"Extraer información"** para ver la extracción simulada.
4. En el paso 5, confirma la activación → redirige automáticamente al Dashboard.

**Usuario ya registrado:**
1. Escribe cualquier nombre, organización y selecciona un rol → clic en **"Iniciar sesión"**.
2. Navega al Dashboard con las tarjetas de DIE y Agent.
3. Explora la sesión en **"Mi sesión activa"** para ver el detalle del JWT simulado.
4. Revisa el Audit log y el consumo de tokens.

---

## Comportamiento de la sesión

El prototipo usa `localStorage` con la clave `cintel_session` para simular el comportamiento de un JWT real:

- La sesión **persiste** al recargar la página (simula un token no expirado).
- La sesión **expira** a las 8 horas (simuladas desde el timestamp de creación).
- Al cerrar sesión (botón en sidebar o en el dashboard), se borra `localStorage` y se vuelve al login.
- El tiempo restante se actualiza cada minuto en el indicador de la barra de sesión.

---

## Relación con los micrositios de DIE y Agent

El prototipo incluye vistas resumen de DIE y Agent con estadísticas simuladas y botones que enlazan directamente a sus micrositios completos. Esto ilustra el principio de **sesión compartida**: el usuario no necesita autenticarse de nuevo al navegar entre soluciones del mismo origen.


---

## Pantalla 1 — Login centralizado

La puerta de entrada unificada al ecosistema CINTEL. Todas las soluciones del portafolio comparten esta pantalla de autenticación. El usuario no necesita credenciales diferentes para DIE, Agent o los documentos transversales.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    CINTEL — Plataforma IA                       │
│              Accede a tu espacio de trabajo                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Correo corporativo                                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  usuario@empresa.co                                 │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  Contraseña                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  ••••••••••••                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  [ Iniciar sesión ]              ¿Olvidaste tu contraseña?│  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│       ¿Primera vez? → Contacta a tu administrador CINTEL        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Estados posibles:**
- `success` → Redirige al Dashboard centralizado
- `first_login` → Redirige al flujo de Onboarding (Fase 2 en adelante)
- `error_credentials` → Mensaje de error con contador de intentos
- `error_domain` → "El dominio de correo no está registrado en ninguna organización"
- `expired_invite` → "El enlace de activación ha expirado — solicita uno nuevo"

---

## Pantalla 2 — Onboarding: Paso 1 — Datos de la organización

Vista del administrador CINTEL al registrar un nuevo cliente. Solo usuarios con rol `cintel_admin` pueden ver y ejecutar esta pantalla.

```
┌─────────────────────────────────────────────────────────────────┐
│  CINTEL — Admin  │  Nuevo cliente                    [Paso 1/5] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Registro de organización                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Nombre legal          [ Centro Internacional de Inteligencia ] │
│  Nombre corto          [ CINTEL                               ] │
│  Dominio corporativo   [ cintel.co                            ] │
│  NIT                   [ 830.057.647-1                        ] │
│  País                  [ Colombia ▾ ]   Ciudad [ Bogotá ▾    ] │
│                                                                 │
│  Plan de servicio      ○ Starter   ● Professional  ○ Enterprise │
│                                                                 │
│  Soluciones activas    ☑ DIE — Document Intelligence Engine     │
│                        ☑ Agent — Adaptador de Contenido         │
│                        ☐ Transversal (siempre incluido)         │
│                                                                 │
│  Cuota mensual tokens  [ 5.000.000          ] tokens/mes        │
│  Fecha de inicio       [ 2026-07-01         ]                   │
│                                                                 │
│                               [ Cancelar ]  [ Siguiente →     ] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pantalla 3 — Onboarding: Paso 2 — Contexto institucional

Vista del cliente al cargar su perfil institucional. El campo URL dispara la extracción automática.

```
┌─────────────────────────────────────────────────────────────────┐
│  CINTEL — Plataforma  │  Onboarding CINTEL          [Paso 2/5] │
├───────────────────────┬─────────────────────────────────────────┤
│  ● Registro org.  ✓  │                                         │
│  ● Contexto inst. ←  │  Perfil institucional                   │
│  ○ Usuarios          │  ─────────────────────────────────────  │
│  ○ Configuración     │                                         │
│  ○ Tour              │  URL del sitio web                      │
│                      │  ┌───────────────────────────────────┐  │
│                      │  │  https://cintel.co                │  │
│                      │  └───────────────────────────────────┘  │
│                      │  [ Extraer información automáticamente ] │
│                      │                                         │
│                      │  ┌─── Extraído (pendiente revisión) ─┐  │
│                      │  │  Nombre:    CINTEL             ✓   │  │
│                      │  │  Sector:    Innovación TIC     ✓   │  │
│                      │  │  Desc.:     Centro de I+D...   ✓   │  │
│                      │  │  Servicios: [lista 6 items]    ↺   │  │
│                      │  │  Canales:   LinkedIn, Web      ✓   │  │
│                      │  │  Color:     #004B8D (detectado) ↺   │  │
│                      │  └────────────────────────────────────┘  │
│                      │                                         │
│                      │  Tono (0–10)   Prof. [████░░] 8          │
│                      │                Cercano [████░] 6         │
│                      │                Técnico [████░] 7         │
│                      │                                         │
│                      │           [ ← Anterior ] [ Siguiente → ]│
└───────────────────────┴─────────────────────────────────────────┘
```

---

## Pantalla 4 — Onboarding: Paso 3 — Usuarios y roles

```
┌─────────────────────────────────────────────────────────────────┐
│  CINTEL — Plataforma  │  Onboarding CINTEL          [Paso 3/5] │
├───────────────────────┬─────────────────────────────────────────┤
│  ● Registro org.  ✓  │  Usuarios del equipo                    │
│  ● Contexto inst. ✓  │  ─────────────────────────────────────  │
│  ● Usuarios       ←  │                                         │
│  ○ Configuración     │  [ + Invitar usuario ]                  │
│  ○ Tour              │                                         │
│                      │  ┌───────────────────────────────────┐  │
│                      │  │  María González                   │  │
│                      │  │  maria.gonzalez@cintel.co         │  │
│                      │  │  Roles: org_admin, agent_creator  │  │
│                      │  │  Estado: ● Activo                 │  │
│                      │  ├───────────────────────────────────┤  │
│                      │  │  Carlos Ruiz                      │  │
│                      │  │  c.ruiz@cintel.co                 │  │
│                      │  │  Roles: die_operator              │  │
│                      │  │  Estado: ◌ Invitación pendiente   │  │
│                      │  ├───────────────────────────────────┤  │
│                      │  │  Ana Morales                      │  │
│                      │  │  a.morales@cintel.co              │  │
│                      │  │  Roles: agent_approver            │  │
│                      │  │  Estado: ◌ Invitación pendiente   │  │
│                      │  └───────────────────────────────────┘  │
│                      │                                         │
│                      │           [ ← Anterior ] [ Siguiente → ]│
└───────────────────────┴─────────────────────────────────────────┘
```

---

## Pantalla 5 — Dashboard centralizado

Vista principal tras completar el onboarding o al iniciar sesión un usuario ya registrado. Es el **hub de navegación** entre todas las soluciones del portafolio.

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─ Sesión activa ──────────────────────────────────────────┐   │
│  │  👤 María González  |  CINTEL  |  org_admin  |  7h 12m   │   │
│  │  Consumo: 127.430 / 5.000.000 tokens  [██░░░░░░░░] 2.5%  │   │
│  │                                          [ Cerrar sesión ]│   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Bienvenida, María — CINTEL                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Document Intelligence │  │  Adaptador de Contenido        │ │
│  │  Engine (DIE)          │  │  Institucional (Agent)         │ │
│  │                        │  │                                │ │
│  │  Extracción de campos  │  │  Generación de campañas de     │ │
│  │  estructurados desde   │  │  marketing institucional por   │ │
│  │  documentos con        │  │  canal con identidad de        │ │
│  │  validación cruzada.   │  │  marca persistente.            │ │
│  │                        │  │                                │ │
│  │  ● Activo              │  │  ● Activo                      │ │
│  │  28 docs. procesados   │  │  12 campañas este mes          │ │
│  │                        │  │                                │ │
│  │  [ Abrir DIE → ]       │  │  [ Abrir Agent → ]             │ │
│  └────────────────────────┘  └────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Arquitectura Transversal                                  │  │
│  │  Documentación técnica compartida: funcionalidades,        │  │
│  │  arquitectura y cronograma del Core Transversal CINTEL.    │  │
│  │  [ Funcionalidades ]  [ Arquitectura ]  [ Cronograma ]     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Actividad reciente                                             │
│  ─────────────────────────────────────────────────────────────  │
│  11:45  DIE       Extracción aprobada — Contrato_2026_05.pdf   │
│  10:22  Agent     Campaña generada — LinkedIn, Mayo 2026       │
│  09:31  Sistema   Sesión iniciada — María González             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pantalla 6 — Indicador de sesión en micrositios

Cuando el usuario navega a cualquier micrositio (DIE, Agent, Transversal), la sesión se muestra en la barra superior. No necesita volver a identificarse.

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR DEL MICROSITIO                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Título de la sección]    ┌── Sesión ───────────────────────┐  │
│                            │  🏢 CINTEL  │  María G.  │ 7h   │  │
│                            │  [ Dashboard ] [ Cerrar sesión ]│  │
│                            └────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Comportamiento:**
- Si hay sesión activa: muestra org + nombre + tiempo restante + botón Dashboard
- Si no hay sesión: muestra enlace discreto "Iniciar sesión"
- Al hacer clic en "Dashboard" regresa al hub centralizado sin perder el contexto

---

## Pantalla 7 — Panel de sesión expandido (micrositio)

Al hacer clic en el indicador de sesión en la topbar, se despliega un panel con más detalle:

```
┌──────────────────────────────────────────────┐
│  Sesión activa                               │
│  ────────────────────────────────────────    │
│  Organización:  CINTEL                       │
│  Usuario:       María González               │
│  Rol:           org_admin                    │
│  Soluciones:    DIE, Agent, Transversal      │
│  Iniciada:      Hoy, 09:31                   │
│  Expira:        Hoy, 17:31 (7h 12m)          │
│                                              │
│  Consumo tokens hoy                          │
│  [████░░░░░░░░░░░] 127.430 / 5.000.000       │
│                                              │
│  [ Ir al Dashboard ]  [ Cerrar sesión ]      │
└──────────────────────────────────────────────┘
```

---

## Flujo de navegación entre aplicaciones

```
[Login]
   │
   ▼
[Dashboard centralizado]
   ├──→ [DIE / RAG Micrositio]
   │         └──→ [Volver al Dashboard] (sesión preservada)
   │
   ├──→ [Agent Micrositio]
   │         └──→ [Volver al Dashboard] (sesión preservada)
   │
   └──→ [Transversal Docs]
             ├── Funcionalidades
             ├── Arquitectura
             ├── Cronograma
             └── Onboarding
```

La sesión se almacena en `localStorage` con clave `cintel_session` y es leída por cada micrositio al cargar. No requiere redirecciones de autenticación entre aplicaciones del mismo origen.

---

## Resumen de pantallas y flujos

| N° | Pantalla | Usuario | Fase |
|---|---|---|---|
| 1 | Login centralizado | Todos | Acceso |
| 2 | Onboarding — Registro org. | Admin CINTEL | Fase 1 |
| 3 | Onboarding — Contexto inst. | Admin cliente | Fase 2 |
| 4 | Onboarding — Usuarios y roles | Admin cliente | Fase 3 |
| 5 | Dashboard centralizado | Todos | Uso diario |
| 6 | Indicador de sesión en micrositios | Todos | Navegación |
| 7 | Panel de sesión expandido | Todos | Detalle |

> **Nota de implementación:** El prototipo HTML interactivo disponible en esta misma página incluye las pantallas 1, 5, 6 y 7 en versión funcional (con localStorage simulado). Las pantallas 2–4 están representadas como wireframes estáticos para validación de flujo.
