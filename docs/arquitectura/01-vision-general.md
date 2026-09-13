# Visión general de la arquitectura

## Propósito

El MVP ofrece a mujeres estudiantes de Ingeniería de Sistemas un canal conversacional para realizar un diagnóstico inicial de competencias, recibir una orientación comprensible y acceder a recomendaciones de recursos o rutas formativas. El sistema apoya el proyecto RADIA, pero conserva límites claros entre el MVP y las integraciones que el semillero defina posteriormente.

## Alcance del MVP

El MVP debe permitir:

- Acceder a una interfaz web.
- Responder un diagnóstico inicial basado en los instrumentos o datos proporcionados por el semillero.
- Obtener una síntesis orientativa de fortalezas y oportunidades de mejora.
- Conversar en español con un agente que entregue recomendaciones dentro del alcance definido.
- Consultar recursos o rutas formativas asociadas a la orientación.
- Mantener el tratamiento mínimo de datos necesario para prestar el servicio.

No hace parte del alcance actual diseñar encuestas propias, asegurar la integración definitiva con RADIA ni afirmar que el agente ofrece acompañamiento profesional, psicológico o académico formal.

## Personas y responsabilidades

| Persona o actor | Responsabilidad |
|---|---|
| Estudiante usuaria | Realiza el diagnóstico, conversa con el agente y consulta recomendaciones. |
| Miguel y Paula | Diseñan, desarrollan, prueban y documentan el MVP. |
| Solangie Garavito | Revisa avances, criterios de aceptación y retroalimentación académica. |
| Semillero Kerberos/RADIA | Proporciona instrumentos o datos y, cuando corresponda, contratos de integración. |

## Contenedores principales

1. **Aplicación web**: construida con Next.js y TypeScript. Presenta el diagnóstico, el chat, los resultados y las rutas sugeridas.
2. **API del agente**: construida con FastAPI. Expone la lógica del dominio, casos de uso, contratos HTTP y adaptadores de integración.
3. **Módulo de IA**: usa LangChain para orquestar solicitudes a un proveedor configurable, inicialmente OpenAI API u OpenRouter.
4. **Base de datos**: PostgreSQL almacena únicamente la información necesaria para diagnósticos, orientación y recursos. SQLAlchemy gestiona persistencia y Alembic controla migraciones.
5. **Integración RADIA**: adaptador aislado y pendiente de contrato externo. Durante el desarrollo se utilizarán datos o respuestas simuladas si se requieren.

## Principios de diseño

- Priorizar un MVP pequeño, demostrable y comprensible.
- Separar la lógica del dominio de las tecnologías externas.
- Tratar el proveedor de IA como una dependencia reemplazable.
- Minimizar datos personales y conversaciones persistidas.
- Versionar los contratos JSON y validar entradas y salidas.
- Ejecutar el ecosistema localmente con Docker Compose.

## Decisiones vigentes y pendientes

| Tema | Estado |
|---|---|
| Next.js, FastAPI, PostgreSQL, SQLAlchemy y Docker Compose | Decisión base aprobada por el equipo. |
| Arquitectura hexagonal con DDD ligero | Decisión base aprobada para el backend. |
| OpenAI API u OpenRouter | Pendiente de selección final; el modelo debe ser configurable. |
| Contratos y autenticación con RADIA | Pendiente de definición por el semillero. |
| Datos e instrumentos del diagnóstico | Dependiente de insumos proporcionados por el semillero. |

