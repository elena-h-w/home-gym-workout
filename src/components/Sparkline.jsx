export default function Sparkline({ points, width = 280, height = 64, color = 'var(--accent)' }) {
  if (points.length === 0) return null
  if (points.length === 1) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle cx={width / 2} cy={height / 2} r="4" fill={color} />
      </svg>
    )
  }

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const padY = 8
  const stepX = width / (points.length - 1)

  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = padY + (1 - (p - min) / range) * (height - padY * 2)
    return [x, y]
  })

  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  )
}
