import {
  esquemaDiagnosticoCreado,
  esquemaInstrumentoActivo,
  esquemaSolicitudCrearDiagnostico,
} from "@/esquemas/diagnostico";
import type { DiagnosticoCreado, InstrumentoActivo, SolicitudCrearDiagnostico } from "@/tipos/diagnostico";

import { solicitarJson } from "./cliente-api";

export function consultarInstrumentoActivo(): Promise<InstrumentoActivo> {
  return solicitarJson("/api/v1/diagnosticos/instrumento-activo", esquemaInstrumentoActivo);
}

export function registrarDiagnostico(solicitud: SolicitudCrearDiagnostico): Promise<DiagnosticoCreado> {
  const solicitudValidada = esquemaSolicitudCrearDiagnostico.parse(solicitud);

  return solicitarJson("/api/v1/diagnosticos", esquemaDiagnosticoCreado, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitudValidada),
  });
}
