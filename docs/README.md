# Documentación del proyecto

Esta carpeta centraliza la documentación técnica que guía la construcción del MVP. Su objetivo es que Miguel y Paula puedan tomar decisiones consistentes antes y durante el desarrollo, y que Solangie Garavito pueda revisar la trazabilidad entre requisitos, arquitectura e implementación.

## Organización

- `arquitectura/`: decisiones de diseño, visión del sistema, componentes y diagramas.
- `arquitectura/decisiones/`: Architecture Decision Records (ADR).
- `arquitectura/diagramas/`: fuentes editables de los diagramas C4.
- `desarrollo/`: guías de configuración local, convenciones, pruebas y flujo de Git.

## Documentos de la iteración 1

1. [Visión general](arquitectura/01-vision-general.md).
2. [Backend con arquitectura hexagonal y DDD ligero](arquitectura/02-backend-hexagonal-ddd.md).
3. [Frontend con Next.js](arquitectura/03-frontend-nextjs.md).
4. [Agente IA y proveedor configurable](arquitectura/04-agente-ia-y-proveedor.md).
5. [Datos y PostgreSQL](arquitectura/05-datos-y-postgresql.md).
6. [Contratos API](arquitectura/06-contratos-api.md).
7. [Integración con RADIA](arquitectura/07-integracion-radia.md).
8. [ADR-001: Arquitectura C4 del agente IA](arquitectura/decisiones/ADR-001-Arquitectura-C4-Agente-IA.md).
9. Diagramas C1 a C4 en `arquitectura/diagramas/`.
10. [Despliegue local con Docker Compose](arquitectura/08-despliegue-local.md).
11. [Configuración local](desarrollo/configuracion-local.md).
12. [Flujo de Git y GitHub](desarrollo/flujo-de-git.md).
13. [Convenciones de desarrollo](desarrollo/convenciones.md).
14. [Estrategia de pruebas](desarrollo/estrategia-de-pruebas.md).
15. [Iteración 2: diagnóstico inicial](desarrollo/iteracion-2-diagnostico-inicial.md).
16. [Iteración 3: interfaz de diagnóstico](desarrollo/iteracion-3-interfaz-diagnostico.md).
17. [Iteración 4: resultado orientativo](desarrollo/iteracion-4-resultado-orientativo.md).

## Estado de validación

Los documentos distinguen entre decisiones confirmadas, decisiones por validar con Solangie y dependencias externas de RADIA. No se debe interpretar una decisión pendiente como un compromiso definitivo de implementación.
