import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * NeuralBackground
 *
 * Concept: A living neural-network of nodes connected by glowing synaptic
 * lines. Nodes drift slowly on their own, but when the cursor moves near
 * them they are gently repelled — creating an "alive" feel distinct from
 * any generic particle or gradient animation.
 *
 * Technique: pure Canvas 2D + GSAP ticker (no Three.js dependency).
 * The result is extremely lightweight (< 2 KB logic) yet visually stunning.
 */

const PALETTE      = ['#4F8EF7', '#9B5DE5', '#00D4FF', '#00F5A0', '#FFB347']
const NODE_COUNT   = 52          // number of neural nodes
const CONNECT_DIST = 180         // max distance to draw a synapse line
const REPEL_DIST   = 120         // cursor repulsion radius
const REPEL_FORCE  = 0.018       // how hard nodes flee the cursor
const DRIFT_SPEED  = 0.22        // base drift speed (px/frame)

function randomBetween(a, b) { return a + Math.random() * (b - a) }

export default function NeuralBackground() {
  const canvasRef  = useRef(null)
  const stateRef   = useRef({ nodes: [], mouse: { x: -999, y: -999 } })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    // ── Size canvas to window ───────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Build nodes ─────────────────────────────────────────────────────
    stateRef.current.nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:       randomBetween(0, canvas.width),
      y:       randomBetween(0, canvas.height),
      vx:      randomBetween(-DRIFT_SPEED, DRIFT_SPEED),
      vy:      randomBetween(-DRIFT_SPEED, DRIFT_SPEED),
      r:       randomBetween(1.5, 3.5),
      color:   PALETTE[Math.floor(Math.random() * PALETTE.length)],
      pulse:   randomBetween(0, Math.PI * 2),   // phase offset for size pulse
    }))

    // ── Track cursor ────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      stateRef.current.mouse = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── GSAP ticker (runs every rAF frame) ──────────────────────────────
    const tick = () => {
      const { nodes, mouse } = stateRef.current
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      // Update every node
      nodes.forEach((n) => {
        // Cursor repulsion
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_DIST && dist > 0) {
          const force = (REPEL_DIST - dist) / REPEL_DIST
          n.vx += (dx / dist) * force * REPEL_FORCE * 8
          n.vy += (dy / dist) * force * REPEL_FORCE * 8
        }

        // Velocity damping (keeps speed bounded)
        n.vx *= 0.98
        n.vy *= 0.98

        // Clamp speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (speed > DRIFT_SPEED * 3) {
          n.vx = (n.vx / speed) * DRIFT_SPEED * 3
          n.vy = (n.vy / speed) * DRIFT_SPEED * 3
        }
        // Restore minimum drift
        if (speed < 0.05) {
          n.vx += randomBetween(-0.03, 0.03)
          n.vy += randomBetween(-0.03, 0.03)
        }

        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.025

        // Wrap at edges with small margin
        if (n.x < -20)  n.x = W + 20
        if (n.x > W+20) n.x = -20
        if (n.y < -20)  n.y = H + 20
        if (n.y > H+20) n.y = -20
      })

      // Draw synaptic lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a  = nodes[i]
          const b  = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d > CONNECT_DIST) continue

          const alpha = (1 - d / CONNECT_DIST) * 0.35

          // Gradient line (color of node A → color of node B)
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
          grad.addColorStop(0, a.color + Math.round(alpha * 255).toString(16).padStart(2, '0'))
          grad.addColorStop(1, b.color + Math.round(alpha * 255).toString(16).padStart(2, '00'))

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = grad
          ctx.lineWidth   = 0.7
          ctx.stroke()
        }
      }

      // Draw nodes over lines
      nodes.forEach((n) => {
        const pulseR = n.r + Math.sin(n.pulse) * 0.6

        // Glow halo
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseR * 6)
        glow.addColorStop(0,   n.color + '30')
        glow.addColorStop(0.5, n.color + '10')
        glow.addColorStop(1,   n.color + '00')
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseR * 6, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2)
        ctx.fillStyle = n.color + 'CC'
        ctx.fill()
      })
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
