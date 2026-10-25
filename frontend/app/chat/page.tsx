"use client";

import { ChatOrientativo } from "@/modulos/conversacion/chat-orientativo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContenidoChat() {
  const parametros = useSearchParams();
  const diagnosticoId = parametros.get("diagnostico_id") ?? undefined;

  return (
    <div className="pagina-chat-web">
      <aside className="navegacion-chat" aria-label="Navegación del agente">
        <p className="navegacion-marca">RADIA</p>
        <nav>
          <Link href="/">Inicio</Link>
          <Link href="/diagnostico">Diagnóstico simulado</Link>
          <Link href="/chat" aria-current="page">Orientación académica (IA)</Link>
        </nav>
        <p className="navegacion-nota">Módulo autónomo del agente</p>
      </aside>
      <main className="pagina-chat-orientativo">
        <ChatOrientativo diagnosticoId={diagnosticoId} />
      </main>
    </div>
  );
}

export default function PaginaChat() {
  return (
    <Suspense fallback={<main className="pagina-chat-orientativo"><p>Preparando el chat orientativo.</p></main>}>
      <ContenidoChat />
    </Suspense>
  );
}
