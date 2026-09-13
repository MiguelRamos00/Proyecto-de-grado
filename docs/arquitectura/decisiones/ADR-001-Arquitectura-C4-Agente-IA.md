# ADR-001 — Arquitectura del agente conversacional y plan C4

Fecha: 2026-09-04  
Versión: 0.3 — SQLAlchemy confirmado por Miguel; diagramación por iteraciones  
Estado: Propuesto para revisión por Miguel, Paula y Solangie  
Responsables de implementación: Miguel y Paula  
Revisión académica: Solangie Garavito  
Contexto: trabajo de grado de Ingeniería de Sistemas, semillero Kerberos / proyecto RADIA.

## 1. Propósito y relación con los objetivos

Definir una arquitectura implementable para el MVP de orientación educativa mediante diagnóstico, conversación en español y recomendaciones de recursos para mujeres estudiantes de Ingeniería de Sistemas.

En el documento «Trabajo de Grado II 2026 - V12Agosto.md», sección 3.2, el objetivo 1 es definir requisitos; el objetivo 2 es diseñar arquitectura e integración con RADIA; y el objetivo 3 es desarrollar y validar. Este ADR se prepara mientras se trabaja en el objetivo 1 y sirve de entrada al objetivo 2. No constituye evidencia de software ya implementado ni de aprobación de Solangie.

La entrega final está prevista para el 6 de noviembre de 2026. El equipo dispone de 8 horas semanales por estudiante. Las decisiones se dimensionan para esa capacidad.

## 2. Aspectos por reconciliar con la tesis

- Por indicación de Miguel, se conservan las cinco fichas funcionales y tres no funcionales actuales como base de trabajo. Su validación completa por Solangie está pendiente. La diferencia frente a los indicadores de agosto (15 y 8) se revisará con ella antes de completar o ajustar los requisitos; no se modifican ahora los SRS ni los indicadores.
- Integración confirmada como intención y alcance: nuestro equipo expondrá una API que RADIA consumirá; nuestro agente también consumirá APIs de RADIA para obtener información necesaria. Sus contratos todavía no están disponibles. Ambos sentidos se diseñan desde ahora y se validarán conjuntamente cuando se acuerden los contratos.
- Azure DevOps Boards es la herramienta actual para backlog, historias, tareas y sprints. Sustituir las referencias a Jira en la tesis según la guía de la sección 14. El proveedor del repositorio de código y CI/CD sigue siendo una decisión separada.
- RQN-002 actualmente describe principalmente el proceso de validación. Conviene separar ese procedimiento de los atributos de calidad del producto y acordar umbrales verificables para las respuestas. Este ADR no modifica el SRS aprobado.

## 3. Decisión arquitectónica propuesta

Construir una aplicación web Next.js y un backend modular FastAPI. El backend contiene diagnóstico, recomendaciones y orquestación conversacional. Consultará un modelo de lenguaje externo mediante un adaptador intercambiable; no se entrenará ni alojará un modelo grande en el servidor del MVP.

Se propone LangChain para la composición del flujo conversacional, en coherencia con la tesis. La lógica de diagnóstico y selección de recursos permanecerá en módulos Python independientes del framework y del proveedor del modelo.

El diagnóstico utilizará reglas explícitas, versionadas y revisadas. El catálogo inicial será curado, versionado y almacenado en PostgreSQL; archivos JSON podrán servir como semillas de desarrollo y pruebas. El LLM redactará orientación a partir del contexto permitido y los recursos seleccionados. Sus respuestas no serán una fuente autorizada para inventar puntajes, recursos o enlaces.

Se incorpora PostgreSQL como base persistente solicitada por Miguel. Se interpreta «postgrest» como PostgreSQL, el motor de base de datos; PostgREST es otra herramienta y no se añade al diseño. Para FastAPI/Python se recomienda SQLAlchemy como ORM y Alembic para migraciones. Prisma está orientado a Node.js/TypeScript: se mantiene como alternativa si el equipo prefiere migrar el backend a TypeScript, no como dependencia directa del backend Python. No se añade un segundo backend únicamente para usar Prisma.

Persistir inicialmente catálogo, versiones de instrumentos/reglas, resultados de diagnóstico y progreso vinculados a una identidad de sesión o identificador externo autorizado. La persistencia no implica permiso para guardar conversaciones completas. Retención, identidad y continuidad entre sesiones deben acordarse antes de habilitar historial personal. Los mensajes conversacionales pueden permanecer temporales; sus pérdidas al reiniciar se comunicarán si se adopta esa modalidad.

### 3.1 DDD y arquitectura hexagonal proporcionados al MVP

Adoptar un monolito modular con DDD ligero y arquitectura hexagonal. DDD ayuda a expresar las reglas del problema; hexagonal separa esas reglas de HTTP, base de datos, RADIA y LLM. No exige microservicios, CQRS ni event sourcing.

- Dominio: conceptos y reglas de Diagnóstico, Perfil de competencias, Recurso formativo, Ruta y Progreso. Usar nombres consistentes con los requisitos y distinguir el diagnóstico educativo de uno clínico.
- Aplicación: casos de uso RealizarDiagnostico, ResponderMensaje, RecomendarRuta y ActualizarProgreso. Coordina puertos y transacciones.
- Puertos de entrada: operaciones de los casos de uso, invocadas por controladores HTTP o pruebas.
- Puertos de salida: repositorios de diagnóstico/recursos/progreso, RadiaGateway y LLMClient.
- Adaptadores de entrada: FastAPI y esquemas HTTP. Los esquemas Pydantic de transporte no son las entidades del dominio.
- Adaptadores de salida: repositorios SQLAlchemy, cliente HTTP RADIA y cliente LLM/LangChain.
- Dependencias: infraestructura y presentación dependen de aplicación/dominio. El dominio no importa FastAPI, SQLAlchemy, LangChain ni modelos de RADIA.
- El cliente RADIA traduce sus futuros DTO a conceptos internos (capa anticorrupción), para que cambios externos no se propaguen al dominio.
- Las transacciones abarcan operaciones de persistencia coherentes, por ejemplo resultado y versión de diagnóstico. No mantener una transacción de base de datos abierta mientras se espera al LLM o a RADIA.

Estructura orientativa, pendiente de implementación:

```text
backend/app/
  domain/                 # entidades, objetos de valor y reglas
  application/
    use_cases/            # operaciones de negocio
    ports/                # interfaces de persistencia, RADIA y LLM
  adapters/
    inbound/http/         # routers y esquemas FastAPI
    outbound/persistence/ # modelos ORM, mapeos y repositorios
    outbound/radia/       # cliente HTTP y traducción de datos
    outbound/llm/         # proveedor y composición LangChain
  bootstrap.py            # configuración e inyección de dependencias
backend/migrations/       # migraciones Alembic
frontend/src/
  app/                    # rutas y composición Next.js
  features/               # diagnóstico, chat, recomendaciones y progreso
  shared/ui/              # componentes visuales reutilizables
  shared/api/             # cliente HTTP y tipos de contrato
```

Frontend: organización por funcionalidades, separando componentes visuales, hooks/estado y cliente API. El cálculo oficial del diagnóstico y las decisiones de acceso permanecen en backend. WEB no accede directamente a PostgreSQL; sus llamadas y las de RADIA usan los mismos casos de uso publicados. No replicar todas las capas DDD en cada componente React.

Pruebas propuestas: dominio sin red/base de datos; casos de uso con puertos falsos; repositorios contra PostgreSQL de prueba con migraciones; adaptador RADIA con contratos simulados claramente identificados; pruebas reales de integración cuando RADIA entregue sus contratos; flujo extremo a extremo del MVP.

## 4. Alternativas consideradas

| Alternativa | Ventaja | Costo o limitación | Decisión propuesta |
| --- | --- | --- | --- |
| Backend modular y frontend separado | Responsabilidades claras; pruebas y despliegue manejables | Dos aplicaciones que integrar | Adoptar |
| Microservicios por cada función | Escalado independiente | Operación y comunicación innecesarias para dos estudiantes | Posponer |
| Modelo de lenguaje alojado por el equipo | Control directo del modelo | Memoria, cómputo y mantenimiento; calidad por validar | Posponer |
| API de modelo externo | Permite concentrarse en el agente | Costo por uso, disponibilidad y tratamiento externo de datos | Adoptar con límites |
| RAG con base vectorial desde el inicio | Recuperación semántica sobre documentos | Ingesta, embeddings y evaluación adicionales | Incorporar solo si el corpus lo justifica |
| Catálogo curado y filtros por competencia | Recomendaciones trazables y sencillas | Cobertura limitada al catálogo | Adoptar para el MVP |

## 5. Plan de vistas C4

C4 describe cuatro niveles: contexto, contenedores, componentes y código. Un contenedor C4 es una aplicación o almacén de datos, no necesariamente un contenedor Docker. La infraestructura se representa en una vista adicional de despliegue.

### C1 — Contexto del sistema

Sistema central: «Agente de orientación educativa».

| Elemento | Relación con el sistema |
| --- | --- |
| Estudiante de Ingeniería de Sistemas | Responde diagnóstico, conversa y recibe recomendaciones |
| Miguel y Paula | Desarrollan, configuran catálogo y reglas, ejecutan pruebas y despliegan |
| Solangie Garavito | Revisa demostraciones y evidencias; aporta retroalimentación académica |
| Semillero Kerberos | Proporciona datos e instrumentos autorizados |
| Sistema RADIA | Consume la API del agente y expone APIs que el agente consumirá; contratos pendientes |
| Proveedor del modelo | Recibe contexto mínimo y devuelve texto generado mediante HTTPS |
| Sitios de recursos educativos | La estudiante abre enlaces seleccionados del catálogo |

Mostrar por separado el aporte manual del semillero y las dos relaciones técnicas planeadas: RADIA → agente y agente → RADIA. Rotularlas «contrato pendiente», sin inventar endpoints externos. No inventar un panel administrativo para los revisores.

### C2 — Contenedores

| ID | Contenedor o sistema | Tecnología propuesta | Responsabilidad |
| --- | --- | --- | --- |
| WEB | Aplicación web del chatbot | Next.js / TypeScript | Diagnóstico, chat, resultado, recursos y progreso de sesión |
| API | Backend del agente | Python / FastAPI | Validación, diagnóstico, sesión, recomendaciones y orquestación |
| DB | Base de datos del agente | PostgreSQL; ORM SQLAlchemy propuesto | Catálogo, instrumentos, diagnósticos y progreso autorizado |
| RADIA | Sistema externo RADIA | APIs HTTPS; contratos pendientes | Consumidor de nuestra API y proveedor de información |
| LLM | Sistema externo de inferencia | API HTTPS del proveedor elegido | Generar respuestas educativas contextualizadas |

Relaciones: estudiante → WEB; WEB → API y RADIA → API mediante HTTPS/JSON; API → RADIA y API → LLM mediante HTTPS; API → DB mediante protocolo PostgreSQL, con TLS en nube. El catálogo se accede por repositorio; no es un contenedor independiente adicional a DB. Git y Azure DevOps son herramientas de desarrollo, no dependencias de ejecución del chat.

### C3 — Componentes del backend API

| Componente | Responsabilidad | Dependencias |
| --- | --- | --- |
| Controladores HTTP y esquemas | Validar solicitudes y traducir errores | Servicios de aplicación |
| Servicio de diagnóstico | Validar respuestas y calcular perfil mediante reglas | Catálogo y reglas |
| Gestor de sesión | Aislar contexto temporal y progreso; aplicar expiración | Memoria del proceso |
| Orquestador conversacional | Coordinar intención, contexto, recomendaciones y respuesta | Sesión, recomendador, política y adaptador LLM |
| Recomendador | Seleccionar recursos y pasos por competencia y nivel | Catálogo curado |
| Política de interacción | Definir alcance, tamaño de entrada y tratamiento de salidas | Reglas configuradas |
| Adaptador LLM | Encapsular proveedor, timeout y errores | API externa |
| Adaptador RADIA | Consumir información autorizada y traducir contratos externos | RadiaGateway y APIs RADIA |
| Repositorios y unidad de trabajo | Persistir entidades y coordinar transacciones | Puertos de aplicación, SQLAlchemy y PostgreSQL |
| Registro técnico | Medir duración, fallos y consumo sin texto personal | Eventos de los componentes |

Flujo principal: controlador → orquestador → gestor de sesión → recomendador → adaptador LLM → política de salida → respuesta. El diagnóstico se calcula por su servicio; no se delega el puntaje a texto libre del LLM.

### C4 — Código del orquestador conversacional

Se realizará un diagrama UML de clases/interfaces centrado en el componente orquestador. Los siguientes nombres son diseño propuesto, no clases implementadas verificadas.

| Elemento | Operación o datos principales | Función |
| --- | --- | --- |
| ChatService | reply(request: ChatRequest) -> ChatResponse | Coordinar un turno |
| ChatRequest | message, session_token | Entrada validada |
| ChatResponse | answer, resource_ids, request_id | Salida estructurada |
| SessionStore (interfaz) | get(token), save(context), expire(token) | Abstraer almacenamiento temporal |
| InMemorySessionStore | Implementa SessionStore | Primera implementación sin persistencia |
| ResourceRecommender (interfaz) | recommend(profile, intent) | Proveer recursos del catálogo |
| LLMClient (interfaz) | generate(context) | Abstraer inferencia externa |
| ProviderLLMClient | Implementa LLMClient | Adaptación del proveedor elegido |
| RadiaGateway (interfaz) | get_context(subject_ref) | Obtener solo el contexto acordado; operación interna preliminar |
| HttpRadiaGateway | Implementa RadiaGateway | Traducir respuestas externas; contrato HTTP pendiente |
| DiagnosticRepository (interfaz) | get_profile(subject_ref) | Consultar resultado persistido autorizado |
| SqlAlchemyDiagnosticRepository | Implementa DiagnosticRepository | Leer PostgreSQL sin exponer modelos ORM |
| InteractionPolicy | validate_input(), validate_output() | Aplicar restricciones comprobables |

ChatService depende de las interfaces, recibidas por constructor. Los adaptadores se conectan en el punto de arranque de FastAPI. El diagrama mostrará composición/dependencias e implementación de interfaces, sin dibujar todos los archivos del proyecto. Actualizarlo al implementar para que coincida con firmas y módulos reales.

## 6. Contratos preliminares de integración

| Operación propuesta | Entrada mínima | Resultado |
| --- | --- | --- |
| POST /api/v1/sessions | Sin datos identificativos | Token de sesión y expiración |
| GET /api/v1/diagnostic/questions | Token de sesión | Preguntas y versión del instrumento |
| POST /api/v1/diagnostic | Respuestas y versión; token de sesión | Perfil orientativo y explicación |
| POST /api/v1/chat | Mensaje; token de sesión | Respuesta y referencias del catálogo |
| GET /api/v1/recommendations | Token de sesión | Ruta y recursos sugeridos |
| PATCH /api/v1/progress | ID de paso y estado; token de sesión | Progreso actualizado en la sesión |
| GET /health | Sin datos personales | Estado básico del servicio |

El token debe viajar en cabecera o cookie según el diseño de integración que se acuerde; no incluirlo en URLs o logs. No aceptar un perfil inventado por el cliente como resultado validado. Documentar esquemas y ejemplos en OpenAPI durante implementación. Contemplar errores de entrada inválida, sesión expirada, límite de uso y proveedor no disponible.

RADIA es un consumidor previsto de nuestra API; la tabla es nuestra propuesta inicial para negociar el contrato, no un acuerdo ya cerrado. Además, API consumirá información de RADIA mediante RadiaGateway/HttpRadiaGateway. No se definen rutas de RADIA hasta recibir sus contratos. Mientras tanto, un adaptador simulado permitirá desarrollar con datos sintéticos.

Por acordar en ambos sentidos: autenticación de servicio, identidad de la estudiante, permisos, esquemas, errores, versiones, timeouts, límites y entorno de pruebas. Un token de sesión del chatbot no autoriza por sí solo acceso a los datos de una estudiante en RADIA. Validar identidad y autorización antes de consultar o persistir información. Separar autenticación del servicio consumidor de la identidad de la usuaria.

Evitar llamadas circulares: una solicitud entrante desde RADIA no debe provocar que RADIA vuelva a invocar la misma operación. Definir qué servicio es dueño de cada dato, cuándo se consulta y qué copia mínima se permite conservar. Para operaciones que crean diagnósticos o progreso, acordar idempotencia para evitar duplicados por reintentos.

Validación de integración: RADIA invoca una operación nuestra y recibe la respuesta acordada; nuestro backend consulta una API de RADIA, traduce su información y maneja falta de permisos o indisponibilidad. Los mocks no acreditan integración real.

## 7. Despliegue e infraestructura

### Desarrollo local

Docker Compose se propone para WEB, API y PostgreSQL con volumen local; migraciones y semillas preparan la base. API se conecta al modelo y al adaptador RADIA simulado o de pruebas. Las claves se configuran fuera de Git. Las pruebas unitarias usan adaptadores falsos para no consumir llamadas.

### Validación en nube — diseño propuesto, sin aprovisionar

Navegador → HTTPS → WEB → HTTPS → API. RADIA → HTTPS → API; API → HTTPS → RADIA y LLM. API → PostgreSQL con TLS. Empezar con una réplica mientras exista contexto conversacional en memoria; DB conserva los datos persistentes acordados. Incorporar en el despliegue conexión protegida, migraciones y respaldo/restauración de PostgreSQL; el proveedor de alojamiento de la base queda pendiente de costo y cuotas.

Azure es el candidato preferido por coherencia con la tesis y la suscripción estudiantil. Un servicio administrado compatible con el backend contenerizado y un alojamiento compatible con Next.js se seleccionarán después de revisar saldo, cuotas y costo real. La elección entre despliegue estático y servidor Next.js dependerá de si se necesita renderizado del lado servidor. No se da por hecho que todo servicio sea gratuito.

No crear máquinas virtuales, discos, IP públicas ni servicios de datos por este ADR. Antes de desplegar, registrar recursos previstos, responsable, presupuesto y procedimiento de eliminación. Las alertas de presupuesto no son un corte automático: la aplicación debe aplicar límites propios de consultas y de consumo del modelo.

La vista de despliegue mostrará navegador, alojamiento frontend, alojamiento backend, PostgreSQL, RADIA y proveedor LLM, con las instancias WEB/API/DB y las fronteras externas. Crear una vista local y otra de validación, sin confundirlas con C4 nivel 4.

## 8. Datos, seguridad y operación

- Las encuestas y datos de investigación los proporciona el semillero. Su análisis se realiza fuera del flujo del chatbot; el sistema usa reglas y hallazgos derivados revisados, no envía automáticamente datasets al proveedor.
- Catálogo: recurso_id, título, competencia, nivel, URL, propósito y fecha de revisión. La salida solo referencia IDs existentes; los enlaces se resuelven desde el catálogo.
- Sesión: identificador aleatorio y mensajes temporales limitados. Diagnósticos y progreso se persistirán según el esquema y permisos acordados. Definir duración del contexto y retención de registros antes de implementar.
- Modelo persistente preliminar: InstrumentVersion, DiagnosticResult, LearningResource, LearningPath y ProgressEntry. Conservar referencias de versión y claves foráneas; acordar SubjectReference y su relación con RADIA. No duplicar toda la gestión de usuarios de RADIA. Versionar esquema con migraciones revisadas.
- No persistir conversaciones personales por defecto. La retención del proveedor externo se debe verificar al seleccionarlo; no confundir ausencia de almacenamiento propio con ausencia de tratamiento externo.
- Claves únicamente en backend; HTTPS; control de origen y acceso para el entorno piloto; límites de entrada y frecuencia. CORS no reemplaza autenticación ni límites de uso.
- Registrar versión de reglas, catálogo, prompt y modelo; duración, códigos de error y tokens cuando estén disponibles. Evitar cuerpos de mensajes en logs.
- Ante indisponibilidad del LLM, informar el error y permitir consultar recursos ya disponibles; limitar reintentos para evitar duplicar consumo.
- Las barreras de salida reducen riesgos, pero no garantizan exactitud. Evaluar lenguaje inclusivo, pertinencia, enlaces y límites educativos mediante escenarios.

## 9. Trazabilidad inicial

| SRS de trabajo, pendiente de validación completa por Solangie | Elementos arquitectónicos | Evidencia futura |
| --- | --- | --- |
| RQF-001 | WEB, servicio de diagnóstico | Pruebas de respuestas incompletas y válidas |
| RQF-002 | Reglas y servicio de diagnóstico | Casos con resultados esperados deterministas |
| RQF-003 | ChatService, sesión, política, LLMClient | Conversación contextual y fuera de alcance |
| RQF-004 | Recomendador y catálogo | Recursos existentes y relacionados con perfil |
| RQF-005 | WEB, controladores, progreso, despliegue | Flujo integrado y errores visibles |
| RQN-001 | Sesión, logs, configuración y proveedor | Inspección del flujo de datos y aviso |
| RQN-002 | Registro técnico y evaluación externa | Matriz de al menos 15 escenarios simulados |
| RQN-003 | Alojamiento, health y procedimiento de despliegue | Acceso y prueba de flujo antes de cada sesión |

La prueba de disponibilidad debe distinguir acceso a la URL de funcionamiento correcto del agente; mostrar un error controlado no demuestra que el proveedor esté disponible.

## 10. Plan de trabajo y evidencias

| Paso | Trabajo | Participación propuesta | Entregable |
| --- | --- | --- | --- |
| 1 | Reconciliar alcance, requisitos y frontera RADIA | Miguel y Paula; revisión Solangie | Notas de decisiones y pendientes |
| 2 | Elaborar C1 y C2 | Miguel; revisión Paula | Dos diagramas con leyenda |
| 3 | Elaborar C3 y flujo de conversación | Paula; revisión Miguel | Componentes y secuencia de un turno |
| 4 | Elaborar C4 del orquestador | Miguel y Paula | UML con interfaces y métodos |
| 5 | Elaborar despliegue local y de validación | Miguel y Paula | Nodos y responsabilidades operativas |
| 6 | Revisar coherencia y viabilidad | Solangie con Miguel y Paula | Feedback, cambios y versión aceptada |

Puede prepararse una primera versión en una semana de trabajo de arquitectura (16 horas combinadas), como estimación de planificación sujeta al progreso real y a los insumos. La implementación y el despliegue no se incluyen en esas horas.

La revisión debe comprobar que cada elemento C4 aparece dentro del elemento padre correspondiente, que todas las flechas tienen propósito y protocolo cuando aplica, y que se diferencian elementos actuales, propuestos y externos. Guardar exportaciones y fuente editable con fecha y versión.

## 11. Preparación del tablero gráfico

Miro puede servir como espacio de revisión conjunta. Preparar marcos: 00 alcance y leyenda; 01 contexto; 02 contenedores; 03 componentes API; 04 código ChatService; 05 despliegue local; 06 despliegue de validación; 07 preguntas y feedback.

Mantener los IDs WEB, API, DB, RADIA y LLM entre vistas. Usar bordes para límites de sistema/contenedor y etiquetas para estado «propuesto». Evitar depender solo del color para comunicar significado.

C4 es independiente de la herramienta. La selección del editor no cambia la arquitectura; el documento Markdown será el registro de decisiones y el tablero la representación visual. Los diagramas se crearán en una siguiente iteración.

## 12. Consecuencias y decisiones pendientes

La propuesta permite implementar por módulos, probar diagnóstico sin consumo de IA, persistir resultados y sustituir adaptadores externos. A cambio, PostgreSQL exige migraciones y respaldo; hexagonal añade interfaces y mapeos; el catálogo requiere mantenimiento y la calidad depende de pruebas y del modelo elegido. El contexto conversacional temporal puede perderse al reiniciar aunque los resultados persistan.

Pendientes para aceptación: feedback de Solangie sobre las fichas actuales; contratos RADIA en ambos sentidos; modelo y proveedor con comparación en español; presupuesto; retención e identidad; alojamiento de aplicación/base y criterios cuantitativos de calidad. SQLAlchemy ya fue confirmado por Miguel. Estos pendientes no impiden dibujar la arquitectura propuesta; sí condicionan implementación e integración.

## 13. Referencias

- Fuente del proyecto: «Trabajo de Grado II 2026 - V12Agosto.md», secciones 2.6, 3.2, 3.3 y 6.2.4.
- SRS: documentos consolidados en la carpeta Requerimientos y acuerdos de trabajo con Miguel.
- C4, niveles: https://c4model.com/diagrams
- C4, contenedores: https://c4model.com/diagrams/container
- C4, código: https://c4model.com/diagrams/code
- C4, despliegue: https://c4model.com/diagrams/deployment
- Referencias C4 consultadas el 4 de septiembre de 2026.
- Prisma ORM para Node.js/TypeScript: https://www.prisma.io/typescript
- SQLAlchemy ORM para Python: https://docs.sqlalchemy.org/en/20/orm/

## 14. Guía para corregir Jira en la tesis

Ubicaciones referidas al Markdown «Trabajo de Grado II 2026 - V12Agosto.md», antes de editarlo. En Word usar el número de sección y buscar la frase; las líneas corresponden únicamente al Markdown. La tesis no se modifica automáticamente en esta iteración.

| Sección / línea Markdown | Corrección recomendada |
| --- | --- |
| Índice, línea 173; título 7.8, línea 796 | Cambiar «Gestión ágil del proyecto (Jira + GitHub)» por «Gestión ágil del proyecto con Azure DevOps Boards» |
| Metodología, línea 548 | «Los requisitos se registrarán y vincularán con las historias de usuario del backlog en Azure DevOps Boards» |
| Metodología, línea 560 | «El desarrollo será incremental, con sprints y tareas gestionados en Azure DevOps Boards» |
| 6.2.4, tabla de herramientas, línea 645 | Sustituir fila Jira por Azure DevOps Boards: planificación de backlog, historias, tareas, sprints y evidencias de seguimiento |
| 6.2.4, fila GitHub + GitHub Actions, línea 644 | Quitar «gestión de Issues como tareas Scrum»; conservar repositorio y CI/CD solo si realmente se usan allí |
| 7.1, línea 724 | «Cada tarea se registra en Azure DevOps Boards y se vincula con los cambios de código correspondientes» |
| 7.3, línea 753 | Cambiar «gestionados en Jira» por «gestionados en Azure DevOps Boards» |
| 7.3, tabla, líneas 757–758 | Usar «Documento .docx + Azure DevOps Boards» y «Azure DevOps Boards: historias y backlog» |
| 7.3, tabla, líneas 762–763 | DoD: «Azure DevOps Boards + documentación del repositorio»; backlog y sprints: «Azure DevOps Boards» |
| 7.8, línea 800 | «Product Backlog en Azure DevOps Boards: Features, historias, criterios de aceptación y estimaciones» |
| 8, línea 807 | Sustituir administración mediante GitHub Issues/Jira por Azure DevOps Boards; revisar por separado la coherencia del cronograma descrito |
| 8.1, rol de Paula, línea 814 | Cambiar «Gestión de sprints en Jira» por «Gestión de sprints en Azure DevOps Boards» |
| 8.2, cronograma, línea 829 | Cambiar «Historias de usuario (Jira Backlog)» por «Historias de usuario (Azure DevOps Boards)» |
| 8.3, eventos Scrum, línea 861 | Herramienta del Sprint Planning: Azure DevOps Boards |
| 9.3, presupuesto, línea 904 | Retirar el costo de Jira Standard; registrar el costo real del plan utilizado en Azure DevOps, verificándolo antes de fijar un valor |
| Referencias de presupuesto, línea 955 | Sustituir la referencia de precios de Jira por la fuente del plan de Azure DevOps y recalcular los totales que incluyan Jira |

GitHub Actions, el repositorio GitHub y Azure DevOps Boards pueden coexistir. No reemplazar «GitHub» automáticamente por «Azure DevOps»: confirmar antes si el código y los pipelines estarán en GitHub o en Azure Repos/Pipelines.

## 15. Registro de revisión

Versión 0.3: Miguel confirma SQLAlchemy como ORM para el backend Python; Prisma era un ejemplo y deja de ser una alternativa pendiente de elección. Se conserva Alembic como herramienta propuesta para migraciones. Se acuerda elaborar C1, C2, C3 y C4 por iteraciones independientes en el tablero «Arquitectura trabajo de grado II»: https://miro.com/app/board/uXjVHqtN5fw=/. Comenzar por contexto C1 y revisarlo antes de avanzar a contenedores C2. La aceptación del ORM no implica aprobación académica de todo el ADR.

Versión 0.2: se conservan fichas actuales pendientes de Solangie; se confirma la intención de integración API bidireccional con RADIA; se incorpora PostgreSQL, ORM propuesto y persistencia mínima; se añade DDD ligero + hexagonal para backend y frontend por funcionalidades; se actualizan C1–C4 y despliegue; se documentan ubicaciones Jira para corrección manual.
