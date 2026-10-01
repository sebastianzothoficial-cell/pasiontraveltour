# Pasión Travel Tour

MVP de sitio web para servicios de receptivo en Buenos Aires y Florianópolis.

## Incluido

- Landing responsive.
- Experiencias: City Tour Buenos Aires, Delta de Tigre, Tango, Campanópolis, Tour de Estadios y Florianópolis.
- Formulario de cotización.
- Preparado para WhatsApp.
- Sección preparada para integrar vuelos, hoteles, traslados y partners/afiliados.
- Base SEO: title, description, estructura semántica y contenido orientado a búsquedas.

## Antes de publicar

1. Editar `script.js` y reemplazar `549XXXXXXXXXX` por el número comercial de WhatsApp.
2. Reemplazar los bloques visuales de las experiencias por fotos propias/licenciadas.
3. Agregar dominio y datos reales de contacto.
4. Configurar Google Search Console y Google Business Profile.
5. En una segunda etapa, integrar reservas, pagos y proveedores de vuelos/hoteles.

## Panel de control

El backoffice está en `/admin/`.

- Login preparado con **Supabase Auth**.
- No se guardan contraseñas en el código.
- `admin/config.example.js` contiene la plantilla de configuración.
- Para activar el acceso real hay que crear `admin/config.js` con la URL del proyecto y la anon/publishable key de Supabase.
- La contraseña del administrador se crea y administra desde Supabase Auth.
- El panel está marcado como `noindex,nofollow` y `/admin/` está excluido de robots.

> Importante: la anon/publishable key puede estar en el frontend; nunca debe publicarse una `service_role` key.

## Deploy

El sitio es estático y puede publicarse en GitHub Pages, Netlify, Vercel o cualquier hosting estático.