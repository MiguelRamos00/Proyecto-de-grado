from sqlalchemy.orm import Session

from app.aplicacion.diagnostico.registrar_diagnostico import (
    DiagnosticoRegistrado,
    SolicitudRegistroDiagnostico,
)
from app.infraestructura.persistencia.modelos import Diagnostico, RespuestaDiagnostico


class RepositorioDiagnosticosSqlAlchemy:
    """Adaptador de salida para persistir diagnósticos con SQLAlchemy."""

    def __init__(self, sesion: Session) -> None:
        self._sesion = sesion

    def guardar(self, solicitud: SolicitudRegistroDiagnostico) -> DiagnosticoRegistrado:
        """Guarda un diagnóstico y sus respuestas en una única transacción."""
        diagnostico = Diagnostico(
            instrumento_id=solicitud.instrumento_id,
            estado="registrado",
            respuestas=[
                RespuestaDiagnostico(
                    pregunta_id=respuesta.pregunta_id,
                    valor=respuesta.valor,
                )
                for respuesta in solicitud.respuestas
            ],
        )
        self._sesion.add(diagnostico)
        self._sesion.commit()
        self._sesion.refresh(diagnostico)

        return DiagnosticoRegistrado(
            id=diagnostico.id,
            instrumento_id=diagnostico.instrumento_id,
            estado=diagnostico.estado,
            fecha_creacion=diagnostico.fecha_creacion,
        )
