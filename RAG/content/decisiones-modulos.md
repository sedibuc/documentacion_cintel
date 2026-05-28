# Decisiones de diseño por módulos

## Mapa de módulos TO-BE
- IngestionGateway
- ClassificationService
- ExtractionOrchestrator
- SchemaRegistry
- CrossValidationEngine
- AlertsAndWorkflow
- TenantIsolationLayer
- AuditAndObservability

## Decisiones estructurales vigentes
1. Separar extracción semántica (LLM) de validación determinística.
2. Versionar esquemas y prompts por tipo documental y tenant.
3. Mantener contratos de salida estructurada para evitar ambiguedad.
4. Modelar alertas como eventos trazables y auditables.

## Decisiones por dominio

### Contexto y datos
- El contexto de negocio por tenant se gestiona como configuración validada, no como memoria conversacional libre.
- Los catálogos de referencia se actualizan por ciclo controlado y con versionado.

### IA y extracción
- El LLM se usa para estructurar información compleja de documento.
- La salida debe cumplir esquema JSON estricto antes de persistencia.

### Gobernanza y operación
- Todo procesamiento deja rastro de auditoría con correlación de evento.
- Las discrepancias se priorizan por criticidad operativa y contractual.

### Seguridad y escalado
- El aislamiento multi-tenant es obligatorio desde el MVP.
- La estrategia de escalado prioriza colas de procesamiento y control de concurrencia.

## Contratos mínimos sugeridos
- Documento de entrada normalizado.
- Resultado de extracción por campo con evidencia.
- Resultado de validación cruzada con regla aplicada.
- Evento de alerta con severidad, estado y responsable.

## Riesgos abiertos
- Variabilidad de calidad de OCR según tipo documental.
- Dependencia de proveedores de IA para latencia/costo.
- Necesidad de calibración continua de reglas de validación.
