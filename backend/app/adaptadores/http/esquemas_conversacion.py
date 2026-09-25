"""Contratos HTTP del módulo de conversación."""

from uuid import UUID

from pydantic import BaseModel, Field


class SolicitudConversacionEntrada(BaseModel):
    """Contrato para enviar un mensaje al agente del MVP."""

    sesion_id: UUID
    mensaje: str = Field(min_length=1, max_length=1000)
    diagnostico_id: UUID | None = None


class RecursoConversacionRespuesta(BaseModel):
    """Recurso que se muestra junto con la orientación."""

    titulo: str
    descripcion: str
    enlace: str | None = None


class RespuestaConversacionSalida(BaseModel):
    """Contrato de salida de una respuesta conversacional."""

    respuesta: str
    recursos: list[RecursoConversacionRespuesta]
    aviso_alcance: str
    proveedor_modelo: str
