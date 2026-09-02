// Local image resolution by file name.
// The data files (products.ts, clients.ts, catalogs.ts) reference images by name;
// these helpers turn them into ImageMetadata that Astro can optimize.

import type { ImageMetadata } from 'astro';

function crearResolver(
  globbed: Record<string, { default: ImageMetadata }>,
  carpeta: string,
) {
  const porNombre = new Map<string, ImageMetadata>();
  for (const [ruta, mod] of Object.entries(globbed)) {
    const nombre = ruta.split('/').pop()!;
    porNombre.set(nombre, mod.default);
  }
  return (nombre: string): ImageMetadata => {
    const img = porNombre.get(nombre);
    if (!img) throw new Error(`Image not found in src/assets/${carpeta}/: ${nombre}`);
    return img;
  };
}

export const imagenProducto = crearResolver(
  import.meta.glob<{ default: ImageMetadata }>('../assets/products/*', { eager: true }),
  'products',
);

export const imagenCliente = crearResolver(
  import.meta.glob<{ default: ImageMetadata }>('../assets/clients/*', { eager: true }),
  'clients',
);

export const imagenCatalogo = crearResolver(
  import.meta.glob<{ default: ImageMetadata }>('../assets/catalogos/*', { eager: true }),
  'catalogos',
);
