import { ChatOrientativo } from "@/modulos/conversacion/chat-orientativo";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

function respuestaJson(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

describe("interfaz del chat orientativo", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra una validación cuando el mensaje está vacío", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7" });
    render(<ChatOrientativo />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/Escribe un mensaje/)).toBeTruthy();
  });

  it("envía el mensaje y presenta la orientación del backend", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuestaJson({
      respuesta: "Practica con un ejemplo pequeño.",
      recursos: [{ titulo: "Guía simulada", descripcion: "Practica paso a paso.", enlace: null }],
      aviso_alcance: "Esta conversación ofrece orientación general.",
      proveedor_modelo: "simulado",
    })));
    render(<ChatOrientativo />);

    fireEvent.change(screen.getByLabelText(/¿Sobre qué competencia/), { target: { value: "Programación" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("Practica con un ejemplo pequeño.")).toBeTruthy();
    expect(screen.getByText("Guía simulada")).toBeTruthy();
  });
});
