// Catalog categories. The product index and the homepage are generated from here.
// The order of this array is the order of the sections on /productos/.

import type { CategoriaSlug } from './products';

export interface Categoria {
  slug: CategoriaSlug;
  titulo: string;
  descripcion: string;
}

export const categorias: Categoria[] = [
  {
    slug: 'contadoras-de-billetes',
    titulo: 'Contadoras de billetes y fajos',
    descripcion:
      'Estilizadas y compactas, para contar billetes sueltos y fajos con precisión, reduciendo tiempo de trabajo y pérdidas debidas a errores humanos.',
  },
  {
    slug: 'contadoras-de-monedas',
    titulo: 'Contadoras de monedas',
    descripcion:
      'Contadoras multifunciones de fácil operación con velocidad extra rápida y conteo de alta precisión.',
  },
  {
    slug: 'detectores-de-billetes',
    titulo: 'Detectores de billetes',
    descripcion:
      'Detectores de billetes falsos con tecnología UV, MG e infrarroja para validar dinero en el punto de pago.',
  },
  {
    slug: 'zunchadoras',
    titulo: 'Zunchadoras',
    descripcion:
      'Para tensionar, termosellar y cortar en una sola operación; diferentes modelos con zunchos de poliéster o de polipropileno.',
  },
  {
    slug: 'zuncho',
    titulo: 'Zuncho e insumos',
    descripcion:
      'Zuncho plástico de polipropileno, grapas metálicas y dispensadores: los insumos del embalaje con el respaldo de CBM.',
  },
  {
    slug: 'grapadoras',
    titulo: 'Grapadoras industriales',
    descripcion:
      'Grapadoras manuales y neumáticas para el armado y sellado de cajas de cartón en procesos de embalaje.',
  },
];

export function categoriaPorSlug(slug: CategoriaSlug): Categoria {
  const cat = categorias.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Unknown category: ${slug}`);
  return cat;
}
