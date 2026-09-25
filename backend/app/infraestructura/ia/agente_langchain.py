"""Adaptador LangChain para modelos conversacionales configurables."""

from typing import Protocol

from langchain_core.messages import HumanMessage, SystemMessage

from app.dominios.conversacion.mensajes import RespuestaConversacion, SolicitudConversacion


class ModeloConversacionalLangChain(Protocol):
    """Interfaz mínima de un modelo invocable por LangChain."""

    def invoke(self, entrada: list[SystemMessage | HumanMessage]) -> object:
        """Genera una respuesta para los mensajes entregados."""


class AgenteConversacionalLangChain:
    """Adapta un modelo LangChain al puerto de conversación del proyecto."""

    def __init__(self, modelo: ModeloConversacionalLangChain, nombre_proveedor: str) -> None:
        self._modelo = modelo
        self.nombre_proveedor = nombre_proveedor

    def responder(self, solicitud: SolicitudConversacion) -> RespuestaConversacion:
        """Solicita una orientación breve, segura y limitada al contexto permitido."""
        mensajes = [
            SystemMessage(
                content=(
                    "Responde en español con orientación general de aprendizaje. "
                    "No realices evaluaciones académicas, psicológicas ni profesionales. "
                    "No inventes datos de RADIA ni recursos no confirmados."
                )
            ),
            HumanMessage(content=solicitud.mensaje),
        ]
        resultado = self._modelo.invoke(mensajes)
        contenido = getattr(resultado, "content", "")
        respuesta = contenido if isinstance(contenido, str) and contenido.strip() else (
            "No fue posible generar una orientación en este momento. "
            "Puedes intentar nuevamente con una pregunta más específica."
        )
        return RespuestaConversacion(respuesta=respuesta, recursos=())
