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

## Matriz de fuentes aprobadas y pendientes

La siguiente matriz conserva la procedencia, el estado y el uso permitido de cada fuente. Los materiales FCD-002 a FCD-011 fueron proporcionados por RADIA el 11 de octubre de 2026. La referencia bibliográfica completa se registrará cuando RADIA la suministre o cuando sea necesaria para citar la fuente en el producto o en la tesis.

| ID | Fuente o archivo local | Procedencia o referencia | Estado | Uso permitido y límites |
| --- | --- | --- | --- | --- |
| FCD-001 | *Brechas de género educativas en Bogotá y el derecho a la educación* | Rodríguez de Luque, J. J. (2025). Revista Colombiana de Educación, 95. https://doi.org/10.17227/rce.num95-18793 | `retirada` | Se retiró de Gemini File Search el 11 de octubre de 2026. No se utilizará como contexto mientras no se revise de nuevo su pertinencia para el MVP. |
| FCD-002 | `Fundamentos-de-programacion.pdf` | Material proporcionado por RADIA. Título identificado: *Fundamentos iniciales de lógica de programación I. Algoritmos en PSeInt y Python*. | `aprobada` | Se utilizará para orientar conceptos iniciales de lógica, algoritmos, PSeInt y Python. No permite evaluar competencias ni atribuir conclusiones a una estudiante. |
| FCD-003 | `Introducción a los algoritmos.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `aprobada` | Se utilizará para orientar la comprensión de algoritmos y la solución de problemas. Sus respuestas deberán citar la fuente recuperada cuando corresponda. |
| FCD-004 | `Matemáticas-básicas-con-aplicaciones-a-la-ingeniería-1era-Edición.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `aprobada` | Se utilizará como apoyo a dudas de matemáticas básicas aplicadas a ingeniería. No sustituye una tutoría, evaluación académica ni orientación individual. |
| FCD-005 | `BasesConceptualesProg.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `pendiente_aprobacion` | Pendiente de identificar contenidos y aporte diferencial frente a FCD-002 y FCD-003 antes de cargarlo. |
| FCD-006 | `book-attachment-3030.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `pendiente_aprobacion` | Pendiente de identificar título, autoría, tema y uso permitido. No se carga hasta completar esos datos. |
| FCD-007 | `Fundamentos de Programación con DFD.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `pendiente_aprobacion` | Pendiente de decidir si añade contenido útil sobre diagramas de flujo sin duplicar los fundamentos ya aprobados. |
| FCD-008 | `Fundamentos_de_programación_4ta_Edición_Luis_Joyanes_Aguilar_2.pdf` | Material proporcionado por RADIA. Libro de Luis Joyanes Aguilar, cuarta edición. | `pendiente_aprobacion` | Pendiente de confirmar alcance de la autorización para procesarlo en un proveedor externo y de seleccionar solo contenido pertinente para el MVP. |
| FCD-009 | `Introduccion Programacion logica y diseño.pdf` | Material proporcionado por RADIA. Libro de Joyce Farrell, séptima edición. | `pendiente_aprobacion` | Pendiente de confirmar alcance de la autorización para procesarlo en un proveedor externo y de evaluar solapamiento con FCD-002 y FCD-003. |
| FCD-010 | `Introduccion_a_la_programacion (2).078198f7-f08e-40b0-b16a-906f24ff33c4.pdf` | Material proporcionado por RADIA. Referencia bibliográfica por completar. | `pendiente_aprobacion` | Pendiente de identificar contenido, autoría y aporte diferencial antes de cargarlo. |
| FCD-011 | `preview-9788426729637_A39860364.pdf` | Material proporcionado por RADIA. Vista previa de *Matemáticas para informática*, José Alfredo Jiménez Murillo, segunda edición. | `pendiente_aprobacion` | Pendiente de confirmar alcance de la autorización y de decidir si complementa FCD-004 sin duplicar contenidos matemáticos. |

## Decisión de carga inicial

Miguel y Paula aprobaron FCD-002, FCD-003 y FCD-004 para la primera carga en Gemini File Search. La selección combina fundamentos de programación, pensamiento algorítmico y matemáticas básicas con solo tres fuentes, lo que facilita validar citas y relevancia antes de ampliar la base documental.

Los archivos locales no se versionan ni se duplican en este repositorio. Antes de cada carga se debe comprobar que la fuente siga en estado `aprobada` y conservar el identificador visible `FCD-00X` en Gemini File Search. Las fuentes pendientes no pueden usarse como contexto ni ser citadas por el agente.
