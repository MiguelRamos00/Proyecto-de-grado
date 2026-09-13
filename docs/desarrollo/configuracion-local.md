# Configuración local

## Requisitos

- Git.
- Docker Engine y Docker Compose.
- Node.js LTS, si se ejecuta el frontend fuera de Docker.
- Python compatible con FastAPI, si se ejecuta el backend fuera de Docker.
- pgAdmin, opcionalmente, para inspección visual de PostgreSQL.

## Preparación con Docker Compose

1. Clonar el repositorio desde GitHub y ubicar la rama de trabajo correspondiente.
2. Copiar `.env.example` como `.env` en la raíz del proyecto.
3. Reemplazar `POSTGRES_PASSWORD` por una contraseña local y actualizar el mismo valor dentro de `DATABASE_URL`.
4. Configurar `CLAVE_API_IA` únicamente en el archivo `.env` local cuando se integre un proveedor de IA. En esta primera entrega se mantiene vacío.
5. Ejecutar `docker compose up --build`.

## Comprobaciones

- El frontend debe responder en `http://localhost:3000`.
- El endpoint `http://localhost:8000/api/v1/salud` debe responder `{"estado":"disponible"}`.
- PostgreSQL queda disponible en `localhost:5432` para conexión opcional desde pgAdmin.

## Reglas de seguridad local

- No incluir claves, tokens, contraseñas ni datos de estudiantes en Git.
- No compartir archivos `.env` por repositorios, commits o documentación pública.
- Usar datos simulados para pruebas mientras RADIA no entregue contratos y ambientes aprobados.
- Mantener dependencias y versiones explícitas en los archivos de cada servicio.
