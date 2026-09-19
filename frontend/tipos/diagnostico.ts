import type {
  esquemaDiagnosticoCreado,
  esquemaInstrumentoActivo,
  esquemaPreguntaDiagnostico,
  esquemaRespuestaDiagnostico,
  esquemaSolicitudCrearDiagnostico,
} from "@/esquemas/diagnostico";
import type { z } from "zod";

export type PreguntaDiagnostico = z.infer<typeof esquemaPreguntaDiagnostico>;
export type InstrumentoActivo = z.infer<typeof esquemaInstrumentoActivo>;
export type RespuestaDiagnostico = z.infer<typeof esquemaRespuestaDiagnostico>;
export type SolicitudCrearDiagnostico = z.infer<typeof esquemaSolicitudCrearDiagnostico>;
export type DiagnosticoCreado = z.infer<typeof esquemaDiagnosticoCreado>;
