"use client";

import { ErrorApi } from "@/servicios/api/cliente-api";
import { consultarResultadoOrientativo } from "@/servicios/api/diagnosticos";
import type { CompetenciaOrientativa, ResultadoOrientativo } from "@/tipos/diagnostico";
import Link from "next/link";
import { useEffect, useState } from "react";

type EstadoResultado = "cargando" | "listo" | "error";

function nombreCategoria(categoria: string) {
  return categoria === "tecnica" ? "Competencia técnica" : "Competencia actitudinal";
}

function ListaCompetencias({
  competencias,
  vacio,
}: {
  competencias: CompetenciaOrientativa[];
  vacio: string;
}) {
  if (competencias.length === 0) {
    return <p>{vacio}</p>;
  }

  return (
    <ul className="lista-competencias">
      {competencias.map((competencia) => (
        <li key={competencia.pregunta_id}>
          <h3>{competencia.nombre}</h3>
          <p className="categoria">{nombreCategoria(competencia.categoria)}. Puntaje: {competencia.puntaje}/5.</p>
          <p><strong>Recurso simulado:</strong> {competencia.recurso_simulado}</p>
        </li>
      ))}
    </ul>
  );
}

export function ResultadoOrientativoDiagnostico({ diagnosticoId }: { diagnosticoId: string }) {
  const [resultado, establecerResultado] = useState<ResultadoOrientativo | null>(null);
  const [estado, establecerEstado] = useState<EstadoResultado>("cargando");
  const [mensaje, establecerMensaje] = useState("");

  async function cargarResultado() {
    establecerEstado("cargando");
    establecerMensaje("");

    try {
      const resultadoConsultado = await consultarResultadoOrientativo(diagnosticoId);
      establecerResultado(resultadoConsultado);
      establecerEstado("listo");
    } catch (error) {
      establecerEstado("error");
      establecerMensaje(error instanceof ErrorApi ? error.message : "No fue posible cargar el resultado orientativo.");
    }
  }

  useEffect(() => {
    void cargarResultado();
  }, [diagnosticoId]);

  if (estado === "cargando") {
    return <section className="tarjeta"><p aria-live="polite">Calculando el resultado orientativo.</p></section>;
  }

  if (estado === "error" || !resultado) {
    return (
      <section className="tarjeta">
        <p className="etiqueta">Proyecto RADIA</p>
        <h1>Resultado orientativo</h1>
        <p role="alert">{mensaje}</p>
        <button type="button" onClick={() => void cargarResultado()}>Reintentar</button>
        <p><Link href="/diagnostico">Volver al diagnóstico</Link></p>
      </section>
    );
  }

  return (
    <section className="tarjeta tarjeta-resultado">
      <p className="etiqueta">Proyecto RADIA</p>
      <h1>Resultado orientativo</h1>
      <p className="aviso">{resultado.aviso}</p>

      <section className="grupo-resultado">
        <h2>Fortalezas identificadas</h2>
        <ListaCompetencias
          competencias={resultado.fortalezas}
          vacio="No se identificaron fortalezas con la regla simulada de este MVP."
        />
      </section>

      <section className="grupo-resultado">
        <h2>Oportunidades de fortalecimiento</h2>
        <ListaCompetencias
          competencias={resultado.oportunidades}
          vacio="No se identificaron oportunidades con la regla simulada de este MVP."
        />
      </section>

      <p><Link href="/diagnostico">Realizar otro diagnóstico</Link></p>
    </section>
  );
}
