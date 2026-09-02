// Product catalog — single data source. All strings are site copy: keep them in Spanish.
// Adding a product = add ONE object to this array (and its images to src/assets/products/).

export type CategoriaSlug =
  | 'contadoras-de-billetes'
  | 'contadoras-de-monedas'
  | 'detectores-de-billetes'
  | 'grapadoras'
  | 'zunchadoras'
  | 'zuncho';

export interface Producto {
  slug: string;
  titulo: string;
  categorias: CategoriaSlug[]; // the first one is the main category
  corto: string; // summary for cards and meta description (160 characters max, checked by the postbuild)
  descripcion: string[]; // paragraphs
  caracteristicas: string[];
  imagenes: string[]; // files in src/assets/products/ — the first one is the cover
  youtube: string[]; // video IDs
  enlaces: { label: string; url: string }[]; // external references (manufacturer, etc.)
  relacionados: string[]; // slugs of other products
  destacado?: boolean; // shown on the homepage
  apoyo?: { titulo: string; texto: string; href: string }; // internal page with the manual and training videos
}

export const productos: Producto[] = [
  {
    slug: "tbm-ep100-contadora-de-billetes",
    titulo: "Contadora de billetes TBM EP100",
    categorias: ["contadoras-de-billetes"],
    corto: "Contadora de billetes clasificadora y validadora de 2 bolsillos: elimina las paradas del equipo al identificar billetes sospechosos.",
    descripcion: [
      "Contadora de billetes. Clasificadora y validadora de billetes de 2 bolsillos, como resultado se eliminan las paradas del equipo al identificar billetes sospechosos. Diseño innovador con una interfaz de usuario amigable, además de un tamaño compacto (40% más compacta, 48% más liviana y un recorrido de billete 60% más corto, comparado con otras máquinas), por lo tanto es una contadora de billetes fácil de adaptar en cualquier espacio o equipo de trabajo.",
      "Tecnología de punta para la detección de billetes falsos y para la validación de billetes auténticos, por lo que asegura mayor confiabilidad en los procesos. Esta contadora de billetes es un equipo poderoso para el manejo de dinero en efectivo. Puede ser instalado en un cajero pequeño y en oficinas de cambio de divisas de espacio limitado. Esta contadora de billetes está equipada con una tapa cubre polvo, por lo tanto genera menos emisión de polvo y menos ruido.",
      "Equipo fabricado en Corea del Sur por TBM bajo altos estándares de calidad: cumple las normas RoHS y CE y superó la prueba de máquinas operadas por personal del Banco Central Europeo (ECB), por lo que es indudable la gran calidad de la contadora de billetes EP100.",
    ],
    caracteristicas: [
      "Reconocimiento de hasta 10 divisas en el software.",
      "Conectividad. RS232 : Impresora o PC",
      "RJ11 : Pantalla remota",
      "USB : Memoria USB",
      "USB_B : PC",
    ],
    imagenes: ["TBM-EP100-FRONTAL.png", "TBM_05.png", "TBM_10.png", "TBM_08.png", "TBM_24.png", "TBM_22.png"],
    youtube: ["kLTXetnl1Gs"],
    enlaces: [
      { label: "Fabricante: TBM Corp (Corea del Sur)", url: "http://tbmcorp.co.kr/" },
      { label: "Prueba ECB de máquinas operadas por personal (PDF)", url: "https://www.ecb.europa.eu/euro/cashprof/cashhand/generatedPdfs/Staff_Operated_Machines_2019-07-05.en.pdf" },
    ],
    relacionados: [],
    apoyo: {
      titulo: "Capacitación TBM EP100",
      texto: "Manual de usuario y siete videos paso a paso para operar el equipo.",
      href: "/capacitacion-tbm/",
    },
  },
  {
    slug: "zunchadora-portatil-transpak-h46",
    titulo: "Zunchadora Portátil Transpak H46",
    categorias: ["zunchadoras"],
    corto: "Zunchadora portátil semiautomática a batería. Cuenta con un ajuste amplio de tensión. A la misma vez tiene la posibilidad de zunchar con PET o PP.",
    descripcion: [
      "Zunchadora portátil semiautomática a batería. Cuenta con un ajuste amplio de tensión. A la misma vez tiene la posibilidad de zunchar con PET o PP. Además es una zunchadora portátil de fácil operación, por su panel digital, además la batería Bosch proporciona una capacidad 415 ciclos (PP) o 320 ciclos (PET) de zunchado por cada carga. Esta zunchadora portátil es ideal para gran variedad de industrias y aplicaciones. Especialmente para el empaque de pallets y armado de estibas grandes, gracias a su característica portátil. Zunchadora portátil de alta confiabilidad gracias a los motores sin escobillas. No es necesario ajustar la herramienta para trabajar diferentes anchos de zuncho gracias a su diseño innovador. Equipo marca Transpak de gran confiabilidad, gracias a que es fabricado en Taiwan bajo estándares ISO 9001.",
    ],
    caracteristicas: [
      "Fácil operación.",
      "Panel de operación digital.",
      "Amplio rango de tensión.",
      "Sellado por calor mediante fricción.",
      "Batería y cargador Bosch.",
      "No es necesario ajuste adicional para diferentes espesores de zuncho.",
      "Motores de tecnología sin escobillas.",
      "Diseño robusto.",
      "Balance perfecto y diseño ergonómico.",
      "Modo de ahorro de energía.",
      "Soporte de suspensión.",
      "Plato base para proteger el desgaste.",
      "Cubierta para proteger los botones.",
    ],
    imagenes: ["H46-1.png", "H46-2.png", "H46-3.png", "H-46-2.jpg", "H-46-3.jpg", "H-46-4.jpg", "H46-CARACTERISTICAS.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayores detalles", url: "https://www.transpakcorp.com/productdetail.php?id=118" },
    ],
    relacionados: [],
  },
  {
    slug: "grapa-c58",
    titulo: "Grapa C58",
    categorias: ["grapadoras", "zuncho"],
    corto: "Grapa C58 cobrizada, resistente a la corrosión. Insumo indispensable para el armado de cajas de cartón, tanto en fondos como en laterales de caja.",
    descripcion: [
      "Grapa C58 cobrizada, por lo que es resistente a la corrosión. Insumo indispensable para el armado de cajas de cartón, tanto de fondos de caja como laterales de caja. Con el uso de la grapa C58 aumenta la seguridad de sus productos, por lo que el producto llega de manera satisfactoria al cliente final. Este producto tiene 1.25″ de ancho y 0.63″ de longitud, por lo tanto es ideal para cerrar cajas de cartón estándar. Este producto viene en presentación por 2000 grapas por caja. Además se vende por cartón, el cual contiene 10 cajas. Producto compatible con las máquinas Josef Kihlberg.",
    ],
    caracteristicas: [],
    imagenes: ["Grapa-Gema.png"],
    youtube: [],
    enlaces: [],
    relacionados: [],
  },
  {
    slug: "recontadora-de-billetes-tw880",
    titulo: "Recontadora de billetes TransWorld - TW880",
    categorias: ["contadoras-de-billetes"],
    corto: "Esta es una recontadora de billetes (contadora de fajos) de trabajo mediano, cuenta con un diseño moderno, alta precisión y rapidez en el conteo.",
    descripcion: [
      "Esta es una recontadora de billetes (contadora de fajos) de trabajo mediano, cuenta con un diseño moderno, alta precisión y rapidez en el conteo. Esta máquina usa la tecnología de CPU dual. Más 20 años de experiencia en la manufactura de recontadoras de billetes, por lo tanto garantiza un conteo confiable y rápido. La recontadora de billetes TW880 tiene un diseño compacto y liviano, lo cual la hace ideal para procesos en espacios reducidos.",
      "Componentes mecánicos de alta precisión, por lo tanto el conteo es confiable y rápido. Filtros de aire de aire de gran capacidad, por lo que se eliminan mantenimientos correctivos. Unidad de vacío fabricada en Taiwan, con excelente diseño que evita el sobrecalentamiento de la máquina. Además el diseño optimizado de la unidad de vacío garantiza un funcionamiento silencioso.",
      "Fuente de alimentación hecha en Taiwan, por lo que se garantiza su funcionamiento continuo. Diseño compacto y liviano para ser usada en escritorio, por lo que se ahorra espacio necesario para ubicar el equipo. Pantalla LED de gran luminosidad y opción de adecuar pantalla remota. Múltiples modos de conteo para verificar fajos, armar fajos y efectuar arqueos de caja.",
    ],
    caracteristicas: [],
    imagenes: ["TW880-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Algunos de nuestros clientes", url: "https://www.grupobancolombia.com/" },
    ],
    relacionados: [],
  },
  {
    slug: "grapadora-psb32-22",
    titulo: "Grapadora - PSB32/22",
    categorias: ["grapadoras"],
    corto: "Grapadora neumática PSB2/22. La grapadora PSB32/22 es una herramienta neumática de grapado para lados de cajas indispensable para el armado de las mismas.",
    descripcion: [
      "Grapadora neumática PSB2/22. La grapadora PSB32/22 es una herramienta neumática de grapado para lados de cajas indispensable para el armado de las mismas. Está diseñada para un trabajo pesado usando grapas metálicas C-58 (C58) con longitudes de pata desde 15mm hasta 22mm. En el mercado colombiano se conoce como “patona”. Herramienta fabricada en Taiwan, por lo tanto se garantiza su confiabilidad y la calidad de sus componentes. Somos importadores directos, por lo que el servicio pos venta y la consecución de repuestos está garantizada. Alternativa a la Josef Khilberg F561.",
      "Es una herramienta fácil de operar e indispensable para cualquier industria donde se empacan productos en cajas de cartón. Además garantiza el aumento de productividad en los procesos de embalaje.",
    ],
    caracteristicas: [],
    imagenes: ["GRAPADORA-NEUMATICA.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer acerca del mundo de las grapadoras", url: "https://www.nailgundepot.com/blog/the-box-stapler-buying-guide-for-packaging-shipping-blog.html" },
    ],
    relacionados: ["grapadora-msd32"],
  },
  {
    slug: "grapadora-msd32",
    titulo: "Grapadora - MSD32/22",
    categorias: ["grapadoras"],
    corto: "Grapadora manual MSD32/22. La grapadora MSD32/22 es una herramienta neumática de grapado para lados de cajas indispensable para el armado de las mismas.",
    descripcion: [
      "Grapadora manual MSD32/22. La grapadora MSD32/22 es una herramienta neumática de grapado para lados de cajas indispensable para el armado de las mismas. Está diseñada para un trabajo pesado usando grapas metálicas C-58 (C58) con longitudes de pata desde 15mm hasta 22mm. En el mercado colombiano se conoce como “patona”. Herramienta fabricada en Taiwan, por lo tanto se garantiza su confiabilidad y la calidad de sus componentes. Somos importadores directos, por lo que el servicio pos venta y la consecución de repuestos está garantizada. Alternativa a la Josef Khilberg F561.",
      "Es una herramienta fácil de operar e indispensable para cualquier industria donde se empacan productos en cajas de cartón. Además garantiza el aumento de productividad en los procesos de embalaje.",
    ],
    caracteristicas: [],
    imagenes: ["Grapadora-Manual.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer acerca del mundo de las grapadoras", url: "https://www.nailgundepot.com/blog/the-box-stapler-buying-guide-for-packaging-shipping-blog.html" },
    ],
    relacionados: ["grapadora-psb32-22"],
  },
  {
    slug: "contadora-de-monedas-chihua-ch202n",
    titulo: "Contadora de monedas - Chihua CH202N",
    categorias: ["contadoras-de-monedas"],
    corto: "Contadora de monedas Chihua CH202N de trabajo pesado, ideal para transportadoras de valores y negocios con alto flujo de monedas.",
    descripcion: [
      "Contadora de monedas Chihua CH202N. Contadora de monedas de trabajo pesado, por lo que es ideal para transportadoras de valores y negocios con alto flujo de monedas. La contadora de monedas CH202N fue principalmente diseñada separar y contar altas cantidades de monedas mezcladas continuamente. La máquina CH202N es multifuncional, de fácil operación, velocidad extra rápida y conteo de alta precisión. Además su método de alimentación automático, permite alcanzar una velocidad de separación de 2400 monedas por minuto. La amplía tolva soporta hasta 5000 monedas, lo cual la hace ideal para conteo a gran escala y trabajo 24/7. Este equipo es multifuncional, de fácil operación, mantenimiento económico y conteo de alta precisión, por lo tanto es ideal para cualquier tipo de negocio.",
    ],
    caracteristicas: [
      "Perilla para seleccionar el espesor y el diámetro de las monedas.",
      "Conteo/Separación desde la moneda más pequeña hasta la más grande.",
      "Puede ser equipada con tubos de monedas y bolsas de monedas.",
    ],
    imagenes: ["CH220N-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Información adicional acerca de contadoras de dinero", url: "https://es.wikipedia.org/wiki/Contadora_de_billetes" },
    ],
    relacionados: [],
  },
  {
    slug: "contadora-de-monedas-taychian-tc220",
    titulo: "Contadora de monedas - TayChian TC220",
    categorias: ["contadoras-de-monedas"],
    corto: "Contadora de monedas TayChian TC220, fabricada en Taiwan. Contadora de monedas de trabajo pesado y alta velocidad.",
    descripcion: [
      "Contadora de monedas TayChian TC220, fabricada en Taiwan. Contadora de monedas de trabajo pesado y alta velocidad. Está principalmente diseñada para ejecutar complicadas tareas de separación de monedas. La máquina Tay-Chian TC-220 puede separar cualquier tamaño de moneda. Este es un equipo de trabajo pesado. Cuenta con gran variedad de funciones, como guardar y acumular los resultados de conteo. Puede ser equipada con tubos de monedas, bolsas de monedas (3000 monedas de 25mm y pantalla remota. Gran capacidad de tolva de hasta 5000 monedas. Gran velocidad de conteo de hasta 2500 monedas por minuto.",
    ],
    caracteristicas: [],
    imagenes: ["TC220.jpg"],
    youtube: [],
    enlaces: [
      { label: "Información adicional acerca de contadoras de dinero", url: "https://es.wikipedia.org/wiki/Contadora_de_billetes" },
    ],
    relacionados: [],
  },
  {
    slug: "contadora-de-monedas-taychian-tc200",
    titulo: "Contadora de monedas - TayChian TC200",
    categorias: ["contadoras-de-monedas"],
    corto: "Contadora de monedas TayChian TC200.",
    descripcion: [
      "Contadora de monedas TayChian TC200. Contadora de monedas de trabajo mediano, por lo que es el equipo indicado para tiendas pequeñas, estaciones de servicio de bajo flujo, etc. Este equipo es fácil de operar, por lo tanto se adecua amigablemente a su equipo de trabajo. La contadora de monedas TC200 tiene un diseño compacto, por lo que es ideal para espacios oficinas reducidas.",
      "Diseño versátil e interfaz de usuario amigable. Cuenta con múltiples modos de operación (continuo, suma y loteo), por lo tanto su versatilidad aumenta las eficiencias para el usuario. El diseño posee una manija para facilitar el transporte del equipo. Además cuenta con un accesorio para instalar una bolsa lateral para las monedas rechazadas. Pantalla LED de 5 dígitos, por lo tanto se facilita la lectura de los resultados del conteo. Tecnología de conteo con sensor electrónico, por lo que la precisión del conteo está garantizada. Velocidad de conteo de hasta 1600 monedas por minuto.",
    ],
    caracteristicas: [],
    imagenes: ["TC200.jpg"],
    youtube: [],
    enlaces: [
      { label: "Información adicional acerca de contadoras de dinero", url: "https://es.wikipedia.org/wiki/Contadora_de_billetes" },
    ],
    relacionados: [],
  },
  {
    slug: "grapa-metalica-zuncho",
    titulo: "Grapa metálica",
    categorias: ["zuncho", "zunchadoras"],
    corto: "Grapa zuncho metálica para zuncho plástico (PP o PET), o zuncho metálico. Fabricada en acero galvanizado, por lo que se garantiza su resistencia a la corrosión.",
    descripcion: [
      "Grapa zuncho metálica para zuncho plástico (PP o PET), o zuncho metálico. Fabricada en acero galvanizado, por lo que se garantiza su resistencia a la corrosión. Usando la grapa de zuncho metálica aseguras el embalaje de tu producto, por lo tanto el cliente final recibe su despacho a satisfacción. Este producto es de fabricación nacional tipo G o tipo U. Esta grapa debe ser cerrada usando la pinza Transpak H35-12. Esta es una grapa abierta para sellar el zuncho en una superficie plana. Si el producto a embalar tiene un peso de más de 10 kg, entonces recomendamos usar este tipo de grapa.",
      "Insumo indispensable para el zunchado mediante herramientas manuales.",
    ],
    caracteristicas: [],
    imagenes: ["Grapa.jpg"],
    youtube: [],
    enlaces: [],
    relacionados: [],
  },
  {
    slug: "zuncho",
    titulo: "Zuncho Plástico Polipropileno (PP)",
    categorias: ["zuncho", "zunchadoras"],
    corto: "Zuncho plástico de polipropileno (PP) multiusos, por lo que es ideal para múltiples aplicaciones de empaque.",
    descripcion: [
      "Zuncho plástico de polipropileno (PP) multiusos, por lo que es ideal para múltiples aplicaciones de empaque. Fabricado con material de alta resistencia, por lo tanto es adecuado para usar con herramientas manuales o semiautomáticas. Somos distribuidores directos de la marca Durazuncho. Nuestro zuncho se diferencia por la posibilidad de fabricarlo personalizado, por lo que se facilita la identificación del producto embalado. Este zuncho se caracteriza por su resistencia, durabilidad y el respaldo de los productos distribuidos por CBM LTDA. Este producto se usa para asegurar embalajes, clasificar mercancías, amarres en general, amarres en plantaciones, entre otros.",
    ],
    caracteristicas: [],
    imagenes: ["Zuncho.jpg"],
    youtube: [],
    enlaces: [],
    relacionados: ["zunchadora-transpak-tp201", "zunchadora-portatil-transpak-h46"],
  },
  {
    slug: "dispensador-de-zuncho-transpak-h83e",
    titulo: "Dispensador de zuncho - Transpak H83E",
    categorias: ["zunchadoras"],
    corto: "Transpak H83E. Dispensador de zuncho para el uso de herramientas de zunchado manual.",
    descripcion: [
      "Transpak H83E. Dispensador de zuncho para el uso de herramientas de zunchado manual. Indispensable para mantener el rollo de zuncho ordenado y sin perder el extremo del rollo para la siguiente operación de zunchado. Este modelo NO posee ruedas, por lo tanto ahorra espacio y es útil para usar en espacios reducidos.",
      "El uso de este dispensador le permitirá aumentar la eficiencia en el proceso de embalaje. Producto fabricado en Taiwan, por lo tanto su calidad y robustez está garantizada. Dispensador de zuncho con estructura en acero galvanizado, por lo que este dispensador no se verá afectado por la corrosión. Carrete fabricados en polímero de alta resistencia al impacto y a la abrasión. Freno autobloqueante, por lo tanto facilita que el carrete se detenga justo después de que el usuario ha usado la cantidad de zuncho necesaria.",
      "El dispensador de zuncho Transpak H83E aumenta los ahorros de material debido a que evita el desperdicio de zuncho cuando el rollo se usa en el suelo. Además el uso del dispensador garantiza tener el material limpio y libre de suciedad.",
    ],
    caracteristicas: [],
    imagenes: ["H83E-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Si desea mayor información del fabricante", url: "https://www.transpakcorp.com/productdetail.php?id=57" },
    ],
    relacionados: ["dispensador-de-zuncho-transpak-h83"],
  },
  {
    slug: "dispensador-de-zuncho-transpak-h83",
    titulo: "Dispensador de zuncho - Transpak H83",
    categorias: ["zunchadoras"],
    corto: "Transpak H83. Dispensador de zuncho para el uso de herramientas de zunchado manual.",
    descripcion: [
      "Transpak H83. Dispensador de zuncho para el uso de herramientas de zunchado manual. Indispensable para mantener el rollo de zuncho ordenado y sin perder el extremo del rollo para la siguiente operación de zunchado. Este modelo posee ruedas para su fácil transporte, además de una canasta para almacenar el tensor, la pinza y las grapas metálicas.",
      "El uso de este dispensador le permitirá aumentar la eficiencia en el proceso de embalaje. Producto fabricado en Taiwan, por lo tanto su calidad y robustez está garantizada. Dispensador de zuncho con estructura en acero galvanizado, por lo que este dispensador no se verá afectado por la corrosión. Carrete y canasta fabricados en polímeros de alta resistencia al impacto y a la abrasión. Freno autobloqueante, por lo tanto facilita que el carrete se detenga justo después de que el usuario ha usado la cantidad de zuncho necesaria.",
      "El dispensador de zuncho Transpak H83 aumenta los ahorros de material debido a que evita el desperdicio de zuncho cuando el rollo se usa en el suelo. Además el uso del dispensador garantiza tener el material limpio y libre de suciedad.",
    ],
    caracteristicas: [],
    imagenes: ["H83-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Si desea mayor información del fabricante", url: "https://www.transpakcorp.com/productdetail.php?id=57" },
    ],
    relacionados: [],
  },
  {
    slug: "detector-de-billetes-accubanker-d66",
    titulo: "Detector de billetes - Accubanker D66",
    categorias: ["detectores-de-billetes"],
    corto: "Detector de billetes Accubanker D66.",
    descripcion: [
      "Detector de billetes Accubanker D66. Detector de billetes falsos equipado con 2 lamparas de luz UV de 6W cada una, por lo que es fácil la revisión de los detalles de tinta UV. Este equipo posee 4 métodos de detección: Lámparas UV, luz blanca (marcas de agua), lupa para identificar la micro impresión y además de un sensor de tinta magnética. Este equipo está diseñado para sitios donde el flujo de dinero es alto y la máquina debe estar encendida constantemente. Además es conveniente pues tiene un sensor que enciende la luz automáticamente cuando un billete es puesto dentro del detector. Este equipo es fabricado en China con diseño en EEUU, por lo que sus funciones y características son superiores.",
    ],
    caracteristicas: [],
    imagenes: ["D66-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayor información de este producto", url: "https://www.accubanker.com" },
    ],
    relacionados: [],
  },
  {
    slug: "detector-de-billetes-accubanker-d64",
    titulo: "Detector de billetes - Accubanker D64",
    categorias: ["detectores-de-billetes"],
    corto: "Detector de billetes Accubanker D64.",
    descripcion: [
      "Detector de billetes Accubanker D64. Detector de billetes falsos equipado con 2 lamparas de luz UV de 6W cada una, por lo que es fácil la revisión de los detalles de tinta UV. Esta máquina posee 4 métodos de detección: Luz UV, luz blanca (marcas de agua), lupa para identificar la micro impresión y sensor de tinta magnética. Esta máquina está diseñada para sitios donde el flujo de dinero es alto y la máquina debe estar encendida constantemente. Es conveniente pues tiene un sensor que enciende la luz automáticamente cuando un billete es puesto dentro del detector. Este equipo es fabricado en China con diseño en EEUU, por lo que sus funciones y características son superiores.",
    ],
    caracteristicas: [],
    imagenes: ["D64-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayor información de este producto", url: "https://www.accubanker.com" },
    ],
    relacionados: [],
  },
  {
    slug: "detector-de-billetes-accubanker-d63",
    titulo: "Detector de billetes - Accubanker D63",
    categorias: ["detectores-de-billetes"],
    corto: "Detector de billetes Accubanker D63.",
    descripcion: [
      "Detector de billetes Accubanker D63. Detector de billetes falsos equipado con 2 lámparas de luz UV de 9W cada una, por lo tanto es sencillo revisar los detalles de tinta UV. Esta máquina es ideal para pequeños negocios donde hay a considerable flujo de efectivo. Está equipada con lámpara de luz blanca para verificar marcas de agua en los billetes. Especialmente diseñada para proteger los ojos directamente de los rayos UV. Claramente se pueden visualizar los detalles en tinta fluorescente en diferentes documentos como licencias de conducción, dinero en efectivo, tarjetas de crédito, pasaportes etcétera. Este equipo es fabricado en China con diseño en EEUU, por lo que sus funciones y características son superiores.",
    ],
    caracteristicas: [],
    imagenes: ["D63-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayor información de este producto", url: "https://www.accubanker.com" },
    ],
    relacionados: [],
  },
  {
    slug: "detector-de-billetes-accubanker-d62",
    titulo: "Detector de billetes - Accubanker D62",
    categorias: ["detectores-de-billetes"],
    corto: "Detector de billetes Accubanker D62.",
    descripcion: [
      "Detector de billetes Accubanker D62. Detector de billetes falsos equipado con 2 lamparas de luz UV de 6W cada una, por lo tanto es sencillo revisar los detalles de tinta UV. Esta máquina es ideal para pequeños negocios donde haya considerable flujo de efectivo. Especialmente diseñada para proteger los ojos directamente de los rayos UV. Claramente se pueden visualizar los detalles en tinta fluorescente en diferentes documentos como licencias de conducción, dinero en efectivo, tarjetas de crédito, pasaportes etcétera. Este equipo es fabricado en China con diseño en EEUU, por lo que sus funciones y características son superiores.",
    ],
    caracteristicas: [],
    imagenes: ["D62-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayor información de este producto", url: "https://www.accubanker.com/" },
    ],
    relacionados: [],
  },
  {
    slug: "zunchadora-manual-transpak-h23",
    titulo: "Zunchadora manual - Transpak H23",
    categorias: ["zunchadoras"],
    corto: "Tensor de zuncho manual (zunchadora manual). Zunchadora manual Transpak H23.",
    descripcion: [
      "Tensor de zuncho manual (zunchadora manual). Zunchadora manual Transpak H23. Producto fabricado en Taiwan bajo estándares ISO 9001, por lo que su calidad y durabilidad están garantizadas. Esta es una herramienta económica y de fácil operación, por lo que es una herramienta adaptable a cualquier operación de embalaje. Debido a sus características de zunchado manual, es una herramienta para bajo volumen de embalaje. Materiales de gran calidad, por lo que tiene capacidad para trabajar con PET. Gracias a su diseño, también se recomienda para usos con zuncho PP de alta resistencia.",
    ],
    caracteristicas: [],
    imagenes: ["H23-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para ver detalles del fabricante", url: "https://www.transpakcorp.com/productdetail.php?id=41" },
    ],
    relacionados: [],
  },
  {
    slug: "zunchadora-manual-transpak-h35",
    titulo: "Zunchadora manual - Transpak H35",
    categorias: ["zunchadoras"],
    corto: "Pinza para zunchado manual (zunchadora manual). Zunchadora manual Transpak H35.",
    descripcion: [
      "Pinza para zunchado manual (zunchadora manual). Zunchadora manual Transpak H35. Producto fabricado en Taiwan bajo estándares ISO 9001, por lo que su calidad y durabilidad están garantizadas. Esta es una herramienta económica y de fácil operación, por lo que es una herramienta adaptable a cualquier operación de embalaje. Debido a sus características de zunchado manual, es una herramienta para bajo volumen de embalaje. Herramienta diseñada para operaciones de zunchado con zuncho PP o PET. Gracias a su diseño, también se recomienda para usos con zuncho PP de alta resistencia.",
      "Herramienta indispensable para el zunchado manual haciendo uso de grapas metálicas (grapa lisa o moleteada). Esta herramienta se usa después de tensionar el zuncho para asegurar el zuncho.",
    ],
    caracteristicas: [],
    imagenes: ["H35-SQ-1.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayores detalles", url: "https://www.transpakcorp.com/productdetail.php?id=55" },
    ],
    relacionados: [],
  },
  {
    slug: "zunchadora-manual-transpak-h21",
    titulo: "Zunchadora manual - Transpak H21",
    categorias: ["zunchadoras"],
    corto: "Tensor de zuncho manual (zunchadora manual). Zunchadora manual Transpak H21.",
    descripcion: [
      "Tensor de zuncho manual (zunchadora manual). Zunchadora manual Transpak H21. Producto fabricado en Taiwan bajo estándares ISO 9001, por lo que su calidad y durabilidad están garantizadas. Esta es una herramienta económica y de fácil operación, por lo que es una herramienta adaptable a cualquier operación de embalaje. Debido a sus características de zunchado manual, es una herramienta para bajo volumen de embalaje. Herramienta diseñada para operaciones de zunchado con zuncho PP. Gracias a su diseño, también se recomienda para usos con zuncho PP de alta resistencia.",
    ],
    caracteristicas: [],
    imagenes: ["H21-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayores detalles del producto", url: "https://www.transpakcorp.com/productdetail.php?id=52" },
    ],
    relacionados: [],
  },
  {
    slug: "zunchadora-transpak-tp201",
    titulo: "Zunchadora Semiautomática - Transpak TP201",
    categorias: ["zunchadoras"],
    corto: "Zunchadora semiautomática Transpak TP201. Este equipo es de fabricación Taiwanesa, por lo tanto asegura gran calidad en la construcción y un precio competitivo.",
    descripcion: [
      "Zunchadora semiautomática Transpak TP201. Este equipo es de fabricación Taiwanesa, por lo tanto asegura gran calidad en la construcción y un precio competitivo. Esta máquina está diseñada para uso general, por lo tanto puede cumplir diferentes requerimientos.",
      "La zunchadora Transpak TP201 es una equipo de zunchado semiautomático económico, además de un tamaño compacto, por lo tanto es la mejor opción para embalaje de cajas. Este equipo está diseñado para trabajo pesado usando zuncho plástico de polipropileno (PP), por consiguiente es una herramienta indispensable y versátil para su negocio. La zunchadora Transpak tensiona, termosella y corta zuncho PP en una sola operación.",
      "Es una máquina fácil de operar e indispensable para cualquier industria donde los productos deban ser embalados de manera segura.",
    ],
    caracteristicas: [
      "Diseño simple, además de ingeniería de punta.",
      "Fácil operación y mantenimiento sencillo.",
      "Tapa en acero inoxidable, por lo tanto garantiza durabilidad.",
      "Control de tensión mecánico, es decir que se traduce en alta confiabilidad.",
      "Ruedas robustas.",
      "Eficiente enérgicamente, gracias a que el motor usa únicamente cuando es necesario.",
      "Tarjeta electrónica (PCB) confiable y robusta.",
      "Amigable con su presupuesto.",
      "Mejor relación costo – beneficio, comparado con la competencia.",
      "Calidad probada en campo.",
    ],
    imagenes: ["TP201.gif"],
    youtube: [],
    enlaces: [
      { label: "Para conocer mayor información del fabricante", url: "https://www.transpakcorp.com/productdetail.php?id=40" },
    ],
    relacionados: [],
  },
  {
    slug: "recontadora-de-billetes-chihua-tw-600l",
    titulo: "Recontadora de billetes TransWorld TW600L",
    categorias: ["contadoras-de-billetes"],
    corto: "Recontadora de billetes TW600L. Máquina hecha en Taiwan, por lo tanto aseguramos su confiabilidad y robustez.",
    descripcion: [
      "Recontadora de billetes TW600L. Máquina hecha en Taiwan, por lo tanto aseguramos su confiabilidad y robustez. Esta es una contadora de fajos (recontadora de billetes) de trabajo mediano.",
      "Diseño moderno, alta precisión y rapidez en el conteo. Los componentes mecánicos de esta recontadora son fabricados con alta precisión, por lo tanto se garantiza la precisión en el conteo. Poco mantenimiento necesario, gracias a los materiales de excelente calidad. Filtros de aire de gran capacidad, lo cual se traduce en menos visitas de mantenimiento preventivo. Unidad de vacío de fabricación Taiwanesa, por lo tanto tiene un excelente diseño de refrigeración.",
      "Diseño electrónico sencillo y confiable, por lo que el costo de mantenimiento es bajo. Interfaz de usuario amigable y sencilla, por lo que se adapta a cualquier equipo de trabajo. Diseño de piso, es decir que hay mayor espacio para la unidad de vacío, por lo tanto se disminuye la posibilidad de un recalentamiento en el uso continuado. Además se facilitan las operaciones de mantenimiento.",
      "Diseño compacto y liviano. Esta máquina está disponible en versión de piso, por lo que facilita su traslado en la sucursal . También versión de escritorio la cual facilita su portabilidad.",
    ],
    caracteristicas: [],
    imagenes: ["TWL600L.png"],
    youtube: [],
    enlaces: [
      { label: "Algunos de nuestros clientes", url: "https://www.grupobancolombia.com/" },
    ],
    relacionados: [],
  },
  {
    slug: "recontadora-de-fajos-chihua-ch-900",
    titulo: "Recontadora de fajos - Chihua CH900",
    categorias: ["contadoras-de-billetes"],
    corto: "Esta es una recontadora de fajos de trabajo pesado, cuenta con un diseño moderno, alta precisión y rapidez en el conteo.",
    descripcion: [
      "Esta es una recontadora de fajos de trabajo pesado, cuenta con un diseño moderno, alta precisión y rapidez en el conteo. Equipo fabricado en Taiwan, por lo que sus componentes son de alta calidad. Somos distribuidores exclusivos y directos, por lo tanto el servicio técnico a nivel nacional está garantizado. Componentes mecánicos fabricados en centros CNC, por lo que se garantiza la confiabilidad del equipo.",
      "Componentes mecánicos de alta precisión, por lo tanto el conteo es confiable y rápido. Filtros de aire de aire de gran capacidad, por lo que se eliminan mantenimientos correctivos. Unidad de vacío fabricada en Taiwan, con excelente diseño que evita el sobrecalentamiento de la máquina. Además el diseño optimizado de la unidad de vacío garantiza un funcionamiento silencioso.",
      "Diseño compacto y liviano. Esta máquina está disponible en versión de piso la cual facilita su movimiento en una oficina y versión de escritorio la cual facilita su portabilidad.",
    ],
    caracteristicas: [],
    imagenes: ["CH900D-SQ.png", "CH900-2.jpg"],
    youtube: [],
    enlaces: [
      { label: "Algunos de nuestros clientes", url: "https://www.grupobancolombia.com/" },
    ],
    relacionados: [],
    destacado: true,
  },
  {
    slug: "recontadora-de-fajos-chihua-ch-600an",
    titulo: "Recontadora de fajos - Chihua CH600AN",
    categorias: ["contadoras-de-billetes"],
    corto: "Esta es una recontadora de fajos de trabajo pesado, cuenta con un diseño moderno, alta precisión y rapidez en el conteo.",
    descripcion: [
      "Esta es una recontadora de fajos de trabajo pesado, cuenta con un diseño moderno, alta precisión y rapidez en el conteo. Equipo fabricado en Taiwan, por lo que sus componentes son de alta calidad. Somos distribuidores exclusivos y directos, por lo tanto el servicio técnico a nivel nacional está garantizado. Componentes mecánicos fabricados en centros CNC, por lo que se garantiza la confiabilidad del equipo.",
      "Componentes mecánicos de alta precisión, por lo tanto el conteo es confiable y rápido. Filtros de aire de aire de gran capacidad, por lo que se eliminan mantenimientos correctivos. Unidad de vacío fabricada en Taiwan, con excelente diseño que evita el sobrecalentamiento de la máquina. Además el diseño optimizado de la unidad de vacío garantiza un funcionamiento silencioso.",
      "Teclado sin interruptores ni pulsadores, partes principales mecanizadas por el fabricante en centros CNC. Control estricto de tolerancia, precisión y exactitud para eliminar el error humano. Tarjeta electrónica con componentes superficiales.",
    ],
    caracteristicas: [],
    imagenes: ["CH600-SQ.png"],
    youtube: [],
    enlaces: [
      { label: "Algunos de nuestros clientes", url: "https://www.grupobancolombia.com/" },
    ],
    relacionados: [],
    destacado: true,
  },
  {
    slug: "contadora-de-billetes-accubanker-ab4200",
    titulo: "Contadora de billetes - AccuBanker AB4200",
    categorias: ["contadoras-de-billetes"],
    corto: "Esta es una contadora de billetes de trabajo mediano, por lo que su diseño es adecuado para negocios medianos.",
    descripcion: [
      "Esta es una contadora de billetes de trabajo mediano, por lo que su diseño es adecuado para negocios medianos. La contadora de billetes AB4200 ayuda a ahorrar tiempo, costos y a reducir pérdidas por errores humanos a la hora de contar. Tiene un diseño robusto con polímeros de alta resistencia.",
      "En condiciones de uso adecuadas , sus partes están diseñadas para resistir el desgaste. Velocidad de hasta 1800 billetes por minuto, por lo tanto el equipo soporta trabajo liviano y mediano. Máquina fácil de usar y con alimentación de carga frontal, por lo que el proceso de conteo de billetes es más suave. Pantalla LCD de gran luminosidad, por lo tanto la operación de la máquina es cómoda para el usuario. Contadora de billetes adecuada para los billetes de pesos colombianos.",
    ],
    caracteristicas: [],
    imagenes: ["AB4200-A.jpg"],
    youtube: [],
    enlaces: [
      { label: "Para conocer más acerca del fabricante", url: "https://www.accubanker.com/" },
    ],
    relacionados: [],
    destacado: true,
  },
  {
    slug: "contadora-de-billetes-accubanker-ab1100-plus",
    titulo: "Contadora de billetes - AccuBanker AB1100 PLUS",
    categorias: ["contadoras-de-billetes"],
    corto: "Esta es una contadora de billetes de trabajo liviano, la cual está diseñada para labores de conteo esporádicas.",
    descripcion: [
      "Esta es una contadora de billetes de trabajo liviano, la cual está diseñada para labores de conteo esporádicas. La máquina AB1100 Plus ayuda a ahorrar tiempo, costos y a reducir pérdidas por errores humanos a la hora de contar. Su sistema computarizado otorga confiabilidad en el conteo, por lo que puede invertir mayor tiempo en actividades que generen valor a su negocio. Este equipo tiene funciones de arranque automático y manual, así como parada de emergencia.",
      "El equipo AB1100 Plus incluye una pantalla remota, por lo que permite al usuario mostrar el valor de conteo al cliente o a la cámara de seguridad.",
      "Esta contadora de billetes es perfecta para pequeños negocios.",
    ],
    caracteristicas: [],
    imagenes: ["AB1100-A.jpg", "AB1100-F.jpg", "AB1100-E.jpg", "AB1100-D.jpg", "AB1100-C.jpg", "AB1100-B.jpg"],
    youtube: [],
    enlaces: [
      { label: "Para conocer más acerca del fabricante", url: "https://www.accubanker.com/" },
    ],
    relacionados: [],
    destacado: true,
  },
];

export function productoPorSlug(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

export function productosPorCategoria(cat: CategoriaSlug): Producto[] {
  return productos.filter((p) => p.categorias.includes(cat));
}
