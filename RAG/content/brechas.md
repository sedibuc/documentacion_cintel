# Brechas y oportunidades

## Punto de partida

El diagnóstico distingue entre el demostrador RAG actual y una posible arquitectura futura con mayores capacidades de control, memoria, trazabilidad y gobierno. Hoy existe un flujo RAG funcional, pero persisten brechas relevantes para soportar una evolución ordenada del sistema.

## Coherencia técnica de configuración y dependencias

### Estado actual

La solución declara conmutación entre escenarios cloud y on-premise para modelos, embeddings y base vectorial. A la vez, el diagnóstico muestra dependencias técnicas que atraviesan capas de forma poco homogénea, como el uso de streamlit dentro de managers del vector store y la dependencia de LangChain Hub en cada nueva instancia del core RAG.

### Estado de la brecha

Sigue siendo brecha y está confirmada por código.

### Brecha

- La validación de entorno contradice la conmutación declarada entre escenarios cloud y on-premise.
- Existe una dependencia de streamlit dentro de managers del vector store.
- Existe una dependencia de LangChain Hub en runtime por cada instancia de RAG.

### Implicación técnica

Se observa una pérdida de cohesión arquitectónica entre configuración, inicialización y responsabilidades de los componentes. Esto introduce fricción de despliegue, configuraciones híbridas no deseadas, mayor acoplamiento entre capas y sensibilidad a servicios externos en fases críticas del chat. En el estado observado, streamlit no aporta funcionalidad de negocio dentro del stack Flask y la dependencia de Hub queda en el camino crítico de cada conversación.

### Implicación funcional

Estas dependencias pueden traducirse en arranques menos previsibles, mayor dificultad para operar el sistema en distintos entornos y una menor confiabilidad percibida cuando existen restricciones de red, disponibilidad o claridad sobre la configuración realmente soportada.

## Tool registry y ejecución controlada

### Estado actual

Información no disponible en diagnóstico actual sobre un tool registry formal o una capa de ejecución controlada para herramientas.

### Estado de la brecha

Sigue siendo brecha. No se observa implementación parcial en el código revisado.

### Brecha

- Falta un registro explícito de herramientas.
- Falta validación centralizada de parámetros y permisos.
- Falta control de límites, auditoría y sandbox para tools.
- Falta rate limiting específico para acciones instrumentadas.

### Implicación técnica

Se identifica una limitación en la capacidad del sistema para incorporar herramientas de forma gobernada. Sin un punto de control formal, la evolución futura queda expuesta a mayor complejidad de integración, menor auditabilidad y más dificultad para imponer políticas de seguridad y operación consistentes.

### Implicación funcional

Desde la perspectiva de uso, esta carencia limita la posibilidad de ofrecer acciones instrumentadas de manera confiable y controlada. También reduce la capacidad de explicar al usuario qué hizo el sistema, bajo qué reglas y con qué restricciones.

## Estado persistente extendido

### Estado actual

- Persistencia de usuarios, conversaciones, mensajes y feedback.
- Catálogo de modelos y bibliotecas.

### Estado de la brecha

Sigue siendo brecha y la implementación actual solo cubre persistencia operativa básica.

### Brecha

No se persisten:

- decisiones de planificación,
- ejecución de herramientas,
- evidencias o citas por respuesta,
- métricas por consulta como latencia, top-k, scores y documentos usados,
- versiones de índices, embeddings y prompt.

### Implicación técnica

Existe una limitación en la profundidad del modelo de persistencia para soportar observabilidad, auditoría técnica y control de cambios. El esquema actual no cubre de forma suficiente el trazado de decisiones, el versionado de artefactos ni la reconstrucción técnica de cómo se produjo una respuesta.

### Implicación funcional

Se observa una limitación en la trazabilidad visible de cada respuesta entregada al usuario. La ausencia de evidencias, citas y documentos usados puede dificultar la validación humana, reducir la transparencia del resultado y limitar la comprensión de por qué el sistema respondió de una manera determinada.

## Memoria avanzada

### Estado actual

- Hay memoria conversacional persistida en base de datos.
- No se evidencia un uso efectivo de esa memoria en el prompt.
- No se maneja memoria semántica de la conversación.

### Estado de la brecha

Sigue siendo brecha. Existe persistencia de mensajes, pero no integración real de memoria conversacional en la cadena RAG.

### Brecha

- Falta resumen incremental.
- Falta memoria episódica.
- Falta memoria de preferencias del usuario.
- Falta memoria de tareas y planes.
- Falta política de retención y expiración.

### Implicación técnica

Se identifica una capacidad de memoria aún incipiente para sostener continuidad contextual y evolución funcional del sistema. Sin mecanismos explícitos de resumen, retención y segmentación de memoria, la arquitectura futura tendría dificultades para escalar en complejidad conversacional sin aumentar fragilidad en prompts y manejo de contexto. Además, la memoria persistida actualmente no participa en la construcción del prompt de respuesta.

### Implicación funcional

Esto puede impactar la continuidad de la experiencia del usuario, la personalización y la capacidad del sistema para sostener interacciones prolongadas con contexto acumulado útil. En la práctica, la persistencia existente no garantiza respuestas más consistentes ni un seguimiento efectivo de preferencias o tareas.

## Evaluación automática de calidad

### Estado actual

- Existe feedback manual por mensaje.
- Existen reportes agregados.

### Estado de la brecha

Sigue siendo brecha. No se observa cobertura automática de calidad en el código revisado.

### Brecha

- No hay tests de regresión de prompts o modelos.
- No hay evaluación automática de factualidad o grounding.
- No hay detección explícita de alucinación.
- No hay benchmarks internos de preguntas.
- No hay medición estructurada de cobertura de recuperación.

### Implicación técnica

Se observa una limitación en la capacidad de validar cambios del sistema de forma repetible. Sin evaluaciones automáticas, el ajuste de prompts, modelos o componentes de recuperación queda más expuesto a regresiones silenciosas y a menor control sobre calidad, cobertura y comportamiento esperado.

### Implicación funcional

La ausencia de validación sistemática puede traducirse en respuestas menos consistentes para el usuario final, mayor variabilidad en la calidad percibida y menor confianza en la estabilidad del sistema cuando se introducen cambios o ajustes operativos.

## Gobernanza

### Estado actual

Información no disponible en diagnóstico actual sobre un modelo formal de gobernanza documental y de respuesta.

### Estado de la brecha

Sigue siendo brecha y el código no muestra controles formales de acceso por biblioteca o trazabilidad integral de respuestas.

### Brecha

- Falta política de acceso a documentos.
- Falta clasificación o etiquetado de fuentes.
- Falta política de retención.
- Falta auditoría integral de respuestas y acciones del sistema.

### Implicación técnica

Se identifica una base insuficiente para controlar el ciclo de vida de documentos, respuestas y acciones operativas bajo criterios consistentes. Esto puede afectar la mantenibilidad del sistema, la administración de riesgos y la capacidad de imponer controles homogéneos sobre acceso, retención y auditoría.

### Implicación funcional

Desde el punto de vista de negocio y uso, esta brecha puede impactar la confianza en el tratamiento de la información, la claridad sobre qué contenido puede consultarse y la capacidad de demostrar que el sistema opera bajo reglas verificables.

## Seguridad operativa y control de acceso

### Estado actual

- La ruta `/library` valida sesión de usuario.
- Las rutas `/chat` y `/report` no muestran validación de autenticación equivalente en el código revisado.
- La aplicación mantiene `app.secret_key` hardcodeado y `debug=True` en el arranque observado.

### Estado de la brecha

Sigue siendo brecha y está confirmada por código.

### Brecha

- Falta enforcement homogéneo de autenticación en endpoints funcionales.
- Existen secretos operativos hardcodeados.
- No se observan controles explícitos de CSRF ni rate limiting.

### Implicación técnica

La superficie de exposición del demostrador es mayor a la declarada documentalmente. La ausencia de protección homogénea entre endpoints y el uso de secretos embebidos reducen la robustez del sistema ante despliegues fuera de un entorno estrictamente controlado.

### Implicación funcional

La solución puede ofrecer una percepción de control superior a la que realmente implementa, lo que afecta la confianza operacional y la capacidad de promover el demostrador a escenarios con requisitos más estrictos.

## Despliegue y consistencia de runtime

### Estado actual

- Flask corre en el puerto 5000 fijado en código.
- docker-compose expone el servicio web en 8501.
- `WEB_PORT` aparece en despliegue, pero no gobierna el puerto efectivo de Flask.

### Estado de la brecha

Sigue siendo brecha y es bloqueante para despliegues Docker directos.

### Brecha

- Existe una inconsistencia entre el puerto real de la aplicación y el puerto expuesto en docker-compose.
- La parametrización de runtime no controla completamente el comportamiento efectivo del servicio web.

### Implicación técnica

El despliegue contenedorizado no es reproducible de forma confiable con la configuración documentada. Esto dificulta validaciones integradas, pruebas de operación y transferibilidad del entorno.

### Implicación funcional

Un operador puede seguir la guía declarada y aun así no obtener un servicio accesible, afectando la percepción de madurez y la capacidad de demostración del sistema.

## Dependencia de filesystem en consulta

### Estado actual

- El retrieval inicial se hace sobre chunks indexados en la base vectorial.
- La respuesta final relee documentos completos desde la ruta original en filesystem.

### Estado de la brecha

Sigue siendo brecha y no está cubierta por la implementación actual.

### Brecha

- El índice vectorial no es suficiente por sí solo para responder consultas.
- La disponibilidad de los archivos originales condiciona el funcionamiento del flujo de consulta.

### Implicación técnica

Se introduce una dependencia fuerte entre indexación, persistencia de rutas y disponibilidad del filesystem original. Esto complica despliegues en contenedores, escenarios multiambiente y estrategias de archivado o limpieza de temporales.

### Implicación funcional

La solución puede aparentar tener un flujo RAG completamente desacoplado del almacenamiento documental, cuando en realidad requiere mantener accesibles los archivos fuente para responder correctamente.

## Oportunidades iniciales priorizadas

### Ajustes de bajo costo técnico

- Corregir REQUIRED_ENV_VARS para que respete escenarios on-premise puros.
- Eliminar secretos hardcodeados y credenciales por defecto del flujo operativo real.
- Corregir la incoherencia entre puerto Flask y docker-compose.
- Instrumentar OCR, embeddings, retrieval y LLM con métricas mínimas.
- Persistir citas y documentos usados por respuesta.

### Capacidades intermedias

- Introducir trazabilidad por request.
- Persistir versiones de prompt, embeddings e índices.
- Añadir evaluación automática básica basada en casos internos.

### Capacidades de evolución del sistema

- Diseñar un tool registry controlado.
- Persistir planes, acciones y resultados de herramientas.
- Incorporar memoria episódica y de preferencias.
- Definir políticas de gobernanza y seguridad para tools y documentos.
