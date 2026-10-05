"""Caso de uso que coordina el puerto del agente conversacional."""

from app.dominios.conversacion.mensajes import RespuestaConversacion, SolicitudConversacion
from app.dominios.conversacion.reglas_alcance import (
    MotivoBloqueoConversacion,
    evaluar_alcance_conversacion,
)
from app.puertos.agente_conversacional import AgenteConversacional


class ConversarConAgente:
    """Solicita orientación al agente sin acoplarse al proveedor concreto."""

    def __init__(self, agente: AgenteConversacional) -> None:
        self._agente = agente

    def ejecutar(self, solicitud: SolicitudConversacion) -> RespuestaConversacion:
        """Evalúa el alcance y delega solo las consultas permitidas al puerto."""
        decision = evaluar_alcance_conversacion(solicitud.mensaje)
        if not decision.permitida:
            return RespuestaConversacion(
                respuesta=_obtener_respuesta_segura(decision.motivo),
                recursos=(),
            )
        return self._agente.responder(solicitud)


def _obtener_respuesta_segura(motivo: MotivoBloqueoConversacion | None) -> str:
    """Devuelve un mensaje fijo sin consultar al proveedor externo."""
    respuestas = {
        MotivoBloqueoConversacion.DATOS_SENSIBLES: (
            "Por seguridad, no compartas contraseñas, documentos ni datos financieros. "
            "Puedo orientarte sobre aprendizaje y competencias sin esa información."
        ),
        MotivoBloqueoConversacion.EVALUACION_NO_PERMITIDA: (
            "No realizo evaluaciones psicológicas, profesionales ni calificaciones "
            "académicas. Puedo ofrecer orientación general sobre hábitos y competencias "
            "de aprendizaje."
        ),
        MotivoBloqueoConversacion.FUERA_DE_ALCANCE: (
            "Esta consulta está fuera del alcance del agente. Puedo apoyarte con "
            "orientación general sobre competencias y aprendizaje en Ingeniería de Sistemas."
        ),
    }
    return respuestas[motivo]
