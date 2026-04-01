import React, { useState, useEffect } from 'react'
import { getAdminStats, getAppointments, getNotifications, markNotificationRead } from '../services/api'
import { 
  CalendarCheck, 
  Users, 
  UserRound, 
  Wallet, 
  Search, 
  Bell, 
  TrendingUp, 
  ArrowUpRight,
  MoreVertical,
  Plus,
  UserPlus,
  Check,
  Clock
} from 'lucide-react'

const StatCard = ({ icon, label, value, color, text, trend }) => (
  <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant flex flex-col justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <span className={`p-4 ${color} ${text} rounded-2xl shadow-sm transition-transform duration-500 group-hover:rotate-12`}>
        {React.cloneElement(icon, { size: 28 })}
      </span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${trend.startsWith('+') ? 'bg-tertiary/10 text-tertiary' : 'bg-on-surface-variant/10 text-on-surface-variant'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-[10px] font-bold label-md tracking-[0.15em] text-on-surface-variant uppercase mb-2 opacity-60">{label}</p>
      <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{value}</h3>
    </div>
  </div>
)

const Bar = ({ height, active, count }) => (
  <div 
    className={`flex-1 ${active ? 'sanctuary-gradient' : 'bg-primary/10'} rounded-t-2xl transition-all cursor-pointer hover:opacity-90`} 
    style={{ height: `${count || height || 40}%` }}
  ></div>
)

const PerformanceRow = ({ name, role, score, img }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center space-x-4">
      <img className="w-12 h-12 rounded-xl object-cover hover:scale-105 transition-transform" src={img} alt={name} />
      <div>
        <p className="text-sm font-bold text-on-surface tracking-tight">{name}</p>
        <p className="text-xs text-on-surface-variant font-medium opacity-60">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-tertiary">{score}</p>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Score</p>
    </div>
  </div>
)

const TableRow = ({ patient, doctor, service, time, status, statusColor }) => (
  <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
    <td className="px-10 py-6">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-xl sanctuary-gradient text-white flex items-center justify-center font-bold text-xs mr-4 shadow-md group-hover:rotate-6 transition-transform">
          {patient.charAt(0)}{patient.split(' ')[1]?.charAt(0) || ''}
        </div>
        <span className="text-sm font-bold text-on-surface">{patient}</span>
      </div>
    </td>
    <td className="px-10 py-6 text-sm font-medium text-on-surface-variant">{doctor}</td>
    <td className="px-10 py-6 text-sm font-medium text-on-surface-variant">{service}</td>
    <td className="px-10 py-6 text-sm font-bold text-on-surface-variant">{time}</td>
    <td className="px-10 py-6">
      <span className={`px-4 py-1.5 ${statusColor} rounded-full text-[10px] font-black uppercase tracking-widest`}>{status}</span>
    </td>
    <td className="px-10 py-6">
      <button className="text-outline-variant hover:text-primary transition-colors">
        <MoreVertical size={20} />
      </button>
    </td>
  </tr>
)

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalAppointments: 0, completedAppointments: 0, totalPatients: 0, totalDoctors: 0, revenue: 0 })
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptsRes, notifRes] = await Promise.all([
          getAdminStats(), 
          getAppointments(),
          getNotifications()
        ])
        setStats(statsRes.data)
        setAppointments(apptsRes.data.slice(0, 5)) 
        setNotifications(notifRes.data)
      } catch (err) {
        console.error('Failed to sync sanctuary analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error('Failed to update notification', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface italic font-bold">Synchronizing Sanctuary Intel...</div>

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased">
      {/* Top AppBar */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-10 h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard Overview</h2>
        
        <div className="flex items-center space-x-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="pl-10 pr-4 py-2 bg-surface-container-high rounded-lg border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 text-sm font-medium w-64 outline-none transition-all shadow-inner"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2.5 transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-96 bg-surface-container rounded-3xl shadow-xl border border-outline-variant py-6 z-[60] animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="px-8 pb-4 border-b border-outline-variant/10 flex justify-between items-center">
                  <h4 className="font-extrabold text-sm tracking-tight">Sanctuary Alerts</h4>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{unreadCount} New</span>
                </div>
                <div className="max-h-96 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs font-bold text-on-surface-variant opacity-40">All clinical signals are quiet.</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n._id} 
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`px-8 py-5 border-b border-outline-variant/5 hover:bg-surface-container-low cursor-pointer transition-all flex gap-4 ${n.isRead ? 'opacity-40' : ''}`}
                      >
                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.isRead ? 'bg-outline-variant' : 'bg-primary'}`}></div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold leading-relaxed">{n.message}</p>
                          <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant opacity-60 uppercase tracking-tighter">
                            <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {!n.isRead && <Check size={14} className="ml-auto text-tertiary" />}
                      </div>
                    ))
                  )}
                </div>
                <div className="px-8 pt-4 text-center">
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4">Clear All Signals</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 pl-8 border-l border-outline-variant/20">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface">Dr. Julian Vance</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Chief Administrator</p>
            </div>
            <img 
              className="w-11 h-11 rounded-xl object-cover border-2 border-primary/20 cloud-shadow" 
              alt="Admin" 
              src="https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=300&auto=format&fit=crop" 

            />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="p-10 max-w-[1600px] mx-auto">
        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard icon={<CalendarCheck />} label="Total Appointments" value={stats.totalAppointments} color="bg-primary-fixed" text="text-primary" trend="+12%" />
          <StatCard icon={<TrendingUp />} label="Completed Visits" value={stats.completedAppointments} color="bg-tertiary-fixed font-bold" text="text-tertiary" trend="+24%" />
          <StatCard icon={<Users />} label="Total Patients" value={stats.totalPatients} color="bg-secondary-fixed" text="text-secondary" trend="+5%" />
          <StatCard icon={<Wallet />} label="Est. Revenue" value={`$${stats.revenue.toLocaleString()}`} color="bg-primary-container" text="text-white" trend="+18%" />
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Main Analytics Area */}
          <div className="lg:col-span-8 bg-surface-container rounded-3xl p-10 shadow-sm border border-outline-variant">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-bold text-on-surface flex items-center gap-3">
                Weekly Appointments <TrendingUp className="text-tertiary" size={20} />
              </h4>
              <select className="text-xs font-bold bg-surface-container border-none rounded-xl py-2 px-4 focus:ring-primary/10 tracking-widest uppercase shadow-inner">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            {/* Visual Bar Chart Placeholder */}
            <div className="flex items-end justify-between h-72 w-full gap-4 px-4 pt-4 border-b border-outline-variant/10">
              <Bar count={40} />
              <Bar count={65} />
              <Bar count={55} />
              <Bar count={90} active />
              <Bar count={70} />
              <Bar count={45} />
              <Bar count={80} />
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-bold tracking-widest text-on-surface-variant opacity-60 uppercase px-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Quick Support Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
              <h4 className="font-extrabold text-xl mb-6 relative z-10">Quick Management</h4>
              <div className="space-y-4 relative z-10">
                <button className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 p-5 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                  <span className="flex items-center font-bold text-sm tracking-wide">
                    <UserPlus className="mr-4" size={20} /> Add New Doctor
                  </span>
                  <ArrowUpRight size={18} />
                </button>
                <button className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 p-5 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                  <span className="flex items-center font-bold text-sm tracking-wide">
                    <Plus className="mr-4" size={20} /> New Service
                  </span>
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            </div>

            {/* Performance Snapshot */}
            <div className="bg-surface-container-high p-8 rounded-3xl shadow-2xl border border-outline-variant/10">
              <h4 className="font-extrabold text-on-surface mb-8 tracking-wide">Sanctuary Performance</h4>
              <div className="space-y-8">
                <PerformanceRow name="Dr. Sarah Chen" role="Pediatrics" score="98%" img="https://images.unsplash.com/photo-1623854766464-c3645e6841d8?q=80&w=300&auto=format&fit=crop" />

                <PerformanceRow name="Dr. Michael Reed" role="Cardiology" score="96%" img="https://images.unsplash.com/photo-1647866965225-1ed2b0c0a5cc?q=80&w=300&auto=format&fit=crop" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments Terminal */}
        <div className="bg-surface-container rounded-[2.5rem] shadow-sm overflow-hidden border border-outline-variant">
          <div className="p-10 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest/20">
            <h4 className="text-2xl font-bold text-on-surface">Recent Sanctuary Visits</h4>
            <button className="text-primary text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8">View Management Portal Feed</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[10px] font-extrabold tracking-[0.2em] uppercase">
                  <th className="px-10 py-5">Patient Name</th>
                  <th className="px-10 py-5">Doctor</th>
                  <th className="px-10 py-5">Service</th>
                  <th className="px-10 py-5">Time/Date</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {appointments.map(appt => (
                  <TableRow 
                    key={appt._id}
                    patient={appt.patientName} 
                    doctor={appt.doctor?.name || 'Unassigned'} 
                    service={appt.service?.title || 'Unknown'} 
                    time={`${appt.time} | ${new Date(appt.date).toLocaleDateString()}`} 
                    status={appt.status} 
                    statusColor={
                      appt.status === 'Confirmed' ? 'bg-tertiary-fixed text-tertiary' : 
                      appt.status === 'Pending' ? 'bg-secondary-fixed text-secondary' : 
                      'bg-surface-container-highest text-on-surface-variant'
                    } 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}



export default AdminDashboard
