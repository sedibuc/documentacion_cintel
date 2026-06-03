(function () {
  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

  const ragTrees = {
    asis: {
      id: "rag-asis-root",
      label: "AS-IS Demostrador RAG",
      status: "improve",
      children: [
        {
          id: "rag-asis-funcional",
          label: "Caracteristicas funcionales",
          status: "improve",
          children: [
            { id: "rag-asis-func-1", label: "Procesamiento individual y batch (diagnostico operativo)", status: "prod" },
            { id: "rag-asis-func-2", label: "Comparacion cruzada disponible con cobertura parcial", status: "improve" },
            { id: "rag-asis-func-3", label: "Extraccion estructurada con alcance limitado de tipos", status: "improve" },
            { id: "rag-asis-func-4", label: "Flujo de consulta y descarga existente sin estandar integral", status: "improve" },
            { id: "rag-asis-func-5", label: "Administracion de tipo documental incompleta", status: "alert" },
            { id: "rag-asis-func-6", label: "Onboarding funcional de empresa no consolidado", status: "alert" },
            { id: "rag-asis-func-7", label: "Repositorio de historico por lotes sin modelo documental cerrado", status: "improve" },
            { id: "rag-asis-func-8", label: "Alcance funcional del demostrador con ambiguedades de definicion", status: "alert" }
          ]
        },
        {
          id: "rag-asis-no-funcional",
          label: "Caracteristicas no funcionales",
          status: "alert",
          children: [
            { id: "rag-asis-nf-1", label: "Seguridad: autenticación/sesiones con controles parciales", status: "alert" },
            { id: "rag-asis-nf-2", label: "Contraseñas por defecto y endurecimiento pendiente", status: "alert" },
            { id: "rag-asis-nf-3", label: "Autorización web y aislamiento multi-tenant insuficiente", status: "alert" },
            { id: "rag-asis-nf-4", label: "Observabilidad y trazabilidad con vacios importantes", status: "alert" },
            { id: "rag-asis-nf-5", label: "Coherencia de configuración y dependencias no cerrada", status: "improve" },
            { id: "rag-asis-nf-6", label: "Tool registry y ejecucion controlada no estandarizada", status: "improve" },
            { id: "rag-asis-nf-7", label: "Memoria conversacional y memoria avanzada limitadas", status: "alert" },
            { id: "rag-asis-nf-8", label: "Evaluacion automatica de calidad no institucionalizada", status: "alert" },
            { id: "rag-asis-nf-9", label: "Variables de costo incompletas para estimacion robusta", status: "improve" }
          ]
        },
        {
          id: "rag-asis-arquitectura",
          label: "Arquitectura y decisiones vigentes",
          status: "improve",
          children: [
            {
              id: "rag-asis-arq-1",
              label: "Arquitectura vigente",
              status: "improve",
              children: [
                {
                  id: "rag-asis-arq-1a",
                  label: "Modularidad actual con evidencias y limitaciones",
                  status: "improve",
                  children: [
                    { id: "rag-asis-arq-1a-1", label: "Separacion de capas por carpetas: api, core, db, vector_index_manager, embeddings", status: "prod" },
                    { id: "rag-asis-arq-1a-2", label: "IndexManagerFactory y EmbeddingsManagerFactory como patrones de fabrica", status: "prod" },
                    { id: "rag-asis-arq-1a-3", label: "Configuracion declarativa de modelos en config/seeds/models.json", status: "prod" },
                    { id: "rag-asis-arq-1a-4", label: "Dependencia de streamlit en managers del vector store (stack principal es Flask)", status: "alert" },
                    { id: "rag-asis-arq-1a-5", label: "Core RAG depende de LangChain Hub en inicializacion del prompt", status: "improve" },
                    { id: "rag-asis-arq-1a-6", label: "Acoplamientos entre capas tecnicas y decisiones de ejecucion no completamente resueltos", status: "improve" }
                  ]
                },
                {
                  id: "rag-asis-arq-1b",
                  label: "Gestion de configuracion con hallazgos criticos",
                  status: "alert",
                  children: [
                    { id: "rag-asis-arq-1b-1", label: "config/environment.py exige OPENAI_API_KEY aunque el sistema soporta escenarios on-premise", status: "alert" },
                    { id: "rag-asis-arq-1b-2", label: "Documentacion referencia VECTOR_DB_ENGINE=pinecone|qdrant pero el codigo usa cloud|on-premise", status: "alert" },
                    { id: "rag-asis-arq-1b-3", label: "GROQ_API_KEY referenciada en catalogo de modelos pero ausente de REQUIRED_ENV_VARS", status: "improve" }
                  ]
                },
                {
                  id: "rag-asis-arq-1c",
                  label: "Inconsistencias tecnicas detectadas en diagnostico",
                  status: "alert",
                  children: [
                    { id: "rag-asis-arq-1c-1", label: "app.secret_key hardcodeado directamente en el codigo fuente del repositorio", status: "alert" },
                    { id: "rag-asis-arq-1c-2", label: "Sin CSRF ni rate limiting en los endpoints de la aplicacion Flask", status: "alert" },
                    { id: "rag-asis-arq-1c-3", label: "Campos created_by/updated_by en vector_indexes dependen de streamlit.session_state", status: "improve" }
                  ]
                }
              ]
            },
            {
              id: "rag-asis-arq-2",
              label: "Observaciones estructurales internas",
              status: "alert",
              children: [
                {
                  id: "rag-asis-arq-2a",
                  label: "Estado persistente extendido sin cobertura total",
                  status: "alert",
                  children: [
                    { id: "rag-asis-arq-2a-1", label: "Conversaciones y mensajes persistidos en base de datos", status: "prod" },
                    { id: "rag-asis-arq-2a-2", label: "Feedback y bibliotecas por motor almacenados pero sin trazabilidad de chunks consultados", status: "improve" },
                    { id: "rag-asis-arq-2a-3", label: "Sin correlation-id por request para rastrear ejecucion de extremo a extremo", status: "alert" }
                  ]
                },
                {
                  id: "rag-asis-arq-2b",
                  label: "Tool registry sin gobierno integral",
                  status: "improve",
                  children: [
                    { id: "rag-asis-arq-2b-1", label: "Herramientas registradas sin estandar de versionado ni ciclo de vida documentado", status: "improve" },
                    { id: "rag-asis-arq-2b-2", label: "Ejecucion de tools sin auditoria consistente entre entornos", status: "improve" },
                    { id: "rag-asis-arq-2b-3", label: "Variabilidad operativa al cambiar o actualizar herramientas sin proceso formal", status: "alert" }
                  ]
                },
                {
                  id: "rag-asis-arq-2c",
                  label: "Riesgos de consistencia tecnico-funcional en la documentacion vigente",
                  status: "alert",
                  children: [
                    { id: "rag-asis-arq-2c-1", label: "Discrepancias entre documentacion de variables de entorno y comportamiento real del codigo", status: "alert" },
                    { id: "rag-asis-arq-2c-2", label: "Alcance funcional con ambiguedades entre lo documentado y lo implementado en el demostrador", status: "alert" },
                    { id: "rag-asis-arq-2c-3", label: "Lecturas del material no uniformes segun audiencia tecnica o funcional", status: "improve" }
                  ]
                }
              ]
            },
            {
              id: "rag-asis-arq-3",
              label: "Estructura documental base",
              status: "prod",
              children: [
                { id: "rag-asis-arq-3a", label: "Diagnostico técnico inicial", status: "prod" },
                { id: "rag-asis-arq-3b", label: "Arquitectura vigente", status: "prod" },
                { id: "rag-asis-arq-3c", label: "Observaciones y oportunidades internas", status: "prod" },
                { id: "rag-asis-arq-3d", label: "Guia de despliegue y configuración", status: "prod" },
                { id: "rag-asis-arq-3e", label: "Inventario de costos y variables", status: "prod" }
              ]
            }
          ]
        }
      ]
    },
    tobe: {
      id: "rag-tobe-root",
      label: "TO-BE Document Intelligence Engine MultiTenant",
      status: "v1",
      children: [
        {
          id: "rag-tobe-funcional",
          label: "Caracteristicas funcionales",
          status: "v1",
          children: [
            {
              id: "rag-tobe-f1",
              label: "Objetivo funcional y pipeline tecnico LLM",
              status: "v1",
              children: [
                {
                  id: "rag-tobe-f1a",
                  label: "Problema resuelto y usuarios objetivo",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-f1a-1", label: "Problema: extraccion manual de datos en documentos tipados (certif., contratos, polizas, HSE)", status: "v1" },
                    { id: "rag-tobe-f1a-2", label: "Operadores documentales: cargan, revisan y gestionan alertas de discrepancia", status: "v1" },
                    { id: "rag-tobe-f1a-3", label: "Administradores de empresa (tenant): configuran usuarios, tipos y fuentes de referencia", status: "v1" },
                    { id: "rag-tobe-f1a-4", label: "Equipos de auditoria/cumplimiento: validan extracciones y resuelven alertas BLOCKING", status: "v1" },
                    { id: "rag-tobe-f1a-5", label: "Equipos de integracion: consumen resultados via API REST desde ERP, BI u otros sistemas", status: "v1" },
                    { id: "rag-tobe-f1a-6", label: "CINTEL: administra la plataforma, tenants, modelos LLM y monitoreo global", status: "v1" }
                  ]
                },
                {
                  id: "rag-tobe-f1b",
                  label: "Pipeline de procesamiento y salidas",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-f1b-1", label: "MultiTenant Auth: validacion JWT + RBAC antes de cualquier operacion", status: "v1" },
                    { id: "rag-tobe-f1b-2", label: "Content Extraction Strategy: ruta nativa / LLM multimodal / OCR fallback segun documento", status: "v1" },
                    { id: "rag-tobe-f1b-3", label: "StructuredExtractor (LLM): extraccion zero-shot/few-shot de campos con confianza por campo", status: "v1" },
                    { id: "rag-tobe-f1b-4", label: "Validation Engine: validacion deterministica de tipo, formato y campos obligatorios", status: "v1" },
                    { id: "rag-tobe-f1b-5", label: "CrossValidator: comparacion campo a campo contra CSV/Excel de referencia (MATCH/MISMATCH/PENDIENTE)", status: "v1" },
                    { id: "rag-tobe-f1b-6", label: "Audit Service: trazabilidad inmutable de cada operacion (tenant, modelo, tokens, actor, decision)", status: "v1" }
                  ]
                },
                {
                  id: "rag-tobe-f1c",
                  label: "Integracion con el ecosistema del cliente",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-f1c-1", label: "Recepcion de documentos desde servidor FTP del cliente sin carga manual", status: "v1" },
                    { id: "rag-tobe-f1c-2", label: "API REST con resultados en JSON/CSV consumibles desde ERP, BI o Power Automate", status: "v1" },
                    { id: "rag-tobe-f1c-3", label: "Salida directamente importable en Excel, Google Sheets o herramientas de analisis", status: "v1" },
                    { id: "rag-tobe-f1c-4", label: "Operacion multi-tenant: CINTEL administra la plataforma, cada empresa opera en entorno aislado", status: "v1" },
                    { id: "rag-tobe-f1c-5", label: "Evolucion futura planificada: integraciones con Copilot Studio o Vertex AI Agents (no es MVP)", status: "vnext" }
                  ]
                }
              ]
            },
            {
              id: "rag-tobe-f3",
              label: "Integraciones y servicios",
              status: "v1",
              children: [
                { id: "rag-tobe-f3a", label: "Integracion por FTP: lectura automatica de documentos desde servidor FTP del cliente", status: "v1" },
                { id: "rag-tobe-f3b", label: "Servicio de procesamiento individual: extraccion y validacion de un documento a la vez", status: "v1" },
                { id: "rag-tobe-f3c", label: "Servicio de procesamiento batch: procesamiento asincrono de lotes con ID unico y resumen de resultados", status: "v1" },
                { id: "rag-tobe-f3d", label: "Servicio de comparacion cruzada: comparacion contra fuente de referencia CSV/Excel con reporte de discrepancias", status: "v1" },
                {
                  id: "rag-tobe-f3e",
                  label: "Flujos funcionales del TO-BE",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-f3e-1", label: "Flujo 1: onboarding de empresa y configuracion inicial de tipo documental", status: "v1" },
                    { id: "rag-tobe-f3e-2", label: "Flujo 2: extraccion individual de documento con revision de resultados", status: "v1" },
                    { id: "rag-tobe-f3e-3", label: "Flujo 3: procesamiento en lote con consolidacion y descarga de resultados", status: "v1" },
                    { id: "rag-tobe-f3e-4", label: "Flujo 4: comparacion cruzada contra fuente de referencia con gestion de alertas", status: "v1" },
                    { id: "rag-tobe-f3e-5", label: "Flujo 5: consulta y descarga del historico de lotes y resultados anteriores", status: "v1" },
                    { id: "rag-tobe-f3e-6", label: "Flujo 6: administracion de tipos documentales, esquemas y versiones", status: "v1" }
                  ]
                }
              ]
            },
            {
              id: "rag-tobe-f4",
              label: "Evolutivo posterior",
              status: "vnext",
              children: [
                { id: "rag-tobe-f4a", label: "Servicios opcionales OCR/vision avanzada", status: "vnext" },
                { id: "rag-tobe-f4b", label: "Mayor automatizacion de calidad y validacion", status: "vnext" },
                { id: "rag-tobe-f4c", label: "Escalado multi-region y operacion extendida", status: "vnext" }
              ]
            }
          ]
        },
        {
          id: "rag-tobe-no-funcional",
          label: "Caracteristicas no funcionales",
          status: "v1",
          children: [
            { id: "rag-tobe-nf-1", label: "Separacion explicita: no es RAG ni Q&A conversacional", status: "v1" },
            { id: "rag-tobe-nf-2", label: "Trazabilidad y verificabilidad por esquema definido", status: "v1" },
            { id: "rag-tobe-nf-3", label: "Soberania y operacion multi-tenant", status: "v1" },
            { id: "rag-tobe-nf-4", label: "Variables de control de costos formalizadas", status: "v1" },
            { id: "rag-tobe-nf-5", label: "Riesgos de costo y mitigaciones documentadas", status: "v1" },
            { id: "rag-tobe-nf-6", label: "Controles de seguridad y escalamiento por cerrar", status: "vnext" },
            {
              id: "rag-tobe-nf-7",
              label: "Criterios de exito MVP con hitos medibles",
              status: "v1",
              children: [
                { id: "rag-tobe-nf-7-1", label: "Extraccion confiable en la familia documental priorizada del piloto", status: "v1" },
                { id: "rag-tobe-nf-7-2", label: "Discrepancias relevantes detectadas, clasificadas y trazables por operacion", status: "v1" },
                { id: "rag-tobe-nf-7-3", label: "Aislamiento multi-tenant validado mediante pruebas de aislamiento por tenant", status: "v1" },
                { id: "rag-tobe-nf-7-4", label: "Operacion con monitoreo activo y capacidad de auditoria en entorno piloto", status: "v1" }
              ]
            }
          ]
        },
        {
          id: "rag-tobe-arquitectura",
          label: "Arquitectura TO-BE",
          status: "v1",
          children: [
            {
              id: "rag-tobe-arq-capas",
              label: "Capas del sistema DIE",
              status: "v1",
              children: [
                { id: "rag-tobe-arq-1a-1", label: "MultiTenant Platform Core: gobierno de tenants y segregacion de datos [Desarrollo clasico + BD PostgreSQL + RLS]", status: "v1" },
                { id: "rag-tobe-arq-1a-2", label: "StructuredExtractor: extraccion de campos desde documentos tipados [LLM zero-shot/few-shot]", status: "v1" },
                { id: "rag-tobe-arq-1a-3", label: "CrossValidator: comparacion campo a campo contra fuente de referencia [Desarrollo clasico / motor deterministico, sin LLM]", status: "v1" },
                { id: "rag-tobe-arq-1a-4", label: "DiscrepancyAlertEngine: clasificacion de alertas BLOCKING / WARNING / INFO [Desarrollo clasico / motor de reglas]", status: "v1" },
                { id: "rag-tobe-arq-1a-5", label: "Alert Dashboard / Human Review: revision operativa y aprobacion de documentos [Desarrollo clasico + UI web]", status: "v1" },
                { id: "rag-tobe-arq-storage", label: "Storage y persistencia: documentos, extracciones, alertas e historico por tenant [BD PostgreSQL + RLS + object storage]", status: "v1" },
                { id: "rag-tobe-arq-intake", label: "Ingesta de documentos: carga directa por UI y lector FTP automatizado [Desarrollo clasico + FTP adapter]", status: "v1" },
                { id: "rag-tobe-arq-output", label: "Salidas: REST API + exportacion JSON/CSV descargable [Desarrollo clasico + REST API]", status: "v1" }
              ]
            },
            {
              id: "rag-tobe-arq-plataforma",
              label: "Plataforma MultiTenant",
              status: "v1",
              children: [
                { id: "rag-tobe-f2a-1", label: "Tenant Management: CINTEL crea, configura y suspende empresas cliente [Desarrollo clasico + BD]", status: "v1" },
                { id: "rag-tobe-f2a-2", label: "User Management: roles OPERADOR, ADMIN, REVISOR por tenant [Desarrollo clasico + RBAC]", status: "v1" },
                { id: "rag-tobe-f2a-3", label: "RBAC: control de acceso por rol y endpoint validado en cada llamada [Desarrollo clasico + JWT]", status: "v1" },
                { id: "rag-tobe-f2a-4", label: "Aislamiento de datos: Row-Level Security por tenant_id en PostgreSQL [BD PostgreSQL + RLS]", status: "v1" },
                { id: "rag-tobe-f2a-5", label: "Audit por tenant: log inmutable de todas las operaciones [BD + logs estructurados inmutables]", status: "v1" }
              ]
            },
            {
              id: "rag-tobe-arq-validacion",
              label: "Validacion cruzada y alertas",
              status: "v1",
              children: [
                { id: "rag-tobe-f2b-1", label: "Comparacion campo a campo entre extraccion LLM y CSV/Excel de referencia [Desarrollo clasico / deterministico]", status: "v1" },
                { id: "rag-tobe-f2b-2", label: "Clasificacion por campo: MATCH / MISMATCH / PENDIENTE [Desarrollo clasico]", status: "v1" },
                { id: "rag-tobe-f2b-3", label: "Motor sin LLM garantiza reproducibilidad y auditabilidad del resultado [Desarrollo clasico / sin IA]", status: "v1" },
                { id: "rag-tobe-f2c-1", label: "Alerta BLOCKING: el documento no puede aprobarse sin resolver la discrepancia [Desarrollo clasico / reglas]", status: "v1" },
                { id: "rag-tobe-f2c-2", label: "Alerta WARNING: requiere revision del operador; no bloquea el flujo [Desarrollo clasico / reglas]", status: "v1" },
                { id: "rag-tobe-f2c-3", label: "Alerta INFO: registro para auditoria sin accion requerida [Desarrollo clasico / reglas]", status: "v1" }
              ]
            },
            {
              id: "rag-tobe-arq-tipos",
              label: "Gobierno de tipos documentales",
              status: "v1",
              children: [
                { id: "rag-tobe-f2d-1", label: "Configuracion del esquema de campos a extraer por tipo documental [Desarrollo clasico + BD]", status: "v1" },
                { id: "rag-tobe-f2d-2", label: "Control de estados del tipo documental: activo, en revision, archivado [Desarrollo clasico + BD]", status: "v1" },
                { id: "rag-tobe-f2d-3", label: "Versionado del esquema y registro de cambios para trazabilidad y reproducibilidad [Desarrollo clasico + BD]", status: "v1" }
              ]
            },
            {
              id: "rag-tobe-arq-2",
              label: "Decisiones tecnicas por dominio",
              status: "v1",
              children: [
                {
                  id: "rag-tobe-arq-2a",
                  label: "Contexto y datos",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-arq-2a-1", label: "Persistencia de documentos y resultados por tenant [BD PostgreSQL + RLS]", status: "v1" },
                    { id: "rag-tobe-arq-2a-2", label: "Modelo de datos: DocumentSchema, ExtractionResult, ValidationResult, Alert [Diseño de BD relacional]", status: "v1" },
                    { id: "rag-tobe-arq-2a-3", label: "Versionado de tipos documentales y esquemas de extraccion [Desarrollo clasico + BD]", status: "v1" },
                    { id: "rag-tobe-arq-2a-4", label: "Correlation ID por operacion para auditoria de extremo a extremo [Desarrollo clasico + BD + logs]", status: "v1" }
                  ]
                },
                {
                  id: "rag-tobe-arq-2b",
                  label: "IA y extraccion",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-arq-2b-1", label: "Extraccion con seleccion de ruta: texto nativo / LLM multimodal / OCR fallback [LLM + OCR + clasico]", status: "v1" },
                    { id: "rag-tobe-arq-2b-2", label: "Registro de tokens de entrada/salida por operacion [Desarrollo clasico + BD]", status: "v1" },
                    { id: "rag-tobe-arq-2b-3", label: "Validation Engine: tipo de dato, formato y campos obligatorios [Desarrollo clasico / deterministico, sin LLM]", status: "v1" },
                    { id: "rag-tobe-arq-2b-4", label: "Salida estructurada en JSON consumible directamente por ERP, BI u otros [Desarrollo clasico / schema]", status: "v1" }
                  ]
                },
                {
                  id: "rag-tobe-arq-2c",
                  label: "Gobernanza y operacion",
                  status: "v1",
                  children: [
                    { id: "rag-tobe-arq-2c-1", label: "Human Review: ninguna alerta BLOCKING se aprueba sin decision explicita del operador [Desarrollo clasico + UI]", status: "v1" },
                    { id: "rag-tobe-arq-2c-2", label: "Observabilidad: logs estructurados, metricas de latencia y SLO por tenant [Infra / Prometheus o equivalente]", status: "v1" },
                    { id: "rag-tobe-arq-2c-3", label: "Exportacion controlada de resultados via REST API y descarga JSON/CSV [Desarrollo clasico + REST]", status: "v1" },
                    { id: "rag-tobe-arq-2c-4", label: "Criterios de aceptacion para transicion a piloto con usuarios reales [Proceso / checklist tecnico]", status: "v1" }
                  ]
                },
                {
                  id: "rag-tobe-arq-2d",
                  label: "Seguridad y escalado",
                  status: "vnext",
                  children: [
                    { id: "rag-tobe-arq-2d-1", label: "Aislamiento logico con RLS: ninguna consulta accede a datos de otro tenant [BD PostgreSQL + RLS]", status: "v1" },
                    { id: "rag-tobe-arq-2d-2", label: "Politicas RBAC minimas por rol validadas en cada endpoint [Desarrollo clasico + JWT]", status: "v1" },
                    { id: "rag-tobe-arq-2d-3", label: "Separacion entre servicios core MVP y capacidades de evolucion futura [Arquitectura / diseño modular]", status: "v1" },
                    { id: "rag-tobe-arq-2d-4", label: "Ruta de escalado con autoscaling y hardening para V2+ [Planificacion + Infra cloud / Kubernetes]", status: "vnext" }
                  ]
                }
              ]
            },
            { id: "rag-tobe-arq-1b", label: "Contratos minimos sugeridos entre modulos", status: "v1" },
            { id: "rag-tobe-arq-1c", label: "Riesgos abiertos de arquitectura", status: "vnext" }
          ]
        }
      ]
    }
  };

  const ragLeafDetails = {
    "rag-asis-func-1": "El diagnostico confirma procesamiento individual y por lotes como capacidad operativa base. El valor para direccion es que ya existe un flujo ejecutable, pero sin estandar integral de gobierno entre tipos documentales y niveles de calidad.",
    "rag-asis-func-2": "La comparacion cruzada esta disponible, pero con cobertura parcial por reglas y por tipo documental. En el análisis se identifica como funcionalidad util, aunque requiere robustecer criterios de discrepancia y trazabilidad de decisiones.",
    "rag-asis-func-3": "La extraccion estructurada existe con alcance limitado de tipos y reglas en el material actual. Se observan oportunidades internas de mayor detalle en esquema, control de campos y validacion.",
    "rag-asis-func-4": "Hay flujo de consulta y descarga, pero sin un estandar transversal de salida y auditoría. Esto impacta la experiencia de operación y dificulta homologar resultados entre clientes.",
    "rag-asis-func-5": "La administracion de tipo documental aparece incompleta en su descripcion. Falta cerrar ciclo de configuración, validación, estados del tipo y control de cambios dentro de la documentacion vigente.",
    "rag-asis-func-6": "El onboarding funcional de empresa no esta consolidado de extremo a extremo en la presentacion revisada, y deja actividades sin secuencia completa.",
    "rag-asis-func-7": "Existe historico por lotes, pero sin modelo documental cerrado de explotacion y gobernanza en el estado actual.",
    "rag-asis-func-8": "El analisis detecta ambiguedades en la definicion del alcance funcional del demostrador. Esta situacion impacta decisiones tecnicas, comunicacion ejecutiva y consistencia de lectura del estado actual.",
    "rag-asis-nf-1": "Seguridad con controles parciales en autenticación y sesiones. En terminos directivos, hoy existe riesgo de operación si no se completa endurecimiento y políticas por tenant.",
    "rag-asis-nf-2": "Se reportan hallazgos de contrasenas por defecto y endurecimiento pendiente. Es una alerta de riesgo alto para salida a produccion sin plan de remediacion formal.",
    "rag-asis-nf-3": "Autorización web y aislamiento multi-tenant aparecen descritos de forma parcial, con controles no completamente detallados en el material actual.",
    "rag-asis-nf-4": "Observabilidad y trazabilidad tienen vacios. Falta consolidar metricas, eventos y rastro por proceso para auditoría, soporte y control de calidad.",
    "rag-asis-nf-5": "La coherencia de configuración y dependencias no esta totalmente cerrada. Esto afecta repetibilidad de despliegue y confiabilidad de entornos.",
    "rag-asis-nf-6": "Tool registry y ejecucion controlada requieren estandarizacion. Sin gobierno claro aumenta la variabilidad operativa y el riesgo de cambios no controlados.",
    "rag-asis-nf-7": "La memoria conversacional y la memoria avanzada se muestran limitadas en alcance y trazabilidad dentro del estado actual documentado.",
    "rag-asis-nf-8": "La evaluacion automatica de calidad no esta institucionalizada. Esto limita el control continuo de precision, consistencia y calidad de salida.",
    "rag-asis-nf-9": "El inventario de costos identifica variables, pero aun incompletas para presupuesto robusto. Se requiere parametrizacion y gobierno de supuestos economicos.",
    "rag-asis-arq-1a": "La modularidad actual tiene evidencias positivas, pero tambien limitaciones de acoplamiento y responsabilidades. El análisis recomienda consolidar limites por dominio.",
    "rag-asis-arq-1b": "Gestion de configuración con hallazgos criticos en consistencia entre componentes y entornos. Es prioridad para reducir riesgo técnico y operativo.",
    "rag-asis-arq-1c": "Se documentan inconsistencias tecnicas que afectan mantenibilidad y confianza en la operación. Deben cerrarse antes de escalar alcance.",
    "rag-asis-arq-2a": "El estado persistente extendido muestra cobertura parcial del ciclo operativo y evidencia vacios de trazabilidad en la version revisada.",
    "rag-asis-arq-2b": "El registro de herramientas no tiene gobierno integral claramente documentado; hay variabilidad en ejecucion, versionado y auditoria.",
    "rag-asis-arq-2c": "La narrativa tecnico-funcional vigente presenta inconsistencias internas, lo que genera lectura no uniforme del material AS-IS.",
    "rag-asis-arq-3a": "El diagnostico técnico inicial consolida hallazgos de seguridad, configuración, observabilidad y riesgos. Es la base factual del punto de partida AS-IS.",
    "rag-asis-arq-3b": "La arquitectura vigente describe componentes y flujo actual, permitiendo identificar limites reales del demostrador en su estado presente.",
    "rag-asis-arq-3c": "Las observaciones y oportunidades internas conectan hallazgos tecnicos con claridad documental y organizacion de la informacion.",
    "rag-asis-arq-3d": "La guia de despliegue organiza requisitos, variables y pasos operativos, pero aun requiere cierre de consistencia y endurecimiento.",
    "rag-asis-arq-3e": "El inventario de costos y variables aporta la base economica, y requiere formalizar supuestos para proyeccion ejecutiva confiable.",
    "rag-tobe-f1a": "El TO-BE define problema, usuarios y alcance de forma explicita: procesamiento documental estructurado y validable para operación multi-cliente.",
    "rag-tobe-f1b": "Se establece pipeline de entradas, procesamiento y salidas estructuradas con foco en verificabilidad y control de discrepancias.",
    "rag-tobe-f1c": "Esta capacidad describe alineacion operativa con procesos, responsables y gobierno del cliente. Es distinta de las integraciones tecnicas puntuales (FTP y servicios REST), que se tratan en el bloque de integraciones y servicios.",
    "rag-tobe-f2a": "MultiTenant Platform Core concentra aislamiento, gobierno base y operación por cliente. Es pilar para escalar sin mezclar contexto ni datos.",
    "rag-tobe-f2b": "CrossValidator formaliza comparacion de campos y reglas entre fuentes, reduciendo ambiguedad y mejorando consistencia de resultado.",
    "rag-tobe-f2c": "DiscrepancyAlertEngine convierte diferencias en alertas trazables y accionables para operación y control.",
    "rag-tobe-f2d": "El módulo administrativo de tipos documentales cierra configuración, estados y versionado del esquema de extraccion.",
    "rag-tobe-f3a": "Integracion FTP aparece como mecanismo operativo para recepcion documental en escenarios empresariales concretos.",
    "rag-tobe-f3b": "Servicio de procesamiento individual pensado para casos puntuales y validación controlada por documento.",
    "rag-tobe-f3c": "Servicio batch orientado a volumen, eficiencia operativa y trazabilidad por lote.",
    "rag-tobe-f3d": "Servicio de comparacion cruzada como componente funcional central para verificacion inter-documental.",
    "rag-tobe-f3e": "Los flujos funcionales TO-BE (1 a 6) estructuran onboarding, extraccion, validación, historico y administracion operativa.",
    "rag-tobe-f4a": "OCR y vision avanzada quedan para fase evolutiva, evitando sobrecargar el alcance inicial de entrega.",
    "rag-tobe-f4b": "Mayor automatizacion de calidad se contempla en versión posterior cuando el MVP estabilice sus metricas.",
    "rag-tobe-f4c": "Escalado multi-region y operación extendida se proyectan para crecimiento, no como prerrequisito de versión 1.",
    "rag-tobe-nf-1": "La separacion explicita frente a RAG/Q&A elimina ambiguedad y alinea arquitectura con objetivo real del producto.",
    "rag-tobe-nf-2": "Trazabilidad y verificabilidad por esquema definido son criterios no funcionales centrales para confianza directiva.",
    "rag-tobe-nf-3": "Soberania y operación multi-tenant se tratan como condicion de plataforma y no como mejora opcional.",
    "rag-tobe-nf-4": "Variables de control de costos se formalizan para permitir planeacion y seguimiento economico continuo.",
    "rag-tobe-nf-5": "Riesgos de costo y mitigaciones quedan incorporados en el diseño para evitar desviaciones tempranas.",
    "rag-tobe-nf-6": "Controles adicionales de seguridad y escalamiento quedan identificados para maduracion posterior.",
    "rag-tobe-nf-7": "Criterios de exito del MVP definen umbrales de salida a operación y cierre de fase.",
    "rag-tobe-arq-1a": "Capas y módulos del DIE se organizan para aislar responsabilidades y facilitar evolución controlada.",
    "rag-tobe-arq-1b": "Contratos minimos sugeridos estandarizan integraciones y reducen dependencia de conocimiento tacito.",
    "rag-tobe-arq-1c": "Riesgos abiertos de arquitectura quedan explicitados para gestion temprana en comite técnico.",
    "rag-tobe-arq-2a": "Las decisiones de contexto y datos definen persistencia, recuperacion y completitud institucional.",
    "rag-tobe-arq-2b": "Las decisiones de IA y extraccion enmarcan modelos, validación y trazabilidad de salida.",
    "rag-tobe-arq-2c": "Gobernanza y operación cubren validación humana, observabilidad y mecanismos de publicacion.",
    "rag-tobe-arq-2d": "Seguridad y escalado incluyen controles obligatorios y ruta de maduracion posterior.",
    "rag-tobe-arq-3a": "Supuestos y cronograma por sprint ordenan ejecucion de alcance en etapas verificables.",
    "rag-tobe-arq-3b": "Gantt, hitos y dependencias criticas permiten seguimiento ejecutivo de avance y bloqueos.",
    "rag-tobe-arq-3c": "Riesgos y mitigación por iteración alinean gestion técnica con control contractual y operativo.",
    "rag-asis-arq-1c-1": "La clave secreta de Flask esta definida en el codigo fuente; en produccion debe gestionarse como secreto externo.",
    "rag-asis-arq-1c-2": "Sin proteccion CSRF un atacante puede ejecutar solicitudes en nombre del usuario; sin rate limiting se facilitan ataques de fuerza bruta.",
    "rag-asis-arq-1c-3": "Los campos de auditoria dependen de streamlit.session_state, que no existe en el stack Flask de produccion.",
    // Problema resuelto y usuarios objetivo
    "rag-tobe-f1a-1": "Organizaciones en construccion, legal e inmobiliario invierten tiempo manual en extraer y contrastar datos de certificados, contratos, polizas y documentos HSE.",
    "rag-tobe-f1a-2": "Cargan documentos por carga directa o FTP, revisan los campos extraidos y gestionan las alertas BLOCKING, WARNING o INFO del proceso.",
    "rag-tobe-f1a-3": "Configuran tipos documentales con su esquema de campos, gestionan usuarios internos y cargan fuentes de referencia para comparacion cruzada.",
    "rag-tobe-f1a-4": "Revisan los documentos con discrepancias detectadas, corrigen valores si es necesario y aprueban o rechazan con observacion registrada.",
    "rag-tobe-f1a-5": "Consumen los resultados estructurados (JSON/CSV) via API REST para alimentar sus ERP, BI, Power Automate u otras herramientas de analisis.",
    "rag-tobe-f1a-6": "Administra la plataforma como servicio multi-cliente: crea tenants, asigna modelos LLM, monitorea metricas globales y garantiza aislamiento.",
    // Pipeline de procesamiento y salidas
    "rag-tobe-f1b-1": "El API Gateway valida el JWT del cliente, extrae el tenant_id y aplica control de acceso por rol antes de ejecutar cualquier operacion.",
    "rag-tobe-f1b-2": "Seleccion automatica de la ruta de extraccion mas adecuada: texto nativo para PDFs digitales, LLM multimodal cuando aplica, OCR solo para escaneados.",
    "rag-tobe-f1b-3": "El LLM recibe el documento normalizado, el esquema del tipo documental y el prompt versionado; extrae campos con confianza por campo en JSON.",
    "rag-tobe-f1b-4": "Cada campo extraido se valida contra su tipo de dato, formato esperado y obligatoriedad; los no extraidos se marcan explicitamente.",
    "rag-tobe-f1b-5": "Comparacion campo a campo contra el CSV/Excel de referencia del cliente; cada campo queda clasificado como MATCH, MISMATCH o PENDIENTE.",
    "rag-tobe-f1b-6": "Cada operacion registra tenant, documento, modelo LLM, version del prompt, tokens consumidos, latencia, actor y decision de forma inmutable.",
    // Integracion con ecosistema del cliente
    "rag-tobe-f1c-1": "El sistema monitorea el servidor FTP del cliente y procesa automaticamente los documentos nuevos sin intervencion manual del operador.",
    "rag-tobe-f1c-2": "Los resultados JSON con campos extraidos, estado de validacion y alertas son consumibles desde cualquier sistema con soporte HTTP.",
    "rag-tobe-f1c-3": "El CSV de resultados puede abrirse directamente en Excel o Google Sheets para analisis sin herramientas adicionales.",
    "rag-tobe-f1c-4": "CINTEL es el unico que puede crear, configurar o suspender tenants; cada empresa cliente opera en su entorno completamente aislado.",
    "rag-tobe-f1c-5": "Las integraciones con Copilot Studio o Vertex AI Agents estan planificadas para versiones posteriores al piloto; no son parte del MVP.",
    // MultiTenant Platform Core
    "rag-tobe-f2a-1": "CINTEL crea y activa empresas cliente como tenants en la plataforma, asigna sus configuraciones iniciales y puede suspenderlos.",
    "rag-tobe-f2a-2": "Cada tenant gestiona sus propios usuarios con roles que controlan que operaciones pueden ejecutar dentro de su entorno.",
    "rag-tobe-f2a-3": "Cada llamada a la API valida que el usuario tiene permiso para el endpoint especifico dentro de su tenant.",
    "rag-tobe-f2a-4": "PostgreSQL implementa Row-Level Security con tenant_id; ninguna consulta puede acceder a datos de otro tenant.",
    "rag-tobe-f2a-5": "Todas las operaciones del tenant quedan registradas en un log inmutable: quien hizo que, cuando y con que resultado.",
    // CrossValidator
    "rag-tobe-f2b-1": "Para cada campo del documento extraido, el validador busca su contraparte en la fuente de referencia y registra si coinciden o difieren.",
    "rag-tobe-f2b-2": "El resultado por campo es MATCH (coincide), MISMATCH (difiere en valor o formato) o PENDIENTE (no encontrado en la referencia).",
    "rag-tobe-f2b-3": "La comparacion cruzada no usa LLM; es un motor de reglas deterministico que garantiza reproducibilidad y auditabilidad.",
    // DiscrepancyAlertEngine
    "rag-tobe-f2c-1": "BLOCKING impide que el documento sea aprobado; el operador debe revisar y resolver la discrepancia antes de continuar el flujo.",
    "rag-tobe-f2c-2": "WARNING requiere que el operador revise el campo en cuestion, pero el flujo puede continuar si el operador decide aceptar el resultado.",
    "rag-tobe-f2c-3": "INFO queda registrado para auditoria y visibilidad operativa sin requerir ninguna accion del operador para continuar.",
    // Modulo administrativo
    "rag-tobe-f2d-1": "El administrador define los campos a extraer, sus tipos de dato, si son obligatorios y sus descripciones semanticas para el LLM.",
    "rag-tobe-f2d-2": "Cada tipo documental puede estar activo, en revision o archivado; el sistema solo usa tipos activos para nuevos procesamientos.",
    "rag-tobe-f2d-3": "Cada cambio en el esquema genera una nueva version; los documentos procesados quedan vinculados a la version del esquema usada.",
    // Flujos funcionales del TO-BE
    "rag-tobe-f3e-1": "El administrador del tenant configura el tipo documental con su esquema de campos, carga la fuente de referencia y da de alta los usuarios.",
    "rag-tobe-f3e-2": "El operador carga un documento, el sistema extrae campos y genera el reporte de validacion; el operador revisa y aprueba o rechaza.",
    "rag-tobe-f3e-3": "El operador carga un lote de documentos via FTP o carga masiva; el sistema los procesa en background y consolida un resumen descargable.",
    "rag-tobe-f3e-4": "El operador ejecuta comparacion cruzada con un CSV/Excel de referencia; el sistema genera alertas clasificadas por severidad para revision.",
    "rag-tobe-f3e-5": "El usuario consulta el historial de lotes, filtra por fecha, tipo o estado, y descarga los resultados de procesados anteriores.",
    "rag-tobe-f3e-6": "El administrador crea, edita o versiona tipos documentales; el sistema valida consistencia y registra el cambio con fecha y autor.",
    // Criterios de exito MVP
    "rag-tobe-nf-7-1": "El sistema extrae correctamente los campos del tipo documental priorizado en mas del umbral definido de documentos del piloto.",
    "rag-tobe-nf-7-2": "Las discrepancias significativas entre extraccion y fuente de referencia son detectadas, clasificadas por severidad y consultables en auditoria.",
    "rag-tobe-nf-7-3": "Pruebas de aislamiento confirman que ningun tenant puede acceder a documentos, resultados o datos de otro tenant.",
    "rag-tobe-nf-7-4": "El sistema opera con logs activos, metricas de latencia visibles y trazabilidad de acciones disponible para el equipo de soporte.",
    // Capas y modulos del DIE
    "rag-tobe-arq-1a-1": "Fundacion arquitectonica del producto: sin MultiTenant Core el sistema no es comercializable como plataforma multi-cliente.",
    "rag-tobe-arq-1a-2": "Componente de IA central: recibe la representacion normalizada del documento y extrae campos tipados con confianza.",
    "rag-tobe-arq-1a-3": "Motor deterministico que formaliza la comparacion entre lo extraido y la fuente de verdad del cliente.",
    "rag-tobe-arq-1a-4": "Convierte cada MISMATCH en una alerta accionable con severidad, descripcion y estado de resolucion.",
    "rag-tobe-arq-1a-5": "Interfaz operativa donde el equipo del cliente gestiona alertas, corrige valores y aprueba o rechaza documentos procesados.",
    // Contexto y datos
    "rag-tobe-arq-2a-1": "Cada tenant tiene su propia particion de datos; documentos, extracciones, alertas y resultados solo son accesibles por el tenant propietario.",
    "rag-tobe-arq-2a-2": "Entidades de DocumentSchema, ExtractionResult, ValidationResult y DiscrepancyAlert con relaciones bien definidas por tenant.",
    "rag-tobe-arq-2a-3": "Cada tipo documental tiene un historial de versiones; los cambios de esquema no afectan retroactivamente los documentos ya procesados.",
    "rag-tobe-arq-2a-4": "Cada operacion tiene un ID de correlacion unico que permite rastrear el recorrido completo de un documento en el sistema.",
    // IA y extraccion
    "rag-tobe-arq-2b-1": "La estrategia de extraccion selecciona automaticamente: texto nativo para PDFs digitales, LLM multimodal si aplica, OCR solo para escaneados.",
    "rag-tobe-arq-2b-2": "Cada llamada al LLM registra tokens de entrada y salida, modelo usado, version del prompt y latencia para control de costo.",
    "rag-tobe-arq-2b-3": "El motor deterministico verifica tipo de dato, formato, obligatoriedad y rangos esperados para cada campo extraido.",
    "rag-tobe-arq-2b-4": "El JSON de salida sigue el schema del tipo documental y es directamente consumible por ERP, BI o herramientas de analisis.",
    // Gobernanza y operacion
    "rag-tobe-arq-2c-1": "Ningun documento con alertas BLOCKING puede ser aprobado sin revision explicita del operador; la decision queda registrada.",
    "rag-tobe-arq-2c-2": "Logs estructurados por operacion, metricas de tokens/latencia y tablero de SLO por tenant disponibles desde el MVP.",
    "rag-tobe-arq-2c-3": "Resultados disponibles via API REST en JSON y CSV, descargables desde la UI y exportables a herramientas externas.",
    "rag-tobe-arq-2c-4": "Lista de condiciones tecnicas y operativas verificables que el sistema debe cumplir antes de habilitarse para usuarios reales.",
    // Seguridad y escalado
    "rag-tobe-arq-2d-1": "PostgreSQL RLS garantiza que cada consulta solo accede a filas del tenant activo; el aislamiento es a nivel de base de datos.",
    "rag-tobe-arq-2d-2": "Modelo RBAC minimo con roles OPERADOR, ADMIN y REVISOR; cada endpoint valida el rol antes de ejecutar.",
    "rag-tobe-arq-2d-3": "El MVP entrega los servicios de extraccion, validacion y alertas; las capacidades de escalado horizontal se planifican en V2.",
    "rag-tobe-arq-2d-4": "Definicion de umbrales de autoscaling, presupuestos de latencia y politicas de hardening para las versiones posteriores al piloto.",
  };

  function applyTreeDetails(node, detailMap) {
    if (detailMap[node.id]) {
      node.detail = detailMap[node.id];
    }
    if (node.children && node.children.length) {
      node.children.forEach((child) => applyTreeDetails(child, detailMap));
    }
  }

  applyTreeDetails(ragTrees.asis, ragLeafDetails);
  applyTreeDetails(ragTrees.tobe, ragLeafDetails);

  const ragRichDetails = {
    "rag-tobe-arq-1c": {
      summary: "Los riesgos abiertos de arquitectura se descomponen por impacto operativo para facilitar seguimiento en comité técnico y cierre por iteración.",
      bullets: [
        "Riesgo de acople excesivo entre extracción y validación.",
        "Riesgo de deriva de esquemas por cambios no versionados.",
        "Riesgo de latencia no controlada en lotes altos.",
        "Riesgo de deuda de observabilidad en eventos críticos."
      ],
      risks: [
        {
          title: "Acoplamiento entre módulos de extracción y validación",
          impact: "Medio/Alto: frena despliegues parciales y aumenta regresiones al cambiar reglas de negocio.",
          mitigation: "Definir contratos API internos por versión y pruebas de contrato por módulo antes de integrar.",
          owner: "Arquitectura + Backend IA",
          horizon: "Sprint 2-3"
        },
        {
          title: "Inconsistencia de esquemas de salida",
          impact: "Alto: reprocesos manuales y pérdida de trazabilidad de validación cruzada.",
          mitigation: "Versionar esquema canónico, incluir validador estricto en CI y bloquear despliegue con incompatibilidades.",
          owner: "Líder de datos",
          horizon: "Sprint 1-2"
        },
        {
          title: "Latencia fuera de umbral en procesamiento por lote",
          impact: "Medio: incumplimiento de ventanas operativas y sobrecosto por reintentos.",
          mitigation: "Presupuestos de latencia por etapa, colas con backpressure y pruebas de carga por perfil de documento.",
          owner: "Plataforma/DevOps",
          horizon: "Sprint 3-4"
        },
        {
          title: "Cobertura parcial de observabilidad",
          impact: "Medio: incidentes sin causa raíz clara y diagnósticos tardíos.",
          mitigation: "Trazas obligatorias por transacción, IDs de correlación y tablero de SLO por tenant.",
          owner: "Operación técnica",
          horizon: "Sprint 2-4"
        }
      ],
      diagramSrc: "assets/img/diagramas/document-intelligence/02-mapa-componentes-tobe.png",
      diagramAlt: "Mapa de componentes TO-BE con focos de riesgo",
      diagramCaption: "Riesgos priorizados sobre el mapa de componentes TO-BE."
    },
    "rag-tobe-arq-1a": {
      summary: "La arquitectura del DIE se organiza por módulos especializados que desacoplan captura, extracción, validación y alerta para sostener evolución controlada.",
      bullets: [
        "MultiTenant Platform Core: gobierno de tenants, autenticación y segregación.",
        "StructuredExtractor: extracción estructurada y validable desde documentos.",
        "CrossValidator: comparación entre fuentes y cálculo de coherencia.",
        "DiscrepancyAlertEngine: generación y clasificación de alertas.",
        "Alert Dashboard: visualización operativa para priorización y trazabilidad."
      ],
      diagramSrc: "assets/img/diagramas/document-intelligence/02-mapa-componentes-tobe.png",
      diagramAlt: "Mapa de componentes TO-BE del Document Intelligence Engine",
      diagramCaption: "Vista de referencia: mapa de componentes TO-BE."
    },
    "rag-tobe-arq-2a": {
      summary: "Contexto y datos resuelven persistencia auditable, separación por tenant y disponibilidad de insumos para validación.",
      bullets: [
        "Persistencia de documentos y resultados por tenant.",
        "Modelo de datos con entidades de extracción y validación.",
        "Versionado de tipos documentales y reglas.",
        "Rastro de ejecución para auditoría funcional y técnica."
      ],
      diagramSrc: "assets/img/diagramas/document-intelligence/05-vista-datos-conceptual.png",
      diagramAlt: "Modelo de datos conceptual DIE",
      diagramCaption: "Vista de referencia: modelo de datos conceptual."
    },
    "rag-tobe-arq-2b": {
      summary: "IA y extracción se diseñan para precisión operativa y verificabilidad, evitando lógica conversacional de RAG/QA.",
      bullets: [
        "Pipeline de extracción con control de método y latencia.",
        "Registro de tokens de entrada/salida para costo y trazabilidad.",
        "Validación de campos contra fuentes de referencia.",
        "Salida estructurada orientada a procesos de negocio."
      ],
      diagramSrc: "assets/img/diagramas/document-intelligence/04-flujo-extraccion-llm.png",
      diagramAlt: "Flujo de extracción estructurada con LLM",
      diagramCaption: "Vista de referencia: flujo de extracción LLM."
    },
    "rag-tobe-arq-2d": {
      summary: "Seguridad y escalado se articulan sobre aislamiento multi-tenant y controles de despliegue por capas.",
      bullets: [
        "Aislamiento lógico de datos y sesiones por tenant.",
        "Controles de acceso y políticas operativas mínimas.",
        "Separación entre servicios core y evolución futura.",
        "Ruta de escalado en el roadmap arquitectónico."
      ],
      risks: [
        {
          title: "Fuga cruzada de datos entre tenants",
          impact: "Crítico: riesgo contractual y de seguridad de la información.",
          mitigation: "Pruebas de aislamiento por tenant en cada release, cifrado por contexto y auditoría de permisos efectiva.",
          owner: "Seguridad de plataforma",
          horizon: "Sprint 2-3"
        },
        {
          title: "Escalado reactivo sin métricas tempranas",
          impact: "Alto: degradación de servicio y costos no previstos.",
          mitigation: "Definir umbrales de autoscaling y alertas proactivas de consumo/latencia por entorno.",
          owner: "DevOps",
          horizon: "Sprint 3-5"
        }
      ],
      diagramSrc: "assets/img/diagramas/document-intelligence/06-vista-seguridad-multitenant.png",
      diagramAlt: "Vista de seguridad y aislamiento multitenant",
      diagramCaption: "Vista de referencia: seguridad y aislamiento MultiTenant."
    },
    "rag-tobe-arq-3c": {
      summary: "El plan por iteración incorpora riesgos concretos de ejecución para evitar desplazamientos de alcance, fecha y costo.",
      bullets: [
        "Riesgos de dependencia externa (FTP/fuentes).",
        "Riesgos de precisión en extracción para tipos complejos.",
        "Riesgos de adopción operativa en validación humana."
      ],
      risks: [
        {
          title: "Dependencias externas no disponibles en ventanas críticas",
          impact: "Alto: bloquea pruebas integrales y retrasa hitos contractuales.",
          mitigation: "Plan de mocks operativos por fuente y cola de reintento desacoplada de ejecución principal.",
          owner: "Integraciones",
          horizon: "Sprint 1-4"
        },
        {
          title: "Precisión insuficiente en documentos de alta variabilidad",
          impact: "Alto: aumento de corrección manual y menor confianza del usuario.",
          mitigation: "Curar set de validación por tipo documental y umbral mínimo de calidad antes de pasar a piloto.",
          owner: "Equipo IA",
          horizon: "Sprint 2-5"
        },
        {
          title: "Sobrecarga del equipo validador",
          impact: "Medio: cuellos de botella en operación y retrasos de cierre de casos.",
          mitigation: "Priorización por criticidad, lotes de revisión y métricas de throughput por célula operativa.",
          owner: "Operación funcional",
          horizon: "Sprint 4-6"
        }
      ],
      diagramSrc: "assets/img/diagramas/cronograma-riesgos-mitigacion-rag.png",
      diagramAlt: "Cronograma con riesgos y mitigaciones",
      diagramCaption: "Seguimiento de riesgos y mitigaciones por fase del plan."
    },
    "rag-asis-arq-1a": {
      summary: "En AS-IS ya se observa una base modular, con limites de dominio y acoples identificables dentro de la documentacion actual.",
      bullets: [
        "Componentes centrales identificados y operativos.",
        "Acoples técnicos en configuración y dependencias.",
        "Variabilidad entre entornos de ejecución.",
        "Necesidad de contratos explícitos por módulo."
      ],
      diagramSrc: "assets/img/diagramas/arquitectura-general.png",
      diagramAlt: "Arquitectura general AS-IS del demostrador",
      diagramCaption: "Vista de referencia: arquitectura lógica vigente."
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

  applyTreeRichDetails(ragTrees.asis, ragRichDetails);
  applyTreeRichDetails(ragTrees.tobe, ragRichDetails);

  function getDetailReference(nodeId) {
    if (nodeId.startsWith("rag-asis-func") || nodeId.startsWith("rag-asis-nf")) {
      return { href: "diagnostico.html", label: "Ver sección fuente: Diagnostico técnico" };
    }
    if (nodeId.startsWith("rag-asis-arq-1")) {
      return { href: "arquitectura.html", label: "Ver sección fuente: Arquitectura vigente" };
    }
    if (nodeId.startsWith("rag-asis-arq-2")) {
      return { href: "diagnostico.html", label: "Ver sección fuente: Diagnóstico técnico" };
    }
    if (nodeId === "rag-asis-arq-3a") {
      return { href: "diagnostico.html", label: "Ver sección fuente: Diagnostico técnico inicial" };
    }
    if (nodeId === "rag-asis-arq-3b") {
      return { href: "arquitectura.html", label: "Ver sección fuente: Arquitectura vigente" };
    }
    if (nodeId === "rag-asis-arq-3c") {
      return { href: "diagnostico.html", label: "Ver sección fuente: Hallazgos del diagnóstico" };
    }
    if (nodeId === "rag-asis-arq-3d") {
      return { href: "despliegue.html", label: "Ver sección fuente: Configuración y despliegue" };
    }
    if (nodeId === "rag-asis-arq-3e") {
      return { href: "costos.html", label: "Ver sección fuente: Inventario de costos" };
    }
    if (nodeId.startsWith("rag-tobe-f1") || nodeId.startsWith("rag-tobe-f2") || nodeId.startsWith("rag-tobe-f4")) {
      return { href: "tobefuncional.html", label: "Ver sección fuente: TO-BE funcional" };
    }
    if (nodeId.startsWith("rag-tobe-f3")) {
      return { href: "tobefuncional.html#integracion-por-ftp", label: "Ver sección fuente: Integraciones y servicios" };
    }
    if (nodeId === "rag-tobe-nf-1") {
      return { href: "no-es-rag.html", label: "Ver sección fuente: Por que no es un RAG" };
    }
    if (nodeId === "rag-tobe-nf-4" || nodeId === "rag-tobe-nf-5") {
      return { href: "servicios-costos-tobe.html", label: "Ver sección fuente: Servicios y costos TO-BE" };
    }
    if (nodeId.startsWith("rag-tobe-nf")) {
      return { href: "conclusiones.html", label: "Ver sección fuente: Conclusiones y criterios" };
    }
    if (nodeId.startsWith("rag-tobe-arq-1")) {
      return { href: "arquitectura-tobe.html", label: "Ver sección fuente: Arquitectura TO-BE" };
    }
    if (nodeId.startsWith("rag-tobe-arq-2")) {
      return { href: "decisiones-modulos.html", label: "Ver sección fuente: Decisiones por módulos" };
    }
    if (nodeId.startsWith("rag-tobe-arq-3")) {
      return { href: "cronograma-implementacion.html", label: "Ver sección fuente: Cronograma de implementación" };
    }
    return { href: "presentacion.html", label: "Ver sección fuente" };
  }

  const defaults = {
    rates: {
      arquitecto: 220000,
      desarrollador: 175000,
      qa: 120000,
      devops: 180000
    },
    hours: {
      arquitecto: 80,
      desarrollador: 260,
      qa: 100,
      devops: 60
    },
    services: {
      inputTokensM: 28,
      outputTokensM: 9,
      inputTokenPrice: 14500,
      outputTokenPrice: 58000,
      ocrDocsK: 3,
      ocrPriceK: 4500
    },
    infra: {
      appService: 2400000,
      dataStore: 950000,
      observabilidad: 500000,
      redSeguridad: 420000
    },
    contingencyPct: 12
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
    const roles = ["arquitecto", "desarrollador", "qa", "devops"];
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
    const ocrDocsK = readNumber(container.querySelector('[data-input="ocrDocsK"]'));
    const ocrPriceK = readNumber(container.querySelector('[data-input="ocrPriceK"]'));

    const inputCost = inputTokensM * inputTokenPrice;
    const outputCost = outputTokensM * outputTokenPrice;
    const ocrCost = ocrDocsK * ocrPriceK;
    const servicesSubtotal = inputCost + outputCost + ocrCost;

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
      ocrCost,
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
      mountTree(asisContainer, ragTrees.asis);
    }
    if (tobeContainer) {
      mountTree(tobeContainer, ragTrees.tobe);
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



