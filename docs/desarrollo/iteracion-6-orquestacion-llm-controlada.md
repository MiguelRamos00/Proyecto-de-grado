# Iteración 6: orquestación controlada del LLM

## Propósito

Esta iteración controla la interacción entre la persona usuaria y el modelo de lenguaje antes de solicitar una respuesta al proveedor de IA. Combina reglas explícitas del proyecto con un prompt de sistema versionado y validación de la respuesta. Así, el agente conserva una función de orientación académica y de competencias, sin depender únicamente de la decisión del modelo.

No se implementa todavía File Search, una base documental consultable ni la integración con RADIA. Esas capacidades requieren seleccionar y validar las fuentes que se podrán usar como contexto.

## Flujo de la conversación

1. La interfaz envía el mensaje a `POST /api/v1/conversaciones`.
2. El caso de uso evalúa reglas de alcance locales y deterministas.
3. Si una regla bloquea el mensaje, el backend devuelve una orientación segura sin llamar al proveedor de IA.
4. Si el mensaje está dentro del alcance, el adaptador envía el prompt de sistema `orientacion-v1` y el contexto mínimo permitido al proveedor configurado.
5. La respuesta del proveedor debe cumplir el formato JSON definido por el proyecto.
6. Pydantic valida esa respuesta antes de devolverla a la interfaz. Si el proveedor responde con texto libre o JSON inválido, se entrega una respuesta segura de contexto insuficiente.

El contexto opcional de un diagnóstico se limita a las fortalezas y oportunidades orientativas ya calculadas. No se envían respuestas individuales del instrumento ni datos personales.

## Reglas de alcance

Las reglas están en `backend/app/dominios/conversacion/reglas_alcance.py`. Son simples, visibles y modificables por Miguel y Paula; no pretenden diagnosticar a la persona usuaria ni clasificarla.

Se bloquean los mensajes que soliciten o compartan:

- Datos sensibles o de acceso, como contraseñas, documentos de identidad o información financiera.
- Evaluaciones académicas, psicológicas o profesionales que el agente no puede realizar.
- Solicitudes ajenas al propósito de orientación académica y de competencias del MVP.

Cuando se bloquea una solicitud, la API devuelve `tipo_respuesta: "fuera_de_alcance"` con una explicación breve. El proveedor no recibe el mensaje bloqueado.

Las palabras y expresiones iniciales son ejemplos de una primera versión. Deben revisarse y ajustarse con la retroalimentación de Solangie y el semillero, especialmente cuando se definan las fuentes documentales y los casos de prueba representativos.

## Prompt de sistema versionado

El prompt activo está en `backend/app/infraestructura/ia/prompts/orientacion_v1.py` y se identifica como `orientacion-v1`. Su propósito es:

- Delimitar al agente como apoyo orientativo, no como evaluador o sustituto de una persona profesional.
- Solicitar respuestas claras, respetuosas y en español.
- Evitar afirmaciones institucionales no verificadas y la invención de recursos, normas o convenios.
- Exigir exclusivamente un objeto JSON, sin Markdown ni texto adicional.

El prompt solicita la siguiente estructura:

```json
{
  "tipo_respuesta": "orientacion",
  "respuesta": "Orientación breve y verificable para la estudiante."
}
```

El valor de `tipo_respuesta` puede ser `orientacion` o `sin_contexto_suficiente`. Mantener el prompt en un archivo propio permite cambiar su versión y comparar el comportamiento sin mezclar esa decisión con la lógica de negocio.

## Contrato de respuesta

La respuesta de `POST /api/v1/conversaciones` incluye los siguientes campos:

| Campo | Descripción |
| --- | --- |
| `tipo_respuesta` | Indica si la respuesta es una orientación, una solicitud fuera de alcance o si falta contexto suficiente. |
| `respuesta` | Mensaje visible para la persona usuaria. |
| `recursos` | Recursos orientativos disponibles para la respuesta. En esta etapa pueden ser simulados. |
| `aviso_alcance` | Aclara que el agente no realiza evaluaciones académicas, psicológicas ni profesionales. |
| `proveedor_modelo` | Proveedor configurado que generó la respuesta o la etiqueta `reglas_locales` cuando no se llamó a un modelo. |

Los valores permitidos de `tipo_respuesta` son `orientacion`, `fuera_de_alcance` y `sin_contexto_suficiente`. El esquema OpenAPI se actualiza junto con el contrato para que frontend y backend usen el mismo formato.

## Verificación realizada

La verificación automatizada no consume cuota de Gemini ni de otros proveedores externos:

```powershell
docker compose exec -T backend pytest tests/test_conversaciones.py tests/test_agente_langchain.py -q
docker build --file frontend/Dockerfile --target pruebas frontend
```

Las pruebas cubren el bloqueo por reglas antes de invocar al proveedor, la clasificación `fuera_de_alcance`, la lectura de una respuesta JSON válida y la respuesta segura ante texto no válido del modelo. El contrato Zod del frontend también comprueba el nuevo campo `tipo_respuesta`.

Como evidencia manual adicional, se debe probar desde la interfaz un mensaje permitido y uno bloqueado con el proveedor configurado. Esa prueba debe registrar solo el resultado técnico; no se deben almacenar ni publicar mensajes que contengan información personal.

## Pendiente para la siguiente iteración

La siguiente iteración puede incorporar File Search con documentos previamente seleccionados y aprobados. La recuperación de contexto deberá ocurrir después de las reglas locales y antes de la llamada al modelo. La integración con RADIA se mantiene pendiente hasta recibir y validar los contratos de sus APIs.
