import React, { useState, useEffect } from 'react'
import { getAppointments, updateAppointment, deleteAppointment } from '../services/api'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Eye, 
  Ban,
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  Target,
  X,
  CheckCircle
} from 'lucide-react'

const StatMini = ({ label, value, trend, icon, isProgress, progress }) => (
  <div className="bg-surface-container p-8 rounded-[2rem] shadow-sm border border-outline-variant">
    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2 opacity-60">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-4xl font-extrabold text-on-surface tracking-tighter">{value}</h3>
      <div className="flex items-center gap-1.5 text-tertiary font-black text-[10px] uppercase">
        {icon} {trend}
      </div>
    </div>
    {isProgress && (
      <div className="w-full bg-surface-container-low h-2 rounded-full mt-6 overflow-hidden">
        <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
)

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ today: 0, pending: 0 })

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [specialistFilter, setSpecialistFilter] = useState('All Specialist')

  const [viewModalData, setViewModalData] = useState(null)
  const [deleteModalId, setDeleteModalId] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments()
        setAppointments(res.data)
        
        // Calculate basic stats for the cards
        const today = res.data.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length
        const pending = res.data.filter(a => a.status === 'Pending').length
        setStats({ today, pending })
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointment(id, { status: newStatus })
      setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt))
    } catch (error) {
      console.error('Failed to update status', error)
      alert('Failed to modify appointment.')
    }
  }

  const handleDeleteProcess = async () => {
    if (!deleteModalId) return
    try {
      setLoading(true)
      await deleteAppointment(deleteModalId)
      setAppointments(prev => prev.filter(apt => apt._id !== deleteModalId))
      setDeleteModalId(null)
    } catch (error) {
      console.error('Failed to delete appointment', error)
      alert('Failed to scratch record.')
    } finally {
      setLoading(false)
    }
  }

  // Derive unique specialists from appointments for the dropdown
  const uniqueSpecialists = [...new Set(appointments.map(a => a.doctor?.name).filter(Boolean))]

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt._id?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || apt.status === statusFilter
    const matchesSpecialist = specialistFilter === 'All Specialist' || apt.doctor?.name === specialistFilter

    return matchesSearch && matchesStatus && matchesSpecialist
  })

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      <header className="sticky top-0 z-40 flex justify-between items-center px-10 h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Appointments Management</h1>
        <div className="flex items-center gap-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Calendar size={20} />
          </div>
        </div>
      </header>

      <div className="p-10 max-w-[1600px] mx-auto">
        {/* Statistics Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <StatMini label="Today's Visits" value={stats.today.toString()} trend="+12%" icon={<TrendingUp size={16} />} />
          <StatMini label="Pending Requests" value={stats.pending.toString().padStart(2, '0')} trend="Urgent" icon={<Clock size={16} />} />
          <StatMini label="Occupancy" value="82%" trend="Optimal" icon={<Target size={16} />} isProgress progress={82} />
          <div className="bg-primary p-8 rounded-[2rem] shadow-xl flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-60">Data Management</p>
            <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/20 shadow-lg">
              <Download size={20} /> Export Records
            </button>
          </div>
        </section>

        {/* Table & Filters Section */}
        <section className="bg-surface-container rounded-[2.5rem] shadow-sm overflow-hidden border border-outline-variant">
          {/* Filters Bar */}
          <div className="p-10 bg-surface-container-low/50 flex flex-wrap items-end gap-8 border-b border-outline-variant/10">
            <div className="flex-1 min-w-[300px] space-y-3">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Search Patient</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  className="w-full pl-12 pr-6 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" 
                  placeholder="ID or Patient Name..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-56 space-y-3">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Specialist</label>
              <select 
                className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none appearance-none cursor-pointer shadow-sm"
                value={specialistFilter}
                onChange={(e) => setSpecialistFilter(e.target.value)}
              >
                <option value="All Specialist">All Specialist</option>
                {uniqueSpecialists.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="w-48 space-y-3">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Status</label>
              <select 
                className="w-full px-5 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none appearance-none cursor-pointer shadow-inner"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30 text-on-surface-variant text-[10px] font-black tracking-[0.2em] uppercase">
                  <th className="px-10 py-6">Patient Sanctuary ID</th>
                  <th className="px-10 py-6">Medical Specialist</th>
                  <th className="px-10 py-6">Visit Schedule</th>
                  <th className="px-10 py-6">Triage Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center font-bold text-on-surface-variant animate-pulse">Synchronizing feed...</td></tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center font-bold text-on-surface-variant">{appointments.length === 0 ? "No active sanctuary visits found." : "No visits matching filters."}</td></tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt._id} className="hover:bg-primary/5 transition-all duration-300 group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl sanctuary-gradient flex items-center justify-center text-white font-black text-xs shadow-md group-hover:rotate-6 transition-transform">
                            {apt.patientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-on-surface tracking-tight">{apt.patientName}</p>
                            <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">UID: {apt._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-bold text-on-surface italic">{apt.doctor?.name || 'Assigned Staff'}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{apt.doctor?.specialization || 'Clinical'}</p>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-bold text-on-surface">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] font-black text-on-surface-variant opacity-60 uppercase tracking-widest">{apt.time}</p>
                      </td>
                      <td className="px-10 py-6">
                        <select 
                          value={apt.status || 'Pending'} 
                          onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer text-center ${
                            apt.status === 'Confirmed' ? 'bg-tertiary/10 text-tertiary' : 
                            apt.status === 'Cancelled' ? 'bg-error/10 text-error' :
                            apt.status === 'Completed' ? 'bg-primary/10 text-primary' :
                            'bg-surface-container-highest text-on-surface-variant opacity-60'
                          }`}>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          {apt.status !== 'Completed' && (
                            <button onClick={() => handleStatusChange(apt._id, 'Completed')} className="p-3 text-on-surface-variant hover:text-tertiary hover:bg-white rounded-xl shadow-sm transition-all" title="Mark as Done">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => setViewModalData(apt)} className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-all" title="View Details">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setDeleteModalId(apt._id)} className="p-3 text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded-xl transition-all" title="Cancel & Delete">
                            <Ban size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-10 py-8 bg-surface-container-low/30 flex items-center justify-between">
            <p className="text-xs font-bold text-on-surface-variant opacity-60">Showing 1 to {appointments.length} of {appointments.length} appointments</p>
            <div className="flex gap-4">
              <button className="p-3 border border-outline-variant/10 rounded-xl hover:bg-white transition-all text-on-surface-variant disabled:opacity-30" disabled>
                <ChevronLeft size={20} />
              </button>
              <button className="h-12 w-12 sanctuary-gradient text-white font-black rounded-xl text-sm shadow-lg">1</button>
              <button className="p-3 border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all text-on-surface-variant">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* View Appointment Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface-container rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-outline-variant">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-3"><Eye className="text-primary" /> Encounter Details</h3>
              <button onClick={() => setViewModalData(null)} className="p-2 hover:bg-surface-container-low rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant opacity-60 mb-1">Patient Identity</p>
                  <p className="font-bold text-sm text-on-surface">{viewModalData.patientName}</p>
                  <p className="text-xs font-semibold text-primary">{viewModalData.email}</p>
                  <p className="text-xs font-semibold text-primary">{viewModalData.phone}</p>
                </div>
                <div className="bg-surface-container-low p-5 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant opacity-60 mb-1">Scheduled Time</p>
                  <p className="font-bold text-sm text-on-surface">{viewModalData.date}</p>
                  <p className="text-xs font-semibold text-primary">{viewModalData.time}</p>
                </div>
              </div>
              <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-black uppercase text-primary opacity-60 mb-1">Clinic Assignment</p>
                <p className="font-bold text-sm text-on-surface">Dr. {viewModalData.doctor?.name || "Unassigned"}</p>
                <p className="text-xs font-bold text-on-surface-variant">{viewModalData.service?.title || "Consultation"}</p>
              </div>
              <button onClick={() => setViewModalData(null)} className="w-full py-4 bg-surface-container hover:bg-primary/10 hover:text-primary transition-all rounded-2xl font-bold text-sm">
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface-container rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center border-t-4 border-t-error border-x border-b border-outline-variant">
            <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Ban size={32} />
            </div>
            <h3 className="text-xl font-black text-on-surface mb-2">Nullify Appointment?</h3>
            <p className="text-sm font-medium text-on-surface-variant opacity-80 mb-8 leading-relaxed">
              This action cannot be undone. The scheduled sanctuary visit block will be permanently erased.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-4 bg-surface-container-low hover:bg-surface-container font-bold text-on-surface-variant rounded-2xl transition-all"
              >
                Abort
              </button>
              <button 
                onClick={handleDeleteProcess}
                className="flex-1 py-4 bg-error text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-error/30"
              >
                Nullify Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



export default AdminAppointments
