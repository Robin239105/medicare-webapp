import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

const NavLink = ({ to, children, active }) => (
  <Link 
    to={to} 
    className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all ${
      active 
        ? "text-primary opacity-100" 
        : "text-on-surface-variant opacity-60 hover:opacity-100 hover:text-primary"
    }`}
  >
    {children}
  </Link>
)

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 text-on-surface">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-on-surface">
          Medi<span className="text-primary italic">Care</span>
        </Link>
        <div className="hidden md:flex items-center space-x-10">
          <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/about" active={location.pathname === '/about'}>About</NavLink>
          <NavLink to="/services" active={location.pathname === '/services'}>Services</NavLink>
          <NavLink to="/doctors" active={location.pathname === '/doctors'}>Doctors</NavLink>
          <NavLink to="/contact" active={location.pathname === '/contact'}>Contact</NavLink>
        </div>
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              {isAdmin ? (
                <Link to="/admin" className="text-sm font-black uppercase tracking-widest text-tertiary hover:opacity-80">Admin</Link>
              ) : (
                <Link to="/dashboard" className="text-sm font-black uppercase tracking-widest text-primary hover:opacity-80">Dashboard</Link>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-md uppercase">
                  {user.name.charAt(0)}
                </div>
                <button onClick={logout} className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error/5">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/portal" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors tracking-wide">Patient Portal</Link>
              <Link to="/booking" className="bg-primary text-white px-8 py-3.5 rounded-xl font-black text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Book Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
