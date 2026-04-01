import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  UserRound, 
  Users, 
  Layers, 
  Settings, 
  LogOut 
} from 'lucide-react'

const AdminSidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar /> },
    { name: 'Doctors', path: '/admin/doctors', icon: <UserRound /> },
    { name: 'Patients', path: '/admin/patients', icon: <Users /> },
    { name: 'Services', path: '/admin/services', icon: <Layers /> },
    { name: 'Profile', path: '/admin/profile', icon: <UserRound /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings /> },
  ]

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-10 z-50 shadow-sm">
      <div className="px-10 mb-16">
        <h1 className="text-2xl font-black text-on-surface tracking-tighter">
          Medi<span className="text-primary italic">Care</span>
        </h1>
        <p className="text-[10px] label-md font-black tracking-[0.3em] text-primary uppercase mt-2 opacity-80">Sanctuary Admin</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-10 py-5 transition-all duration-500 group relative ${
                isActive 
                  ? "text-white sanctuary-gradient shadow-lg shadow-primary/30 z-10" 
                  : "text-on-surface-variant hover:text-primary hover:bg-primary/5 font-bold"
              }`}
            >
              {isActive && <div className="absolute right-0 w-1.5 h-full bg-white rounded-l-full shadow-sm"></div>}
              <span className={`mr-5 transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-125 group-hover:rotate-6"}`}>
                {React.cloneElement(item.icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
              </span>
              <span className={`text-xs uppercase tracking-widest font-black transition-all ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="px-10 mt-auto pt-10 border-t border-outline-variant/10">
        <button className="flex items-center text-on-surface-variant hover:text-error transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] group opacity-40 hover:opacity-100">
          <LogOut size={18} className="mr-4 group-hover:-translate-x-1 transition-transform" />
          Logout Terminal
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
