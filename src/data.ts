import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "soy-peptide",
    name: "Soy Small Molecule Peptide",
    category: "Compléments alimentaires",
    description: "Complément nutritionnel à base de peptides de soja conçu pour accompagner un mode de vie équilibré. Il contribue à l'apport en protéines et s'intègre facilement dans une alimentation quotidienne.",
    image: "/src/assets/images/soy_peptide_1783626591392.jpg"
  },
  {
    id: "spirulina",
    name: "Spirulina",
    category: "Compléments alimentaires",
    description: "Complément alimentaire à base de spiruline, une micro-algue naturellement riche en nutriments. Idéal pour accompagner une alimentation équilibrée et soutenir la vitalité au quotidien.",
    image: "/src/assets/images/spirulina_product_1783626783417.jpg"
  },
  {
    id: "prosta-booster",
    name: "Prosta Booster Capsules",
    category: "Compléments alimentaires",
    description: "Complément alimentaire destiné au bien-être masculin. Sa formule est conçue pour accompagner le confort et l'équilibre de l'organisme dans le cadre d'une hygiène de vie saine.",
    image: "/src/assets/images/prosta_booster_1783626795202.jpg"
  },
  {
    id: "longlu-capsules",
    name: "Longlu Capsules",
    category: "Compléments alimentaires",
    description: "Produit naturel formulé pour accompagner le bien-être général. Il s'intègre dans une routine quotidienne axée sur l'équilibre nutritionnel.",
    image: "/src/assets/images/longlu_capsules_1783626806035.jpg"
  },
  {
    id: "fohoway-massager",
    name: "FOHOWAY Blood Circulative Massager",
    category: "Appareils de santé",
    description: "Appareil de massage destiné au confort et à la relaxation. Il offre une expérience de massage agréable grâce à différentes fonctions adaptées à une utilisation à domicile.",
    image: "/src/assets/images/fohoway_massager_1783626815950.jpg"
  },
  {
    id: "cell-activate",
    name: "FOHERB «CELL ACTIVATOR»",
    category: "Appareils de santé",
    description: "Appareil d'activation cellulaire et de massage de haute technologie conçu pour stimuler l'énergie vitale du corps, détendre les muscles en profondeur et accompagner votre routine de bien-être physique au quotidien.",
    image: "/src/assets/images/cell_activator_refined_1783629129378.jpg"
  },
  {
    id: "rose-oligose",
    name: "Rose Oligose (Meigui Paste)",
    category: "Produits de bien-être",
    description: "Préparation à base d'ingrédients naturels inspirée de la tradition asiatique, appréciée pour son goût délicat et son intégration dans une routine bien-être.",
    image: "/src/assets/images/rose_oligose_1783627256203.jpg"
  },
  {
    id: "fohow-linchzhi",
    name: "FOHOW Linchzhi",
    category: "Compléments alimentaires",
    description: "Complément inspiré du champignon Lingzhi (Reishi), traditionnellement utilisé dans les pratiques de bien-être pour accompagner un mode de vie équilibré.",
    image: "/src/assets/images/fohow_linchzhi_1783627271334.jpg"
  },
  {
    id: "foherb-vagina-gel",
    name: "FOHERB Vagina Cleansing Gel",
    category: "Hygiène et soins",
    description: "Gel d'hygiène intime féminin de haute qualité conçu pour purifier, apaiser et préserver l'équilibre naturel de la zone intime au quotidien.",
    image: "/src/assets/images/vagina_cleansing_gel_1783627287570.jpg"
  },
  {
    id: "foherb-gel",
    name: "FOHERB Antibacterial Gel",
    category: "Hygiène et soins",
    description: "Gel d'hygiène destiné aux soins de la peau et à la protection quotidienne. Sa formule de haute technologie procure une sensation de fraîcheur, de propreté et de confort optimal.",
    image: "/src/assets/images/antibacterial_gel_1783628290003.jpg"
  },
  {
    id: "sanqing-liquid",
    name: "FOHOW Sanqing Oral Liquid",
    category: "Compléments alimentaires",
    description: "Complément liquide haut de gamme formulé à base d'extraits naturels de plantes selon les traditions ancestrales. Conçu pour purifier, harmoniser et accompagner votre routine bien-être.",
    image: "/src/assets/images/sanqing_liquid_1783628326225.jpg"
  },
  {
    id: "haizao-hai",
    name: "FOHOW Haizao Gai Plus",
    category: "Compléments alimentaires",
    description: "Complément naturel riche en calcium d'algues marines hautement bio-disponible, formulé pour soutenir la structure osseuse, la vitalité et l'équilibre minéral au quotidien.",
    image: "/src/assets/images/haizao_gai_1783628301230.jpg"
  },
  {
    id: "guifei-bao",
    name: "Guifei Bao",
    category: "Hygiène et soins",
    description: "Produit de soin traditionnel d'exception dédié à l'hygiène et au bien-être intime féminin, favorisant le confort, la pureté et l'harmonie naturelle.",
    image: "/src/assets/images/guifei_bao_1783628314663.jpg"
  },
  {
    id: "dasuan-fohow",
    name: "FOHOW Garlic Softgel (Dasuan Fohow)",
    category: "Compléments alimentaires",
    description: "Complément de haute technologie à base d'extraits d'ail (Dasuan), encapsulé pour conserver tous les principes actifs essentiels de l'ail sans odeur désagréable. Contribue au soutien de la vitalité et du bien-être cardiovasculaire au quotidien.",
    image: "/src/assets/images/dasuan_fohow_1783628588478.jpg"
  },
  {
    id: "fohow-oral-liquid",
    name: "FOHOW Oral Liquid (Elixir Phénix)",
    category: "Compléments alimentaires",
    description: "L'élixir légendaire de Fohow à base de Cordyceps sinensis sauvage de haute montagne et d'ingrédients naturels traditionnels d'Asie. Un puissant tonique naturel formulé pour renforcer l'énergie vitale (Qi), soutenir les défenses de l'organisme et accompagner votre récupération physique.",
    image: "/src/assets/images/fohow_oral_liquid_1783628603907.jpg"
  },
  {
    id: "cordyceps-coffee",
    name: "FOHERB Cordyceps & Collagen Instant Coffee",
    category: "Boissons fonctionnelles",
    description: "Une délicieuse boisson instantanée alliant le plaisir raffiné d'un café de qualité supérieure aux bienfaits exceptionnels du Cordyceps et du collagène. Parfait pour commencer la journée avec tonus tout en prenant soin de votre peau, de vos articulations et de votre vitalité générale.",
    image: "/src/assets/images/cordyceps_coffee_1783628618086.jpg"
  },
  {
    id: "liuwei-cha",
    name: "FOHOW Liuwei Cha (Thé aux Six Saveurs)",
    category: "Produits de bien-être",
    description: "Une infusion d'exception composée de six plantes traditionnelles asiatiques, sélectionnées avec soin pour harmoniser l'énergie interne. Une boisson douce, digestive et apaisante, idéale pour accompagner vos moments de détente et purifier l'organisme au quotidien.",
    image: "/src/assets/images/liuwei_cha_1783628635814.jpg"
  }
];

export const REVIEWS: Review[] = [];
