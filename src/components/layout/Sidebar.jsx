import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import {
  Zap, Plus, FileText, Hash, Star,
  ChevronRight, Search, GripVertical
} from 'lucide-react'

const TAG_COLORS = {
  design: '#4F8EF7',
  ui: '#00D4FF',
  dev: '#00F5A0',
  api: '#9B5DE5',
  ux: '#FF6B6B',
  research: '#FFB347',
  strategy: '#9B5DE5',
  product: '#4F8EF7',
}

export default function Sidebar({ activeNote, onSelectNote, onCreateNote, notes, searchQuery, onSearchChange }) {
  const sidebarRef = useRef(null)
  const listRef = useRef(null)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    // GSAP slide-in on mount
    gsap.fromTo(
      sidebarRef.current,
      { x: -280, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.1 }
    )

    // Stagger note cards
    const cards = listRef.current?.querySelectorAll('.note-card')
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.5 }
      )
    }
  }, [])

  return (
    <div
      ref={sidebarRef}
      className="relative z-40 h-full flex flex-col w-64 xl:w-72 glass border-r border-[var(--border-subtle)]"
      style={{ opacity: 0 }}
    >
      {/* Logo Section */}
      <div className="px-5 py-4 flex items-center gap-2.5">
        <motion.div
          whileHover={{ rotate: 20, scale: 1.1 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
        >
          <Zap size={16} className="text-white" />
        </motion.div>
        <div>
          <span className="text-sm font-bold gradient-text-blue block">FlowNotes</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Workspace</span>
        </div>
      </div>

      {/* Search Notes (Migrated from Navbar) */}
      <div className="px-4 py-2">
        <div className="relative group">
          <div className={`absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity duration-300 ${searchFocused ? 'opacity-100' : 'opacity-0'}`} />
          <Search
            size={14}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${searchFocused ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search flows..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-strong border border-white/5 outline-none focus:border-blue-500/30 transition-all duration-300 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Create button */}
      <div className="px-4 pt-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(79,142,247,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
          style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
        >
          <Plus size={15} />
          Create New Note
        </motion.button>
      </div>

      {/* Section label */}
      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">My FlowNotes</span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-md font-mono"
          style={{ background: 'rgba(79,142,247,0.15)', color: '#4F8EF7' }}
        >
          {notes?.length || 0}
        </span>
      </div>

      {/* Notes list */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5"
      >
        {notes?.map((note) => {
          const isActive = activeNote?.id === note.id
          return (
            <motion.div
              key={note.id}
              className="note-card"
              whileHover={{
                scale: 1.015,
                x: 3,
              }}
              onClick={() => onSelectNote(note)}
            >
              <div
                className="relative group rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(79,142,247,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  border: isActive
                    ? '1px solid rgba(79,142,247,0.35)'
                    : '1px solid transparent',
                  boxShadow: isActive ? '0 0 16px rgba(79,142,247,0.15)' : 'none',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <FileText
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: isActive ? '#4F8EF7' : 'var(--text-muted)' }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                      >
                        {note.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                            style={{
                              background: `${TAG_COLORS[tag] || '#4F8EF7'}18`,
                              color: TAG_COLORS[tag] || '#4F8EF7',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-0.5">
                          <Hash size={10} />
                          {note.nodes?.length ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {note.starred && <Star size={11} fill="#FFB347" color="#FFB347" />}
                    <ChevronRight size={12} className="text-[var(--text-muted)]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom user section */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)' }}
          >
            SN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">Sunil</p>
            <p className="text-xs text-[var(--text-muted)]">Pro Plan</p>
          </div>
          <GripVertical size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>
    </div>
  )
}
