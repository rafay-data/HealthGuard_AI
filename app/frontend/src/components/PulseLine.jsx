// HealthGuard AI - Signature animated heartbeat/ECG trace

function PulseLine({ className = '', color = '#E8543F' }) {
  return (
    <svg viewBox="0 0 600 60" className={className}
      preserveAspectRatio="none" fill="none">
      <path
        d="M0 30 H120 L140 8 L158 52 L176 4 L194 56 L212 30 H600"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pulse-path"
      />
    </svg>
  )
}

export default PulseLine