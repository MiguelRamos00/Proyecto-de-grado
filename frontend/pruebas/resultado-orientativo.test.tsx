import { ResultadoOrientativoDiagnostico } from "@/modulos/diagnostico/resultado-orientativo";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const resultadoOrientativo = {
  diagnostico_id: "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7",
  instrumento_id: "diagnostico-inicial-v1",
  fortalezas: [
    {
      pregunta_id: "TEC-001",
      nombre: "Resolución de problemas de programación",
      categoria: "tecnica",
      puntaje: 4,
      clasificacion: "fortaleza",
      recurso_simulado: "Guía simulada: descomposición de problemas.",
    },
  ],
  oportunidades: [
    {
      pregunta_id: "ACT-001",
      nombre: "Búsqueda de apoyo ante dificultades académicas",
      categoria: "actitudinal",
      puntaje: 2,
      clasificacion: "oportunidad",
      recurso_simulado: "Recurso simulado: estrategias para solicitar apoyo.",
    },
  ],
  aviso: "Resultado orientativo generado con reglas simuladas del MVP.",
};

function respuestaJson(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

describe("resultado orientativo", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("presenta fortalezas, oportunidades y recursos provenientes del backend", async () => {
    const fetchSimulado = vi.fn().mockResolvedValue(respuestaJson(resultadoOrientativo));
    vi.stubGlobal("fetch", fetchSimulado);

    render(<ResultadoOrientativoDiagnostico diagnosticoId={resultadoOrientativo.diagnostico_id} />);

    expect(await screen.findByRole("heading", { name: "Fortalezas identificadas" })).toBeTruthy();
    expect(screen.getByText("Resolución de problemas de programación")).toBeTruthy();
    expect(screen.getByText("Búsqueda de apoyo ante dificultades académicas")).toBeTruthy();
    expect(screen.getByText(/reglas simuladas del MVP/)).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(
      expect.stringContaining(`/api/v1/diagnosticos/${resultadoOrientativo.diagnostico_id}/resultado-orientativo`),
      expect.any(Object),
    );
  });

  it("permite reintentar cuando no se puede obtener el resultado", async () => {
    const fetchSimulado = vi.fn().mockRejectedValue(new Error("Sin conexión"));
    vi.stubGlobal("fetch", fetchSimulado);

    render(<ResultadoOrientativoDiagnostico diagnosticoId={resultadoOrientativo.diagnostico_id} />);

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});
