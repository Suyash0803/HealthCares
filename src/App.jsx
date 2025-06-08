import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Lazy loaded component
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Doctors from './components/Doctors-apply'
import DoctorCard from './components/DoctorCard'
import ViewDoctor from './pages/Doctors'
import Error from './pages/Error'
import DoctorProfile from './pages/Doctors-info'
import BookingAppointment from './components/BookAppointment'
import Appointment from './pages/Appointment'
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
          <Route
            path="/login"
            element={
            
                <Login />
        
            }
          
          />
          <Route
            path="/applyfordoctor"
            element={
              <Doctors />
            }
          />
          <Route
            path="/doctors"
            element={
              <ViewDoctor/>
            }
          />
          <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path='/doctors/book-appointment' element={<BookingAppointment />} />
          <Route path='/appointments' element={<Appointment />} />
          <Route path="*" element={<Error />} />

        </Routes>
        
      </Suspense>
    </Router>
  )
}

export default App
