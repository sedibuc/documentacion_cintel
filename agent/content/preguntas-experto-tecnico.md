# Preguntas para experto técnico

> Esta página valida decisiones iniciales de la arquitectura TO-BE optimizada. No abre la arquitectura desde cero.
>
> Enfoque de consulta: confirmar decisiones ya propuestas, definir umbrales medibles y cerrar riesgos clave en máximo 20 horas.

---

## 1. Objetivo de la consulta

Validar y ajustar decisiones técnicas de alto impacto para el Adaptador de Contenido Institucional, con salida accionable para cerrar MVP y roadmap V2/V3.

## 2. Restricción de tiempo y forma de respuesta

| Parámetro | Valor |
|---|---|
| Tiempo máximo total | 20 horas hábiles |
| Enfoque | Validar decisiones iniciales propuestas |
| Formato esperado | Respuesta estructurada con umbral y recomendación |
| Lo que no se pide | Implementación completa, PoC extensa, benchmark exhaustivo |

---

## 3. Preguntas priorizadas para validación

### P-00. Formalización de lectura de marca con LLM (sin OCR)

**Decisión propuesta para formalizar:**
La lectura de manuales de marca institucional en MVP se realiza con LLM multimodal como camino principal. OCR no forma parte del flujo objetivo de V1.

**Pregunta al experto:**
¿Se formaliza esta decisión como lineamiento técnico vigente para MVP, con revisión humana de los campos críticos extraídos?

**Respuesta esperada:**
Sí/No con condiciones explícitas de calidad mínima, tipos documentales cubiertos y excepciones permitidas.

**Criterio de validación:**
Si la respuesta es afirmativa, el diseño base de BrandGuidelinesStore se congela con pipeline LLM multimodal + validación humana, sin incorporar OCR en V1.

**Tiempo sugerido:**
0.5 horas.

---

### P-01. Cobertura de LLM multimodal en manuales de marca

**Decisión inicial propuesta:**
Usar LLM multimodal directo para PDF/DOCX/imágenes de marca en el flujo principal.

**Pregunta al experto:**
¿Qué cobertura real de calidad se espera para documentos institucionales complejos (tablas, anexos, versiones escaneadas parciales)?

**Respuesta esperada:**
Tabla por tipo de documento, calidad esperada, riesgo y recomendación operativa.

**Criterio de validación:**
La cobertura objetivo para operación estable de V1 debe ser >=80% en los documentos típicos del segmento.

**Tiempo sugerido:**
1.5 horas.

---

### P-02. Estrategia híbrida de recuperación de contexto

**Decisión inicial propuesta:**
Usar recuperación híbrida gradual: base estructurada para contexto crítico y capa documental/vectorial para anexos extensos.

**Pregunta al experto:**
¿La estrategia híbrida propuesta es adecuada para MVP multicliente con memoria organizacional y restricciones institucionales?

**Respuesta esperada:**
Riesgos, ajustes recomendados y condición para activar vector DB desde V1.

**Criterio de validación:**
Si >70% del contexto crítico queda modelado estructuradamente, se mantiene prioridad estructurada.

**Tiempo sugerido:**
2 horas.

---

### P-03. Alcance mínimo del núcleo de marca

**Decisión inicial propuesta:**
Definir un set mínimo de atributos de marca para demostrar valor en MVP sin sobrediseño.

**Pregunta al experto:**
¿Qué campos son estrictamente mínimos en V1 y cuáles deben diferirse a V2 sin perder el diferencial del producto?

**Respuesta esperada:**
Lista mínima obligatoria + lista diferible con justificación.

**Criterio de validación:**
El mínimo debe cubrir identidad, tono, audiencias, activos y restricciones por canal.

**Tiempo sugerido:**
1.5 horas.

---

### P-04. Imagen institucional: activos licenciados vs IA

**Decisión inicial propuesta:**
Mantener activos licenciados como flujo principal en V1 y tratar generación IA como opción controlada.

**Pregunta al experto:**
¿Qué alternativa minimiza riesgo legal/regulatorio para entidades públicas y mantiene viabilidad operativa del MVP?

**Respuesta esperada:**
Comparativo por opción con recomendación por segmento.

**Criterio de validación:**
Si el riesgo regulatorio de IA generativa es medio-alto, no se usa como flujo principal en V1.

**Tiempo sugerido:**
1.5 horas.

---

### P-05. Publicación automática vs exportación asistida

**Decisión inicial propuesta:**
Mantener offline-first/exportación asistida en V1 y automatización gradual por canal en V2.

**Pregunta al experto:**
Por canal (email, Instagram, WhatsApp, web/intranet), ¿qué modo es recomendable en MVP según madurez API y riesgo operativo?

**Respuesta esperada:**
Tabla por canal con modo recomendado, restricciones y riesgo.

**Criterio de validación:**
Solo automatizar en V1 cuando exista API madura + permisos viables + riesgo bajo.

**Tiempo sugerido:**
2 horas.

---

### P-06. Motor de orquestación agéntica

**Decisión inicial propuesta:**
Mantener LangGraph por soporte de estados, aprobaciones y trazabilidad.

**Pregunta al experto:**
¿LangGraph cubre adecuadamente el flujo TO-BE o existe alternativa superior con menor riesgo de implementación?

**Respuesta esperada:**
Comparativa breve y recomendación final.

**Criterio de validación:**
Si cubre estados, trazabilidad y human-in-the-loop sin brechas críticas, se mantiene.

**Tiempo sugerido:**
2 horas.

---

### P-07. Observabilidad mínima de MVP

**Decisión inicial propuesta:**
Instrumentar en V1 latencia, errores, costo de IA, trazabilidad por campaña y estados de aprobación.

**Pregunta al experto:**
¿Qué set de métricas es crítico en V1 y cuál puede diferirse a V2 sin perder auditabilidad?

**Respuesta esperada:**
Lista crítica/opcional por categoría técnica y funcional.

**Criterio de validación:**
Debe permitir auditoría de extremo a extremo por campaña.

**Tiempo sugerido:**
1 hora.

---

### P-08. Seguridad y aislamiento multi-organización

**Decisión inicial propuesta:**
Aislamiento lógico por tenant_id desde Sprint 0 con control de acceso por organización.

**Pregunta al experto:**
¿Ese nivel de aislamiento es suficiente para piloto institucional o requiere controles adicionales obligatorios en V1?

**Respuesta esperada:**
Checklist mínimo de seguridad para salida a piloto.

**Criterio de validación:**
No debe existir riesgo crítico de fuga inter-tenant.

**Tiempo sugerido:**
2 horas.

---

### P-09. Criterios para proveedor LLM

**Decisión inicial propuesta:**
Seleccionar proveedor con matriz ponderada, no por preferencia única.

**Pregunta al experto:**
¿Qué criterios y pesos recomienda para español institucional colombiano?

**Respuesta esperada:**
Matriz con pesos (100%) y candidatos prioritarios.

**Criterio de validación:**
La matriz debe ser utilizable por comité técnico para decisión de MVP.

**Tiempo sugerido:**
1.5 horas.

---

### P-10. Cierre de decisiones dentro de 20 horas

**Decisión inicial propuesta:**
Cerrar en esta ronda solo decisiones de alto impacto sin depender de PoC extensa.

**Pregunta al experto:**
¿Qué decisiones se pueden cerrar con confianza en 20 horas y cuáles requieren PoC adicional?

**Respuesta esperada:**
Tres listas: cerrables, requieren PoC, dependencias.

**Criterio de validación:**
La salida debe permitir actualizar arquitectura sin bloquear MVP por investigación prolongada.

**Tiempo sugerido:**
1 hora.

---

## 4. Matriz resumida de uso de respuestas

| Pregunta | Decisión que valida | Umbral principal | Acción si se cumple | Acción si no se cumple |
|---|---|---|---|---|
| P-00/P-01 | Lectura de marca con LLM | Cobertura documental >=80% | Mantener LLM multimodal sin OCR en V1 | Replantear alcance documental de V1 |
| P-02 | Recuperación de contexto | Contexto estructurable >70% | Base estructurada + vectorial opcional | Priorizar diseño vectorial desde V1 |
| P-03 | Núcleo mínimo de marca | Set mínimo demostrable y trazable | Mantener alcance V1 | Ajustar modelo de datos |
| P-04 | Política de imagen | Riesgo regulatorio aceptable | Activos licenciados + IA controlada | Restringir IA generativa |
| P-05 | Modo por canal | API viable + riesgo bajo | Automatización puntual | Exportación asistida |
| P-06 | Orquestación | Cobertura de estados y aprobación | Mantener LangGraph | Evaluar alternativa |
| P-07 | Observabilidad MVP | Auditoría E2E posible | Instrumentar set crítico | Aumentar instrumentación V1 |
| P-08 | Aislamiento multi-tenant | Sin riesgo crítico inter-tenant | Mantener diseño Sprint 0 | Endurecer seguridad |
| P-09 | Selección LLM | Matriz ponderada lista | Seleccionar candidato MVP | Ajustar criterios |
| P-10 | Cierre de consulta | Decisiones priorizadas cerrables | Actualizar arquitectura | Separar PoC y replanificar |

---

## 5. Resultado esperado para el micrositio

Las respuestas de esta página alimentan directamente la [Arquitectura TO-BE optimizada](to-be-arquitectura.html) para pasar decisiones de estado propuesta a estado validada.

Trazabilidad: [Arquitectura TO-BE](to-be-arquitectura.html) · [Mapa de módulos](decisiones-modulos.html) · [Objetivos funcionales](to-be-objetivos-funcionales.html)
