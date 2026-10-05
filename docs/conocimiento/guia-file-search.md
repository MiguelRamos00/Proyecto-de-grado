# Guía de Gemini File Search

## Alcance de esta integración

El proyecto utilizará Gemini File Search como recuperación documental administrada. El backend no crea almacenes ni carga archivos al iniciar Docker. Esas operaciones solo ocurren mediante un comando manual para evitar enviar fuentes externas sin revisión previa.

File Search crea representaciones semánticas de los documentos cargados. Estas se conservan hasta que se eliminen manualmente; por ello, se deben cargar únicamente fuentes con estado `aprobada` en el [registro de fuentes](registro-fuentes.md).

## Variables locales

Estas variables se mantienen solamente en `.env`, nunca en Git:

| Variable | Uso |
| --- | --- |
| `CLAVE_API_IA` | Clave de Gemini ya configurada para el entorno local. |
| `ALMACEN_FILE_SEARCH` | Identificador que devuelve Gemini al crear el almacén, por ejemplo `fileSearchStores/agente-radia`. |
| `MODELO_FILE_SEARCH` | Modelo compatible con File Search. Si se deja vacío, el adaptador usará `MODELO_IA`. |

## Administración explícita

Después de iniciar Docker, se puede crear un almacén desde el contenedor backend:

```powershell
docker compose run --rm backend python -m app.infraestructura.conocimiento.administrar_file_search crear-almacen --nombre agente-radia-pruebas
```

El comando devuelve el identificador del almacén. Ese valor se copia a `ALMACEN_FILE_SEARCH` en el archivo `.env` local.

Cuando FCD-001 sea aprobada, se podrá cargar montando la carpeta local como solo lectura. La carga transmite el PDF a Gemini y crea un índice persistente, por lo que se requiere una confirmación explícita antes de ejecutarla:

```powershell
docker compose run --rm -v "D:\Miguel\Universidad Catolica\Semestre 10\Trabajo de grado II\Cursos:/fuentes:ro" backend python -m app.infraestructura.conocimiento.administrar_file_search cargar-archivo --almacen "fileSearchStores/identificador" --archivo /fuentes/brachaDeGenero.pdf --nombre-visible FCD-001-brechas-genero.pdf
```

Para revisar los documentos indexados sin leer su contenido:

```powershell
docker compose run --rm backend python -m app.infraestructura.conocimiento.administrar_file_search listar-documentos --almacen "fileSearchStores/identificador"
```

## Trazabilidad

El adaptador convierte las citas devueltas por Gemini en fragmentos con identificador de archivo, referencia y página cuando la API la proporciona. El caso de uso entrega al agente únicamente el contexto recuperado y expone las referencias en el contrato HTTP y en la interfaz.

Si File Search está activo pero no recupera evidencia, el agente no inventa una respuesta basada en documentos: devuelve una orientación segura con el tipo `sin_contexto_suficiente`. Las reglas de alcance se aplican antes de consultar fuentes o invocar el modelo.

## Verificación

Las pruebas automáticas cubren la activación explícita, la configuración incompleta, el bloqueo de consultas fuera de alcance, la ausencia de evidencia y la presentación de citas en la interfaz. Para una validación manual con Gemini se debe aprobar primero FCD-001, cargar el archivo mediante el comando anterior y registrar la evidencia de la cita devuelta.
