import React, { useState, useEffect } from 'react'
import { getAppointments } from '../services/api'
import { Bell, X, CalendarCheck } from 'lucide-react'

const AppointmentToaster = () => {
  const [lastCheck, setLastCheck] = useState(new Date().toISOString())
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments()
        const newAppointments = res.data.filter(app => new Date(app.createdAt) > new Date(lastCheck))
        
        if (newAppointments.length > 0) {
          setToasts(prev => [...prev, ...newAppointments])
          setLastCheck(new Date().toISOString()) // Update cursor to newest
        }
      } catch (error) {
        console.error('Toaster sync failed:', error)
      }
    }

    const interval = setInterval(fetchAppointments, 15000) // Poll every 15 seconds
    return () => clearInterval(interval)
  }, [lastCheck])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t._id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
      {toasts.map((toast) => (
        <div 
          key={toast._id} 
          className="bg-white rounded-2xl shadow-2xl p-6 border border-outline-variant/10 w-80 animate-in slide-in-from-bottom-5 fade-in duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20">
            <div className="w-full h-full bg-primary animate-pulse"></div>
          </div>
          
          <div className="flex justify-between items-start mb-2 pl-2">
            <div className="flex items-center gap-2 text-primary">
              <Bell size={16} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">New Appointment</span>
            </div>
            <button onClick={() => removeToast(toast._id)} className="text-on-surface-variant opacity-40 hover:opacity-100 hover:text-error transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="pl-2">
            <p className="font-extrabold text-sm text-on-surface tracking-tight truncate">{toast.patientName} booked a session.</p>
            <p className="text-xs font-bold text-on-surface-variant mt-1 flex items-center gap-2">
              <CalendarCheck size={12} className="text-tertiary" />
              {toast.date} at {toast.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AppointmentToaster
