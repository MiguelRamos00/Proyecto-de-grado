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
      <section className="tarjeta-inicio">
        <p className="etiqueta">Proyecto RADIA</p>
        <h1>Agente de orientación académica</h1>
        <p>Conversa sobre las competencias técnicas y actitudinales que deseas fortalecer, o explora el diagnóstico simulado del MVP.</p>
        <p className="aviso">La orientación es general y no constituye una evaluación académica, psicológica ni profesional. El diagnóstico simulado es una función independiente y no es necesario para iniciar el chat.</p>
        <p><Link className="enlace-principal" href="/diagnostico">Iniciar diagnóstico simulado</Link></p>
        <p><Link href="/chat">Abrir chat orientativo</Link></p>
        <button type="button" onClick={verificarBackend} disabled={estado === "verificando"}>
          {estado === "verificando" ? "Verificando" : "Verificar backend"}
        </button>
        <p aria-live="polite" className={`estado estado-${estado}`}>{mensajeEstado}</p>
      </section>
    </main>
  );
}
