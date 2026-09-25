"use client";

import { esquemaSolicitudConversacion } from "@/esquemas/conversacion";
import { ErrorApi } from "@/servicios/api/cliente-api";
import { enviarMensajeConversacional } from "@/servicios/api/conversaciones";
import type { RespuestaConversacion } from "@/tipos/conversacion";
import Link from "next/link";
import { FormEvent, useState } from "react";

type EstadoEnvio = "inactivo" | "enviando" | "error";

export function ChatOrientativo() {
  const [sesionId] = useState(() => crypto.randomUUID());
  const [mensaje, establecerMensaje] = useState("");
  const [respuesta, establecerRespuesta] = useState<RespuestaConversacion | null>(null);
  const [estado, establecerEstado] = useState<EstadoEnvio>("inactivo");
  const [error, establecerError] = useState("");

  async function enviarMensaje(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const validacion = esquemaSolicitudConversacion.safeParse({
      sesion_id: sesionId,
      mensaje,
    });

    if (!validacion.success) {
      establecerEstado("error");
      establecerError("Escribe un mensaje de hasta 1000 caracteres para recibir orientación.");
      return;
    }

    establecerEstado("enviando");
    establecerError("");

    try {
      establecerRespuesta(await enviarMensajeConversacional(validacion.data));
      establecerEstado("inactivo");
    } catch (causa) {
      establecerEstado("error");
      establecerError(causa instanceof ErrorApi ? causa.message : "No fue posible obtener una orientación.");
    }
  }

  return (
    <section className="tarjeta tarjeta-chat">
      <p className="etiqueta">Proyecto RADIA</p>
      <h1>Chat orientativo</h1>
      <p className="aviso">La conversación ofrece orientación general para el aprendizaje. No es una evaluación académica, psicológica ni profesional.</p>

      <form onSubmit={enviarMensaje} noValidate className="formulario-chat">
        <label htmlFor="mensaje-chat">¿Sobre qué competencia o recurso deseas orientación?</label>
        <textarea
          id="mensaje-chat"
          value={mensaje}
          onChange={(evento) => establecerMensaje(evento.target.value)}
          maxLength={1000}
          rows={5}
          disabled={estado === "enviando"}
        />
        {error && <p className="mensaje-error" role="alert">{error}</p>}
        <button type="submit" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando" : "Enviar mensaje"}
        </button>
      </form>

      {respuesta && (
        <section className="respuesta-chat" aria-live="polite">
          <h2>Orientación</h2>
          <p>{respuesta.respuesta}</p>
          <p className="aviso">{respuesta.aviso_alcance}</p>
          {respuesta.recursos.length > 0 && (
            <>
              <h3>Recursos sugeridos</h3>
              <ul className="lista-recursos-chat">
                {respuesta.recursos.map((recurso) => (
                  <li key={recurso.titulo}>
                    <strong>{recurso.titulo}</strong>
                    <p>{recurso.descripcion}</p>
                    {recurso.enlace && <a href={recurso.enlace}>Consultar recurso</a>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <p><Link href="/">Volver al inicio</Link></p>
    </section>
  );
}
