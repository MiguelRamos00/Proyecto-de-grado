# Estrategia de pruebas

## Objetivo

Las pruebas deben demostrar que el MVP cumple sus requisitos principales y que los componentes críticos pueden evolucionar con seguridad. Para la tesis, los resultados también sirven como evidencia de validación técnica durante cada sprint.

## Niveles de prueba

| Nivel | Alcance | Ejemplos |
|---|---|---|
| Unitaria | Reglas de dominio sin infraestructura. | Clasificación de diagnóstico, selección de recursos, validación de límites. |
| Integración | Adaptadores y persistencia. | Repositorio SQLAlchemy, migraciones, cliente de IA simulado. |
| Contrato | Cumplimiento de JSON/OpenAPI. | Solicitudes FastAPI inválidas, respuestas compatibles con Zod. |
| Interfaz | Flujos visibles del frontend. | Carga de diagnóstico, visualización de resultado, envío de mensaje. |
| Escenarios IA | Pertinencia y seguridad de respuestas simuladas. | Consulta válida, consulta fuera de alcance, salida no estructurada. |

## Pruebas de IA

Las pruebas no se basarán únicamente en llamadas reales a proveedores. Se crearán adaptadores simulados para verificar casos de uso de manera estable y se mantendrá un conjunto pequeño de escenarios de evaluación para ejecutar de forma controlada.

Para cada escenario se documentará:

- Entrada utilizada.
- Contexto de diagnóstico incluido, si aplica.
- Respuesta esperada o criterios de pertinencia.
- Cumplimiento de formato JSON.
- Advertencias, rechazos o comportamientos seguros esperados.

## Evidencias para la tesis

En cada sprint se pueden registrar capturas o reportes de:

- Casos ejecutados, aprobados y fallidos.
- Cobertura de las reglas críticas, cuando esté disponible.
- Resultados de escenarios de IA y observaciones de pertinencia.
- Cambios de requisito, decisión arquitectónica o retroalimentación de Solangie.
- Incidencias, riesgos y acciones tomadas.

