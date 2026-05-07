# Agente de procesamiento documental — TO-BE

<div class="badge-row">
<span class="badge">Pivot validado: 2026-04</span>
<span class="badge">Sector piloto: construcción</span>
<span class="badge">Extracción: NER supervisado · NER zero-shot</span>
<span class="badge">Salida: JSON · CSV</span>
</div>

Este micrositio documenta el sistema TO-BE propuesto: un **agente especializado de procesamiento documental basado en NER (Named Entity Recognition)**. El sistema recibe documentos tipados, extrae entidades de dominio mediante modelos de reconocimiento de entidades nombradas, valida los resultados contra fuentes de referencia y expone los datos estructurados por API REST.

## Qué problema resuelve

Las organizaciones que operan con grandes volúmenes de documentos tipados —certificados, contratos, pólizas, documentos HSE— invierten tiempo manual en extraer datos, contrastarlos contra fuentes de referencia y producir reportes operativos. Este proceso es lento, propenso a errores y difícil de escalar.

El sistema convierte documentos tipados en **datos estructurados y comparables**, de forma automatizada, con salida directamente consumible por operación.

## Pipeline del sistema

| Etapa | Descripción |
|---|---|
| **OCR** | Conversión del PDF o imagen a texto plano con preservación de estructura posicional |
| **NER** | Identificación y clasificación de entidades de dominio según el esquema del tipo documental |
| **Mapeo al esquema** | Alineación de entidades detectadas con los campos configurados |
| **Validación de completitud** | Campos extraídos vs. campos esperados del esquema |
| **Comparación cruzada** | Contraste campo a campo contra una fuente de referencia |
| **Clasificación** | Estado por campo: `MATCH`, `MISMATCH`, `PENDIENTE`, `ERROR` |
| **Consolidación por lote** | Agrupación de ejecuciones bajo un ID único de lote |

## Tipos documentales del piloto

| Tipo documental | Estado |
|---|---|
| Certificado de tradición y libertad | PRODUCCIÓN ✅ |
| Contrato de obra | BETA ⚠️ |
| Póliza de seguro HSE | EN DESARROLLO 🔧 |

## Quién usa el sistema

- **Operadores documentales** en empresas del sector construcción, legal o inmobiliario.
- **Administradores de procesos** que necesitan resultados consolidados por lote.
- **Equipos de auditoría o cumplimiento** que validan datos contra fuentes de referencia.
- **Equipos de integración** que consumen resultados vía API REST desde sistemas externos.

## Secciones de este sitio

- [TO-BE funcional](tobefuncional.html) — Especificación completa del pipeline, modelos NER y proceso de entrenamiento.
- [Preguntas para el experto](preguntasexperto.html) — Propuestas pre-resueltas y preguntas abiertas para validación especializada.
