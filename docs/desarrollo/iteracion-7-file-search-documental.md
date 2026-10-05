# Iteración 7: File Search documental

## Propósito

Incorporar fuentes documentales revisables al agente conversacional sin convertir el MVP en un sistema de búsqueda propio ni permitir que el modelo responda como si tuviera evidencia que no fue recuperada.

## Flujo implementado

1. El caso de uso aplica las reglas de alcance antes de consultar una fuente o invocar un modelo.
2. File Search solo se activa cuando `USAR_FILE_SEARCH=true` y su configuración está completa.
3. El adaptador de Gemini recupera fragmentos y sus citas desde el almacén configurado.
4. Si no hay evidencia recuperada, el caso de uso devuelve `sin_contexto_suficiente` y no llama al modelo.
5. Si hay evidencia, el agente recibe un contexto breve con las referencias; la respuesta HTTP y la interfaz muestran las fuentes consultadas.

## Estado de las fuentes

La fuente `FCD-001` continúa como `pendiente_aprobacion` en el registro documental. Por ello, esta iteración no crea almacenes, no carga el PDF y no realiza solicitudes externas a Gemini durante las pruebas automáticas.

## Pruebas realizadas

- Activación deshabilitada por defecto y validación de configuración incompleta.
- Aplicación de reglas de alcance antes de File Search.
- Respuesta segura ante ausencia de evidencia.
- Entrega de contexto documental al adaptador del agente.
- Visualización de citas y ocultamiento de la sección cuando no hay fuentes.

## Pendiente de validación manual

Tras la aprobación de Solangie, Miguel o Paula deben crear un almacén de prueba, cargar FCD-001 mediante el comando documentado y registrar una consulta que devuelva una cita verificable. La evidencia deberá confirmar que el agente no atribuye conclusiones individuales a la fuente y que muestra la referencia recuperada.
