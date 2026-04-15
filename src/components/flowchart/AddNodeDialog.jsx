import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Play, Cpu, HelpCircle, Square,
  X, Plus, Sparkles, Type, AlignLeft
} from 'lucide-react'

const TYPE_ICONS = {
  start:    Play,
  process:  Cpu,
  decision: HelpCircle,
  end:      Square,
}

// onClose  → called when dialog should close
// catalogue → array of node type definitions (for display only)
export default function AddNodeDialog({ open, onClose, catalogue }) {
  const [selectedType, setSelectedType] = useState('process')
  const [title, setTitle]               = useState('')
  const [desc,  setDesc]                = useState('')
  const [step,  setStep]                = useState(1)

  const activeCat  = catalogue.find((c) => c.type === selectedType)
  const ActiveIcon = TYPE_ICONS[selectedType] || Cpu

  const resetAndClose = () => {
    onClose()
    setTimeout(() => { setStep(1); setTitle(''); setDesc('') }, 300)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          />
        </Dialog.Overlay>

        {/* Panel */}
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0,   scale: 0.88,  y: 24 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md outline-none"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10,14,28,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 40px rgba(79,142,247,0.08)',
                backdropFilter: 'blur(30px)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
                  >
                    <Plus size={15} className="text-white" />
                  </div>
                  <div>
                    <Dialog.Title className="text-sm font-bold text-[var(--text-primary)]">
                      {step === 1 ? 'Choose Node Type' : 'Configure Node'}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-[var(--text-muted)]">
                      {step === 1
                        ? 'Select the block type to add to your canvas'
                        : 'Give your node a title and description'}
                    </Dialog.Description>
                  </div>
                </div>
                <button
                  onClick={resetAndClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold transition-all"
                        style={{
                          background: step >= s ? '#4F8EF7' : 'rgba(255,255,255,0.08)',
                          color: step >= s ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        {s}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: step >= s ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                      >
                        {s === 1 ? 'Type' : 'Details'}
                      </span>
                      {s < 2 && (
                        <div
                          className="w-8 h-0.5 rounded-full mx-1"
                          style={{ background: step > 1 ? '#4F8EF7' : 'rgba(255,255,255,0.08)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <AnimatePresence mode="wait">

                  {/* Step 1 — Type grid */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0,   x: -16 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {catalogue.map((cat) => {
                        const Icon   = TYPE_ICONS[cat.type] || Cpu
                        const active = selectedType === cat.type
                        return (
                          <motion.button
                            key={cat.type}
                            onClick={() => setSelectedType(cat.type)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative flex flex-col gap-2 p-4 rounded-2xl text-left cursor-pointer overflow-hidden transition-all"
                            style={{
                              background: active ? `${cat.color}14` : 'rgba(255,255,255,0.03)',
                              border: active
                                ? `1.5px solid ${cat.color}60`
                                : '1.5px solid rgba(255,255,255,0.07)',
                              boxShadow: active ? `0 0 20px ${cat.color}20` : 'none',
                            }}
                          >
                            {/* Active bg glow */}
                            {active && (
                              <motion.div
                                layoutId="activeNodeTypeBg"
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background: `radial-gradient(ellipse at 20% 30%, ${cat.color}18 0%, transparent 65%)`,
                                }}
                              />
                            )}

                            <div className="flex items-center justify-between relative z-10">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{
                                  background: active ? `${cat.color}22` : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${active ? cat.color + '40' : 'rgba(255,255,255,0.08)'}`,
                                }}
                              >
                                <Icon size={16} style={{ color: cat.color }} />
                              </div>
                              {active && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-4 h-4 rounded-full flex items-center justify-center"
                                  style={{ background: cat.color }}
                                >
                                  <Sparkles size={8} className="text-black" />
                                </motion.div>
                              )}
                            </div>

                            <div className="relative z-10">
                              <p
                                className="text-sm font-semibold"
                                style={{ color: active ? cat.color : 'var(--text-primary)' }}
                              >
                                {cat.label}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {cat.description}
                              </p>
                            </div>
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}

                  {/* Step 2 — Details form */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0,   x: 16 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Selected type preview */}
                      <div
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          background: `${activeCat.color}10`,
                          border: `1px solid ${activeCat.color}30`,
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${activeCat.color}20` }}
                        >
                          <ActiveIcon size={15} style={{ color: activeCat.color }} />
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: activeCat.color }}>
                            {activeCat.label} Node
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {activeCat.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="ml-auto text-xs cursor-pointer hover:underline"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Change
                        </button>
                      </div>

                      {/* Title input */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          <Type size={10} />
                          Node Title
                        </label>
                        <input
                          autoFocus
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={activeCat.label}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.09)',
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `1px solid ${activeCat.color}60`
                            e.target.style.boxShadow = `0 0 10px ${activeCat.color}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.border = '1px solid rgba(255,255,255,0.09)'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                      </div>

                      {/* Description textarea */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          <AlignLeft size={10} />
                          Description
                        </label>
                        <textarea
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          placeholder="Brief description..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] leading-relaxed"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.09)',
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `1px solid ${activeCat.color}60`
                            e.target.style.boxShadow = `0 0 10px ${activeCat.color}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.border = '1px solid rgba(255,255,255,0.09)'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <button
                  onClick={step === 1 ? resetAndClose : () => setStep(1)}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {step === 1 ? 'Cancel' : '← Back'}
                </button>

                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(79,142,247,0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => step === 1 ? setStep(2) : resetAndClose()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
                  style={{
                    background: step === 2 && activeCat
                      ? `linear-gradient(135deg, ${activeCat.color}cc, ${activeCat.color}88)`
                      : 'linear-gradient(135deg, #4F8EF7, #9B5DE5)',
                  }}
                >
                  {step === 1 ? 'Next →' : <><Plus size={14} /> Add Node</>}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
