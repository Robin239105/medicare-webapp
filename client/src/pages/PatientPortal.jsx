import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  Fingerprint, 
  LifeBuoy,
  ArrowRight,
  User
} from 'lucide-react'

const PatientPortal = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication synchronization failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-[calc(100vh-80px)] font-body text-on-surface antialiased relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] rounded-full bg-tertiary-container/5 blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-surface-container rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant overflow-hidden transition-all">
          <div className="p-10 pb-2 text-center">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-3">
              {isLogin ? 'Sanctuary Access' : 'Begin Your Journey'}
            </h1>
            <p className="text-on-surface-variant font-medium leading-relaxed opacity-80">
              {isLogin ? 'Manage your healthcare with clinical precision.' : 'Create your secure medical profile in our sanctuary.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-outline-variant/10 mt-10">
            <button 
              onClick={() => {
                setIsLogin(true)
                setFormData({ name: '', email: '', password: '', phone: '' })
                setError('')
              }}
              className={`flex-1 py-5 font-bold transition-all text-sm uppercase tracking-widest ${isLogin ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-on-surface-variant opacity-60 hover:bg-surface-container-low'}`}
            >
              Login
            </button>
            <button 
              onClick={() => {
                setIsLogin(false)
                setFormData({ name: '', email: '', password: '', phone: '' })
                setError('')
              }}
              className={`flex-1 py-5 font-bold transition-all text-sm uppercase tracking-widest ${!isLogin ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-on-surface-variant opacity-60 hover:bg-surface-container-low'}`}
            >
              Register
            </button>
          </div>

          <div className="p-10">
            {error && <div className="mb-6 p-4 bg-error/10 text-error rounded-xl text-xs font-bold border border-error/20 flex items-center gap-2">
              <ShieldCheck size={16} /> {error}
            </div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none shadow-inner" 
                        placeholder="Dr. Julian Vance" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Phone Number</label>
                    <div className="relative group">
                      <LifeBuoy className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none shadow-inner" 
                        placeholder="+1 (555) 000-0000" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none" 
                    placeholder="name@example.com" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none" 
                    placeholder="••••••••" 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 sanctuary-gradient text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50" 
                type="submit"
              >
                {loading ? 'Synchronizing...' : (isLogin ? 'Access Portal' : 'Create Profile')} <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientPortal
