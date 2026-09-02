// SINGLE SOURCE OF TRUTH for the business data.
// Header, footer, SEO, JSON-LD and every CTA read from here:
// no contact data is written in any other file. Values are site copy: keep them in Spanish.

export const SITE = {
  nombre: 'CBM Ltda',
  nombreLegal: 'CBM Ltda',
  tagline: 'Equipos bancarios y para embalaje',
  // Homepage meta description and JSON-LD description. 160 characters max: search
  // results cut it and the postbuild (scripts/check-links.mjs) fails above that.
  descripcion:
    'Contadoras de billetes y monedas, detectores de billetes, zunchadoras e insumos de embalaje con servicio técnico propio. Desde 1983 en Medellín, Colombia.',
  fundacion: 1983,
  ciudad: 'Medellín',
  pais: 'Colombia',
  direccion: 'Diagonal 74B (Av. Bolivariana) # 32 - 117',
  // Canonical site URL (sitemap, robots, canonical and JSON-LD read it from here).
  url: 'https://cbmltda.com.co',
  // Link-preview image (WhatsApp, LinkedIn, Slack), 1200×630. `npm run brand` generates it
  // as public/og.jpg together with apple-touch-icon.png; rerun after changing the tagline, colors or photo.
  ogImage: '/og.jpg',

  // Contact — the mobile number is also the WhatsApp of the main CTA.
  telefono: '(604) 322 54 51',
  telefonoE164: '+576043225451',
  celular: '(+57) 312 296 2040',
  celularE164: '+573122962040',
  whatsapp: '573122962040', // wa.me number (country code, no '+')
  email: 'contacto@cbmltda.com.co',
  mensajeWhatsApp:
    'Hola CBM, estoy interesado en sus equipos y quiero recibir asesoría.',

  // Web3Forms key for the contact form.
  // While it is empty the form is NOT rendered (see FormularioContacto.astro).
  web3formsKey: '',

  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos/' },
    { label: 'Catálogos', href: '/catalogos/' },
    { label: 'Contáctenos', href: '/contactenos/' },
  ],

  // Secondary links that only appear in the footer.
  navFooter: [{ label: 'Material de apoyo', href: '/material-apoyo/' }],

  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('CBM Ltda, Diagonal 74B # 32-117, Medellín, Colombia'),
} as const;

/** wa.me link with a prefilled message. Accepts a number (573001234567) or a username ('@handle'). */
export function whatsappUrl(mensaje: string = SITE.mensajeWhatsApp): string {
  const destino = SITE.whatsapp.startsWith('@') ? SITE.whatsapp : SITE.whatsapp;
  return `https://wa.me/${destino}?text=${encodeURIComponent(mensaje)}`;
}

/** Prefilled WhatsApp message to ask for a quote on a specific product. */
export function whatsappUrlProducto(titulo: string): string {
  return whatsappUrl(`Hola CBM, quiero cotizar: ${titulo}. ¿Me pueden asesorar?`);
}

/** LocalBusiness JSON-LD for the <head>. */
export function jsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE.nombre,
    description: SITE.descripcion,
    url: SITE.url,
    image: new URL(SITE.ogImage, SITE.url).href,
    hasMap: SITE.mapsUrl,
    telephone: SITE.telefonoE164,
    email: SITE.email,
    foundingDate: String(SITE.fundacion),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.direccion,
      addressLocality: SITE.ciudad,
      addressCountry: 'CO',
    },
  };
}
