import { esquemaInstrumentoActivo } from "@/esquemas/diagnostico";
import { FormularioDiagnostico } from "@/modulos/diagnostico/formulario-diagnostico";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const instrumentoActivo = {
  instrumento_id: "diagnostico-inicial-v1",
  nombre: "Instrumento simulado de diagnóstico inicial",
  descripcion: "Instrumento simulado para validar el flujo técnico del MVP.",
  preguntas: [
    { id: "TEC-001", texto: "Pregunta técnica 1", categoria: "tecnica", escala_minima: 1, escala_maxima: 5 },
    { id: "TEC-002", texto: "Pregunta técnica 2", categoria: "tecnica", escala_minima: 1, escala_maxima: 5 },
    { id: "TEC-003", texto: "Pregunta técnica 3", categoria: "tecnica", escala_minima: 1, escala_maxima: 5 },
    { id: "ACT-001", texto: "Pregunta actitudinal 1", categoria: "actitudinal", escala_minima: 1, escala_maxima: 5 },
    { id: "ACT-002", texto: "Pregunta actitudinal 2", categoria: "actitudinal", escala_minima: 1, escala_maxima: 5 },
    { id: "ACT-003", texto: "Pregunta actitudinal 3", categoria: "actitudinal", escala_minima: 1, escala_maxima: 5 },
  ],
};

function respuestaJson(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

describe("contratos e interfaz de diagnóstico", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("acepta el formato del instrumento publicado por el backend", () => {
    expect(esquemaInstrumentoActivo.parse(instrumentoActivo)).toEqual(instrumentoActivo);
  });

  it("muestra las preguntas obtenidas desde la API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respuestaJson(instrumentoActivo)));

    render(<FormularioDiagnostico />);

    expect(await screen.findByRole("group", { name: /Pregunta técnica 1/ })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(30);
  });

  it("no envía el diagnóstico cuando faltan respuestas", async () => {
    const fetchSimulado = vi.fn().mockResolvedValue(respuestaJson(instrumentoActivo));
    vi.stubGlobal("fetch", fetchSimulado);
    render(<FormularioDiagnostico />);

    await screen.findByRole("group", { name: /Pregunta técnica 1/ });
    fireEvent.click(screen.getByRole("button", { name: "Registrar diagnóstico" }));

    expect(await screen.findByText(/Responde todas las preguntas/)).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
  });

  it("registra el diagnóstico completo y muestra confirmación", async () => {
    const fetchSimulado = vi
      .fn()
      .mockResolvedValueOnce(respuestaJson(instrumentoActivo))
      .mockResolvedValueOnce(respuestaJson({
        diagnostico_id: "21462f3c-44f9-4fb9-8a84-1e64fc94b2d7",
        instrumento_id: "diagnostico-inicial-v1",
        estado: "registrado",
        fecha_creacion: "2026-09-19T01:56:46.345316Z",
      }, 201));
    vi.stubGlobal("fetch", fetchSimulado);
    render(<FormularioDiagnostico />);

    await screen.findByRole("group", { name: /Pregunta técnica 1/ });
    screen.getAllByRole("radio", { name: "3 Moderadamente segura" }).forEach((opcion) => fireEvent.click(opcion));
    fireEvent.click(screen.getByRole("button", { name: "Registrar diagnóstico" }));

    expect(await screen.findByText(/El diagnóstico fue registrado/)).toBeTruthy();
    await waitFor(() => expect(fetchSimulado).toHaveBeenCalledTimes(2));
    expect(fetchSimulado.mock.calls[1][1]).toMatchObject({ method: "POST" });
  });
});
