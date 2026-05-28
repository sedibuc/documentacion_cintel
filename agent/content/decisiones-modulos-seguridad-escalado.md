# Módulos de seguridad y escalado

## 1. Alcance

Esta página define el módulo técnico que habilita aislamiento multi-organización y escalamiento seguro del producto.

## 2. Ficha técnica por módulo

### 2.1 TenantIsolationLayer

| Característica | Definición técnica |
|---|---|
| Propósito | Asegurar separación lógica y operativa de datos entre organizaciones/clientes. |
| Entradas | Solicitudes autenticadas, contexto de usuario y tenant_id activo. |
| Salidas | Acceso controlado a datos y servicios permitidos por organización. |
| Implementación base | tenant_id transversal en entidades, filtros obligatorios y control de acceso por organización. |
| Controles mínimos MVP | Autenticación robusta, autorización por tenant, auditoría de accesos y segregación de trazas. |
| Evolución V2/V3 | Hardening de políticas, auditoría avanzada y pruebas de aislamiento automatizadas. |
| Riesgos técnicos | Fuga inter-tenant por consultas no filtradas o permisos sobredimensionados. |
| Mitigación | Pruebas de seguridad por tenant, revisiones de código sensibles y alertas de acceso anómalo. |

## 3. Checklist técnico de salida a piloto

- tenant_id obligatorio en todos los modelos persistentes críticos.
- políticas de autorización con deny-by-default.
- trazabilidad de accesos administrativos y acciones sensibles.
- pruebas de aislamiento en escenarios de lectura y escritura.
- validación de logs sin fuga de datos entre organizaciones.

## 4. Decisiones de diseño vigentes

- El aislamiento multi-organización inicia en Sprint 0, no se difiere.
- El hardening de seguridad evoluciona por fases sin comprometer el MVP.
- La salida a piloto exige checklist técnico de seguridad cumplido.

## 5. Controles técnicos obligatorios

### 5.1 Políticas base

- Filtro obligatorio por `tenant_id` en lectura y escritura.
- Autorización `deny-by-default` para endpoints sensibles.
- Registro de auditoría para cambios de contexto, campañas y piezas.

### 5.2 API mínima de seguridad

- `POST /api/auth/token`
- `POST /api/authz/check`
- `GET /api/audit/events`

### 5.3 Diagrama técnico del dominio

![Arquitectura de seguridad y escalado](assets/img/diagramas/decisiones-modulos-seguridad-escalado-arquitectura.png)
<a href="assets/plantuml/decisiones-modulos-seguridad-escalado-arquitectura.plantuml" download class="diagram-download"> Descargar fuente (.plantuml)</a>

### 5.4 Criterios de aceptación

- No existen lecturas cross-tenant en pruebas de integración.
- Todo endpoint crítico exige autenticación y autorización válida.
- Los logs de auditoría permiten reconstruir acciones sensibles por usuario y tenant.

---

Trazabilidad: [Mapa de módulos](decisiones-modulos.html) · [Arquitectura TO-BE](to-be-arquitectura.html)

