// HealthGuard AI - Home Page

import { Link } from 'react-router-dom'

function Home() {
  const diseases = [
    { icon: '🩺', name: 'Diabetes', desc: 'Blood sugar risk assessment' },
    { icon: '❤️', name: 'Heart Disease', desc: 'Cardiovascular risk evaluation' },
    { icon: '🩸', name: 'Hypertension', desc: 'Blood pressure risk analysis' },
    { icon: '🧠', name: 'Stroke', desc: 'Brain stroke risk prediction' },
    { icon: '🫘', name: 'Kidney Disease', desc: 'Kidney function risk assessment' }
  ]

  const stats = [
    { number: '5', label: 'Diseases Predicted' },
    { number: '95%+', label: 'Model Accuracy' },
    { number: '<5s', label: 'Response Time' },
    { number: '24/7', label: 'Available' }
  ]

  const steps = [
    { step: '01', title: 'Enter Health Data', desc: 'Fill in your basic health information and lifestyle factors' },
    { step: '02', title: 'AI Analysis', desc: 'Our ML models analyze your data instantly' },
    { step: '03', title: 'Get Results', desc: 'Receive detailed risk assessment for 5 major diseases' },
    { step: '04', title: 'Take Action', desc: 'Follow personalized health recommendations' }
  ]

  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Health Risk Prediction
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get instant risk assessment for 5 major diseases using advanced
            machine learning. Early detection saves lives.
          </p>
          <Link
            to="/assessment"
            className="bg-yellow-400 text-blue-900 font-bold px-8 py-4
                       rounded-lg text-lg hover:bg-yellow-300 transition-colors
                       inline-block"
          >
            Start Health Assessment →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-blue-900">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Diseases We Predict
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {diseases.map((disease, i) => (
              <div key={i}
                className="bg-white p-6 rounded-xl shadow-md
                           hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-3">{disease.icon}</div>
                <h3 className="font-bold text-blue-900 mb-2">
                  {disease.name}
                </h3>
                <p className="text-gray-500 text-sm">{disease.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-900 text-white rounded-full
                                flex items-center justify-center text-xl
                                font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-blue-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Check Your Health Risk?
          </h2>
          <p className="text-blue-200 mb-8">
            Free, instant, and accurate disease risk assessment
          </p>
          <Link
            to="/assessment"
            className="bg-yellow-400 text-blue-900 font-bold px-8 py-4
                       rounded-lg text-lg hover:bg-yellow-300 transition-colors
                       inline-block"
          >
            Get Started - It's Free →
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Home