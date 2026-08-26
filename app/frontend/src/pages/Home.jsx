// HealthGuard AI - Home Page

import { Link } from 'react-router-dom'
import {
  Droplet, HeartPulse, Activity, Brain, Filter,
  ArrowRight, ClipboardList, BrainCircuit, FileCheck2, ShieldCheck
} from 'lucide-react'
import PulseLine from '../components/PulseLine'

function Home() {
  const diseases = [
    { icon: Droplet, name: 'Diabetes', desc: 'Blood sugar risk assessment' },
    { icon: HeartPulse, name: 'Heart Disease', desc: 'Cardiovascular risk evaluation' },
    { icon: Activity, name: 'Hypertension', desc: 'Blood pressure risk analysis' },
    { icon: Brain, name: 'Stroke', desc: 'Brain stroke risk prediction' },
    { icon: Filter, name: 'Kidney Disease', desc: 'Kidney function risk assessment' }
  ]

  const stats = [
    { number: '5', label: 'Diseases Predicted' },
    { number: '90%+', label: 'Avg. Model Accuracy' },
    { number: '<5s', label: 'Response Time' },
    { number: '24/7', label: 'Available' }
  ]

  const steps = [
    { step: '01', icon: ClipboardList, title: 'Enter Health Data', desc: 'Fill in your basic health information and lifestyle factors' },
    { step: '02', icon: BrainCircuit, title: 'AI Analysis', desc: 'Our ML models analyze your data instantly' },
    { step: '03', icon: FileCheck2, title: 'Get Results', desc: 'Receive detailed risk assessment for 5 major diseases' },
    { step: '04', icon: ShieldCheck, title: 'Take Action', desc: 'Follow personalized health recommendations' }
  ]

  return (
    <div>

      {/* Hero */}
      <section className="relative bg-ink text-paper overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
          <span className="inline-block text-sm font-semibold tracking-widest
                           text-accent uppercase mb-5">
            AI Health Screening
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold
                        leading-tight max-w-2xl mb-6">
            Know your risk<br />before it becomes
            <span className="text-accent"> a diagnosis.</span>
          </h1>
          <p className="text-paper/70 text-lg max-w-xl mb-10 leading-relaxed">
            Get instant AI-powered risk assessment for 5 major diseases.
            Early detection saves lives.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-accent text-paper
                       font-medium px-7 py-4 rounded-lg hover:bg-accent/90
                       transition-colors"
          >
            Start Health Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PulseLine
          className="absolute bottom-0 left-0 w-full h-24 opacity-100"
        />
      </section>

      {/* Stats */}
      <section className="bg-ink border-t border-accent/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-3xl md:text-4xl font-semibold
                                text-paper">
                  {stat.number}
                </div>
                <div className="text-paper/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold
                        text-ink text-center mb-3">
            Diseases We Predict
          </h2>
          <p className="text-slate text-center mb-12">
            Five major conditions, one assessment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {diseases.map((disease, i) => {
              const Icon = disease.icon
              return (
                <div key={i}
                  className="bg-white p-6 rounded-2xl border border-slate/10
                             hover:border-accent/30 hover:-translate-y-1
                             transition-all duration-200 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl
                                  bg-ink flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display font-semibold text-ink mb-1.5">
                    {disease.name}
                  </h3>
                  <p className="text-slate text-sm">{disease.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-t border-slate/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold
                        text-ink text-center mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="relative">
                  <span className="font-mono text-xs text-accent block mb-3">
                    {step.step}
                  </span>
                  <Icon className="w-7 h-7 text-ink mb-4" strokeWidth={1.6} />
                  <h3 className="font-display font-semibold text-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-ink text-paper py-20 overflow-hidden">
        <PulseLine className="absolute top-0 left-0 w-full h-24 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl font-semibold mb-3">
            Ready to check your health risk?
          </h2>
          <p className="text-paper/60 mb-8">
            Free, instant, and accurate — no signup required.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-accent text-paper
                       font-medium px-7 py-4 rounded-lg hover:bg-accent/90
                       transition-colors"
          >
            Get Started — It's Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Home