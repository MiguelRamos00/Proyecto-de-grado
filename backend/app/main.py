from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


aplicacion = FastAPI(
    title="API del agente de orientación",
    version="0.1.0",
    description="API base del MVP del agente conversacional del proyecto RADIA.",
)

aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=[],
)


@aplicacion.get("/api/v1/salud", tags=["salud"])
def consultar_salud() -> dict[str, str]:
    """Confirma que la API está disponible para recibir solicitudes."""
    return {"estado": "disponible"}
