import {
  esquemaDiagnosticoCreado,
  esquemaInstrumentoActivo,
  esquemaResultadoOrientativo,
  esquemaSolicitudCrearDiagnostico,
} from "@/esquemas/diagnostico";
import type {
  DiagnosticoCreado,
  InstrumentoActivo,
  ResultadoOrientativo,
  SolicitudCrearDiagnostico,
} from "@/tipos/diagnostico";

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

export function consultarResultadoOrientativo(
  diagnosticoId: string,
): Promise<ResultadoOrientativo> {
  return solicitarJson(
    `/api/v1/diagnosticos/${diagnosticoId}/resultado-orientativo`,
    esquemaResultadoOrientativo,
  );
}
