// HealthGuard AI - About Page

function About() {
  const technologies = [
    { category: 'Backend', items: ['FastAPI', 'Python 3.13', 'Uvicorn', 'Pydantic'] },
    { category: 'Machine Learning', items: ['scikit-learn', 'XGBoost', 'SHAP', 'Neural Network'] },
    { category: 'Frontend', items: ['React.js', 'Tailwind CSS', 'Recharts', 'Axios'] },
    { category: 'Data Processing', items: ['pandas', 'NumPy', 'SMOTE', 'StandardScaler'] }
  ]

  const diseases = [
    { name: 'Diabetes', model: 'XGBoost', accuracy: '95.68%', icon: '🩺' },
    { name: 'Heart Disease', model: 'Random Forest', accuracy: '84.38%', icon: '❤️' },
    { name: 'Hypertension', model: 'XGBoost', accuracy: '98.76%', icon: '🩸' },
    { name: 'Stroke', model: 'Neural Network', accuracy: '96.86%', icon: '🧠' },
    { name: 'Kidney Disease', model: 'Logistic Regression', accuracy: '100%', icon: '🫘' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          About HealthGuard AI
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl mx-auto">
          An AI-powered web application developed as Final Year Project
          at University of Sindh, Jamshoro for predicting risk of
          5 major diseases using machine learning.
        </p>
      </div>

      {/* Model Performance */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Model Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 text-left rounded-tl-lg">Disease</th>
                <th className="p-3 text-left">Best Model</th>
                <th className="p-3 text-left">Accuracy</th>
                <th className="p-3 text-left rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((d, i) => (
                <tr key={i}
                  className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-medium">
                    {d.icon} {d.name}
                  </td>
                  <td className="p-3 text-gray-600">{d.model}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1
                                     rounded-full text-sm font-medium">
                      {d.accuracy}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-green-600">✅ Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technologies */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Technologies Used
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-900 mb-3">
                {tech.category}
              </h3>
              <ul className="space-y-1">
                {tech.items.map((item, j) => (
                  <li key={j} className="text-gray-600 text-sm flex
                                         items-center gap-2">
                    <span className="text-blue-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Project Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-900 rounded-full
                              flex items-center justify-center text-white
                              text-2xl mx-auto mb-4">
                👤
              </div>
              <h3 className="font-bold text-blue-900">Team Member {i + 1}</h3>
              <p className="text-gray-500 text-sm">BS Information Technology</p>
              <p className="text-gray-400 text-xs mt-1">
                University of Sindh
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Disclaimer</h3>
        <p className="text-yellow-700 text-sm">
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