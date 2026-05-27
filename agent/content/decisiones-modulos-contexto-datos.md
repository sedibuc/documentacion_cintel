# Módulos de contexto y datos

## 1. Alcance

Esta página detalla los módulos que sostienen el perfil institucional persistente, la memoria organizacional y la recuperación de contexto para los agentes.

## 2. Fichas técnicas por módulo

### 2.1 OrganizationalContextStore

| Característica | Definición técnica |
|---|---|
| Propósito | Persistir identidad institucional, audiencias, tono, restricciones y configuración operativa por organización. |
| Entradas | Datos de onboarding, ediciones administrativas, metadatos de campañas. |
| Salidas | Contexto estructurado listo para consumo de agentes y validadores. |
| Modelo de datos | Relacional con campos JSON para extensibilidad controlada. |
| Claves | organization_id, tenant_id, version, updated_by, updated_at. |
| Riesgos técnicos | Deriva de esquema, inconsistencias por edición concurrente. |
| Controles | Versionado, validación de campos obligatorios y auditoría de cambios. |

### 2.2 BrandGuidelinesStore / BrandProfileService

| Característica | Definición técnica |
|---|---|
| Propósito | Gestionar reglas de marca, activos permitidos y restricciones de uso visual por canal. |
| Entradas | Manual de marca, activos subidos por cliente, reglas administrativas. |
| Salidas | Perfil de marca normalizado para CreativeAgent y ChannelFormatters. |
| Lectura documental | LLM multimodal como camino principal para extraer estructura semántica del manual. |
| Política OCR | Fuera de alcance en flujo objetivo del MVP para lectura de marca. |
| Riesgos técnicos | Ambigüedad de nomenclatura entre store y service, calidad heterogénea de PDFs. |
| Controles | Taxonomía canónica, validación humana de campos críticos y versionado de activos. |

### 2.3 OnboardingService

| Característica | Definición técnica |
|---|---|
| Propósito | Orquestar la construcción inicial del perfil institucional y su validación. |
| Entradas | URL institucional, manual de marca, histórico de campañas, datos de usuario. |
| Salidas | Perfil institucional persistente con estado de completitud y trazabilidad. |
| Reglas de negocio | Flujo por etapas, confirmación humana en cada etapa crítica. |
| Riesgos técnicos | Bloqueos por documentos incompletos o extracción parcial. |
| Controles | Guardado incremental, reintentos por etapa y recomendaciones guiadas. |

### 2.4 CompletenessScorer

| Característica | Definición técnica |
|---|---|
| Propósito | Medir la calidad/completitud del perfil institucional antes de habilitar generación. |
| Entradas | Campos del contexto, activos de marca, reglas por canal y restricciones. |
| Salidas | Puntaje de completitud, alertas de vacíos y recomendaciones de cierre. |
| Métrica base | Score de 0 a 100 con umbrales mínimo (operable), recomendado y óptimo. |
| Riesgos técnicos | Falsos positivos de completitud por campos nominales sin calidad real. |
| Controles | Reglas ponderadas y validaciones cualitativas por módulo. |

### 2.5 CampaignHistoryStore

| Característica | Definición técnica |
|---|---|
| Propósito | Conservar campañas, piezas, resultados y feedback como memoria organizacional. |
| Entradas | Cargas históricas, resultados de ejecución, feedback humano. |
| Salidas | Historial consultable por StrategicAgent y por analítica operativa. |
| Modelo | Relacional/documental con filtros por campaña, canal, fecha y objetivo. |
| Riesgos técnicos | Duplicidad de campañas, metadatos incompletos. |
| Controles | Claves de deduplicación, reglas de normalización y validación de columnas. |

### 2.6 ContextRetrievalService

| Característica | Definición técnica |
|---|---|
| Propósito | Construir el contexto final para inferencia combinando datos estructurados e históricos. |
| Entradas | Perfil institucional, histórico, restricciones por canal y objetivo de campaña. |
| Salidas | Context package trazable para StrategicAgent y CreativeAgent. |
| Estrategia MVP | Prioridad estructurada con recuperación documental solo para anexos extensos. |
| Riesgos técnicos | Contexto insuficiente o sobrecargado para prompts de agentes. |
| Controles | Políticas de selección por relevancia, límites de tokens y trazabilidad de fuentes. |

## 3. Contratos técnicos obligatorios

### 3.1 Contractos de entrada/salida

`ContextUpsertRequest`

```json
{
	"tenant_id": "cintel",
	"organization": {"name": "CINTEL"},
	"brand": {"tone": "institucional"}
}
```

`ContextPackage`

```json
{
	"tenant_id": "cintel",
	"context_version": 7,
	"brand_profile": {"tone": "institucional"},
	"history_refs": ["cmp_2025_andicom"]
}
```

### 3.2 API mínima

- `POST /api/context`
- `PUT /api/context/{tenant_id}`
- `GET /api/context/{tenant_id}/resolved`
- `POST /api/onboarding/start`
- `POST /api/history/metrics/import`

## 4. Modelo de datos consolidado

| Tabla/colección | PK | FK/índices clave | Propósito |
|---|---|---|---|
| organization_context | context_id | tenant_id idx, version idx | Perfil institucional vigente |
| brand_profile | brand_id | context_id fk | Marca y restricciones |
| audience_profile | audience_id | context_id fk | Segmentos y canales |
| campaign_history | campaign_id | tenant_id idx, date idx | Memoria de campañas |
| context_trace | trace_id | tenant_id idx, campaign_id idx | Auditoría de fuentes de contexto |

## 5. Diagrama técnico del dominio

![Arquitectura de contexto y datos](assets/img/diagramas/decisiones-modulos-contexto-datos-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-contexto-datos-arquitectura.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

## 6. Criterios de aceptación

- El `ContextPackage` siempre incluye versión y origen de datos.
- El historial se consulta solo dentro del tenant activo.
- La lectura de manual de marca en MVP usa LLM multimodal con validación humana.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Arquitectura TO-BE](to-be-arquitectura.html)
