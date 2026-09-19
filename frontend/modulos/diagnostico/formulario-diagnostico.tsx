"use client";

import { esquemaSolicitudCrearDiagnostico } from "@/esquemas/diagnostico";
import { ErrorApi } from "@/servicios/api/cliente-api";
import { consultarInstrumentoActivo, registrarDiagnostico } from "@/servicios/api/diagnosticos";
import type { InstrumentoActivo } from "@/tipos/diagnostico";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type EstadoInstrumento = "cargando" | "listo" | "error";
type EstadoEnvio = "sin_enviar" | "enviando" | "registrado" | "error";

const etiquetasEscala: Record<number, string> = {
  1: "Nada segura",
  2: "Poco segura",
  3: "Moderadamente segura",
  4: "Segura",
  5: "Muy segura",
};

function nombreCategoria(categoria: string) {
  return categoria === "tecnica" ? "Competencias técnicas" : "Competencias actitudinales";
}

export function FormularioDiagnostico() {
  const [instrumento, establecerInstrumento] = useState<InstrumentoActivo | null>(null);
  const [respuestas, establecerRespuestas] = useState<Record<string, number>>({});
  const [estadoInstrumento, establecerEstadoInstrumento] = useState<EstadoInstrumento>("cargando");
  const [estadoEnvio, establecerEstadoEnvio] = useState<EstadoEnvio>("sin_enviar");
  const [mensaje, establecerMensaje] = useState("");

  async function cargarInstrumento() {
    establecerEstadoInstrumento("cargando");
    establecerMensaje("");

    try {
      const instrumentoActivo = await consultarInstrumentoActivo();
      establecerInstrumento(instrumentoActivo);
      establecerEstadoInstrumento("listo");
    } catch (error) {
      establecerEstadoInstrumento("error");
      establecerMensaje(error instanceof ErrorApi ? error.message : "No fue posible cargar el diagnóstico.");
    }
  }

  useEffect(() => {
    void cargarInstrumento();
  }, []);

  function seleccionarRespuesta(preguntaId: string, valor: number) {
    establecerRespuestas((respuestasActuales) => ({ ...respuestasActuales, [preguntaId]: valor }));
  }

  async function enviarDiagnostico(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!instrumento) {
      return;
    }

    const solicitud = {
      instrumento_id: instrumento.instrumento_id,
      respuestas: instrumento.preguntas.map((pregunta) => ({
        pregunta_id: pregunta.id,
        valor: respuestas[pregunta.id],
      })),
    };
    const validacion = esquemaSolicitudCrearDiagnostico.safeParse(solicitud);

    if (!validacion.success) {
      establecerEstadoEnvio("error");
      establecerMensaje("Responde todas las preguntas con un valor entre 1 y 5 antes de continuar.");
      return;
    }

    establecerEstadoEnvio("enviando");
    establecerMensaje("");

    try {
      await registrarDiagnostico(validacion.data);
      establecerEstadoEnvio("registrado");
      establecerMensaje("El diagnóstico fue registrado. Las recomendaciones se habilitarán en una iteración posterior del MVP.");
    } catch (error) {
      establecerEstadoEnvio("error");
      establecerMensaje(error instanceof ErrorApi ? error.message : "No fue posible registrar el diagnóstico.");
    }
  }

  if (estadoInstrumento === "cargando") {
    return <section className="tarjeta"><p aria-live="polite">Cargando el instrumento de diagnóstico.</p></section>;
  }

  if (estadoInstrumento === "error" || !instrumento) {
    return (
      <section className="tarjeta">
        <p className="etiqueta">Proyecto RADIA</p>
        <h1>Diagnóstico inicial</h1>
        <p role="alert">{mensaje}</p>
        <button type="button" onClick={() => void cargarInstrumento()}>Reintentar</button>
        <p><Link href="/">Volver al inicio</Link></p>
      </section>
    );
  }

  return (
    <section className="tarjeta tarjeta-diagnostico">
      <p className="etiqueta">Proyecto RADIA</p>
      <h1>{instrumento.nombre}</h1>
      <p>{instrumento.descripcion}</p>
      <p className="aviso">Este instrumento es simulado y valida el flujo técnico del MVP. No reemplaza una encuesta oficial del semillero ni acompañamiento profesional.</p>
      <p className="escala">Escala: 1 significa nada segura y 5 significa muy segura.</p>

      <form onSubmit={enviarDiagnostico} noValidate>
        {instrumento.preguntas.map((pregunta, indice) => (
          <fieldset key={pregunta.id} className="pregunta">
            <legend>{indice + 1}. {pregunta.texto}</legend>
            <p className="categoria">{nombreCategoria(pregunta.categoria)}</p>
            <div className="opciones-escala">
              {Array.from(
                { length: pregunta.escala_maxima - pregunta.escala_minima + 1 },
                (_, posicion) => pregunta.escala_minima + posicion,
              ).map((valor) => (
                <label key={valor} className="opcion-escala">
                  <input
                    type="radio"
                    name={pregunta.id}
                    value={valor}
                    checked={respuestas[pregunta.id] === valor}
                    onChange={() => seleccionarRespuesta(pregunta.id, valor)}
                  />
                  <span>{valor}</span>
                  <small>{etiquetasEscala[valor]}</small>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {mensaje && (
          <p className={`mensaje-${estadoEnvio}`} role={estadoEnvio === "error" ? "alert" : undefined} aria-live="polite">
            {mensaje}
          </p>
        )}
        <button type="submit" disabled={estadoEnvio === "enviando" || estadoEnvio === "registrado"}>
          {estadoEnvio === "enviando" ? "Registrando" : "Registrar diagnóstico"}
        </button>
      </form>
      <p><Link href="/">Volver al inicio</Link></p>
    </section>
  );
}
