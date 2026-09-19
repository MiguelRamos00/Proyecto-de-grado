import { z } from "zod";

const urlApi = process.env.NEXT_PUBLIC_URL_API_BACKEND ?? "http://localhost:8000";

export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    public readonly codigoEstado?: number,
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

export async function solicitarJson<T>(
  ruta: string,
  esquemaRespuesta: z.ZodType<T>,
  opciones: RequestInit = {},
): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${urlApi}${ruta}`, {
      ...opciones,
      headers: {
        Accept: "application/json",
        ...opciones.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ErrorApi("No fue posible comunicarse con el backend.");
  }

  if (!respuesta.ok) {
    if (respuesta.status === 422) {
      throw new ErrorApi("Las respuestas enviadas no cumplen con el instrumento activo.", respuesta.status);
    }

    throw new ErrorApi("No fue posible completar la solicitud. Intenta nuevamente.", respuesta.status);
  }

  const contenido = await respuesta.json().catch(() => {
    throw new ErrorApi("El backend devolvió una respuesta que no se puede procesar.");
  });

  const validacion = esquemaRespuesta.safeParse(contenido);
  if (!validacion.success) {
    throw new ErrorApi("El backend devolvió una respuesta con un formato inesperado.");
  }

  return validacion.data;
}
