"use client";

import { useState } from "react";
import Link from "next/link";

type EstadoServicio = "sin_verificar" | "verificando" | "disponible" | "no_disponible";

const urlApi = process.env.NEXT_PUBLIC_URL_API_BACKEND ?? "http://localhost:8000";

export default function Inicio() {
  const [estado, establecerEstado] = useState<EstadoServicio>("sin_verificar");

  async function verificarBackend() {
    establecerEstado("verificando");

    try {
      const respuesta = await fetch(`${urlApi}/api/v1/salud`, { cache: "no-store" });
      establecerEstado(respuesta.ok ? "disponible" : "no_disponible");
    } catch {
      establecerEstado("no_disponible");
    }
  }

  const mensajeEstado = {
    sin_verificar: "Aún no se ha verificado la conexión con el backend.",
    verificando: "Verificando la conexión con el backend.",
    disponible: "El backend está disponible.",
    no_disponible: "El backend no está disponible. Verifica que Docker Compose esté en ejecución.",
  }[estado];

  return (
    <main>
      <section>
        <p className="etiqueta">Proyecto RADIA</p>
        <h1>Agente de orientación</h1>
        <p>Base técnica del MVP para apoyar el fortalecimiento de competencias técnicas y actitudinales.</p>
        <p className="aviso">Las recomendaciones del futuro agente serán orientativas y no reemplazarán acompañamiento profesional.</p>
        <p><Link className="enlace-principal" href="/diagnostico">Iniciar diagnóstico simulado</Link></p>
        <button type="button" onClick={verificarBackend} disabled={estado === "verificando"}>
          {estado === "verificando" ? "Verificando" : "Verificar backend"}
        </button>
        <p aria-live="polite" className={`estado estado-${estado}`}>{mensajeEstado}</p>
      </section>
    </main>
  );
}
