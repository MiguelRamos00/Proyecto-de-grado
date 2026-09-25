import { z } from "zod";

export const esquemaPreguntaDiagnostico = z.object({
  id: z.string().min(1).max(30),
  texto: z.string().min(1),
  categoria: z.string().min(1),
  escala_minima: z.number().int().min(1),
  escala_maxima: z.number().int().max(5),
});

export const esquemaInstrumentoActivo = z.object({
  instrumento_id: z.string().min(1).max(100),
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  preguntas: z.array(esquemaPreguntaDiagnostico).min(1),
});

export const esquemaRespuestaDiagnostico = z.object({
  pregunta_id: z.string().min(1).max(30),
  valor: z.number().int().min(1).max(5),
});

export const esquemaSolicitudCrearDiagnostico = z.object({
  instrumento_id: z.string().min(1).max(100),
  respuestas: z.array(esquemaRespuestaDiagnostico).min(1),
});

export const esquemaDiagnosticoCreado = z.object({
  diagnostico_id: z.string().uuid(),
  instrumento_id: z.string().min(1).max(100),
  estado: z.string().min(1),
  fecha_creacion: z.string().datetime(),
});

export const esquemaCompetenciaOrientativa = z.object({
  pregunta_id: z.string().min(1).max(30),
  nombre: z.string().min(1),
  categoria: z.string().min(1),
  puntaje: z.number().int().min(1).max(5),
  clasificacion: z.enum(["fortaleza", "oportunidad"]),
  recurso_simulado: z.string().min(1),
});

export const esquemaResultadoOrientativo = z.object({
  diagnostico_id: z.string().uuid(),
  instrumento_id: z.string().min(1).max(100),
  fortalezas: z.array(esquemaCompetenciaOrientativa),
  oportunidades: z.array(esquemaCompetenciaOrientativa),
  aviso: z.string().min(1),
});
