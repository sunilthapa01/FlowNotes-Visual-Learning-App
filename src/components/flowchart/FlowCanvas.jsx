import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn, ZoomOut, Maximize2, Grid, Move,
  Plus, Trash2, MousePointer2, Sparkles
} from 'lucide-react'
import FlowNode from './FlowNode'
import AddNodeDialog from './AddNodeDialog'

// ─── Node type catalogue (UI only) ────────────────────────────────────
const NODE_TYPE_CATALOGUE = [
  { type: 'start',    label: 'Start',    color: '#00F5A0', description: 'Flow entry point'  },
  { type: 'process',  label: 'Process',  color: '#4F8EF7', description: 'Action or step'    },
  { type: 'decision', label: 'Decision', color: '#FFB347', description: 'Branch condition'   },
  { type: 'end',      label: 'End',      color: '#FF6B6B', description: 'Flow terminator'   },
]

// ─── Demo nodes for visual display ────────────────────────────────────
const DEMO_NODES = [
  { id: 'start-1',    type: 'start',    title: 'Start',               description: 'Entry point',               x: 120, y: 80  },
  { id: 'process-1',  type: 'process',  title: 'Gather Requirements', description: 'Collect user needs & specs', x: 360, y: 80  },
  { id: 'decision-1', type: 'decision', title: 'Feasible?',           description: 'Check technical constraints',x: 360, y: 260 },
  { id: 'process-2',  type: 'process',  title: 'Design & Prototype',  description: 'Create wireframes & mockups',x: 120, y: 420 },
  { id: 'process-3',  type: 'process',  title: 'Revise Scope',        description: 'Adjust requirements',       x: 600, y: 260 },
  { id: 'end-1',      type: 'end',      title: 'End',                 description: 'Project complete',          x: 120, y: 560 },
]

const DEMO_CONNECTIONS = [
  { from: 'start-1',    to: 'process-1'  },
  { from: 'process-1',  to: 'decision-1' },
  { from: 'decision-1', to: 'process-2',  label: 'Yes' },
  { from: 'decision-1', to: 'process-3',  label: 'No'  },
  { from: 'process-2',  to: 'end-1' },
]

const NODE_W = 180
const NODE_H = 85

export default function FlowCanvas({ activeNote }) {
  const canvasRef = useRef(null)

  // ── Node positions as state so drag updates re-render ─────────────
  const [nodes, setNodes]               = useState(DEMO_NODES)
  const [dragging, setDragging]         = useState(null)
  const [dragOffset, setDragOffset]     = useState({ x: 0, y: 0 })
  const [zoom, setZoom]                 = useState(1)
  const [dialogOpen, setDialogOpen]     = useState(false)
  const [hoveredType, setHoveredType]   = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const handleZoom = (dir) => setZoom((z) => Math.min(2, Math.max(0.3, z + dir * 0.1)))

  const getNodeById = useCallback((id) => nodes.find((n) => n.id === id), [nodes])

  // ── Drag handlers ─────────────────────────────────────────────────
  const handleMouseDown = (e, nodeId) => {
    e.preventDefault()
    e.stopPropagation()
    const node = nodes.find((n) => n.id === nodeId)
    const rect = canvasRef.current.getBoundingClientRect()
    setDragging(nodeId)
    setSelectedNode(nodeId)
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.x,
      y: (e.clientY - rect.top)  / zoom - node.y,
    })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom - dragOffset.x
    const y = (e.clientY - rect.top)  / zoom - dragOffset.y
    setNodes((prev) =>
      prev.map((n) => n.id === dragging ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n)
    )
  }, [dragging, zoom, dragOffset])

  const handleMouseUp = () => setDragging(null)

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden" style={{ minWidth: 0 }}>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border-subtle)] flex-shrink-0"
        style={{ background: 'rgba(8,11,20,0.65)', backdropFilter: 'blur(12px)' }}
      >
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {activeNote ? activeNote.title : 'Canvas'}
        </span>

        <span
          className="text-xs px-1.5 py-0.5 rounded-md font-mono"
          style={{ background: 'rgba(79,142,247,0.12)', color: '#4F8EF7' }}
        >
          {DEMO_NODES.length} nodes
        </span>

        <div className="flex items-center gap-1 ml-auto">
          {[
            { Icon: MousePointer2, tip: 'Select' },
            { Icon: Move,          tip: 'Pan'    },
            { Icon: Grid,          tip: 'Grid'   },
            { Icon: Maximize2,     tip: 'Fit',   action: () => setZoom(1) },
          ].map(({ Icon, tip, action }) => (
            <motion.button
              key={tip}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={tip}
              onClick={action}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Icon size={13} />
            </motion.button>
          ))}

          {/* Delete button — UI only (visible when a node is selected) */}
          <AnimatePresence>
            {selectedNode && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0,   opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Delete node"
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ml-1"
                style={{
                  background: 'rgba(255,107,107,0.12)',
                  border: '1px solid rgba(255,107,107,0.25)',
                  color: '#FF6B6B',
                }}
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 ml-2 glass rounded-lg overflow-hidden">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleZoom(-1)}
              className="w-7 h-7 flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomOut size={13} />
            </motion.button>
            <span className="text-xs font-mono text-[var(--text-muted)] px-1 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleZoom(1)}
              className="w-7 h-7 flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomIn size={13} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Canvas body ────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Node Types Side Panel (UI only) ──────────────────────────── */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0,   opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          className="flex-shrink-0 flex flex-col gap-1.5 py-4 px-2.5 border-r border-[var(--border-subtle)] z-10"
          style={{
            width: '130px',
            background: 'rgba(8,11,20,0.5)',
            backdropFilter: 'blur(14px)',
          }}
        >
          {/* Heading */}
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <Sparkles size={11} style={{ color: '#4F8EF7' }} />
            <span
              className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider"
              style={{ fontSize: '9px' }}
            >
              Node Types
            </span>
          </div>

          {/* Clickable node type cards */}
          {NODE_TYPE_CATALOGUE.map((cat) => (
            <motion.button
              key={cat.type}
              onHoverStart={() => setHoveredType(cat.type)}
              onHoverEnd={() => setHoveredType(null)}
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-left rounded-xl px-2.5 py-2.5 cursor-pointer relative overflow-hidden transition-all"
              style={{
                background: hoveredType === cat.type
                  ? `${cat.color}18`
                  : 'rgba(255,255,255,0.03)',
                border: hoveredType === cat.type
                  ? `1px solid ${cat.color}50`
                  : '1px solid rgba(255,255,255,0.07)',
                boxShadow: hoveredType === cat.type
                  ? `0 0 14px ${cat.color}20`
                  : 'none',
              }}
            >
              {/* Hover shimmer */}
              {hoveredType === cat.type && (
                <motion.div
                  layoutId="nodeTypeShimmer"
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${cat.color}15 0%, transparent 70%)`,
                  }}
                />
              )}

              <div className="flex items-center gap-2 relative z-10">
                <motion.div
                  animate={
                    hoveredType === cat.type
                      ? { scale: 1.25, boxShadow: `0 0 8px ${cat.color}` }
                      : { scale: 1,    boxShadow: 'none' }
                  }
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: hoveredType === cat.type ? cat.color : 'var(--text-secondary)' }}
                >
                  {cat.label}
                </span>
              </div>

              <p
                className="text-xs mt-1 leading-tight relative z-10"
                style={{ color: 'var(--text-muted)', fontSize: '10px' }}
              >
                {cat.description}
              </p>

              {/* "Click to add" hint on hover */}
              <AnimatePresence>
                {hoveredType === cat.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 mt-1.5 relative z-10"
                  >
                    <Plus size={9} style={{ color: cat.color }} />
                    <span style={{ color: cat.color, fontSize: '9px', fontWeight: 600 }}>
                      Click to add
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-[var(--border-subtle)]" />

          {/* Custom dialog trigger */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 14px rgba(79,142,247,0.3)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setDialogOpen(true)}
            className="w-full flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(155,93,229,0.12))',
              border: '1px solid rgba(79,142,247,0.25)',
            }}
          >
            <Plus size={15} style={{ color: '#4F8EF7' }} />
            <span className="text-xs font-semibold" style={{ color: '#4F8EF7', fontSize: '10px' }}>
              Custom
            </span>
          </motion.button>
        </motion.div>

        {/* ── Main canvas ───────────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden dot-grid select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => setSelectedNode(null)}
          style={{ background: 'rgba(8,11,20,0.4)', cursor: dragging ? 'grabbing' : 'default' }}
        >
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,11,20,0.55) 100%)',
            }}
          />

          {/* Scaled content */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            {/* SVG Connectors */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <marker id="arrowBlue"   markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(79,142,247,0.7)" />
                </marker>
                <marker id="arrowGreen"  markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(0,245,160,0.7)" />
                </marker>
                <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,179,71,0.7)" />
                </marker>
              </defs>

              {DEMO_CONNECTIONS.map((conn, i) => {
                const from = getNodeById(conn.from)
                const to   = getNodeById(conn.to)
                if (!from || !to) return null

                const x1 = from.x + NODE_W / 2
                const y1 = from.y + NODE_H
                const x2 = to.x   + NODE_W / 2
                const y2 = to.y
                const cy = (y1 + y2) / 2

                const marker = conn.label === 'Yes' ? 'arrowGreen'
                  : conn.label === 'No' ? 'arrowOrange' : 'arrowBlue'
                const stroke = conn.label === 'Yes'  ? 'rgba(0,245,160,0.45)'
                  : conn.label === 'No' ? 'rgba(255,179,71,0.45)' : 'rgba(79,142,247,0.45)'

                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`}
                      fill="none" stroke={stroke} strokeWidth="1.5"
                      strokeDasharray="5,3" markerEnd={`url(#${marker})`}
                    />
                    {conn.label && (
                      <text
                        x={(x1 + x2) / 2} y={cy}
                        fill={stroke} fontSize="10"
                        textAnchor="middle" dominantBaseline="middle"
                        dx={conn.label === 'No' ? 24 : 0}
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Flow Nodes */}
            <AnimatePresence>
              {nodes.map((node, i) => {
                const isSelected = selectedNode === node.id
                const isDragging = dragging === node.id
                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: node.x,
                      top: node.y,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      zIndex: isSelected ? 20 : 1,
                    }}
                    initial={{ opacity: 0, scale: 0.75, y: 12 }}
                    animate={{ opacity: 1, scale: 1,    y: 0 }}
                    exit={{    opacity: 0, scale: 0.5,  y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.06 * i }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id) }}
                  >
                    {/* Selection ring */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key="sel-ring"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute pointer-events-none"
                          style={{
                            inset: '-4px',
                            border: '2px solid rgba(79,142,247,0.7)',
                            boxShadow: '0 0 18px rgba(79,142,247,0.35)',
                            borderRadius: '20px',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <FlowNode
                      type={node.type}
                      title={node.title}
                      description={node.description}
                      isSelected={isSelected}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Floating "+" FAB (UI trigger only) ───────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12, boxShadow: '0 0 28px rgba(79,142,247,0.5)' }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setDialogOpen(true)}
        className="absolute bottom-5 right-5 z-30 w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #4F8EF7, #9B5DE5)',
          boxShadow: '0 0 20px rgba(79,142,247,0.35), 0 8px 24px rgba(0,0,0,0.4)',
        }}
        title="Add custom node"
      >
        <Plus size={22} className="text-white" />
      </motion.button>

      {/* ── Add Node Dialog (UI shell only) ──────────────────────────── */}
      <AddNodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        catalogue={NODE_TYPE_CATALOGUE}
      />
    </div>
  )
}
