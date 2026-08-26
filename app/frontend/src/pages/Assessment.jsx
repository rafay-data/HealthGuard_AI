// HealthGuard AI - Health Assessment Form

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictDiseases } from '../services/api'
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react'

const STEP_LABELS = ['Personal Info', 'Health Data', 'Lifestyle', 'Medical History']

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
    age: '', gender: '', weight: '', height: '', bmi: '',
    bp_systolic: '', bp_diastolic: '', heart_rate: '',
    glucose: '', cholesterol: '', hemoglobin: '', creatinine: '',
    blood_urea: '', smoking: '', exercise: '', alcohol: '',
    pregnancies: '', salt_intake: '', stress_score: '', sleep_duration: '',
    family_history: '', previous_disease: '', chest_pain: '',
    diabetes_history: '', hypertension_history: '',
    ever_married: '', work_type: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'weight' || name === 'height') {
        const w = parseFloat(updated.weight)
        const h = parseFloat(updated.height) / 100
        if (w && h) updated.bmi = (w / (h * h)).toFixed(1)
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

  const inputClass = "w-full border border-slate/20 rounded-lg px-4 py-3 " +
    "text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
  const selectClass = inputClass + " bg-white"
  const labelClass = "block text-xs font-medium text-slate mb-2"

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-14">

        <div className="text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-accent
                           uppercase mb-3 inline-block">
            Step {step} of 4
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-2">
            Health Risk Assessment
          </h1>
          <p className="text-slate text-sm">
            Fill in your health information for instant risk prediction
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-between mb-10">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex flex-col items-center w-1/4">
              <div className={`w-9 h-9 rounded-full flex items-center
                justify-center font-mono text-xs font-semibold transition-colors
                ${step > i + 1 ? 'bg-mint text-white' :
                  step === i + 1 ? 'bg-ink text-paper' :
                  'bg-slate/10 text-slate'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-[11px] text-slate mt-2 text-center">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate/10 p-8">

          {step === 1 && (
            <div>
              <h2 className="font-display font-semibold text-ink mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-5">
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
                  <div className="col-span-2 bg-paper rounded-lg p-4 flex items-center gap-2">
                    <span className="font-mono text-ink font-semibold">
                      BMI: {formData.bmi}
                    </span>
                    <span className="text-slate text-sm">
                      {formData.bmi < 18.5 ? '(Underweight)' :
                       formData.bmi < 25 ? '(Normal)' :
                       formData.bmi < 30 ? '(Overweight)' : '(Obese)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display font-semibold text-ink mb-6">
                Health Measurements
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Systolic BP (mmHg)</label>
                  <input type="number" name="bp_systolic" value={formData.bp_systolic}
                    onChange={handleChange} placeholder="e.g. 120" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Diastolic BP (mmHg)</label>
                  <input type="number" name="bp_diastolic" value={formData.bp_diastolic}
                    onChange={handleChange} placeholder="e.g. 80" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Blood Glucose (mg/dl)</label>
                  <input type="number" name="glucose" value={formData.glucose}
                    onChange={handleChange} placeholder="e.g. 100" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cholesterol (mg/dl)</label>
                  <input type="number" name="cholesterol" value={formData.cholesterol}
                    onChange={handleChange} placeholder="e.g. 200" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heart Rate (bpm)</label>
                  <input type="number" name="heart_rate" value={formData.heart_rate}
                    onChange={handleChange} placeholder="e.g. 75" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Hemoglobin (g/dl)</label>
                  <input type="number" name="hemoglobin" value={formData.hemoglobin}
                    onChange={handleChange} placeholder="e.g. 13" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Creatinine (mg/dl)</label>
                  <input type="number" name="creatinine" value={formData.creatinine}
                    onChange={handleChange} placeholder="e.g. 1.0" step="0.1" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Blood Urea (mg/dl)</label>
                  <input type="number" name="blood_urea" value={formData.blood_urea}
                    onChange={handleChange} placeholder="e.g. 30" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display font-semibold text-ink mb-6">
                Lifestyle Factors
              </h2>
              <div className="grid grid-cols-2 gap-5">
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
                  <input type="number" name="salt_intake" value={formData.salt_intake}
                    onChange={handleChange} placeholder="e.g. 6" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stress Level (0-10)</label>
                  <input type="number" name="stress_score" value={formData.stress_score}
                    onChange={handleChange} placeholder="0=None, 10=Very high"
                    min="0" max="10" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sleep Hours (per day)</label>
                  <input type="number" name="sleep_duration" value={formData.sleep_duration}
                    onChange={handleChange} placeholder="e.g. 7" className={inputClass} />
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
                  <label className={labelClass}>Pregnancies (Women only)</label>
                  <input type="number" name="pregnancies" value={formData.pregnancies}
                    onChange={handleChange} placeholder="0 if not applicable"
                    className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display font-semibold text-ink mb-6">
                Medical History
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Family History of Diseases</label>
                  <select name="family_history" value={formData.family_history}
                    onChange={handleChange} className={selectClass}>
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Previous Disease History</label>
                  <select name="previous_disease" value={formData.previous_disease}
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
                  <select name="diabetes_history" value={formData.diabetes_history}
                    onChange={handleChange} className={selectClass}>
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Hypertension History</label>
                  <select name="hypertension_history" value={formData.hypertension_history}
                    onChange={handleChange} className={selectClass}>
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-center gap-2 p-4 bg-accent/10
                            text-accent rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-5 py-3
                           border border-slate/20 text-ink rounded-lg
                           text-sm font-medium hover:bg-paper transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                Previous
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)}
                className="ml-auto inline-flex items-center gap-1.5 px-5 py-3
                           bg-ink text-paper rounded-lg text-sm font-medium
                           hover:bg-ink/90 transition-colors">
                Next
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="ml-auto inline-flex items-center gap-2 px-6 py-3
                           bg-accent text-paper rounded-lg text-sm font-semibold
                           hover:bg-accent/90 disabled:opacity-50 transition-colors">
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                {loading ? 'Analyzing...' : 'Predict My Risk'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Assessment