// ============================================
// VERTICAL RAP — Catálogo de productos
// Solo productos reales suministrados por el cliente
// ============================================

const CATEGORIES = [
  { id: "ascendedores", name: "Ascendedores", line: "trabajo-en-alturas" },
  { id: "descensores", name: "Descensores", line: "trabajo-en-alturas" },
  { id: "autoretractiles", name: "Autoretráctiles", line: "trabajo-en-alturas" },
  { id: "kits-rescate", name: "Kits de Rescate", line: "rescate-y-emergencias" },
  { id: "proteccion-manual", name: "Protección Manual", line: "proteccion-personal" },
];

const LINES = [
  { id: "trabajo-en-alturas", name: "Trabajo en Alturas" },
  { id: "rescate-y-emergencias", name: "Rescate y Emergencias" },
  { id: "proteccion-personal", name: "Protección Personal" },
];

const IMG = {
  ascendedorYoke: "imagenes/ascendedor_de_pecho_yoke.jpg",
  ascendedorCamClean: "imagenes/ascendedor_de_pecho_cam_clean_singing_rock.jpg",
  descensorSIR: "imagenes/descensor_con_antipanico_sir_singing_rock.jpg",
  descensorRig: "imagenes/descensor_rig_petzl.jpg",
  guanteKevlar: "imagenes/guante-kevlar_temperatura_sosega.avif",
  guanteAlgodon: "imagenes/guante_algodon_temperatura_sosega.avif",
  guanteAnticorte: "imagenes/guante_anticorte_nivel_5_sosega.avif",
  guanteRoble: "imagenes/guante_roble_latex_corrugado_sosega.avif",
  guanteTank: "imagenes/guante_tank_latex_corrugado_sosega.avif",
  kitRescate4a1: "imagenes/kit_de_rescate_4_a_1_dinamik_para_una_altura_de_40_metros.jpg",
  retractil15m: "imagenes/retractil_acero_inoxidable_15_metros_dinamik.webp",
};

const PRODUCTS = [
  // ---- Ascendedores ----
  { id: 1, sku: "VR-ASC-001", name: "Ascendedor de Pecho Yoke", cat: "ascendedores", tag: "Aluminio", img: IMG.ascendedorYoke,
    desc: "Ascendedor bloqueador de pecho para cuerda de 8mm a 13mm, ref. N5306. Uso obligatorio con la flecha hacia arriba. Fabricado en aluminio, peso neto 165g. Inspeccionado al 100% en fábrica según EN 567." },
  { id: 2, sku: "VR-ASC-002", name: "Ascendedor de Pecho Cam Clean Singing Rock", cat: "ascendedores", tag: "Liviano", img: IMG.ascendedorCamClean,
    desc: "Bloqueador de pecho compacto y ligero Singing Rock, para ascenso seguro y suave en rescate y técnicas de cuerdas especiales. Leva dentada de acero inoxidable, orificio inferior en ángulo para mantener posición plana en el arnés y gatillo con función de descenso corto." },

  // ---- Descensores ----
  { id: 3, sku: "VR-DES-001", name: "Descensor SIR Antipánico Singing Rock", cat: "descensores", tag: "Rescate", img: IMG.descensorSIR,
    desc: "Descensor autofrenante SIR de Singing Rock con sistema antipánico, para cuerda de 11mm. Certificado EN 795:12 Tipo B y EN 12841:2024 Tipo C, uso individual hasta 180kg. Diseñado para descenso controlado en rescate y trabajo en alturas." },
  { id: 4, sku: "VR-DES-002", name: "Descensor RIG Petzl", cat: "descensores", tag: "Certificado", img: IMG.descensorRig,
    desc: "Descensor autofrenante RIG de Petzl, compacto y polivalente, ideal para acceso por cuerda, arborismo y rescate. Freno adicional accionado por leva, permite un control fino de la velocidad de descenso y bloqueo automático de la cuerda." },

  // ---- Autoretráctiles ----
  { id: 5, sku: "VR-AUT-001", name: "Autoretráctil Acero Inoxidable 15 Metros Dinamik", cat: "autoretractiles", tag: "Nuevo", img: IMG.retractil15m,
    desc: "Línea de vida autoretráctil Dinamik de 15 metros, cable en acero inoxidable resistente a la corrosión, mosquetón giratorio de cierre automático y carcasa compacta de alto impacto. Ideal para grandes desplazamientos verticales en ambientes exigentes." },

  // ---- Kits de rescate ----
  { id: 6, sku: "VR-KIT-001", name: "Kit de Rescate 4:1 Dinamik para 40 Metros", cat: "kits-rescate", tag: "Completo", img: IMG.kitRescate4a1,
    desc: "Kit de rescate con sistema de ventaja mecánica 4:1 Dinamik para trabajos a 40 metros de altura. Incluye 4 mosquetones de seguridad, cinta de anclaje, polea simple y polea doble, polea giratoria, cuerda con terminales cosidos, bloqueador de puño y bolso de transporte." },

  // ---- Protección manual (guantes) ----
  { id: 7, sku: "VR-MAN-001", name: "Guantes Anticorte Nivel 5 Sosega", cat: "proteccion-manual", tag: null, img: IMG.guanteAnticorte,
    desc: "Guantes Sosega de protección anticorte nivel 5, fibra de alto rendimiento con recubrimiento de nitrilo en palma para mejor agarre en superficies húmedas o aceitosas." },
  { id: 8, sku: "VR-MAN-002", name: "Guantes Kevlar para Alta Temperatura Sosega", cat: "proteccion-manual", tag: "Nuevo", img: IMG.guanteKevlar,
    desc: "Guantes Sosega en fibra de Kevlar, resistentes a altas temperaturas y cortes. Ideales para manipulación de superficies calientes, soldadura y trabajos con riesgo térmico." },
  { id: 9, sku: "VR-MAN-003", name: "Guantes de Algodón para Temperatura Sosega", cat: "proteccion-manual", tag: null, img: IMG.guanteAlgodon,
    desc: "Guantes Sosega en algodón tejido, transpirables y con buen agarre, diseñados para trabajos de manipulación general con exposición moderada a temperatura." },
  { id: 10, sku: "VR-MAN-004", name: "Guantes Roble Látex Corrugado Sosega", cat: "proteccion-manual", tag: null, img: IMG.guanteRoble,
    desc: "Guantes Sosega línea Roble con recubrimiento de látex corrugado en palma, alta resistencia a la abrasión y excelente agarre en superficies húmedas. Soporte tejido de algodón para mayor comodidad." },
  { id: 11, sku: "VR-MAN-005", name: "Guantes Tank Látex Corrugado Sosega", cat: "proteccion-manual", tag: null, img: IMG.guanteTank,
    desc: "Guantes Sosega línea Tank con recubrimiento de látex corrugado de alta densidad, refuerzo adicional en zona de agarre para trabajos pesados e industriales." },
];