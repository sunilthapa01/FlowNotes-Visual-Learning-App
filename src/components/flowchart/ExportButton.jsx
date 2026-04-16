import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

export default function ExportButton({ onClick, disabled = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all
        cursor-pointer select-none border border-white/10
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
      `}
      style={{
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--text-primary)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Download size={14} className="text-[#4F8EF7]" />
      <span className="tracking-wide">Export</span>
    </motion.button>
  )
}
