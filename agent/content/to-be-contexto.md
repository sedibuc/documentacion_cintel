# TO-BE — Visión funcional objetivo

> Esta sección describe el **estado deseado del producto**: lo que el Agente de Marketing IA debería hacer, no lo que hace hoy. Sirve como referencia funcional para decisiones de arquitectura, estimación y evolución.

---

## 1. Descripción general

El Agente de Marketing IA, en su visión **TO-BE**, es un sistema agéntico orientado a equipos de comunicación y marketing que necesitan transformar contexto institucional o comercial en salidas accionables de comunicación. Su propósito es ayudar a una organización a pasar de una idea de campaña a un conjunto de activos utilizables —plan, brief y piezas— mediante un flujo guiado, estructurado y reutilizable.

A diferencia de un asistente genérico, el sistema parte de información base de la organización, de su audiencia y de su contexto de marca para producir resultados con mayor coherencia funcional. El objetivo del MVP no es garantizar automatización total ni consistencia absoluta en todas las generaciones, sino demostrar un flujo extremo a extremo que permita:

- capturar contexto inicial de empresa y audiencia,
- construir un plan de comunicación o comunicación,
- derivar briefs creativos y piezas publicitarias,
- permitir ajustes controlados del resultado,
- y conservar trazabilidad básica de lo generado.

En esta visión, el sistema se organiza en módulos funcionales claramente separados para distinguir:

- la **configuración base** del negocio,
- la **planeación estratégica**,
- la **ejecución creativa**,
- el **ajuste del resultado**,
- y la **consulta del histórico**.

---

## 2. Módulos del sistema

El TO-BE se documenta en cinco módulos funcionales. Cada módulo tiene su propia página con descripción detallada, flujo funcional y diagramas.

| Módulo | Función | Página |
|---|---|---|
| **2.1 Onboarding** | Captura el contexto institucional, la identidad visual y el historial de campañas de la empresa | [→ Onboarding](to-be-onboarding.html) |
| **2.2 Agente Estratégico** | Genera el plan de campaña en conversación con el usuario, usando el contexto del onboarding | [→ Agente Estratégico](to-be-agente-estrategico.html) |
| **2.3 Agente Creativo** | Produce briefs de diseño y piezas de contenido a partir del plan de campaña | [→ Agente Creativo](to-be-agente-creativo.html) |
| **2.4 Ajuste de resultados** | Permite refinar cualquier salida del sistema mediante instrucciones en lenguaje natural | [→ Ajuste de resultados](to-be-iteracion.html) |
| **2.5 Histórico** | Almacena y permite recuperar campañas, briefs y piezas anteriores para reutilizarlos | [→ Histórico](to-be-historico.html) |

---

## 3. Resumen del alcance MVP

En el MVP, la visión TO-BE debe priorizar un flujo funcional claro y demostrable, con foco en:

1. **[Onboarding básico](to-be-onboarding.html)** — Contexto de empresa, identidad visual y audiencia.
2. **[Generación de plan](to-be-agente-estrategico.html)** — Agente Estratégico para construir el plan de campaña en conversación.
3. **[Generación de brief y piezas](to-be-agente-creativo.html)** — Agente Creativo para producir materiales por canal.
4. **[Ajuste controlado del output](to-be-iteracion.html)** — Módulo de iteración mediante instrucción libre del usuario.
5. **[Histórico básico](to-be-historico.html)** — Solo si el esfuerzo lo permite en el MVP.

Quedan por fuera del compromiso del MVP:

- consistencia garantizada entre iteraciones,
- publicación automática en canales,
- versionado avanzado,
- analítica profunda,
- y automatización cerrada del ciclo completo.

---

## 4. Nota de interpretación

Esta sección TO-BE debe entenderse como **contextualización funcional objetivo** para apoyar decisiones de arquitectura, estimación y evolución del producto. No representa el comportamiento exacto del sistema actual, sino la referencia funcional hacia la que se quiere documentar y proyectar el Agente de Marketing IA.