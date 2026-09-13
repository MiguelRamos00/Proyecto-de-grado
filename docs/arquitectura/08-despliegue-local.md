# Despliegue local con Docker Compose

## Propósito

Docker Compose levantará el ecosistema mínimo de desarrollo con un único comando, reduciendo diferencias entre los equipos de Miguel y Paula. El entorno local es reproducible y no representa todavía el despliegue productivo definitivo.

## Servicios iniciales

| Servicio | Tecnología | Responsabilidad |
|---|---|---|
| `frontend` | Next.js | Interfaz web del MVP. |
| `backend` | FastAPI | API, casos de uso, integración IA y acceso a datos. |
| `base_datos` | PostgreSQL | Persistencia relacional del MVP. |

pgAdmin no se incluirá en Docker Compose. Podrá conectarse de forma local a PostgreSQL para inspección visual, pero no será una dependencia del producto.

## Red y comunicación

- Los servicios vivirán en una red privada administrada por Docker Compose.
- El frontend consumirá el backend mediante una URL configurable para desarrollo.
- El backend se conectará a PostgreSQL mediante variables de entorno internas.
- Solo los puertos necesarios se expondrán al equipo local.
- Las claves de proveedores de IA no se exponen al frontend.

## Persistencia local

PostgreSQL utilizará un volumen administrado por Docker para evitar perder datos al reiniciar contenedores. El volumen se puede eliminar intencionalmente cuando se necesite reiniciar el entorno, pero no debe ser parte del flujo cotidiano.

## Variables de entorno

Cada servicio tendrá un archivo de ejemplo versionado, como `.env.example`, sin secretos. Los archivos `.env` reales se excluyen con `.gitignore`.

Variables iniciales previstas:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
DATABASE_URL
URL_API_BACKEND
PROVEEDOR_IA
MODELO_IA
CLAVE_API_IA
```

## Verificaciones de inicio

1. PostgreSQL debe indicar disponibilidad antes de que el backend procese solicitudes.
2. El backend debe exponer un endpoint de salud.
3. El frontend debe mostrar una respuesta controlada cuando el backend no esté disponible.
4. El equipo debe poder crear el entorno con instrucciones reproducibles.

## Límite de esta fase

La definición del proveedor de alojamiento y los costos de producción se decidirán cuando el MVP cuente con un flujo funcional y requisitos de despliegue validados. La arquitectura local no presupone una plataforma de nube específica.

