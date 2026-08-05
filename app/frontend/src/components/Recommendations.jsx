// HealthGuard AI - Recommendations Component

function Recommendations({ recommendations }) {
  if (!recommendations) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.values(recommendations).map((rec, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-3">
            {rec.disease_name}
          </h3>
          <ul className="space-y-2">
            {rec.advice.map((tip, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Recommendations