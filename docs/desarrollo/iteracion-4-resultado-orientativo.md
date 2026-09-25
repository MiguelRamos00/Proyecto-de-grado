# Iteración 4: resultado orientativo

## Objetivo

Entregar una devolución inicial y explicable a partir de un diagnóstico previamente registrado, sin usar inteligencia artificial generativa ni datos reales del semillero Kerberos/RADIA.

## Regla implementada

Cada una de las seis respuestas del instrumento simulado representa una competencia. Los puntajes de 4 y 5 se clasifican como fortalezas; los puntajes de 1 a 3 se clasifican como oportunidades de fortalecimiento. La regla se ejecuta solo en el backend para mantener un único cálculo verificable.

Cada competencia incluye un recurso simulado de apoyo. Estos recursos son demostrativos, no son contenidos oficiales del semillero y no constituyen una recomendación académica, psicológica o profesional.

## Flujo técnico

1. La estudiante registra las seis respuestas en `/diagnostico`.
2. El backend persiste el diagnóstico sin datos personales.
3. La interfaz ofrece el enlace a `/resultado?diagnostico_id={id}`.
4. La vista consulta `GET /api/v1/diagnosticos/{diagnostico_id}/resultado-orientativo`.
5. El backend recupera las respuestas, calcula los grupos y devuelve el contrato JSON validado por Zod en el frontend.

## Alcance y límites

- No se invoca un proveedor de IA.
- No se integra RADIA ni se consumen contratos externos.
- No se almacenan datos personales.
- Los recursos y la regla de clasificación son simulados para el MVP.
- La devolución no es una evaluación institucional ni reemplaza orientación profesional.
