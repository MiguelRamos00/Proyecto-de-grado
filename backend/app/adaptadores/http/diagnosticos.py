from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.adaptadores.http.dependencias import obtener_repositorio_diagnosticos
from app.adaptadores.http.esquemas_diagnostico import (
    DiagnosticoCreadoRespuesta,
    InstrumentoActivoRespuesta,
    PreguntaInstrumentoRespuesta,
    SolicitudCrearDiagnostico,
)
from app.aplicacion.diagnostico.registrar_diagnostico import (
    RegistrarDiagnostico,
    RespuestaRegistroDiagnostico,
    SolicitudRegistroDiagnostico,
)
from app.dominios.diagnostico.instrumento import obtener_instrumento_activo
from app.puertos.repositorio_diagnosticos import RepositorioDiagnosticos


enrutador = APIRouter(prefix="/api/v1/diagnosticos", tags=["diagnosticos"])
RepositorioDiagnosticosDependencia = Annotated[
    RepositorioDiagnosticos, Depends(obtener_repositorio_diagnosticos)
]


@enrutador.get("/instrumento-activo", response_model=InstrumentoActivoRespuesta)
def consultar_instrumento_activo() -> InstrumentoActivoRespuesta:
    """Consulta el instrumento simulado disponible para esta iteración."""
    instrumento = obtener_instrumento_activo()
    return InstrumentoActivoRespuesta(
        instrumento_id=instrumento.id,
        nombre=instrumento.nombre,
        descripcion=instrumento.descripcion,
        preguntas=[
            PreguntaInstrumentoRespuesta(
                id=pregunta.id,
                texto=pregunta.texto,
                categoria=pregunta.categoria,
            )
            for pregunta in instrumento.preguntas
        ],
    )


@enrutador.post("", response_model=DiagnosticoCreadoRespuesta, status_code=status.HTTP_201_CREATED)
def crear_diagnostico(
    solicitud_http: SolicitudCrearDiagnostico,
    repositorio: RepositorioDiagnosticosDependencia,
) -> DiagnosticoCreadoRespuesta:
    """Registra respuestas válidas sin calcular perfiles ni recomendaciones."""
    solicitud = SolicitudRegistroDiagnostico(
        instrumento_id=solicitud_http.instrumento_id,
        respuestas=tuple(
            RespuestaRegistroDiagnostico(
                pregunta_id=respuesta.pregunta_id,
                valor=respuesta.valor,
            )
            for respuesta in solicitud_http.respuestas
        ),
    )
    resultado = RegistrarDiagnostico(repositorio).ejecutar(solicitud)
    return DiagnosticoCreadoRespuesta(
        diagnostico_id=resultado.id,
        instrumento_id=resultado.instrumento_id,
        estado=resultado.estado,
        fecha_creacion=resultado.fecha_creacion,
    )
