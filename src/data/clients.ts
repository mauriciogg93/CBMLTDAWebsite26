// Client logos shown on the homepage ("Algunos de nuestros clientes").
// Adding a client = put its logo in src/assets/clients/ and add one line here.

export interface Cliente {
  nombre: string;
  logo: string; // file in src/assets/clients/
}

export const clientes: Cliente[] = [
  { nombre: 'Bancolombia', logo: 'bancolombia.jpg' },
  { nombre: 'G4S', logo: 'g4s.jpg' },
  { nombre: 'Homecenter', logo: 'homecenter.jpg' },
  { nombre: 'Protección', logo: 'proteccion.jpg' },
  { nombre: 'Incolmotos Yamaha', logo: 'incolmotos.jpg' },
  { nombre: 'Almacenes La 14', logo: 'La14almacenes.jpeg' },
  { nombre: 'TVS', logo: 'TVS.jpg' },
  { nombre: 'Flores El Carmel', logo: 'flores-carmel.jpg' },
  { nombre: 'Flores de Oriente', logo: 'logo-flores-de-oriente.jpg' },
];
