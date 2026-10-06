# Integración local con RADIA

## Propósito

El agente de orientación se integra al ecosistema RADIA como una capacidad independiente de orientación académica y de competencias. No sustituye el chat en tiempo real entre mentora y estudiante, ni accede a las bases de datos o servicios internos de RADIA.

La integración conserva la propiedad de cada repositorio: este proyecto solo expone la API y la interfaz del agente; el equipo RADIA incorpora la navegación y el consumo de la API dentro de su plataforma.

## Límites de la integración

- El agente no consulta directamente los servicios, las bases de datos ni los tokens de RADIA.
- RADIA no consulta directamente la base de datos del agente.
- La comunicación ocurre únicamente por HTTP mediante `POST /api/v1/conversaciones`.
- El chat de mentorías de RADIA se mantiene sin cambios.
- El agente no recibe nombres, correos ni otros datos personales.

## Ejecución local del agente

Desde la raíz de este repositorio:

```bash
docker compose up --build -d
```

La API queda disponible en `http://localhost:8000` y la interfaz propia del agente en `http://localhost:3000`.

La variable `ORIGENES_CORS` autoriza solo los orígenes locales necesarios:

```env
ORIGENES_CORS=http://localhost:3000,http://localhost:5173
```

En otro entorno se deben declarar exclusivamente los dominios reales de las interfaces autorizadas. No se debe usar `*` como origen permitido.

## Contrato para RADIA

RADIA debe enviar una solicitud al agente con este formato:

```json
{
  "sesion_id": "550e8400-e29b-41d4-a716-446655440000",
  "mensaje": "Quiero fortalecer mis conocimientos de bases de datos"
}
```

`sesion_id` identifica una conversación técnica temporal y debe ser un UUID. No debe contener correo, nombre, documento ni otro identificador personal.

De forma opcional, RADIA puede enviar un `diagnostico_id` creado previamente por este mismo proyecto. No debe inventar ni reutilizar identificadores que pertenezcan a otro sistema.

La respuesta incluye `tipo_respuesta`, `respuesta`, `recursos`, `fuentes_documentales`, `aviso_alcance` y `proveedor_modelo`. RADIA debe mostrar siempre el campo `aviso_alcance` y las fuentes documentales cuando existan.

## Cambios que debe realizar el equipo RADIA

1. Incluir en `frontend/.env` una URL pública del agente:

   ```env
   VITE_AGENTE_ORIENTACION_API_URL=http://localhost:8000
   ```

2. Crear un cliente HTTP separado, por ejemplo `src/services/agenteOrientacionApi.ts`. Debe leer `VITE_AGENTE_ORIENTACION_API_URL` y ejecutar `POST /api/v1/conversaciones`.

3. Añadir una pantalla protegida independiente del chat de mentorías, por ejemplo en la ruta `/app/orientacion`.

4. Añadir en `src/App.tsx` la ruta protegida y, en `src/features/navigation/menuConfig.ts`, un enlace con el nombre `Orientación académica`.

5. Reutilizar los componentes, tokens y disposición visual de RADIA. La pantalla debe diferenciarse claramente del chat de mentorías: no usa WebSocket, no muestra conversaciones entre personas y debe incluir el aviso de alcance.

6. Generar `sesion_id` con `crypto.randomUUID()` en el navegador. No deben utilizarse identificadores de usuario, JWT, correo o nombres como identificador de sesión del agente.

7. Configurar en el entorno desplegado la URL HTTPS real de la API y solicitar al equipo del agente que agregue ese mismo origen HTTPS a `ORIGENES_CORS`.

## Prueba de integración manual

Con RADIA en `http://localhost:5173` y el agente en `http://localhost:8000`, desde la nueva pantalla se debe enviar un mensaje permitido. Se espera una respuesta `200` con `tipo_respuesta` igual a `orientacion` o `sin_contexto_suficiente`.

También se debe probar una solicitud fuera de alcance. Se espera `tipo_respuesta` igual a `fuera_de_alcance`. El equipo RADIA debe confirmar que el chat de mentorías continúa operativo y que el agente no recibe información personal ni credenciales.
