# Pasión Travel Tour

MVP de sitio web para servicios de receptivo en Buenos Aires y Argentina, con foco inicial en viajeros de Brasil.

## Incluido

- Landing responsive.
- Experiencias: Buenos Aires, Delta de Tigre, Tango, fútbol, gastronomía y experiencias a medida.
- Formulario de cotización.
- Preparado para WhatsApp.
- Sección preparada para integrar vuelos, hoteles, traslados y partners/afiliados.
- Base SEO: title, description, estructura semántica y contenido orientado a búsquedas.

## Antes de publicar

1. Verificar el dominio definitivo y actualizar `robots.txt` y `sitemap.xml`.
2. Configurar Google Search Console y Google Business Profile.
3. Crear el primer usuario de Supabase Auth y asociarlo a `public.profiles` con rol `admin`.
4. En una segunda etapa, integrar cotizaciones, reservas, pagos y proveedores.

## Panel de control

El backoffice está en `/admin/`.

- Login preparado con **Supabase Auth**.
- No se guardan contraseñas en el código.
- `admin/config.example.js` contiene la plantilla de configuración.
- `admin/config.js` ya contiene la URL del proyecto y la publishable key pública de Supabase.
- La contraseña del administrador se crea y administra desde Supabase Auth.
- El panel está marcado como `noindex,nofollow` y `/admin/` está excluido de robots.

> Importante: la anon/publishable key puede estar en el frontend; nunca debe publicarse una `service_role` key.

## Deploy

El sitio es estático y puede publicarse en GitHub Pages, Netlify, Vercel o cualquier hosting estático.
## Integración Supabase

- El formulario público registra leads en `public.leads` y luego abre WhatsApp.
- El panel `/admin/` usa Supabase Auth y consulta los leads reales mediante RLS.
- Los cambios de estado del lead se registran en `public.audit_logs`.
- La publishable key puede estar en frontend; nunca debe publicarse una `service_role` key.
- El primer usuario administrativo debe crearse en Supabase Auth y tener un registro correspondiente en `public.profiles` con `role = 'admin'`.
