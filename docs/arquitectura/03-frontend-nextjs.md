# Frontend con Next.js

## Propósito

La aplicación web permite que la estudiante realice el diagnóstico, interprete su resultado, converse con el agente y consulte recomendaciones. Se construirá con Next.js, TypeScript y React. Next.js aporta la estructura de aplicación web y React los componentes interactivos de interfaz.

## Principios de diseño

- Mostrar información clara, breve y orientativa.
- Mantener una experiencia accesible y adaptable a pantallas comunes.
- No incluir reglas de negocio, cálculos de diagnóstico ni claves de proveedores en el frontend.
- Consumir el backend FastAPI exclusivamente mediante contratos JSON versionados.
- Validar los datos de formularios y respuestas con esquemas Zod.

## Módulos iniciales

| Módulo | Responsabilidad |
|---|---|
| Inicio | Presentar el propósito, alcance y tratamiento mínimo de datos. |
| Diagnóstico | Mostrar el instrumento activo, validar respuestas y enviar el formulario al backend. |
| Resultado | Presentar fortalezas, oportunidades y recursos recomendados. |
| Conversación | Permitir enviar consultas y visualizar respuestas del agente. |
| Recursos | Mostrar rutas formativas y recursos asociados a competencias. |
| API | Centralizar cliente HTTP, tipos generados y validación Zod. |

## Estructura objetivo

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── diagnostico/
│   ├── resultado/
│   ├── conversacion/
│   └── recursos/
├── componentes/
├── modulos/
│   ├── diagnostico/
│   ├── orientacion/
│   ├── conversacion/
│   └── recursos/
├── servicios/
│   └── api/
├── esquemas/
├── tipos/
└── pruebas/
```

La estructura será creada en la rama técnica `feat/base-del-proyecto`; en esta fase solo se define su propósito.

## Comunicación con FastAPI

El frontend no accede directamente a PostgreSQL ni a proveedores de IA. Las solicitudes se realizan al backend mediante un cliente API centralizado. Las variables públicas de Next.js solo contendrán la URL base no sensible del backend; secretos y claves permanecen en el servicio de backend.

El contrato OpenAPI generado por FastAPI alimentará los tipos de TypeScript. Zod validará formularios antes de enviar solicitudes y verificará estructuras recibidas en los límites de interfaz cuando sea necesario.

## Estado y renderizado

- Las páginas informativas pueden usar renderizado del servidor cuando aporte simplicidad.
- Los formularios de diagnóstico y el chat usarán componentes cliente de React por requerir interacción.
- El estado transitorio se mantendrá cerca del módulo que lo consume.
- No se almacenarán resultados sensibles en almacenamiento persistente del navegador sin una decisión explícita del equipo.

## Criterios de interfaz

- Lenguaje en español, inclusivo y comprensible.
- Indicadores claros de carga, error y envío exitoso.
- Validaciones de formulario legibles y asociadas a cada campo.
- Aviso visible de que las recomendaciones son orientativas y no reemplazan acompañamiento profesional.
- Navegación posible mediante teclado y etiquetas semánticas en los componentes.

