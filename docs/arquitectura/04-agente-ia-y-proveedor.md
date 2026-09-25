# Agente IA y proveedor configurable

## Propósito

El agente entrega orientación conversacional en español basada en el resultado del diagnóstico y los recursos disponibles. No sustituye acompañamiento profesional ni toma decisiones automáticas de alto impacto.

## Diseño del adaptador de IA

La aplicación define un puerto para solicitar respuestas orientativas. Su adaptador concreto utiliza LangChain y un proveedor configurable. Esta separación permite usar OpenAI API u OpenRouter sin modificar casos de uso, rutas FastAPI o interfaz web.

```text
Caso de uso de conversación
        │
        ▼
Puerto de agente conversacional
        │
        ▼
Adaptador LangChain
        │
        ├── Simulado
        ├── Gemini
        ├── OpenAI API
        └── OpenRouter
```

## Configuración

La configuración se inyectará mediante variables de entorno y nunca se versionará en el repositorio:

| Variable | Propósito |
|---|---|
| `PROVEEDOR_IA` | Identifica el proveedor activo. |
| `MODELO_IA` | Identifica el modelo seleccionado. |
| `CLAVE_API_IA` | Credencial del proveedor. |
| `URL_BASE_IA` | URL opcional para proveedores compatibles. |
| `TEMPERATURA_IA` | Parámetro de generación sujeto a pruebas. |

La selección definitiva del proveedor y modelo permanece pendiente de disponibilidad, costo, calidad observada y validación académica.

Durante el desarrollo y las pruebas, `simulado` es el proveedor predeterminado. No requiere credenciales ni establece comunicación externa. Los proveedores `gemini`, `openai` y `openrouter` se habilitan solo cuando se seleccionan explícitamente con sus variables de entorno.

## Contexto permitido

El agente puede recibir:

- La consulta actual de la estudiante.
- El resultado orientativo del diagnóstico cuando la estudiante lo use como contexto.
- Recursos formativos disponibles y aprobados para recomendar.
- Instrucciones de alcance, tono y seguridad del MVP.

No debe recibir información sensible innecesaria, credenciales, contratos no validados de RADIA ni datos personales que no aporten a la respuesta.

## Respuesta estructurada

El adaptador solicitará una salida JSON que el backend valida con Pydantic antes de responder al frontend. La estructura inicial incluye:

```json
{
  "respuesta": "Texto orientativo en español.",
  "recursos_referenciados": [],
  "advertencias": [],
  "requiere_revision": false
}
```

Si el proveedor devuelve texto no estructurado, una respuesta fuera de alcance o una salida inválida, el backend aplicará una respuesta segura. El incidente se registrará técnicamente sin almacenar contenido sensible innecesario.

## Límites y validación

- El agente no inventa información sobre recursos, programas o datos de RADIA.
- El agente reconoce límites cuando no cuenta con contexto suficiente.
- Las respuestas se evaluarán con escenarios simulados definidos por Miguel y Paula, y revisados cuando corresponda por Solangie.
- Las mediciones de calidad documentarán coherencia, pertinencia, seguridad y cumplimiento de estructura JSON.
- Los mensajes del sistema, plantillas y configuraciones se mantendrán fuera de las rutas HTTP y versionados como recursos de aplicación.

