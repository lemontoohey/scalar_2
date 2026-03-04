import { motion } from 'framer-motion'
import { SPECIMEN_DATA } from '@/lib/specimens'
import SpecimenCard from './SpecimenCard'

export default function CollectionGrid({ category, onClose }: { category: 'organic' | 'inorganic', onClose: () => void }) {
  const dataset = SPECIMEN_DATA.filter((s) => s.category === category);

  return (
    <motion.div 
      className="absolute inset-0 z-[70] bg-[#000502]/95 backdrop-blur-xl w-full h-screen overflow-y-auto pt-24 pb-16 px-6 sm:px-12 overscroll-contain"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#FCFBF8]/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-[#FCFBF8] uppercase font-['var(--font-archivo)']">
            {category} <span className="text-[#FCFBF8]/30">COLLECTION</span>
          </h2>
          <button 
            data-thermal-hover="true"
            onClick={onClose} 
            className="text-[10px] tracking-widest text-[#FCFBF8]/50 hover:text-white uppercase font-mono transition-colors pb-2"
          >
            [Close_Terminal]
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {dataset.map((specimen, idx) => (
             <motion.div 
               key={specimen.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.4, delay: idx * 0.03, ease: 'easeOut' }}
             >
                <SpecimenCard data={specimen} />
             </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
