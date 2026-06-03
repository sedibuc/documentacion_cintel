# Arquitectura Transversal CINTEL

## Propósito de este micrositio

Este micrositio documenta la **arquitectura transversal** aplicable al portafolio de soluciones de inteligencia artificial de CINTEL. Su objetivo es identificar los componentes, módulos y decisiones arquitectónicas que son comunes al *Document Intelligence Engine* (DIE) y al *Adaptador de Contenido Institucional* (Agent), y abstraerlos como un **proyecto base o scaffolding** desde el cual iniciar nuevas implementaciones con coherencia, seguridad y eficiencia.

> **Alcance:** Este documento no modifica, reemplaza ni altera los micrositios existentes de RAG/DIE ni de Agent. Es un documento de síntesis y propuesta de reutilización arquitectónica.

## Contexto de las soluciones analizadas

CINTEL ha desarrollado dos soluciones avanzadas basadas en inteligencia artificial:

**1. Document Intelligence Engine (DIE) — MultiTenant**
Sistema de extracción de campos estructurados a partir de documentos (PDF, DOCX, imágenes), con validación cruzada contra fuentes de referencia y gestión de alertas de discrepancia. Arquitectura multi-cliente con aislamiento lógico por `tenant_id`.

**2. Adaptador de Contenido Institucional (Agent)**
Sistema multi-agente para generación de contenido de marketing institucional adaptado por canal (LinkedIn, Instagram, email, WhatsApp), con aprendizaje del contexto organizacional, lineamientos de marca y ciclos de validación humana.

## Patrones arquitectónicos identificados

El análisis comparativo de ambas soluciones revela que comparten una estructura de capas casi idéntica y un conjunto de decisiones técnicas repetidas de forma independiente. Esto representa tanto una **deuda de reutilización** como una **oportunidad de estandarización**.

Los patrones transversales identificados incluyen:

- **Multi-tenancy** como requisito no negociable en ambas soluciones
- **LLM Gateway** como capa crítica de control de costos, rate-limiting y fallback
- **Observabilidad unificada** (MLFlow + Grafana + Ray) en ambas arquitecturas
- **RBAC por organización** con JWT y API Gateway
- **Prompt Registry** versionado con guardrails y few-shots
- **Audit Service** inmutable por operación y tenant
- **CI/CD** con separación por ambientes (dev / staging / prod)
- **Onboarding de nuevos clientes** como flujo estandarizado

## Estructura de este micrositio

Este documento se organiza en tres secciones:

**[1. Funcionalidades transversales](funcionalidades.html)**
Catálogo de 26 funcionalidades que se han identificado como candidatas para abstraerse como componentes reutilizables del proyecto base. Incluye descripción, aplicación en cada solución, valor como componente y prioridad de implementación.

**[2. Arquitectura transversal](arquitectura.html)**
Propuesta de arquitectura en capas para el *Core Transversal CINTEL*: módulos, responsabilidades, integraciones, decisiones arquitectónicas y límites entre el núcleo compartido y las funcionalidades específicas de cada proyecto.

**[3. Cronograma de implementación](cronograma.html)**
Hoja de ruta por fases para construir el proyecto base, con objetivos, actividades, entregables, dependencias, duración estimada y criterios de cierre de cada fase.

## Valor estratégico del proyecto base

Construir un *Core Transversal* centralizado permite:

- **Reducir tiempo de arranque** de nuevas soluciones en un 40–60 % al eliminar la configuración repetida de infraestructura
- **Garantizar consistencia de seguridad** aplicando políticas de autenticación, autorización y auditoría desde el inicio
- **Controlar costos de IA** de forma unificada a través del LLM Gateway compartido
- **Facilitar el cumplimiento** regulatorio y de privacidad de datos con mecanismos de aislamiento multi-tenant ya probados
- **Escalar operaciones** sin reescribir infraestructura, activando módulos sobre una base estable

## Equipo y fecha

Elaborado por el equipo técnico de CINTEL — Junio 2026.
Basado en la validación de experto técnico (preguntas P-00 a P-09, junio 2026).
