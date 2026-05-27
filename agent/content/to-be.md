# TO-BE — Adaptador de Contenido Institucional

> Visión funcional objetivo post-validación. Esta sección describe el **estado deseado del producto** según los hallazgos de las sesiones de validación con comunicadoras institucionales realizadas en marzo 2026. No describe el estado actual del demostrador.

---

## 1. Descripción general

El **Adaptador de Contenido Institucional**, en su visión **TO-BE**, es un sistema agéntico especializado para comunicadores institucionales que necesitan producir y publicar contenido multi-canal de forma recurrente, manteniendo coherencia con la identidad gráfica de su organización, **sin tener que dar contexto desde cero en cada sesión**.

El diferencial central frente a IAs generalistas (ChatGPT, Copilot, Claude) no es la calidad de la generación de texto —que ya está resuelta en el mercado— sino la **persistencia de marca y memoria organizacional acumulada**: el sistema ya sabe quién es la organización, cuál es su tono, cuáles son sus audiencias, cuál es su identidad visual y cuál es el historial de comunicaciones anteriores.

Los hallazgos de validación identificaron el JTBD principal del segmento:

> *Producir y publicar contenido institucional multi-canal de forma recurrente, cumpliendo la identidad gráfica de la organización, sin tener que dar contexto desde cero en cada sesión, y manteniendo coherencia entre campañas relacionadas, operando como responsable único o en equipo mínimo.*

El objetivo del MVP no es garantizar automatización total, sino demostrar un flujo extremo a extremo que permita:

- crear el **perfil institucional persistente** de la organización (una sola vez),
- producir contenido con **identidad institucional aplicada automáticamente**,
- adaptar piezas por canal (Instagram, WhatsApp, email, web),
- recuperar y reutilizar el contexto de comunicaciones anteriores,
- y medir y retroalimentar el ciclo.

En esta visión, el sistema se organiza en módulos funcionales claramente separados para distinguir:

- el **perfil institucional persistente** (BrandGuidelinesStore),
- la **planeación estratégica** con contexto institucional,
- la **adaptación creativa** con identidad institucional aplicada,
- el **ajuste del resultado** dentro del contexto acumulado,
- y la **memoria organizacional** (histórico y aprendizajes).

> **Segmento primario:** Comunicación institucional pública — alcaldías intermedias, gobernaciones, universidades públicas, entidades regulatorias (CRC, ministerios, entes de control). El marketing digital comercial es un caso de uso posible, no el núcleo del producto.

---

## 2. Módulos funcionales

---

## 2.1 Onboarding

### Descripción funcional

El módulo de Onboarding establece el contexto institucional y personal que el sistema usará en todas las interacciones posteriores. Su propósito es evitar que el usuario repita información en cada sesión y garantizar que los módulos de planeación y creación operen con datos coherentes desde el primer momento.

El onboarding se organiza en cuatro etapas principales:

1. **Extracción automática desde la web de la empresa** — el sistema analiza el sitio e intenta precargar información relevante para revisión del usuario.
2. **Enriquecimiento con manual de marca** — parámetros visuales oficiales (logos, colores, tipografías, reglas) que el sistema usará para generar piezas.
3. **Carga de histórico de campañas** — contexto de ejecuciones anteriores que mejora la pertinencia del plan de comunicación.
4. **Registro de la persona usuaria** — vinculación del colaborador a la empresa configurada.

La configuración institucional se realiza una sola vez por empresa y queda disponible para todos los usuarios asociados. Cuando un nuevo colaborador se incorpora a una empresa ya registrada, solo completa el paso de registro personal sin repetir las etapas anteriores.

---

### Etapa 1 — Extracción automática desde la web

#### Descripción

El proceso comienza cuando el usuario ingresa la URL del sitio web de su empresa. El sistema analiza las páginas principales e intenta extraer automáticamente la información más relevante. Esta extracción es **asistida, no garantizada**: los sitios web no están diseñados para ser leídos por sistemas y el resultado puede incluir contenido mezclado, redundante o incompleto.

Por eso, todo lo detectado se presenta al usuario para que lo revise, corrija y apruebe antes de continuar. El sistema asiste; el usuario decide.

**Información estructural que el sistema intenta detectar:**

| Campo | Descripción |
|---|---|
| Nombre de la empresa | Detectado desde títulos, encabezados o metadatos |
| Descripción general | Texto de "quiénes somos" o similar |
| Propuesta de valor | Mensajes de valor visibles en la página principal |
| Sector o industria | Inferido del contenido general |

**Productos y servicios:**

El sitio web generalmente no lista los productos en formato estructurado. El sistema extrae bloques de texto que pueden corresponder a servicios, áreas de trabajo, soluciones o líneas de negocio. Este contenido puede aparecer mezclado con artículos, noticias, estudios o eventos.

El usuario ve todo lo detectado y puede:
- seleccionar qué entradas corresponden a productos o servicios reales,
- editar el texto de cada entrada,
- agregar servicios que no fueron detectados,
- eliminar entradas que no correspondan.

**Ejemplo de extracción real (caso CINTEL):**

El sistema puede extraer fragmentos como:
- "Vigilancia tecnológica e inteligencia competitiva"
- "Transformación Digital — Acelerando la adopción de tecnología en empresas"
- "Publicaciones y estudios de prospectiva"
- "Noticias: CINTEL participa en evento de IA..."

De esos fragmentos, el usuario selecciona los que realmente son servicios y descarta los demás.

**Identidad visual detectada desde la web:**

Adicionalmente, el sistema intenta inferir elementos visuales a partir del CSS y las imágenes del sitio:

- colores primarios y secundarios utilizados en la interfaz
- logos visibles en la página
- estilos generales de la marca

Esta inferencia es aproximada. El usuario revisa y puede corregir o completar la información visual en la siguiente etapa (carga del manual de marca).

#### Diagramas de flujo

![Flujo completo de onboarding institucional](assets/img/diagramas/onboarding-completo.png)
<a href="assets/plantuml/onboarding-completo.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de usuario adicional](assets/img/diagramas/onboarding-usuario-adicional.png)
<a href="assets/plantuml/onboarding-usuario-adicional.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de administración y actualización posterior](assets/img/diagramas/onboarding-admin.png)
<a href="assets/plantuml/onboarding-admin.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida — información estructural validada

```markdown
## Perfil institucional (validado por el usuario)

**Empresa:** CINTEL
**Sector:** Innovación y transformación digital
**URL analizada:** https://cintel.co
**Descripción:** Centro de investigación y desarrollo en tecnologías de la información
  para el sector productivo y gubernamental colombiano.

**Propuesta de valor:** Conectar la innovación tecnológica con las necesidades reales
  del sector productivo.

**Productos y servicios seleccionados:**
- Vigilancia tecnológica e inteligencia competitiva
- Consultoría en transformación digital
- Estudios de prospectiva tecnológica
- Formación especializada en tecnologías emergentes

**Canales detectados:** LinkedIn, sitio web corporativo, correo institucional

**Identidad visual inferida:**
- Color primario detectado: #004B8D
- Color secundario detectado: #00A651
```

---

### Etapa 2 — Manual de marca

#### Descripción

Con la información estructural validada, el usuario puede cargar el manual de marca de la empresa en formato PDF. El sistema analiza el documento e intenta extraer los parámetros visuales oficiales. Al igual que con el scraping, la extracción es asistida: el usuario revisa y aprueba cada elemento antes de guardarlo.

Para el MVP, esta lectura documental se realiza con LLM multimodal como flujo principal y con validación humana de campos críticos. OCR no forma parte del flujo objetivo de V1.

Los parámetros extraídos del manual no se almacenan solo como referencia documental. Funcionan como **configuración activa** que el Agente Creativo usa al generar piezas: colores aplicados a fondos y textos, logos correctos según el formato, tipografías, zonas de seguridad, contrastes permitidos.

#### Logos

El sistema muestra una lista de logos detectados en el manual. Para cada logo el usuario puede:
- ver una vista previa,
- marcarlo como logo principal,
- asignarle un nombre o variante (ej: versión blanca, versión oscura, versión reducida),
- eliminarlo si no corresponde,
- reemplazarlo cargando una imagen alternativa.

**Reglas de uso de logos detectadas:**

- en qué tipo de piezas se usa cada variante,
- fondos permitidos y prohibidos,
- zona de seguridad mínima,
- restricciones de escala o proporción.

#### Paleta de colores

El sistema detecta los valores de color definidos en el manual y los presenta con:
- nombre del color (primario, secundario, acento, neutro, etc.),
- valor HEX o RGB,
- muestra visual del color,
- y campo para edición si el valor detectado no es exacto.

#### Tipografías y reglas adicionales

- fuentes institucionales para títulos y cuerpo,
- especificaciones de tamaño o jerarquía si están en el manual,
- reglas generales de marca aplicables a piezas digitales (proporciones, contrastes mínimos, formatos por canal).


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida — parámetros de marca configurados

```markdown
## Configuración de marca (validada por el usuario)

**Logos registrados:**
- Logo principal: cintel-logo-color.svg — uso general
- Logo blanco: cintel-logo-blanco.svg — fondos oscuros
- Ícono reducido: cintel-icono.svg — espacios pequeños

**Paleta de colores:**
- Primario: #004B8D (azul institucional) — fondos, cabeceras
- Secundario: #00A651 (verde de acento) — CTAs, destacados
- Neutro claro: #F5F5F5 — fondos de tarjetas
- Texto principal: #1A1A1A

**Tipografías:**
- Títulos: Montserrat Bold
- Cuerpo: Open Sans Regular

**Reglas de uso:**
- Zona de seguridad del logo: 20 px mínimo
- No deformar proporciones del logo
- Contraste mínimo texto/fondo: 4.5:1
- Instagram post: 1080×1080 px
- Banner LinkedIn: 1200×627 px
```

---

### Etapa 3 — Histórico de campañas

#### Descripción

El sistema permite cargar un archivo Excel (.xlsx) o CSV con el histórico de campañas anteriores de la empresa. Esta información es opcional pero mejora significativamente la pertinencia del plan de comunicación generado por el Agente Estratégico, ya que le da contexto sobre qué se ha comunicado antes, en qué canales y con qué resultados.

En el MVP no se requiere procesamiento avanzado: basta con que el sistema lea el archivo, muestre una vista previa al usuario para que valide el contenido, y almacene los datos de forma estructurada para que el agente pueda consultarlos.

**Contenido esperado del archivo:**
- nombre o descripción de la campaña,
- canal o canales usados,
- copy o mensaje principal,
- fechas de ejecución,
- resultados o métricas disponibles (si existen, no son obligatorios).

El usuario puede revisar las filas detectadas, corregir columnas mal interpretadas y confirmar antes de guardar.


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida — histórico cargado

```markdown
## Histórico de campañas (cargado desde archivo)

| Campaña | Canal | Copy principal | Resultado |
|---|---|---|---|
| ANDICOM 2025 | LinkedIn + Email | "La IA aplicada ya está aquí" | 320 registros |
| Estudio prospectiva 2024 | Email | "Descarga el informe..." | 140 descargas |
| Webinar transformación digital | LinkedIn | "Únete a la conversación..." | 85 asistentes |
```

---

### Etapa 4 — Registro de persona

#### Descripción

Con la empresa configurada, el usuario registra sus datos personales. Este paso lo vincula a la empresa y establece su perfil de uso.

**Datos capturados:**
- nombre y apellido,
- correo electrónico institucional,
- cargo o rol,
- canales de trabajo habituales.


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida

```markdown
## Perfil de usuario registrado

**Nombre:** María González
**Cargo:** Directora de Comunicaciones
**Empresa:** CINTEL
**Correo:** mgonzalez@cintel.co
**Canales habituales:** LinkedIn, Email institucional
```

---

### Etapa 5 — Alta de usuario adicional

#### Descripción

Cuando la empresa ya está registrada, un nuevo colaborador no repite ninguna de las etapas anteriores. El sistema ofrece un flujo reducido donde el usuario busca su empresa y solo completa sus datos personales. La configuración institucional, la marca y el histórico permanecen intactos.


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

---

### Etapa 6 — Administración posterior

#### Descripción

Un usuario con rol de administrador puede actualizar la información institucional en cualquier momento. Esto permite que el contexto evolucione sin reiniciar el proceso de onboarding:

- actualizar la descripción de la empresa o propuesta de valor,
- modificar la lista de productos y servicios,
- reemplazar o agregar logos,
- actualizar la paleta de colores o tipografías,
- cargar un nuevo manual de marca,
- actualizar el histórico de campañas,
- gestionar usuarios asociados (activar, desactivar, cambiar rol).

---

### Resumen del módulo

| Etapa | Actor | Frecuencia |
|---|---|---|
| Extracción desde web + validación | Primer usuario / administrador | Una vez por empresa |
| Manual de marca y configuración visual | Primer usuario / administrador | Una vez (actualizable) |
| Histórico de campañas | Primer usuario / administrador | Una vez (actualizable) |
| Registro de persona | Cada usuario nuevo | Una vez por usuario |
| Alta de usuario adicional | Nuevo colaborador en empresa existente | Cada nuevo colaborador |
| Administración y actualización | Administrador | Según cambios de marca o equipo |

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
<a href="assets/plantuml/agente-estrategico-flujo.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de reutilización de campaña anterior](assets/img/diagramas/agente-estrategico-reutilizacion.png)
<a href="assets/plantuml/agente-estrategico-reutilizacion.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de iteración conversacional](assets/img/diagramas/agente-estrategico-conversacion.png)
<a href="assets/plantuml/agente-estrategico-conversacion.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

---


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

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

## 2.3 Agente Creativo (Agente 2)

### Descripción funcional

El Agente Creativo es el módulo de producción del sistema. Toma como entrada el plan de campaña elaborado por el Agente Estratégico y lo convierte en materiales listos para publicar o producir.

Su trabajo se divide en dos fases distintas:

- **Fase 1 — Brief de diseño:** el sistema genera un brief creativo específico que detalla qué debe producirse, para quién, en qué tono, con qué mensaje, en qué canal y con qué restricciones visuales.
- **Fase 2 — Generación de piezas:** a partir del brief, el sistema genera una o varias piezas adaptadas al canal seleccionado (copy, estructura visual, variantes).

La diferencia entre estrategia, brief y pieza es fundamental para entender el producto:

| Concepto | Qué es |
|---|---|
| **Campaña** | El plan completo: objetivo, audiencia, canales, mensaje general |
| **Brief** | Instrucción específica de producción para un canal y formato concreto |
| **Pieza** | Material generado a partir del brief: copy, banner, post, mailing, etc. |
| **Resultado** | Métricas de desempeño asociadas a la pieza publicada |

Un brief puede generar múltiples piezas. Una campaña puede generar múltiples briefs.

---

### Fase 1 — Brief de diseño

A partir de la campaña seleccionada, el sistema construye un brief creativo que sirve como instrucción precisa para la producción de piezas.

**Campos del brief:**

| Campo | Descripción |
|---|---|
| Nombre del brief | Identificador del brief dentro de la campaña |
| Objetivo de comunicación | Qué debe lograr la pieza (registros, branding, conversión) |
| Audiencia objetivo | A quién va dirigida la pieza específica |
| Mensaje central | La idea principal que debe transmitir |
| Tono | Institucional, técnico, cercano, urgente, etc. |
| Canal | LinkedIn, Instagram, Email, Landing page, etc. |
| CTA | Llamado a la acción concreto |
| Tipo de pieza | Post, carrusel, banner, mailing, copy, etc. |
| Restricciones visuales | Reglas de marca: colores, tipografías, logo, zonas seguras |
| Observaciones | Consideraciones adicionales del usuario |

El brief es visible y editable antes de proceder a la generación de piezas.

**Ejemplo de brief generado:**

```
Nombre:           LinkedIn institucional — TD Sector Público 2025
Campaña base:     Transformación Digital 2025
Objetivo:         Generar leads calificados en entidades públicas
Audiencia:        Directivos de TI, líderes de digitalización
Canal:            LinkedIn
Tipo de pieza:    Post + artículo institucional
Mensaje central:  CINTEL acompaña al sector público en su transformación digital
Tono:             Institucional, experto, accesible
CTA:              "Descarga el estudio completo"
Restricciones:    Paleta institucional, logo CINTEL en esquina superior derecha
Observaciones:    Evitar lenguaje exclusivamente técnico. Incluir dato estadístico.
```


---

### Fase 2 — Generación de piezas

A partir del brief, el sistema genera las piezas adaptadas al canal. Cada pieza es una unidad de contenido lista para revisar, exportar o publicar.

**Ejemplos de piezas por canal:**

| Canal | Tipo de pieza |
|---|---|
| LinkedIn | Post institucional, artículo, carrusel |
| Instagram | Post visual, historia, carrusel de slides |
| Email | Mailing con asunto, cuerpo y CTA |
| Landing page | Copy de sección, headline, cuerpo, CTA |
| Banner digital | Texto + descripción de composición visual |
| Evento/Webinar | Pieza de convocatoria, follow-up post-evento |

Un brief puede generar múltiples variantes de una misma pieza (por ejemplo, versión corta y larga de un post de LinkedIn).


---

### Estructura jerárquica: Campaña → Brief → Piezas

El sistema organiza todos los activos en una estructura jerárquica navegable que permite rastrear el origen de cada pieza.

**Ejemplo funcional:**

```
Campaña: Transformación Digital 2025
├── Brief 1: LinkedIn institucional
│   ├── Pieza 1: Post "Acompañamos al sector público"
│   └── Pieza 2: Artículo "5 claves para la TD en entidades"
└── Brief 2: Instagram — captación de leads
    ├── Pieza 3: Post visual con CTA de descarga
    └── Pieza 4: Historia animada con link a whitepaper
```

Esta vista muestra claramente la trazabilidad completa desde el objetivo de la campaña hasta cada pieza publicable. Es navegable y expandible en la interfaz.


---

### Gestión de resultados

Una vez publicada una pieza, el sistema puede capturar métricas de desempeño. El mecanismo varía según el canal.

#### A. Piezas de Instagram — seguimiento automático

Para piezas publicadas en Instagram, el flujo de resultados permite:

1. El usuario copia o registra el **link de publicación** en el sistema.
2. El sistema consulta periódicamente las **métricas de la publicación**.
3. Los resultados se muestran en un **panel de desempeño** asociado a la pieza.

Métricas disponibles:
- Likes
- Comentarios
- Compartidos / Guardados
- Alcance
- Interacciones totales
- Engagement rate

> Este seguimiento es automático y no requiere carga manual de datos.


#### B. Otros canales — carga manual de resultados

Para canales distintos a Instagram (LinkedIn, Email, Landing page, Eventos, etc.), los resultados no se capturan automáticamente.

En estos casos, el flujo es el siguiente:

1. El usuario accede a la sección de resultados de la pieza.
2. Carga un archivo con los datos: **Excel (.xlsx)** o **CSV (.csv)**.
3. El sistema hace un preview de los datos importados.
4. El usuario confirma la asociación de resultados a la pieza correspondiente.

> Este proceso es un flujo de retroalimentación posterior, independiente del flujo de generación. No forma parte del proceso de producción en tiempo real del Agente Creativo.


---

### Diagramas del módulo

![Flujo general — Agente Creativo: fases y conexiones](assets/img/diagramas/agente-creativo-fases.png)
<a href="assets/plantuml/agente-creativo-fases.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de pieza Instagram → métricas automáticas](assets/img/diagramas/agente-creativo-instagram-resultados.png)
<a href="assets/plantuml/agente-creativo-instagram-resultados.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de pieza otros canales → carga manual de resultados](assets/img/diagramas/agente-creativo-feedback-manual.png)
<a href="assets/plantuml/agente-creativo-feedback-manual.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Relación jerárquica campaña → brief → piezas](assets/img/diagramas/agente-creativo-estructura-campana-brief-piezas.png)
<a href="assets/plantuml/agente-creativo-estructura-campana-brief-piezas.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

---

### Ejemplo completo de salida

#### Brief generado

```
Nombre:         LinkedIn institucional — TD Sector Público 2025
Campaña:        Transformación Digital 2025
Objetivo:       Generar leads — directivos de TI sector público
Canal:          LinkedIn
Tipo de pieza:  Post institucional
Mensaje:        CINTEL acompaña al sector público en su transformación digital
Tono:           Institucional, experto
CTA:            "Descarga el estudio completo"
```

#### Pieza generada (Post LinkedIn)

```
[Texto sugerido]

La transformación digital del sector público no es un destino, es un proceso.

Las entidades que avanzan con más seguridad tienen algo en común: un acompañamiento 
estructurado, con visión de largo plazo y experiencia en implementación.

En CINTEL llevamos más de 25 años ayudando a organizaciones a navegar ese camino — 
con evidencia, metodología y foco en resultados reales.

👉 Descarga nuestro estudio: "Ruta de Transformación Digital en el Sector Público"

→ [enlace]

#TransformaciónDigital #GobiernoDigital #CINTEL
```

#### Panel de resultados (Instagram)

```
Pieza: Post visual — "Ruta TD Sector Público"
Canal: Instagram
Fecha de publicación: 15/03/2025
Link registrado: instagram.com/p/xyz123

─────────────────────────────────────
  Likes           312
  Comentarios      18
  Guardados        47
  Alcance       4.200
  Interacciones   391
  Engagement     9,3%
─────────────────────────────────────
Última actualización: hace 4 horas
```

---

## 2.4 Ajuste de resultados (Iteración controlada)

### Descripción funcional

El módulo de Ajuste de resultados permite al usuario refinar, reorientar o mejorar cualquier salida generada por el sistema mediante instrucciones en lenguaje natural. No se trata de edición manual: el usuario no modifica el texto directamente, sino que le indica al agente cómo desea que cambie el resultado.

El agente recibe la versión anterior del resultado más la instrucción nueva, y genera una nueva versión orientada al cambio solicitado.

Este módulo aplica sobre los tres tipos de salida del sistema:

| Tipo de resultado | Módulo origen | Qué se ajusta |
|---|---|---|
| Plan de campaña | Agente Estratégico | Objetivo, audiencia, enfoque, tono general |
| Brief de diseño | Agente Creativo (fase 1) | Tono, mensaje, CTA, restricciones |
| Pieza generada | Agente Creativo (fase 2) | Extensión, lenguaje, llamado a la acción, estilo |

#### Qué problema resuelve

Sin este módulo, cualquier ajuste implicaría reiniciar el flujo completo desde el principio. El módulo de iteración permite que el usuario oriente al agente con una instrucción puntual, obteniendo una nueva versión sin perder el contexto acumulado.

#### Advertencia explícita (diseño obligatorio)

> **Este módulo no es determinístico.**
> El sistema no garantiza que la nueva versión respete exactamente todos los elementos de la versión anterior. Los resultados pueden variar entre iteraciones. La instrucción orienta al agente pero no controla con precisión cada detalle del output.

Este comportamiento debe estar visible en la interfaz en todo momento, para gestionar las expectativas del usuario.

---

### Tipos de ajuste

#### 1. Ajuste de estrategia

Aplica sobre el plan de campaña generado por el Agente Estratégico. El usuario puede solicitar cambios en la dirección general del plan sin reiniciar el proceso de onboarding.

Ejemplos de instrucciones válidas:

- "Cambia el objetivo principal a generación de leads"
- "Orienta el plan hacia audiencias más jóvenes, menores de 35 años"
- "Pon más énfasis en posicionamiento institucional, menos en conversión directa"
- "Reduce el número de canales propuestos y concéntralo en LinkedIn"

Qué puede cambiar: objetivo general, segmentación, canales priorizados, mensajes clave, KPIs propuestos.

#### 2. Ajuste de brief

Aplica sobre el brief de diseño generado en la fase 1 del Agente Creativo. El usuario puede modificar los parámetros que guiarán la generación de piezas.

Ejemplos de instrucciones válidas:

- "Hazlo más formal y menos conversacional"
- "Cambia el CTA a 'Solicita una demo'"
- "El mensaje principal debe hablar de impacto real, no de tecnología"
- "Agrega una restricción: no usar imágenes de stock genéricas"

Qué puede cambiar: tono, mensaje principal, CTA, restricciones, audiencia específica.

#### 3. Ajuste de pieza

Aplica sobre una pieza de contenido ya generada (post, artículo, email, etc.). El usuario puede solicitar cambios en el texto, extensión o enfoque.

Ejemplos de instrucciones válidas:

- "Reduce el texto a la mitad"
- "Hazlo más llamativo, usa un gancho más impactante en la primera línea"
- "Cambia el enfoque: habla de resultados, no de proceso"
- "Elimina los hashtags y ponlo en tono más serio"

Qué puede cambiar: extensión, estructura, tono, énfasis temático, elementos de formato.

---

### Flujo funcional

El flujo de ajuste es el mismo independientemente del tipo (estrategia, brief o pieza):

1. **El usuario visualiza el resultado actual** — plan, brief o pieza generada.
2. **El usuario escribe una instrucción** en lenguaje natural en el campo de ajuste.
3. **El sistema combina** el resultado anterior con la nueva instrucción y el contexto de campaña activo.
4. **El agente genera una nueva versión** del resultado.
5. **El usuario visualiza la nueva versión** junto a la anterior para comparar.
6. **El usuario decide** si aplica el ajuste, lo descarta o solicita una nueva iteración.

El sistema mantiene en todo momento el contexto de campaña (empresa, sector, servicios, audiencia) para que los ajustes sean coherentes con el plan general.

---

### Ejemplos de uso (completos)

#### Caso A — Ajuste de estrategia

El Agente Estratégico generó un plan orientado a posicionamiento de marca. El usuario quiere redirigirlo hacia generación de leads.

**Resultado original (fragmento):**

> Objetivo principal: Fortalecer el posicionamiento institucional de CINTEL como referente en transformación digital para el sector público.
> Canal prioritario: LinkedIn — contenido educativo.
> Métrica clave: Alcance orgánico y engagement.

**Instrucción del usuario:**
> "Hazlo más enfocado en leads. Quiero que el objetivo sea conseguir contactos calificados, no solo posicionamiento."

**Nueva versión generada (fragmento):**

> Objetivo principal: Generar leads calificados — directivos de TI y gerentes de transformación digital en entidades públicas.
> Canal prioritario: LinkedIn — contenido orientado a conversión con formularios de captación.
> Métrica clave: Leads generados por campaña, tasa de apertura en seguimiento por email.
>
> *Nota del sistema: Esta versión fue generada como ajuste orientado. Los elementos no mencionados en la instrucción pueden haber variado.*

#### Caso B — Ajuste de pieza

El Agente Creativo generó un post de LinkedIn con tono educativo. El usuario quiere una versión más corta y directa.

**Resultado original:**

> La transformación digital del sector público no es un destino, es un proceso. Las entidades que avanzan con más seguridad tienen algo en común: acompañamiento estructurado, con visión de largo plazo y experiencia en implementación. En CINTEL llevamos más de 25 años ayudando a organizaciones a navegar ese camino. 👉 Descarga nuestro estudio: "Ruta de Transformación Digital en el Sector Público"

**Instrucción del usuario:**
> "Reduce el texto y hazlo más directo. Solo el gancho y el CTA."

**Nueva versión generada:**

> 25 años acompañando la transformación digital del sector público en Colombia.
> 👉 Descarga el estudio: "Ruta de Transformación Digital" → [enlace]
>
> *Nota del sistema: Se redujo el cuerpo del texto según la instrucción. El tono y los hashtags pueden haberse ajustado.*

#### Caso C — Ajuste de brief

**Instrucción del usuario:**
> "Cambia el tono a institucional. Este brief es para un correo que va a secretarios de despacho."

**Nueva versión del campo tono en el brief:**

> Tono: Formal e institucional. Lenguaje directo, sin coloquialismos. Estructura de comunicación oficial. Evitar emojis, informalidades y frases tipo conversacional.

---

### Sugerencias guiadas

Para facilitar el uso del módulo, el sistema presenta sugerencias de ajuste según el contexto:

**Para estrategia:** "Hazlo más enfocado en leads" · "Cambia la audiencia objetivo" · "Reduce los canales propuestos" · "Ponlo más enfocado en sector público"

**Para brief:** "Hazlo más formal" · "Cambia el CTA" · "Agrega restricciones de imagen" · "Enfócalo en un segmento específico"

**Para piezas:** "Reduce el texto" · "Hazlo más llamativo" · "Cambia el enfoque a ventas" · "Elimina los hashtags"

Estas sugerencias se muestran como chips seleccionables en la interfaz (ver mockup).

---

### Integración con otros módulos

| Módulo | Rol en el ajuste |
|---|---|
| **2.2 Agente Estratégico** | Origen del plan de campaña ajustable |
| **2.3 Agente Creativo** | Origen del brief y las piezas ajustables |
| **2.5 Histórico** | Permite consultar versiones anteriores de un resultado |

El módulo de iteración no reemplaza a ninguno de los módulos anteriores: actúa como una capa de refinamiento sobre sus salidas.

---

### Diagramas

![Flujo de iteración controlada](assets/img/diagramas/iteracion-flujo.png)
<a href="assets/plantuml/iteracion-flujo.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Tipos de ajuste y su alcance](assets/img/diagramas/iteracion-tipos-ajuste.png)
<a href="assets/plantuml/iteracion-tipos-ajuste.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Integración con módulos del sistema](assets/img/diagramas/iteracion-integracion-modulos.png)
<a href="assets/plantuml/iteracion-integracion-modulos.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.
---

## 2.5 Histórico

### Descripción funcional

El módulo de Histórico es la memoria institucional del sistema. Almacena, organiza y permite recuperar toda la información generada durante el uso del Adaptador de Contenido Institucional: campañas, briefs, piezas y resultados.

Su función central no es solo archivar, sino permitir que el equipo **aprenda de lo que ya funcionó** y **reutilice ese conocimiento** para crear nuevas campañas de forma más eficiente.

**¿Por qué es importante?**

- Evita rehacer trabajo: el equipo puede recuperar campañas anteriores y adaptarlas.
- Facilita la comparación: se pueden contrastar resultados entre periodos o canales.
- Soporta la trazabilidad: cada pieza tiene un origen claro (campaña → brief → pieza).
- Alimenta la iteración: el Agente puede usar campañas pasadas como punto de partida.

**Conexión con otros módulos:**

| Módulo | Relación |
|---|---|
| 2.2 Agente Estratégico | Puede recibir un plan anterior como contexto inicial |
| 2.3 Agente Creativo | Puede recuperar briefs y piezas para reutilizar o mejorar |
| 2.4 Ajuste de resultados | Accede al histórico de versiones de un resultado |

---

### Funcionalidades

#### 1. Navegación de campañas

El usuario accede a un listado de todas las campañas registradas en el sistema, con capacidad de:

- **Filtrar** por año, tipo de campaña o canal
- **Buscar** por nombre o palabras clave
- **Ordenar** por fecha de creación o último acceso

Cada campaña muestra: nombre, fecha, canales involucrados y estado general.

#### 2. Visualización jerárquica

Cada campaña se organiza como una estructura expandible en tres niveles:

```
Campaña
├── Brief 1
│   ├── Pieza A (copy Instagram)
│   ├── Pieza B (copy LinkedIn)
│   └── Pieza C (asunto email)
└── Brief 2
    └── Pieza D (banner web)
```

Esta vista permite navegar el árbol completo de una campaña: desde el plan estratégico hasta cada pieza de contenido individual.

#### 3. Visualización de resultados

El módulo distingue dos tipos de datos de desempeño:

| Tipo | Origen | Métricas disponibles |
|---|---|---|
| **Automático** | Instagram (API / scraping) | Likes, comentarios, interacciones, engagement, alcance |
| **Manual** | CSV o Excel cargado por el usuario | Cualquier métrica que el equipo registre |

Los datos automáticos se identifican con un indicador visual diferenciado. Los datos manuales incluyen la fecha de carga y el archivo fuente.

#### 4. Reutilización de campañas

Desde cualquier campaña del histórico, el usuario puede iniciar una nueva ejecución basada en ella. El sistema carga el contexto de la campaña seleccionada y abre el Agente Estratégico con ese punto de partida.

**Ejemplo de uso:**

> **Usuario:** "Quiero ver campañas de 2024"
>
> **Sistema:** *(muestra lista filtrada: 4 campañas de 2024 — ANDICOM, Correo institucional, Lanzamiento IA, Black Friday)*
>
> **Usuario:** "Usa ANDICOM 2024 como base para 2025"
>
> **Sistema:** *(carga el plan, briefs y piezas de ANDICOM 2024 como contexto, inicia Agente Estratégico con ese punto de partida)*

#### 5. Trazabilidad

Cada elemento del histórico expone sus metadatos de origen:

- Fecha de creación
- Canal objetivo
- Objetivo de campaña
- Agente(s) que lo generaron
- Resultados asociados (si existen)

> **Alcance MVP:** Para la primera versión es suficiente con preservar la última versión de cada elemento y sus metadatos básicos. No se requiere versionado complejo ni gestión del ciclo de vida.

---

### Flujo funcional

1. El usuario accede al módulo de Histórico
2. Aplica filtros o busca una campaña específica (año, tipo, canal, nombre)
3. Selecciona una campaña del listado
4. Navega la estructura jerárquica (Campaña → Briefs → Piezas)
5. Consulta resultados disponibles: automáticos (Instagram) o cargados manualmente
6. Elige una acción:
   - **Ver detalle**: examina el contenido completo de la campaña
   - **Usar como base**: inicia nueva campaña cargando este contexto en el Agente Estratégico

---

### Advertencia sobre datos automáticos

> **Disponibilidad de métricas de Instagram:** El módulo puede mostrar métricas obtenidas automáticamente desde Instagram. Estos datos dependen de la disponibilidad del mecanismo de conexión configurado. Si no hay conexión activa o los datos no han sido sincronizados, el sistema mostrará únicamente la información cargada manualmente por el equipo.

---

### Diagramas

![Estructura jerárquica de campañas](assets/img/diagramas/historico-estructura.png)
<a href="assets/plantuml/historico-estructura.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Flujo de reutilización de campaña](assets/img/diagramas/historico-reutilizacion.png)
<a href="assets/plantuml/historico-reutilizacion.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>

![Fuentes de resultados](assets/img/diagramas/historico-resultados.png)
<a href="assets/plantuml/historico-resultados.puml" download class="diagram-download">⬇ Descargar fuente (.puml)</a>


> 🔗 **Mockups navegables** — Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.


---

## 3. Resumen del alcance MVP

En el MVP, la visión TO-BE prioriza demostrar el diferencial central desde el primer minuto de la sesión:

1. **[Onboarding institucional](to-be-onboarding.html)** — Creación del perfil institucional persistente. **La persistencia de marca debe ser el primer feature demostrado**, no la generación de contenido.
2. **[Contexto organizacional (BrandGuidelinesStore)](to-be-contexto.html)** — El sistema demuestra que ya conoce la organización en sesiones posteriores sin re-configuración.
3. **[Agente Estratégico](to-be-agente-estrategico.html)** — Propone plan de comunicación institucional usando el contexto acumulado.
4. **[Agente Creativo](to-be-agente-creativo.html)** — Adapta piezas por canal con identidad institucional aplicada. Usa banco de activos licenciados como flujo principal.
5. **[Ajuste de resultados](to-be-iteracion.html)** — Refinamiento dentro del contexto institucional acumulado.
6. **[Histórico y memoria](to-be-historico.html)** — Recuperar y retomar comunicaciones anteriores para continuidad temática.

Quedan por fuera del compromiso del MVP:

- consistencia garantizada entre iteraciones,
- publicación automática en todos los canales,
- versionado avanzado del perfil institucional,
- analítica profunda de resultados,
- y automatización cerrada del ciclo completo.

> **Restricción sobre imágenes:** El Agente Creativo **no debe usar generación IA de imágenes como flujo principal** para el segmento de comunicación institucional pública. Entidades como CRC tienen restricciones regulatorias explícitas sobre imágenes generadas por IA. El flujo principal debe basarse en un banco de activos licenciados cargados por la institución.

---

## 4. Nota de interpretación

Esta sección TO-BE debe entenderse como **referencia funcional objetivo post-validación** para apoyar decisiones de arquitectura, estimación y evolución del producto. Los módulos y flujos descritos reflejan los hallazgos de tres sesiones de validación JTBD realizadas en marzo 2026 con comunicadoras institucionales de CRC, I4DIGITAL/CENIT y Pro Montería.

El reposicionamiento del producto de "generador de campañas de marketing" a "Adaptador de Contenido Institucional" no es semántico: define el roadmap técnico, el diferencial frente a IAs generalistas y el argumento de venta ante el segmento institucional colombiano.

> Trazabilidad: `context/analisis_md/04_Resultados_Validacion_MKT_v2.docx.md` · `context/analisis_md/05_Decisiones_Producto_MKT_v2.docx.md`
