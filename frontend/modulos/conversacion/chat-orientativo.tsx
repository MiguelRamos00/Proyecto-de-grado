"use client";

import { esquemaSolicitudConversacion } from "@/esquemas/conversacion";
import { ErrorApi } from "@/servicios/api/cliente-api";
import { enviarMensajeConversacional } from "@/servicios/api/conversaciones";
import type { RespuestaConversacion } from "@/tipos/conversacion";
import Link from "next/link";
import { FormEvent, useState } from "react";

type EstadoEnvio = "inactivo" | "enviando" | "error";

export function ChatOrientativo({ diagnosticoId }: { diagnosticoId?: string }) {
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
      ...(diagnosticoId ? { diagnostico_id: diagnosticoId } : {}),
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
    <section className="tarjeta tarjeta-chat" aria-labelledby="titulo-chat-orientativo">
      <header className="cabecera-chat-orientativo">
        <p className="marca-radia">RADIA</p>
        <p className="etiqueta">ORIENTACIÓN ACADÉMICA</p>
        <h1 id="titulo-chat-orientativo">Conversemos sobre tu aprendizaje.</h1>
        <p className="descripcion-chat">Encuentra una orientación inicial para fortalecer tus competencias técnicas y actitudinales.</p>
      </header>
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
        <div className="acciones-chat">
          <button type="submit" disabled={estado === "enviando"}>
            {estado === "enviando" ? "Enviando" : "Enviar mensaje"}
          </button>
          <span>Tu mensaje no se comparte con otras personas usuarias.</span>
        </div>
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
          {respuesta.fuentes_documentales.length > 0 && (
            <>
              <h3>Fuentes consultadas</h3>
              <ul className="lista-fuentes-chat">
                {respuesta.fuentes_documentales.map((fuente) => (
                  <li key={`${fuente.identificador}-${fuente.ubicacion ?? "general"}`}>
                    <strong>{fuente.identificador}</strong>
                    <span>{fuente.ubicacion ? `, ${fuente.ubicacion}` : ""}</span>
                    <p>{fuente.referencia}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <p className="pie-chat"><Link href="/">Volver al inicio del agente</Link></p>
    </section>
  );
}
