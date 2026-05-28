# TO-BE  Módulo 2.4: Agente Creativo

> Módulo de adaptación de contenido institucional. Transforma el plan estratégico en piezas adaptadas a la identidad de la institución y al canal específico, usando el perfil institucional persistente y el banco de activos licenciados.

> **Restricción crítica:** La generación de imágenes por IA **no debe ser el flujo principal** para el segmento de comunicación institucional pública. Entidades como CRC (Comisión de Regulación de Comunicaciones) tienen restricciones regulatorias explícitas sobre imágenes generadas por IA. El flujo principal debe basarse en el **banco de activos institucionales licenciados** cargados durante el onboarding.

---

## 2.4 Agente Creativo

### Descripción funcional

El Agente Creativo es el módulo de **adaptación** del sistema, no de generación desde cero. Toma como entrada el plan de comunicación elaborado por el Agente Estratégico y adapta el contenido a la identidad institucional de la organización y al canal específico, usando el perfil institucional persistente del BrandGuidelinesStore.

El hallazgo de validación es claro: el cuello de botella no es crear el texto, sino **pasar del texto a la pieza visual lista para publicar con la identidad institucional**. Este es el trabajo que más tiempo consume y el que menos herramientas resuelven de forma integrada.

> *"Lo que más le toma a uno tiempo es más que crear el contenido de la pieza... es más pasarlo al diseño... sobre todo en un tema de seguir la línea gráfica estipulada ya por la organización que tenemos que sí o sí llevar esa misma línea gráfica."*
>  Natalia Rozo Veloza, I4DIGITAL / CENIT

Su trabajo se divide en dos fases distintas:

- **Fase 1  Brief de diseño institucional:** el sistema genera un brief creativo específico que detalla qué debe producirse, para quién, en qué tono, con qué mensaje, en qué canal y con qué lineamientos visuales institucionales.
- **Fase 2  Adaptación de piezas:** a partir del brief y del banco de activos institucionales, el sistema adapta una o varias piezas al canal seleccionado (copy, estructura visual, variantes).

La diferencia entre estrategia, brief y pieza es fundamental para entender el producto:

| Concepto | Qué es |
|---|---|
| **Campaña** | El plan completo: objetivo, audiencia, canales, mensaje general |
| **Brief** | Instrucción específica de producción para un canal y formato concreto |
| **Pieza** | Material generado a partir del brief: copy, banner, post, mailing, etc. |
| **Resultado** | Métricas de desempeño asociadas a la pieza publicada |

Un brief puede generar múltiples piezas. Una campaña puede generar múltiples briefs.

---

### Fase 1  Brief de diseño

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

### Fase 2  Generación de piezas

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

### Estructura jerárquica: Campaña  Brief  Piezas

El sistema organiza todos los activos en una estructura jerárquica navegable que permite rastrear el origen de cada pieza.

**Ejemplo funcional:**

```
Campaña: Transformación Digital 2025
 Brief 1: LinkedIn institucional
    Pieza 1: Post "Acompañamos al sector público"
    Pieza 2: Artículo "5 claves para la TD en entidades"
 Brief 2: Instagram  captación de leads
     Pieza 3: Post visual con CTA de descarga
     Pieza 4: Historia animada con link a whitepaper
```

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

![Flujo general  Agente Creativo: fases y conexiones](assets/img/diagramas/agente-creativo-fases.png)
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

ltima actualización: hace 4 horas
```

---


