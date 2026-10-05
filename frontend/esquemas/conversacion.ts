import { z } from "zod";

export const esquemaSolicitudConversacion = z.object({
  sesion_id: z.string().uuid(),
  mensaje: z.string().trim().min(1).max(1000),
  diagnostico_id: z.string().uuid().optional(),
});

export const esquemaRecursoConversacion = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
  enlace: z.string().url().nullable(),
});

export const esquemaFuenteDocumental = z.object({
  identificador: z.string().min(1),
  referencia: z.string().min(1),
  ubicacion: z.string().min(1).nullable(),
});

export const esquemaRespuestaConversacion = z.object({
  tipo_respuesta: z.enum(["orientacion", "fuera_de_alcance", "sin_contexto_suficiente"]),
  respuesta: z.string().min(1),
  recursos: z.array(esquemaRecursoConversacion),
  fuentes_documentales: z.array(esquemaFuenteDocumental),
  aviso_alcance: z.string().min(1),
  proveedor_modelo: z.string().min(1),
});
