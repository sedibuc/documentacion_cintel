# Contexto del proyecto

## Propósito
Este micrositio documenta la evolución del demostrador inicial hacia un Document Intelligence Engine (DIE) orientado a extracción estructurada, validación cruzada y operación multi-tenant.

## Alcance funcional del proyecto RAG/DIE
- Procesamiento de documentos empresariales y contractuales.
- Extracción de campos estructurados con soporte de LLM.
- Validación contra fuentes de referencia y reglas de negocio.
- Gestión de discrepancias y alertas operativas.

## Alcance fuera de foco
- No es un chatbot conversacional para preguntas abiertas.
- No es un sistema centrado en búsqueda semántica por embeddings.
- No prioriza generación de contenido narrativo como salida principal.

## Actores y responsabilidades
- Equipo técnico: diseña arquitectura, seguridad y operación.
- Equipo funcional: define campos críticos, reglas y flujos de validación.
- Usuarios de negocio: consumen resultados estructurados y alertas.

## Estado actual y transición
El AS-IS parte de un demostrador con elementos de RAG. El TO-BE redefine el producto como DIE para asegurar trazabilidad, calidad de extracción y gobernanza multi-cliente.

## Estructura documental de este micrositio
- AS-IS: diagnóstico, arquitectura vigente, brechas, despliegue, costos y mockup.
- TO-BE: propuesta funcional, arquitectura objetivo y decisiones técnicas por módulos.
- Plan de implementación: cronograma, preguntas para experto y conclusiones.
