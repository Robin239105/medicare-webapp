import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import OurDoctors from './pages/OurDoctors'
import DoctorProfile from './pages/DoctorProfile'
import ServicesPage from './pages/ServicesPage'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import PatientPortal from './pages/PatientPortal'
import Booking from './pages/Booking'
import AdminDashboard from './pages/AdminDashboard'
import AdminAppointments from './pages/AdminAppointments'
import AdminPatients from './pages/AdminPatients'
import AdminServices from './pages/AdminServices'
import AdminSettings from './pages/AdminSettings'
import AdminLogin from './pages/AdminLogin'
import AdminProfile from './pages/AdminProfile'
import AdminDoctors from './pages/AdminDoctors'
import AdminSidebar from './components/AdminSidebar'
import AppointmentToaster from './components/AppointmentToaster'
import PatientDashboard from './pages/PatientDashboard'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center font-black animate-pulse text-primary tracking-widest uppercase">Initializing Health Scan...</div>
  if (!user) {
    return <Navigate to="/portal" state={{ from: location }} replace />
  }
  return children
}

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center font-black animate-pulse">Initializing Security Scan...</div>
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return children
}

const AdminLayout = ({ children }) => (
  <div className="flex bg-surface min-h-screen">
    <AdminSidebar />
    <main className="ml-72 flex-1 min-h-screen overflow-auto relative">
      <AppointmentToaster />
      {children}
    </main>
  </div>
)

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 mt-20">
      {children}
    </main>
    <Footer />
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/test" element={<h1>Sanctuary Debug: HELLO WORLD</h1>} />
      {/* Public Sanctuary Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/doctors" element={<PublicLayout><OurDoctors /></PublicLayout>} />
      <Route path="/doctors/:id" element={<PublicLayout><DoctorProfile /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/portal" element={<PublicLayout><PatientPortal /></PublicLayout>} />
      <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
      <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />

      {/* Admin Management Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/appointments" element={<ProtectedAdminRoute><AdminLayout><AdminAppointments /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/patients" element={<ProtectedAdminRoute><AdminLayout><AdminPatients /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/services" element={<ProtectedAdminRoute><AdminLayout><AdminServices /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/doctors" element={<ProtectedAdminRoute><AdminLayout><AdminDoctors /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminLayout><AdminProfile /></AdminLayout></ProtectedAdminRoute>} />
      <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedAdminRoute>} />
    </Routes>
  )
}

export default App
