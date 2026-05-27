# TO-BE — Contexto organizacional persistente

> Esta sección describe el módulo diferenciador central del **Adaptador de Contenido Institucional**: el **BrandGuidelinesStore** o repositorio de contexto organizacional persistente. Es el componente que distingue el producto de cualquier IA generalista disponible en el mercado.

---

## 1. Descripción general

El **BrandGuidelinesStore** (repositorio de lineamientos institucionales) es el módulo núcleo del sistema. Resuelve el dolor de mayor peso validado en campo: la **ausencia de contexto organizacional persistente** en todas las herramientas de IA disponibles en el mercado.

> *"Ya con el contexto con que yo lo alimente, con que tenga toda la información, ya yo no tendría que salir a cada vez que le vas a hacer una pregunta, darle contexto de lo que estoy haciendo porque ya sabe de qué se trata y cómo lo manejamos."*
> — Verónica Rangel Jaller, Pro Montería (sesión de validación, marzo 2026)

A diferencia de herramientas como ChatGPT, Copilot, Canva for Teams o Jasper, el sistema **acumula y aplica automáticamente el contexto institucional** de la organización en cada sesión. El comunicador no re-explica quién es la institución cada vez que inicia un proyecto.

### Por qué esto es el diferencial y no la generación de texto

La investigación de validación confirmó que la generación de texto ya está resuelta en el mercado. Las tres entrevistadas usan ChatGPT, Copilot o Claude cotidianamente para generar texto. El verdadero cuello de botella es doble:

1. **Sobrecarga de contexto:** cada sesión de IA obliga a re-explicar desde cero quién es la organización, su audiencia, su tono y su historial.
2. **Adaptación gráfica:** pasar de "tengo el texto" a "tengo la pieza lista para publicar con mi identidad gráfica" consume más tiempo que el trabajo intelectual previo.

Ninguna herramienta del mercado colombiano resuelve ambos cuellos de botella de forma integrada.

---

## 2. Contenido del perfil institucional persistente

El BrandGuidelinesStore acumula el siguiente conjunto de datos por institución:

| Categoría | Datos persistidos |
|---|---|
| **Identidad institucional** | Nombre, descripción, sector, misión, propuesta de valor |
| **Tono y voz** | Estilo de comunicación, nivel de formalidad, restricciones de lenguaje |
| **Audiencias** | Públicos objetivo por canal, segmentos internos y externos |
| **Canales activos** | Instagram, WhatsApp, email, web, intranet, boletines |
| **Identidad visual** | Logos, paleta de colores, tipografías, plantillas aprobadas |
| **Activos licenciados** | Banco de imágenes propias con derechos de uso |
| **Restricciones** | Imágenes IA, restricciones regulatorias, flujos de aprobación |
| **Historial de comunicaciones** | Briefs anteriores, piezas generadas, campañas anteriores |
| **Aprendizajes** | Qué funcionó, qué no, feedback del equipo, métricas básicas |

### Módulos del sistema

El TO-BE se documenta en módulos funcionales. Cada módulo consume y enriquece el BrandGuidelinesStore.

| Módulo | Función | Página |
|---|---|---|
| **Onboarding institucional** | Crea el perfil institucional persistente inicial | [→ Onboarding](to-be-onboarding.html) |
| **Agente Estratégico** | Interpreta objetivos y restricciones institucionales para generar el plan de comunicación | [→ Agente Estratégico](to-be-agente-estrategico.html) |
| **Agente Creativo** | Adapta piezas a la identidad institucional y al canal, usando el banco de activos | [→ Agente Creativo](to-be-agente-creativo.html) |
| **Ajuste de resultados** | Refina salidas dentro del contexto institucional acumulado | [→ Ajuste de resultados](to-be-iteracion.html) |
| **Histórico y memoria** | Memoria organizacional acumulada y fuente de aprendizaje | [→ Histórico](to-be-historico.html) |

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

Esta sección TO-BE debe entenderse como **contextualización funcional objetivo** para apoyar decisiones de arquitectura, estimación y evolución del producto. No representa el comportamiento exacto del sistema actual, sino la referencia funcional hacia la que se quiere documentar y proyectar el Adaptador de Contenido Institucional.