// Image catalogs shown on /catalogos/.
// Adding a page = put the image in src/assets/catalogos/ and add it to the array.

export interface Catalogo {
  id: string;
  titulo: string;
  descripcion: string;
  paginas: string[]; // files in src/assets/catalogos/, in reading order
}

export const catalogos: Catalogo[] = [
  {
    id: 'embalaje',
    titulo: 'Catálogo de embalaje',
    descripcion:
      'Zunchadoras, zuncho, grapadoras e insumos para el embalaje: especificaciones y modelos disponibles.',
    paginas: [
      'embalaje-01.jpg',
      'embalaje-02.jpg',
      'embalaje-03.jpg',
      'embalaje-04.jpg',
      'embalaje-05.jpg',
      'embalaje-06.jpg',
      'embalaje-07.png',
    ],
  },
  {
    id: 'manejo-de-dinero',
    titulo: 'Catálogo de manejo de dinero',
    descripcion:
      'Contadoras de billetes, contadoras de monedas y detectores: portafolio completo para el manejo de efectivo.',
    paginas: [
      'dinero-01.jpg',
      'dinero-02.jpg',
      'dinero-03.jpg',
      'dinero-04.jpg',
      'dinero-05.jpg',
      'dinero-06.jpg',
      'dinero-07.jpg',
      'dinero-08.jpg',
      'dinero-09.jpg',
      'dinero-10.jpg',
    ],
  },
];
