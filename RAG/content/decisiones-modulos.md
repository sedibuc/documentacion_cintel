# Decisiones de diseño por módulos

## Mapa de módulos TO-BE

Los módulos lógicos del DIE corresponden a los componentes definidos en la arquitectura TO-BE:

- **MultiTenant Platform Core** — Tenant Management + Auth / RBAC Service
- **API Gateway + Document Service** — Entrada, autenticación, gestión y almacenamiento de documentos
- **DocumentSchemaRegistry + Prompt Registry** — Esquemas de tipos documentales y prompts versionados con guardrails y few-shots
- **Content Extraction Strategy + StructuredExtractor + LLM Gateway** — Selección de ruta de extracción (nativa / LLM multimodal / OCR fallback), extracción estructurada por LLM e infraestructura de inferencia (rate-limit, retries, fallbacks, cache)
- **CrossValidator + DiscrepancyAlertEngine** — Comparación cruzada contra CSV/Excel de referencia y generación de alertas BLOCKING / WARNING / INFO
- **Alert Dashboard + Human Review** — UI de revisión humana, resolución de alertas y flujo de aprobación
- **Audit Service + Observability Service** — Trazabilidad inmutable por tenant y métricas operativas (MLflow + Grafana + Ray)

## Decisiones estructurales vigentes
1. Separar extracción semántica (LLM) de validación determinística.
2. Versionar esquemas y prompts por tipo documental y tenant. Los prompts incluyen guardrails, few-shots y formatos para tablas e imágenes.
3. Mantener contratos de salida estructurada para evitar ambigüedad.
4. Modelar alertas como eventos trazables y auditables.
5. **LLM Gateway obligatorio desde MVP**: toda llamada al LLM pasa por el gateway (rate-limit por tenant, retries, fallbacks, load balancing, cache, batch routing).
6. **Batch inference**: el procesamiento de lotes usa cola Celery + LLM Gateway para controlar costo y latencia.

## Decisiones por dominio

### Contexto y datos
- El contexto de negocio por tenant se gestiona como configuración validada, no como memoria conversacional libre.
- Los catálogos de referencia se actualizan por ciclo controlado y con versionado.

### IA y extracción
- El LLM se usa para estructurar información compleja de documento. Los LLMs/VLMs realizan las tareas del OCR directamente.
- La salida debe cumplir esquema JSON estricto antes de persistencia.
- Los prompts incluyen **guardrails explícitos**, **ejemplos few-shot** y formatos estructurados (Markdown para tablas, descripción para imágenes).
- Los `logprobs` del modelo se registran como señal de confianza en tiempo de ejecución. Campos por debajo del umbral se marcan `LOW_CONFIDENCE`.
- El **Critic-Evaluator Agent** (agente evaluador-crítico) **es obligatorio en los flujos de mayor riesgo de calidad** (extracción de campos críticos como montos, fechas, partes en documentos notariales y pólizas HSE). En flujos de menor criticidad, puede activarse condicionalmente. El patrón debe diseñarse desde V1 en los flujos de alto riesgo — no diferible. El número de iteraciones del ciclo es una **variable de control de costo** a monitorear con MLflow.
- **Modelos candidatos para el piloto (recomendados por experto):** Gemini, OpenAI (GPT-4o), DeepSeek-OCR, Gemma4, PaliGemma. **No recomendado:** Claude (débil en multimodal).
- **Criterios de evaluación de modelos:** precisión (F1-score, recall, precisión, matriz de confusión), tooling, capacidad multimodal, latencia y costo.
- **Experimento mínimo:** 100 documentos de diferentes tipos (escaneados, digitales, documentos de producción), evaluación ciega con varios modelos, revisión humana.

> **Validación experta (2026-06-02 — Bloque 2-3):** El experto confirma que el orden LLM-first es correcto y que NER supervisado como mejora post-producción es razonable. La principal limitación técnica de los LLMs es la alucinación, que se controla con guardrails, few-shots y outputs estructurados.

### Gobernanza y operación
- Todo procesamiento deja rastro de auditoría con correlación de evento, incluyendo `logprobs_min` y `low_confidence_fields`.
- Las discrepancias se priorizan por criticidad operativa y contractual.
- El stack de observabilidad recomendado por el experto es **MLflow** (experimentación y A/B testing) + **Grafana** (dashboards) + **Ray** (monitoreo LLM en escala).

### Seguridad y escalado
- El aislamiento multi-tenant es obligatorio desde el MVP.
- La estrategia de escalado prioriza colas de procesamiento y control de concurrencia.
- **El LLM Gateway es la pieza crítica de escalabilidad**: gestiona rate-limiting por tenant (tokens/requests por minuto), previniendo el riesgo más subestimado en proyectos LLM multi-tenant.
- **Privacidad de datos**: antes de usar un proveedor LLM cloud, revisar políticas de privacidad, límites de TPM/RPM y opciones de batch prediction. DPA contractual obligatorio para cloud.

## Contratos mínimos sugeridos
- Documento de entrada normalizado.
- Resultado de extracción por campo con evidencia.
- Resultado de validación cruzada con regla aplicada.
- Evento de alerta con severidad, estado y responsable.

## Riesgos abiertos
- Variabilidad de calidad de OCR según tipo documental — **Mitigado (experto):** el LLM/VLM es el extractor; OCR solo como fallback condicionado.
- **Escalabilidad por tokens/requests por minuto** — **Riesgo crítico (experto):** el LLM Gateway es el mitigador principal desde el MVP.
- Dependencia de proveedores de IA para latencia/costo — **Mitigación validada (experto):** evaluar con MLflow usando Gemini, OpenAI, DeepSeek-OCR, Gemma4 con documentos reales antes de seleccionar proveedor.
- Alucinaciones en campos críticos — **Control activo:** guardrails, few-shots, output estructurado, logprobs, critic-evaluator.
- Necesidad de calibración continua de reglas de validación.
