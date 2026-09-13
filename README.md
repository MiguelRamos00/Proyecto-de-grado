# Proyecto de grado

Producto Mínimo Viable de un agente conversacional basado en inteligencia artificial para apoyar el fortalecimiento de competencias técnicas y actitudinales de mujeres estudiantes de Ingeniería de Sistemas de la Universidad Católica de Colombia, en el marco del proyecto RADIA.

## Documentación

La documentación técnica del proyecto está en [docs/README.md](docs/README.md). Allí se encuentra la arquitectura, las decisiones técnicas, los diagramas C4 y las guías de desarrollo.

## Entorno local

Esta primera entrega incorpora el entorno local mínimo del MVP: frontend con Next.js, backend con FastAPI y PostgreSQL. Los servicios se ejecutan con Docker Compose.

## Preparación

1. Copiar `.env.example` como `.env` en la raíz del repositorio.
2. Cambiar `POSTGRES_PASSWORD` y actualizar la misma contraseña en `DATABASE_URL`.
3. Ejecutar:

```powershell
docker compose up --build
```

## Verificación

- Frontend: `http://localhost:3000`.
- Salud del backend: `http://localhost:8000/api/v1/salud`.
- Base de datos: `localhost:5432`.

La respuesta esperada del endpoint de salud es:

```json
{"estado":"disponible"}
```

Para detener los servicios sin borrar los datos de PostgreSQL:

```powershell
docker compose down
```

Para borrar los datos locales intencionalmente:

```powershell
docker compose down --volumes
```

No se incluye pgAdmin en los contenedores. Puede conectarse manualmente a `localhost:5432` como herramienta de consulta local.
