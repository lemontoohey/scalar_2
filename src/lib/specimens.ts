export type Specimen = { id: string; category: 'organic' | 'inorganic'; code: string; name: string; chemicalName: string; hex: string; };

export const SPECIMEN_DATA: Specimen[] = [
  // ORGANIC
  { id: '1', category: 'organic', code: 'PV23', name: 'DIOXAZINE VIOLET', chemicalName: 'DIOXAZINE VIOLET', hex: '#2A0E45' }, // Adjusted hex slightly richer
  { id: '2', category: 'organic', code: 'PG7', name: 'PHTHALOCYANINE GREEN', chemicalName: 'PHTHALOCYANINE GREEN', hex: '#004225' },
  { id: '3', category: 'organic', code: 'PR179', name: 'PERYLENE MAROON', chemicalName: 'PERYLENE MAROON', hex: '#4D0F14' },
  { id: '4', category: 'organic', code: 'PY128', name: 'AZO CONDENSATION YELLOW', chemicalName: 'AZO CONDENSATION YELLOW', hex: '#F2F500' },
  { id: '5', category: 'organic', code: 'PB15:3', name: 'PHTHALOCYANINE BLUE GS', chemicalName: 'PHTHALOCYANINE BLUE GS', hex: '#00588A' },
  { id: '6', category: 'organic', code: 'PB16', name: 'METAL-FREE PHTHALO', chemicalName: 'METAL-FREE PHTHALO', hex: '#007075' },
  { id: '7', category: 'organic', code: 'PB15:6', name: 'PHTHALOCYANINE BLUE RS', chemicalName: 'PHTHALOCYANINE BLUE RS', hex: '#0E2245' },
  { id: '8', category: 'organic', code: 'PBk31', name: 'PERYLENE BLACK', chemicalName: 'PERYLENE BLACK', hex: '#080C08' },
  { id: '9', category: 'organic', code: 'PBk32', name: 'PERYLENE GREEN', chemicalName: 'PERYLENE GREEN', hex: '#07120A' },
  { id: '10', category: 'organic', code: 'PR264', name: 'PYRROLO PYRROLE RUBY', chemicalName: 'PYRROLO PYRROLE RUBY', hex: '#7A0012' },
  { id: '11', category: 'organic', code: 'PO71', name: 'TRANSPARENT PYRROLE ORANGE', chemicalName: 'TRANSPARENT PYRROLE ORANGE', hex: '#D63300' },
  { id: '12', category: 'organic', code: 'PY150', name: 'NICKEL AZO YELLOW', chemicalName: 'NICKEL AZO YELLOW', hex: '#CC8C00' },
  { id: '13', category: 'organic', code: 'PR254', name: 'PYRROLE RED', chemicalName: 'PYRROLE RED', hex: '#B80000' },
  { id: '14', category: 'organic', code: 'PR122', name: 'QUINACRIDONE MAGENTA', chemicalName: 'QUINACRIDONE MAGENTA', hex: '#BD0059' },
  { id: '15', category: 'organic', code: 'PV19', name: 'QUINACRIDONE VIOLET', chemicalName: 'QUINACRIDONE VIOLET', hex: '#5E002B' },
  { id: '16', category: 'organic', code: 'PG36', name: 'PHTHALOCYANINE GREEN YS', chemicalName: 'PHTHALOCYANINE GREEN YS', hex: '#008F29' },
  { id: '17', category: 'organic', code: 'PB60', name: 'INDANTHRONE BLUE', chemicalName: 'INDANTHRONE BLUE', hex: '#0A1129' },

  // INORGANIC
  { id: '18', category: 'inorganic', code: 'PY184', name: 'BISMUTH VANADATE', chemicalName: 'BISMUTH VANADATE', hex: '#FFD700' },
  { id: '19', category: 'inorganic', code: 'PBk27', name: 'IRON COBALT CHROMITE', chemicalName: 'IRON COBALT CHROMITE', hex: '#050A14' },
  { id: '20', category: 'inorganic', code: 'PBr7', name: 'NATURAL IRON OXIDE', chemicalName: 'NATURAL IRON OXIDE', hex: '#3E2017' },
  { id: '21', category: 'inorganic', code: 'PR233', name: 'CHROME TIN PINK', chemicalName: 'CHROME TIN PINK', hex: '#D19BA3' },
  { id: '22', category: 'inorganic', code: 'PW6 (NANO)', name: 'TITANIUM DIOXIDE NANO', chemicalName: 'TITANIUM DIOXIDE NANO', hex: '#E0E4ED' },
  { id: '23', category: 'inorganic', code: 'PR101', name: 'SYNTHETIC IRON OXIDE RED', chemicalName: 'SYNTHETIC IRON OXIDE RED', hex: '#70230E' },
  { id: '24', category: 'inorganic', code: 'PY42', name: 'SYNTHETIC IRON OXIDE YELLOW', chemicalName: 'SYNTHETIC IRON OXIDE YELLOW', hex: '#A8680D' },
  { id: '25', category: 'inorganic', code: 'PW5', name: 'LITHOPONE', chemicalName: 'LITHOPONE', hex: '#F2F2D9' },
  { id: '26', category: 'inorganic', code: 'PW7', name: 'ZINC SULFIDE', chemicalName: 'ZINC SULFIDE', hex: '#F7F7F7' },
  { id: '27', category: 'inorganic', code: 'PW6', name: 'TITANIUM DIOXIDE', chemicalName: 'TITANIUM DIOXIDE', hex: '#FFFFFF' },
  { id: '28', category: 'inorganic', code: 'PB36', name: 'COBALT CHROMITE BLUE', chemicalName: 'COBALT CHROMITE BLUE', hex: '#005C66' },
  { id: '29', category: 'inorganic', code: 'PB28', name: 'COBALT ALUMINATE BLUE', chemicalName: 'COBALT ALUMINATE BLUE', hex: '#1C2C6B' },
  { id: '30', category: 'inorganic', code: 'PY53', name: 'NICKEL ANTIMONY TITANIUM', chemicalName: 'NICKEL ANTIMONY TITANIUM', hex: '#EBE68A' }, // More intense
  { id: '31', category: 'inorganic', code: 'PG17', name: 'CHROMIUM OXIDE GREEN', chemicalName: 'CHROMIUM OXIDE GREEN', hex: '#44593C' }, // More intense
  { id: '32', category: 'inorganic', code: 'PV15', name: 'ULTRAMARINE VIOLET', chemicalName: 'ULTRAMARINE VIOLET', hex: '#321C52' },
  { id: '33', category: 'inorganic', code: 'PR259', name: 'ULTRAMARINE PINK', chemicalName: 'ULTRAMARINE PINK', hex: '#B57D8F' },
  { id: '34', category: 'inorganic', code: 'MAGNETITE', name: 'MAGNETITE BLACK IRON', chemicalName: 'MAGNETITE BLACK IRON', hex: '#121212' },
  { id: '35', category: 'inorganic', code: 'PG50', name: 'COBALT TITANATE GREEN', chemicalName: 'COBALT TITANATE GREEN', hex: '#004029' },
];
