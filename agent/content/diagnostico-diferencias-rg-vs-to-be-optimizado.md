# Diagnóstico de diferencias actuales: propuesta RG vs TO-BE optimizado

> **Nota de interpretación:** Este diagnóstico describe diferencias vigentes entre la propuesta RG y el TO-BE optimizado en el estado actual del micrositio. No documenta historial de cambios ni evolución previa.

## 1. Propósito

Presentar una comparación objetiva de diferencias técnicas y funcionales que hoy siguen visibles entre ambas referencias, para facilitar decisiones de cierre de arquitectura.

## 2. Alcance y fuentes revisadas

Fuentes RG:

- context/propuesta_rg/arquitectura.md

Fuentes TO-BE:

- content/to-be-arquitectura.md
- content/to-be.md
- content/to-be-contexto.md
- content/to-be-historico.md
- content/to-be-onboarding.md
- content/to-be-agente-estrategico.md
- content/to-be-agente-creativo.md
- content/preguntas-experto-tecnico.md

## 3. Resumen ejecutivo

En el estado actual, RG y TO-BE muestran convergencia alta en estructura por fases, gobernanza humana y operación multicanal asistida. Las diferencias vigentes se concentran en definiciones técnicas de cierre: taxonomía del núcleo de marca, umbral de recuperación vectorial, especificación de observabilidad y nivel de hardening multi-tenant para piloto.

Nivel general de convergencia actual: **medio-alto**.

## 4. Diferencias actuales vigentes

| ID | Diferencia actual | Estado en propuesta RG | Estado en TO-BE optimizado | Impacto | Severidad |
|---|---|---|---|---|---|
| DA-01 | Nomenclatura del núcleo de marca | Predomina BrandProfileService como servicio operativo | Coexisten BrandGuidelinesStore / BrandProfileService | Puede generar ambigüedad de ownership y contratos de implementación | Media |
| DA-02 | Lectura técnica de manual de marca | Flujo centrado en parser/OCR+visión | Flujo centrado en LLM multimodal sin OCR en MVP | Diferencia de implementación y costos operativos | Media |
| DA-03 | Activación de recuperación vectorial | Predominio estructurado para contexto crítico | Recuperación híbrida con activación vectorial condicionada | Riesgo de sobredimensionar costo o subcubrir contexto | Media |
| DA-04 | Nivel de detalle en observabilidad | Servicios operativos definidos para registro y métricas | ObservabilityService definido sin contrato mínimo cerrado de eventos/SLI | Riesgo de baja auditabilidad E2E y control de costos IA | Alta |
| DA-05 | Hardening de seguridad multi-tenant para piloto | Aislamiento temprano con enfoque técnico explícito | Aislamiento mínimo viable + endurecimiento progresivo | Riesgo de criterios insuficientes para salida a piloto institucional | Alta |

## 5. Matriz comparativa del estado actual

| Dimensión | Propuesta RG (estado actual) | TO-BE optimizado (estado actual) | Estado de convergencia | Observación actual |
|---|---|---|---|---|
| Enfoque de producto | Enfoque más técnico-operativo | Enfoque institucional funcional + técnico | Media | Complementarios; TO-BE mantiene narrativa de valor institucional |
| Roadmap por fases | Sprint 0, V1, V2, V3 definido | Sprint 0, V1, V2, V3 definido | Alta | Alineación estructural vigente |
| Componentes implementables | Servicios explícitos y orientados a implementación | Servicios explícitos con foco funcional | Alta | Diferencias menores de naming |
| Contexto organizacional persistente | Presente | Núcleo de la propuesta | Alta | Alineación vigente |
| Núcleo de marca | BrandProfileService | BrandGuidelinesStore / BrandProfileService | Media | Requiere taxonomía única |
| Onboarding y completitud | Servicio de onboarding y scoring definidos | OnboardingService y CompletenessScorer definidos | Alta | Alineación vigente |
| Histórico y memoria | Enfoque operativo con métricas | Memoria organizacional como activo funcional | Alta | Alineación por complementariedad |
| Gobernanza humana | Presente en flujo operativo | Principio rector del sistema | Alta | Alineación vigente |
| Publicación/exportación | Offline-first en V1 | Offline-first en V1 y automatización gradual | Alta | Alineación vigente |
| Recuperación de contexto | Estructurado prioritario | Híbrido gradual condicionado | Media | Diferencia vigente por criterio técnico |
| Multi-tenancy | Temprano y explícito | Temprano con hardening gradual | Media | Falta umbral mínimo cerrado para piloto |
| Observabilidad | Definición operativa de registro y métricas | Definición de alto nivel en ObservabilityService | Media | Falta contrato mínimo técnico en TO-BE |

## 6. Brechas técnicas vigentes

| Brecha vigente | Impacto | Severidad | Recomendación puntual |
|---|---|---|---|
| Taxonomía única del núcleo de marca no cerrada | Ambigüedad en diseño técnico y documentación | Media | Definir nombre canónico, alias y ownership |
| Umbral de activación vectorial sin cierre | Riesgo de costo/latencia o cobertura insuficiente | Media | Definir métricas objetivas para activar vector DB |
| Contrato mínimo de observabilidad no especificado | Trazabilidad incompleta y menor control operativo | Alta | Formalizar eventos, errores, costos, latencia y panel mínimo |
| Criterio mínimo de seguridad multi-tenant para piloto sin checklist | Riesgo de privacidad/compliance inter-organización | Alta | Acordar checklist técnico obligatorio previo a piloto |

## 7. Preguntas técnicas abiertas alineadas al estado actual

| Tema | Pregunta técnica vigente | Resultado esperado |
|---|---|---|
| Lectura de marca con LLM | ¿Qué umbral de calidad y cobertura formaliza el uso de LLM multimodal sin OCR para V1? | Regla de decisión reproducible por tipo de documento |
| Recuperación vectorial | ¿Qué volumen y latencia justifican activar vector DB en V1? | Criterio económico-técnico con límites medibles |
| Observabilidad | ¿Cuál es el set mínimo de eventos y métricas obligatorias para auditar una campaña E2E? | Contrato técnico de observabilidad V1 |
| Multi-tenancy | ¿Qué controles mínimos de aislamiento y auditoría son obligatorios antes de piloto? | Checklist de seguridad multi-organización |
| Núcleo de marca | ¿Cuál nomenclatura única se adopta para el componente canónico de marca? | Taxonomía estable para arquitectura y backlog |

## 8. Conclusiones del estado actual

La comparación actual muestra una base convergente y operable entre RG y TO-BE. Las diferencias vigentes no son de dirección funcional principal; son diferencias de cierre técnico y estandarización.

El foco inmediato debe estar en cerrar criterios operativos verificables para marca, recuperación de contexto, observabilidad y seguridad multi-tenant.

---

Trazabilidad: [Arquitectura TO-BE optimizada](to-be-arquitectura.html) | [Objetivos funcionales](to-be-objetivos-funcionales.html) | [Preguntas para experto técnico](preguntas-experto-tecnico.html)
