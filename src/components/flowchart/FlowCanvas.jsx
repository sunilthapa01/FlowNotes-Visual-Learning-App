import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Plus,
  Trash2,
  MousePointer2,
  Sparkles,
  Move,
} from "lucide-react";
import FlowNode from "./FlowNode";
import AddNodeDialog from "./AddNodeDialog";
import ExportButton from "./ExportButton";
import ExportModal from "./ExportModal";

// ─── Node type catalogue ───────────────────────────────────────────────
const NODE_TYPE_CATALOGUE = [
  {
    type: "start",
    label: "Start",
    color: "#00F5A0",
    description: "Flow entry point",
  },
  {
    type: "process",
    label: "Process",
    color: "#4F8EF7",
    description: "Action or step",
  },
  {
    type: "decision",
    label: "Decision",
    color: "#FFB347",
    description: "Branch condition",
  },
  {
    type: "end",
    label: "End",
    color: "#FF6B6B",
    description: "Flow terminator",
  },
];

const TYPE_COLOR = {
  start: "#00F5A0",
  process: "#4F8EF7",
  decision: "#FFB347",
  end: "#FF6B6B",
};

// Node card dimensions (must match FlowNode's rendered size)
const NODE_W = 180;
const NODE_H = 88;

// Smart spawn: new nodes cascade in a grid so they don't overlap
function getSpawnPosition(existingNodes) {
  const col = existingNodes.length % 3;
  const row = Math.floor(existingNodes.length / 3);
  return { x: 80 + col * 230, y: 80 + row * 170 };
}

// ─── FlowCanvas ────────────────────────────────────────────────────────
export default function FlowCanvas({ activeNote, onSave }) {
  const canvasRef = useRef(null);

  // Derive from activeNote — FlowCanvas owns NO node data itself
  const nodes = activeNote?.nodes ?? [];
  const connections = activeNote?.connections ?? [];

  // Drag: livePos tracks the dragging node position locally (no parent re-render per-frame)
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [livePos, setLivePos] = useState({ x: 0, y: 0 });

  // UI state
  const [zoom, setZoom] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [hoveredType, setHoveredType] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleZoom = (dir) =>
    setZoom((z) => Math.min(2.5, Math.max(0.25, z + dir * 0.15)));

  // Returns render position: live if dragging, stored otherwise
  const getRenderPos = (node) =>
    node.id === dragging ? livePos : { x: node.x, y: node.y };

  // ─── Add Node ─────────────────────────────────────────────────────────
  // Auto-connects the new node to the previous last node with a curved arrow
  const handleAddNode = useCallback(
    (type, customTitle, customDesc) => {
      if (!activeNote || !onSave) return;

      const catalogue = NODE_TYPE_CATALOGUE.find((c) => c.type === type);
      const pos = getSpawnPosition(nodes);
      const newId = `${type}-${Date.now()}`;

      const newNode = {
        id: newId,
        type,
        title: customTitle || catalogue?.label || type,
        description: customDesc || "",
        x: pos.x,
        y: pos.y,
      };
      console.log("New Node:", newNode);
      // Auto-connect: link to the last existing node
      const newConn =
        nodes.length > 0
          ? [
              {
                id: `conn-${Date.now()}`,
                from: nodes[nodes.length - 1].id,
                to: newId,
              },
            ]
          : [];

      console.log("Check for this :- ",newConn);
      
      onSave({
        ...activeNote,
        nodes: [...nodes, newNode],
        connections: [...connections, ...newConn],
      });

      setDialogOpen(false);
    },
    [activeNote, nodes, connections, onSave],
  );

  console.log("Checking the Process of Node :- ",nodes);
  
  // ─── Delete Selected Node ──────────────────────────────────────────────
  const handleDeleteNode = useCallback(() => {
    if (!selectedNode || !activeNote || !onSave) return;
    onSave({
      ...activeNote,
      nodes: nodes.filter((n) => n.id !== selectedNode),
      // Also remove any arrow that touches the deleted node
      connections: connections.filter(
        (c) => c.from !== selectedNode && c.to !== selectedNode,
      ),
    });
    setSelectedNode(null);
  }, [selectedNode, activeNote, nodes, connections, onSave]);

  // ─── Drag: Start ──────────────────────────────────────────────────────
  const handlePointerDown = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragging(nodeId);
    setSelectedNode(nodeId);
    setLivePos({ x: node.x, y: node.y });
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.x,
      y: (e.clientY - rect.top) / zoom - node.y,
    });
    // Start capturing pointer events for smooth dragging even outside the element
    e.target.setPointerCapture(e.pointerId);
  };

  // ─── Drag: Move ───────────────────────────────────────────────────────
  // Only updates local livePos — zero parent re-renders while dragging
  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setLivePos({
        x: Math.max(0, (e.clientX - rect.left) / zoom - dragOffset.x),
        y: Math.max(0, (e.clientY - rect.top) / zoom - dragOffset.y),
      });
    },
    [dragging, zoom, dragOffset],
  );

  // ─── Drag: End ────────────────────────────────────────────────────────
  // Save final position to parent only once on release
  const handlePointerUp = useCallback(
    (e) => {
      if (!dragging || !activeNote || !onSave) {
        setDragging(null);
        return;
      }
      onSave({
        ...activeNote,
        nodes: nodes.map((n) =>
          n.id === dragging ? { ...n, x: livePos.x, y: livePos.y } : n,
        ),
      });
      setDragging(null);
      // Release pointer capture
      if (e.target.releasePointerCapture) {
        e.target.releasePointerCapture(e.pointerId);
      }
    },
    [dragging, livePos, nodes, activeNote, onSave],
  );

  const hasNodes = nodes.length > 0;

  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{ minWidth: 0 }}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-6 py-2 border-b border-[var(--border-subtle)] flex-shrink-0"
        style={{
          background: "rgba(8,11,20,0.65)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {activeNote?.title ?? "Canvas"}
        </span>

        {/* Live node + connection counts */}
        <motion.span
          key={`${nodes.length}-${connections.length}`}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs px-1.5 py-0.5 rounded-md font-mono"
          style={{ background: "rgba(79,142,247,0.12)", color: "#4F8EF7" }}
        >
          {nodes.length} nodes · {connections.length} arrows
        </motion.span>

        <div className="flex items-center gap-1 ml-auto">
          {[
            { Icon: MousePointer2, tip: "Select" },
            { Icon: Move, tip: "Pan" },
            { Icon: Grid, tip: "Grid" },
            { Icon: Maximize2, tip: "Fit", action: () => setZoom(1) },
          ].map(({ Icon, tip, action }) => (
            <motion.button
              key={tip}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={tip}
              onClick={action}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Icon size={13} />
            </motion.button>
          ))}

          <div className="mx-1 h-4 w-px bg-white/10" />

          <ExportButton onClick={() => setExportOpen(true)} />

          {/* Delete selected node button */}
          <AnimatePresence>
            {selectedNode && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteNode}
                title="Delete selected node"
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer ml-1"
                style={{
                  background: "rgba(255,107,107,0.12)",
                  border: "1px solid rgba(255,107,107,0.25)",
                  color: "#FF6B6B",
                }}
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 ml-2 glass rounded-lg overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleZoom(-1)}
              className="w-7 h-7 flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomOut size={13} />
            </motion.button>
            <span className="text-xs font-mono text-[var(--text-muted)] px-1 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleZoom(1)}
              className="w-7 h-7 flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomIn size={13} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Canvas body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── Node Types Side Panel ──────────────────────────────────── */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="flex-shrink-0 flex flex-col gap-1.5 py-4 px-2.5 border-r border-[var(--border-subtle)] z-10"
          style={{
            width: "130px",
            background: "rgba(8,11,20,0.5)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <Sparkles size={11} style={{ color: "#4F8EF7" }} />
            <span
              className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider"
              style={{ fontSize: "9px" }}
            >
              Add Node
            </span>
          </div>

          {NODE_TYPE_CATALOGUE.map((cat) => (
            <motion.button
              key={cat.type}
              onHoverStart={() => setHoveredType(cat.type)}
              onHoverEnd={() => setHoveredType(null)}
              onClick={() => handleAddNode(cat.type)}
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-left rounded-xl px-2.5 py-2.5 cursor-pointer relative overflow-hidden transition-all"
              style={{
                background:
                  hoveredType === cat.type
                    ? `${cat.color}18`
                    : "rgba(255,255,255,0.03)",
                border:
                  hoveredType === cat.type
                    ? `1px solid ${cat.color}50`
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  hoveredType === cat.type ? `0 0 14px ${cat.color}20` : "none",
              }}
            >
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
                      : { scale: 1, boxShadow: "none" }
                  }
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <span
                  className="text-xs font-semibold truncate"
                  style={{
                    color:
                      hoveredType === cat.type
                        ? cat.color
                        : "var(--text-secondary)",
                  }}
                >
                  {cat.label}
                </span>
              </div>
              <p
                className="text-xs mt-1 leading-tight relative z-10"
                style={{ color: "var(--text-muted)", fontSize: "10px" }}
              >
                {cat.description}
              </p>
              <AnimatePresence>
                {hoveredType === cat.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 mt-1.5 relative z-10"
                  >
                    <Plus size={9} style={{ color: cat.color }} />
                    <span
                      style={{
                        color: cat.color,
                        fontSize: "9px",
                        fontWeight: 600,
                      }}
                    >
                      Click to add
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          <div className="my-1 border-t border-[var(--border-subtle)]" />

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 14px rgba(79,142,247,0.3)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setDialogOpen(true)}
            className="w-full flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(79,142,247,0.12), rgba(155,93,229,0.12))",
              border: "1px solid rgba(79,142,247,0.25)",
            }}
          >
            <Plus size={15} style={{ color: "#4F8EF7" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "#4F8EF7", fontSize: "10px" }}
            >
              Custom
            </span>
          </motion.button>
        </motion.div>

        {/* ── Main drawing canvas ───────────────────────────────────── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden dot-grid select-none"
          onPointerMove={handleMouseMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => setSelectedNode(null)}
          style={{
            background: "rgba(8,11,20,0.4)",
            cursor: dragging ? "grabbing" : "default",
            touchAction: "none",
          }}
        >
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(8,11,20,0.55) 100%)",
            }}
          />

          {/* ── Empty state ──────────────────────────────────────────── */}
          <AnimatePresence>
            {!hasNodes && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none z-10"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(79,142,247,0.08)",
                    border: "1px dashed rgba(79,142,247,0.3)",
                  }}
                >
                  <Plus size={28} style={{ color: "rgba(79,142,247,0.5)" }} />
                </motion.div>
                <div className="text-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {activeNote
                      ? "Click a node type to start your flow"
                      : "Create or select a note first"}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.15)",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Nodes auto-connect as you add them
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Zoom wrapper ─────────────────────────────────────────── */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {/* ── SVG: Connection arrows ────────────────────────────── */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
                zIndex: 0,
              }}
            >
              <defs>
                {/* One arrow marker per node type color */}
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <marker
                    key={type}
                    id={`arrow-${type}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L9,3 z"
                      fill={color}
                      fillOpacity="0.85"
                    />
                  </marker>
                ))}
                {/* Default blue arrow */}
                <marker
                  id="arrow-default"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="rgba(79,142,247,0.85)" />
                </marker>
              </defs>

              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                // Use live position if either endpoint is being dragged
                const fromPos = getRenderPos(fromNode);
                const toPos = getRenderPos(toNode);

                // Connection points: bottom-center → top-center
                const x1 = fromPos.x + NODE_W / 2;
                const y1 = fromPos.y + NODE_H;
                const x2 = toPos.x + NODE_W / 2;
                const y2 = toPos.y;

                // Cubic bezier control points (smooth S-curve)
                const cy1 = y1 + Math.abs(y2 - y1) * 0.5;
                const cy2 = y2 - Math.abs(y2 - y1) * 0.5;
                const path = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;

                // Color driven by the source node's type
                const color = TYPE_COLOR[fromNode.type] ?? "#4F8EF7";
                const markerId = `arrow-${fromNode.type}`;
                const isSelected =
                  selectedNode === fromNode.id || selectedNode === toNode.id;

                return (
                  <g key={conn.id}>
                    {/* Glow layer (thicker, low opacity) */}
                    <path
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected ? 5 : 3}
                      strokeOpacity={isSelected ? 0.25 : 0.12}
                      strokeLinecap="round"
                    />
                    {/* Main arrow line */}
                    <path
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected ? 2 : 1.5}
                      strokeOpacity={isSelected ? 0.95 : 0.55}
                      strokeDasharray={
                        fromNode.type === "decision" ? "6 3" : "none"
                      }
                      strokeLinecap="round"
                      markerEnd={`url(#${markerId})`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* ── Flow Nodes ────────────────────────────────────────── */}
            <AnimatePresence>
              {nodes.map((node, i) => {
                const isSelected = selectedNode === node.id;
                const pos = getRenderPos(node);

                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      cursor: node.id === dragging ? "grabbing" : "grab",
                      zIndex: isSelected ? 20 : 2, // always above SVG (z=0)
                    }}
                    initial={{ opacity: 0, scale: 0.4, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -12 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                      delay: 0.03 * i,
                    }}
                    onPointerDown={(e) => handlePointerDown(e, node.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node.id);
                    }}
                  >
                    {/* Selection ring */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key="ring"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute pointer-events-none"
                          style={{
                            inset: "-5px",
                            border: `2px solid ${TYPE_COLOR[node.type] ?? "#4F8EF7"}`,
                            boxShadow: `0 0 20px ${TYPE_COLOR[node.type] ?? "#4F8EF7"}40`,
                            borderRadius: "22px",
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
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── FAB ──────────────────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12, boxShadow: "0 0 28px rgba(79,142,247,0.5)" }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setDialogOpen(true)}
        className="absolute bottom-5 right-5 z-30 w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #4F8EF7, #9B5DE5)",
          boxShadow:
            "0 0 20px rgba(79,142,247,0.35), 0 8px 24px rgba(0,0,0,0.4)",
        }}
        title="Add custom node"
      >
        <Plus size={22} className="text-white" />
      </motion.button>

      {/* ── Custom Node Dialog ────────────────────────────────────────── */}
      <AddNodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        catalogue={NODE_TYPE_CATALOGUE}
        onAdd={handleAddNode}
      />

      {/* ── Export Modal ─────────────────────────────────────────────── */}
      <ExportModal
        open={exportOpen}
        canvasRef={canvasRef}


        nodes={nodes}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
