# TO-BE — Módulo 2.5: Histórico

> Módulo de memoria institucional. Permite navegar, consultar y reutilizar campañas anteriores generadas con el sistema.

---

## 2.5 Histórico

### Descripción funcional

El módulo de Histórico es la memoria institucional del sistema. Almacena, organiza y permite recuperar toda la información generada durante el uso del Agente de Marketing IA: campañas, briefs, piezas y resultados.

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

![Flujo de reutilización de campaña](assets/img/diagramas/historico-reutilizacion.png)

![Fuentes de resultados](assets/img/diagramas/historico-resultados.png)


> 🔗 **Prototipo navegable** — Consulte el flujo interactivo en la **[sección Prototipo navegable](mockup.html)**.


---