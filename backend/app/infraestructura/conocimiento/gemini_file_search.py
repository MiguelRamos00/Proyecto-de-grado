"""Adaptador de Gemini File Search para el puerto documental."""

import os
from typing import Protocol

from app.dominios.conocimiento.documentos import (
    ConsultaDocumental,
    FragmentoDocumental,
    ResultadoConsultaDocumental,
)
from app.puertos.consultor_documental import ConsultorDocumental


class InteraccionesGemini(Protocol):
    """Parte mínima del cliente Gemini usada para recuperar evidencia."""

    def create(self, **parametros: object) -> object:
        """Crea una interacción usando las herramientas configuradas."""


class ClienteGemini(Protocol):
    """Cliente mínimo para desacoplar las pruebas del SDK externo."""

    interactions: InteraccionesGemini


class ConsultorDocumentalGemini(ConsultorDocumental):
    """Recupera evidencia trazable desde un almacén de Gemini File Search."""

    def __init__(self, cliente: ClienteGemini, almacen: str, modelo: str) -> None:
        self._cliente = cliente
        self._almacen = almacen
        self._modelo = modelo

    def consultar(self, consulta: ConsultaDocumental) -> ResultadoConsultaDocumental:
        """Consulta el almacén configurado y conserva solo citas de archivos."""
        if not consulta.pregunta.strip():
            return ResultadoConsultaDocumental()

        interaccion = self._cliente.interactions.create(
            model=self._modelo,
            input=consulta.pregunta,
            tools=[
                {
                    "type": "file_search",
                    "file_search_store_names": [self._almacen],
                }
            ],
        )
        return ResultadoConsultaDocumental(
            fragmentos=tuple(_extraer_fragmentos_citados(interaccion))
        )


def crear_consultor_documental_desde_entorno() -> ConsultorDocumentalGemini:
    """Construye el adaptador sin exponer la clave en otras capas."""
    clave_api = os.getenv("CLAVE_API_IA", "").strip()
    almacen = os.getenv("ALMACEN_FILE_SEARCH", "").strip()
    modelo = os.getenv("MODELO_FILE_SEARCH", "").strip() or os.getenv("MODELO_IA", "").strip()
    if not clave_api or not almacen or not modelo:
        raise ValueError(
            "File Search requiere CLAVE_API_IA, ALMACEN_FILE_SEARCH y MODELO_FILE_SEARCH "
            "o MODELO_IA."
        )

    from google import genai

    return ConsultorDocumentalGemini(
        cliente=genai.Client(api_key=clave_api),
        almacen=almacen,
        modelo=modelo,
    )


def _extraer_fragmentos_citados(interaccion: object) -> list[FragmentoDocumental]:
    """Convierte las citas de Gemini en objetos simples del dominio."""
    fragmentos: list[FragmentoDocumental] = []
    for paso in getattr(interaccion, "steps", ()) or ():
        if getattr(paso, "type", None) != "model_output":
            continue
        for bloque in getattr(paso, "content", ()) or ():
            if getattr(bloque, "type", None) != "text":
                continue
            contenido = str(getattr(bloque, "text", "")).strip()
            if not contenido:
                continue
            for cita in getattr(bloque, "annotations", ()) or ():
                if getattr(cita, "type", None) != "file_citation":
                    continue
                nombre_archivo = str(getattr(cita, "file_name", "fuente_documental"))
                referencia = str(getattr(cita, "source", None) or nombre_archivo)
                pagina = getattr(cita, "page_number", None)
                fragmentos.append(
                    FragmentoDocumental(
                        contenido=contenido,
                        fuente_id=nombre_archivo,
                        referencia=referencia,
                        ubicacion=f"página {pagina}" if pagina is not None else None,
                    )
                )
    return fragmentos
