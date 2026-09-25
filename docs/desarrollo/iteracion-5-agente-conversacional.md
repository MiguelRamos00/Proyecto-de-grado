# Iteración 5: agente conversacional

## Propósito

Esta iteración incorpora una conversación orientativa al MVP. El módulo recibe un mensaje y un contexto mínimo opcional del diagnóstico, devuelve una respuesta, recursos simulados y un aviso de alcance. No almacena el contenido de los mensajes ni datos personales.

## Proveedor predeterminado

El valor predeterminado de `PROVEEDOR_IA` es `simulado`. Esta implementación no requiere una clave, no genera costos y permite probar el caso de uso, el endpoint y la interfaz sin comunicarse con servicios externos.

El proyecto también deja disponibles los proveedores configurables `gemini`, `openai` y `openrouter` detrás del adaptador LangChain. Esos proveedores solo se inicializan cuando se configuran explícitamente sus variables de entorno. Los fallos de configuración o de disponibilidad se devuelven como errores controlados, sin incluir claves ni detalles internos.

Los adaptadores no reintentan automáticamente las solicitudes rechazadas por el proveedor. Esto evita multiplicar el consumo de cuota ante límites de uso; la interfaz comunica el fallo y permite que la persona usuaria intente nuevamente cuando el servicio esté disponible.

## Variables de entorno

| Variable | Propósito | Requerida con simulador |
| --- | --- | --- |
| `PROVEEDOR_IA` | Selecciona `simulado`, `gemini`, `openai` u `openrouter`. | No; el valor predeterminado es `simulado`. |
| `MODELO_IA` | Modelo del proveedor externo. | No. |
| `CLAVE_API_IA` | Clave del proveedor externo. No debe versionarse. | No. |
| `URL_BASE_IA` | URL base opcional; OpenRouter usa su valor predeterminado si no se define. | No. |
| `TEMPERATURA_IA` | Parámetro de generación para proveedores externos. | No; el valor predeterminado es `0.2`. |

## API

`POST /api/v1/conversaciones` recibe un identificador técnico de sesión, un mensaje entre uno y mil caracteres y, opcionalmente, un identificador de diagnóstico.

La respuesta contiene `respuesta`, `recursos`, `aviso_alcance` y `proveedor_modelo`. El aviso informa que el chat es una orientación general y no reemplaza una evaluación académica, psicológica o profesional. Cuando se envía `diagnostico_id`, el backend consulta internamente las fortalezas y oportunidades orientativas y comparte solo esos nombres con el proveedor; no transmite respuestas individuales ni datos personales.

## Verificación

Las pruebas usan exclusivamente el proveedor simulado y dobles de prueba. No realizan solicitudes a Gemini, OpenAI, OpenRouter ni RADIA.
