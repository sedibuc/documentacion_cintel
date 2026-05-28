# Micrositio RAG / Document Intelligence

Micrositio estático para documentar el proyecto de evolución hacia un Document Intelligence Engine (DIE) multi-tenant, conservando el análisis AS-IS y la propuesta TO-BE.

## Ejecución local

Este sitio carga Markdown con fetch, por lo que requiere servidor HTTP local.

```bash
python -m http.server 8000
```

Abrir en navegador:

```text
http://localhost:8000/RAG/
```

## Estructura de navegación

- Inicio
- Contexto del proyecto
- Diagnóstico técnico
- Arquitectura vigente
- Brechas y oportunidades
- Configuración y despliegue
- Servicios y costos
- Mockup / Prototipo
- TO-BE funcional
- Arquitectura TO-BE
- Por qué no es un RAG
- Decisiones de diseño por módulos
- Cronograma de implementación
- Preguntas para experto
- Conclusiones y recomendaciones

## Organización de carpetas

- `content/`: fuente editable del contenido por página.
- `assets/`: estilos, scripts y shell de navegación compartida.
- `source/`: documento técnico base de referencia.
- `notes/`: notas y trazabilidad editorial.

## Archivos técnicos no navegables

Archivos de soporte como árboles de directorio o notas internas se conservan en el repositorio, pero no se exponen en la navegación pública del micrositio.
