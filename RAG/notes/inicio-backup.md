# Demostrador RAG actual

<div class="badge-row">
<span class="badge">Diagnóstico base: 2026-02-26</span>
<span class="badge">Repositorio analizado: RagFunc</span>
<span class="badge">Entregable estático</span>
</div>

Este micrositio resume el estado actual del demostrador RAG documentado en [source/diagnostico_rag.md](source/diagnostico_rag.md). Todo el contenido fue construido a partir de ese diagnóstico y evita introducir supuestos de arquitectura no respaldados por el documento.

## Alcance del sitio

- Presentar el diagnóstico técnico inicial del demostrador.
- Exponer la arquitectura vigente en su estado actual.
- Identificar brechas frente a una evolución futura hacia un RAG agéntico.
- Consolidar una guía técnica inicial de configuración y despliegue.
- Resumir el inventario preliminar de servicios y variables de costo.

## Qué hace hoy el demostrador

El sistema implementa un asistente conversacional tipo RAG orientado a consulta de documentos empresariales, con soporte para autenticación, gestión de bibliotecas documentales, ingesta de archivos, extracción OCR opcional, generación de embeddings, indexación vectorial y conversación multi-turn persistida.

## Casos de uso observados

- Carga e ingesta de documentos en bibliotecas.
- Procesamiento de texto y OCR cuando aplica.
- Indexación en motor vectorial configurable.
- Consulta conversacional sobre contenido documental.
- Captura de feedback y generación de reportes agregados.

## Lecturas recomendadas

- [diagnostico.html](diagnostico.html) para revisar la madurez técnica y los riesgos actuales.
- [arquitectura.html](arquitectura.html) para ver componentes, flujos y conmutación cloud vs on-premise.
- [brechas.html](brechas.html) para revisar los bloqueadores principales de una evolución agéntica.
- [despliegue.html](despliegue.html) para ubicar prerrequisitos, variables y pasos base de ejecución.
- [costos.html](costos.html) para identificar servicios involucrados y variables de costo.

## Criterio editorial aplicado

- Cuando el diagnóstico no aporta un dato operativo o de diseño, este sitio lo marca como Información no disponible en diagnóstico actual.
- Los nombres de carpetas, variables y servicios se conservan según la redacción observada en el código y en el documento base.
- Las diferencias entre capacidades existentes y capacidades potenciales se presentan como brechas, no como funcionalidades ya disponibles.

## Información no disponible en diagnóstico actual

- Volumen de documentos actualmente cargados en producción o demo.
- Cantidad de usuarios concurrentes esperada.
- Métricas reales de latencia por consulta.
- Acuerdos de nivel de servicio o disponibilidad.
