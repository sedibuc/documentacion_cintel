# TO-BE  Módulo 2.6: Histórico y memoria organizacional

> Módulo de memoria institucional acumulada. Permite navegar, consultar y retomar comunicaciones anteriores para continuidad temática, aprendizaje y reutilización.

---

## 2.6 Histórico y memoria organizacional

### Descripción funcional

El módulo de Histórico es la **memoria organizacional acumulada** del sistema. No solo archiva comunicaciones pasadas: permite que el equipo **retome hilos temáticos anteriores**, haga segundas partes de comunicaciones y mantenga coherencia a lo largo del tiempo sin perder contexto.

Este cluster de dolor fue identificado en la validación con alta relevancia cruzada:

> *"Cada vez que yo vaya a crear una campaña tengo que crear una nueva campaña... digamos que voy a hacer una campaña sobre los aceites... pero luego quiero hacer una segunda parte... Como cuando uno va a ChatGPT tiene diferentes chats de diferentes temas y decirle: '¿te acuerdas que hicimos una campaña hace dos meses sobre los aceites? Vamos a hacer la segunda parte.'"*
>  Verónica Rangel Jaller, Pro Montería

> *"Voy a traer el histórico y ese histórico me va a permitir complementar la información para que con base en ella yo pueda construir una campaña más ajustada a la realidad conforme a lo que ya se venía haciendo."*
>  Ana Elizabeth Parra Benítez, CRC

**Funciones del módulo:**

- Evita rehacer trabajo: recupera comunicaciones anteriores y las adapta.
- Facilita la comparación entre periodos o canales.
- Soporta la trazabilidad: cada pieza tiene origen claro (objetivo  plan  brief  pieza).
- Alimenta la iteración: el Agente Estratégico usa el histórico como contexto de continuidad.
- Acumula aprendizajes: qué funcionó, qué no, métricas básicas y feedback del equipo.

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
 Brief 1
    Pieza A (copy Instagram)
    Pieza B (copy LinkedIn)
    Pieza C (asunto email)
 Brief 2
     Pieza D (banner web)
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
> **Sistema:** *(muestra lista filtrada: 4 campañas de 2024  ANDICOM, Correo institucional, Lanzamiento IA, Black Friday)*
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
4. Navega la estructura jerárquica (Campaña  Briefs  Piezas)
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
<a href="assets/plantuml/historico-estructura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Flujo de reutilización de campaña](assets/img/diagramas/historico-reutilizacion.png)
<a href="assets/plantuml/historico-reutilizacion.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

![Fuentes de resultados](assets/img/diagramas/historico-resultados.png)
<a href="assets/plantuml/historico-resultados.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>


>  **Prototipo navegable**  Consulte el flujo interactivo en la **[sección Prototipo navegable](mockup.html)**.



