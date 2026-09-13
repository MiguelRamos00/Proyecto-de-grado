# Flujo de Git y GitHub

## Rama principal

`main` representa una versión estable y revisable del proyecto. No se desarrollan funcionalidades directamente sobre esta rama.

## Convención de ramas

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `feat/` | Nueva capacidad de producto o infraestructura funcional. | `feat/diagnostico-inicial` |
| `fix/` | Corrección de un comportamiento defectuoso. | `fix/validacion-de-respuestas` |
| `docs/` | Documentación o diagramas. | `docs/arquitectura-inicial` |
| `chore/` | Mantenimiento, configuración o dependencias. | `chore/actualizar-dependencias` |
| `test/` | Incorporación o ajuste principal de pruebas. | `test/casos-de-uso-diagnostico` |

Los nombres posteriores a la barra se escriben en español, minúsculas y con guiones.

## Convención de commits

Se usarán Conventional Commits con mensaje en español:

```text
docs(arquitectura): definir estructura documental
feat(backend): crear caso de uso de diagnóstico
fix(contratos): rechazar respuestas fuera de rango
test(diagnostico): cubrir reglas de clasificación
chore(infraestructura): actualizar imagen de postgres
```

Cada commit debe ser pequeño, coherente y describir un cambio verificable. No se deben mezclar una funcionalidad, una corrección y un cambio masivo de formato en el mismo commit.

## Integración de cambios

1. Crear una rama desde `main` o desde la rama acordada para la tarea.
2. Implementar y verificar el cambio localmente.
3. Revisar archivos modificados antes del commit.
4. Publicar la rama en GitHub cuando Miguel o Paula decidan compartirla.
5. Crear un Pull Request hacia `main` cuando el cambio esté listo para revisión.
6. Miguel y Paula revisan el cambio; las decisiones académicas o de alcance se contrastan con Solangie cuando aplique.
7. Integrar únicamente cuando criterios de aceptación y verificaciones estén cumplidos.

