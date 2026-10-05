import type {
  esquemaFuenteDocumental,
  esquemaRecursoConversacion,
  esquemaRespuestaConversacion,
  esquemaSolicitudConversacion,
} from "@/esquemas/conversacion";
import type { z } from "zod";

export type SolicitudConversacion = z.infer<typeof esquemaSolicitudConversacion>;
export type RecursoConversacion = z.infer<typeof esquemaRecursoConversacion>;
export type FuenteDocumental = z.infer<typeof esquemaFuenteDocumental>;
export type RespuestaConversacion = z.infer<typeof esquemaRespuestaConversacion>;
