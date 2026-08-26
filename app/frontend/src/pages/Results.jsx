// HealthGuard AI - Results Dashboard ("Vitals Monitor" design)

import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  Droplet, HeartPulse, Activity, Brain, Filter,
  RotateCcw, Printer, AlertTriangle, TrendingUp, TrendingDown
} from 'lucide-react'
import PulseLine from '../components/PulseLine'

const DISEASE_ICONS = {
  diabetes: Droplet,
  heart_disease: HeartPulse,
  hypertension: Activity,
  stroke: Brain,
  kidney_disease: Filter
}

function getRiskStyle(level) {
  if (level?.includes('Low')) {
    return { text: 'text-mint', bg: 'bg-mint/10', ring: 'ring-mint/30', bar: '#1FA97D' }
  }
  if (level?.includes('Moderate')) {
    return { text: 'text-amber', bg: 'bg-amber/10', ring: 'ring-amber/30', bar: '#E6A93A' }
  }
  return { text: 'text-accent', bg: 'bg-accent/10', ring: 'ring-accent/30', bar: '#E8543F' }
}

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { results } = location.state || {}

  if (!results) {
    return (
      <div className="text-center py-24">
        <p className="text-slate text-lg mb-4">No results found.</p>
        <button onClick={() => navigate('/assessment')}
          className="px-6 py-3 bg-ink text-paper rounded-lg font-medium">
          Go to Assessment
        </button>
      </div>
    )
  }

  const { predictions, overall_risk, recommendations, top_risk_factors } = results
  const overallStyle = getRiskStyle(
    overall_risk < 30 ? 'Low' : overall_risk < 70 ? 'Moderate' : 'High'
  )

  const chartData = Object.entries(predictions).map(([key, p]) => ({
    name: p.name,
    risk: p.risk_percentage,
    fill: getRiskStyle(p.risk_level).bar
  }))

  return (
    <div className="bg-paper">

      {/* Header */}
      <div className="bg-ink text-paper relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-10 text-center relative z-10">
          <span className="text-sm font-mono font-semibold tracking-widest text-accent
                           uppercase mb-3 inline-block">
            Assessment Complete
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mb-1">
            Your Health Risk Readout
          </h1>
          <p className="text-paper/50 text-sm mb-8">
            Based on AI analysis of your health data
          </p>
          <div className={`inline-flex flex-col items-center justify-center
                          w-36 h-36 rounded-full ring-4 ${overallStyle.ring}
                          bg-white/5`}>
            <span className={`font-mono text-4xl font-semibold ${overallStyle.text}`}>
              {overall_risk}%
            </span>
            <span className="text-paper/50 text-xs mt-1">Overall Risk</span>
          </div>
        </div>
        <PulseLine className="absolute bottom-0 left-0 w-full h-20 opacity-90" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 -mt-16 relative z-10">
          {Object.entries(predictions).map(([key, pred]) => {
            const Icon = DISEASE_ICONS[key] || Activity
            const style = getRiskStyle(pred.risk_level)
            return (
              <div key={key}
                className="bg-white rounded-2xl border border-slate/10
                           shadow-sm p-5 flex flex-col items-center text-center">
                <Icon className={`w-5 h-5 mb-3 ${style.text}`} strokeWidth={1.8} />
                <span className={`font-mono text-2xl font-semibold ${style.text}`}>
                  {pred.risk_percentage}%
                </span>
                <span className="text-ink text-xs font-medium mt-2">
                  {pred.name}
                </span>
                <span className={`text-[11px] mt-1 px-2 py-0.5 rounded-full
                                  ${style.bg} ${style.text}`}>
                  {pred.risk_level}
                </span>
              </div>
            )
          })}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
          <h2 className="font-display text-lg font-semibold text-ink mb-5">
            Risk Comparison
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#5B6B6B" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6B6B' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5B6B6B' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 13 }}
                formatter={(value) => [`${value}%`, 'Risk']} />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Factors */}
        {top_risk_factors && top_risk_factors.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
            <h2 className="font-display text-lg font-semibold text-ink mb-5">
              Key Risk Factors
            </h2>
            <div className="space-y-3">
              {top_risk_factors.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  {f.direction === 'increases' ? (
                    <TrendingUp className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-mint shrink-0" strokeWidth={2} />
                  )}
                  <span className="text-sm text-ink font-medium w-40 shrink-0">
                    {f.feature}
                  </span>
                  <span className="text-xs text-slate">
                    {f.direction === 'increases' ? 'Increases' : 'Decreases'} risk
                    &nbsp;· value: {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
          <h2 className="font-display text-lg font-semibold text-ink mb-5">
            Personalized Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.values(recommendations).map((rec, i) => {
              const style = getRiskStyle(rec.risk_level)
              return (
                <div key={i} className="border border-slate/10 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-display font-semibold text-ink text-sm">
                      {rec.disease_name}
                    </h3>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full
                                      ${style.bg} ${style.text} font-medium`}>
                      {rec.risk_level}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {rec.advice.map((tip, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate">
                        <span className="text-mint mt-0.5">·</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber/10 border border-amber/25 rounded-2xl p-5 mb-8
                        flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-sm text-slate leading-relaxed">
            This is a risk assessment tool, not a medical diagnosis.
            Always consult a qualified healthcare professional.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate('/assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper
                       rounded-lg font-medium hover:bg-ink/90 transition-colors">
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            New Assessment
          </button>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 border
                       border-slate/20 text-ink rounded-lg font-medium
                       hover:bg-white transition-colors">
            <Printer className="w-4 h-4" strokeWidth={2} />
            Print Results
          </button>
        </div>

      </div>
    </div>
  )
}

export default Results