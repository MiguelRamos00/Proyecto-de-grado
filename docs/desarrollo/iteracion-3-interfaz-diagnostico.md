# Iteración 3: interfaz de diagnóstico

## Objetivo

Construir la interfaz en Next.js para diligenciar el instrumento simulado de diagnóstico inicial y registrar sus respuestas mediante los contratos JSON del backend.

## Alcance implementado

- Ruta pública `/diagnostico` con formulario accesible y en español.
- Consulta dinámica del instrumento mediante `GET /api/v1/diagnosticos/instrumento-activo`.
- Escala de respuesta de 1 a 5 para cada pregunta publicada por el backend.
- Validación de solicitudes y respuestas HTTP con Zod en el frontend.
- Registro mediante `POST /api/v1/diagnosticos` cuando las preguntas están completas.
- Mensajes controlados de carga, error, reintento y confirmación.
- Enlace desde la página de inicio al diagnóstico.

## Límites de la iteración

El instrumento sigue siendo simulado y no corresponde a una encuesta oficial del semillero Kerberos. No se almacenan datos personales en el navegador, no se calculan resultados y no se entregan recomendaciones del agente en esta etapa.

## Validación

Las pruebas del frontend se ejecutan con:

```powershell
docker build --target pruebas -t agente-orientacion-frontend-pruebas frontend
```

La compilación de producción se verifica con:

```powershell
docker compose build frontend
```

Las pruebas cubren el formato del instrumento, la carga de preguntas desde la API, la prevención de envíos incompletos y el registro exitoso del diagnóstico.
