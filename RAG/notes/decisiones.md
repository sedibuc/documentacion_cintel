
- Se eligió una estructura multipágina con shell compartido en lugar de una SPA monolítica para facilitar navegación directa por sección y mantenimiento simple en un entregable estático.
- Se separó el contenido en archivos Markdown dentro de content/ para desacoplar edición editorial y presentación HTML.
- Se implementó un renderizador Markdown ligero en cliente para evitar dependencias externas pesadas y mantener despliegue local mínimo.
- Cuando el diagnóstico no entrega un dato necesario para una sección, se usa la frase literal Información no disponible en diagnóstico actual.
- La sección de arquitectura incorpora placeholders de diagramas en vez de inventar un script fuente no verificado dentro del repositorio analizado.
- Los apartados de brechas se redactan como diferencias entre el estado actual y una evolución futura, sin afirmar que esas capacidades ya existen.
