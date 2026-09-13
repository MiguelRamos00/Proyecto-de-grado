# Documentación del proyecto

Esta carpeta centraliza la documentación técnica que guía la construcción del MVP. Su objetivo es que Miguel y Paula puedan tomar decisiones consistentes antes y durante el desarrollo, y que Solangie Garavito pueda revisar la trazabilidad entre requisitos, arquitectura e implementación.

## Organización

- `arquitectura/`: decisiones de diseño, visión del sistema, componentes y diagramas.
- `arquitectura/decisiones/`: Architecture Decision Records (ADR).
- `arquitectura/diagramas/`: fuentes editables de los diagramas C4.
- `desarrollo/`: guías de configuración local, convenciones, pruebas y flujo de Git. Esta sección se completará en iteraciones posteriores.

## Documentos de la iteración 1

1. [Visión general](arquitectura/01-vision-general.md).
2. [Backend con arquitectura hexagonal y DDD ligero](arquitectura/02-backend-hexagonal-ddd.md).
3. [Datos y PostgreSQL](arquitectura/05-datos-y-postgresql.md).
4. [Contratos API](arquitectura/06-contratos-api.md).
5. [ADR-001: Arquitectura C4 del agente IA](arquitectura/decisiones/ADR-001-Arquitectura-C4-Agente-IA.md).
6. Diagramas C1 a C4 en `arquitectura/diagramas/`.

## Estado de validación

Los documentos distinguen entre decisiones confirmadas, decisiones por validar con Solangie y dependencias externas de RADIA. No se debe interpretar una decisión pendiente como un compromiso definitivo de implementación.
