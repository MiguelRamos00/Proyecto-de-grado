# Registro de fuentes documentales

## Propósito

Este registro controla qué documentos pueden convertirse en contexto para el agente conversacional. Una fuente solo puede cargarse en File Search y consultarse desde el MVP cuando figure con estado `aprobada`.

El registro separa la procedencia del documento, su utilidad y sus límites. No reemplaza una revisión académica de Solangie ni la validación de materiales entregados por el semillero.

## Estados

| Estado | Significado |
| --- | --- |
| `pendiente_aprobacion` | La fuente fue identificada, pero todavía no se puede cargar ni usar en respuestas. |
| `aprobada` | Miguel y Paula verificaron su procedencia, uso permitido y pertinencia. Puede cargarse mediante el comando explícito de la siguiente iteración. |
| `retirada` | La fuente no debe volver a recuperarse ni utilizarse. Si ya se cargó, debe eliminarse del almacén documental. |

## Fuentes candidatas

| ID | Fuente | Referencia | Estado | Uso permitido y límites |
| --- | --- | --- | --- | --- |
| FCD-001 | *Brechas de género educativas en Bogotá y el derecho a la educación* | Rodríguez de Luque, J. J. (2025). Revista Colombiana de Educación, 95. https://doi.org/10.17227/rce.num95-18793 | `pendiente_aprobacion` | Aporta contexto general sobre brechas educativas de género en Bogotá. No describe específicamente a la Universidad Católica de Colombia ni permite emitir conclusiones sobre una estudiante individual. |

## Fuente FCD-001

Miguel proporcionó una copia local en formato PDF para la revisión técnica inicial. El documento tiene 25 páginas y reporta un análisis de brechas de género en resultados de matemáticas y ciencias naturales de Bogotá, usando datos de Saber 11 de 2020 e indicadores del derecho a la educación.

La copia local no se versiona ni se duplica en este repositorio. Antes de cargarla en Gemini File Search se debe:

1. Verificar que se conservará la referencia bibliográfica y que el uso propuesto es compatible con el documento.
2. Confirmar con Solangie si la fuente es pertinente para el alcance académico del agente.
3. Cambiar su estado a `aprobada` en este registro.
4. Ejecutar el comando explícito de carga documental que se implementará en la siguiente entrega.

Mientras la fuente esté pendiente, el agente no puede citarla ni utilizarla para responder. La revisión por parte del semillero seguirá siendo necesaria para los documentos que aporten recursos, resultados de encuestas o información propia del proyecto RADIA.
