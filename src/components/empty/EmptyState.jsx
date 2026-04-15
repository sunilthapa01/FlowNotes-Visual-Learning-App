import { motion } from 'framer-motion'

export default function EmptyState({ onCreateNote }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center h-full gap-6 px-8"
    >
      {/* Lottie-style SVG animation */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(79,142,247,0.15), rgba(155,93,229,0.15), rgba(0,212,255,0.15), rgba(79,142,247,0.15))',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Animated notebook */}
            <motion.rect
              x="18" y="15" width="58" height="72" rx="6"
              fill="rgba(79,142,247,0.12)"
              stroke="rgba(79,142,247,0.5)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.rect
              x="14" y="18" width="58" height="72" rx="6"
              fill="rgba(18,22,36,0.9)"
              stroke="rgba(79,142,247,0.6)"
              strokeWidth="1.5"
            />
            {/* Lines */}
            {[32, 44, 56, 68].map((y, i) => (
              <motion.line
                key={i}
                x1="26" y1={y} x2={i < 2 ? 58 : 48} y2={y}
                stroke="rgba(160,168,184,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.15, ease: 'easeOut' }}
              />
            ))}
            {/* Plus icon */}
            <motion.circle
              cx="72" cy="72" r="14"
              fill="rgba(79,142,247,0.9)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 1.8, stiffness: 200 }}
            />
            <motion.path
              d="M72 65 L72 79 M65 72 L79 72"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 2 }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-[var(--text-primary)]"
        >
          No FlowNotes Yet
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed"
        >
          Start creating your first FlowNote — map ideas visually and supercharge your thinking.
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05, boxShadow: 'var(--glow-blue)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onCreateNote}
        className="px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
        style={{
          background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)',
        }}
      >
        + Create First FlowNote
      </motion.button>
    </motion.div>
  )
}
