export type Specimen = { 
  id: string; 
  category: 'organic' | 'inorganic'; 
  code: string; 
  name: string; // Marketing name, but we swapped it to hold Chemical Name previously. User said "use codes and chemical names instead and no mention of secret menu". 
                // Currently 'name' holds the Chemical Name in my file. I'll keep it that way.
  chemicalName: string; // Redundant if name is chemical name, but good for safety.
  hex: string; 
  description: string; // New field
};

export const SPECIMEN_DATA: Specimen[] = [
  // ORGANIC
  { 
    id: '1', 
    category: 'organic', 
    code: 'PV23', 
    name: 'DIOXAZINE VIOLET', 
    chemicalName: 'DIOXAZINE VIOLET', 
    hex: '#31145A',
    description: 'The deepest transparent violet. For "Black-Out" glazes with a cold violet glow.'
  },
  { 
    id: '2', 
    category: 'organic', 
    code: 'PG7', 
    name: 'PHTHALOCYANINE GREEN', 
    chemicalName: 'PHTHALOCYANINE GREEN', 
    hex: '#005C3A',
    description: 'The "Cool Green." Essential for clean teals, icy emeralds, and deep forest tones.'
  },
  { 
    id: '3', 
    category: 'organic', 
    code: 'PR179', 
    name: 'PERYLENE MAROON', 
    chemicalName: 'PERYLENE MAROON', 
    hex: '#591118',
    description: 'High transparency maroon with excellent lightfastness. Ideal for glazing.' // Generated
  },
  { 
    id: '4', 
    category: 'organic', 
    code: 'PY128', 
    name: 'AZO CONDENSATION YELLOW', 
    chemicalName: 'AZO CONDENSATION YELLOW', 
    hex: '#EBE100',
    description: 'Transparent, high-performance yellow with excellent weather stability.' // Generated
  },
  { 
    id: '5', 
    category: 'organic', 
    code: 'PB15:3', 
    name: 'PHTHALOCYANINE BLUE GS', 
    chemicalName: 'PHTHALOCYANINE BLUE GS', 
    hex: '#004C8A',
    description: 'The foundation for all cool glazes. High transparency.'
  },
  { 
    id: '6', 
    category: 'organic', 
    code: 'PB16', 
    name: 'METAL-FREE PHTHALO', 
    chemicalName: 'METAL-FREE PHTHALO', 
    hex: '#005B66',
    description: 'The "Glowing Sky" blue. Higher light reflection than 15:3.'
  },
  { 
    id: '7', 
    category: 'organic', 
    code: 'PB15:6', 
    name: 'PHTHALOCYANINE BLUE RS', 
    chemicalName: 'PHTHALOCYANINE BLUE RS', 
    hex: '#0E2254',
    description: 'A deep, red-shade blue for clean violet transitions.'
  },
  { 
    id: '8', 
    category: 'organic', 
    code: 'PBk31', 
    name: 'PERYLENE GREEN', 
    chemicalName: 'PERYLENE GREEN', 
    hex: '#0C2B1D',
    description: 'A "Transparent Black" with green/violet undertones. Deep depth.'
  },
  { 
    id: '9', 
    category: 'organic', 
    code: 'PBk32', 
    name: 'PERYLENE BLACK', 
    chemicalName: 'PERYLENE BLACK', 
    hex: '#131714',
    description: 'Ultra-transparent with a ghostly green undertone.'
  },
  { 
    id: '10', 
    category: 'organic', 
    code: 'PR264', 
    name: 'PYRROLO PYRROLE RUBY', 
    chemicalName: 'PYRROLO PYRROLE RUBY', 
    hex: '#8A001A',
    description: 'Deep, glass-like red. Essential for the "Rothko" maroon.'
  },
  { 
    id: '11', 
    category: 'organic', 
    code: 'PO71', 
    name: 'TRANSPARENT PYRROLE ORANGE', 
    chemicalName: 'TRANSPARENT PYRROLE ORANGE', 
    hex: '#E63900',
    description: 'Highest saturation orange. Zero cloudiness in layers.'
  },
  { 
    id: '12', 
    category: 'organic', 
    code: 'PY150', 
    name: 'NICKEL AZO YELLOW', 
    chemicalName: 'NICKEL AZO YELLOW', 
    hex: '#D98700',
    description: 'Turns from "mustard" to "liquid gold" as you layer it.'
  },
  { 
    id: '13', 
    category: 'organic', 
    code: 'PR254', 
    name: 'PYRROLE RED', 
    chemicalName: 'PYRROLE RED', 
    hex: '#CC0000',
    description: 'The cleanest, most "neutral" red for 50-layer saturation.'
  },
  { 
    id: '14', 
    category: 'organic', 
    code: 'PR122', 
    name: 'QUINACRIDONE MAGENTA', 
    chemicalName: 'QUINACRIDONE MAGENTA', 
    hex: '#D1005D',
    description: 'Essential for violets and "electric" pink vibrations.'
  },
  { 
    id: '15', 
    category: 'organic', 
    code: 'PV19', 
    name: 'QUINACRIDONE VIOLET', 
    chemicalName: 'QUINACRIDONE VIOLET', 
    hex: '#7A003C',
    description: 'Creates "clean" darks. Pushes the violet spectrum.'
  },
  { 
    id: '16', 
    category: 'organic', 
    code: 'PG36', 
    name: 'PHTHALOCYANINE GREEN YS', 
    chemicalName: 'PHTHALOCYANINE GREEN YS', 
    hex: '#008A2B',
    description: 'An "electric" green that feels radioactive in glazes.'
  },
  { 
    id: '17', 
    category: 'organic', 
    code: 'PB60', 
    name: 'INDANTHRONE BLUE', 
    chemicalName: 'INDANTHRONE BLUE', 
    hex: '#0F1736',
    description: 'Deep, reddish-blue, distinct from Phthalo. Excellent lightfastness.' // Generated
  },

  // INORGANIC
  { 
    id: '18', 
    category: 'inorganic', 
    code: 'PY184', 
    name: 'BISMUTH VANADATE', 
    chemicalName: 'BISMUTH VANADATE', 
    hex: '#FFD900',
    description: 'The cleanest, high-luminosity inorganic yellow. The "Boutique King" of yellows.'
  },
  { 
    id: '19', 
    category: 'inorganic', 
    code: 'PBk27', 
    name: 'IRON COBALT CHROMITE', 
    chemicalName: 'IRON COBALT CHROMITE', 
    hex: '#0A0D14',
    description: 'A high-jetness spinel black with an icy blue undertone. Zero brown-drift.'
  },
  { 
    id: '20', 
    category: 'inorganic', 
    code: 'PBr7', 
    name: 'NATURAL IRON OXIDE', 
    chemicalName: 'NATURAL IRON OXIDE', 
    hex: '#4A2A18',
    description: 'Natural Burnt Umber. For granulating, sedimentary textures and "wood-smoke" depth.'
  },
  { 
    id: '21', 
    category: 'inorganic', 
    code: 'PR233', 
    name: 'CHROME TIN PINK', 
    chemicalName: 'CHROME TIN PINK', 
    hex: '#C2878F',
    description: '"Potter\'s Pink." A dusty, sophisticated architectural pink impossible to mix using organics.'
  },
  { 
    id: '22', 
    category: 'inorganic', 
    code: 'PW6 (NANO)', 
    name: 'TITANIUM DIOXIDE NANO', 
    chemicalName: 'TITANIUM DIOXIDE NANO', 
    hex: '#E6E9F0',
    description: '"Transparent White" used to create misty, hazy veils.'
  },
  { 
    id: '23', 
    category: 'inorganic', 
    code: 'PR101', 
    name: 'SYNTHETIC IRON OXIDE RED', 
    chemicalName: 'SYNTHETIC IRON OXIDE RED', 
    hex: '#6E220D',
    description: 'A "Nano-Rust" that looks like glowing mahogany wood.'
  },
  { 
    id: '24', 
    category: 'inorganic', 
    code: 'PY42', 
    name: 'SYNTHETIC IRON OXIDE YELLOW', 
    chemicalName: 'SYNTHETIC IRON OXIDE YELLOW', 
    hex: '#B36B00',
    description: 'Needle-shaped crystals for high-transparency gold glazes.'
  },
  { 
    id: '25', 
    category: 'inorganic', 
    code: 'PW5', 
    name: 'LITHOPONE', 
    chemicalName: 'LITHOPONE', 
    hex: '#F0F0E6',
    description: 'Our primary archival transparent white mixer.'
  },
  { 
    id: '26', 
    category: 'inorganic', 
    code: 'PW7', 
    name: 'ZINC SULFIDE', 
    chemicalName: 'ZINC SULFIDE', 
    hex: '#F5F7FA',
    description: 'Pure Zinc Sulfide. Optical backlighting/glow.'
  },
  { 
    id: '27', 
    category: 'inorganic', 
    code: 'PW6', 
    name: 'TITANIUM DIOXIDE', 
    chemicalName: 'TITANIUM DIOXIDE', 
    hex: '#FFFFFF',
    description: 'Automotive-grade TiO2 for clean, opaque tints.'
  },
  { 
    id: '28', 
    category: 'inorganic', 
    code: 'PB36', 
    name: 'COBALT CHROMITE BLUE', 
    chemicalName: 'COBALT CHROMITE BLUE', 
    hex: '#1F5966',
    description: 'Targeting architectural heat management.'
  },
  { 
    id: '29', 
    category: 'inorganic', 
    code: 'PB28', 
    name: 'COBALT ALUMINATE BLUE', 
    chemicalName: 'COBALT ALUMINATE BLUE', 
    hex: '#143085',
    description: 'The industrial standard for Cobalt Blue.'
  },
  { 
    id: '30', 
    category: 'inorganic', 
    code: 'PY53', 
    name: 'NICKEL ANTIMONY TITANIUM', 
    chemicalName: 'NICKEL ANTIMONY TITANIUM', 
    hex: '#E0DB6B',
    description: 'A high-stability, "neon" yellow.'
  },
  { 
    id: '31', 
    category: 'inorganic', 
    code: 'PG17', 
    name: 'CHROMIUM OXIDE GREEN', 
    chemicalName: 'CHROMIUM OXIDE GREEN', 
    hex: '#475C3B',
    description: 'Low-abrasion, high-stability green.'
  },
  { 
    id: '32', 
    category: 'inorganic', 
    code: 'PV15', 
    name: 'ULTRAMARINE VIOLET', 
    chemicalName: 'ULTRAMARINE VIOLET', 
    hex: '#3B2261',
    description: 'High-purity specialist spectral violet.'
  },
  { 
    id: '33', 
    category: 'inorganic', 
    code: 'PR259', 
    name: 'ULTRAMARINE PINK', 
    chemicalName: 'ULTRAMARINE PINK', 
    hex: '#C77B95',
    description: 'High-purity specialist spectral pink.'
  },
  { 
    id: '34', 
    category: 'inorganic', 
    code: 'MAGNETITE', 
    name: 'MAGNETITE BLACK IRON', 
    chemicalName: 'MAGNETITE BLACK IRON', 
    hex: '#101114',
    description: 'High-jetness black with a cold, blue undertone.'
  },
  { 
    id: '35', 
    category: 'inorganic', 
    code: 'PG50', 
    name: 'COBALT TITANATE GREEN', 
    chemicalName: 'COBALT TITANATE GREEN', 
    hex: '#125442',
    description: 'Bright, semi-opaque teal green with outstanding durability.' // Generated
  },
];
