# Backend con arquitectura hexagonal y DDD ligero

## Objetivo

El backend debe permitir que la lógica del MVP evolucione sin quedar acoplada a FastAPI, PostgreSQL, LangChain o RADIA. Se aplicará DDD de forma ligera: se modelan los conceptos necesarios del dominio sin introducir complejidad innecesaria para un proyecto de grado de dos estudiantes.

## Dominios iniciales

| Dominio | Responsabilidad |
|---|---|
| Diagnóstico | Recibir respuestas, validar la estructura y producir un resultado orientativo. |
| Orientación | Traducir el resultado del diagnóstico en fortalezas, oportunidades y recomendaciones. |
| Conversación | Gestionar las solicitudes del chat y los límites de la respuesta del agente. |
| Recursos | Consultar rutas formativas y recursos recomendados. |
| Integración | Aislar la comunicación futura con RADIA y con el proveedor de IA. |

## Capas y dependencias

```text
Adaptadores de entrada
        │
        ▼
Casos de uso de aplicación
        │
        ▼
Dominio
        │
        ▼
Puertos
        │
        ▼
Adaptadores de salida
```

### Dominio

Contiene entidades, reglas y objetos de valor independientes de infraestructura. Ejemplos iniciales: `Diagnostico`, `ResultadoDiagnostico`, `Recomendacion`, `MensajeConversacion` y `RecursoFormativo`.

### Aplicación

Contiene casos de uso como `realizar_diagnostico`, `generar_orientacion`, `conversar_con_agente` y `consultar_recursos`. Coordina el dominio mediante puertos, pero no conoce HTTP, SQL ni proveedores concretos.

### Puertos

Define interfaces para persistir datos, solicitar respuestas al modelo de IA, consultar recursos y comunicarse con RADIA. Los puertos representan lo que el núcleo necesita, no la forma específica de implementarlo.

### Adaptadores

- Entrada: rutas FastAPI, modelos Pydantic y manejo de solicitudes HTTP.
- Salida: repositorios SQLAlchemy/PostgreSQL, cliente LangChain/proveedor de IA y cliente RADIA.
- Infraestructura: configuración, variables de entorno, registro de dependencias y Docker.

## Contratos JSON

FastAPI y Pydantic serán la fuente de verdad de los contratos del backend y generarán OpenAPI. El frontend Next.js consumirá ese contrato y utilizará Zod para validación en TypeScript. Así se evita que Zod sea una dependencia del backend Python y se reduce la duplicación de esquemas.

Los contratos externos, incluyendo RADIA, se versionarán y documentarán como JSON. Hasta recibir una especificación oficial, se implementarán adaptadores simulados y no se asumirá autenticación, campos ni flujos definitivos.

## Persistencia

PostgreSQL se ejecutará como contenedor del entorno local. SQLAlchemy representará el modelo de persistencia y Alembic controlará cada cambio de esquema. pgAdmin se utilizará únicamente como herramienta local de consulta visual; no forma parte del producto ni de Docker Compose.

## Criterios de evolución

- Cambiar entre OpenAI API y OpenRouter no debe obligar a modificar los casos de uso.
- Cambiar la forma de integración con RADIA debe afectar solo su adaptador.
- Las reglas del diagnóstico deben poder probarse sin levantar FastAPI o PostgreSQL.
- Las rutas HTTP no deben contener reglas de negocio.

