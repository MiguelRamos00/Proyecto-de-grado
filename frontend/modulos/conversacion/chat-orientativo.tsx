"use client";

import { esquemaSolicitudConversacion } from "@/esquemas/conversacion";
import { ErrorApi } from "@/servicios/api/cliente-api";
import { enviarMensajeConversacional } from "@/servicios/api/conversaciones";
import type { RespuestaConversacion } from "@/tipos/conversacion";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type EstadoEnvio = "inactivo" | "enviando";
type EstadoServicio = "verificando" | "disponible" | "no_disponible";
type EntradaConversacion =
  | { id: string; autor: "usuario"; texto: string }
  | { id: string; autor: "agente"; respuesta: RespuestaConversacion };

const SUGERENCIAS = [
  "Quiero fortalecer mis conocimientos de bases de datos",
  "¿Cómo puedo mejorar mi trabajo en equipo en proyectos de software?",
  "¿Por dónde empiezo a aprender programación orientada a objetos?",
];

const ETIQUETAS_RESPUESTA: Record<RespuestaConversacion["tipo_respuesta"], string> = {
  orientacion: "Orientación",
  fuera_de_alcance: "Fuera de alcance",
  sin_contexto_suficiente: "Necesito más contexto",
};

export function ChatOrientativo({ diagnosticoId }: { diagnosticoId?: string }) {
  const [sesionId, establecerSesionId] = useState(() => crypto.randomUUID());
  const [mensaje, establecerMensaje] = useState("");
  const [entradas, establecerEntradas] = useState<EntradaConversacion[]>([]);
  const [estado, establecerEstado] = useState<EstadoEnvio>("inactivo");
  const [estadoServicio, establecerEstadoServicio] = useState<EstadoServicio>("verificando");
  const [error, establecerError] = useState("");
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controlador = new AbortController();
    const urlApi = process.env.NEXT_PUBLIC_URL_API_BACKEND ?? "http://localhost:8000";
    fetch(`${urlApi}/api/v1/salud`, { signal: controlador.signal, cache: "no-store" })
      .then((respuesta) => establecerEstadoServicio(respuesta.ok ? "disponible" : "no_disponible"))
      .catch(() => { if (!controlador.signal.aborted) establecerEstadoServicio("no_disponible"); });
    return () => controlador.abort();
  }, []);

  useEffect(() => {
    if (listaRef.current && (entradas.length > 0 || estado === "enviando")) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [entradas.length, estado]);

  async function enviarTexto(texto: string) {
    if (estado === "enviando") return;
    const validacion = esquemaSolicitudConversacion.safeParse({
      sesion_id: sesionId,
      mensaje: texto,
      ...(diagnosticoId ? { diagnostico_id: diagnosticoId } : {}),
    });
    if (!validacion.success) {
      establecerError("Escribe un mensaje de hasta 1000 caracteres para recibir orientación.");
      return;
    }

    const idEntrada = crypto.randomUUID();
    establecerEntradas((actuales) => [...actuales, { id: idEntrada, autor: "usuario", texto: validacion.data.mensaje }]);
    establecerMensaje("");
    establecerEstado("enviando");
    establecerError("");

    try {
      const respuesta = await enviarMensajeConversacional(validacion.data);
      establecerEntradas((actuales) => [...actuales, { id: crypto.randomUUID(), autor: "agente", respuesta }]);
      establecerEstadoServicio("disponible");
    } catch (causa) {
      establecerEntradas((actuales) => actuales.filter((entrada) => entrada.id !== idEntrada));
      establecerMensaje(validacion.data.mensaje);
      establecerError(causa instanceof ErrorApi ? causa.message : "No fue posible obtener una orientación.");
      if (causa instanceof ErrorApi && !causa.codigoEstado) establecerEstadoServicio("no_disponible");
    } finally {
      establecerEstado("inactivo");
    }
  }

  function enviarMensaje(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    void enviarTexto(mensaje);
  }

  function manejarTecla(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      void enviarTexto(mensaje);
    }
  }

  function nuevaConversacion() {
    establecerSesionId(crypto.randomUUID());
    establecerEntradas([]);
    establecerMensaje("");
    establecerError("");
    if (listaRef.current) listaRef.current.scrollTop = 0;
  }

  return (
    <section className="panel-chat" aria-labelledby="titulo-chat-orientativo">
      <header className="cabecera-chat-orientativo">
        <p className="etiqueta">AGENTE DE ORIENTACIÓN</p>
        <h1 id="titulo-chat-orientativo">Orientación académica</h1>
        <p className="descripcion-chat">Conversa con el agente de IA de RADIA para recibir una orientación inicial sobre tus competencias técnicas y actitudinales.</p>
      </header>
      <div className="chat-contenedor">
        <div className="chat-estado">
          <span className={`chat-punto chat-punto-${estadoServicio}`} aria-hidden="true" />
          <span>{estadoServicio === "disponible" ? "Agente en línea" : estadoServicio === "verificando" ? "Conectando con el agente…" : "Agente sin conexión"}</span>
          {entradas.length > 0 && <button className="chat-nueva" type="button" onClick={nuevaConversacion} disabled={estado === "enviando"}>Nueva conversación</button>}
        </div>

        <div className="chat-lista" ref={listaRef} aria-live="polite">
          {entradas.length === 0 && (
            <div className="chat-vacio">
              <span className="chat-destello" aria-hidden="true">✧</span>
              <h2>¿En qué quieres fortalecerte?</h2>
              <p>Cuéntame qué competencia técnica o actitudinal quieres trabajar y te doy una orientación inicial con recursos.</p>
              <div className="chat-sugerencias">
                {SUGERENCIAS.map((sugerencia) => <button key={sugerencia} type="button" onClick={() => void enviarTexto(sugerencia)} disabled={estado === "enviando"}>{sugerencia}</button>)}
              </div>
            </div>
          )}
          {entradas.map((entrada) => entrada.autor === "usuario" ? (
            <div className="chat-burbuja chat-burbuja-usuario" key={entrada.id}><p>{entrada.texto}</p></div>
          ) : (
            <article className="chat-burbuja chat-burbuja-agente" key={entrada.id}>
              <h2>{ETIQUETAS_RESPUESTA[entrada.respuesta.tipo_respuesta]}</h2>
              <p className="chat-texto-respuesta">{entrada.respuesta.respuesta}</p>
              {entrada.respuesta.recursos.length > 0 && <div className="chat-adjuntos"><h3>Recursos sugeridos</h3><ul>{entrada.respuesta.recursos.map((recurso) => <li key={recurso.titulo}><strong>{recurso.titulo}</strong><span>{recurso.descripcion}</span>{recurso.enlace && <a href={recurso.enlace} target="_blank" rel="noopener noreferrer">Consultar recurso</a>}</li>)}</ul></div>}
              {entrada.respuesta.fuentes_documentales.length > 0 && <div className="chat-adjuntos"><h3>Fuentes consultadas</h3><ul>{entrada.respuesta.fuentes_documentales.map((fuente) => <li key={`${fuente.identificador}-${fuente.ubicacion ?? "general"}`}><strong>{fuente.identificador}</strong><span>{fuente.ubicacion ? `, ${fuente.ubicacion}` : ""}</span><span>{fuente.referencia}</span></li>)}</ul></div>}
              <p className="chat-aviso-respuesta">{entrada.respuesta.aviso_alcance}</p>
            </article>
          ))}
          {estado === "enviando" && <div className="chat-burbuja chat-burbuja-agente chat-cargando" role="status">Preparando una orientación inicial…</div>}
        </div>

        <div className="chat-pie">
          {error && <p className="mensaje-error chat-error" role="alert">{error}</p>}
          <form className="formulario-chat" onSubmit={enviarMensaje} noValidate>
            <label className="solo-lectores" htmlFor="mensaje-chat">Mensaje para el agente de orientación</label>
            <textarea id="mensaje-chat" value={mensaje} onChange={(evento) => establecerMensaje(evento.target.value)} onKeyDown={manejarTecla} placeholder="Escribe tu pregunta…" maxLength={1000} rows={2} disabled={estado === "enviando"} />
            <button type="submit" aria-label="Enviar mensaje" disabled={estado === "enviando"} title="Enviar mensaje">➤</button>
          </form>
          <p>Orientación general de aprendizaje, no es una evaluación académica, psicológica ni profesional. Tu mensaje no se comparte con otras personas.</p>
        </div>
      </div>
      <p className="pie-chat"><Link href="/">Volver al inicio del agente</Link></p>
    </section>
  );
}
