import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import {
  Search, Sun, Moon, Bell, ChevronDown, Zap
} from 'lucide-react'

export default function Navbar({ isDark, onThemeToggle }) {
  const navRef = useRef(null)
  const [searchFocused, setSearchFocused] = useState(false)
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
      className="relative z-30 flex items-center justify-between px-4 lg:px-6 h-14 glass border-b border-[var(--border-subtle)]"
      style={{ opacity: 0 }}
    >
      {/* Logo mark for mobile */}
      <div className="flex items-center gap-2 lg:hidden">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
        >
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold gradient-text-blue">FlowNotes</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-0 lg:ml-0">
        <motion.div
          animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
          className="relative"
        >
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search notes, nodes..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-300 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: searchFocused
                ? '1px solid rgba(79,142,247,0.6)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: searchFocused ? '0 0 12px rgba(79,142,247,0.2)' : 'none',
            }}
          />
        </motion.div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onThemeToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {isDark ? <Sun size={15} className="text-[var(--accent-cyan)]" /> : <Moon size={15} className="text-[var(--accent-blue)]" />}
        </motion.button>

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
          whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(79,142,247,0.4)' }}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
          >
            SN
          </div>
          <span className="hidden sm:block text-xs text-[var(--text-secondary)] font-medium">Sunil</span>
          <ChevronDown size={12} className="text-[var(--text-muted)] hidden sm:block" />
        </motion.div>
      </div>
    </nav>
  )
}
