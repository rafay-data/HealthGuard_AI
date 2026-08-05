// HealthGuard AI - Results Dashboard

import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, ResponsiveContainer } from 'recharts'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { results } = location.state || {}

  if (!results) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-xl">No results found!</p>
        <button onClick={() => navigate('/assessment')}
          className="mt-4 px-6 py-3 bg-blue-900 text-white rounded-lg">
          Go to Assessment
        </button>
      </div>
    )
  }

  const { predictions, overall_risk, recommendations } = results

  // Chart data
  const chartData = Object.values(predictions).map(p => ({
    name: p.name,
    risk: p.risk_percentage,
    fill: p.color
  }))

  const getRiskBg = (level) => {
    if (level.includes('Low')) return 'bg-green-50 border-green-200'
    if (level.includes('Moderate')) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getRiskText = (level) => {
    if (level.includes('Low')) return 'text-green-700'
    if (level.includes('Moderate')) return 'text-yellow-700'
    return 'text-red-700'
  }

  const getOverallColor = () => {
    if (overall_risk < 30) return 'text-green-600'
    if (overall_risk < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Your Health Risk Assessment Results
        </h1>
        <p className="text-gray-500">
          Based on AI analysis of your health data
        </p>
        <div className={`text-5xl font-bold mt-4 ${getOverallColor()}`}>
          {overall_risk}%
        </div>
        <p className="text-gray-500 mt-1">Overall Health Risk</p>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        {Object.values(predictions).map((pred, i) => (
          <div key={i}
            className={`p-5 rounded-xl border-2 ${getRiskBg(pred.risk_level)}`}>
            <div className="text-3xl font-bold text-center mb-2"
              style={{ color: pred.color }}>
              {pred.risk_percentage}%
            </div>
            <div className="text-center font-bold text-gray-800 text-sm">
              {pred.name}
            </div>
            <div className={`text-center text-xs mt-1 font-medium
              ${getRiskText(pred.risk_level)}`}>
              {pred.risk_level}
            </div>
            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${pred.risk_percentage}%`,
                  backgroundColor: pred.color
                }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-900 mb-6">
          Risk Comparison Chart
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Risk']} />
            <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-900 mb-6">
          Personalized Health Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(recommendations).map((rec, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-blue-900">
                  {rec.disease_name}
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${rec.risk_level.includes('Low')
                    ? 'bg-green-100 text-green-700'
                    : rec.risk_level.includes('Moderate')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'}`}>
                  {rec.risk_level}
                </span>
              </div>
              <ul className="space-y-2">
                {rec.advice.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm
                                         text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-yellow-800 text-sm text-center">
          ⚠️ This is a risk assessment tool, not a medical diagnosis.
          Always consult a qualified healthcare professional.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button onClick={() => navigate('/assessment')}
          className="px-6 py-3 bg-blue-900 text-white rounded-lg
                     font-medium hover:bg-blue-800">
          New Assessment
        </button>
        <button onClick={() => window.print()}
          className="px-6 py-3 border border-blue-900 text-blue-900
                     rounded-lg font-medium hover:bg-blue-50">
          Print Results
        </button>
      </div>

    </div>
  )
}

export default Results