# Contratos API y validación JSON

## Principio de contrato

La API del backend utilizará JSON y será versionada desde su primera versión pública mediante el prefijo `/api/v1`. FastAPI y los modelos Pydantic serán la fuente de verdad para solicitudes, respuestas y documentación OpenAPI.

El frontend construido con Next.js consumirá el contrato OpenAPI y validará sus datos en TypeScript con Zod. Zod no sustituye Pydantic en el backend Python: ambos validan su límite respectivo y comparten la especificación JSON/OpenAPI para evitar inconsistencias.

## Convenciones generales

- Todas las solicitudes y respuestas usan `application/json`, excepto cargas de archivos que se definan explícitamente.
- Las claves JSON usan `snake_case` para mantener coherencia con Python.
- Cada respuesta de error tiene un código, mensaje y detalle estructurado.
- Los contratos incompatibles requieren una nueva versión de API.
- No se exponen campos internos, claves de proveedor de IA ni credenciales.

## Endpoints iniciales

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/api/v1/salud` | Verificar disponibilidad del backend. |
| `GET` | `/api/v1/diagnosticos/instrumento-activo` | Consultar el instrumento publicado para el MVP. |
| `POST` | `/api/v1/diagnosticos` | Registrar respuestas válidas del instrumento activo. |
| `POST` | `/api/v1/conversaciones/mensajes` | Enviar una consulta al agente dentro del contexto permitido. |
| `GET` | `/api/v1/recursos` | Consultar recursos o rutas formativas, con filtros opcionales. |

Las rutas de integración con RADIA no se publicarán como definitivas hasta recibir su contrato oficial.

## Ejemplo: envío de diagnóstico

Solicitud:

```json
{
  "instrumento_id": "diagnostico-inicial-v1",
  "respuestas": [
    {
      "pregunta_id": "TEC-001",
      "valor": 4
    }
  ]
}
```

Respuesta:

```json
{
  "diagnostico_id": "1e22062b-559e-441f-b3c2-394a06ec8b15",
  "instrumento_id": "diagnostico-inicial-v1",
  "estado": "registrado",
  "fecha_creacion": "2026-09-19T01:56:46.345316Z"
}
```

En esta iteración el backend solo registra las respuestas válidas. La siguiente extensión será el resultado orientativo: un cálculo determinista en el backend que presentará puntajes 4 y 5 como fortalezas y puntajes de 1 a 3 como oportunidades de fortalecimiento. Cada competencia incluirá un recurso simulado. Este resultado no tendrá carácter de evaluación académica o psicológica y no usará IA generativa, datos reales de estudiantes ni contratos reales de RADIA.

## Ejemplo: interacción conversacional

Solicitud:

```json
{
  "sesion_id": "5d54f6d2-8f5c-4dc5-982a-6bd8bbd61e5a",
  "mensaje": "¿Qué recurso puedo revisar para fortalecer mis fundamentos de datos?",
  "contexto_diagnostico_id": "1e22062b-559e-441f-b3c2-394a06ec8b15"
}
```

Respuesta:

```json
{
  "respuesta": "Puedes iniciar con los recursos recomendados para fundamentos de datos.",
  "recursos_referenciados": [],
  "advertencias": [],
  "proveedor_modelo": "configurable"
}
```

La respuesta del agente se validará como estructura JSON antes de entregarse al frontend. Si el proveedor no produce una estructura válida o una respuesta está fuera del alcance definido, el backend devolverá una respuesta segura y registrará el evento técnico sin incluir información sensible.

## Formato de error

```json
{
  "codigo": "VALIDACION_ENTRADA",
  "mensaje": "La solicitud contiene campos inválidos.",
  "detalle": [
    {
      "campo": "respuestas[0].valor",
      "regla": "Debe corresponder al rango permitido por la pregunta."
    }
  ]
}
```

## Contrato de integración con RADIA

El contrato RADIA será JSON y deberá documentar como mínimo:

- URL base y versión de cada servicio.
- Autenticación, autorización y manejo de credenciales.
- Campos permitidos, obligatorios y sensibles.
- Operaciones disponibles, límites y códigos de error.
- Reglas de consentimiento, minimización y conservación de datos.
- Estrategia de pruebas con ambientes o datos simulados.

Hasta que el semillero entregue esos elementos, el adaptador RADIA usará una interfaz interna y una implementación simulada. No se debe inferir el contrato desde el MVP ni enviar datos reales a un servicio no validado.

