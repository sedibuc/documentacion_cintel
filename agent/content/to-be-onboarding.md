# TO-BE  Módulo 2.1: Onboarding institucional

> Módulo de creación del perfil institucional persistente. Su propósito no es configurar una sesión: es crear el **contexto organizacional acumulado** que el sistema usará en todas las interacciones posteriores, sin que el comunicador vuelva a re-explicar quién es la institución.

> **Principio de diseño del demo:** La persistencia de marca debe ser el primer feature demostrado en los primeros 2 minutos de la sesión, no la generación de contenido. Si el demo no demuestra este diferencial de inmediato, los usuarios con madurez tecnológica (early adopters clave) no percibirán diferencial frente a ChatGPT.

---

## 2.1 Onboarding institucional

### Descripción funcional

El módulo de Onboarding institucional crea el **perfil institucional persistente** de la organización: el conjunto de datos que el sistema usará en todas las interacciones posteriores para adaptar el contenido con identidad institucional automáticamente. Su propósito no es capturar datos para una sola sesión, sino construir la **memoria institucional** que elimina la sobrecarga de dar contexto desde cero en cada sesión.

El onboarding se organiza en cinco etapas:

1. **Extracción automática desde la web de la institución**  el sistema analiza el sitio e intenta precargar información institucional para revisión del usuario.
2. **Enriquecimiento con manual de marca / lineamientos visuales**  parámetros visuales oficiales (logos, colores, tipografías, reglas) que el sistema usará para adaptar piezas.
3. **Captura de tono, audiencias y canales**  cómo comunica la institución, a quién y por dónde.
4. **Carga de activos licenciados y restricciones**  banco de imágenes propias con derechos, restricciones regulatorias sobre generación de imágenes IA, flujos de aprobación.
5. **Registro de la persona usuaria**  vinculación del comunicador a la institución configurada.

La configuración institucional se realiza **una sola vez** y queda disponible para todos los usuarios asociados. Cuando un nuevo colaborador se incorpora a una institución ya registrada, solo completa el registro personal.

---

### Etapa 1  Extracción automática desde la web

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

**Ejemplo de extracción real (caso CINTEL):**

El sistema puede extraer fragmentos como:

De esos fragmentos, el usuario selecciona los que realmente son servicios y descarta los demás.

**Identidad visual detectada desde la web:**

Adicionalmente, el sistema intenta inferir elementos visuales a partir del CSS y las imágenes del sitio:


Esta inferencia es aproximada. El usuario revisa y puede corregir o completar la información visual en la siguiente etapa (carga del manual de marca).

#### Diagrama de flujo  extracción web

![Flujo de scraping y extracción de información de la empresa](assets/img/diagramas/flujo-scraping.png)

<a href="assets/plantuml/flujo-scraping.plantuml" download class="diagram-download">Descargar fuente (.plantuml)</a>

>  **Prototipo navegable**  Consulte el flujo interactivo completo en la **[sección Prototipo navegable](mockup.html)**.

#### Ejemplo de salida  información estructural validada

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

### Etapa 2  Manual de marca

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


>  **Mockups navegables**  Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida  parámetros de marca configurados

```markdown
## Configuración de marca (validada por el usuario)

**Logos registrados:**
- Logo principal: cintel-logo-color.svg  uso general
- Logo blanco: cintel-logo-blanco.svg  fondos oscuros
- Ícono reducido: cintel-icono.svg  espacios pequeños

**Paleta de colores:**
- Primario: #004B8D (azul institucional)  fondos, cabeceras
- Secundario: #00A651 (verde de acento)  CTAs, destacados
- Neutro claro: #F5F5F5  fondos de tarjetas
- Texto principal: #1A1A1A

**Tipografías:**
- Títulos: Montserrat Bold
- Cuerpo: Open Sans Regular

**Reglas de uso:**
- Zona de seguridad del logo: 20 px mínimo
- No deformar proporciones del logo
- Contraste mínimo texto/fondo: 4.5:1
- Instagram post: 10801080 px
- Banner LinkedIn: 1200627 px
```

---

### Etapa 3  Histórico de campañas

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


>  **Mockups navegables**  Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

#### Ejemplo de salida  histórico cargado

```markdown
## Histórico de campañas (cargado desde archivo)

| Campaña | Canal | Copy principal | Resultado |
|---|---|---|---|
| ANDICOM 2025 | LinkedIn + Email | "La IA aplicada ya está aquí" | 320 registros |
| Estudio prospectiva 2024 | Email | "Descarga el informe..." | 140 descargas |
| Webinar transformación digital | LinkedIn | "nete a la conversación..." | 85 asistentes |
```

---

### Etapa 4  Registro de persona

#### Descripción

Con la empresa configurada, el usuario registra sus datos personales. Este paso lo vincula a la empresa y establece su perfil de uso.

**Datos capturados:**
- nombre y apellido,
- correo electrónico institucional,
- cargo o rol,
- canales de trabajo habituales.


>  **Mockups navegables**  Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

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

### Etapa 5  Alta de usuario adicional

#### Descripción

Cuando la empresa ya está registrada, un nuevo colaborador no repite ninguna de las etapas anteriores. El sistema ofrece un flujo reducido donde el usuario busca su empresa y solo completa sus datos personales. La configuración institucional, la marca y el histórico permanecen intactos.


>  **Mockups navegables**  Los prototipos de este módulo están centralizados en la **[sección 7. Mockup](mockup.html)**. Desde allí puede recorrer el flujo completo del sistema.

---

### Etapa 6  Administración posterior

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

### Diagramas del módulo

![Flujo completo de onboarding institucional](assets/img/diagramas/onboarding-completo.png)
<a href="assets/plantuml/onboarding-completo.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Registro de empresa nueva](assets/img/diagramas/onboarding-empresa.png)
<a href="assets/plantuml/onboarding-empresa.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Alta de usuario adicional](assets/img/diagramas/onboarding-usuario-adicional.png)
<a href="assets/plantuml/onboarding-usuario-adicional.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Flujo de administración](assets/img/diagramas/onboarding-admin.png)
<a href="assets/plantuml/onboarding-admin.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Actualización por administrador](assets/img/diagramas/onboarding-admin-actualizacion.png)
<a href="assets/plantuml/onboarding-admin-actualizacion.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>
