"use client";

import { ResultadoOrientativoDiagnostico } from "@/modulos/diagnostico/resultado-orientativo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContenidoResultado() {
  const parametros = useSearchParams();
  const diagnosticoId = parametros.get("diagnostico_id");

  if (!diagnosticoId) {
    return (
      <main>
        <section className="tarjeta">
          <h1>Resultado orientativo</h1>
          <p role="alert">No se recibió un diagnóstico para consultar.</p>
          <p><Link href="/diagnostico">Volver al diagnóstico</Link></p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <ResultadoOrientativoDiagnostico diagnosticoId={diagnosticoId} />
    </main>
  );
}

export default function PaginaResultadoOrientativo() {
  return (
    <Suspense fallback={<main><section className="tarjeta"><p>Preparando el resultado orientativo.</p></section></main>}>
      <ContenidoResultado />
    </Suspense>
  );
}
