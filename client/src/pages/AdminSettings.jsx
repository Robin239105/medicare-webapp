import React, { useState, useEffect } from 'react'
import { getSettings, saveSettings, updateAdminProfile } from '../services/api'
import { 
  Home, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  RefreshCcw, 
  Lock, 
  Save, 
  X,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react'

const InputGroup = ({ label, value, onChange, icon }) => (
  <div className="space-y-3 group">
    <label className="block text-[10px] font-black tracking-[0.2em] text-on-surface-variant opacity-40 uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity">
        {icon}
      </div>
      <input 
        className="w-full bg-surface-container-high border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-4 focus:ring-primary/10 text-on-surface font-bold text-sm transition-all shadow-inner" 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
)

const HoursRow = ({ days, open, close, onChangeOpen, onChangeClose }) => (
  <div className="flex items-center justify-between py-4 border-b border-outline-variant/10 group">
    <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors uppercase tracking-widest">{days}</span>
    <div className="flex items-center gap-4 bg-surface-container-high p-2 rounded-xl border border-outline-variant/10">
      <input 
        className="w-16 text-center text-xs font-black py-2 bg-surface text-on-surface border-none rounded-lg shadow-inner focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
        type="time" 
        value={open}
        onChange={(e) => onChangeOpen && onChangeOpen(e.target.value)}
      />
      <span className="text-outline-variant opacity-40 font-black">-</span>
      <input 
        className="w-16 text-center text-xs font-black py-2 bg-surface text-on-surface border-none rounded-lg shadow-inner focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
        type="time" 
        value={close}
        onChange={(e) => onChangeClose && onChangeClose(e.target.value)}
      />
    </div>
  </div>
)

const SlotButton = ({ time, unit, active, onClick }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300 ${
    active 
    ? "bg-primary/10 border-primary shadow-xl scale-105" 
    : "border-outline-variant/10 bg-surface-container-high hover:border-primary/40 hover:bg-primary/5"
  }`}>
    <span className={`text-2xl font-black ${active ? "text-primary" : "text-on-surface"}`}>{time}</span>
    <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{unit}</span>
    {active && <div className="absolute -top-3 -right-3 sanctuary-gradient text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">Current</div>}
  </button>
)

const SecurityInput = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-3 group">
    <label className="block text-[10px] font-black tracking-[0.2em] text-on-surface-variant opacity-40 uppercase">{label}</label>
    <input 
      className="w-full bg-surface-container-high border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 text-on-surface font-bold text-sm transition-all shadow-inner placeholder:text-on-surface-variant placeholder:opacity-20" 
      placeholder={placeholder} 
      type="password" 
      value={value}
      onChange={onChange}
    />
  </div>
)

const AdminSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [formData, setFormData] = useState({
    clinicName: 'MediCare Clinic Sanctuary',
    contactEmail: 'admin@medicare-sanctuary.com',
    physicalAddress: '742 Evergreen Terrace, Medical District',
    primaryPhone: '+1 (555) 000-1234',
    websiteUrl: 'www.medicare-sanctuary.com',
    slotDuration: '30',
    emailAlerts: true,
    isMaintenanceMode: false,
    openingHours: {
      weekdays: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '14:00' }
    }
  })

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwdStatus, setPwdStatus] = useState('idle')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings()
        if (res.data) {
          setFormData(prev => ({ ...prev, ...res.data }))
        }
      } catch (err) {
        console.error('Failed to fetch settings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleHoursChange = (dayType, timeType, val) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [dayType]: {
          ...prev.openingHours[dayType],
          [timeType]: val
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaveStatus('saving')
      await saveSettings(formData)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  const handleUpdateCredentials = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      setPwdStatus('saving')
      await updateAdminProfile({ password: pwdForm.newPassword })
      setPwdStatus('saved')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwdStatus('idle'), 3000)
    } catch (err) {
      setPwdStatus('error')
      alert(err.response?.data?.message || 'Failed to update credentials')
      setTimeout(() => setPwdStatus('idle'), 3000)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface italic font-bold">Synchronizing Protocols...</div>

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      <header className="p-10 lg:p-12 mb-8 bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant/10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Administrative Settings</h2>
        <p className="text-on-surface-variant text-lg max-w-2xl font-medium opacity-80">Configure sanctuary parameters, operational hours, and security protocols.</p>
      </header>

      <main className="px-10 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Clinic Identity & Schedule */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section: Clinic Identity */}
            <section className="bg-surface-container rounded-[3rem] p-10 shadow-sm border border-outline-variant">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-2xl sanctuary-gradient flex items-center justify-center text-white shadow-lg">
                  <Home size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Clinic Identity</h3>
                  <p className="text-xs font-black text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">Public Sanctuary Branding</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Clinic Name" value={formData.clinicName} onChange={(val) => handleChange('clinicName', val)} icon={<Home size={18} />} />
                <InputGroup label="Contact Email" value={formData.contactEmail} onChange={(val) => handleChange('contactEmail', val)} icon={<Mail size={18} />} />
                <div className="md:col-span-2">
                  <InputGroup label="Physical Address" value={formData.physicalAddress} onChange={(val) => handleChange('physicalAddress', val)} icon={<MapPin size={18} />} />
                </div>
                <InputGroup label="Primary Phone" value={formData.primaryPhone} onChange={(val) => handleChange('primaryPhone', val)} icon={<Phone size={18} />} />
                <InputGroup label="Website URL" value={formData.websiteUrl} onChange={(val) => handleChange('websiteUrl', val)} icon={<Globe size={18} />} />
              </div>
            </section>

            {/* Section: Operational Hours & Slot Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Hours */}
              <section className="bg-surface-container rounded-[3rem] p-10 shadow-sm border border-outline-variant">
                <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-4">
                  <Clock className="text-primary" /> Opening Hours
                </h3>
                <div className="space-y-6">
                  <HoursRow 
                    days="Mon - Fri" 
                    open={formData.openingHours.weekdays.open} 
                    close={formData.openingHours.weekdays.close} 
                    onChangeOpen={(val) => handleHoursChange('weekdays', 'open', val)}
                    onChangeClose={(val) => handleHoursChange('weekdays', 'close', val)}
                  />
                  <HoursRow 
                    days="Saturday" 
                    open={formData.openingHours.saturday.open} 
                    close={formData.openingHours.saturday.close}
                    onChangeOpen={(val) => handleHoursChange('saturday', 'open', val)}
                    onChangeClose={(val) => handleHoursChange('saturday', 'close', val)}
                  />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-black uppercase tracking-widest text-on-surface-variant opacity-60">Sunday</span>
                    <span className="text-[10px] font-black text-error bg-error/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-error/20 shadow-lg">SANCTUARY CLOSED</span>
                  </div>
                </div>
              </section>

              {/* Appointment Config */}
              <section className="bg-surface-container rounded-[3rem] p-10 shadow-sm border border-outline-variant">
                <h3 className="text-xl font-black text-on-surface mb-2 flex items-center gap-4">
                  <RefreshCcw className="text-primary" /> Slot Duration
                </h3>
                <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest mb-10">Visit Allocation Matrix</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <SlotButton onClick={() => handleChange('slotDuration', '15')} time="15" unit="Min" active={formData.slotDuration === '15'} />
                  <SlotButton onClick={() => handleChange('slotDuration', '30')} time="30" unit="Min" active={formData.slotDuration === '30'} />
                  <SlotButton onClick={() => handleChange('slotDuration', '60')} time="60" unit="Min" active={formData.slotDuration === '60'} />
                </div>

                <div className="mt-12 flex items-center justify-between p-6 bg-surface-container-high rounded-[2rem] border border-outline-variant/10 group">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">Email Alerts</span>
                    <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Real-time Triage</span>
                  </div>
                  <button 
                    onClick={() => handleChange('emailAlerts', !formData.emailAlerts)}
                    className={`w-14 h-8 rounded-full relative shadow-lg transition-colors duration-300 ${formData.emailAlerts ? 'bg-primary' : 'bg-outline-variant/30'}`}
                  >
                    <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${formData.emailAlerts ? 'right-1' : 'left-1'}`}></span>
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: Security & Image Context */}
          <div className="lg:col-span-4 space-y-12 sticky top-32">
            {/* Security Section */}
            <section className="bg-surface-container rounded-[3rem] p-10 shadow-2xl border border-outline-variant/10">
              <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-4">
                <Lock className="text-error" /> Security Portal
              </h3>
              <div className="space-y-6">
                <SecurityInput 
                  label="Current Password" 
                  placeholder="••••••••••••" 
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <SecurityInput 
                  label="New Password" 
                  placeholder="Min. 12 characters" 
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <SecurityInput 
                  label="Confirm Alignment" 
                  placeholder="Re-enter password" 
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
                <button 
                  onClick={handleUpdateCredentials}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-white ${
                    pwdStatus === 'saved' ? 'bg-tertiary' :
                    pwdStatus === 'error' ? 'bg-error' :
                    'bg-on-surface'
                  }`}
                >
                  <ShieldCheck size={20} /> {pwdStatus === 'saving' ? 'Updating...' : pwdStatus === 'saved' ? 'Updated!' : 'Update Credentials'}
                </button>
              </div>
            </section>

            {/* Contextual Visual */}
            <div className="relative overflow-hidden rounded-[3rem] aspect-[4/3] group shadow-2xl border border-outline-variant/5">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"

                alt="Office" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-10">
                <span className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-2">Clinic Status</span>
                <p className="text-white text-xl font-black tracking-tight flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.5)]"></div> Sanctuary Secured</p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-6">
              <button 
                onClick={handleSave} 
                disabled={saveStatus === 'saving'}
                className={`w-full h-20 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 ${
                  saveStatus === 'saved' ? 'bg-tertiary' :
                  saveStatus === 'error' ? 'bg-error' :
                  'sanctuary-gradient'
                }`}
              >
                {saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'saved' ? 'Settings Saved Successfully!' :
                 saveStatus === 'error' ? 'Failed to Save' :
                 <><Save size={24} /> Save Global Alignment</>}
              </button>
              <button className="w-full h-16 bg-surface-container-high border-2 border-outline-variant/10 text-on-surface-variant font-black text-xs uppercase tracking-widest rounded-[2rem] hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3">
                <X size={20} /> Discard Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Danger */}
      <button 
        onClick={() => handleChange('isMaintenanceMode', !formData.isMaintenanceMode)}
        className={`fixed bottom-12 right-12 w-20 h-20 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:rotate-12 transition-all z-50 group border-[6px] border-white ring-8 ${formData.isMaintenanceMode ? 'bg-error ring-error/30' : 'bg-outline-variant ring-transparent'}`}
      >
        <AlertTriangle size={32} className={formData.isMaintenanceMode ? "animate-ping" : ""} />
        <span className={`absolute right-24 text-white text-[10px] px-6 py-3 rounded-2xl font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl ${formData.isMaintenanceMode ? 'bg-error' : 'bg-on-surface'}`}>
          {formData.isMaintenanceMode ? 'Master Override Active' : 'Activate Override'}
        </span>
      </button>
    </div>
  )
}



export default AdminSettings
