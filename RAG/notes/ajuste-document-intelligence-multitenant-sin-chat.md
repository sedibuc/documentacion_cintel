# Ajuste de posicionamiento: Document Intelligence Engine MultiTenant

**Fecha:** 2026-05  
**Alcance:** Reposicionamiento completo del producto CINTEL RAG

---

## Decisión de reposicionamiento

El sistema **deja de ser** un RAG conversacional o sistema de Q&A documental y **pasa a ser** un **Document Intelligence Engine MultiTenant (DIE)**, orientado a:

1. Convertir documentos tipados en datos estructurados (StructuredExtractor + LLM)
2. Validar esos datos contra fuentes de referencia (CrossValidator — determinístico, sin IA)
3. Generar alertas de discrepancia clasificadas por severidad BLOCKING / WARNING / INFO (DiscrepancyAlertEngine)
4. Operar bajo un modelo multi-cliente (MultiTenant) controlado por CINTEL

**Chat, RAG conversacional, Q&A documental, Vector DB, embeddings y fine-tuning están FUERA del alcance.**

---

## Componentes del MVP (esenciales)

| Componente | Rol | IA? |
|---|---|---|
| MultiTenant Platform Core | Gestión de tenants, usuarios, tipos documentales, RLS | No |
| StructuredExtractor | Extracción de campos con LLM + Prompt Registry | Sí (LLM) |
| CrossValidator | Comparación campo a campo contra ReferenceDataset | No (determinístico) |
| DiscrepancyAlertEngine | Clasificación de alertas BLOCKING/WARNING/INFO | No |
| Alert Dashboard | Gestión y resolución de alertas por tenant | No |
| Audit Log | Trazabilidad de todas las extracciones y decisiones | No |

### Fuera del alcance MVP
- Chat / RAG conversacional
- Q&A documental
- Vector Database (Chroma, Weaviate, etc.)
- Servidor de embeddings
- Fine-tuning de modelos
- NER supervisado (se evalúa en producción, post-MVP)
- Integración directa Google/Microsoft (Fase 2)

---

## Principio de separación IA vs. sistema tradicional

| Subsistema | Tecnología | Categoría |
|---|---|---|
| StructuredExtractor | LLM (GPT-4, Claude, Gemini) | IA |
| Prompt Registry | Base de datos + versionado | Tradicional |
| CrossValidator | Comparación normalizada | Tradicional |
| DiscrepancyAlertEngine | Lógica de negocio, reglas | Tradicional |
| MultiTenant RLS | PostgreSQL Row Level Security | Tradicional |
| Celery + Redis | Cola de procesamiento async | Tradicional |

---

## MultiTenant — por qué es esencial MVP (no opcional)

El modelo de negocio de CINTEL requiere que desde el primer despliegue se puedan incorporar múltiples empresas clientes (tenants) de forma aislada. Sin MultiTenant, la plataforma solo puede servir a un cliente, lo que invalida la propuesta de valor. Por eso MultiTenant Platform Core es **esencial MVP**, no una característica futura.

Cada tenant tiene:
- Tenant ID único
- Tipos documentales propios
- Schemas de extracción propios
- ReferenceDatasets propios
- Usuarios con roles propios
- Objetos de almacenamiento aislados (`tenant_id/` prefix)
- Datos aislados por PostgreSQL RLS

CINTEL opera como **super-admin** con visibilidad transversal.

---

## Cambios realizados en el micrositio

### Diagramas nuevos (PlantUML → PNG)
- **Fuente:** `assets/plantuml/document-intelligence/*.puml` (8 archivos)
- **Imágenes:** `assets/img/diagramas/document-intelligence/*.png` (8 PNGs, 99–193 KB)
- Renderizados con PlantUML online server

| Archivo | Descripción |
|---|---|
| `01-vista-negocio-capacidades.puml` | Mapa de capacidades del DIE |
| `02-mapa-componentes-tobe.puml` | Componentes con Chat/RAG en fuera-de-alcance |
| `03-flujo-procesamiento-documentos.puml` | Swimlane (4 carriles): Cliente, API, IA, Validación |
| `04-flujo-extraccion-llm.puml` | Secuencia: StructuredExtractor + Prompt Registry |
| `05-vista-datos-conceptual.puml` | Modelo de datos completo (15 entidades) |
| `06-vista-seguridad-multitenant.puml` | Aislamiento entre tenants y CINTEL admin |
| `07-vista-despliegue-mvp.puml` | Contenedores Docker del MVP (sin Vector DB) |
| `08-roadmap-arquitectonico.puml` | Roadmap de 5 fases (NER en Fase 4, condicional) |

### Páginas de contenido modificadas
| Archivo | Cambio |
|---|---|
| `content/inicio.md` | Reescrito completo — nuevo posicionamiento DIE MultiTenant |
| `content/to-be-funcional.md` | Reescrito estratégico — componentes DIE, CrossValidator, DiscrepancyAlertEngine |
| `content/preguntas-experto.md` | Reescrito completo — 18 preguntas para validación DIE |
| `content/arquitectura-tobe.md` | Actualizado — apunta a `document-intelligence/`, matriz de capacidades DIE |
| `content/brechas.md` | Prepended — brecha RAG demostrador vs DIE, tabla comparativa |
| `content/costos.md` | Appended — variables de costo DIE TO-BE, eliminados del AS-IS |
| `content/no-es-rag.md` | Actualizado — comparación 3 columnas RAG vs Q&A vs DIE |

### Shell y navegación
| Archivo | Cambio |
|---|---|
| `assets/partials/site-shell.html` | Branding: "Document Intelligence Engine", copia "MultiTenant · Extracción estructurada · Alertas de discrepancia" |
| `assets/js/app.js` | Títulos actualizados para 4 páginas TO-BE |

### Prototipo interactivo
| Elemento | Cambio |
|---|---|
| `mockup-to-be.html` — título HTML | "Mockup TO-BE — Document Intelligence Engine MultiTenant" |
| Sidebar logo | eyebrow="Document Intelligence Engine", h2="DIE · MultiTenant" |
| Tenant selector | Nuevo selector con 4 opciones (CINTEL admin + 3 tenants) |
| Nav section nueva | "Validación y Alertas" con CrossValidator y Alertas de discrepancia |
| Dashboard | 6 stat cards (agrega BLOCKING y WARNING alert counts), tabla con CrossVal+Alertas cols |
| Pantalla nueva | `screen-crossvalidator`: selector de dataset, lote, normalización; resultados MATCH/MISMATCH/PENDIENTE |
| Pantalla nueva | `screen-alertas`: cards de severidad, tabla con BLOCKING/WARNING/INFO pills, formulario de resolución |
| JSON resultado | Agrega `estado_validacion_cruzada` y `alertas_generadas` al JSON de salida |

---

## Validación Chrome DevTools (post-implementación)

| Verificación | Resultado |
|---|---|
| `index.html` — branding DIE | ✅ Carga correctamente |
| `arquitectura-tobe.html` — título y badges | ✅ "Document Intelligence Engine MultiTenant" |
| 8 imágenes `document-intelligence/*.png` | ✅ Todas 200 OK, dimensiones correctas |
| `mockup-to-be.html` — dashboard 6 cards | ✅ BLOCKING (3, rojo) y WARNING (8, ámbar) visibles |
| Pantalla CrossValidator | ✅ Selector dataset/lote, stats 74%/18%/8%, tabla campos |
| Pantalla Alertas de discrepancia | ✅ Cards severidad, tabla con pills, formulario resolución |
| Errores JS en consola | ✅ Ninguno |
| 404 en recursos clave | ✅ Ninguno |

---

## Riesgos identificados

1. **CrossValidator depende de normalización de texto**: Comparaciones entre "Hipo. Davivienda" vs "Hipo. Colombia" pueden requerir diccionarios de equivalencia. La normalización básica (trim+lowercase) puede no ser suficiente.
2. **DiscrepancyAlertEngine — reglas de severidad**: La clasificación BLOCKING/WARNING/INFO requiere configuración por tipo documental + campo. Necesita sesión de diseño con experto.
3. **LLM hallucination en extracción**: El CrossValidator puede detectar hallucinations si la referencia está disponible, pero no todos los campos tienen referencia. Requiere estrategia de confianza por campo.
4. **MultiTenant onboarding**: El proceso de alta de un nuevo tenant (configuración de tipos documentales, schemas, prompt versioning) requiere UI de administración. Incluido en MVP.
5. **NER post-producción**: La evaluación de NER se pospone intencionalmente. Si los resultados de LLM son insuficientes en producción, NER podría activarse en Fase 4 (condicional, según métricas).

---

## Diagramas anteriores (preservados, no eliminados)

Los diagramas de la sesión anterior permanecen intactos:
- `assets/plantuml/tobe/*.puml` — 8 archivos PUML anteriores
- `assets/img/diagramas/tobe/*.png` — 8 PNGs anteriores

Ya no son referenciados desde `arquitectura-tobe.md` (ahora apunta a `document-intelligence/`), pero se conservan como respaldo histórico.
