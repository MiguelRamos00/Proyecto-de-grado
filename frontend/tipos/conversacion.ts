import type {
  esquemaRecursoConversacion,
  esquemaRespuestaConversacion,
  esquemaSolicitudConversacion,
} from "@/esquemas/conversacion";
import type { z } from "zod";

export type SolicitudConversacion = z.infer<typeof esquemaSolicitudConversacion>;
export type RecursoConversacion = z.infer<typeof esquemaRecursoConversacion>;
export type RespuestaConversacion = z.infer<typeof esquemaRespuestaConversacion>;
