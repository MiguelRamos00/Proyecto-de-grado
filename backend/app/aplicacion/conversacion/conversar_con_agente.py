"""Caso de uso que coordina el puerto del agente conversacional."""

from app.dominios.conversacion.mensajes import RespuestaConversacion, SolicitudConversacion
from app.puertos.agente_conversacional import AgenteConversacional


class ConversarConAgente:
    """Solicita orientación al agente sin acoplarse al proveedor concreto."""

    def __init__(self, agente: AgenteConversacional) -> None:
        self._agente = agente

    def ejecutar(self, solicitud: SolicitudConversacion) -> RespuestaConversacion:
        """Devuelve una respuesta estructurada generada por el puerto configurado."""
        return self._agente.responder(solicitud)
