"use client";

import { ChatOrientativo } from "@/modulos/conversacion/chat-orientativo";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContenidoChat() {
  const parametros = useSearchParams();
  const diagnosticoId = parametros.get("diagnostico_id") ?? undefined;

  return (
    <main>
      <ChatOrientativo diagnosticoId={diagnosticoId} />
    </main>
  );
}

export default function PaginaChat() {
  return (
    <Suspense fallback={<main><section className="tarjeta"><p>Preparando el chat orientativo.</p></section></main>}>
      <ContenidoChat />
    </Suspense>
  );
}
