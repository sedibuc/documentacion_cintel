---
archivo_origen: "context/analisis/05_Decisiones_Producto_MKT_v2.docx"
archivo_markdown: "context/analisis_md/05_Decisiones_Producto_MKT_v2.docx.md"
extension: ".docx"
metodo_conversion: "python-docx"
estado_conversion: "OK"
observaciones: ""
---

Decisiones de producto recomendadas y enfoque estratégico

Iniciativa: Marketing Digital / Comunicación Institucional

Roger Steven Ovalle Silva

1. Resumen de Decisiones

La validación de mercado confirmó la existencia de un dolro real y urgente en comunicación institucional, pero reveló que el posicionamiento original "Copiloto Institucional" para generación de campañas no captura el diferencial más valioso del producto. Las decisiones aquí documentadas reorientan la iniciativa hacia la persistencia de contexto organizacional y la adaptación de contenido con identidad de marca, con el segmento de comunicación institucional pública como mercado de entrada.

| Decisión | Evidencia clave | Impacto |
| --- | --- | --- |
| Go — Continuar iniciativa MKT con ajuste de posicionamiento | 3 entrevistas confirman dpñpr articulado; ninguna entrevistada encontró herramienta que lo resuelva | La iniciativa es viable; el mercado de comunicación institucional está desatendido |
| Ajuste de posicionamiento: 'Adaptador de Contenido Institucional' | Sin diferencial vs. ChatGPT en generación genérica; Verónica: necesita contexto acumulado | Diferenciación real en memoria organizacional y brand enforcement, no en generación de texto |
| Segmento primario: comunicación institucional pública | Alcaldías, universidades públicas, entidades regulatorias las 3 entrevistadas son de este perfil | Segmento homogéneo, alcanzable, con dolor compartido y sin solución específica disponible |
| Módulo núcleo v1: repositorio de directrices de marca y persistencia de marca entre sesiones | Score 8.80: contexto_organizacional_persistente es el pain de mayor peso en la síntesis | Diferenciación directa vs. Canva, ChatGPT, Copilot,  ninguno tiene memoria organizacional |
| Ampliar canales v1: Instagram publicación real + Email + WhatsApp | Instagram + WhatsApp + email como canales principales; Ana Elizabeth: 5+ canales activos | El demo solo envía email con campaña, pero no como formato comunicacional, brecha de distribución real bloquea adopción |
| Excluir generación de video en v1 | Ninguna entrevistada lo mencionó como canal prioritario; complejidad técnica alta | Foco en canales de texto e imagen donde el dolor es mayor y el esfuerzo es menor |

2. Decisión de Viabilidad

✔  GO — Continuar iniciativa MKT con ajuste de posicionamiento y segmento

Justificación

Las tres entrevistadas articularon un pain concreto, recurrente y sin solución específica disponible: ninguna herramienta existente acumula el contexto organizacional de su institución entre sesiones.

El diferencial percibido del producto frente a Canva, ChatGPT y Copilot está claramente identificado: persistencia de marca + adaptación multi-canal con identidad institucional. Ningún competidor genérico lo ofrece.

El segmento de comunicación institucional pública (alcaldías, universidades, entidades regulatorias) es homogéneo, está subatendido por herramientas especializadas, y tiene un ciclo de compra más corto que el corporativo privado.

La base técnica del demo ya tiene ~30% de los componentes necesarios: extracción de identidad de marca, generación de imágenes (DALL-E-3), flujo LangGraph guiado, envío por email (Microsoft Graph API). La inversión se concentra en módulos de persistencia y distribución multi-canal.

El dolor de cuello de botella en diseño visual es directamente abordable con los modulos recomendados a construir.

3. Segmento y Propuesta de Valor Ajustados

3.1 Diferencia respecto a la hipótesis original

| Dimensión | Hipótesis original (E-02) | Post-validación (E-05) |
| --- | --- | --- |
| Posicionamiento | Copiloto Institucional — generación de campañas de marketing | Adaptador de Contenido Institucional — adaptación con brand persistence y distribución multi-canal |
| JTBD primario | Generar campañas de marketing digital de forma autónoma | Adaptar contenido a múltiples canales manteniendo identidad institucional acumulada sin re-alimentar contexto |
| Diferenciador principal | Generación de contenido asistida por IA | Memoria organizacional persistente (quién es la entidad, su identidad gráfica, historial de campañas) |
| Segmento primario | Empresas con departamentos de marketing digital | Oficinas de comunicación institucional — gobierno municipal, universidades, entidades regulatorias |
| Segmento secundario | PYMEs sin área de marketing | Corporativo privado con áreas de comunicación interna pequeñas (validar en fase 2) |
| Canal de distribución principal | Marketing B2B genérico | Ventas directas institucional público + alianzas con firmas de gestión del cambio (como I4DIGITAL) |

3.2 Segmento primario post-validación

Equipos unipersonales o micro-equipos de comunicación institucional en organizaciones públicas colombianas: alcaldías, gobernaciones, universidades públicas, ministerios, entidades de control y regulación. Características comunes validadas en las tres entrevistas:

Una persona gestiona 4+ canales simultáneamente (Instagram, WhatsApp, email, web, cartelería)

Tienen identidad institucional estricta con lineamientos de imagen corporativa no negociables

Usan IAs genéricas (ChatGPT, Copilot) para texto pero sin acumulación de contexto organizacional

El cuello de botella es el paso de texto a pieza visual adaptada por canal — no la generación de texto

No tienen presupuesto para agencias externas de diseño o marketing; trabajan con lo que tienen

Ciclos de aprobación con superiores antes de publicar (flujo multinivel validado en Ana Elizabeth y Natalia)

3.3 Propuesta de valor refinada

Adaptador de Contenido Institucional — propuesta de valor

"Para equipos de comunicación institucional que gestionan múltiples canales con identidad de marca estricta, el Adaptador de Contenido Institucional adapta cualquier contenido al formato y tono de cada canal aplicando automáticamente los lineamientos de tu organización  sin que tengas que volver a explicarle quién eres en cada sesión."

4. Ajuste de Posicionamiento (No Es Pivot Completo)

A diferencia de la iniciativa RAG, aquí no se trata de un pivot sino de un refinamiento. La hipótesis original de 'generación de campañas' no estaba equivocada — estaba incompleta. El demostrador ya genera contenido de calidad; el problema es que no recuerda quién es la organización y no adapta ese contenido a los canales específicos con la identidad visual correcta. El ajuste es en qué se enfatiza como diferenciador, no en qué se construye.

Qué cambia y por qué

Persistencia de marca como feature central y diferenciador explícito

Natalia Rozo articuló con precisión el problema: La sobrecarga de dar contexto organizacional desde cero en cada sesión de IA es el diferenciador real. Verónica Rangel lo confirmó: "ya con el contexto con que yo lo alimente, con que tenga toda la información, ya yo no tendría que salir a cada vez que le vas a hacer una pregunta, darle contexto de lo que estoy haciendo porque ya sabe de qué se trata y cómo lo manejamos."

Formateadores por canal como módulo de valor primario (no solo email)

El demo actual solo distribuye por email la generación de campaña. Ana Elizabeth tiene 5+ canales activos (Instagram, WhatsApp, email, web). Verónica gestiona Instagram + WhatsApp + email + web. El valor del producto no se percibe completo si el usuario tiene que copiar el contenido generado y pegarlo manualmente en cada canal.

Segmento de entrada: comunicación institucional pública (no corporativo privado)

Las tres entrevistadas son de instituciones públicas o semi-públicas (CRC, CENIT/Ecopetrol filial en contexto de gestión del cambio, Pro Montería). Este segmento tiene características homogéneas, ciclo de venta más corto que el corporativo grande, y el pain más articulado. El corporativo privado puro (marketing de productos/servicios) es un segmento diferente con un JTBD diferente — validar en fase

5. El Qué Específico a Construir — Adaptador de Contenido Institucional v1

5.1 Concepto de producto

Adaptador de Contenido Institucional es un agente de comunicación que aprende quién es la organización (identidad de marca, historial de campañas, canales activos, audiencias) y aplica ese conocimiento de forma consistente a la generación y adaptación de contenido para múltiples canales institucionales, sin que el usuario tenga que re-alimentar el contexto en cada sesión.

5.2 Componentes del demo a reutilizar (sin modificación mayor)

Flujo LangGraph conversacional guiado (15 nodos) — mantener como motor de orquestación

Extracción de identidad de marca por scraping de web + CSS (mejorar, no reemplazar)

Generación de textos con GPT-4.1 (Actualizar a modelos más recientes o hacer benchmark)

Generación de imágenes con DALL-E-3 (Actualizar a modelos más recientes o hacer benchmark)

Envío por email vía Microsoft Graph API (Es una elección a mantener dado que la mayoría de instituciones públicas usan Office)

Lectura de Instagram (Graph API — solo lectura ya funcional)

PostgreSQL como base de datos (ampliar esquema, no reemplazar)

Interfaz web Flask básica

5.3 Módulos nuevos a desarrollar

BrandGuidelinesStore

Persistencia de la identidad de marca por organización entre sesiones. Elimina la sobrecarga de re-alimentar contexto en cada sesión — el diferenciador central del producto.

Perfil por organización: nombre, misión, audiencias, tono de voz, colores institucionales, tipografía

Lineamientos por canal (qué formatos, qué tonos, qué restricciones para cada uno)

Historial de campañas anteriores (qué se publicó, cuándo, en qué canal, con qué resultado)

Versionado de guidelines (cambios de imagen corporativa en el tiempo)

Onboarding guiado: formulario + scraping web para poblar perfil inicial en <10 minutos

ChannelFormatters

Módulo de adaptación de contenido a cada canal aplicando automáticamente los lineamientos de marca almacenados en BrandGuidelinesStore.

InstagramFormatter: post cuadrado 1080x1080, story 1080x1920, caption ≤2200 chars con hashtags institucionales

EmailFormatter: HTML responsive 600px, imágenes inline, header/footer institucional automático

WhatsAppFormatter: texto ≤4096 chars, emojis habilitados según tono de voz, link shortening

Aplicación automática de paleta de colores y tipografía institucional en imágenes generadas

Preview antes de publicar para validación del usuario

IGPublisher (escritura real)

Módulo de publicación real en Instagram vía Graph API (el demo solo lee). Completa el ciclo de distribución.

Post individual y carrusel hasta 10 imágenes

Stories con stickers de enlace

Scheduling básico: programar hora de publicación

Confirmación de publicación con URL del post

BasicMetricsSyncer

Módulo de métricas básicas para cerrar el ciclo de medición — el gap identificado en las tres entrevistas.

Pull de métricas Instagram: alcance, impresiones, interacciones por post

Email tracking: open rate y click rate con parámetros UTM

Dashboard básico /metrics con histórico de campañas y KPIs institucionales

Exportación CSV para reportes internos (Verónica: audiencias heterogéneas, necesidad de reporte)

5.4 MVP scope — qué incluye la primera entrega piloteable

BrandGuidelinesStore funcional con onboarding guiado para una organización piloto

ChannelFormatters para Instagram y email (los dos canales presentes en las 3 entrevistas)

IGPublisher: publicación real de posts individuales en Instagram

BasicMetricsSyncer: métricas Instagram + email tracking básico

Flujo end-to-end: brief → generación → adaptación por canal → publicación → métricas

Demo reproducible con cuenta institucional real (alcaldía, institución  público-privada o universidad pública)

6. Anti-lista — Qué NO construir en v1

La anti-lista refleja las señales negativas explícitas de las entrevistas y las decisiones de foco estratégico. Cada exclusión está justificada con evidencia del campo.

Generación de contenido sin contexto de marca pre-cargado

El diferenciador es la brand persistence — si el producto permite generar contenido sin cargar la identidad de la organización primero, se comporta como cualquier IA genérica. Natalia Rozo lo confirmó: sin ese diferencial, el producto no se percibe diferente a ChatGPT. El onboarding de BrandGuidelinesStore es obligatorio, no opcional.

Evidencia: INT-MKT-002 (Natalia Rozo): "La veo como una inteligencia artificial normal, como las demás"

TikTok, LinkedIn, Twitter/X en v1

Ninguna de las tres entrevistadas mencionó estos canales como canales institucionales prioritarios. El segmento de comunicación institucional pública colombiana opera principalmente en Instagram, WhatsApp y email. LinkedIn es mencionado en contextos corporativos privados — fuera del segmento de entrada.

Evidencia: Ninguna entrevistada lo mencionó como canal activo prioritario

Generación de video

No mencionado en ninguna entrevista como necesidad. La complejidad técnica es significativamente mayor que texto e imagen. La calidad de video generado por IA no alcanza estándares institucionales en 2026 sin supervisión humana extensa.

Evidencia: Ausencia total en las tres entrevistas

Paid media optimization (publicidad pagada)

El segmento institucional público colombiano tiene restricciones presupuestales y legales para publicidad pagada. Las tres entrevistadas operan en comunicación orgánica. Paid media es un JTBD corporativo privado — diferente segmento.

Evidencia: Perfil de los 3 entrevistados — todas en comunicación orgánica institucional

Flujo de aprobación multi-nivel automatizado en v1

Ana Elizabeth y Natalia mencionaron flujos de aprobación, pero no como pain principal — los describen como proceso natural de trabajo. Automatizar aprobaciones requiere integración con sistemas de gestión internos (Microsoft Teams, correo corporativo) que varía por entidad. Es una feature de v2 con mayor comprensión de los flujos específicos.

Evidencia: Pain secundario en INT-MKT-001 y INT-MKT-002; complejidad de integración alta

Corporativo privado (marketing de productos/servicios) como segmento de entrada

El JTBD de marketing de productos corporativos es diferente al de comunicación institucional pública: incluye paid media, funnel de conversión, métricas de ROI — dimensiones que las entrevistadas no articularon. Entrar por este segmento requiere una validación separada.

Evidencia: JTBD diferente al validado en las tres entrevistas

7. Estimación de Esfuerzo (Alto Nivel)

Estimación preliminar partiendo del uso de Inteligencia Artificial Generativa para código incluyendo diseño, pruebas desarrollo, calidad y usuario. La base del demo es reutilizable en su totalidad — los módulos nuevos se adicionan al flujo LangGraph existente. Sujeta a refinamiento en E-06/E-07.

| Componente | Estado | Esfuerzo estimado | Sprints (2 semanas) |
| --- | --- | --- | --- |
| Flujo LangGraph + generación texto/imagen | Existente — reutilizar (Sin embargo verificar nuevos enfoques) | ~0 | 0 |
| Email + lectura Instagram | Existente — reutilizar (Sin embargo verificar nuevos enfoques) | ~0 | 0 |
| BrandGuidelinesStore (BD + onboarding + API) | Nuevo | 2-3 semanas | 1-1.5 |
| ChannelFormatters (Instagram + email) | Nuevo | 2-3 semanas | 1-1.5 |
| IGPublisher (escritura real Instagram) | Nuevo | 1-2 semanas | 0.5-1 |
| BasicMetricsSyncer (IG + email tracking) | Nuevo | 2-3 semanas | 1-1.5 |
| Integración end-to-end + QA + deploy | Nuevo | 1-2 semanas | 0.5-1 |
| TOTAL |  | 8-13 semanas | 4-6.5 sprints |

Supuesto: 1 ingeniero senior fullstack + 1 ingeniero backend/ML, con un UX Designer adicional a tiempo parcial.

8. Criterios de Go/No-Go para la Siguiente Fase

Go — Continuar a Fase 2 si:

El BrandGuidelinesStore es completado en <10 minutos por un usuario real de comunicación institucional sin asistencia técnica

El usuario que completó el onboarding verbaliza espontáneamente la diferencia percibida respecto a ChatGPT antes de que se le pregunte — indicador de que el diferencial es visible sin necesidad de explicación

Los ChannelFormatters producen piezas para Instagram y email que no requieren edición de identidad de marca por parte del usuario

Al menos 1 organización piloto publica contenido real vía IGPublisher dentro de los primeros 30 días post-MVP

Al menos 3 prospectos del segmento institucional público avanzan a demo en los primeros 60 días

No-Go — Replantear si:

El onboarding de BrandGuidelinesStore toma >30 minutos o requiere asistencia técnica — indica UX deficiente o complejidad de perfil mayor a la estimada

Los usuarios continúan percibiendo el producto como equivalente a ChatGPT tras el onboarding — indica que la brand persistence no es suficientemente visible en los outputs

Ningún prospecto institucional avanza a reunión de seguimiento tras el demo — indica mismatch entre la propuesta de valor articulada y el JTBD real del segmento

El ciclo de aprobación interno de la organización piloto bloquea la publicación por más de 5 días hábiles — indica necesidad de incluir flujo de aprobación en v1 antes de escalar

9. Modelos de Negocio — Opciones para CINTEL

La validación de mercado confirmó que el dolor es real y el segmento está subatendido. Lo que no se validó aún es la disposición a pagar — las entrevistadas articularon el problema y reaccionaron positivamente al producto, pero ninguna formalizó una intención de compra. Este gap entre "me duele" y "pago por esto" define cuál de los siguientes modelos es más viable como punto de entrada.

9.1 Opciones de modelo de negocio

| Opción | Descripción | Viabilidad en sector público | Implicaciones para CINTEL |
| --- | --- | --- | --- |
| B2B — Licencia a entidades | Contrato anual con la entidad pública (alcaldía, entidad público-privada universidad, ministerio). CINTEL factura al ente. | Requiere proceso de contratación (licitación, contrato directo o acuerdo marco). CONPES 4144 puede ser habilitador de presupuesto. | Ingreso recurrente predecible. Ciclo de venta largo (3-6 meses). Alto valor por contrato. |
| B2C — Suscripción a profesionales individuales | El cliente es el profesional de comunicaciones (persona natural), no la entidad. Suscripción mensual individual. | No tiene restricciones legales de gratuidad — el individuo puede adoptar con tarjeta personal o presupuesto propio. | Ciclo de venta corto. Ticket bajo (requiere volumen). Adquisición digital posible. |
| Portal de compras del Estado | CINTEL registra el producto en el portal Colombia Compra Eficiente. Las entidades lo 'compran' a tarifa fija sin proceso licitatorio individual. | Elimina la licitación caso a caso. Una sola habilitación da acceso a todas las entidades del Estado. | Modelo escalable. Requiere habilitación previa en el portal. Posiciona a CINTEL como proveedor habilitado del Estado. |
| Piloto de investigación colaborativa | Fase inicial con 2-3 entidades de referencia bajo figura de 'acceso anticipado como colaborador de validación de producto'. | Requiere  confirmación con el equipo jurídico de CINTEL si esta figura evita la restricción de gratuidad formal en el sector público. | Genera caso de referencia antes de invertir en desarrollo completo. Riesgo: no convierte a pago si la figura no está bien estructurada. |

9.2 Recomendación de ruta de entrada

La combinación más conservadora para una primera fase es B2C a profesionales individuales + piloto de investigación colaborativa con una entidad de referencia:

El profesional individual (la Comunicadora Unipersonal Institucional validada en las entrevistas) puede adoptar el producto sin ciclo de compra institucional.

La entidad como piloto colaborativo genera el caso de referencia que habilita contratos B2B posteriores.

Esta ruta no requiere licitación ni habilitación en portales del Estado para iniciar.

La opción de portal de compras del Estado es la más escalable a mediano plazo y debería explorarse en paralelo con el desarrollo del producto.