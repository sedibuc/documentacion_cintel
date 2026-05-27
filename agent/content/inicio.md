# Documentación Técnica — Adaptador de Contenido Institucional

**Proyecto:** Agente Conversacional de Comunicación Institucional
**Versión del documento:** 2.0 (post-validación)
**Fecha:** Mayo 2026

---

## ¿Qué es este sistema?

El **Adaptador de Contenido Institucional** es una aplicación web conversacional especializada para comunicadores de organizaciones públicas e institucionales que necesitan producir y publicar contenido multi-canal de forma recurrente, manteniendo coherencia con la identidad gráfica de su organización, **sin tener que dar contexto desde cero en cada sesión**.

A diferencia de IAs generalistas (ChatGPT, Copilot, Claude), el sistema acumula y aplica el contexto institucional de la organización de forma persistente: ya sabe quién es la institución, cuál es su tono de comunicación, cuáles son sus audiencias, cuál es su identidad visual y cuál es el historial de comunicaciones anteriores.

El diferencial no es la generación de texto —que ya está resuelta por el mercado— sino la **persistencia de marca y memoria organizacional acumulada**.

---

## JTBD principal del segmento

> *Producir y publicar contenido institucional multi-canal de forma recurrente, cumpliendo la identidad gráfica de la organización, sin tener que dar contexto desde cero en cada sesión, y manteniendo coherencia entre campañas relacionadas, operando como responsable único o en equipo mínimo.*

**Segmento primario:** comunicación institucional pública — alcaldías intermedias, gobernaciones, universidades públicas, entidades regulatorias, ministerios. El marketing digital comercial es un caso de uso posible, no el núcleo del producto.

---

## Capacidades diferenciadoras

1. **Contexto organizacional persistente** — la institución no vuelve a explicarse en cada sesión.
2. **Persistencia de marca (Brand Persistence)** — lineamientos visuales, tono e identidad aplicados automáticamente.
3. **Memoria histórica acumulada** — comunicaciones anteriores disponibles para continuidad temática.
4. **Adaptación multi-canal** — Instagram, WhatsApp, email, web sin configurar desde cero cada canal.
5. **Gobernanza institucional** — restricciones de imagen, derechos, banco de activos licenciados y flujos de aprobación.

---

## Tecnologías principales

| Categoría | Tecnología |
|---|---|
| Orquestación IA | LangGraph + LangChain |
| LLM | OpenAI GPT-4.1 / Gemini (alternativo) |
| Imágenes IA | DALL-E 3 / gpt-image-1 |
| Voz | OpenAI Whisper / Gemini Audio |
| Backend | Flask (Python 3.11) |
| Base de datos | PostgreSQL 16 / SQLite |
| Despliegue | Docker Compose + Nginx |

---

## Documentación disponible

### AS-IS — Estado actual

| Documento | Descripción |
|---|---|
| [Diagnóstico](diagnostico.html) | Análisis técnico inicial del sistema vigente: stack, arquitectura, riesgos. |
| [Arquitectura](arquitectura.html) | Componentes, relaciones y flujos principales con diagramas PlantUML. |
| [Brechas](brechas.html) | Capacidades actuales vs. buenas prácticas; oportunidades de evolución. |
| [Despliegue](despliegue.html) | Guía completa de configuración, variables de entorno y pasos de instalación. |
| [Costos](costos.html) | Inventario de servicios IA, variables de costo y estimación por sesión. |
| [Prototipo / Demostrador](mockup.html) | Prototipo navegable del sistema vigente. |

### TO-BE — Visión objetivo

| Documento | Descripción |
|---|---|
| [Visión TO-BE](to-be.html) | Visión funcional del Adaptador de Contenido Institucional post-validación. |
| [Onboarding institucional](to-be-onboarding.html) | Creación del perfil institucional persistente. |
| [Contexto organizacional](to-be-contexto.html) | BrandGuidelinesStore: cómo el sistema acumula y aplica contexto institucional. |
| [Agente Estratégico](to-be-agente-estrategico.html) | Interpreta objetivos institucionales, audiencias y restricciones. |
| [Agente Creativo](to-be-agente-creativo.html) | Adapta piezas a la identidad institucional y al canal. |
| [Ajuste de resultados](to-be-iteracion.html) | Refinamiento dentro del contexto institucional acumulado. |
| [Histórico y memoria](to-be-historico.html) | Memoria organizacional acumulada y continuidad temática. |

### Análisis

| Documento | Descripción |
|---|---|
| [Cambio de contexto TO-BE](analisis-cambio-contexto-to-be.html) | Análisis de qué cambia en el TO-BE a partir de los hallazgos de validación. |

---

## Estado del sistema (Marzo 2026)

El sistema está **funcionalmente completo** para el flujo principal:

```
Usuario → Chat IA → Campaña Markdown → Plan de Ejecución → Imágenes → Email
```

Los puntos críticos identificados antes de escalar a producción son:

1. Reemplazar `MemorySaver` por checkpointer persistente en base de datos.
2. Forzar el `JWT_SECRET` seguro via variable de entorno.
3. Implementar rate limiting en las rutas de streaming.
4. Resolver la dependencia de Selenium en el scraper web.

Consultar el documento de [Brechas](brechas.html) para el análisis completo.

