# 7. Prototipo navegable

> Este micrositio incluye una experiencia de prototipo navegable del Agente de Marketing IA. Esta sección centraliza todos los accesos al prototipo interactivo, desde el punto de entrada hasta cada módulo funcional.

---

## Acceso principal

El prototipo se recorre como una aplicación real. El flujo comienza en la pantalla de acceso y permite navegar por todos los módulos del sistema, avanzar, retroceder y salir de forma natural.

**[→ Iniciar experiencia navegable](assets/mockups/app/login.html)**

Desde la pantalla de login puede:
- ingresar al sistema con cualquier credencial de prueba,
- registrarse como usuario nuevo,
- iniciar el onboarding completo de una empresa.

---

## Accesos directos por módulo

Si prefiere ingresar directamente a un módulo sin pasar por el login:

| Módulo | Pantalla de entrada | Descripción |
|---|---|---|
| **Onboarding** | [Inicio — URL empresa](assets/mockups/onboarding/empresa-url.html) | Registro y configuración inicial de la empresa |
| **Agente Estratégico** | [IDE de marketing](assets/mockups/agente-estrategico/ide-main.html) | Generación de estrategias de campaña mediante conversación |
| **Agente Creativo** | [Árbol campaña–briefs–piezas](assets/mockups/agente-creativo/arbol-campana-brief-piezas.html) | Generación de briefs y piezas de contenido |
| **Ajuste de resultados** | [Vista principal](assets/mockups/iteracion/iteracion-main.html) | Refinamiento iterativo de resultados por instrucción natural |
| **Histórico** | [Vista histórico](assets/mockups/historico/historico-main.html) | Consulta y reutilización de campañas anteriores |

---

## Estructura del prototipo

El prototipo está construido como un conjunto de pantallas HTML estáticas organizadas en:

```
assets/mockups/
  app/
    login.html              ← Punto de entrada único
    home.html               ← Hub de navegación principal
    registro-usuario.html   ← Registro de nuevos usuarios
  onboarding/               ← 9 pantallas del flujo de alta de empresa
  agente-estrategico/       ← 4 pantallas del IDE estratégico
  agente-creativo/          ← 5 pantallas del módulo creativo
  iteracion/                ← 5 pantallas del módulo de ajuste
  historico/                ← 4 pantallas del módulo de histórico
```

**Total:** 30 pantallas navegables.

---

## Flujo de navegación

Cada pantalla del prototipo incluye:

- **Botones de avanzar y retroceder** visibles en todo momento (panel flotante inferior derecho)
- **Acceso al inicio** (`⌂ Inicio`) para volver al hub principal sin perder el contexto
- **Logout** (`Salir →`) que redirige al login
- **Menú de módulos** en la barra superior de cada pantalla de aplicación

El recorrido completo recomendado es:

1. **Login** → ingresar al sistema
2. **Home** → elegir módulo
3. **Onboarding** → alta de empresa (8 pasos) → configuración lista
4. **Agente Estratégico** → IDE → selección de base → conversación → plan generado
5. **Agente Creativo** → árbol campaña → brief → generación → detalle pieza → carga resultados
6. **Ajuste** → iterar sobre resultado existente
7. **Histórico** → consultar campañas anteriores

---

## Nota de uso

> Los datos mostrados en el prototipo son **simulados** y tienen fines exclusivamente ilustrativos. Los formularios, botones y flujos representan el comportamiento esperado del sistema real, no una implementación funcional.

> Las credenciales de acceso son de demo: cualquier correo y contraseña son válidos en el prototipo.
