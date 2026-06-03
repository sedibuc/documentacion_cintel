# Mapa de módulos técnicos del sistema

> Esta sección desagrega la arquitectura TO-BE en fichas técnicas de módulos para facilitar diseño, implementación y trazabilidad funcional.

## 1. Propósito

Documentar características técnicas por módulo y su relación con el MVP y el roadmap V2/V3.

## 2. Agrupación de módulos

| Grupo | Objetivo técnico | Páginas de detalle |
|---|---|---|
| Contexto y datos | Persistencia institucional, memoria y recuperación de contexto | [Módulos de contexto y datos](decisiones-modulos-contexto-datos.html) |
| Agentes y canales | Planeación, producción y adaptación multicanal | [Módulos de agentes y canales](decisiones-modulos-agentes-canales.html) |
| Gobernanza y operación | Aprobación humana, entrega y trazabilidad operativa | [Módulos de gobernanza y operación](decisiones-modulos-gobernanza-operacion.html) |
| Seguridad y escalado | Aislamiento multi-organización y evolución empresarial | [Módulos de seguridad y escalado](decisiones-modulos-seguridad-escalado.html) |

## 3. Cobertura completa de módulos

| Módulo | Grupo | Estado objetivo |
|---|---|---|
| OrganizationalContextStore | Contexto y datos | MVP |
| BrandGuidelinesStore / BrandProfileService | Contexto y datos | MVP |
| OnboardingService | Contexto y datos | MVP |
| CompletenessScorer | Contexto y datos | MVP |
| CampaignHistoryStore | Contexto y datos | MVP |
| ContextRetrievalService | Contexto y datos | MVP con evolución |
| StrategicAgent | Agentes y canales | MVP |
| CreativeAgent | Agentes y canales | MVP |
| Agentes de canal (LinkedIn / Instagram / Email / WhatsApp) | Agentes y canales | MVP |
| CriticAgent | Agentes y canales | MVP |
| ImageCriticAgent | Agentes y canales | V1 (organizaciones sin restricciones regulatorias) |
| HumanValidationModule | Gobernanza y operación | MVP |
| Export/PublishingAdapter | Gobernanza y operación | V1-V2 |
| ObservabilityService (MLflow + Grafana + Ray) | Gobernanza y operación | MVP |
| **LLM Gateway** | **Seguridad y escalado** | **MVP — Requerido** |
| **BatchInferenceQueue** | Seguridad y escalado | V1 (activar según demanda) |
| TenantIsolationLayer | Seguridad y escalado | Sprint 0-MVP |

## 4. Decisiones transversales vigentes

- La lectura de manuales de marca usa LLM/VLM multimodal como camino principal en V1. OCR no forma parte del flujo objetivo de lectura de marca en MVP. (✅ P-00/P-01)
- **Salidas estructuradas obligatorias**: todos los agentes del sistema deben definir un schema explícito en el prompt. Ninguna salida de agente que alimenta otro paso es texto libre. (✅ Lineamiento transversal #2)
- **GuardRails explícitos**: blacklist/whitelist, tono ponderado, perspectiva narrativa y restricciones de marca son parte del diseño del prompt, no ajuste posterior. (✅ Lineamiento transversal #5)
- **Few-shots por tarea y canal**: corpus de ejemplos representativos mantenido como primera medida de mejora de calidad. (✅ Lineamiento transversal #4)
- **LLM Gateway requerido desde MVP**: toda llamada al proveedor LLM pasa por el gateway (rate-limit, retries, fallbacks, caché, batch routing). Ningún agente llama directamente al proveedor. (✅ Lineamiento transversal #10)
- La publicación se mantiene offline-first en V1 con exportación asistida.
- La validación humana sigue siendo obligatoria antes de salida final.
- Stack de observabilidad: **MLflow + Grafana + Ray**. (✅ Lineamiento transversal #8-9)

## 5. Definición arquitectónica transversal

### 5.1 Límites y responsabilidades por dominio

| Dominio | Responsable técnico | Responsabilidad principal | Artefacto de salida |
|---|---|---|---|
| Contexto y datos | Data/Backend | Persistencia de perfil, marca, histórico y recuperación contextual | ContextPackage versionado |
| Agentes y canales | AI/Backend | Planeación estratégica, generación creativa y formateo por canal | Plan, brief y piezas normalizadas |
| Gobernanza y operación | Backend/Producto | Aprobación humana, control de entrega y trazabilidad | Estado aprobado/rechazado y logs operativos |
| Seguridad y escalado | Backend/SecOps | Aislamiento por tenant, autorización y controles de auditoría | Evidencia de aislamiento y accesos |

### 5.2 Interfaces de integración entre dominios

- `ContextPackage` es el contrato obligatorio de entrada para StrategicAgent.
- `StrategicPlan` aprobado es el contrato de entrada para CreativeAgent.
- `CreativeOutput` validado es la entrada única de Export/PublishingAdapter.
- Todos los dominios emiten eventos a ObservabilityService con correlación por `tenant_id` y `campaign_id`.

### 5.3 Diagrama técnico de referencia

![Mapa técnico de módulos TO-BE](assets/img/diagramas/decisiones-modulos-mapa-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-mapa-arquitectura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

### 5.4 Criterios de aceptación de arquitectura

- Cada módulo tiene frontera explícita de entrada y salida (sin acoplamientos implícitos).
- Toda llamada entre dominios incluye contexto de tenant y trazabilidad.
- Ningún flujo de publicación omite validación humana en MVP.

---

Trazabilidad: [Arquitectura TO-BE](to-be-arquitectura.html) · [Preguntas para experto técnico](preguntas-experto-tecnico.html)

