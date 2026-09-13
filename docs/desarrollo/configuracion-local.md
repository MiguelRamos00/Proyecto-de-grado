# Configuración local

## Requisitos previstos

- Git.
- Docker Engine y Docker Compose.
- Node.js en una versión LTS compatible con Next.js.
- Python en una versión compatible con FastAPI y las bibliotecas de análisis.
- pgAdmin, opcionalmente, para inspección visual de PostgreSQL.

## Flujo de preparación

1. Clonar el repositorio desde GitHub.
2. Crear archivos `.env` a partir de los ejemplos que se agreguen en la fase técnica.
3. Configurar claves de IA únicamente en el entorno local de cada integrante.
4. Levantar los servicios mediante Docker Compose.
5. Verificar el endpoint de salud del backend y la carga del frontend.

## Reglas de seguridad local

- No incluir claves, tokens, contraseñas ni datos de estudiantes en Git.
- No compartir archivos `.env` por repositorios, commits o documentación pública.
- Usar datos simulados para pruebas mientras RADIA no entregue contratos y ambientes aprobados.
- Mantener dependencias y versiones explícitas en los archivos de cada servicio.

