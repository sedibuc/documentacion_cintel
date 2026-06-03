# TO-BE — Módulo 2.4: Agente Creativo (sistema multi-agente)

> Módulo de adaptación de contenido institucional. Implementado como **sistema multi-agente**: un orquestador (CreativeAgent) genera el brief y delega la producción a agentes especializados por canal — LinkedInAgent, InstagramAgent, EmailAgent, WhatsAppAgent — ejecutándose en paralelo. Cada agente incorpora las mejores prácticas del destino desde el origen de la pieza.

> **Restricción crítica:** La generación de imágenes por IA **no debe ser el flujo principal** para el segmento de comunicación institucional pública. Entidades como CRC (Comisión de Regulación de Comunicaciones) tienen restricciones regulatorias explícitas sobre imágenes generadas por IA. El flujo principal debe basarse en el **banco de activos institucionales licenciados** cargados durante el onboarding.

---

## 2.4 Agente Creativo

### Descripción funcional

El Agente Creativo es un **sistema multi-agente** de adaptación de contenido institucional. No genera desde cero: toma el plan de comunicación del Agente Estratégico y lo transforma en piezas optimizadas para cada canal de destino, aplicando las mejores prácticas específicas de cada plataforma desde el origen de la producción.

El hallazgo de validación es claro: el cuello de botella no es crear el texto, sino **pasar del texto a la pieza visual lista para publicar con la identidad institucional**. Este es el trabajo que más tiempo consume y el que menos herramientas resuelven de forma integrada.

> *"Lo que más le toma a uno tiempo es más que crear el contenido de la pieza... es más pasarlo al diseño... sobre todo en un tema de seguir la línea gráfica estipulada ya por la organización que tenemos que sí o sí llevar esa misma línea gráfica."*
>  Natalia Rozo Veloza, I4DIGITAL / CENIT

> **Validado por experto técnico (P-05 / P-06 — Junio 2026):** *"El modelo base puede ser el mismo. Lo recomendado es tener agentes especializados por red social, cada uno con las mejores prácticas específicas del canal."* La especialización por canal no es una optimización diferible: es la decisión de arquitectura que garantiza que cada pieza nazca ya con las características del destino (longitud, estructura, hashtags, formato visual, tono) sin necesidad de post-procesar una salida genérica.

El módulo se organiza en tres fases y opera con cuatro agentes de canal especializados:

- **Fase 1 — Brief de diseño institucional:** el orquestador (CreativeAgent) construye un brief creativo específico consultando el BrandGuidelinesStore, con tono, mensaje, CTA, canal y restricciones visuales.
- **Fase 2 — Producción multicanal paralela:** el brief se despacha simultáneamente a los agentes de canal. Cada agente produce la pieza con las convenciones propias del destino.
- **Fase 3 — Evaluación y entrega:** el CriticAgent evalúa alineación institucional por pieza; las aprobadas se presentan al comunicador para revisión humana.

La diferencia entre estrategia, brief y pieza es fundamental para entender el producto:

| Concepto | Qué es |
|---|---|
| **Campaña** | El plan completo: objetivo, audiencia, canales, mensaje general |
| **Brief** | Instrucción específica de producción para un canal y formato concreto |
| **Pieza** | Material generado a partir del brief: copy, banner, post, mailing, etc. |
| **Resultado** | Métricas de desempeño asociadas a la pieza publicada |

Un brief puede generar múltiples piezas. Una campaña puede generar múltiples briefs.

---

### Arquitectura multi-agente del módulo creativo

> Validado: P-05 / P-06 — Junio 2026.

El módulo no es un agente monolítico que genera todas las piezas con el mismo prompt. Es un sistema de agentes con roles diferenciados:

<div class="diagram-block">
<p class="diagram-label">Arquitectura multi-agente — CreativeAgent como orquestador</p>
<img src="assets/img/diagramas/agente-creativo-multiagente.png" alt="Arquitectura multi-agente del Agente Creativo">
<div class="diagram-links">
<a href="assets/plantuml/agente-creativo-multiagente.plantuml" download> Fuente PlantUML</a>
</div>
</div>

| Agente | Rol | Conocimiento especializado incorporado |
|---|---|---|
| **CreativeAgent** (orquestador) | Construye el brief, coordina agentes de canal, consolida resultados | Estructura del brief, reglas de marca, validación humana |
| **LinkedInAgent** | Produce piezas para LinkedIn | Longitud óptima 150–300 palabras, hook-cuerpo-CTA, hashtags profesionales, artículo vs. post |
| **InstagramAgent** | Produce piezas para Instagram | Visual-first, caption breve, hashtags de engagement, stories vs. reels, ratio 1:1 o 4:5 |
| **EmailAgent** | Produce piezas para email | Asunto + preheader + cuerpo + CTA, evitar spam triggers, plantillas aprobadas |
| **WhatsAppAgent** | Produce piezas para WhatsApp | Brevedad máxima, tono conversacional, plantillas aprobadas HSM, límite de caracteres |
| **CriticAgent** | Evalúa alineación institucional de cada pieza | BrandGuidelinesStore, tono, blacklist/whitelist, restricciones de marca |

Los agentes de canal se ejecutan en **paralelo** para minimizar la latencia total. Cada agente incorpora el conocimiento del canal en su rol — no como configuración externa — lo que mejora la calidad y reduce la necesidad de instruccionarlo en cada solicitud. Un **CriticAgent** evalúa alineación institucional antes de presentar las piezas al comunicador.

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
Nombre:           LinkedIn institucional  TD Sector Público 2025
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

### Fase 2 — Producción multicanal paralela (agentes especializados)

A partir del brief aprobado, el CreativeAgent lo despacha simultáneamente a todos los agentes de canal activos. Cada agente produce la pieza desde el origen con las características específicas del destino: no es un post genérico reformateado, sino una pieza concebida para ese canal.

**Diferencia clave respecto a un agente único:**

| Enfoque | Resultado |
|---|---|
| **Agente único** (genérico) | Genera texto base → se adapta en post-procesamiento → piezas homogéneas que no explotan las características del canal |
| **Multi-agente especializado** | Cada agente genera la pieza con las convenciones del destino desde el origen → piezas optimizadas nativamente para cada canal |

**Salidas por agente especializado:**

| Agente | Tipo de piezas que produce |
|---|---|
| **LinkedInAgent** | Post institucional (150–300 palabras), artículo técnico, carrusel con slides |
| **InstagramAgent** | Post visual con caption breve, historia, carrusel de slides, descripción de composición visual |
| **EmailAgent** | Mailing completo: asunto, preheader, cuerpo estructurado, CTA |
| **WhatsAppAgent** | Mensaje breve conversacional, plantilla aprobada HSM |

Cada agente puede generar múltiples variantes (por ejemplo, versión corta y larga del post de LinkedIn). Los artefactos pesados (imágenes, videos) se almacenan con **ADK Artifacts** para ser reutilizables.


---

### Estructura jerárquica: Campaña  Brief  Piezas

El sistema organiza todos los activos en una estructura jerárquica navegable que permite rastrear el origen de cada pieza.

**Ejemplo funcional:**

<div class="diagram-block">
<p class="diagram-label">Estructura jerárquica: Campaña → Brief → Piezas</p>
<img src="assets/img/diagramas/agente-creativo-estructura-campana-brief-piezas.png" alt="Estructura jerárquica Campaña — Brief — Piezas">
<div class="diagram-links">
<a href="assets/plantuml/agente-creativo-estructura-campana-brief-piezas.plantuml" download> Fuente PlantUML</a>
</div>
</div>

Esta vista muestra claramente la trazabilidad completa desde el objetivo de la campaña hasta cada pieza publicable. Es navegable y expandible en la interfaz.


---

### Gestión de resultados

Una vez publicada una pieza, el sistema puede capturar métricas de desempeño. El mecanismo varía según el canal.

#### A. Piezas de Instagram  seguimiento automático

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


#### B. Otros canales  carga manual de resultados

Para canales distintos a Instagram (LinkedIn, Email, Landing page, Eventos, etc.), los resultados no se capturan automáticamente.

En estos casos, el flujo es el siguiente:

1. El usuario accede a la sección de resultados de la pieza.
2. Carga un archivo con los datos: **Excel (.xlsx)** o **CSV (.csv)**.
3. El sistema hace un preview de los datos importados.
4. El usuario confirma la asociación de resultados a la pieza correspondiente.

> Este proceso es un flujo de retroalimentación posterior, independiente del flujo de generación. No forma parte del proceso de producción en tiempo real del Agente Creativo.


---

### Diagramas del módulo

![Arquitectura multi-agente — CreativeAgent como orquestador](assets/img/diagramas/agente-creativo-multiagente.png)
<a href="assets/plantuml/agente-creativo-multiagente.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Flujo general  Agente Creativo: fases y producción paralela por canal](assets/img/diagramas/agente-creativo-fases.png)
<a href="assets/plantuml/agente-creativo-fases.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Relación jerárquica campaña  brief  piezas](assets/img/diagramas/agente-creativo-estructura-campana-brief-piezas.png)
<a href="assets/plantuml/agente-creativo-estructura-campana-brief-piezas.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Flujo de pieza Instagram  métricas automáticas](assets/img/diagramas/agente-creativo-instagram-resultados.png)
<a href="assets/plantuml/agente-creativo-instagram-resultados.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Flujo de pieza otros canales  carga manual de resultados](assets/img/diagramas/agente-creativo-feedback-manual.png)
<a href="assets/plantuml/agente-creativo-feedback-manual.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

>  **Prototipo navegable**  Consulte el flujo interactivo del agente en la **[sección Prototipo navegable](mockup.html)**.

---

### Ejemplo completo de salida

#### Brief generado

```
Nombre:         LinkedIn institucional  TD Sector Público 2025
Campaña:        Transformación Digital 2025
Objetivo:       Generar leads  directivos de TI sector público
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

En CINTEL llevamos más de 25 años ayudando a organizaciones a navegar ese camino  
con evidencia, metodología y foco en resultados reales.

 Descarga nuestro estudio: "Ruta de Transformación Digital en el Sector Público"

 [enlace]

#TransformaciónDigital #GobiernoDigital #CINTEL
```

#### Panel de resultados (Instagram)

```
Pieza: Post visual  "Ruta TD Sector Público"
Canal: Instagram
Fecha de publicación: 15/03/2025
Link registrado: instagram.com/p/xyz123


  Likes           312
  Comentarios      18
  Guardados        47
  Alcance       4.200
  Interacciones   391
  Engagement     9,3%

Última actualización: hace 4 horas
```

---

## Principios de diseño del sistema multi-agente — validados por experto técnico

> Validado: P-04 / P-05 / P-06 — Junio 2026.

### Generación de imagen con IA — patrón crítico-evaluador

Para organizaciones que permiten imágenes generadas por IA (sin restricciones regulatorias como las de CRC), se adopta el **patrón crítico-evaluador**:

1. Un agente generador produce la imagen usando un prompt técnico detallado, few-shots de diseños previos y lineamientos tipográficos de la marca.
2. Un agente evaluador (con rol de *Art Director*) examina si la imagen cumple con los lineamientos institucionales y devuelve feedback.
3. Se itera hasta alcanzar el score mínimo definido para la organización.

La persona del agente generador sigue el perfil de *UI/UX Social Media Art Director*, con instrucciones que incluyen canal destino, estilo visual, principios de diseño (jerarquía, psicología del color, composición) y prompts técnicos detallados.

**El flujo principal sigue basándose en el banco de activos institucionales licenciados para entidades con restricciones regulatorias.**

### Especialización por canal — decisión de arquitectura, no optimización

La especialización por canal es la decisión central del módulo. Cada agente incorpora el conocimiento del canal en su rol (no como configuración externa), lo que garantiza que cada pieza nazca ya adaptada al destino:

| Agente | Instrucciones especializadas | Tools |
|---|---|---|
| **LinkedInAgent** | Mejores prácticas LinkedIn: longitud, formato, hashtags, CTA profesional | Ver historial, crear artefactos, consultar marca |
| **InstagramAgent** | Mejores prácticas Instagram: visual-first, historias, reels, engagement | Ver historial, crear artefactos visuales |
| **WhatsAppAgent** | Mejores prácticas WhatsApp: brevedad, tono conversacional, CTA directo | Plantillas aprobadas |
| **EmailAgent** | Mejores prácticas email: asunto, preheader, estructura, tasa de apertura | Plantillas aprobadas, métricas históricas |

- Los agentes de canal se ejecutan en **paralelo** para minimizar latencia.
- Cada agente de canal va acompañado del **CriticAgent** que evalúa la alineación institucional antes de presentar la pieza al comunicador.
- Los artefactos pesados (imágenes, videos) se almacenan usando **ADK Artifacts** para ser reutilizables entre agentes.

### Reglas de diseño del agente

| Principio | Descripción |
|---|---|
| **1–3 objetivos por agente** | El CreativeAgent tiene objetivo único: transformar el brief en piezas alineadas con la marca. Agentes de canal tienen un objetivo: producir piezas óptimas para esa red. |
| **Tools explícitas** | BrandGuidelinesStore (tono, blacklist/whitelist, restricciones), banco de activos, historial de piezas aprobadas. |
| **Skills ADK** | ADK Skills para mejorar plan, razonamiento y actuación del agente. |
| **Artefactos** | ADK Artifacts para gestión de activos visuales/multimedia entre agentes. |

