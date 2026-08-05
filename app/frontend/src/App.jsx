// HealthGuard AI - Main App
// React Router Setup

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App