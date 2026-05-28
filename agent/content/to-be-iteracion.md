# TO-BE  Módulo 2.4: Ajuste de resultados (Iteración controlada)

> Módulo de refinamiento iterativo. Permite ajustar cualquier resultado generado mediante instrucciones en lenguaje natural.

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

1. **El usuario visualiza el resultado actual**  plan, brief o pieza generada.
2. **El usuario escribe una instrucción** en lenguaje natural en el campo de ajuste.
3. **El sistema combina** el resultado anterior con la nueva instrucción y el contexto de campaña activo.
4. **El agente genera una nueva versión** del resultado.
5. **El usuario visualiza la nueva versión** junto a la anterior para comparar.
6. **El usuario decide** si aplica el ajuste, lo descarta o solicita una nueva iteración.

El sistema mantiene en todo momento el contexto de campaña (empresa, sector, servicios, audiencia) para que los ajustes sean coherentes con el plan general.

---

### Ejemplos de uso (completos)

#### Caso A  Ajuste de estrategia

El Agente Estratégico generó un plan orientado a posicionamiento de marca. El usuario quiere redirigirlo hacia generación de leads.

**Resultado original (fragmento):**

> Objetivo principal: Fortalecer el posicionamiento institucional de CINTEL como referente en transformación digital para el sector público.
> Canal prioritario: LinkedIn  contenido educativo.
> Métrica clave: Alcance orgánico y engagement.

**Instrucción del usuario:**
> "Hazlo más enfocado en leads. Quiero que el objetivo sea conseguir contactos calificados, no solo posicionamiento."

**Nueva versión generada (fragmento):**

> Objetivo principal: Generar leads calificados  directivos de TI y gerentes de transformación digital en entidades públicas.
> Canal prioritario: LinkedIn  contenido orientado a conversión con formularios de captación.
> Métrica clave: Leads generados por campaña, tasa de apertura en seguimiento por email.
>
> *Nota del sistema: Esta versión fue generada como ajuste orientado. Los elementos no mencionados en la instrucción pueden haber variado.*

#### Caso B  Ajuste de pieza

El Agente Creativo generó un post de LinkedIn con tono educativo. El usuario quiere una versión más corta y directa.

**Resultado original:**

> La transformación digital del sector público no es un destino, es un proceso. Las entidades que avanzan con más seguridad tienen algo en común: acompañamiento estructurado, con visión de largo plazo y experiencia en implementación. En CINTEL llevamos más de 25 años ayudando a organizaciones a navegar ese camino.  Descarga nuestro estudio: "Ruta de Transformación Digital en el Sector Público"

**Instrucción del usuario:**
> "Reduce el texto y hazlo más directo. Solo el gancho y el CTA."

**Nueva versión generada:**

> 25 años acompañando la transformación digital del sector público en Colombia.
>  Descarga el estudio: "Ruta de Transformación Digital"  [enlace]
>
> *Nota del sistema: Se redujo el cuerpo del texto según la instrucción. El tono y los hashtags pueden haberse ajustado.*

#### Caso C  Ajuste de brief

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
<a href="assets/plantuml/iteracion-flujo.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Tipos de ajuste y su alcance](assets/img/diagramas/iteracion-tipos-ajuste.png)
<a href="assets/plantuml/iteracion-tipos-ajuste.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Integración con módulos del sistema](assets/img/diagramas/iteracion-integracion-modulos.png)
<a href="assets/plantuml/iteracion-integracion-modulos.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>


>  **Prototipo navegable**  Consulte el flujo interactivo en la **[sección Prototipo navegable](mockup.html)**.
