from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    from app.aplicacion.diagnostico.registrar_diagnostico import (
        DiagnosticoRegistrado,
        SolicitudRegistroDiagnostico,
    )


class RepositorioDiagnosticos(Protocol):
    """Contrato de persistencia requerido por el caso de uso de diagnóstico."""

    def guardar(
        self, solicitud: "SolicitudRegistroDiagnostico"
    ) -> "DiagnosticoRegistrado":
        """Persiste un diagnóstico validado y devuelve su registro mínimo."""
