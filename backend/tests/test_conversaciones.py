from uuid import uuid4

from fastapi.testclient import TestClient

from app.aplicacion.conversacion.conversar_con_agente import ConversarConAgente
from app.dominios.conversacion.mensajes import RespuestaConversacion, SolicitudConversacion
from app.main import aplicacion


class AgenteConversacionalFalso:
    """Doble de prueba que evita cualquier llamada a proveedores externos."""

    def responder(self, solicitud: SolicitudConversacion) -> RespuestaConversacion:
        return RespuestaConversacion(respuesta=f"Orientación para: {solicitud.mensaje}", recursos=())


def test_caso_de_uso_delega_el_mensaje_al_puerto() -> None:
    """El caso de uso devuelve la respuesta entregada por el puerto."""
    solicitud = SolicitudConversacion(sesion_id=uuid4(), mensaje="Quiero practicar programación.")

    resultado = ConversarConAgente(AgenteConversacionalFalso()).ejecutar(solicitud)

    assert resultado.respuesta == "Orientación para: Quiero practicar programación."
    assert "No corresponde a una evaluación" in resultado.aviso_alcance


def test_endpoint_responde_con_el_proveedor_simulado() -> None:
    """La ruta funciona sin claves ni peticiones a un modelo externo."""
    cliente = TestClient(aplicacion)

    respuesta = cliente.post(
        "/api/v1/conversaciones",
        json={"sesion_id": str(uuid4()), "mensaje": "Necesito ayuda con programación."},
    )

    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["proveedor_modelo"] == "simulado"
    assert len(cuerpo["recursos"]) == 1
    assert "No corresponde a una evaluación" in cuerpo["aviso_alcance"]


def test_endpoint_rechaza_un_mensaje_vacio() -> None:
    """Pydantic bloquea solicitudes inválidas antes de invocar el agente."""
    cliente = TestClient(aplicacion)

    respuesta = cliente.post(
        "/api/v1/conversaciones",
        json={"sesion_id": str(uuid4()), "mensaje": ""},
    )

    assert respuesta.status_code == 422
