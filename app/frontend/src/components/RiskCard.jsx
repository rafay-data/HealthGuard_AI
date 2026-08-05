// HealthGuard AI - Risk Card Component

function RiskCard({ disease, risk_percentage, risk_level, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center">
      <div className="text-3xl font-bold mb-2" style={{ color }}>
        {risk_percentage}%
      </div>
      <div className="font-bold text-gray-800 mb-1">{disease}</div>
      <div className="text-sm font-medium" style={{ color }}>
        {risk_level}
      </div>
      <div className="mt-3 bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full"
          style={{ width: `${risk_percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default RiskCard