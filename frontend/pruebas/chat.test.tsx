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
      tipo_respuesta: "orientacion",
      respuesta: "Practica con un ejemplo pequeño.",
      recursos: [{ titulo: "Guía simulada", descripcion: "Practica paso a paso.", enlace: null }],
      fuentes_documentales: [{ identificador: "FCD-001.pdf", referencia: "fuentes/FCD-001", ubicacion: "página 1" }],
      aviso_alcance: "Esta conversación ofrece orientación general.",
      proveedor_modelo: "simulado",
    })));
    render(<ChatOrientativo />);

    fireEvent.change(screen.getByLabelText(/Mensaje para el agente/), { target: { value: "Programación" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("Practica con un ejemplo pequeño.")).toBeTruthy();
    expect(screen.getByText("Guía simulada")).toBeTruthy();
    expect(screen.getByText("Fuentes consultadas")).toBeTruthy();
    expect(screen.getByText("FCD-001.pdf")).toBeTruthy();
    expect(screen.getByText("Programación")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nueva conversación" })).toBeTruthy();
  });

  it("no presenta la sección de fuentes cuando el backend no recupera evidencia", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuestaJson({
      tipo_respuesta: "sin_contexto_suficiente",
      respuesta: "No encontré evidencia documental aprobada para orientar esta consulta.",
      recursos: [],
      fuentes_documentales: [],
      aviso_alcance: "Esta conversación ofrece orientación general.",
      proveedor_modelo: "simulado",
    })));
    render(<ChatOrientativo />);

    fireEvent.change(screen.getByLabelText(/Mensaje para el agente/), { target: { value: "Datos" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/No encontré evidencia documental/)).toBeTruthy();
    expect(screen.queryByText("Fuentes consultadas")).toBeNull();
  });

  it("envía una sugerencia inicial y permite iniciar otra conversación", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuestaJson({
      tipo_respuesta: "orientacion",
      respuesta: "Practica SQL con un conjunto de datos pequeño.",
      recursos: [],
      fuentes_documentales: [],
      aviso_alcance: "Orientación general.",
      proveedor_modelo: "simulado",
    })));
    render(<ChatOrientativo />);

    fireEvent.click(screen.getByRole("button", { name: /Quiero fortalecer mis conocimientos/ }));
    expect(await screen.findByText("Practica SQL con un conjunto de datos pequeño.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Nueva conversación" }));
    expect(screen.getByText("¿En qué quieres fortalecerte?")).toBeTruthy();
    expect(screen.queryByText("Practica SQL con un conjunto de datos pequeño.")).toBeNull();
  });
});
