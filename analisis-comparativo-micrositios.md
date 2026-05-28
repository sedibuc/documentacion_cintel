# Analisis comparativo de micrositios: RAG y agent

## Resumen ejecutivo
Se realizo un analisis integral de los micrositios `RAG` y `agent` para alinear su arquitectura documental, navegacion y experiencia de uso sin mezclar contenido funcional de negocio.

Hallazgos clave:
- `agent` presentaba mayor profundidad documental y una taxonomia mas completa de TO-BE y decisiones tecnicas.
- `RAG` tenia base solida de AS-IS/TO-BE, pero con menor desagregacion estructural en contexto, decisiones por modulos, cronograma y cierre.
- Ambos micrositios ya compartian motor tecnico (shell + markdown + estilos), lo que facilito una normalizacion incremental.

Resultado:
- Se definio y aplico una estructura objetivo comun comparable.
- Se creo un portal raiz para acceso unificado.
- Se actualizaron README de ambos micrositios y README raiz.
- Se agregaron enlaces de retorno al portal desde ambos micrositios.

## Tabla de paginas encontradas en /RAG

| Pagina | Estado | Tipo |
|---|---|---|
| index.html | existente | Inicio |
| contexto.html | creada | Contexto |
| diagnostico.html | existente | AS-IS |
| arquitectura.html | existente | AS-IS |
| brechas.html | existente | AS-IS |
| despliegue.html | existente | AS-IS |
| costos.html | existente | AS-IS |
| mockup.html | creada | Mockup |
| mockup-to-be.html | existente | Mockup avanzado |
| tobefuncional.html | existente | TO-BE funcional |
| arquitectura-tobe.html | existente | TO-BE arquitectura |
| no-es-rag.html | existente | Marco conceptual |
| decisiones-modulos.html | creada | Decisiones |
| cronograma-implementacion.html | creada | Planificacion |
| preguntasexperto.html | existente | Preguntas experto |
| conclusiones.html | creada | Cierre |

## Tabla de paginas encontradas en /agent

| Pagina | Estado | Tipo |
|---|---|---|
| index.html | existente | Inicio |
| contexto.html | creada | Contexto |
| diagnostico.html | existente | AS-IS |
| arquitectura.html | existente | AS-IS |
| brechas.html | existente | AS-IS |
| despliegue.html | existente | AS-IS |
| costos.html | existente | AS-IS |
| mockup.html | existente | Mockup |
| to-be.html | existente | TO-BE funcional |
| to-be-objetivos-funcionales.html | existente | TO-BE detalle |
| to-be-onboarding.html | existente | TO-BE detalle |
| to-be-contexto.html | existente | TO-BE detalle |
| to-be-agente-estrategico.html | existente | TO-BE detalle |
| to-be-agente-creativo.html | existente | TO-BE detalle |
| to-be-iteracion.html | existente | TO-BE detalle |
| to-be-historico.html | existente | TO-BE detalle |
| to-be-arquitectura.html | existente | TO-BE arquitectura |
| decisiones-modulos.html | existente | Decisiones |
| decisiones-modulos-contexto-datos.html | existente | Decisiones |
| decisiones-modulos-agentes-canales.html | existente | Decisiones |
| decisiones-modulos-gobernanza-operacion.html | existente | Decisiones |
| decisiones-modulos-seguridad-escalado.html | existente | Decisiones |
| cronograma-implementacion-sprints.html | existente | Planificacion |
| preguntas-experto-tecnico.html | existente | Preguntas experto |
| analisis-cambio-contexto-to-be.html | existente | Analisis |
| diagnostico-diferencias-rg-vs-to-be-optimizado.html | existente | Analisis |
| conclusiones.html | creada | Cierre |

## Tabla comparativa de equivalencias

| Estructura objetivo | RAG | agent | Observacion |
|---|---|---|---|
| Inicio | index.html | index.html | Equivalente |
| Contexto del proyecto | contexto.html | contexto.html | Equivalente (nuevo en ambos para menu) |
| Diagnostico | diagnostico.html | diagnostico.html | Equivalente |
| Brechas | brechas.html | brechas.html | Equivalente |
| Arquitectura AS-IS | arquitectura.html | arquitectura.html | Equivalente |
| Arquitectura TO-BE | arquitectura-tobe.html | to-be-arquitectura.html | Equivalente semantico |
| Propuesta funcional TO-BE | tobefuncional.html | to-be.html | Equivalente semantico |
| Decisiones de diseno/modulos | decisiones-modulos.html | decisiones-modulos.html (+ subpaginas) | agent mas profundo |
| Mockup/prototipo | mockup.html + mockup-to-be.html | mockup.html | Equivalente |
| Costos | costos.html | costos.html | Equivalente |
| Cronograma | cronograma-implementacion.html | cronograma-implementacion-sprints.html | Equivalente semantico |
| Despliegue | despliegue.html | despliegue.html | Equivalente |
| Preguntas experto | preguntasexperto.html | preguntas-experto-tecnico.html | Equivalente semantico |
| Conclusiones | conclusiones.html | conclusiones.html | Equivalente (nuevo) |
| README | README.md | README.md | Actualizado en ambos |

## Brechas estructurales detectadas

1. `RAG` no tenia pagina explicita de contexto en navegacion principal.
2. `RAG` no tenia una seccion dedicada de decisiones por modulos.
3. `RAG` no tenia cronograma de implementacion navegable.
4. Ninguno de los micrositios tenia enlace directo al home raiz (no existia home raiz).
5. `agent` no tenia pagina de conclusiones navegable.
6. Ambos README estaban desalineados respecto al estado actual del repositorio.

## Cambios realizados en /RAG

### Navegacion y estructura
- Se agrego enlace al portal raiz en el menu lateral.
- Se agregaron entradas de menu para:
  - Contexto
  - Mockup
  - Decisiones por modulos
  - Cronograma
  - Conclusiones

### Nuevas paginas HTML
- `contexto.html`
- `mockup.html`
- `decisiones-modulos.html`
- `cronograma-implementacion.html`
- `conclusiones.html`

### Nuevos contenidos Markdown
- `content/contexto.md`
- `content/mockup.md`
- `content/decisiones-modulos.md`
- `content/cronograma-implementacion.md`
- `content/conclusiones.md`

### Ajustes de configuracion JS
- Se actualizaron claves de paginas y titulos en `assets/js/app.js` para soportar las nuevas rutas.

## Cambios realizados en /agent

### Navegacion y estructura
- Se agrego enlace al portal raiz en el menu lateral.
- Se agregaron entradas de menu para:
  - Contexto
  - Conclusiones

### Nuevas paginas HTML
- `contexto.html`
- `conclusiones.html`

### Nuevos contenidos Markdown
- `content/contexto.md`
- `content/conclusiones.md`

### Ajustes de configuracion JS
- Se actualizaron claves de paginas y titulos en `assets/js/app.js` para incluir contexto y conclusiones.

## Cambios realizados en el home raiz

Se creo `index.html` en la raiz con:
- Titulo general del portafolio.
- Descripcion de objetivo documental.
- Dos tarjetas principales:
  - Micrositio RAG / Document Intelligence
  - Micrositio Agentes de IA
- Enlaces de acceso directo a:
  - `RAG/index.html`
  - `agent/index.html`
- Enlaces a README de cada micrositio.
- Estilo visual consistente con la familia grafica de ambos sitios.

## Recomendaciones finales

1. Mantener la estructura comun en futuras iteraciones para conservar comparabilidad.
2. Si se agregan subpaginas nuevas en un micrositio, evaluar equivalencia estructural en el otro.
3. Mantener fuera de navegacion publica artefactos tecnicos (logs, replay, arboles, notas operativas).
4. Revisar periodicamente la consistencia entre `assets/partials/site-shell.html` y `assets/js/app.js` en cada micrositio.
5. Considerar una convencion unificada de nombres para preguntas de experto (guiones) en una futura iteracion controlada.

## Archivos no modificados y razon

- Logs y replays en `agent/` (`hs_err_*`, `replay_*`): no se modifican por ser artefactos tecnicos.
- Carpeta `agent/.venv/`: no se modifica por restriccion explicita de entorno.
- Archivos en `notes/`, `source/`, `scripts/`, `context/`: se mantuvieron para preservar trazabilidad y no introducir cambios funcionales innecesarios.
- `RAG/mockup-to-be.html`: se conserva sin cambios por ser prototipo dedicado ya existente y util.
