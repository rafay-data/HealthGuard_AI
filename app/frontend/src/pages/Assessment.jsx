// HealthGuard AI - Health Assessment Form
// Updated with empty field validation logic

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictDiseases } from '../services/api'

const REQUIRED_FIELDS = [
  'age', 'gender', 'weight', 'height',
  'bp_systolic', 'bp_diastolic', 'glucose',
  'smoking', 'exercise', 'alcohol',
  'family_history', 'previous_disease'
]

function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Personal
    age: '',
    gender: '',
    weight: '',
    height: '',
    bmi: '',
    // Vital Signs
    bp_systolic: '',
    bp_diastolic: '',
    heart_rate: '',
    // Lab Results
    glucose: '',
    cholesterol: '',
    hemoglobin: '',
    creatinine: '',
    blood_urea: '',
    // Lifestyle
    smoking: '',
    exercise: '',
    alcohol: '',
    pregnancies: '',
    salt_intake: '',
    stress_score: '',
    sleep_duration: '',
    // Medical History
    family_history: '',
    previous_disease: '',
    chest_pain: '',
    diabetes_history: '',
    hypertension_history: '',
    ever_married: '',
    work_type: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'weight' || name === 'height') {
        const w = parseFloat(updated.weight)
        const h = parseFloat(updated.height) / 100
        if (w && h) {
          updated.bmi = (w / (h * h)).toFixed(1)
        }
      }
      return updated
    })
  }

  const handleSubmit = async () => {
    setError('')

    const missing = REQUIRED_FIELDS.filter(
      key => formData[key] === '' || formData[key] === null
    )
    if (missing.length > 0) {
      setError('Please fill in all required fields before submitting.')
      return
    }

    setLoading(true)
    try {
      const payload = {}
      Object.keys(formData).forEach(key => {
        payload[key] = parseFloat(formData[key]) || 0
      })
      const results = await predictDiseases(payload)
      navigate('/results', { state: { results, formData } })
    } catch (err) {
      setError('Prediction failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"
  const selectClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 bg-white"

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">
        Health Risk Assessment
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Fill in your health information for instant risk prediction
      </p>

      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {['Personal Info', 'Health Data', 'Lifestyle', 'Medical History'].map(
          (label, i) => (
            <div key={i} className="flex flex-col items-center w-1/4">
              <div className={`w-10 h-10 rounded-full flex items-center
                justify-center font-bold text-sm
                ${step > i + 1 ? 'bg-green-500 text-white' :
                  step === i + 1 ? 'bg-blue-900 text-white' :
                  'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-500 mt-1 text-center">
                {label}
              </span>
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Age (years)</label>
                <input type="number" name="age" value={formData.age}
                  onChange={handleChange} placeholder="Enter your age"
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={formData.gender}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight}
                  onChange={handleChange} placeholder="e.g. 70"
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Height (cm)</label>
                <input type="number" name="height" value={formData.height}
                  onChange={handleChange} placeholder="e.g. 170"
                  className={inputClass} />
              </div>
              {formData.bmi && (
                <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
                  <span className="text-blue-900 font-bold">
                    Your BMI: {formData.bmi}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {formData.bmi < 18.5 ? '(Underweight)' :
                     formData.bmi < 25 ? '(Normal)' :
                     formData.bmi < 30 ? '(Overweight)' : '(Obese)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Health Data */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Health Measurements
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Systolic BP (mmHg)</label>
                <input type="number" name="bp_systolic"
                  value={formData.bp_systolic} onChange={handleChange}
                  placeholder="e.g. 120" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Diastolic BP (mmHg)</label>
                <input type="number" name="bp_diastolic"
                  value={formData.bp_diastolic} onChange={handleChange}
                  placeholder="e.g. 80" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Blood Glucose (mg/dl)</label>
                <input type="number" name="glucose"
                  value={formData.glucose} onChange={handleChange}
                  placeholder="e.g. 100" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Cholesterol (mg/dl)</label>
                <input type="number" name="cholesterol"
                  value={formData.cholesterol} onChange={handleChange}
                  placeholder="e.g. 200" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Heart Rate (bpm)</label>
                <input type="number" name="heart_rate"
                  value={formData.heart_rate} onChange={handleChange}
                  placeholder="e.g. 75" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hemoglobin (g/dl)</label>
                <input type="number" name="hemoglobin"
                  value={formData.hemoglobin} onChange={handleChange}
                  placeholder="e.g. 13" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Creatinine (mg/dl)</label>
                <input type="number" name="creatinine"
                  value={formData.creatinine} onChange={handleChange}
                  placeholder="e.g. 1.0" step="0.1"
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Blood Urea (mg/dl)</label>
                <input type="number" name="blood_urea"
                  value={formData.blood_urea} onChange={handleChange}
                  placeholder="e.g. 30" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Lifestyle Factors
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Smoking Status</label>
                <select name="smoking" value={formData.smoking}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">Never Smoked</option>
                  <option value="1">Former Smoker</option>
                  <option value="2">Current Smoker</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Exercise Frequency</label>
                <select name="exercise" value={formData.exercise}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">Never</option>
                  <option value="1">Rarely</option>
                  <option value="2">Sometimes</option>
                  <option value="3">Often</option>
                  <option value="4">Daily</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Alcohol Consumption</label>
                <select name="alcohol" value={formData.alcohol}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">None</option>
                  <option value="1">Light</option>
                  <option value="2">Moderate</option>
                  <option value="3">Heavy</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Salt Intake (grams/day)</label>
                <input type="number" name="salt_intake"
                  value={formData.salt_intake} onChange={handleChange}
                  placeholder="e.g. 6" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Stress Level (0-10)</label>
                <input type="number" name="stress_score"
                  value={formData.stress_score} onChange={handleChange}
                  placeholder="0=No stress, 10=Very high"
                  min="0" max="10" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sleep Hours (per day)</label>
                <input type="number" name="sleep_duration"
                  value={formData.sleep_duration} onChange={handleChange}
                  placeholder="e.g. 7" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ever Married</label>
                <select name="ever_married" value={formData.ever_married}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Work Type</label>
                <select name="work_type" value={formData.work_type}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">Children</option>
                  <option value="1">Government</option>
                  <option value="2">Private</option>
                  <option value="3">Self Employed</option>
                  <option value="4">Never Worked</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Pregnancies (Women only)
                </label>
                <input type="number" name="pregnancies"
                  value={formData.pregnancies} onChange={handleChange}
                  placeholder="0 if not applicable"
                  className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Medical History */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Medical History
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Family History of Diseases
                </label>
                <select name="family_history"
                  value={formData.family_history}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Previous Disease History
                </label>
                <select name="previous_disease"
                  value={formData.previous_disease}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Chest Pain Type</label>
                <select name="chest_pain" value={formData.chest_pain}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No Pain</option>
                  <option value="1">Typical Angina</option>
                  <option value="2">Atypical Angina</option>
                  <option value="3">Non-Anginal Pain</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Diabetes History</label>
                <select name="diabetes_history"
                  value={formData.diabetes_history}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Hypertension History</label>
                <select name="hypertension_history"
                  value={formData.hypertension_history}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-blue-900 text-blue-900
                         rounded-lg font-medium hover:bg-blue-50">
              ← Previous
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-3 bg-blue-900 text-white
                         rounded-lg font-medium hover:bg-blue-800">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="ml-auto px-8 py-3 bg-yellow-400 text-blue-900
                         rounded-lg font-bold hover:bg-yellow-300
                         disabled:opacity-50">
              {loading ? 'Analyzing...' : '🔮 Predict My Risk'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Assessment