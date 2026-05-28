# Inventario ampliado y consolidado - Segunda fase (RAG + Agent)

## 1. Identificacion del entregable

- Entregable: Inventario ampliado y consolidado.
- Fase contractual: Segunda fase.
- Proyectos cubiertos: RAG y Agent / Agente de Marketing.
- Version: 1.0.
- Fecha de corte: 2026-05-27.

## 2. Objetivo

Consolidar en un unico artefacto los servicios, componentes, modelos, APIs, infraestructura, variables de consumo y factores de costo relevantes identificados en los dos proyectos, para trazabilidad contractual y soporte de decisiones de transicion a producto.

## 3. Supuestos tecnicos de consolidacion

1. Este inventario consolida informacion documental existente en ambos micrositios.
2. No sustituye estimaciones financieras finales ni cotizacion comercial.
3. Se orienta a trazabilidad tecnica y comparabilidad de capacidades.
4. Los costos unitarios pueden variar segun proveedor, configuracion y volumen.

## 4. Taxonomia comun usada

1. Servicios IA.
2. Modelos.
3. Infraestructura principal.
4. APIs e integraciones.
5. Componentes agenticos o de orquestacion funcional.
6. Variables de consumo.
7. Factores de costo relevantes.

## 5. Consolidado de servicios y componentes

| Categoria | Proyecto | Servicio / Componente | Tipo | Rol principal |
|---|---|---|---|---|
| Servicio IA | RAG | Extraccion estructurada asistida por LLM | IA | Extraer campos desde documentos tipados |
| Servicio IA | Agent | LLM de texto principal | IA | Generacion/iteracion de contenido institucional |
| Servicio IA | Agent | Generacion de imagen (segun configuracion) | IA | Soporte creativo segun alcance del flujo |
| Servicio IA | Agent | OCR / vision multimodal | IA | Soporte de lectura de activos/documentos segun flujo |
| Validacion | RAG | Motor de validacion y comparacion cruzada | Deterministico + IA | Verificar consistencia de datos extraidos |
| Gobernanza | Agent | Validacion humana de salida | Funcional | Control de calidad y aprobacion |
| Componente funcional | RAG | Pipeline de procesamiento documental | Aplicacion | Ingesta, extraccion y salida estructurada |
| Componente funcional | Agent | Orquestacion de flujo principal | Aplicacion | Coordinar etapas de plan/adaptacion |
| Persistencia | RAG | Base de datos de soporte operativo | Infraestructura | Almacenamiento de metadatos y resultados |
| Persistencia | Agent | Base de datos de conversaciones/campanas | Infraestructura | Memoria operativa del demostrador |

## 6. Modelos y proveedores (consolidado)

| Proyecto | Modelo/Proveedor | Uso principal | Observacion de consumo |
|---|---|---|---|
| RAG | Proveedores LLM configurables (segun entorno) | Extraccion estructurada / procesamiento documental | Consumo dependiente de volumen documental y complejidad |
| Agent | OpenAI (principal en documentacion) | Texto, OCR y funcionalidades relacionadas | Principal vector de costo IA |
| Agent | Google (opcional segun configuracion) | Alternativa para tareas especificas | Consumo condicionado por activacion |

## 7. Infraestructura principal consolidada

| Categoria | RAG | Agent | Observaciones |
|---|---|---|---|
| Runtime aplicacion | Servicio web del demostrador | Servicio web del demostrador | Ambos requieren despliegue estable para demostracion |
| Base de datos | Presente | Presente | Componente critico de persistencia |
| Proxy / acceso | Segun configuracion del proyecto | Nginx documentado en despliegue | Relevante para disponibilidad y streaming en Agent |
| Contenedores | Enfoque contenedorizado documentado | Docker Compose documentado | Base de operacion demostrable |
| Almacenamiento de archivos | Presente (segun flujo) | Presente (uploads y activos) | Relevante para trazabilidad de entradas/salidas |

## 8. APIs e integraciones consolidadas

| Proyecto | API / Integracion | Tipo | Proposito |
|---|---|---|---|
| RAG | Endpoints de procesamiento y resultados (segun documentacion TO-BE) | REST | Exponer salidas estructuradas |
| Agent | APIs internas de flujo conversacional y soporte | REST/SSE | Ejecutar flujo principal y trazabilidad |
| Agent | Meta Graph API | Externa | Integraciones de canal social |
| Agent | Microsoft Graph API | Externa | Flujo de correo segun operacion |

## 9. Componentes agenticos / de orquestacion

| Proyecto | Componente | Nivel de aplicacion | Rol |
|---|---|---|---|
| RAG | Orquestacion de procesamiento documental | Funcional | Coordinar etapas de extraccion/validacion |
| Agent | Agente estrategico | Funcional | Proponer enfoque de campana y objetivos |
| Agent | Agente creativo | Funcional | Adaptar salida por canal y contexto |
| Agent | Modulos de contexto y datos | Funcional | Persistir y recuperar contexto institucional |

## 10. Variables de consumo consolidadas

| Variable | Proyecto | Impacto |
|---|---|---|
| Volumen de documentos / casos | RAG | Aumenta ejecuciones y consumo de procesamiento |
| Complejidad documental | RAG | Incrementa latencia y costo de inferencia |
| Numero de iteraciones por flujo | Agent | Incrementa llamadas al modelo |
| Numero de activos/variantes generadas | Agent | Incrementa costo en componentes creativos |
| Uso de OCR o multimodal | RAG/Agent | Puede aumentar costo por solicitud |
| Dependencias API externas | Agent | Afecta costo/operacion segun politica del proveedor |

## 11. Factores de costo relevantes

1. Costo por inferencia/consumo de modelo.
2. Costo de infraestructura base (runtime, BD, red, almacenamiento).
3. Costo de operacion y soporte (monitoreo, ajustes, mantenimiento).
4. Costo por integraciones externas y restricciones de proveedor.
5. Costo de reprocesamiento por cambios de configuracion o calidad de salida.

## 12. Brechas detectadas en consolidacion

1. No existia un inventario contractual unico RAG+Agent previo a este documento.
2. Persisten diferencias de taxonomia entre proyectos para clasificar componentes.
3. Se requiere homologar criterios de medicion para reporte de consumo/costo.

## 13. Recomendaciones de gestion del inventario

1. Mantener versionado por corte de seguimiento contractual.
2. Definir responsable unico de actualizacion del consolidado.
3. Estandarizar columnas minimas: servicio, rol, dependencia, unidad de consumo, riesgo de costo.
4. Vincular este inventario con matriz de entregables y acta de validacion de fase.
