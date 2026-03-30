# Brechas y Oportunidades — Agente de Marketing IA

**Versión:** 1.1  
**Fecha:** Marzo 2026  
**Metodología:** Análisis de código fuente y contraste con la auditoría de coherencia documental.

---

## Resumen Ejecutivo

Las brechas más relevantes se concentran en persistencia del estado del grafo, seguridad operacional, robustez de configuración, coherencia de infraestructura SSE y deuda técnica entre componentes activos y legacy. El sistema funciona como MVP, pero varias restricciones deben quedar explícitas para una entrega de consultoría técnicamente precisa.

---

## 1. Persistencia del Estado del Grafo

### Estado actual
El agente usa `MemorySaver` como checkpointer de LangGraph. La base de datos solo guarda snapshots serializados de conversación.

### Brecha
No existe persistencia nativa del estado del grafo que sobreviva reinicios del proceso o múltiples instancias.

### Implicación técnica
- Reinicios, crashes o despliegues interrumpen conversaciones activas.
- No es posible escalar horizontalmente sin cambiar el checkpointer.

### Implicación funcional
- El usuario no puede retomar una conversación exactamente donde quedó.
- La experiencia de continuidad depende de que la instancia no se reinicie.

**Clasificación:** Técnico · Severidad: Alta

---

## 2. Multi-tenancy y Aislamiento Operativo

### Estado actual
Existe una única instancia global del agente. El aislamiento se logra por `thread_id`, no por tenant u organización.

### Brecha
No hay separación nativa por cliente, empresa o presupuesto.

### Implicación técnica
- No hay cuotas ni límites por tenant.
- No es posible escalar el producto como SaaS multi-tenant sin refactorización.

### Implicación funcional
- Un mismo despliegue no ofrece aislamiento comercial ni operativo fuerte entre clientes.
- No es viable facturar ni gobernar consumo por organización con el diseño actual.

**Clasificación:** Técnico / Funcional · Severidad: Alta

---

## 3. Seguridad Operacional y Credenciales

### Estado actual
- `JWT_SECRET` tiene default inseguro.
- No existe rate limiting.
- Los archivos subidos no pasan por escaneo de contenido.
- La cookie JWT se crea con `secure=False`.
- La auditoría detectó credenciales sensibles en `.env` que no deben versionarse.

### Brecha
El sistema carece de controles defensivos mínimos para exposición pública continua.

### Implicación técnica
- Riesgo de falsificación de tokens si se despliega con la configuración por defecto.
- Abuso potencial de `/stream` y `/api/stream` sin throttling.
- Riesgo de fuga o compromiso si `.env` contiene credenciales activas bajo control de versiones.

### Implicación funcional
- Posible acceso no autorizado.
- Costos inesperados por abuso de endpoints de IA.
- Mayor exposición reputacional y operativa.

**Clasificación:** Técnico · Severidad: Alta

---

## 4. Configuración ASR Inconsistente

### Estado actual
La aplicación permite transcripción con OpenAI o Gemini, pero el default en `ASR_MODEL` es `gpt-4o-mini-tts`.

### Brecha
El valor por defecto documentado y configurado no corresponde a un modelo ASR válido.

### Implicación técnica
- La transcripción puede fallar o comportarse de forma no soportada si no se corrige el modelo.
- La documentación de despliegue y costos queda inconsistente si se asume Whisper por defecto.

### Implicación funcional
- La función de voz puede no estar operativa en un entorno configurado solo con defaults.

**Clasificación:** Técnico / Funcional · Severidad: Alta

---

## 5. Configuración Incompleta de Nginx para SSE

### Estado actual
`nginx.conf` tiene configuración específica de SSE para `/stream`, pero no para `/api/stream`.

### Brecha
La ruta `/api/stream`, existente en Flask, puede quedar detrás de buffering si se usa a través de nginx.

### Implicación técnica
- Riesgo de degradación del streaming en producción.
- El comportamiento observado puede diferir según la ruta utilizada por el frontend o por integraciones.

### Implicación funcional
- El usuario puede recibir respuestas por bloques en lugar de streaming continuo.

**Clasificación:** Técnico · Severidad: Media

---

## 6. Fachadas y Wiring con Deuda Técnica

### Estado actual
Coexisten dos fachadas de herramientas: la legacy (`application/tools_facade.py`) y la activa (`infrastructure/facade.py`). Además, el fallback de `infrastructure/facade.py` contiene un bug de wiring (`social_x` en lugar de `social`).

### Brecha
La convivencia de rutas activas y legacy, sumada al bug latente del fallback, aumenta la ambigüedad y el riesgo de errores en futuras modificaciones.

### Implicación técnica
- Mayor costo de mantenimiento.
- Riesgo de `TypeError` si el fallback de tooling se usa sin `configure_tooling()`.

### Implicación funcional
- Cambios futuros pueden introducir regresiones difíciles de detectar.

**Clasificación:** Técnico · Severidad: Media

---

## 7. Diferencia entre Scraper Activo y Scraper Legacy

### Estado actual
El wiring activo usa `RequestsScraper`, mientras que `Scrapper` permanece en el repositorio como implementación legacy. Selenium solo entra en juego por flag.

### Brecha
La documentación previa mezclaba ambos componentes como si fueran uno solo.

### Implicación técnica
- Riesgo de diagnosticar o desplegar el comportamiento equivocado del scraping.
- Los defaults reales del scraper activo (`SCRAPER_MAX_PAGES=20`, enriquecimiento LLM opcional) no coinciden con la descripción anterior.

### Implicación funcional
- Las expectativas sobre scraping de SPAs o extracción enriquecida pueden ser incorrectas si no se habilitan los flags necesarios.

**Clasificación:** Técnico / Funcional · Severidad: Media

---

## 8. Gestión de Integraciones Externas y Onboarding de Meta

### Estado actual
La integración con Meta funciona con tokens persistidos en BD. El token inicial se carga vía script (`init_token.py`) con variables de bootstrap.

### Brecha
No existe un flujo OAuth completo de onboarding dentro de la aplicación.

### Implicación técnica
- La operación depende de inicialización manual previa.
- El runtime no resuelve por sí mismo el alta inicial de cuentas de Instagram.

### Implicación funcional
- El usuario final no puede conectar su cuenta sin apoyo técnico.

**Clasificación:** Técnico / Funcional · Severidad: Media

---

## 9. Cobertura de Pruebas Automatizadas

### Estado actual
La carpeta `tests/` contiene pocas pruebas y no cubre el grafo conversacional completo.

### Brecha
No existe cobertura suficiente de los flujos críticos del agente.

### Implicación técnica
- Refactors del grafo y de prompts son riesgosos.
- La deuda técnica documental puede reaparecer por falta de validación automatizada.

### Implicación funcional
- Cada cambio exige más validación manual antes del despliegue.

**Clasificación:** Técnico · Severidad: Media

---

## 10. Observabilidad de Consumo y Costos

### Estado actual
El sistema usa `_estimate_tokens()` como aproximación. No persiste el uso real devuelto por la API.

### Brecha
No existe contabilidad precisa del costo por conversación.

### Implicación técnica
- Las métricas de costo son aproximadas.
- No hay alertas ni presupuesto por usuario.

### Implicación funcional
- No es posible fijar un precio unitario robusto del servicio sobre medición real.

**Clasificación:** Técnico / Funcional · Severidad: Media

---

## Tabla Resumen

| # | Capacidad | Estado actual | Brecha | Severidad | Tipo |
|---|---|---|---|---|---|
| 1 | Persistencia del grafo | `MemorySaver` en RAM | Sin checkpointer persistente | Alta | Técnico |
| 2 | Multi-tenancy | Instancia única global | Sin aislamiento por tenant | Alta | Técnico / Funcional |
| 3 | Seguridad operacional | Defaults inseguros y sin rate limiting | Exposición pública frágil | Alta | Técnico |
| 4 | Configuración ASR | Default inconsistente | Riesgo funcional en voz | Alta | Técnico / Funcional |
| 5 | SSE en nginx | Solo `/stream` ajustado | `/api/stream` no alineado | Media | Técnico |
| 6 | Fachadas y wiring | Doble fachada + bug latente | Deuda técnica y riesgo de error | Media | Técnico |
| 7 | Scraping | Activo y legacy coexisten | Documentación y operación ambiguas | Media | Técnico / Funcional |
| 8 | Onboarding Meta | Inicialización manual | Sin OAuth integrado | Media | Técnico / Funcional |
| 9 | Cobertura de pruebas | Limitada | Bajo soporte a refactors | Media | Técnico |
| 10 | Costos IA | Estimación heurística | Sin medición real por sesión | Media | Técnico / Funcional |
