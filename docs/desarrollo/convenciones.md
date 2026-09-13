# Convenciones de desarrollo

## Generales

- El lenguaje visible para estudiantes y documentación del proyecto será español.
- No se usarán emojis en código, documentación, commits ni mensajes de interfaz.
- Los nombres técnicos mantienen el idioma propio de cada ecosistema cuando corresponde, por ejemplo `FastAPI`, `Docker Compose`, `Next.js` o `OpenAPI`.
- Cada cambio debe respetar la arquitectura y el contrato API definidos.

## Python y FastAPI

- Usar nombres en `snake_case` para funciones, variables y módulos.
- Usar clases y tipos con `PascalCase`.
- Mantener rutas HTTP delgadas: validan y delegan a casos de uso.
- Mantener dependencias externas detrás de puertos y adaptadores.
- Usar tipado en funciones públicas y modelos Pydantic para contratos.

## TypeScript y Next.js

- Usar `PascalCase` para componentes React y `camelCase` para variables y funciones.
- Mantener componentes pequeños y cercanos al módulo que los utiliza.
- Centralizar solicitudes HTTP en el cliente API.
- Validar entradas de interfaz con Zod y no confiar únicamente en validación visual.

## Base de datos

- Todo cambio estructural pasa por una migración Alembic revisable.
- No modificar esquemas manualmente en pgAdmin.
- Usar identificadores y fechas de creación cuando aporten trazabilidad.
- Documentar cualquier dato adicional que se requiera y su finalidad.

