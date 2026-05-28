# Micrositio de Agentes de IA

Micrositio documental para el proyecto de agentes de IA orientado a estrategia y creación de contenido institucional.

## Ejecución local

Este sitio utiliza fetch para cargar Markdown y requiere servidor HTTP local.

```bash
python -m http.server 8000
```

Abrir en navegador:

```text
http://localhost:8000/agent/
```

## Estructura de navegación

- Inicio
- Contexto del proyecto
- Diagnóstico técnico
- Arquitectura vigente
- Brechas y oportunidades
- Despliegue y configuración
- Servicios y costos
- Prototipo / Demostrador
- TO-BE funcional y submódulos
- Arquitectura TO-BE optimizada
- Cronograma de implementación
- Preguntas para experto técnico
- Decisiones técnicas por módulos
- Validación vs TO-BE final
- Conclusiones y recomendaciones

## Organización de carpetas

- `content/`: fuente editable del contenido.
- `assets/`: estilos, scripts y shell compartido de navegación.
- `source/`: base técnica consolidada del proyecto.
- `notes/`: decisiones y notas de trazabilidad documental.

## Convención de edición

Los HTML son shells de carga. El contenido de negocio se mantiene en archivos Markdown dentro de `content/`.

## Nota de higiene documental

Archivos técnicos accidentales o de diagnóstico operativo (logs, replays, árboles) se mantienen fuera de la navegación pública.
