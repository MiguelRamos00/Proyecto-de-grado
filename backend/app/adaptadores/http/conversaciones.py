"""Rutas HTTP del módulo conversacional."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.adaptadores.http.esquemas_conversacion import (
    RecursoConversacionRespuesta,
    RespuestaConversacionSalida,
    SolicitudConversacionEntrada,
)
from app.aplicacion.conversacion.conversar_con_agente import ConversarConAgente
from app.dominios.conversacion.mensajes import SolicitudConversacion
from app.infraestructura.ia.fabrica_agentes import (
    ConfiguracionProveedorInvalidaError,
    crear_agente_conversacional,
    obtener_proveedor_activo,
)
from app.puertos.agente_conversacional import AgenteConversacional


enrutador = APIRouter(prefix="/api/v1/conversaciones", tags=["conversaciones"])
AgenteConversacionalDependencia = Annotated[
    AgenteConversacional, Depends(crear_agente_conversacional)
]


@enrutador.post("", response_model=RespuestaConversacionSalida, status_code=status.HTTP_200_OK)
def crear_conversacion(
    solicitud_http: SolicitudConversacionEntrada,
    agente: AgenteConversacionalDependencia,
) -> RespuestaConversacionSalida:
    """Envía un mensaje al agente configurado sin persistir conversaciones."""
    try:
        resultado = ConversarConAgente(agente).ejecutar(
            SolicitudConversacion(
                sesion_id=solicitud_http.sesion_id,
                mensaje=solicitud_http.mensaje,
                diagnostico_id=solicitud_http.diagnostico_id,
            )
        )
    except ConfiguracionProveedorInvalidaError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from error

    return RespuestaConversacionSalida(
        respuesta=resultado.respuesta,
        recursos=[
            RecursoConversacionRespuesta.model_validate(recurso, from_attributes=True)
            for recurso in resultado.recursos
        ],
        aviso_alcance=resultado.aviso_alcance,
        proveedor_modelo=obtener_proveedor_activo(),
    )
