# Iteración 2: diagnóstico inicial

## Propósito

Esta iteración implementa el primer módulo funcional del MVP. Permite consultar un instrumento simulado de diagnóstico, validar sus respuestas y registrar un diagnóstico básico en PostgreSQL.

El alcance se limita al registro técnico del diagnóstico. No calcula perfiles, fortalezas, oportunidades de mejora, recomendaciones o rutas formativas. Tampoco incluye inteligencia artificial, integración con RADIA, datos reales del semillero ni información personal de estudiantes.

## Instrumento simulado

El instrumento publicado tiene el identificador `diagnostico-inicial-v1`. Se utiliza únicamente para validar el flujo técnico del MVP y no corresponde a una encuesta oficial del semillero Kerberos.

| Identificador | Categoría | Pregunta |
|---|---|---|
| `TEC-001` | Técnica | ¿Qué tan segura te sientes al resolver problemas de programación paso a paso? |
| `TEC-002` | Técnica | ¿Qué tan segura te sientes al interpretar datos básicos de una aplicación? |
| `TEC-003` | Técnica | ¿Qué tan segura te sientes al usar conceptos básicos de bases de datos? |
| `ACT-001` | Actitudinal | ¿Qué tan segura te sientes al pedir apoyo cuando enfrentas una dificultad académica? |
| `ACT-002` | Actitudinal | ¿Qué tan capaz te sientes de continuar aprendiendo ante un error técnico? |
| `ACT-003` | Actitudinal | ¿Qué tan segura te sientes al comunicar tus ideas técnicas a otras personas? |

Todas las preguntas usan una escala de uno a cinco. El instrumento no solicita ni almacena nombres, correos, números de identificación u otra información personal.

## API

### Consultar instrumento activo

`GET /api/v1/diagnosticos/instrumento-activo`

La respuesta incluye el identificador, la descripción que declara el carácter simulado del instrumento, las seis preguntas, su categoría y el rango de escala permitido.

### Registrar diagnóstico

`POST /api/v1/diagnosticos`

Solicitud de ejemplo:

```json
{
  "instrumento_id": "diagnostico-inicial-v1",
  "respuestas": [
    {"pregunta_id": "TEC-001", "valor": 4},
    {"pregunta_id": "TEC-002", "valor": 3},
    {"pregunta_id": "TEC-003", "valor": 4},
    {"pregunta_id": "ACT-001", "valor": 5},
    {"pregunta_id": "ACT-002", "valor": 4},
    {"pregunta_id": "ACT-003", "valor": 3}
  ]
}
```

Cuando la solicitud es válida, la API responde con `201 Created`, un identificador técnico del diagnóstico, el instrumento utilizado, el estado `registrado` y la fecha de creación.

La API responde con `422 Unprocessable Entity` cuando el instrumento no es el activo, existen identificadores desconocidos o repetidos, algún valor está fuera del rango de uno a cinco o faltan preguntas activas. Las solicitudes inválidas se rechazan antes de que el repositorio persista datos.

## Persistencia y migraciones

La migración `20260918_01` crea las tablas `diagnosticos` y `respuestas_diagnostico`. El contenedor del backend ejecuta `alembic upgrade head` antes de iniciar Uvicorn. Cada diagnóstico se almacena con sus respuestas, el identificador del instrumento, el estado y la fecha de creación.

## Verificación local

Desde la raíz del repositorio se pueden ejecutar las siguientes verificaciones:

```powershell
docker compose up --build --detach
docker compose exec -T backend alembic current
docker compose exec -T backend pytest
```

La suite cubre validaciones Pydantic, reglas del caso de uso y contratos HTTP. El uso de repositorios en memoria permite probar las reglas de negocio y los endpoints sin depender de PostgreSQL.
