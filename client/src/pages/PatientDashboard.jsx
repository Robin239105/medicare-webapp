import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPatientProfile, updatePatientProfile } from '../services/api'
import { 
  User, 
  Calendar, 
  Activity, 
  Pill, 
  FileText, 
  Clock, 
  ChevronRight, 
  LogOut, 
  Bell, 
  TrendingUp,
  Heart,
  Droplets,
  Edit3,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const StatCard = ({ icon: Icon, label, value, unit, color, bg }) => (
  <div className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <TrendingUp size={16} className="text-tertiary opacity-40" />
    </div>
    <div>
      <h4 className="text-3xl font-black text-on-surface tracking-tighter">{value}<span className="text-sm font-bold text-on-surface-variant opacity-40 ml-1 uppercase">{unit}</span></h4>
      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-1 opacity-60">{label}</p>
    </div>
  </div>
)

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [editData, setEditData] = useState({ height: '', weight: '', bloodType: '', allergies: '', chronicConditions: '' })
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPatientProfile()
        setProfile(res.data.user)
        setAppointments(res.data.appointments)
        setEditData({
          height: res.data.user.medicalProfile?.height || '',
          weight: res.data.user.medicalProfile?.weight || '',
          bloodType: res.data.user.medicalProfile?.bloodType || '',
          allergies: res.data.user.medicalProfile?.allergies?.join(', ') || '',
          chronicConditions: res.data.user.medicalProfile?.chronicConditions?.join(', ') || ''
        })
      } catch (err) {
        console.error('Failed to synchronize dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    
    // Refresh appointments every 30 seconds
    const refreshInterval = setInterval(fetchData, 30000)
    return () => clearInterval(refreshInterval)
  }, [])

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isNotificationOpen && !e.target.closest('.notification-container')) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isNotificationOpen])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const formattedData = {
        ...editData,
        allergies: editData.allergies.split(',').map(s => s.trim()).filter(s => s),
        chronicConditions: editData.chronicConditions.split(',').map(s => s.trim()).filter(s => s)
      }
      const res = await updatePatientProfile({ medicalProfile: formattedData })
      setProfile(res.data)
      setIsEditModalOpen(false)
    } catch (err) {
      alert('Failed to update sanctuary record.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synchronizing Clinical Data</p>
      </div>
    </div>
  )

  const activePrescriptions = profile?.prescriptions || []

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      {/* Top Navigation / Header */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 sticky top-0 z-40 px-6 py-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl sanctuary-gradient flex items-center justify-center text-white shadow-lg">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">Health Sanctuary</h2>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Personal Portal • {profile?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="notification-container relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-3 bg-surface-container rounded-xl text-on-surface-variant hover:text-primary transition-all relative"
              >
                <Bell size={20} />
                {appointments.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface animate-pulse"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-16 right-0 w-96 max-h-96 bg-surface-container rounded-3xl shadow-2xl border border-outline-variant overflow-hidden z-50">
                  <div className="bg-primary/5 px-6 py-4 border-b border-outline-variant/20">
                    <h3 className="font-black text-on-surface text-sm">Appointment Updates</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mt-1">You have {appointments.length} {appointments.length === 1 ? 'session' : 'sessions'}</p>
                  </div>
                  
                  <div className="overflow-y-auto max-h-72">
                    {appointments.length > 0 ? (
                      appointments.map((appt) => {
                        const dateObj = new Date(appt.date);
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                        
                        return (
                          <div key={appt._id} className="px-6 py-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-all">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-black text-primary">{month}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-bold text-sm text-on-surface truncate">{appt.doctor?.name}</p>
                                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter flex-shrink-0 ${
                                    appt.status === 'Confirmed' ? 'bg-tertiary/10 text-tertiary' : 
                                    appt.status === 'Completed' ? 'bg-secondary/10 text-secondary' : 
                                    appt.status === 'Cancelled' ? 'bg-error/10 text-error' : 
                                    'bg-primary/10 text-primary'
                                  }`}>
                                    {appt.status}
                                  </span>
                                </div>
                                <p className="text-[10px] font-bold text-on-surface-variant opacity-60">
                                  {day} {month} • {appt.time}
                                </p>
                                <p className="text-[9px] font-medium text-on-surface-variant opacity-50 mt-1">
                                  {appt.service?.title || 'General Consultation'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <Calendar size={32} className="mx-auto text-outline-variant opacity-20 mb-3" />
                        <p className="text-sm font-bold text-on-surface-variant opacity-60">No appointments scheduled</p>
                        <p className="text-[10px] font-medium text-on-surface-variant opacity-40 mt-1">Book your first session today</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/10">
                    <Link to="/booking" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4">
                      Book New Appointment →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-error/5 text-error rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-error/10 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Greeting & Stats */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-surface-container rounded-[2.5rem] p-10 border border-outline-variant shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={180} />
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Welcome home, {profile?.name.split(' ')[0]}</span>
              <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-6 leading-[1.1]">
                Your Wellness <br/> <span className="text-primary italic font-medium">Is Our Mastery.</span>
              </h1>
              <div className="flex gap-4">
                <Link to="/booking" className="px-8 py-4 sanctuary-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                  <Calendar size={16} /> New Appointment
                </Link>
                <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-4 bg-surface rounded-2xl border border-outline-variant text-on-surface font-black text-xs uppercase tracking-widest hover:bg-surface-container transition-all flex items-center gap-2">
                  <Edit3 size={16} /> Update Vitals
                </button>
              </div>
            </div>
          </section>

          {/* Vitals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={Droplets} label="Blood Type" value={profile?.medicalProfile?.bloodType || 'A+'} unit="" color="text-error" bg="bg-error/10" />
            <StatCard icon={Activity} label="Body Height" value={profile?.medicalProfile?.height || '--'} unit="cm" color="text-primary" bg="bg-primary/10" />
            <StatCard icon={TrendingUp} label="Last Weight" value={profile?.medicalProfile?.weight || '--'} unit="kg" color="text-secondary" bg="bg-secondary/10" />
          </div>

          {/* Upcoming Appointments */}
          <section className="bg-surface-container rounded-[2.5rem] p-10 border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-on-surface tracking-tight">Clinical Sessions</h3>
              <Link to="/doctors" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-8">Find a Specialist</Link>
            </div>
            
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appt) => {
                  const dateObj = new Date(appt.date);
                  const day = String(dateObj.getDate()).padStart(2, '0');
                  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                  
                  return (
                  <div key={appt._id} className="flex items-center gap-6 p-6 bg-surface rounded-3xl border border-outline-variant hover:border-primary/30 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container flex flex-col items-center justify-center border border-outline-variant group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="text-[10px] font-black uppercase opacity-60">{month}</span>
                      <span className="text-xl font-black">{day}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-on-surface">{appt.doctor?.name || 'Dr. Julian Vance'}</h4>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          appt.status === 'Confirmed' ? 'bg-tertiary/10 text-tertiary' : 
                          appt.status === 'Completed' ? 'bg-secondary/10 text-secondary' : 
                          appt.status === 'Cancelled' ? 'bg-error/10 text-error' : 
                          'bg-primary/10 text-primary'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium opacity-60 flex items-center gap-2">
                        <Clock size={12} /> {appt.time} • {appt.service?.title || 'General Consultation'}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-outline-variant opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  )
                })
              ) : (
                <div className="py-12 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
                  <Calendar size={48} className="mx-auto text-outline-variant opacity-20 mb-4" />
                  <p className="text-on-surface-variant font-bold text-sm">No upcoming sessions detected.</p>
                  <p className="text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest mt-2">The sanctuary is ready for your booking.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Prescriptions & Profile Details */}
        <div className="lg:col-span-4 space-y-10">
          {/* Quick Profile */}
          <section className="bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <img 
                src="https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=200&auto=format&fit=crop" 

                className="w-24 h-24 rounded-3xl object-cover border-4 border-surface shadow-xl"
                alt="Patient Profile"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-tertiary text-white rounded-xl shadow-lg border-2 border-surface">
                <CheckCircle size={14} />
              </div>
            </div>
            <h3 className="text-xl font-bold">{profile?.name}</h3>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mt-1">Patient ID #S{profile?._id.slice(-4).toUpperCase()}</p>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant text-left">
                <div>
                  <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Contact Status</p>
                  <p className="text-[11px] font-bold">{profile?.phone || 'No Phone Linked'}</p>
                </div>
                <Edit3 size={14} className="text-outline-variant" />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant text-left">
                <div>
                  <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Email Protocol</p>
                  <p className="text-[11px] font-bold">{profile?.email}</p>
                </div>
                <AlertCircle size={14} className="text-outline-variant opacity-20" />
              </div>
            </div>
          </section>

          {/* Active Prescriptions */}
          <section className="bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant shadow-sm">
            <h3 className="text-xl font-black text-on-surface mb-6 flex items-center gap-3">
              <Pill className="text-primary" size={24} /> Prescription Pad
            </h3>
            <div className="space-y-4">
              {activePrescriptions.length > 0 ? (
                activePrescriptions.map((p, i) => (
                  <div key={i} className="p-4 bg-surface rounded-2xl border border-outline-variant hover:border-primary/20 transition-all">
                    <p className="text-sm font-bold text-on-surface mb-1">{p.medication}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.dosage}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-40 italic">{p.frequency}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant opacity-40">
                  <FileText className="mx-auto text-outline-variant mb-2" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Digital Pad is Empty</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              Request Refill
            </button>
          </section>

          {/* Medical Alerts / Conditions */}
          <section className="bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant shadow-sm">
            <h3 className="text-xl font-black text-on-surface mb-6 flex items-center gap-3">
              <ShieldCheck className="text-tertiary" size={24} /> Health Alerts
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-3">Recorded Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.medicalProfile?.allergies?.length > 0 ? (
                    profile.medicalProfile.allergies.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-error/10 text-error rounded-lg text-[10px] font-bold border border-error/10">{a}</span>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-on-surface-variant opacity-40 italic">No allergies recorded.</span>
                  )}
                </div>
              </div>
              <div className="h-px bg-outline-variant/10" />
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-3">Chronic Conditions</p>
                <div className="space-y-2">
                  {profile?.medicalProfile?.chronicConditions?.length > 0 ? (
                    profile.medicalProfile.chronicConditions.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-on-surface">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary" /> {c}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-medium text-on-surface-variant opacity-40 italic">No chronic conditions recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Vitals Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
          <div className="bg-surface rounded-[2.5rem] shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 sanctuary-gradient text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Sync Vitals</h3>
                <p className="text-xs font-medium opacity-80">Update your clinical sanctuary record</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Height (cm)</label>
                  <input 
                    required 
                    type="number" 
                    value={editData.height}
                    onChange={e => setEditData({...editData, height: e.target.value})}
                    className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    placeholder="180"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Weight (kg)</label>
                  <input 
                    required 
                    type="number" 
                    value={editData.weight}
                    onChange={e => setEditData({...editData, weight: e.target.value})}
                    className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    placeholder="75"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Blood Group</label>
                <select 
                  value={editData.bloodType}
                  onChange={e => setEditData({...editData, bloodType: e.target.value})}
                  className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                >
                  <option value="Not Set">Select Type</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Allergies (Comma separated)</label>
                <textarea 
                  value={editData.allergies}
                  onChange={e => setEditData({...editData, allergies: e.target.value})}
                  className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold min-h-[80px] outline-none"
                  placeholder="Peanuts, Penicillin, etc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Chronic Conditions (Comma separated)</label>
                <textarea 
                  value={editData.chronicConditions}
                  onChange={e => setEditData({...editData, chronicConditions: e.target.value})}
                  className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold min-h-[80px] outline-none"
                  placeholder="Hypertension, Asthma, etc."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 font-bold text-on-surface-variant hover:bg-surface-container transition-all rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 sanctuary-gradient text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all rounded-2xl flex items-center justify-center gap-2">
                  <Save size={16} /> Synchronize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDashboard
