import { motion } from 'framer-motion'
import { Play, Square, HelpCircle, Circle, Cpu } from 'lucide-react'

const NODE_CONFIGS = {
  start: {
    icon: Play,
    label: 'START',
    gradient: 'linear-gradient(135deg, rgba(0,245,160,0.15), rgba(0,212,255,0.08))',
    border: 'rgba(0,245,160,0.4)',
    glow: '0 0 16px rgba(0,245,160,0.25), 0 4px 20px rgba(0,0,0,0.4)',
    glowHover: '0 0 28px rgba(0,245,160,0.45), 0 8px 30px rgba(0,0,0,0.5)',
    iconColor: '#00F5A0',
    labelColor: '#00F5A0',
    badgeBg: 'rgba(0,245,160,0.12)',
    badgeColor: '#00F5A0',
    shape: 'full',
  },
  process: {
    icon: Cpu,
    label: 'PROCESS',
    gradient: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(0,212,255,0.08))',
    border: 'rgba(79,142,247,0.4)',
    glow: '0 0 16px rgba(79,142,247,0.25), 0 4px 20px rgba(0,0,0,0.4)',
    glowHover: '0 0 28px rgba(79,142,247,0.45), 0 8px 30px rgba(0,0,0,0.5)',
    iconColor: '#4F8EF7',
    labelColor: '#4F8EF7',
    badgeBg: 'rgba(79,142,247,0.12)',
    badgeColor: '#4F8EF7',
    shape: 'rect',
  },
  decision: {
    icon: HelpCircle,
    label: 'DECISION',
    gradient: 'linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,107,107,0.08))',
    border: 'rgba(255,179,71,0.4)',
    glow: '0 0 16px rgba(255,179,71,0.25), 0 4px 20px rgba(0,0,0,0.4)',
    glowHover: '0 0 28px rgba(255,179,71,0.45), 0 8px 30px rgba(0,0,0,0.5)',
    iconColor: '#FFB347',
    labelColor: '#FFB347',
    badgeBg: 'rgba(255,179,71,0.12)',
    badgeColor: '#FFB347',
    shape: 'diamond',
  },
  end: {
    icon: Square,
    label: 'END',
    gradient: 'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(155,93,229,0.08))',
    border: 'rgba(255,107,107,0.4)',
    glow: '0 0 16px rgba(255,107,107,0.25), 0 4px 20px rgba(0,0,0,0.4)',
    glowHover: '0 0 28px rgba(255,107,107,0.45), 0 8px 30px rgba(0,0,0,0.5)',
    iconColor: '#FF6B6B',
    labelColor: '#FF6B6B',
    badgeBg: 'rgba(255,107,107,0.12)',
    badgeColor: '#FF6B6B',
    shape: 'full',
  },
}

export default function FlowNode({ type, title, description, isDragging }) {
  const config = NODE_CONFIGS[type] || NODE_CONFIGS.process
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{
        scale: 1.06,
        zIndex: 20,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      animate={isDragging ? { scale: 1.08, zIndex: 30 } : {}}
      className="relative select-none"
      style={{ width: 180 }}
    >
      {/* Outer glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          boxShadow: config.glowHover,
          border: `1px solid ${config.border}`,
          borderRadius: '16px',
        }}
      />

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: config.gradient,
          border: `1px solid ${config.border}`,
          boxShadow: isDragging ? config.glowHover : config.glow,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${config.iconColor}, transparent)` }}
        />

        <div className="px-3.5 py-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: config.badgeBg }}
            >
              <Icon size={9} style={{ color: config.iconColor }} />
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: config.labelColor, fontSize: '9px' }}
              >
                {config.label}
              </span>
            </div>

            {/* Connection dots */}
            <div className="flex gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: config.iconColor, opacity: 0.6 }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: config.iconColor, opacity: 0.3 }}
              />
            </div>
          </div>

          {/* Title */}
          <p
            className="text-sm font-semibold leading-snug mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </p>

          {/* Description */}
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </p>
        </div>

        {/* Bottom connector ports */}
        <div className="flex justify-center pb-1.5">
          <div
            className="w-3 h-1.5 rounded-full"
            style={{ background: config.iconColor, opacity: 0.35 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
