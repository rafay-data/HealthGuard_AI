// HealthGuard AI - About Page

import {
  Droplet, HeartPulse, Activity, Brain, Filter,
  Server, Cpu, MonitorSmartphone, Database,
  CheckCircle2, AlertTriangle, User
} from 'lucide-react'

function About() {
  const technologies = [
    { category: 'Backend', icon: Server, items: ['FastAPI', 'Python 3.13', 'Uvicorn', 'Pydantic'] },
    { category: 'Machine Learning', icon: Cpu, items: ['scikit-learn', 'XGBoost', 'SHAP', 'Neural Network'] },
    { category: 'Frontend', icon: MonitorSmartphone, items: ['React.js', 'Tailwind CSS', 'Recharts', 'Axios'] },
    { category: 'Data Processing', icon: Database, items: ['pandas', 'NumPy', 'SMOTE', 'StandardScaler'] }
  ]

  const diseases = [
    { name: 'Diabetes', icon: Droplet, model: 'Random Forest', accuracy: '89.92%' },
    { name: 'Heart Disease', icon: HeartPulse, model: 'Random Forest', accuracy: '80.70%' },
    { name: 'Hypertension', icon: Activity, model: 'XGBoost', accuracy: '98.97%' },
    { name: 'Stroke', icon: Brain, model: 'Random Forest (Class-Weighted)', accuracy: '71.04%*' },
    { name: 'Kidney Disease', icon: Filter, model: 'Random Forest', accuracy: '100%' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block text-sm font-mono font-semibold tracking-widest
                         text-accent uppercase mb-4">
          Final Year Project
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold
                      text-ink mb-4">
          About HealthGuard AI
        </h1>
        <p className="text-slate text-lg max-w-2xl mx-auto leading-relaxed">
          An AI-powered web application developed at University of Sindh,
          Jamshoro for predicting risk of 5 major diseases using
          machine learning.
        </p>
      </div>

      {/* Model Performance */}
      <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-6">
          Model Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate/15">
                <th className="p-3 text-left text-sm font-medium text-slate">Disease</th>
                <th className="p-3 text-left text-sm font-medium text-slate">Best Model</th>
                <th className="p-3 text-left text-sm font-medium text-slate">Accuracy</th>
                <th className="p-3 text-left text-sm font-medium text-slate">Status</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((d, i) => {
                const Icon = d.icon
                return (
                  <tr key={i} className="border-b border-slate/8 last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5 font-medium text-ink">
                        <Icon className="w-4 h-4 text-accent" strokeWidth={1.8} />
                        {d.name}
                      </div>
                    </td>
                    <td className="p-3 text-slate text-sm">{d.model}</td>
                    <td className="p-3">
                      <span className="font-mono text-sm font-semibold text-ink">
                        {d.accuracy}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5
                                       text-mint text-sm">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={1.8} />
                        Active
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate/70 mt-4">
          *Stroke model prioritizes recall (80%) over raw accuracy,
          as missing an actual stroke case is more critical than a
          false alarm in a health screening context.
        </p>
      </div>

      {/* Technologies */}
      <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-6">
          Technologies Used
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {technologies.map((tech, i) => {
            const Icon = tech.icon
            return (
              <div key={i} className="bg-paper rounded-xl p-4">
                <Icon className="w-5 h-5 text-accent mb-2.5" strokeWidth={1.8} />
                <h3 className="font-display font-semibold text-ink text-sm mb-2.5">
                  {tech.category}
                </h3>
                <ul className="space-y-1">
                  {tech.items.map((item, j) => (
                    <li key={j} className="text-slate text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-2xl border border-slate/10 p-6 mb-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-6">
          Project Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="text-center p-6 bg-paper rounded-xl">
              <div className="w-14 h-14 bg-ink rounded-full
                              flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-accent" strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-semibold text-ink">
                Team Member {i + 1}
              </h3>
              <p className="text-slate text-sm">BS Information Technology</p>
              <p className="text-slate/60 text-xs mt-1">
                University of Sindh
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber/10 border border-amber/25 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber" strokeWidth={2} />
          <h3 className="font-display font-semibold text-ink text-sm">
            Disclaimer
          </h3>
        </div>
        <p className="text-slate text-sm leading-relaxed">
          HealthGuard AI is developed for educational purposes as a Final Year
          Project. It is not intended to replace professional medical advice,
          diagnosis, or treatment. Always consult a qualified healthcare
          professional for medical decisions.
        </p>
      </div>

    </div>
  )
}

export default About