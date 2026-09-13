# Datos y PostgreSQL

## Propósito

El modelo de datos soporta el diagnóstico inicial, la orientación resultante, los recursos recomendados y la operación mínima del agente. Se diseña para demostrar el MVP sin recolectar información que no sea necesaria para sus objetivos.

## Principios de tratamiento de datos

- Solicitar solo datos necesarios para ofrecer diagnóstico y orientación.
- Separar identificadores técnicos de información personal cuando sea posible.
- Versionar los instrumentos de diagnóstico para interpretar resultados históricos.
- No persistir conversaciones completas por defecto; su retención depende de una necesidad explícita y validada.
- No usar el MVP para decisiones automatizadas de alto impacto sobre las estudiantes.

## Entidades iniciales

| Entidad | Propósito | Datos principales |
|---|---|---|
| `sesion_estudiante` | Identifica de forma técnica una interacción del MVP. | `id`, fecha de creación, estado de consentimiento, referencia externa opcional. |
| `instrumento_diagnostico` | Representa el instrumento proporcionado o validado por el semillero. | `id`, versión, nombre, estado, fecha de publicación. |
| `pregunta_diagnostico` | Define una pregunta perteneciente a un instrumento. | `id`, instrumento, texto, competencia, tipo de respuesta, orden. |
| `respuesta_diagnostico` | Conserva la respuesta necesaria para calcular el resultado. | `id`, sesión, pregunta, valor validado, fecha. |
| `resultado_diagnostico` | Almacena la síntesis orientativa del diagnóstico. | `id`, sesión, instrumento, fortalezas, oportunidades, fecha, versión de cálculo. |
| `recurso_formativo` | Registra recursos que pueden ser sugeridos a la estudiante. | `id`, título, descripción, enlace, competencia, estado. |
| `recomendacion_recurso` | Relaciona resultados con recursos sugeridos. | `id`, resultado, recurso, razón de recomendación, orden. |
| `interaccion_conversacional` | Registra metadatos mínimos de uso del chat, si se valida su necesidad. | `id`, sesión, fecha, tipo de interacción, resultado de validación. |

## Información que no se almacenará inicialmente

- Contraseñas, tokens de acceso o credenciales de terceros.
- Información sensible no requerida para el diagnóstico.
- Historial de conversación completo de forma predeterminada.
- Datos provenientes de RADIA antes de contar con autorización, contrato y finalidad definida.

## Relaciones principales

```text
sesion_estudiante 1 ──── N respuesta_diagnostico
instrumento_diagnostico 1 ──── N pregunta_diagnostico
pregunta_diagnostico 1 ──── N respuesta_diagnostico
sesion_estudiante 1 ──── N resultado_diagnostico
resultado_diagnostico 1 ──── N recomendacion_recurso N ──── 1 recurso_formativo
sesion_estudiante 1 ──── N interaccion_conversacional
```

## Persistencia y migraciones

PostgreSQL será el motor relacional del entorno local y de futuros despliegues. La persistencia se implementará con SQLAlchemy y cada modificación de esquema se registrará con Alembic.

Flujo esperado:

1. Definir o actualizar los modelos de persistencia en el backend.
2. Generar una migración Alembic revisable.
3. Revisar la migración antes de aplicarla.
4. Aplicarla en el entorno local mediante Docker Compose.
5. Verificar visualmente la estructura con pgAdmin, sin realizar cambios manuales de esquema allí.

## Criterios de diseño pendientes

- Duración de la conservación de resultados e interacciones.
- Mecanismo de identificación cuando RADIA defina autenticación e intercambio de datos.
- Estructura final de competencias, categorías y escalas del instrumento proporcionado por el semillero.
- Necesidad de persistir una memoria conversacional limitada para el MVP.

