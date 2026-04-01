import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Lock, AlertCircle, Loader2 } from 'lucide-react'

const AdminLogin = () => {
  const { login, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // If already logged in as admin, redirect
    if (user && user.role === 'admin') {
      const origin = location.state?.from?.pathname || '/admin'
      navigate(origin)
    }
  }, [user, navigate, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(email, password)
      if (res.user.role !== 'admin') {
        setError('Unauthorized: Administrative clearance required.')
        // Optionally logout user here if they are not admin
      } else {
        const origin = location.state?.from?.pathname || '/admin'
        navigate(origin)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-surface italic font-bold">Verifying Clearance...</div>

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body antialiased selection:bg-primary/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-24 h-24 mx-auto bg-surface-container-high rounded-3xl shadow-2xl border border-outline-variant/10 flex items-center justify-center mb-8 relative group">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl scale-0 group-hover:scale-110 transition-transform duration-500"></div>
          <Shield className="text-secondary relative z-10 w-12 h-12 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Protocol: <span className="text-primary">Sanctuary</span></h2>
        <p className="mt-2 text-sm font-bold text-on-surface-variant uppercase tracking-widest opacity-60">System Override Portal</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-surface-container-high py-12 px-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[3rem] border border-outline-variant/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-error/10 border-l-4 border-error p-4 rounded-r-2xl flex items-start gap-4 animate-in slide-in-from-top-2">
                <AlertCircle className="text-error mt-0.5 w-5 h-5 flex-shrink-0" />
                <p className="text-sm text-error font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black tracking-[0.2em] text-on-surface-variant opacity-40 uppercase">Clearance ID</label>
              <div className="mt-1">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 text-on-surface font-bold text-sm transition-all shadow-inner placeholder:text-on-surface-variant placeholder:opacity-20 outline-none" 
                  placeholder="admin@medicare.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black tracking-[0.2em] text-on-surface-variant opacity-40 uppercase">Access Passphrase</label>
              <div className="mt-1">
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 text-on-surface font-bold text-sm transition-all shadow-inner placeholder:text-on-surface-variant placeholder:opacity-20 outline-none" 
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded text-primary" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-on-surface-variant">Remember device</label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors uppercase text-[10px] tracking-widest">Forgot Passphrase?</a>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-5 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-white sanctuary-gradient hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Establishing Link
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Authenticate
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-outline-variant/10">
            <p className="text-center text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" /> Encrypted Endpoint
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
