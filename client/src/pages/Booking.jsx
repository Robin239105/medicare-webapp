import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDoctors, getServices, getSettings, createAppointment } from '../services/api'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Stethoscope,
  Verified,
  AlertCircle,
  UserRound
} from 'lucide-react'

const Booking = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const initialServiceId = location.state?.serviceId || ''
  const initialDoctorId = location.state?.doctorId || ''

  const [step, setStep] = useState(1)
  const [successId, setSuccessId] = useState('')
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    email: user?.email || '',
    phone: '',
    doctorId: initialDoctorId,
    serviceId: initialServiceId,
    date: '',
    time: '',
    user: user?._id || null
  })

  const loadBookingData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [docsRes, servRes] = await Promise.all([getDoctors(), getServices()])
      setDoctors(docsRes.data)
      setServices(servRes.data)
      try {
        const setRes = await getSettings()
        setSettings(setRes.data)
      } catch {
        setSettings({
          slotDuration: 30,
          isMaintenanceMode: false
        })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load doctors or services. Check that the API is running (and client/.env VITE_API_URL if local), then try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookingData()
  }, [loadBookingData])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.name,
        email: user.email,
        user: user._id
      }))
    }
  }, [user])

  useEffect(() => {
    const sid = location.state?.serviceId
    const did = location.state?.doctorId
    if (sid || did) {
      setFormData((prev) => ({
        ...prev,
        ...(sid ? { serviceId: sid } : {}),
        ...(did ? { doctorId: did } : {})
      }))
    }
  }, [location.state?.serviceId, location.state?.doctorId])

  const handleBooking = async () => {
    const phone = (formData.phone || '').trim()
    if (!formData.patientName?.trim() || !formData.email?.trim() || !phone) {
      alert('Please fill in your full name, email, and phone number.')
      return
    }
    if (!formData.doctorId || !formData.serviceId || !formData.date || !formData.time) {
      alert('Missing doctor, service, date, or time. Please go back and complete each step.')
      return
    }
    try {
      const payload = {
        patientName: formData.patientName.trim(),
        email: formData.email.trim(),
        phone,
        doctor: formData.doctorId,
        service: formData.serviceId,
        date: formData.date,
        time: formData.time,
        user: formData.user
      }
      const res = await createAppointment(payload)
      setSuccessId(res.data._id || 'MC-992031')
      setStep(5)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Request failed'
      alert(`Booking could not be completed: ${msg}`)
    }
  }

  const selectedDoctor = doctors.find((d) => String(d._id) === String(formData.doctorId))
  const selectedService = services.find((s) => String(s._id) === String(formData.serviceId))

  const generateTimeSlots = () => {
    if (!formData.date || !selectedDoctor) return null

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const parts = formData.date.split('-').map(Number)
    const [y, m, d] = parts
    if (!y || !m || !d) return null
    const localDay = new Date(y, m - 1, d)
    const dayName = days[localDay.getDay()]

    const scheduleBlock = selectedDoctor.schedule?.find(s => s.day === dayName)
    const interval = settings?.slotDuration || 30

    let startTime = '09:00'
    let endTime = '17:00'

    if (scheduleBlock) {
      startTime = scheduleBlock.startTime
      endTime = scheduleBlock.endTime
    } else if (!selectedDoctor.schedule?.length) {
      if (dayName === 'Saturday' || dayName === 'Sunday') return []
    } else {
      return []
    }

    const slots = []
    let current = new Date(`1970-01-01T${startTime}:00`)
    const end = new Date(`1970-01-01T${endTime}:00`)

    while (current < end) {
      slots.push(current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
      current = new Date(current.getTime() + interval * 60000)
    }

    return slots
  }

  const availableSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-xs">Loading booking…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-8 text-center">
        <AlertCircle className="text-primary w-16 h-16 mb-6" />
        <h1 className="text-2xl font-extrabold text-on-surface mb-3">Could not load booking</h1>
        <p className="text-on-surface-variant font-medium max-w-md mb-8">{error}</p>
        <button
          type="button"
          onClick={() => loadBookingData()}
          className="sanctuary-gradient text-white px-8 py-4 rounded-xl font-bold"
        >
          Try again
        </button>
      </div>
    )
  }

  if (settings?.isMaintenanceMode) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center font-body text-center px-6">
      <div className="w-24 h-24 bg-surface-container-high rounded-3xl shadow-2xl flex items-center justify-center mb-6 border border-outline-variant/10">
        <AlertCircle className="text-primary w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-3">System Maintenance</h1>
      <p className="max-w-md text-on-surface-variant font-bold leading-relaxed opacity-80 uppercase tracking-widest text-xs">
        MediCare Clinic booking is temporarily offline for scheduled upgrades. Please try again later.
      </p>
    </div>
  )

  if (step === 5) {
    const displayRef = "MC-" + (successId.length > 5 ? successId.slice(-6).toUpperCase() : successId)
    return <SuccessScreen reference={displayRef} onBack={() => navigate('/')} />
  }

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased">
      {/* Brand Identity Header (Minimal for conversion) */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-10 h-20 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary">MediCare Clinic</div>
          <div className="flex items-center gap-6">
            <span className="text-on-surface-variant text-sm font-bold opacity-60 hidden sm:block">Need assistance?</span>
            <button className="text-primary font-bold hover:underline underline-offset-4">Contact Support</button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-8 max-w-6xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="label-md font-bold tracking-[0.2em] text-primary uppercase text-xs">Booking Progress</span>
              <h1 className="text-4xl font-extrabold text-on-surface mt-2 tracking-tight">Schedule Your Sanctuary Visit</h1>
            </div>
            <div className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-60">Step {step} of 4</div>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden cloud-shadow">
            <div 
              className="h-full sanctuary-gradient transition-all duration-700 ease-out" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-on-surface-variant tracking-[0.15em] uppercase opacity-40">
            <div className={step >= 1 ? "text-primary opacity-100" : ""}>Service</div>
            <div className={step >= 2 ? "text-primary opacity-100" : ""}>Doctor</div>
            <div className={step >= 3 ? "text-primary opacity-100" : ""}>Date & Time</div>
            <div className={step >= 4 ? "text-primary opacity-100" : ""}>Details</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Selection Area */}
          <div className="lg:col-span-8 space-y-10">
            {step === 1 && (
              <section className="bg-surface-container-high rounded-3xl p-10 shadow-2xl border border-outline-variant/10">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                  <Stethoscope className="text-primary" /> Select Medical Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map(s => (
                    <button
                      key={s._id}
                      onClick={() => { 
                        setFormData({...formData, serviceId: s._id}); 
                        if (formData.doctorId) setStep(3);
                        else setStep(2);
                      }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                        formData.serviceId === s._id 
                        ? "border-primary bg-primary/10 shadow-lg scale-[1.02] ring-4 ring-primary/5" 
                        : "border-outline-variant/10 bg-surface-container hover:border-primary/40 hover:bg-surface-container-high transition-transform duration-300"
                      }`}
                    >
                      <p className="font-bold text-lg mb-1">{s.title}</p>
                      <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest">${s.price}</p>
                      <p className="text-xs text-on-surface-variant font-medium opacity-70 line-clamp-2">{s.description}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="bg-surface-container-high rounded-3xl p-10 shadow-2xl border border-outline-variant/10">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                  <UserRound className="text-primary" /> Choose Your Specialist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map(d => (
                    <button
                      key={d._id}
                      onClick={() => { setFormData({...formData, doctorId: d._id}); setStep(3); }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                        formData.doctorId === d._id 
                        ? "border-primary bg-primary/10 shadow-lg scale-[1.02] ring-4 ring-primary/5" 
                        : "border-outline-variant/10 bg-surface-container hover:border-primary/40 hover:bg-surface-container-high transition-transform duration-300"
                      }`}
                    >
                      <img src={d.image} alt={d.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-lg">{d.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{d.specialization}</p>
                        <div className="flex items-center gap-1 text-tertiary">
                          <Verified size={14} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase">Expert</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <section className="bg-surface-container-high rounded-3xl p-10 shadow-2xl border border-outline-variant/10">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">
                    <Calendar className="text-primary" /> Select Appointment Date
                  </h2>
                  <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                    <Clock size={12} /> {selectedDoctor?.name}'s Sanctuary Hours: {selectedDoctor?.schedule?.map(s => s.day.slice(0,3)).join(', ')}
                  </p>
                  <input 
                    type="date" 
                    className="w-full p-5 bg-surface-container border-none rounded-2xl font-bold text-lg focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-inner"
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mt-8 opacity-40 grayscale pointer-events-none">
                     {/* Calendar Visual Only */}
                     {[12,13,14,15,16,17,18].map(d => (
                       <div key={d} className="flex flex-col items-center p-4 rounded-xl bg-surface-container-low border border-outline-variant/5">
                         <span className="text-[10px] font-bold uppercase mb-1">Dec</span>
                         <span className="text-xl font-black">{d}</span>
                       </div>
                     ))}
                  </div>
                </section>

                <section className="bg-surface-container-high rounded-3xl p-10 shadow-2xl border border-outline-variant/10">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                    <Clock className="text-primary" /> Available Slots
                  </h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {!formData.date ? (
                      <p className="col-span-full text-sm font-bold opacity-40 uppercase tracking-widest text-on-surface-variant">Please select a date first.</p>
                    ) : availableSlots?.length === 0 ? (
                      <p className="col-span-full text-sm font-bold text-error uppercase tracking-widest bg-error/10 p-4 rounded-xl">Doctor is unavailable on this day.</p>
                    ) : (
                      availableSlots?.map(t => (
                        <button
                          key={t}
                          onClick={() => { setFormData({...formData, time: t}); setStep(4); }}
                          className={`p-4 rounded-xl font-bold text-sm transition-all ${
                            formData.time === t 
                            ? "sanctuary-gradient text-white shadow-lg scale-105" 
                            : "bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {step === 4 && (
              <section className="bg-surface-container-high rounded-3xl p-10 shadow-2xl border border-outline-variant/10">
                <h2 className="text-2xl font-bold mb-10 flex items-center gap-4">
                  <CheckCircle2 className="text-primary" /> Confirm Details
                </h2>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Full Name</label>
                      <input 
                        className="w-full p-5 bg-surface-container-low border-none rounded-2xl font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                        placeholder="John Doe"
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Email Address</label>
                      <input 
                        className="w-full p-5 bg-surface-container-low border-none rounded-2xl font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                        placeholder="john@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Phone Number</label>
                      <input 
                        className="w-full p-5 bg-surface-container-low border-none rounded-2xl font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                        placeholder="(555) 123-4567"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="bg-surface-container rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-primary mt-1" />
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                      By confirming this booking, you agree to our 24-hour cancellation policy. A health record will be created in our secure sanctuary portal.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container rounded-[2.5rem] p-8 md:p-10 sticky top-28 border border-outline-variant/5 shadow-2xl">
              <h3 className="text-xl font-extrabold text-on-surface mb-8 tracking-tight">Visit Summary</h3>
              
              {/* Dynamic Review */}
              <div className="space-y-8">
                {selectedService && (
                  <div className="flex justify-between items-start group">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Service</p>
                      <p className="font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{selectedService.title}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-on-surface-variant opacity-40 hover:opacity-100 hover:text-primary transition-all">Edit</button>
                  </div>
                )}

                {selectedDoctor && (
                  <div className="flex justify-between items-start group">
                    <div className="flex items-center gap-4">
                      <img src={selectedDoctor.image} className="w-12 h-12 rounded-xl object-cover border border-white" alt="" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Specialist</p>
                        <p className="font-bold text-on-surface tracking-tight">{selectedDoctor.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase text-on-surface-variant opacity-40 hover:opacity-100 hover:text-primary transition-all">Edit</button>
                  </div>
                )}

                {(formData.date || formData.time) && (
                  <div className="flex justify-between items-start group">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Schedule</p>
                      <p className="font-bold text-on-surface tracking-tight">
                        {formData.date && new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {formData.date && formData.time && ' | '}
                        {formData.time}
                      </p>
                    </div>
                    <button onClick={() => setStep(3)} className="text-[10px] font-black uppercase text-on-surface-variant opacity-40 hover:opacity-100 hover:text-primary transition-all">Edit</button>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-outline-variant/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-on-surface-variant">
                  <span>Service Fee</span>
                  <span>${selectedService?.price || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-on-surface-variant">
                  <span>Consultation</span>
                  <span className="text-tertiary">Included</span>
                </div>
                <div className="flex justify-between items-center text-2xl pt-6">
                  <span className="font-black text-on-surface tracking-tighter">Total</span>
                  <span className="font-black text-primary">${selectedService?.price || '0.00'}</span>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                {step < 4 ? (
                  <button 
                    onClick={() => {
                      if(step === 1 && !formData.serviceId) return;
                      if(step === 2 && !formData.doctorId) return;
                      if(step === 3 && (!formData.date || !formData.time)) return;
                      setStep(step + 1);
                    }}
                    className="w-full py-5 sanctuary-gradient text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleBooking}
                    className="w-full py-5 sanctuary-gradient text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={20} /> Confirm Appointment
                  </button>
                )}
                
                {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="w-full py-4 text-on-surface-variant font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-3"
                  >
                    <ChevronLeft size={16} /> Previous Phase
                  </button>
                )}
              </div>
            </div>

            <div className="bg-tertiary/10 p-6 rounded-[2rem] border border-tertiary/20 flex items-start gap-4">
              <ShieldCheck className="text-tertiary shrink-0" size={24} />
              <p className="text-[10px] font-bold text-on-tertiary-fixed-variant leading-relaxed uppercase tracking-wider">
                Enterprise-grade security enforced. Your privacy is our priority in this sanctuary.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

const SuccessScreen = ({ reference, onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-surface p-8">
    <div className="max-w-md w-full text-center space-y-10">
      <div className="w-32 h-32 bg-tertiary text-white rounded-full flex items-center justify-center mx-auto shadow-2xl ring-[12px] ring-tertiary/10 animate-scale-in">
        <CheckCircle2 size={64} strokeWidth={3} />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Appointment Confirmed!</h2>
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed px-4">
          Your journey to wellness has begun. Check your email for sanctuary arrival instructions.
        </p>
      </div>
      <div className="bg-surface-container p-10 rounded-[2.5rem] shadow-2xl space-y-6 border border-outline-variant/5">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Booking Reference</p>
        <div className="text-4xl font-black text-primary tracking-[0.2em]">{reference}</div>
      </div>
      <div className="flex flex-col gap-4">
        <button className="w-full py-5 sanctuary-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">Add to Calendar</button>
        <button onClick={onBack} className="w-full py-5 bg-surface-container-low text-on-surface font-black rounded-2xl border border-outline-variant/10 hover:bg-white transition-all">Return to Home</button>
      </div>
    </div>
  </div>
)

export default Booking
