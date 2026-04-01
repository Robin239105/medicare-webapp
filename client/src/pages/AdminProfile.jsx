import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateAdminProfile } from '../services/api'
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Save, 
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react'

const AdminProfile = () => {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Administrative passwords do not match.' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      }
      if (formData.password) updateData.password = formData.password

      await updateAdminProfile(updateData)
      setMessage({ type: 'success', text: 'Sanctuary profile synchronized successfully.' })
      
      // Update local storage/context if needed, though fetchUser in AuthContext usually handles this on refresh.
      // For immediate feedback, we can just clear the password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update credentials.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      <header className="p-10 lg:p-12 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Administrative Identity</h1>
            <p className="text-on-surface-variant font-medium opacity-60 mt-1">Manage your sanctuary credentials and clinical profile.</p>
          </div>
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <ShieldCheck size={28} />
          </div>
        </div>
      </header>

      <main className="p-10 lg:p-12 max-w-4xl mx-auto">
        {message && (
          <div className={`mb-8 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-error/10 text-error border border-error/20'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-bold text-sm tracking-wide">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container p-8 rounded-[2.5rem] shadow-sm border border-outline-variant text-center group">
              <div className="relative inline-block mb-6">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"} 

                  className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-surface-container-high shadow-lg group-hover:scale-105 transition-transform duration-500"
                  alt="Admin Avatar"
                />
                <button className="absolute -right-2 -bottom-2 p-3 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-1">Chief Medical Admin</p>
              
              <div className="mt-8 pt-8 border-t border-outline-variant/10 space-y-4">
                <div className="flex justify-between text-xs font-bold px-2">
                  <span className="text-on-surface-variant opacity-60">Status</span>
                  <span className="text-tertiary">Verified Sanctuary</span>
                </div>
                <div className="flex justify-between text-xs font-bold px-2">
                  <span className="text-on-surface-variant opacity-60">Role</span>
                  <span className="text-on-surface">Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container p-10 rounded-[2.5rem] shadow-sm border border-outline-variant">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Sanctuary Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-4 focus:ring-primary/10 font-bold text-sm outline-none transition-all shadow-inner text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Clinical Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={18} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-4 focus:ring-primary/10 font-bold text-sm outline-none transition-all shadow-inner text-on-surface"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-widest mb-6">Security Clearance Update</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={18} />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-4 focus:ring-primary/10 font-bold text-sm outline-none transition-all shadow-inner text-on-surface"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={18} />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-4 focus:ring-primary/10 font-bold text-sm outline-none transition-all shadow-inner text-on-surface"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 mt-4 italic">Leave password fields blank if you do not wish to change your security secret.</p>
                </div>

                <div className="pt-6 flex justify-end">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="sanctuary-gradient text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3"
                  >
                    {loading ? "Synchronizing..." : <><Save size={18} /> Update Sanctuary Credentials</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminProfile
