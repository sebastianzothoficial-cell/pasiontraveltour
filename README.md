# Pasión Travel Tour

MVP de sitio web para servicios de receptivo en Buenos Aires y Argentina, con foco inicial en viajeros de Brasil.

## Incluido

- Landing responsive.
- Experiencias: Buenos Aires, Delta de Tigre, Tango, fútbol, gastronomía y experiencias a medida.
- Formulario de cotización.
- WhatsApp comercial: +55 48 99675-2532.
- Español, Português e English.
- Base SEO: title, description, sitemap y robots.
- Backoffice operativo en `/admin/`.
- Supabase Auth + PostgreSQL + RLS.
- CRM y operación: leads, clientes, proveedores, experiencias, cotizaciones, reservas, pagos y operaciones.
- Auditoría automática en PostgreSQL para mutaciones administrativas.

## Panel de control

El backoffice está en `/admin/`.

Módulos:

1. Dashboard
2. Leads
3. Clientes
4. Proveedores
5. Experiencias
6. Cotizaciones
7. Reservas
8. Pagos
9. Operaciones
10. Auditoría
11. Usuarios
12. Configuración

El panel usa **Supabase Auth** para autenticación y `public.profiles` para autorización por rol:

- `admin`
- `manager`
- `operator`

Las operaciones administrativas están protegidas por RLS. El frontend nunca contiene contraseñas, `service_role` ni claves secretas.

## Regla comercial

Ninguna experiencia debe considerarse operativa sin:

- proveedor identificado;
- costo;
- moneda;
- margen;
- precio de venta;
- condiciones;
- ejecución verificada.

Los proveedores candidatos del negocio no se consideran aprobados automáticamente. El filtro Grupo Summa utiliza `candidate`, `validate` y `excluded`, y requiere validación directa cuando corresponda.

## Auditoría

Las tablas administrativas principales tienen triggers PostgreSQL que escriben en `public.audit_logs` para INSERT, UPDATE y DELETE.

La función de auditoría vive en el esquema privado y no tiene ejecución directa otorgada a `anon` ni `authenticated`.

Migración versionada:

`supabase/migrations/20261001182701_add_admin_audit_triggers.sql`

## Seguridad

- Las 11 tablas públicas existentes mantienen RLS.
- Leads anónimos: solo INSERT con `source = 'website'`.
- Leads no son legibles por visitantes anónimos.
- Pagos: restringidos a `admin` / `manager`.
- Perfiles: gestión restringida a `admin` / `manager`.
- Auditoría: lectura para staff.
- No publicar `service_role`, `sb_secret`, passwords ni tokens privados.

## Antes del runtime final

1. Crear el primer usuario en Supabase Auth.
2. Crear/asociar su fila en `public.profiles` con `role = 'admin'`.
3. Ingresar en `/admin/`.
4. Probar CRUD de cada módulo con datos reales de prueba.
5. Verificar que cada mutación genera su registro en `audit_logs`.
6. Ejecutar la validación de GitHub Actions y revisar su resultado.
7. Verificar el deploy público y el flujo web → lead → WhatsApp.

Hasta completar esas pruebas de entorno real, el estado correcto es `NEEDS_RUNTIME_PROOF`, no `ADMIN DONE`.


## Asesor IA de viajes

El sitio público incluye un agente de viajes con Gemini en:

- `travel-agent.js`: conversación, descubrimiento, resumen, solicitud y WhatsApp.
- `travel-agent.css`: interfaz responsive del asesor.
- `supabase/functions/pasion-travel-agent/index.ts`: Edge Function pública protegida en servidor.
- `public.ai_travel_requests`: solicitudes estructuradas generadas por el asesor.
- `window.PASION_TRAVEL_AGENT_FUNCTION_URL`: endpoint configurable.
- `window.PASION_WHATSAPP_NUMBER`: número comercial configurable.

La clave `GEMINI_API_KEY` permanece exclusivamente en Supabase Edge Functions. El agente puede utilizar Google Search para información turística que pueda cambiar y nunca debe inventar precio, disponibilidad o reservas.
