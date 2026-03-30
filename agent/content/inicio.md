# Documentación Técnica — Agente de Marketing IA

**Proyecto:** Agente Conversacional de Marketing  
**Versión del documento:** 1.0  
**Fecha:** Marzo 2026

---

## ¿Qué es este sistema?

El **Agente de Marketing IA** es una aplicación web conversacional que guía a un usuario de negocio a través de un flujo estructurado para generar, de forma asistida por inteligencia artificial:

- Una **propuesta de campaña de marketing** (documento Markdown).
- Un **plan de ejecución** detallado de la campaña.
- **Activos visuales** generados por IA (imágenes para redes sociales).
- Un **resumen por correo electrónico** enviado automáticamente al cliente.

El agente opera en español y está orientado al mercado hispanoparlante.

---

## Objetivo funcional

Automatizar el proceso de diseño de campañas de marketing mediante un agente de IA que:

1. Recopila contexto del negocio del usuario (sitio web, productos, campañas históricas, cuenta de Instagram).
2. Formula preguntas de profundización adaptadas al tema de la campaña.
3. Genera una campaña coherente con el contexto del negocio.
4. Produce imágenes alineadas con la identidad visual del cliente.
5. Consolida y entrega el resultado vía email.

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

| Documento | Descripción |
|---|---|
| [Diagnóstico](diagnostico.html) | Análisis técnico inicial del sistema: stack, arquitectura, riesgos. |
| [Arquitectura](arquitectura.html) | Componentes, relaciones y flujos principales con diagramas PlantUML. |
| [Brechas](brechas.html) | Capacidades actuales vs. buenas prácticas; oportunidades de evolución. |
| [Despliegue](despliegue.html) | Guía completa de configuración, variables de entorno y pasos de instalación. |
| [Costos](costos.html) | Inventario de servicios IA, variables de costo y estimación por sesión. |

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

