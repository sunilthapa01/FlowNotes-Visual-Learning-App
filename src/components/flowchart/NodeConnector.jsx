// NodeConnector – SVG arrow connector between two nodes
// Used as a standalone wrapper if needed; main connectors are inline in FlowCanvas SVG

export default function NodeConnector({ x1, y1, x2, y2, label, color = 'rgba(79,142,247,0.5)' }) {
  const cy = (y1 + y2) / 2
  return (
    <g>
      <path
        d={`M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={cy}
          fill={color}
          fontSize="10"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  )
}
