# TO-BE — Servicios y costos proyectados

**Versión:** 1.1  
**Fecha de corte:** 2026-06-02  
**Alcance:** Segunda entrega contractual (enfoque TO-BE)

> Esta sección define el análisis de servicios y costos para la necesidad objetivo TO-BE. No usa costos AS-IS como base de cumplimiento de segunda entrega.

> **Nota — Cuantificación pendiente de medición real:** La cuantificación final de tokens, latencia y costos unitarios queda condicionada a medición real durante el piloto. Los proveedores candidatos y la metodología de selección han sido validados por el experto técnico (junio 2026). Los valores de referencia se incorporarán una vez completadas las pruebas con datos reales del cliente piloto.

---

## 1. Servicios de IA — Resumen TO-BE

| # | Servicio TO-BE | Tipo | Proveedor previsto | Estado de definición | Validación experta |
|---|---|---|---|---|---|
| 1 | LLM/VLM estratégico y de generación textual | Cloud / On-premise | Gemini / OpenAI (GPT-4o) / Gemma4 — selección por experimento con MLflow. **No recomendado: Claude** (multimodal débil) | Definido — candidatos validados | ✅ Validado (P-09 — junio 2026) |
| 2 | Orquestación de prompts y contexto persistente (ADK) | Plataforma | ADK (Agent Development Kit) + proveedor LLM | Definido en TO-BE | ✅ Validado (P-08) |
| 3 | **LLM Gateway** | Infraestructura LLM | LiteLLM / Kong AI Gateway / custom | **Definido — Requerido para multi-tenant** | ✅ Validado (lineamiento transversal #10) |
| 4 | **Batch inference** | Procesamiento | Cola de tareas + LLM Gateway | Definido | ✅ Validado (lineamiento transversal #11) |
| 5 | Adaptación por canal (texto/variantes) — agentes especializados | Cloud + lógica interna ADK | Mismo proveedor LLM base; agentes por canal con skills ADK | Definido en TO-BE | ✅ Validado (P-05) |
| 6 | LLM/VLM multimodal — lectura de manuales de marca | Cloud / On-premise | Gemini / OpenAI (GPT-4o) / PaliGemma / Gemma4 — LLM/VLM como ruta principal. **OCR no en V1** | Validado como ruta principal | ✅ Validado (P-00 / P-01) |
| 7 | Generación de imagen (opcional controlada) | Cloud | Proveedor de imagen generativa + patrón crítico-evaluador | Condicional por gobernanza institucional | ✅ Validado (P-04) |
| 8 | Integración canales (Meta/Microsoft) | API externa | Meta / Microsoft | Definido en arquitectura | —|

---

## 2. Detalle por servicio TO-BE

### 2.1 LLM/VLM principal y orquestación ADK

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Modelo principal de texto | Evaluar con MLflow: Gemini, OpenAI (GPT-4o), Gemma4 — **No Claude** | La selección final requiere experimentos con datos reales del cliente piloto |
| Modelo para lectura de marca (multimodal) | Gemini / OpenAI (GPT-4o) / PaliGemma / Gemma4 — LLM/VLM directo | OCR no es parte del flujo objetivo en V1 (validado por experto P-00/P-01) |
| Tokens promedio por ejecución | [Pendiente — medir en piloto] | Registrar `tokens_entrada`, `tokens_salida` y `tokens_thinking` por operación |
| Número de iteraciones por flujo (patrón crítico-evaluador) | Máximo configurable | Variable de control de costo; monitorear con MLflow |
| Salidas estructuradas (structured output) | Siempre activo | Reduce alucinaciones y facilita validación automática; el schema es parte del diseño del prompt |

### 2.2 LLM Gateway

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Tecnología base | LiteLLM / Kong AI Gateway / custom | Requerido para rate-limiting por tenant, retries, fallbacks, cache y batch routing |
| Fallbacks automáticos entre proveedores | Activo por configuración | Protege contra cortes o degradación de un proveedor |
| Caché de respuestas | Activo para consultas repetidas | Reduce costo en generaciones frecuentes similares |
| Control de cuota por tenant | Activo desde MVP | Evita que un tenant consuma el límite de toda la plataforma |

### 2.3 Batch inference

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Casos de uso principales | Generación masiva de variantes por canal; múltiples organizaciones en simultáneo | Enruta solicitudes de baja urgencia por cola asíncrona para optimizar costo |
| Cola de tareas | Celery / equivalente + LLM Gateway | Controla concurrencia y prioridad |
| Ahorro estimado vs. online | [Pendiente — medir en piloto] | Batch inference suele reducir costo por token en proveedores cloud |

### 2.4 Adaptación por canal — agentes especializados

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Canales activos en MVP | LinkedIn, Instagram, Email, WhatsApp | Ejecutan en paralelo para minimizar latencia total |
| Variantes por pieza y canal | Configurable | Impacta número total de llamadas IA |
| Skills ADK por agente | Activos desde V1 | Mejoran plan, razonamiento y actuación sin aumentar instrucciones del prompt |
| Reintentos por validación | Máximo configurable | Gobernanza define costo operativo adicional |

### 2.5 LLM/VLM multimodal — lectura de manuales de marca

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Activación | Flujo de onboarding y actualización de contexto | LLM/VLM directo — cero-shot o few-shot, sin OCR como paso previo en V1 |
| Calidad esperada en documentos estándar | ≥80% (cobertura validada por experto P-01) | PDFs nativos, DOCX, imágenes; documentos borrosos o escaneados tolerados |
| Validación humana de campos críticos | Obligatoria en MVP | Control de calidad sobre los 5 atributos de alta señal extraídos |

### 2.6 Generación de imagen (opcional controlada)

| Variable de costo | Valor base (corte actual) | Observación |
|---|---|---|
| Activación | Condicional — organizaciones sin restricciones regulatorias | No es el flujo principal para instituciones con restricciones (ej. CRC) |
| Patrón de control | Crítico-evaluador: agente generador + agente evaluador | Evalúa adherencia a lineamientos de marca antes de presentar al comunicador |
| Límite de activos por sesión | [Por definir] | Variable de control de costo |

---

## 3. Infraestructura de soporte TO-BE

| Servicio | Tipo | Impacto de costo | Valor base | Validado experto |
|---|---|---|---|---|
| Base de datos transaccional y de contexto (multi-tenant) | Infraestructura | Medio | PostgreSQL con `tenant_id` transversal | ✅ Validado (P-08) |
| ADK + orquestación de agentes | Infraestructura / Plataforma IA | Medio-Alto | ADK framework + runtime contenedorizado | ✅ Validado (P-08) |
| **LLM Gateway** | **Infraestructura LLM** | **Medio** | LiteLLM / Kong AI Gateway / custom | ✅ **Requerido — lineamiento transversal #10** |
| Observabilidad y auditoría | Infraestructura | Medio | **MLflow + Grafana + Ray** (stack validado por experto) | ✅ Validado (P-07 + lineamiento transversal #8-9) |
| Cola de tareas para batch inference | Infraestructura | Bajo-Medio | Celery / equivalente + LLM Gateway | ✅ Validado (lineamiento transversal #11) |
| Almacenamiento de activos/documentos/artefactos ADK | Infraestructura | Medio | Almacenamiento cloud + ADK Artifacts | — |

---

## 4. Estimación de costo por sesión TO-BE (estructura)

| Componente | Tendencia de costo esperada | Métrica base |
|---|---|---|
| LLM/VLM de lectura de marca (onboarding) | Medio | Tokens por documento + resultado estructurado |
| LLM de texto y estrategia (StrategicAgent) | Medio-Alto | Tokens input/output + tokens thinking |
| Patrón crítico-evaluador (CriticAgent) | Variable | Score por iteración + número de iteraciones del ciclo |
| Adaptación de piezas por canal — agentes paralelos | Medio | Tokens por canal × número de canales activos |
| LLM Gateway (overhead de infraestructura) | Bajo | Latencia agregada por retry/cache |
| Batch inference (variantes masivas) | Reducido vs. online | Costo por token en modo batch |
| VLM/generación de imagen IA (si aplica) | Variable-Alto | Tokens visuales + score crítico-evaluador |
| Integraciones externas (Meta/Microsoft) | Medio | Llamadas por canal por publicación |

---

## 5. Variables de control de costos (a formalizar)

| Variable | Efecto esperado | Estado |
|---|---|---|
| Máximo de iteraciones del ciclo crítico-evaluador | Limita costo de inferencia del patrón por flujo | Configurable por organización |
| Máximo de variantes por canal | Limita costo de generación paralela | Configurable por campaña |
| Activación de LLM/VLM multimodal para marca | Solo durante onboarding y actualizaciones de contexto; OCR no aplica en V1 | Controlado por flujo |
| Activación de imagen IA | Solo para organizaciones sin restricciones regulatorias; patrón crítico-evaluador obligatorio | Flags de gobernanza por organización |
| Umbral de aprobación humana | Control de reprocesos | HumanValidationModule |
| Caché LLM Gateway | Reduce reinferencias de solicitudes repetidas similares | Activado desde MVP |
| Selección de modelo por experimento (MLflow) | Seleccionar el proveedor que minimice costo/latencia para el caso de uso real | Antes del piloto |
| Enrutamiento batch vs. online | Solicitudes de baja urgencia van a batch para reducir costo | Configurable por tipo de campaña |

---

## 6. Riesgos de costo TO-BE

| Riesgo | Descripción | Mitigación propuesta | Estado |
|---|---|---|---|
| **RC-TOBE-00** | **Escalabilidad por tokens/requests por minuto en escenarios multi-tenant** | **LLM Gateway obligatorio: rate-limit por tenant, retries, cache, batch routing** | **Validado por experto — Crítico** |
| RC-TOBE-01 | Crecimiento de tokens por exceso de iteraciones del ciclo crítico-evaluador | Definir topes por flujo; monitorear con MLflow número de iteraciones | Configurable |
| RC-TOBE-02 | Sobrecosto por generación masiva de variantes de campaña | Política de límites por canal; enrutar generaciones masivas a batch inference | Configurable |
| RC-TOBE-03 | Activación no controlada de imagen IA u otros servicios opcionales | Flags de gobernanza por organización + patrón crítico-evaluador obligatorio | Controlado |
| RC-TOBE-04 | Selección de modelo sin evidencia experimental | Usar MLflow con datos reales del cliente piloto antes de seleccionar proveedor MVP | Proceso definido |

---

## 7. Criterio experto para evaluación y selección de proveedor LLM

> **Validación experta (2026-06-02 — P-09):** El experto recomienda no seleccionar proveedor por preferencia única sino mediante **experimentos controlados** con las siguientes variables:
>
> - Múltiples prompts para cada tarea concreta del sistema (lectura de marca, generación estratégica, producción creativa por canal)
> - Múltiples modelos candidatos: **Gemini, OpenAI (GPT-4o), Gemma4**. Para tareas multimodales: también **PaliGemma**. **No recomendado: Claude** (débil en multimodal — confirmado por experto)
> - Documentos de marca y campañas reales de al menos un cliente piloto
> - Evaluación usando MLflow o Vertex AI Evaluation; experimentos medidos, no decisión por preferencia
> - Descartar candidato temprano si la calidad de salida no alcanza el umbral esperado
>
> **Herramientas recomendadas por el experto:**
> - **MLflow**: experimentos, A/B testing, monitoreo y observabilidad en tiempo real
> - **Grafana**: dashboards operativos y alertas en producción
> - **Ray**: observabilidad distribuida en inferencia a escala
> - **Vertex AI Evaluation**: alternativa cloud-native si el stack es en GCP

**Criterios de evaluación para el Adaptador de Contenido Institucional (orden de prioridad según experto):**

| Criterio | Peso | Nota |
|---|---|---|
| Calidad de salida en la tarea específica (español institucional colombiano) | Alto | Criterio #1 del experto |
| Latencia por solicitud | Alto | Criterio #2 del experto |
| Costo por token (input + output + thinking) | Alto | Criterio #3 del experto |
| Capacidad multimodal (lectura de manuales de marca PDF/imágenes) | Alto | Requisito para BrandGuidelinesStore |
| Structured output / JSON mode nativo | Alto | Requerido para salidas accionables de agentes |
| Tooling disponible (MLflow, gateway, ADK) | Medio | Integración operativa |
| Soberanía de datos / DPA disponible | Medio-Alto | Crítico para tenants con información institucional sensible |
| Disponibilidad on-premise | Medio | Gemma4 / PaliGemma para soberanía total |

---

## 8. Observaciones para cumplimiento de segunda entrega

1. Esta sección constituye la base de servicios y costos TO-BE del proyecto Agent para segunda entrega.
2. Los proveedores candidatos y la metodología de selección han sido validados por el experto técnico (junio 2026).
3. La cuantificación de tokens y costos unitarios queda condicionada a medición real con datos del cliente piloto.
4. El documento debe versionarse por fecha de corte y dejar trazabilidad de cambios.
