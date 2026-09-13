# Integración con RADIA

## Estado actual

La integración con el semillero Kerberos/RADIA está prevista, pero los contratos API, mecanismos de autenticación, campos disponibles y reglas de intercambio aún no han sido entregados. Por ello, esta documentación define límites y preparativos, no un contrato definitivo.

## Relación esperada

La integración será bidireccional:

1. El MVP expondrá una API para que RADIA pueda consumir las operaciones que se aprueben.
2. El MVP consumirá las API de RADIA para obtener únicamente la información autorizada y necesaria.

Cada dirección se implementará detrás de un adaptador independiente. Ningún caso de uso del dominio dependerá directamente de HTTP, autenticación o estructuras específicas de RADIA.

## Responsabilidades del MVP

- Publicar contratos JSON versionados cuando sean aprobados.
- Validar solicitudes entrantes antes de procesarlas.
- Aplicar autorización y minimización de datos según lo acordado.
- Registrar errores técnicos y trazabilidad sin exponer información sensible.
- Mantener una implementación simulada mientras no existan servicios disponibles.

## Información requerida para cerrar el contrato

| Aspecto | Información requerida |
|---|---|
| Operaciones | Endpoints, métodos, versiones y propósito de cada API. |
| Seguridad | Autenticación, autorización, rotación de credenciales y restricciones de red. |
| Datos | Campos permitidos, obligatorios, sensibles y sus reglas de validación. |
| Consentimiento | Finalidad, responsables, conservación y mecanismos aplicables. |
| Operación | Límites de consumo, disponibilidad, reintentos y códigos de error. |
| Pruebas | Ambiente de prueba, datos simulados y criterios de aceptación. |

## Contrato temporal

Durante el desarrollo inicial se utilizará una interfaz interna de integración y una implementación simulada. La simulación debe devolver estructuras JSON equivalentes a las que se acuerden posteriormente, pero no representa una garantía sobre el contrato real.

No se enviarán datos reales de estudiantes a RADIA ni se persistirán datos provenientes de RADIA hasta contar con la aprobación del equipo, el contrato técnico y las reglas de manejo de información definidas.

## Criterio de habilitación

La integración real solo puede iniciarse cuando Miguel, Paula y Solangie revisen la información recibida del semillero y se actualicen el ADR, los contratos OpenAPI/JSON y la tarea bloqueada de Azure DevOps.

