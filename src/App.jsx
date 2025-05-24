import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Lazy loaded component
import Home from './pages/Home'
import Register from './pages/Register'
function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
            
                <Register />
        
            }
          
          />
        </Routes>
        
      </Suspense>
    </Router>
  )
}

export default App
