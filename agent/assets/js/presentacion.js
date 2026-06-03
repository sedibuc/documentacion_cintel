(function () {
  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

  const agentTrees = {
    asis: {
      id: "agent-asis-root",
      label: "AS-IS Agente de Marketing IA",
      status: "improve",
      children: [
        {
          id: "agent-asis-funcional",
          label: "Caracteristicas funcionales",
          status: "improve",
          children: [
            { id: "agent-asis-f1", label: "Capa de presentacion y rutas funcionales operativas", status: "prod" },
            { id: "agent-asis-f2", label: "Flujo conversacional del grafo en produccion inicial", status: "prod" },
            { id: "agent-asis-f3", label: "Generacion de campaña con apoyos de scraping y contexto", status: "improve" },
            { id: "agent-asis-f4", label: "Canales de salida y formateadores con cobertura parcial", status: "improve" },
            { id: "agent-asis-f5", label: "Persistencia conversacional sin memoria institucional completa", status: "improve" },
            { id: "agent-asis-f6", label: "Integracion Instagram/OCR opcional con restricciones", status: "improve" },
            { id: "agent-asis-f7", label: "Flujo inicial de captura de contexto no consolidado de extremo a extremo", status: "alert" },
            { id: "agent-asis-f8", label: "Dependencia alta de validación humana para salida final", status: "improve" }
          ]
        },
        {
          id: "agent-asis-no-funcional",
          label: "Caracteristicas no funcionales",
          status: "alert",
          children: [
            { id: "agent-asis-nf-1", label: "Observabilidad existente con cobertura incompleta", status: "improve" },
            { id: "agent-asis-nf-2", label: "Seguridad y aislamiento por tenant no cerrados", status: "alert" },
            { id: "agent-asis-nf-3", label: "Escalabilidad sujeta a decisiones de infraestructura", status: "improve" },
            { id: "agent-asis-nf-4", label: "Variables de entorno extensas y sensibles", status: "improve" },
            { id: "agent-asis-nf-5", label: "Gobernanza de prompts y versionado no institucionalizado", status: "alert" },
            { id: "agent-asis-nf-6", label: "Riesgos de costo por consumo IA y canales", status: "improve" },
            { id: "agent-asis-nf-7", label: "Incertidumbres arquitectonicas abiertas", status: "alert" }
          ]
        },
        {
          id: "agent-asis-arquitectura",
          label: "Arquitectura vigente y observaciones internas",
          status: "improve",
          children: [
            {
              id: "agent-asis-arq-1",
              label: "Capas y módulos actuales",
              status: "prod",
              children: [
                {
                  id: "agent-asis-arq-1a",
                  label: "Capas de la arquitectura vigente",
                  status: "prod",
                  children: [
                    { id: "agent-asis-arq-1a-1", label: "Routes / presentacion: rutas y exposicion de capacidades del agente", status: "prod" },
                    { id: "agent-asis-arq-1a-2", label: "Domain: reglas de negocio y logica del agente conversacional", status: "prod" },
                    { id: "agent-asis-arq-1a-3", label: "Application: orquestacion de casos de uso del agente", status: "prod" },
                    { id: "agent-asis-arq-1a-4", label: "Infrastructure: conectores externos y dependencias tecnicas", status: "prod" },
                    { id: "agent-asis-arq-1a-5", label: "Ports: desacoplamiento entre contratos e implementaciones", status: "prod" }
                  ]
                },
                { id: "agent-asis-arq-1b", label: "Streaming y observabilidad base", status: "prod" },
                { id: "agent-asis-arq-1c", label: "Relaciones entre componentes documentadas", status: "prod" }
              ]
            },
            {
              id: "agent-asis-arq-2",
              label: "Flujos operativos reales",
              status: "improve",
              children: [
                { id: "agent-asis-arq-2a", label: "Flujo generate_campaign", status: "prod" },
                { id: "agent-asis-arq-2b", label: "Flujo SSE y streaming", status: "prod" },
                { id: "agent-asis-arq-2c", label: "Flujos scraping/enriquecimiento e Instagram", status: "improve" },
                { id: "agent-asis-arq-2d", label: "Flujo de persistencia conversacional", status: "improve" }
              ]
            },
            {
              id: "agent-asis-arq-3",
              label: "Consistencia documental del demostrador analizado",
              status: "alert",
              children: [
                { id: "agent-asis-arq-3a", label: "Consistencia entre mensajes, titulos y evidencia", status: "alert" },
                { id: "agent-asis-arq-3b", label: "Coherencia entre hallazgos y redaccion vigente", status: "improve" },
                { id: "agent-asis-arq-3c", label: "Elementos presentes y ausentes dentro del documento", status: "improve" }
              ]
            }
          ]
        }
      ]
    },
    tobe: {
      id: "agent-tobe-root",
      label: "TO-BE Adaptador de Contenido Institucional",
      status: "v1",
      children: [
        {
          id: "agent-tobe-funcional",
          label: "Caracteristicas funcionales",
          status: "v1",
          children: [
            {
              id: "agent-tobe-f1",
              label: "Vision funcional TO-BE",
              status: "v1",
              children: [
                {
                  id: "agent-tobe-f1a",
                  label: "Objetivos funcionales del producto",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f1a-1", label: "Contexto organizacional persistente por organizacion", status: "v1" },
                    { id: "agent-tobe-f1a-2", label: "Lineamientos de marca aplicados automaticamente en cada salida", status: "v1" },
                    { id: "agent-tobe-f1a-3", label: "Planeacion estrategica institucional asistida por IA", status: "v1" },
                    { id: "agent-tobe-f1a-4", label: "Produccion creativa multicanal adaptada a identidad institucional", status: "v1" },
                    { id: "agent-tobe-f1a-5", label: "Validacion humana y trazabilidad obligatorias antes de publicar", status: "v1" },
                    { id: "agent-tobe-f1a-6", label: "Historico y memoria organizacional reutilizable entre sesiones", status: "v1" },
                    { id: "agent-tobe-f1a-7", label: "Onboarding institucional con control de completitud de perfil", status: "v1" },
                    { id: "agent-tobe-f1a-8", label: "Aislamiento multi-organizacion desde Sprint 0", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f1b",
                  label: "Etapas del onboarding institucional",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f1b-1", label: "Extraccion automatica desde el sitio web de la institucion", status: "v1" },
                    { id: "agent-tobe-f1b-2", label: "Carga del manual de marca y lineamientos visuales oficiales", status: "v1" },
                    { id: "agent-tobe-f1b-3", label: "Captura de tono, audiencias y canales activos de la institucion", status: "v1" },
                    { id: "agent-tobe-f1b-4", label: "Registro de activos licenciados y restricciones regulatorias", status: "v1" },
                    { id: "agent-tobe-f1b-5", label: "Alta del perfil de usuario vinculado a la institucion configurada", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f1c",
                  label: "Contenido del perfil institucional persistente",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f1c-1", label: "Identidad institucional: nombre, sector, mision y propuesta de valor", status: "v1" },
                    { id: "agent-tobe-f1c-2", label: "Tono, voz y restricciones de comunicacion por canal", status: "v1" },
                    { id: "agent-tobe-f1c-3", label: "Audiencias objetivo y segmentos definidos por canal activo", status: "v1" },
                    { id: "agent-tobe-f1c-4", label: "Identidad visual: logos, paleta, tipografias y plantillas aprobadas", status: "v1" },
                    { id: "agent-tobe-f1c-5", label: "Historial de campanas y aprendizajes acumulados por sesion", status: "v1" }
                  ]
                }
              ]
            },
            {
              id: "agent-tobe-f2",
              label: "Agentes del sistema",
              status: "v1",
              children: [
                {
                  id: "agent-tobe-f2a",
                  label: "Agente Estrategico",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f2a-1", label: "Carga automatica de contexto institucional desde BrandGuidelinesStore", status: "v1" },
                    { id: "agent-tobe-f2a-2", label: "Construccion del plan de comunicacion por conversacion libre", status: "v1" },
                    { id: "agent-tobe-f2a-3", label: "Propuesta de objetivos, audiencia y mensajes clave por canal", status: "v1" },
                    { id: "agent-tobe-f2a-4", label: "Razonamiento del agente visible en tiempo real", status: "v1" },
                    { id: "agent-tobe-f2a-5", label: "Reutilizacion de campanas anteriores como contexto inicial", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f2b",
                  label: "Agente Creativo",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f2b-1", label: "Brief de diseno institucional por canal con campos especificos", status: "v1" },
                    { id: "agent-tobe-f2b-2", label: "Adaptacion de piezas a identidad visual y activos licenciados", status: "v1" },
                    { id: "agent-tobe-f2b-3", label: "Produccion de variantes multicanal: Instagram, email, web, WhatsApp", status: "v1" },
                    { id: "agent-tobe-f2b-4", label: "Seguimiento y registro de resultados por pieza y canal", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f2c",
                  label: "Modulo de Iteracion e Historico",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f2c-1", label: "Ajuste de estrategia por instruccion libre del usuario", status: "v1" },
                    { id: "agent-tobe-f2c-2", label: "Ajuste de brief dentro del contexto institucional acumulado", status: "v1" },
                    { id: "agent-tobe-f2c-3", label: "Ajuste de pieza conservando identidad visual de la institucion", status: "v1" },
                    { id: "agent-tobe-f2c-4", label: "Navegacion y reutilizacion de campanas anteriores como base", status: "v1" },
                    { id: "agent-tobe-f2c-5", label: "Trazabilidad completa: objetivo → plan → brief → pieza", status: "v1" }
                  ]
                }
              ]
            },
            {
              id: "agent-tobe-f4",
              label: "Evolutivo posterior",
              status: "vnext",
              children: [
                { id: "agent-tobe-f4a", label: "Enrutamiento dinamico multi-modelo", status: "vnext" },
                { id: "agent-tobe-f4b", label: "Optimizacion automatica avanzada de campanas", status: "vnext" },
                { id: "agent-tobe-f4c", label: "Escalado inteligente por demanda estacional", status: "vnext" }
              ]
            }
          ]
        },
        {
          id: "agent-tobe-no-funcional",
          label: "Caracteristicas no funcionales",
          status: "v1",
          children: [
            { id: "agent-tobe-nf-1", label: "Trazabilidad de prompts/respuestas y auditoria", status: "v1" },
            { id: "agent-tobe-nf-2", label: "SLA operativo y monitoreo continuo", status: "v1" },
            { id: "agent-tobe-nf-3", label: "Controles de aislamiento por tenant y politicas base", status: "v1" },
            { id: "agent-tobe-nf-4", label: "Checklist tecnico de salida a piloto", status: "v1" },
            { id: "agent-tobe-nf-5", label: "Riesgos y mitigaciones de implementacion por sprint", status: "v1" },
            { id: "agent-tobe-nf-6", label: "Controles avanzados de seguridad/escalado", status: "vnext" },
            { id: "agent-tobe-nf-7", label: "Gobernanza de decision funcional frente a hallazgos", status: "v1" }
          ]
        },
        {
          id: "agent-tobe-arquitectura",
          label: "Arquitectura TO-BE",
          status: "v1",
          children: [
            {
              id: "agent-tobe-arq-capas",
              label: "Capas logicas del sistema",
              status: "v1",
              children: [
                { id: "agent-tobe-arq-1b-1", label: "Experiencia: onboarding, chat guiado, preview e historico [Frontend / React o Next.js]", status: "v1" },
                { id: "agent-tobe-arq-1b-2", label: "Orquestacion: StrategicAgent + CreativeAgent + aprobacion [LLM + LangGraph / Python]", status: "v1" },
                { id: "agent-tobe-arq-1b-3", label: "Contexto: ContextRetrievalService + filtros por tenant [Desarrollo clasico + BD]", status: "v1" },
                { id: "agent-tobe-arq-1b-4", label: "Datos: stores persistentes de contexto, marca e historico [BD relacional + RLS]", status: "v1" },
                { id: "agent-tobe-arq-1b-5", label: "IA: abstraccion del proveedor LLM con soporte multimodal [OpenAI / Gemini / LLM API]", status: "v1" },
                { id: "agent-tobe-arq-1b-6", label: "Canales: LinkedInAgent + InstagramAgent + EmailAgent + WhatsAppAgent + Export/PublishingAdapter [Agentes ADK + APIs externas]", status: "v1" }
              ]
            },
            {
              id: "agent-tobe-arq-modulos",
              label: "Modulos tecnicos del sistema",
              status: "v1",
              children: [
                {
                  id: "agent-tobe-f3a",
                  label: "Modulos de contexto y datos",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f3a-1", label: "OrganizationalContextStore: contexto institucional por tenant [BD relacional + RLS]", status: "v1" },
                    { id: "agent-tobe-f3a-2", label: "BrandGuidelinesStore: lineamientos de marca y perfil por organizacion [BD + object storage]", status: "v1" },
                    { id: "agent-tobe-f3a-3", label: "OnboardingService: estructuracion y validacion del perfil inicial [Desarrollo clasico]", status: "v1" },
                    { id: "agent-tobe-f3a-4", label: "CompletenessScorer: evaluacion de completitud del perfil [Desarrollo clasico / reglas]", status: "v1" },
                    { id: "agent-tobe-f3a-5", label: "CampaignHistoryStore: historico de campanas reutilizable por tenant [BD relacional + RLS]", status: "v1" },
                    { id: "agent-tobe-f3a-6", label: "ContextRetrievalService: recuperacion contextual para cada agente [Desarrollo clasico + queries BD]", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f3b",
                  label: "Modulos de agentes y canales",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f3b-1", label: "StrategicAgent: planeacion y direccion de campana institucional [LLM + tool-calling]", status: "v1" },
                    { id: "agent-tobe-f3b-2", label: "CreativeAgent: produccion de piezas y variantes de contenido [LLM generativo + multimodal]", status: "v1" },
                    { id: "agent-tobe-f3b-3", label: "Agentes de canal especializados: LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent — produccion nativa por canal [ADK Skills + ejecucion paralela]", status: "v1" },
                    { id: "agent-tobe-f3b-4", label: "Contratos tecnicos de entrada/salida entre modulos [Definicion de interfaces / schemas JSON]", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f3c",
                  label: "Modulos de gobernanza y operacion",
                  status: "v1",
                  children: [
                    { id: "agent-tobe-f3c-1", label: "HumanValidationModule: revision y aprobacion previa a salida [Desarrollo clasico + UI web]", status: "v1" },
                    { id: "agent-tobe-f3c-2", label: "Export/PublishingAdapter: entrega controlada hacia canales [Desarrollo clasico + APIs externas]", status: "v1" },
                    { id: "agent-tobe-f3c-3", label: "ObservabilityService: metricas, trazas y eventos del sistema [Infra / Prometheus + Grafana o equivalente]", status: "v1" },
                    { id: "agent-tobe-f3c-4", label: "Criterios de aceptacion para transicion a piloto [Checklist / proceso de validacion]", status: "v1" }
                  ]
                },
                {
                  id: "agent-tobe-f3d",
                  label: "Modulos de seguridad y escalado",
                  status: "vnext",
                  children: [
                    { id: "agent-tobe-f3d-1", label: "TenantIsolationLayer: separacion de datos y politicas [BD RLS + RBAC + JWT]", status: "vnext" },
                    { id: "agent-tobe-f3d-2", label: "Checklist tecnico de salida a piloto [Proceso / validacion manual pre-produccion]", status: "v1" },
                    { id: "agent-tobe-f3d-3", label: "Politicas base de acceso, proteccion y trazabilidad [Configuracion RBAC + auditoria]", status: "v1" },
                    { id: "agent-tobe-f3d-4", label: "Ruta de escalado tecnico para V2 y V3 [Planificacion + Infra cloud / Kubernetes]", status: "vnext" }
                  ]
                }
              ]
            },
            {
              id: "agent-tobe-arq-roadmap",
              label: "Roadmap tecnico por fases",
              status: "v1",
              children: [
                { id: "agent-tobe-arq-1a-1", label: "Sprint 0: modelo de datos multi-organizacion [BD relacional + migraciones + RLS inicial]", status: "v1" },
                { id: "agent-tobe-arq-1a-2", label: "V1 MVP: contexto persistente + agentes + exportacion [LLM + Desarrollo clasico + BD + UI web]", status: "v1" },
                { id: "agent-tobe-arq-1a-3", label: "V2: automatizacion y metricas avanzadas [LLM + automatizacion de flujos + APIs + observabilidad]", status: "vnext" },
                { id: "agent-tobe-arq-1a-4", label: "V3: escalamiento multi-cliente y optimizacion [Infra cloud avanzada + LLM enrutamiento dinamico]", status: "vnext" }
              ]
            },
            { id: "agent-tobe-arq-1c", label: "Criterios de aceptacion de arquitectura", status: "v1" }
          ]
        }
      ]
    }
  };

  const agentLeafDetails = {
    "agent-asis-f1": "La capa de presentacion y rutas esta operativa y permite recorrido funcional del sistema actual. Se observa una base navegable con comportamiento consistente en el material revisado.",
    "agent-asis-f2": "El flujo conversacional del grafo funciona como columna vertebral del agente vigente. Aun asi, el comportamiento depende de decisiones operativas que requieren mayor gobierno para escalar.",
    "agent-asis-f3": "La generacion de campana usa contexto y apoyos de scraping, pero con variabilidad en calidad y control. Se recomienda reforzar trazabilidad de insumos y criterios de salida.",
    "agent-asis-f4": "Existen formateadores y canales, pero la cobertura por canal no esta totalmente estandarizada. Esto introduce diferencias de calidad y tiempos entre escenarios.",
    "agent-asis-f5": "La persistencia conversacional del demostrador es parcial y no esta documentada de forma integral en el material tecnico revisado.",
    "agent-asis-f6": "La integracion de Instagram y OCR aparece como capacidad parcial y condicionada. Debe madurarse para operar de manera predecible y segura.",
    "agent-asis-f7": "La revision del demostrador evidencia que el flujo inicial de captura de contexto no se presenta consolidado de extremo a extremo en el estado actual.",
    "agent-asis-f8": "La validación humana sigue siendo alta en la salida final. El reto es balancear control editorial con eficiencia operacional.",
    "agent-asis-nf-1": "La observabilidad existe pero no cubre todo el ciclo con la profundidad requerida para operación estable.",
    "agent-asis-nf-2": "Seguridad y aislamiento por tenant aparecen con descripcion parcial y sin cierre documental en la version revisada.",
    "agent-asis-nf-3": "Escalabilidad depende de decisiones de infraestructura aun en consolidacion; hoy hay capacidad de piloto mas que de escala amplia.",
    "agent-asis-nf-4": "La cantidad de variables sensibles y configuraciones incrementa riesgo operativo sin una gobernanza estricta.",
    "agent-asis-nf-5": "Gobernanza de prompts y versionado no esta institucionalizada; esto afecta reproducibilidad y control de calidad.",
    "agent-asis-nf-6": "Los costos de consumo IA y canales se reconocen como riesgo no funcional que debe monitorearse continuamente.",
    "agent-asis-nf-7": "Persisten incertidumbres arquitectonicas sobre limites de módulos, integraciones y responsabilidades.",
    "agent-asis-arq-1a": "La separacion en domain, application, infrastructure y puertos es una base arquitectonica clara del estado actual.",
    "agent-asis-arq-1b": "Streaming y observabilidad base estan implementados, aunque requieren mayor madurez para operación sostenida.",
    "agent-asis-arq-1c": "Las relaciones entre componentes estan documentadas y permiten identificar acoples y puntos de mejora.",
    "agent-asis-arq-2a": "El flujo generate_campaign es central en la propuesta actual y refleja decisiones reales de negocio y tecnologia.",
    "agent-asis-arq-2b": "El flujo SSE/streaming aporta respuesta progresiva, pero exige control operacional y monitoreo fino.",
    "agent-asis-arq-2c": "Los flujos de scraping, enriquecimiento e Instagram muestran valor, con variabilidad de confiabilidad segun fuente y contexto.",
    "agent-asis-arq-2d": "La persistencia conversacional soporta continuidad basica y muestra espacios de documentacion incompleta sobre su operacion actual.",
    "agent-asis-arq-3a": "En la documentacion del demostrador analizado se observan diferencias internas entre mensajes, titulos y evidencias del material tecnico revisado.",
    "agent-asis-arq-3b": "En el material base del demostrador, la redaccion de hallazgos no siempre mantiene el mismo nivel de detalle entre secciones.",
    "agent-asis-arq-3c": "En la documentacion base del demostrador se identifican elementos presentes y ausentes, especialmente en justificaciones y cierre de algunos apartados.",
    "agent-tobe-f1a": "Objetivos funcionales y cobertura arquitectonica del TO-BE aterrizan alcance real para entrega ejecutable y evaluable.",
    "agent-tobe-f1b": "Onboarding institucional estructurado formaliza captura de contexto, lineamientos y restricciones desde el inicio.",
    "agent-tobe-f1c": "Contexto organizacional persistente habilita continuidad entre sesiones y consistencia de salida.",
    "agent-tobe-f2a": "El agente estrategico se encarga de planeacion y direccion de campaña con base institucional.",
    "agent-tobe-f2b": "El agente creativo transforma direccion estrategica en piezas y variaciones alineadas a guias.",
    "agent-tobe-f2c": "Iteración e historico permiten aprendizaje operativo, reutilizacion y trazabilidad de resultados.",
    "agent-tobe-f3a": "Contexto y datos incluyen stores, retrieval y scoring de completitud para soportar calidad de decision.",
    "agent-tobe-f3b": "Agentes y canales consolidan contratos de entrada/salida para reducir ambiguedad en ejecucion.",
    "agent-tobe-f3c": "Gobernanza y operación incorporan validación humana, publicacion y observabilidad como capacidades nativas.",
    "agent-tobe-f3d": "Seguridad y escalado quedan definidos con controles base en v1 y maduracion en etapas posteriores.",
    "agent-tobe-f4a": "El enrutamiento dinamico multi-modelo se deja como evolución para optimizar costo y rendimiento por caso.",
    "agent-tobe-f4b": "La optimizacion automatica avanzada de campanas se proyecta luego de estabilizar datos y control de calidad.",
    "agent-tobe-f4c": "Escalado inteligente por demanda estacional se considera expansion posterior a validación del nucleo.",
    "agent-tobe-nf-1": "La trazabilidad de prompts y respuestas se define como requisito no funcional principal para auditoría.",
    "agent-tobe-nf-2": "SLA operativo y monitoreo continuo permiten pasar de piloto asistido a operación gobernada.",
    "agent-tobe-nf-3": "Aislamiento por tenant y políticas base reducen riesgo de mezcla de datos y fallas de cumplimiento.",
    "agent-tobe-nf-4": "Checklist técnico de salida a piloto establece condiciones minimas verificables para habilitar despliegue.",
    "agent-tobe-nf-5": "Riesgos por sprint y mitigaciones conectan ejecucion técnica con control de cronograma y alcance.",
    "agent-tobe-nf-6": "Controles avanzados de seguridad y escalado se programan en versión posterior para no sobrecargar v1.",
    "agent-tobe-nf-7": "La gobernanza de decision frente a hallazgos asegura coherencia entre validación y evolución final.",
    "agent-tobe-arq-1a": "El mapa de módulos tecnicos define cobertura completa del sistema objetivo y sus dominios.",
    "agent-tobe-arq-1b": "Interfaces de integracion entre dominios reducen acoplamiento y facilitan evolución incremental.",
    "agent-tobe-arq-1c": "Criterios de aceptacion arquitectonica formalizan cuando una decision se considera cerrada.",
    "agent-tobe-arq-2a": "Supuestos y cronograma por sprint habilitan planeacion realista para implementación controlada.",
    "agent-tobe-arq-2b": "Gantt, hitos y dependencias criticas permiten seguimiento ejecutivo y deteccion temprana de bloqueos.",
    "agent-tobe-arq-2c": "Riesgos de ejecucion y mitigación alinean gestion técnica con compromisos contractuales.",
    "agent-tobe-arq-3a": "Servicios IA por proveedor y canal se modelan para estimar consumo y evitar sobrecostos.",
    "agent-tobe-arq-3b": "Infraestructura de soporte define base de disponibilidad, seguridad y observabilidad.",
    "agent-tobe-arq-3c": "Variables de control y riesgos de costo completan la vista economica para decision directiva.",        "agent-asis-arq-1a-1": "Capa de presentacion con rutas HTTP que exponen los endpoints del agente y gestionan el ciclo de vida de la conversacion.",
    "agent-asis-arq-1a-2": "Modulo de dominio con las reglas de negocio centrales: logica del agente, construccion de campanas y restricciones funcionales.",
    "agent-asis-arq-1a-3": "Capa de aplicacion que orquesta los flujos de generacion, conversacion, streaming y persistencia del agente.",
    "agent-asis-arq-1a-4": "Conectores con proveedores externos: LLM, base de datos, Instagram, OCR y otros servicios de terceros.",
    "agent-asis-arq-1a-5": "Interfaces abstraidas que desacoplan la implementacion de los contratos, facilitando sustitucion y prueba de dependencias.",
    // Objetivos funcionales del producto
    "agent-tobe-f1a-1": "Cada organizacion mantiene su propio perfil institucional activo que persiste entre sesiones sin necesidad de reingresarlo.",
    "agent-tobe-f1a-2": "Logos, colores, tipografias y restricciones de cada organizacion se aplican automaticamente al generar o adaptar piezas.",
    "agent-tobe-f1a-3": "El Agente Estrategico usa el contexto institucional e historico para proponer planes de comunicacion alineados con la organizacion.",
    "agent-tobe-f1a-4": "El Agente Creativo adapta el contenido a cada canal (Instagram, email, web, WhatsApp) con la identidad visual de la organizacion.",
    "agent-tobe-f1a-5": "Ninguna salida se publica o exporta sin revision humana. Cada decision queda registrada con usuario, fecha y contexto usado.",
    "agent-tobe-f1a-6": "Campanas, briefs y piezas anteriores quedan almacenados y son reutilizables como contexto o punto de partida para nuevas comunicaciones.",
    "agent-tobe-f1a-7": "El sistema evalua la completitud del perfil antes de generar y solicita completar los campos faltantes si el contexto es insuficiente.",
    "agent-tobe-f1a-8": "Cada organizacion opera en un entorno completamente separado desde el primer sprint, sin mezcla de datos ni contexto entre tenants.",
    // Etapas del onboarding
    "agent-tobe-f1b-1": "El sistema analiza el sitio web institucional y precarga informacion estructural (nombre, sector, descripcion, propuesta de valor) para revision del usuario.",
    "agent-tobe-f1b-2": "El comunicador carga el manual de marca oficial con logos, paleta de colores, tipografias, zonas seguras y reglas de uso.",
    "agent-tobe-f1b-3": "Se captura el estilo de comunicacion, nivel de formalidad, restricciones de lenguaje, audiencias objetivo y canales activos de la organizacion.",
    "agent-tobe-f1b-4": "Se registran imagenes propias con derechos de uso, restricciones regulatorias sobre imagenes IA y flujos de aprobacion internos.",
    "agent-tobe-f1b-5": "El comunicador queda vinculado al perfil institucional. Nuevos colaboradores solo completan el registro personal sin repetir el onboarding institucional.",
    // Contenido del perfil persistente
    "agent-tobe-f1c-1": "Nombre, descripcion, sector, mision, propuesta de valor y productos o servicios de la organizacion, validados en el onboarding.",
    "agent-tobe-f1c-2": "Nivel de formalidad, estilo de escritura, palabras restringidas y parametros de tono validados y aplicables por canal.",
    "agent-tobe-f1c-3": "Publicos objetivo por canal (Instagram, WhatsApp, email, web, intranet), segmentos internos y externos definidos.",
    "agent-tobe-f1c-4": "Logos, paleta de colores, tipografias aprobadas, plantillas y activos licenciados del banco de imagenes institucional.",
    "agent-tobe-f1c-5": "Briefs anteriores, piezas generadas, resultados de campanas, feedback del equipo y metricas basicas acumulados por sesion.",
    // Agente Estrategico
    "agent-tobe-f2a-1": "Al iniciar, el agente recupera automaticamente contexto de empresa, productos, servicios y restricciones del BrandGuidelinesStore.",
    "agent-tobe-f2a-2": "El comunicador escribe en lenguaje natural; el agente hace preguntas de clarificacion y construye progresivamente el plan de comunicacion.",
    "agent-tobe-f2a-3": "El agente propone objetivos, canales sugeridos, segmentos de audiencia detectados y mensajes clave alineados con la identidad institucional.",
    "agent-tobe-f2a-4": "Un panel lateral muestra en tiempo real que esta considerando el agente: objetivos identificados, canales sugeridos, patrones del historico.",
    "agent-tobe-f2a-5": "El comunicador puede seleccionar una campana anterior; el agente la incorpora como contexto y propone una nueva version adaptada al objetivo actual.",
    // Agente Creativo
    "agent-tobe-f2b-1": "A partir del plan estrategico, el sistema genera un brief con campos especificos: canal, tipo de pieza, CTA, tono, restricciones visuales y mensaje central.",
    "agent-tobe-f2b-2": "Las piezas se construyen usando los activos licenciados del banco institucional, respetando logos, colores y tipografias aprobadas en el onboarding.",
    "agent-tobe-f2b-3": "Un mismo brief puede generar piezas adaptadas a Instagram, email, web/intranet y WhatsApp, cada una con formato y estructura adecuados al canal.",
    "agent-tobe-f2b-4": "Para Instagram se habilita seguimiento automatico de resultados; para otros canales el comunicador registra resultados y feedback manualmente.",
    // Modulo de Iteracion e Historico
    "agent-tobe-f2c-1": "El usuario puede reorientar la estrategia de una campana activa escribiendo nuevas instrucciones; el agente ajusta plan y mensajes sin perder contexto.",
    "agent-tobe-f2c-2": "El usuario modifica el brief de una pieza especifica; el sistema regenera solo esa pieza manteniendo la coherencia con la campana.",
    "agent-tobe-f2c-3": "El usuario ajusta una pieza concreta; el agente aplica el cambio respetando la identidad visual y el tono institucional definidos.",
    "agent-tobe-f2c-4": "El comunicador puede filtrar, buscar y seleccionar campanas anteriores para retomar su tematica o usarla como base para una nueva comunicacion.",
    "agent-tobe-f2c-5": "Cada pieza tiene trazabilidad completa desde el objetivo de comunicacion hasta el brief y la pieza final, con registro de decisiones y versiones.",
    // Modulos de contexto y datos
    "agent-tobe-f3a-1": "Almacena identidad, audiencias, tono, canales y restricciones de cada organizacion de forma aislada por tenant y reutilizable en cada sesion.",
    "agent-tobe-f3a-2": "Gestiona logos, colores, tipografias, activos licenciados y reglas de uso de marca para cada organizacion registrada.",
    "agent-tobe-f3a-3": "Estructura los datos del onboarding inicial y permite actualizarlos sin reiniciar el perfil institucional completo.",
    "agent-tobe-f3a-4": "Evalua cuantos de los campos criticos del perfil estan completos y bloquea generacion si el contexto es insuficiente.",
    "agent-tobe-f3a-5": "Almacena campanas, briefs, piezas, resultados y feedback por tenant para reutilizacion y continuidad tematica.",
    "agent-tobe-f3a-6": "Recupera en tiempo de ejecucion el contexto relevante (marca, historico, restricciones) para alimentar a StrategicAgent y CreativeAgent.",
    // Modulos de agentes y canales
    "agent-tobe-f3b-1": "Recibe contexto institucional e instrucciones del comunicador para proponer y construir el plan de comunicacion de la campana.",
    "agent-tobe-f3b-2": "Toma el plan estrategico y produce piezas de contenido adaptadas a la identidad institucional y al canal especifico.",
    "agent-tobe-f3b-3": "Adapta el texto, estructura y formato de cada pieza al canal destino: email, Instagram, WhatsApp, web, intranet o boletin.",
    "agent-tobe-f3b-4": "Cada modulo expone entradas y salidas con tipos definidos, facilitando integracion, pruebas y evolucion independiente.",
    // Modulos de gobernanza y operacion
    "agent-tobe-f3c-1": "Antes de exportar o publicar cualquier salida, el comunicador la revisa y aprueba; el sistema registra usuario, fecha y contexto utilizado.",
    "agent-tobe-f3c-2": "Conecta los resultados aprobados con los canales de destino de forma controlada, priorizando exportacion asistida en el MVP.",
    "agent-tobe-f3c-3": "Registra metricas de operacion, trazas de ejecucion y eventos del sistema para soporte, auditoria y mejora continua.",
    "agent-tobe-f3c-4": "Define las condiciones minimas verificables que el sistema debe cumplir antes de habilitar el despliegue a entorno piloto.",
    // Modulos de seguridad y escalado
    "agent-tobe-f3d-1": "Cada organizacion opera en un contexto completamente separado con datos, politicas y configuracion propios, sin acceso cruzado.",
    "agent-tobe-f3d-2": "Lista de controles tecnicos y funcionales que deben estar activos y verificados antes de salir a produccion con usuarios reales.",
    "agent-tobe-f3d-3": "Modelo de permisos por rol, registro de accesos y trazabilidad de cambios de configuracion criticos en el sistema.",
    "agent-tobe-f3d-4": "Plan de evolucion de seguridad y capacidad para las versiones V2 y V3, definido desde el MVP para evitar redisenos posteriores.",
    // Roadmap tecnico por fases
    "agent-tobe-arq-1a-1": "Modelo de datos multi-organizacion, base de usuarios, tenant_id transversal y estructura minima de seguridad y aislamiento.",
    "agent-tobe-arq-1a-2": "Onboarding + contexto persistente + generacion asistida de estrategia y piezas + exportacion asistida sin publicacion automatica obligatoria.",
    "agent-tobe-arq-1a-3": "Integraciones API, publicacion programada, metricas por canal, aprendizaje desde historico y mayor cierre del ciclo operativo.",
    "agent-tobe-arq-1a-4": "Multi-tenant avanzado, analitica comparativa, recomendaciones automaticas y evaluacion de calidad de salida a escala.",
    // Capas logicas del sistema
    "agent-tobe-arq-1b-1": "Portal web con flujo de onboarding guiado, vista de campanas activas, preview de piezas e historico de comunicaciones.",
    "agent-tobe-arq-1b-2": "Coordinacion de agentes por objetivo de campana con flujo de aprobacion humana integrado antes de salida.",
    "agent-tobe-arq-1b-3": "Recuperacion del contexto institucional relevante filtrado por tenant, con aplicacion de restricciones y reglas de marca.",
    "agent-tobe-arq-1b-4": "Almacenamiento y acceso a contexto organizacional, lineamientos de marca e historico de campanas por tenant.",
    "agent-tobe-arq-1b-5": "Abstraccion del proveedor LLM (OpenAI, Gemini, u otros) para generacion de texto e interpretacion de imagen.",
    "agent-tobe-arq-1b-6": "Adaptacion del contenido por canal y conexion controlada con destinos de publicacion o exportacion.",
  };

  function applyTreeDetails(node, detailMap) {
    if (detailMap[node.id]) {
      node.detail = detailMap[node.id];
    }
    if (node.children && node.children.length) {
      node.children.forEach((child) => applyTreeDetails(child, detailMap));
    }
  }

  applyTreeDetails(agentTrees.asis, agentLeafDetails);
  applyTreeDetails(agentTrees.tobe, agentLeafDetails);

  const agentRichDetails = {
    "agent-tobe-arq-2c": {
      summary: "La ejecución por sprint incorpora un registro de riesgos operativos para sostener compromisos de alcance y fechas con mitigación temprana.",
      bullets: [
        "Dependencia de aprobaciones inter-área para validación.",
        "Madurez desigual de canales para publicación.",
        "Riesgo de sobrecarga en iteraciones de contenido."
      ],
      risks: [
        {
          title: "Aprobaciones funcionales tardías",
          impact: "Alto: arrastra validación y retrasa entrega de sprint.",
          mitigation: "Ventanas de revisión semanales, responsables por área y criterio de aceptación preacordado.",
          owner: "Líder funcional",
          horizon: "Sprint 1-4"
        },
        {
          title: "Canales sin madurez homogénea",
          impact: "Medio/Alto: retrabajo por formato y variación de calidad de salida.",
          mitigation: "Priorización por canal crítico, plantillas validadas y pruebas de compatibilidad temprana.",
          owner: "Equipo de canales",
          horizon: "Sprint 2-5"
        },
        {
          title: "Acumulación de deuda en iteración humana",
          impact: "Medio: tiempo de ciclo alto y pérdida de cadencia operativa.",
          mitigation: "Límites WIP, lotes de revisión y automatización de controles repetitivos.",
          owner: "Operación de contenidos",
          horizon: "Sprint 3-6"
        }
      ],
      diagramSrc: "assets/img/diagramas/cronograma-riesgos-mitigacion.png",
      diagramAlt: "Cronograma de sprints con riesgos",
      diagramCaption: "Riesgos y mitigaciones priorizados por sprint."
    },
    "agent-tobe-f3a": {
      summary: "El dominio de contexto y datos se implementa como conjunto de módulos especializados que sostienen coherencia institucional y reutilización.",
      bullets: [
        "OrganizationalContextStore: persistencia de contexto institucional.",
        "BrandGuidelinesStore / BrandProfileService: lineamientos y perfil de marca.",
        "OnboardingService: estructuración de datos iniciales y actualización.",
        "CompletenessScorer: evaluación de suficiencia del contexto.",
        "CampaignHistoryStore: historial y reutilización de campañas.",
        "ContextRetrievalService: recuperación contextual para agentes."
      ],
      diagramSrc: "assets/img/diagramas/decisiones-modulos-contexto-datos-arquitectura.png",
      diagramAlt: "Arquitectura de contexto y datos",
      diagramCaption: "Vista de referencia: módulos de contexto y datos."
    },
    "agent-tobe-f3b": {
      summary: "Agentes y canales se separan para desacoplar razonamiento, generación y adaptación por medio de publicación.",
      bullets: [
        "StrategicAgent: define dirección y objetivos de campaña.",
        "CreativeAgent: construye piezas y variantes de contenido.",
        "Agentes de canal especializados (LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent): producen piezas con convenciones nativas del canal en ejecuci\u00f3n paralela.",
        "Contratos técnicos: entradas/salidas normalizadas entre módulos."
      ],
      diagramSrc: "assets/img/diagramas/decisiones-modulos-agentes-canales-arquitectura.png",
      diagramAlt: "Arquitectura de agentes y canales",
      diagramCaption: "Vista de referencia: módulos de agentes y canales."
    },
    "agent-tobe-f3c": {
      summary: "Gobernanza y operación aseguran control humano, publicación segura y observabilidad para sostenimiento del servicio.",
      bullets: [
        "HumanValidationModule: validación previa a salida cuando aplica.",
        "Export/PublishingAdapter: conexión controlada con canales de destino.",
        "ObservabilityService: métricas, trazas y eventos de operación.",
        "Criterios de aceptación operativa para transición a piloto."
      ],
      diagramSrc: "assets/img/diagramas/decisiones-modulos-gobernanza-operacion-arquitectura.png",
      diagramAlt: "Arquitectura de gobernanza y operación",
      diagramCaption: "Vista de referencia: módulos de gobernanza y operación."
    },
    "agent-tobe-f3d": {
      summary: "Seguridad y escalado definen las condiciones para aislamiento por tenant y crecimiento operativo sin degradar control.",
      bullets: [
        "TenantIsolationLayer: separación de datos y políticas por tenant.",
        "Checklist técnico de salida a piloto y controles obligatorios.",
        "Políticas base de acceso, protección y trazabilidad.",
        "Ruta de escalamiento técnico para fases posteriores."
      ],
      risks: [
        {
          title: "Accesos con privilegios amplios en entorno piloto",
          impact: "Alto: exposición de contenido sensible y riesgo de incumplimiento.",
          mitigation: "Modelo RBAC mínimo por rol, revisión mensual de permisos y bitácora de cambios de acceso.",
          owner: "Seguridad + Plataforma",
          horizon: "Sprint 2-4"
        },
        {
          title: "Escalado sin línea base operativa",
          impact: "Medio/Alto: costo creciente sin mejora proporcional de capacidad.",
          mitigation: "Definir línea base de uso/costo por tenant y umbrales de escalamiento automáticos.",
          owner: "DevOps",
          horizon: "Sprint 3-5"
        }
      ],
      diagramSrc: "assets/img/diagramas/decisiones-modulos-seguridad-escalado-arquitectura.png",
      diagramAlt: "Arquitectura de seguridad y escalado",
      diagramCaption: "Vista de referencia: módulos de seguridad y escalado."
    },
    "agent-asis-arq-1a": {
      summary: "El AS-IS muestra una arquitectura por capas bien identificada dentro del material actual, con una narrativa tecnica reconocible.",
      bullets: [
        "Routes/presentación para exposición de capacidades.",
        "Domain para reglas de negocio del agente.",
        "Application para orquestación de casos de uso.",
        "Infrastructure para conectores y dependencias externas.",
        "Ports para desacoplar implementación de contratos."
      ],
      diagramSrc: "assets/img/diagramas/arquitectura-general.png",
      diagramAlt: "Arquitectura lógica general del agente",
      diagramCaption: "Vista de referencia: arquitectura vigente."
    }
  };

  function applyTreeRichDetails(node, detailMap) {
    if (detailMap[node.id]) {
      node.detailPayload = detailMap[node.id];
    }
    if (node.children && node.children.length) {
      node.children.forEach((child) => applyTreeRichDetails(child, detailMap));
    }
  }

  applyTreeRichDetails(agentTrees.asis, agentRichDetails);
  applyTreeRichDetails(agentTrees.tobe, agentRichDetails);

  function getDetailReference(nodeId) {
    if (nodeId.startsWith("agent-asis-f") || nodeId.startsWith("agent-asis-nf")) {
      return { href: "diagnostico.html", label: "Ver sección fuente: Diagnostico técnico" };
    }
    if (nodeId.startsWith("agent-asis-arq-1") || nodeId.startsWith("agent-asis-arq-2")) {
      return { href: "arquitectura.html", label: "Ver sección fuente: Arquitectura vigente" };
    }
    if (nodeId.startsWith("agent-asis-arq-3")) {
      return { href: "diagnostico.html", label: "Ver sección fuente: Diagnóstico técnico y consistencia interna" };
    }
    if (nodeId.startsWith("agent-tobe-f1") || nodeId.startsWith("agent-tobe-f2") || nodeId.startsWith("agent-tobe-f4")) {
      return { href: "to-be.html", label: "Ver sección fuente: Vision funcional TO-BE" };
    }
    if (nodeId.startsWith("agent-tobe-f3a")) {
      return { href: "decisiones-modulos-contexto-datos.html", label: "Ver sección fuente: Módulos de contexto y datos" };
    }
    if (nodeId.startsWith("agent-tobe-f3b")) {
      return { href: "decisiones-modulos-agentes-canales.html", label: "Ver sección fuente: Módulos de agentes y canales" };
    }
    if (nodeId.startsWith("agent-tobe-f3c")) {
      return { href: "decisiones-modulos-gobernanza-operacion.html", label: "Ver sección fuente: Módulos de gobernanza y operación" };
    }
    if (nodeId.startsWith("agent-tobe-f3d")) {
      return { href: "decisiones-modulos-seguridad-escalado.html", label: "Ver sección fuente: Módulos de seguridad y escalado" };
    }
    if (nodeId.startsWith("agent-tobe-nf")) {
      return { href: "conclusiones.html", label: "Ver sección fuente: Criterios y recomendaciones" };
    }
    if (nodeId.startsWith("agent-tobe-arq-1")) {
      return { href: "to-be-arquitectura.html", label: "Ver sección fuente: Arquitectura TO-BE" };
    }
    if (nodeId.startsWith("agent-tobe-arq-2")) {
      return { href: "cronograma-implementacion-sprints.html", label: "Ver sección fuente: Cronograma por sprints" };
    }
    if (nodeId.startsWith("agent-tobe-arq-3")) {
      return { href: "costos.html", label: "Ver sección fuente: Costos y sostenibilidad" };
    }
    return { href: "presentacion.html", label: "Ver sección fuente" };
  }

  const defaults = {
    rates: {
      estratega: 210000,
      creativo: 185000,
      desarrollador: 172000,
      qa: 120000
    },
    hours: {
      estratega: 90,
      creativo: 120,
      desarrollador: 250,
      qa: 95
    },
    services: {
      inputTokensM: 32,
      outputTokensM: 14,
      inputTokenPrice: 14500,
      outputTokenPrice: 58000,
      generationCallsK: 60,
      generationPriceK: 4200
    },
    infra: {
      appService: 1800000,
      dataStore: 820000,
      observabilidad: 480000,
      redSeguridad: 400000
    },
    contingencyPct: 15
  };

  function formatCurrency(value) {
    return currencyFormatter.format(Number.isFinite(value) ? value : 0);
  }

  function readNumber(input) {
    if (!input) {
      return 0;
    }
    const value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function assignDefaults(container) {
    Object.entries(defaults.rates).forEach(([key, value]) => {
      const field = container.querySelector(`[data-input="rate-${key}"]`);
      if (field) {
        field.value = String(value);
      }
    });

    Object.entries(defaults.hours).forEach(([key, value]) => {
      const field = container.querySelector(`[data-input="hours-${key}"]`);
      if (field) {
        field.value = String(value);
      }
    });

    Object.entries(defaults.services).forEach(([key, value]) => {
      const field = container.querySelector(`[data-input="${key}"]`);
      if (field) {
        field.value = String(value);
      }
    });

    Object.entries(defaults.infra).forEach(([key, value]) => {
      const field = container.querySelector(`[data-input="infra-${key}"]`);
      if (field) {
        field.value = String(value);
      }
    });

    const contingencyField = container.querySelector('[data-input="contingencyPct"]');
    if (contingencyField) {
      contingencyField.value = String(defaults.contingencyPct);
    }
  }

  function updateCostView(container) {
    const roles = ["estratega", "creativo", "desarrollador", "qa"];
    let developmentSubtotal = 0;

    roles.forEach((role) => {
      const rate = readNumber(container.querySelector(`[data-input="rate-${role}"]`));
      const hours = readNumber(container.querySelector(`[data-input="hours-${role}"]`));
      const subtotal = rate * hours;
      developmentSubtotal += subtotal;

      const cell = container.querySelector(`[data-output="dev-${role}"]`);
      if (cell) {
        cell.textContent = formatCurrency(subtotal);
      }
    });

    const inputTokensM = readNumber(container.querySelector('[data-input="inputTokensM"]'));
    const outputTokensM = readNumber(container.querySelector('[data-input="outputTokensM"]'));
    const inputTokenPrice = readNumber(container.querySelector('[data-input="inputTokenPrice"]'));
    const outputTokenPrice = readNumber(container.querySelector('[data-input="outputTokenPrice"]'));
    const generationCallsK = readNumber(container.querySelector('[data-input="generationCallsK"]'));
    const generationPriceK = readNumber(container.querySelector('[data-input="generationPriceK"]'));

    const inputCost = inputTokensM * inputTokenPrice;
    const outputCost = outputTokensM * outputTokenPrice;
    const generationCost = generationCallsK * generationPriceK;
    const servicesSubtotal = inputCost + outputCost + generationCost;

    const infraApp = readNumber(container.querySelector('[data-input="infra-appService"]'));
    const infraDataStore = readNumber(container.querySelector('[data-input="infra-dataStore"]'));
    const infraObs = readNumber(container.querySelector('[data-input="infra-observabilidad"]'));
    const infraNet = readNumber(container.querySelector('[data-input="infra-redSeguridad"]'));
    const infraSubtotal = infraApp + infraDataStore + infraObs + infraNet;

    const recurringMonthly = servicesSubtotal + infraSubtotal;
    const contingencyPct = readNumber(container.querySelector('[data-input="contingencyPct"]'));
    const contingencyCost = (developmentSubtotal + recurringMonthly * 12) * (contingencyPct / 100);

    const totalYearOne = developmentSubtotal + recurringMonthly * 12 + contingencyCost;

    const outputs = {
      developmentSubtotal,
      inputCost,
      outputCost,
      generationCost,
      servicesSubtotal,
      infraSubtotal,
      recurringMonthly,
      contingencyCost,
      totalYearOne
    };

    Object.entries(outputs).forEach(([key, value]) => {
      container.querySelectorAll(`[data-output="${key}"]`).forEach((node) => {
        node.textContent = formatCurrency(value);
      });
    });
  }

  function flattenNodeIds(node, collector) {
    collector.push(node.id);
    if (node.children && node.children.length) {
      node.children.forEach((child) => flattenNodeIds(child, collector));
    }
  }

  function initialExpandedSet() {
    return new Set();
  }

  function getDetailText(node) {
    if (node.detail) {
      return node.detail;
    }
    return node.label;
  }

  function getDetailPayload(node) {
    return node.detailPayload || null;
  }

  function appendRiskSection(body, risks) {
    if (!Array.isArray(risks) || !risks.length) {
      return;
    }

    const title = document.createElement("h4");
    title.className = "tree-detail-subtitle";
    title.textContent = "Riesgos y plan de mitigación";
    body.appendChild(title);

    const wrapper = document.createElement("div");
    wrapper.className = "tree-detail-risks";

    risks.forEach((riskItem, index) => {
      const details = document.createElement("details");
      details.className = "tree-risk-item";
      if (index === 0) {
        details.open = true;
      }

      const summary = document.createElement("summary");
      summary.textContent = `${index + 1}. ${riskItem.title}`;
      details.appendChild(summary);

      const grid = document.createElement("div");
      grid.className = "tree-risk-grid";

      const impact = document.createElement("p");
      impact.innerHTML = `<strong>Impacto:</strong> ${riskItem.impact}`;
      const mitigation = document.createElement("p");
      mitigation.innerHTML = `<strong>Mitigación:</strong> ${riskItem.mitigation}`;
      const owner = document.createElement("p");
      owner.innerHTML = `<strong>Responsable:</strong> ${riskItem.owner}`;
      const horizon = document.createElement("p");
      horizon.innerHTML = `<strong>Horizonte:</strong> ${riskItem.horizon}`;

      grid.appendChild(impact);
      grid.appendChild(mitigation);
      grid.appendChild(owner);
      grid.appendChild(horizon);
      details.appendChild(grid);
      wrapper.appendChild(details);
    });

    body.appendChild(wrapper);
  }

  function ensureDetailModal() {
    let modal = document.getElementById("tree-detail-modal");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = "tree-detail-modal";
    modal.className = "tree-detail-modal";
    modal.hidden = true;
    modal.innerHTML = [
      '<div class="tree-detail-backdrop" data-close="true"></div>',
      '<section class="tree-detail-card" role="dialog" aria-modal="true" aria-labelledby="tree-detail-title">',
      '<header class="tree-detail-header">',
      '<h3 id="tree-detail-title">Detalle</h3>',
      '<button type="button" class="tree-detail-close" aria-label="Cerrar detalle">Cerrar</button>',
      "</header>",
      '<div class="tree-detail-body"></div>',
      "</section>"
    ].join("");

    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.dataset.close === "true" || target.classList.contains("tree-detail-close")) {
        modal.hidden = true;
      }
    });

    document.body.appendChild(modal);
    return modal;
  }

  function openDetailModal(node) {
    const modal = ensureDetailModal();
    const title = modal.querySelector("#tree-detail-title");
    const body = modal.querySelector(".tree-detail-body");
    const reference = getDetailReference(node.id);
    const payload = getDetailPayload(node);
    if (title) {
      title.textContent = node.label;
    }
    if (body) {
      body.innerHTML = "";
      const detailText = document.createElement("p");
      detailText.textContent = payload && payload.summary ? payload.summary : getDetailText(node);
      const sourceLink = document.createElement("a");
      sourceLink.className = "tree-detail-link";
      sourceLink.href = reference.href;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = reference.label;
      body.appendChild(detailText);

      if (payload && payload.bullets && payload.bullets.length) {
        const list = document.createElement("ul");
        list.className = "tree-detail-list";
        payload.bullets.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        body.appendChild(list);
      }

      if (payload && payload.diagramSrc) {
        const figure = document.createElement("figure");
        figure.className = "tree-detail-figure";
        const img = document.createElement("img");
        img.src = payload.diagramSrc;
        img.alt = payload.diagramAlt || "Diagrama de apoyo";
        const caption = document.createElement("figcaption");
        caption.textContent = payload.diagramCaption || "Diagrama de apoyo";
        figure.appendChild(img);
        figure.appendChild(caption);
        body.appendChild(figure);
      }

      if (payload && payload.risks) {
        appendRiskSection(body, payload.risks);
      }

      body.appendChild(sourceLink);
    }
    modal.hidden = false;
  }

  function renderTreeNode(node, expandedSet, onToggle, onLeafOpen) {
    const group = document.createElement("div");
    group.className = "h-tree-group";

    const hasChildren = Boolean(node.children && node.children.length);
    const nodeElement = document.createElement("button");
    nodeElement.className = "h-tree-node";
    nodeElement.type = "button";
    if (node.status) {
      nodeElement.classList.add(`status-${node.status}`);
    }

    const label = document.createElement("span");
    label.className = "h-tree-label";
    label.textContent = node.label;

    const meta = document.createElement("span");
    meta.className = "h-tree-meta";
    if (hasChildren) {
      const isExpanded = expandedSet.has(node.id);
      meta.textContent = `${isExpanded ? "Ocultar" : "Expandir"} (${node.children.length})`;
    } else {
      meta.textContent = "Detalle";
    }

    nodeElement.appendChild(label);
    nodeElement.appendChild(meta);

    if (hasChildren) {
      nodeElement.addEventListener("click", () => onToggle(node.id));
    } else {
      nodeElement.addEventListener("click", () => onLeafOpen(node));
    }

    group.appendChild(nodeElement);

    if (hasChildren && expandedSet.has(node.id)) {
      const childrenWrap = document.createElement("div");
      childrenWrap.className = "h-tree-children";
      node.children.forEach((child) => {
        childrenWrap.appendChild(renderTreeNode(child, expandedSet, onToggle, onLeafOpen));
      });
      group.appendChild(childrenWrap);
    }

    return group;
  }

  function mountTree(container, treeData) {
    if (!container || container.dataset.initialized === "true") {
      return;
    }

    const expandedSet = initialExpandedSet(treeData);

    const render = () => {
      container.innerHTML = "";
      const viewport = document.createElement("div");
      viewport.className = "h-tree-viewport";
      viewport.appendChild(renderTreeNode(treeData, expandedSet, (nodeId) => {
        if (expandedSet.has(nodeId)) {
          expandedSet.delete(nodeId);
        } else {
          expandedSet.add(nodeId);
        }
        render();
      }, openDetailModal));
      container.appendChild(viewport);
    };

    render();
    container.dataset.initialized = "true";
  }

  function setupPresentationMindmaps() {
    const asisContainer = document.getElementById("asis-tree");
    const tobeContainer = document.getElementById("tobe-tree");

    if (asisContainer) {
      mountTree(asisContainer, agentTrees.asis);
    }
    if (tobeContainer) {
      mountTree(tobeContainer, agentTrees.tobe);
    }
  }

  function setupPresentationCosting() {
    const panel = document.getElementById("presentacion-costos");
    if (!panel || panel.dataset.initialized === "true") {
      return;
    }

    assignDefaults(panel);
    panel.addEventListener("input", () => updateCostView(panel));
    updateCostView(panel);
    panel.dataset.initialized = "true";
  }

  function setupPresentationPage() {
    setupPresentationMindmaps();
    setupPresentationCosting();
  }

  document.addEventListener("site:content-loaded", (event) => {
    if (event && event.detail && event.detail.pageKey === "presentacion") {
      setupPresentationPage();
    }
  });

  window.addEventListener("load", setupPresentationPage);
})();



