import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import {
  Search, Sun, Moon, Bell, ChevronDown, Zap
} from 'lucide-react'

export default function Navbar() {
  const navRef = useRef(null)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  const notifications = [
    { id: 1, text: 'New node type available: Loop Node', time: '2m ago', dot: '#4F8EF7' },
    { id: 2, text: 'Your note "Project Alpha" was updated', time: '1h ago', dot: '#00D4FF' },
    { id: 3, text: 'FlowNotes v2.0 is now live! 🚀', time: '3h ago', dot: '#9B5DE5' },
  ]

  return (
    <nav
      ref={navRef}
      className="relative z-30 flex items-center justify-between px-6 h-14 glass border-b border-[var(--border-subtle)]"
      style={{ opacity: 0 }}
    >
      {/* Branding */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
        >
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold gradient-text-blue block leading-none">VisualBrain</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Pro Workspace</span>
        </div>
      </div>

      {/* Middle Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center relative cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell size={15} className="text-[var(--text-secondary)]" />
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: '#FF6B6B' }}
            />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-10 w-72 glass-strong rounded-2xl overflow-hidden z-50"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Notifications</span>
                </div>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                    <div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">{n.text}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(79,142,247,0.3)' }}
          className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-xl cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
          >
            SN
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-semibold tracking-wide">Sunil</span>
          <ChevronDown size={12} className="text-[var(--text-muted)]" />
        </motion.div>
      </div>
    </nav>
  )
}
