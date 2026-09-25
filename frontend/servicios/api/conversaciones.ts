import {
  esquemaRespuestaConversacion,
  esquemaSolicitudConversacion,
} from "@/esquemas/conversacion";
import type { RespuestaConversacion, SolicitudConversacion } from "@/tipos/conversacion";

import { solicitarJson } from "./cliente-api";

export function enviarMensajeConversacional(
  solicitud: SolicitudConversacion,
): Promise<RespuestaConversacion> {
  const solicitudValidada = esquemaSolicitudConversacion.parse(solicitud);

  return solicitarJson("/api/v1/conversaciones", esquemaRespuestaConversacion, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitudValidada),
  });
}
