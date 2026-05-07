# TO-BE — Módulo 2.2: Agente Estratégico

> Módulo de generación del plan de campaña. Convierte el contexto de onboarding en una estrategia estructurada de marketing.

---

## 2.2 Agente Estratégico (Agente 1)

### Descripción funcional

El Agente Estratégico es el entorno de trabajo donde el usuario construye, en conversación con la IA, el plan de comunicación o comunicación de su empresa. No es un formulario ni un asistente genérico: es un espacio de trabajo interactivo que combina el contexto institucional cargado durante el onboarding con el historial de campañas existentes y las instrucciones en lenguaje natural del usuario.

El agente analiza la empresa, sus productos y servicios, su marca y sus campañas anteriores. A partir de ese contexto, orienta la conversación hacia un plan de comunicación coherente, estructurado y alineado con la identidad de la organización.

**Lo que hace este módulo:**
- Analiza el perfil de la empresa y sus servicios configurados en el onboarding.
- Consulta el histórico de campañas para identificar patrones, canales y mensajes previos.
- Conversa con el usuario para entender el objetivo de la nueva campaña.
- Construye progresivamente un plan de comunicación durante la conversación.
- Permite reutilizar campañas anteriores como punto de partida.
- Actualiza su razonamiento visible en tiempo real, mostrando qué está considerando.

**Lo que NO hace en el MVP:**
- No genera imágenes ni piezas publicitarias (eso corresponde al Agente Creativo).
- No publica automáticamente en canales.
- No garantiza consistencia perfecta entre iteraciones.

---

### El entorno de trabajo

El Agente Estratégico se presenta como un entorno tipo IDE de marketing: un espacio de trabajo con múltiples paneles que reflejan tanto la conversación como el contexto y el razonamiento del agente.

#### Panel izquierdo — Contexto de empresa

Muestra la información institucional configurada en el onboarding:
- productos y servicios (los que el usuario validó a partir del scraping),
- descripción de la empresa y propuesta de valor,
- parámetros de marca básicos.

El usuario puede filtrar o seleccionar qué elementos incluir como contexto de la campaña en curso. Si quiere enfocar el plan en un servicio específico, lo marca aquí.

#### Editor central — Conversación con el agente

El espacio principal es una conversación en lenguaje natural. El usuario escribe sus instrucciones y el agente responde con texto, razonamiento y fragmentos del plan. La conversación es el mecanismo de construcción: cada intercambio refina el plan.

El agente no espera que el usuario llene formularios: hace preguntas cuando necesita aclaración, propone cuando tiene suficiente contexto y explica sus decisiones.

#### Panel derecho — Razonamiento del agente

Muestra en tiempo real lo que el agente está considerando:
- objetivos identificados a partir de la conversación,
- canales sugeridos y por qué,
- segmentos de audiencia detectados,
- patrones relevantes del histórico de campañas,
- decisiones tomadas hasta el momento.

Este panel hace visible la "inteligencia" del agente: el usuario puede ver cómo se actualiza a medida que avanza la conversación.

#### Panel superior — Campañas históricas

Permite al usuario seleccionar una campaña anterior como punto de partida. Cuando se selecciona una campaña, el agente la incorpora como contexto adicional y puede proponer una nueva versión adaptada al objetivo actual.

#### Panel inferior — Entrada y salida

La barra inferior tiene el campo de texto donde el usuario escribe. Encima del input, a medida que la conversación avanza, se muestra el plan de comunicación generado de forma incremental.

---

### Flujo funcional

#### Inicio sin campaña previa
1. El usuario abre el Agente Estratégico.
2. El agente carga automáticamente el contexto de la empresa (productos, servicios, marca).
3. El usuario escribe su primera instrucción: qué quiere comunicar o para qué necesita la campaña.
4. El agente hace preguntas de clarificación si es necesario.
5. El agente propone objetivos, audiencia, mensajes clave y canales.
6. El usuario itera en conversación hasta llegar al plan deseado.
7. El plan queda disponible para el Agente Creativo.

#### Inicio con reutilización de campaña anterior
1. El usuario selecciona una campaña histórica desde el panel superior.
2. El agente carga esa campaña como contexto adicional.
3. El usuario indica qué quiere hacer con ella: crear una parecida, adaptarla a un nuevo objetivo, cambiar el tono o el canal.
4. El agente genera una nueva versión a partir de la campaña base y el contexto actual.
5. El usuario refina mediante conversación.

#### Iteración conversacional
En cualquier momento el usuario puede:
- cambiar el enfoque ("enfócalo más en sector público"),
- ajustar la audiencia ("agrégale a pymes"),
- cambiar los canales ("quita email, enfócate solo en LinkedIn"),
- pedir una versión alternativa ("muéstrame otra opción más institucional").

El agente actualiza el plan y su razonamiento visible en cada intercambio.

---

### Ejemplo de conversación

```
Usuario: Necesito una campaña para transformación digital.

Agente:  Con base en el perfil de CINTEL, identifico que este tema conecta
         directamente con sus servicios de consultoría y formación. ¿El
         objetivo principal es generar registros a un evento, posicionar la
         marca o promover un servicio específico?

Panel derecho actualiza:
  · Empresa: CINTEL — sector innovación y TI
  · Tema identificado: transformación digital
  · Esperando: definición de objetivo

---

Usuario: Quiero generar registros para un evento.

Agente:  Entendido. Propongo el siguiente plan inicial:

         Objetivo: Incrementar registros al evento de transformación digital.
         Audiencia: Líderes empresariales y responsables de innovación.
         Mensaje clave: La IA aplicada ya está transformando procesos reales.
         Canales: LinkedIn y email institucional.
         Enfoque: Informativo con énfasis en valor práctico y casos de aplicación.

         ¿Quieres ajustar algún elemento o usamos esto como base?

Panel derecho actualiza:
  · Objetivo: registros al evento
  · Audiencia: líderes empresariales
  · Canales: LinkedIn, email
  · Patrón del histórico: ANDICOM 2025 tuvo 320 registros con canales similares

---

Usuario: Usa la campaña de ANDICOM 2025 como base.

Agente:  Revisé la campaña ANDICOM 2025. Usaré el mismo enfoque de valor
         práctico que funcionó bien, con el mensaje "La IA aplicada ya está
         aquí". Para 2026, propongo actualizar el mensaje principal para
         reflejar que ya hay casos concretos en Colombia, no solo tendencias.

         Versión actualizada del mensaje clave:
         "En Colombia ya hay empresas que transformaron sus procesos con IA.
          Conoce cómo en ANDICOM 2026."

         ¿Continuamos con este enfoque?

Panel derecho actualiza:
  · Base histórica: ANDICOM 2025
  · Resultado anterior: 320 registros
  · Adaptación aplicada: mensaje más local y concreto

---

Usuario: Hazla más enfocada en sector público.

Agente:  Ajusto el plan para priorizar audiencia de sector público:

         Audiencia actualizada:
         - Responsables de transformación digital en entidades gubernamentales.
         - Directores de TI en alcaldías, ministerios y entidades del orden nacional.

         Mensaje clave ajustado:
         "El sector público colombiano ya está adoptando IA. Descubre cómo
          avanzar en tu entidad en ANDICOM 2026."

         Canal adicional recomendado: LinkedIn (perfil gubernamental) + email
         a bases de datos de entidades públicas conocidas.

Panel derecho actualiza:
  · Audiencia refinada: sector público
  · Canal adicional: LinkedIn segmentado
  · Ajuste de tono: más institucional
```

---

### Diagramas de flujo

![Flujo principal del Agente Estratégico](assets/img/diagramas/agente-estrategico-flujo.png)

![Flujo de reutilización de campaña anterior](assets/img/diagramas/agente-estrategico-reutilizacion.png)

![Flujo de iteración conversacional](assets/img/diagramas/agente-estrategico-conversacion.png)

---


> 🔗 **Prototipo navegable** — Consulte el flujo interactivo del agente en la **[sección Prototipo navegable](mockup.html)**.

---

### Ejemplo de salida — plan de comunicación generado

```markdown
# Plan de comunicación — ANDICOM 2026 (sector público)

## Objetivo
Incrementar registros al evento, con foco en tomadores de decisión
del sector público colombiano.

## Audiencia objetivo
- Directores de TI y transformación digital en entidades gubernamentales.
- Responsables de innovación en alcaldías, ministerios y entidades nacionales.

## Mensaje principal
El sector público colombiano ya está adoptando IA. Descubre cómo avanzar
en tu entidad en ANDICOM 2026.

## Canales recomendados
- LinkedIn (segmentación sector público)
- Email institucional a bases de datos de entidades

## Enfoque
Campaña informativa con énfasis en casos de aplicación en el sector público,
resultados concretos y agenda práctica del evento.

## Base histórica utilizada
ANDICOM 2025 — 320 registros — canales: LinkedIn + email
Adaptación: mensaje actualizado para reflejar adopción real en Colombia
y audiencia reorientada a sector público.
```

---