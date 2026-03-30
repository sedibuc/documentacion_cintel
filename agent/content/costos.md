# Inventario de Servicios de IA y Variables de Costo

**Versión:** 1.1  
**Fecha:** Marzo 2026  
**Base:** Código fuente real y auditoría de coherencia.

> Los precios son referenciales. El objetivo de este documento es alinear dependencias y vectores de costo con la implementación real, no fijar tarifas comerciales definitivas.

---

## 1. Servicios de IA — Resumen

| # | Servicio | Tipo | Proveedor | Activación real | Configuración |
|---|---|---|---|---|---|
| 1 | LLM de texto principal | Cloud | OpenAI | Flujo principal del agente | `OPENAI_API_KEY`, `model_name=gpt-*` |
| 2 | LLM de texto alternativo | Cloud | Google Generative AI | Solo si se usa `gemini-*` | `GOOGLE_API_KEY` |
| 3 | Generación de imágenes DALL-E 3 | Cloud | OpenAI | Default | `IMAGE_MODEL=dall-e-3` |
| 4 | Generación de imágenes `gpt-image-1` | Cloud | OpenAI | Configurable | `IMAGE_MODEL=gpt-image-1` |
| 5 | Transcripción de voz | Cloud | OpenAI o Google | Solo por ruta de voz | `ASR_MODEL` |
| 6 | OCR / visión multimodal | Cloud | OpenAI | Según OCR de campañas | `OCR_MODEL_NAME` |
| 7 | Meta Graph API | REST | Meta | Integración Instagram | tokens en BD |
| 8 | Microsoft Graph API | REST | Microsoft | Envío de correo al finalizar campaña | credenciales Azure AD |

---

## 2. Detalle por Servicio

### 2.1 LLM de Texto — OpenAI

**Modelos confirmados en código:**

| Modelo | Uso |
|---|---|
| `gpt-4.1` | Modelo default del agente |
| `gpt-4o` | OCR multimodal |
| `gpt-image-1` | Imágenes |

**Operaciones de costo recurrente:**

- introducción,
- clasificación de respuestas,
- filtrado por tema,
- preguntas dinámicas,
- resumen,
- generación de campaña,
- plan de ejecución,
- prompts de imagen.

**Variables de costo principales:**

| Variable | Impacto |
|---|---|
| `MAX_DYNAMIC_QUESTIONS=10` | Aumenta el número de llamadas al LLM |
| `FILTER_BY_TOPIC_MAX_ROWS=40` | Aumenta o reduce el contexto enviado al filtro |
| volumen de campañas históricas | Puede inflar prompts por falta de RAG |
| tamaño del scraping | Aumenta el contexto para clasificación y campaña |
| `selected_model` / `model_name` | Cambia costo unitario por token |

### 2.2 Google Generative AI

Participa solo cuando se selecciona un modelo `gemini-*` para texto o voz. En la implementación actual es una dependencia opcional, no parte obligatoria del flujo principal.

### 2.3 Generación de Imágenes — OpenAI

| Modo | Configuración real |
|---|---|
| Default | `dall-e-3`, `quality=standard`, `1024x1024` |
| Alternativo | `gpt-image-1`, `quality=high`, fallback a DALL-E 3 |
| Paralelismo | `ThreadPoolExecutor` |
| Límite | `MAX_IMAGE_GENERATED=8` |

El costo de imágenes es uno de los componentes más altos y más predecibles por sesión.

### 2.4 ASR — Transcripción de voz

La implementación soporta OpenAI y Gemini. Sin embargo, el valor por defecto previo de `ASR_MODEL` era inconsistente con ASR. Para cualquier estimación de costo seria, debe asumirse que se configurará un modelo de transcripción válido, por ejemplo `whisper-1` o un `gemini-*` soportado.

### 2.5 OCR / visión multimodal

- El OCR usa `OCR_MODEL_NAME`.
- El OCR sobre video está desactivado por defecto.
- Su costo depende de si se procesan campañas de Instagram con medios complejos.

### 2.6 Meta Graph API

- No representa costo directo por uso en el código.
- Sí introduce restricciones operativas: expiración de tokens, límites de rate y necesidad de bootstrap manual.

### 2.7 Microsoft Graph API

- Se usa al final del flujo para enviar correo.
- El costo no se modela como consumo unitario del código; depende del tenant/licencia de Microsoft 365 del cliente.

---

## 3. Infraestructura de Soporte

| Servicio | Tipo | Impacto de costo |
|---|---|---|
| PostgreSQL 16 | Infraestructura | Persistencia y snapshots |
| Nginx | Infraestructura | Proxy y entrega HTTP/SSE |
| Docker / Docker Compose | Infraestructura | Empaquetado y operación |
| ngrok | Infraestructura opcional | Exposición pública temporal |

---

## 4. Estimación de Costo por Sesión

Una sesión completa puede incluir:

- múltiples llamadas LLM de texto,
- generación de hasta 8 imágenes,
- OCR opcional,
- transcripción opcional,
- APIs auxiliares sin costo directo unitario modelado (Meta y Microsoft Graph).

### Escenario de referencia

Usuario con sitio web, histórico cargado, preguntas dinámicas y generación de imágenes.

| Componente | Tendencia de costo |
|---|---|
| LLM de texto | Medio a alto, según tamaño del contexto y número de preguntas |
| Imágenes | Alto y más predecible |
| ASR | Bajo, si se usa voz de forma acotada |
| OCR | Variable; depende de cantidad de medios |
| Meta Graph API | Sin costo directo modelado, con restricciones operativas |
| Microsoft Graph API | Sin costo unitario modelado en código |

**Conclusión operativa:** la mayor sensibilidad económica está en el LLM de texto y en la cantidad de imágenes generadas.

---

## 5. Variables de Control de Costos

| Variable | Efecto | Valor actual documentado |
|---|---|---|
| `MAX_DYNAMIC_QUESTIONS` | Controla preguntas y llamadas al LLM | `10` |
| `FILTER_BY_TOPIC_MAX_ROWS` | Controla tamaño del filtrado contextual | `40` |
| `MAX_IMAGE_GENERATED` | Límite de imágenes generadas | `8` |
| `CAMPAIGN_VIDEO_OCR_ENABLED` | Activa o desactiva OCR costoso sobre video | `false` |
| `OCR_MODEL_NAME` | Afecta costo del OCR | `gpt-4o` |
| `IMAGE_MODEL` | Define costo por imagen | `dall-e-3` default |
| `ASR_MODEL` | Define costo y viabilidad de voz | Debe configurarse con un modelo ASR válido |

---

## 6. Riesgos de Costo

| Riesgo | Descripción | Mitigación |
|---|---|---|
| RC1 | Campañas históricas grandes elevan el contexto del LLM | Introducir RAG o límites más estrictos |
| RC2 | Sin rate limiting, existe riesgo de abuso de rutas IA | Implementar throttling |
| RC3 | `_estimate_tokens()` es heurística | Capturar `usage` real de APIs cuando esté disponible |
| RC4 | El usuario puede seleccionar modelos más costosos | Validar modelos permitidos en backend |
| RC5 | Generar muchas imágenes eleva el costo por sesión | Reducir `MAX_IMAGE_GENERATED` según plan |
| RC6 | Configuración ASR incorrecta distorsiona costos y operatividad | Corregir `ASR_MODEL` antes de producción |

---

## 7. Observaciones de Alineación

- OpenAI es la dependencia IA principal: texto, imágenes y OCR; la voz también puede recaer allí si se corrige `ASR_MODEL`.
- Google es opcional y depende de selección explícita de modelos `gemini-*`.
- Meta Graph API y Microsoft Graph API son dependencias reales del flujo, pero su costo no se modela como cobro unitario desde el código.
- La infraestructura de soporte también debe contemplarse en cualquier estimación comercial, especialmente PostgreSQL, contenedores y exposición pública.
