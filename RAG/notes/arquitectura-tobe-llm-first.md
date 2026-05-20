# Arquitectura TO-BE — LLM-first: Evidencia y decisiones

**Fecha de generación:** 2026-05-17
**Proyecto:** Agente Documental CINTEL
**Autor:** Arquitecto de solución (asistido por Copilot Agent)

---

## 1. Resumen de arquitectura TO-BE propuesta

El sistema TO-BE es un **agente de extracción documental estructurada** que separa con claridad las capacidades resueltas con **programación tradicional** (backend, DB, RBAC, MultiTenant, auditoría) de las capacidades resueltas con **IA/LLM** (extracción semántica, validación contextual, Q&A).

La Fase 1 MVP usa exclusivamente **LLM como motor de extracción**. NER supervisado no es componente activo del MVP y se evalúa únicamente con evidencia real de producción.

---

## 2. Decisiones principales

| Decisión | Valor |
|---|---|
| Motor de extracción Fase 1 | LLM (zero-shot / few-shot) |
| NER supervisado | Fuera de Fase 1 — evaluación post-producción |
| Backend recomendado | FastAPI (o Flask actual) |
| Base de datos | PostgreSQL 15+ |
| Cola de tareas | Redis + Celery/RQ |
| Almacenamiento archivos | Filesystem MVP → MinIO/S3 evolución |
| LLM Provider | Configurable: OpenAI / Groq / Ollama |
| Observabilidad Fase 1 | Logging estructurado + métricas básicas |
| MultiTenant | Aislamiento lógico por `tenant_id` — 100% tradicional |
| Despliegue Fase 1 | Docker Compose (single node) |

---

## 3. Separación IA vs. sistema tradicional

### Sistema de información tradicional (no IA)
- Autenticación y sesión (JWT)
- Autorización RBAC con roles por tenant
- Gestión de tenants / MultiTenant
- Gestión de usuarios y roles
- Gestión de tipos documentales
- Administración de esquemas (Schema Registry)
- Gestión de documentos y lotes
- Revisión humana / Human-in-the-loop
- Auditoría y trazabilidad (AuditEvent inmutable)
- Observabilidad técnica
- APIs REST de integración

### Capacidades IA / LLM (Fase 1)
- Extracción estructurada de campos documentales
- Interpretación semántica del contenido
- Normalización de valores extraídos
- Validación semántica (LLM-as-validator)
- Resumen y explicación de resultados
- Q&A sobre documentos en lenguaje natural
- Gestión de prompts versionados (Prompt Registry)

### Fuera de alcance Fase 1
- NER supervisado como servicio de extracción
- Entrenamiento de modelos NER con corpus anotado
- Fine-tuning especializado
- Dataset etiquetado para NER
- Pipeline híbrido LLM + NER

---

## 4. Componentes propuestos

| Componente | Tipo | Tecnología |
|---|---|---|
| Frontend / UI | Tradicional | SPA HTML/JS |
| API Backend / BFF | Tradicional | FastAPI / Flask |
| Auth / RBAC | Tradicional | JWT + PostgreSQL |
| MultiTenant Service | Tradicional | Backend + `tenant_id` |
| Document Service | Tradicional | API + Storage |
| Batch Service | Tradicional | Redis + Celery/RQ |
| DocType & Schema Service | Tradicional | DB + JSON Schema |
| LLM Orchestrator | IA / LLM | Python nativo / LangChain |
| Prompt Registry | IA / LLM | DB relacional + versionado |
| Schema Registry | Tradicional | DB + JSON Schema |
| Structured Output Parser | IA / LLM | Pydantic / JSON mode |
| Validation Engine | Híbrido | Reglas + LLM asistido |
| Human Review Module | Tradicional | UI + workflow + DB |
| Audit Service | Tradicional | DB inmutable |
| Observability Service | Tradicional | logging + Prometheus |
| PostgreSQL | Tradicional | PostgreSQL 15+ |
| File Storage | Tradicional | Filesystem / MinIO S3 |
| LLM Provider | IA / LLM | OpenAI / Groq / Ollama |
| OCR Service | Tradicional | Tesseract / API externa |

---

## 5. Diagramas creados

| Vista | Nombre | Descripción |
|---|---|---|
| 1 | Vista negocio — capacidades | Mapa de capacidades tradicionales vs. IA vs. fuera de alcance |
| 2 | Mapa de componentes TO-BE | Componentes y relaciones del sistema completo |
| 3 | Flujo de carga y procesamiento | Flujo completo desde carga hasta resultado final |
| 4 | Flujo de extracción LLM | Secuencia detallada del pipeline LLM |
| 5 | Modelo de datos conceptual | Entidades principales y relaciones |
| 6 | Seguridad y MultiTenant | Aislamiento de tenants y RBAC |
| 7 | Despliegue lógico | Nodos de despliegue Fase 1 y evolución |
| 8 | Roadmap arquitectónico | Fases 1-4 con NER explícitamente fuera de Fase 1-2 |

---

## 6. Rutas de archivos PlantUML

```
assets/plantuml/tobe/01-vista-negocio-capacidades.puml
assets/plantuml/tobe/02-vista-componentes-tobe.puml
assets/plantuml/tobe/03-flujo-carga-procesamiento.puml
assets/plantuml/tobe/04-flujo-extraccion-llm.puml
assets/plantuml/tobe/05-vista-datos-conceptual.puml
assets/plantuml/tobe/06-vista-seguridad-multitenant.puml
assets/plantuml/tobe/07-vista-despliegue-logica.puml
assets/plantuml/tobe/08-roadmap-arquitectonico.puml
```

---

## 7. Rutas de archivos PNG

```
assets/img/diagramas/tobe/01-vista-negocio-capacidades.png
assets/img/diagramas/tobe/02-vista-componentes-tobe.png
assets/img/diagramas/tobe/03-flujo-carga-procesamiento.png
assets/img/diagramas/tobe/04-flujo-extraccion-llm.png
assets/img/diagramas/tobe/05-vista-datos-conceptual.png
assets/img/diagramas/tobe/06-vista-seguridad-multitenant.png
assets/img/diagramas/tobe/07-vista-despliegue-logica.png
assets/img/diagramas/tobe/08-roadmap-arquitectonico.png
```

---

## 8. Páginas y documentos actualizados o creados

| Archivo | Acción |
|---|---|
| `arquitectura-tobe.html` | Creado — nueva página TO-BE arquitectura |
| `content/arquitectura-tobe.md` | Creado — contenido completo con 8 vistas |
| `assets/partials/site-shell.html` | Actualizado — "Arquitectura TO-BE" agregado a nav TO-BE |
| `assets/js/app.js` | Actualizado — página `arquitecturatobe` registrada |
| `assets/css/styles.css` | Actualizado — estilos `.diagram-block`, `.diagram-links`, `.diagram-label` |

---

## 9. Resultado de validación PlantUML

- **8/8 diagramas** renderizados correctamente via PlantUML online server.
- Renderizador: `render_diagrams.py` (Python + urllib + zlib deflate encoding).
- Vista 8 requirió corrección de sintaxis (archivo tenía contenido duplicado tras `@enduml`).
- Todos los PNG generados con tamaños entre 51 KB y 171 KB.

---

## 10. Resultado de validación Chrome DevTools MCP

- **Página abre correctamente**: ✓ HTTP 200
- **Todos los PNG cargan**: ✓ 8/8 HTTP 200
- **Sin errores JavaScript**: ✓ console.errors = []
- **Sin recursos 404**: ✓ (solo favicon.ico que no existe en el proyecto)
- **Navegación funcional**: ✓ 10 links en nav (Inicio + 5 AS-IS + 4 TO-BE)
- **Diagramas visibles en viewport**: ✓ verificado con screenshots
- **Tabla de contenidos activa**: ✓ rastrea sección visible
- **Contraste adecuado**: ✓ texto oscuro sobre fondo claro

---

## 11. Riesgos y supuestos

- **Variabilidad LLM**: Los modelos LLM pueden cambiar comportamiento entre versiones. Mitigation: persistir versión del modelo en cada `ExtractionRun`.
- **Costo por token a escala**: A evaluar en Fase 1. Ollama disponible como alternativa on-premise.
- **Alucinación en campos críticos**: `null` obligatorio si el campo no se encuentra. Human Review para campos patrimoniales/legales.
- **Umbral de revisión humana**: Por calibrar según tipo documental. Inicialmente: completitud < 80% → revisión.
- **LLM Provider on-premise**: Ollama con Mistral 7B o LLaMA 3 8B es la opción validada conceptualmente.

---

## 12. Elementos fuera de alcance — Fase 1

- NER supervisado como servicio de extracción
- Entrenamiento de modelos NER
- Dataset etiquetado para NER
- Pipeline híbrido LLM + NER como arquitectura obligatoria
- Fine-tuning especializado
- SSO / OAuth corporativo
- Licenciamiento / facturación automática
- Kubernetes y orquestación avanzada
- Bases de datos físicamente separadas por tenant
- Prompts personalizados por tenant

---

## 13. Evoluciones futuras

- **Fase 2**: Observabilidad avanzada (OpenTelemetry), prompt CI/CD, métricas de calidad LLM.
- **Fase 3 (condicional)**: Evaluación NER supervisado solo con evidencia productiva real.
- **Fase 4**: Kubernetes, conectores avanzados, comparación semántica multi-documento.

La evaluación de NER en Fase 3 depende de identificar tipos documentales donde:
1. El LLM presenta brechas de precisión que prompting no resuelve.
2. El volumen y la repetitividad justifican el costo de anotación y entrenamiento.
3. El análisis costo/beneficio favorece NER frente a LLM mejorado.
