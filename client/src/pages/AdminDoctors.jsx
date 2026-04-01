import React, { useState, useEffect } from 'react'
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/api'
import { 
  Search, 
  Filter, 
  Plus, 
  UserRound, 
  Stethoscope, 
  Award, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react'

const StatCard = ({ label, value, trend, icon, isProgress, progress }) => (
  <div className="bg-surface-container p-8 rounded-[2rem] shadow-sm border border-outline-variant group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2 opacity-60">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-4xl font-extrabold text-on-surface tracking-tighter">{value}</h3>
      <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase bg-primary/5 px-3 py-1.5 rounded-full">
        {icon} <span className="mt-0.5">{trend}</span>
      </div>
    </div>
    {isProgress && (
      <div className="w-full bg-surface-container-low h-2 rounded-full mt-6 overflow-hidden">
        <div className="bg-tertiary h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
)

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, departments: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({ name: '', specialization: '', bio: '', image: '', schedule: [] })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Specializations')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors()
        setDoctors(res.data)
        
        // Calculate basic stats
        const departments = new Set(res.data.map(d => d.specialization)).size
        setStats({ total: res.data.length, departments })
      } catch (error) {
        console.error('Error fetching specialists:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const openModal = (doc = null) => {
    if (doc) {
      setEditingDoc(doc)
      setFormData({ name: doc.name, specialization: doc.specialization, bio: doc.bio || '', image: doc.image || '', schedule: doc.schedule || [] })
    } else {
      setEditingDoc(null)
      setFormData({ name: '', specialization: '', bio: '', image: '', schedule: [] })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingDoc) {
        const res = await updateDoctor(editingDoc._id, formData)
        setDoctors(prev => prev.map(d => d._id === editingDoc._id ? res.data : d))
      } else {
        const res = await createDoctor(formData)
        setDoctors(prev => [res.data, ...prev])
        setStats(prev => ({ ...prev, total: prev.total + 1 }))
      }
      setIsModalOpen(false)
    } catch (error) {
      alert('Failed to save specialist')
    }
  }

  const handleDelete = (id) => {
    setItemToDelete(id)
  }

  const confirmDelete = async () => {
    try {
      await deleteDoctor(itemToDelete)
      setDoctors(prev => prev.filter(d => d._id !== itemToDelete))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (error) {
      console.error('Failed to delete', error)
    } finally {
      setItemToDelete(null)
    }
  }

  const addScheduleBlock = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: 'Monday', startTime: '09:00', endTime: '17:00', location: 'Main Clinic' }]
    }))
  }

  const removeScheduleBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }))
  }

  const updateScheduleBlock = (index, field, value) => {
    const newSchedule = [...formData.schedule]
    newSchedule[index][field] = value
    setFormData(prev => ({ ...prev, schedule: newSchedule }))
  }

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      <header className="sticky top-0 z-40 flex justify-between items-center px-10 h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Specialist Management</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => openModal()} className="sanctuary-gradient text-white font-black py-2.5 px-6 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2 text-sm">
            <Plus size={18} /> Add Specialist
          </button>
        </div>
      </header>

      <div className="p-10 max-w-[1600px] mx-auto">
        {/* Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <StatCard label="Active Specialists" value={stats.total.toString()} trend="Staffed" icon={<UserRound size={20} />} />
          <StatCard label="Live Departments" value={stats.departments.toString()} trend="Specialized" icon={<Stethoscope size={20} />} />
          <StatCard label="Verified Status" value="100%" trend="Certified" icon={<ShieldCheck size={20} />} isProgress progress={100} />
        </section>

        {/* Content Section */}
        <section className="bg-surface-container rounded-[2.5rem] shadow-sm overflow-hidden border border-outline-variant">
          <div className="p-10 bg-surface-container-low/50 flex flex-wrap items-end gap-8 border-b border-outline-variant/10">
            <div className="flex-1 min-w-[300px] space-y-3">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Search Directory</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  className="w-full pl-12 pr-6 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" 
                  placeholder="Find specialist by name..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-64 space-y-3">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Department</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-5 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none appearance-none cursor-pointer shadow-inner"
              >
                <option>All Specializations</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Dermatology</option>
                <option>General Medicine</option>
                <option>Psychiatry</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30 text-on-surface-variant text-[10px] font-black tracking-[0.2em] uppercase">
                  <th className="px-10 py-6">Medical Specialist</th>
                  <th className="px-10 py-6">Specialization</th>
                  <th className="px-10 py-6">Bio & Credentials</th>
                  <th className="px-10 py-6 text-right">Sanctuary Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr><td colSpan="4" className="p-20 text-center font-bold text-on-surface-variant animate-pulse">Syncing specialist data...</td></tr>
                ) : doctors.length === 0 ? (
                  <tr><td colSpan="4" className="p-20 text-center font-bold text-on-surface-variant">No specialists found in sanctuary records.</td></tr>
                ) : (
                  doctors
                    .filter(doc => {
                      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
                      const matchesCategory = categoryFilter === 'All Specializations' || doc.specialization === categoryFilter
                      return matchesSearch && matchesCategory
                    })
                    .map(doc => (
                    <tr key={doc._id} className="hover:bg-primary/5 transition-all duration-300 group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={doc.image} alt={doc.name} className="h-14 w-14 rounded-2xl object-cover shadow-md group-hover:rotate-3 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 bg-tertiary text-white p-1 rounded-lg shadow-sm">
                              <Award size={10} />
                            </div>
                          </div>
                          <div>
                            <p className="font-extrabold text-on-surface tracking-tight">{doc.name}</p>
                            <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest leading-none mt-1">ID: {doc._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                          {doc.specialization}
                        </span>
                      </td>
                      <td className="px-10 py-6 max-w-md">
                        <p className="text-xs font-medium text-on-surface-variant line-clamp-2 leading-relaxed italic">
                          "{doc.bio}"
                        </p>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => openModal(doc)} className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-all" title="Modify Records">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(doc._id)} className="p-3 text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded-xl transition-all" title="Remove Specialist">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-8 bg-surface-container-low/30 flex items-center justify-between">
            <p className="text-xs font-bold text-on-surface-variant opacity-60">Showing {doctors.length} active sanctuary staff</p>
            <div className="flex gap-4">
              <button className="p-3 border border-outline-variant/10 rounded-xl hover:bg-white transition-all text-on-surface-variant opacity-30" disabled>
                <ChevronLeft size={20} />
              </button>
              <button className="h-12 w-12 sanctuary-gradient text-white font-black rounded-xl text-sm shadow-lg">1</button>
              <button className="p-3 border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all text-on-surface-variant opacity-30" disabled>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-surface-container rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant my-8">
            <div className="p-8 sanctuary-gradient">
              <h2 className="text-2xl font-bold text-white tracking-tight">{editingDoc ? 'Edit Specialist' : 'Add New Specialist'}</h2>
              <p className="text-white/80 text-sm font-medium mt-1">Configure registry details</p>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="Dr. First Last"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Specialization</label>
                <input required type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="e.g. Cardiology"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Biography</label>
                <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner h-24 resize-none" placeholder="Brief occupational summary..."/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="https://..."/>
              </div>
              <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={14} /> Availability Schedule
                  </label>
                  <button 
                    type="button" 
                    onClick={addScheduleBlock}
                    className="text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    + Add Block
                  </button>
                </div>
                
                {formData.schedule.map((block, idx) => (
                  <div key={idx} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 relative group">
                    <button 
                      type="button"
                      onClick={() => removeScheduleBlock(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">Day</span>
                        <select 
                          value={block.day} 
                          onChange={(e) => updateScheduleBlock(idx, 'day', e.target.value)}
                          className="w-full mt-1 p-2 bg-surface-container rounded-lg text-xs font-bold outline-none border border-outline-variant/10 focus:border-primary"
                        >
                          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">Location</span>
                        <input 
                          value={block.location} 
                          onChange={(e) => updateScheduleBlock(idx, 'location', e.target.value)}
                          className="w-full mt-1 p-2 bg-surface-container rounded-lg text-xs font-bold outline-none border border-outline-variant/10 focus:border-primary" 
                          placeholder="e.g. Area 51"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">Start Time</span>
                        <input 
                          type="time" 
                          value={block.startTime} 
                          onChange={(e) => updateScheduleBlock(idx, 'startTime', e.target.value)}
                          className="w-full mt-1 p-2 bg-white rounded-lg text-xs font-bold outline-none border border-outline-variant/10 focus:border-primary"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">End Time</span>
                        <input 
                          type="time" 
                          value={block.endTime} 
                          onChange={(e) => updateScheduleBlock(idx, 'endTime', e.target.value)}
                          className="w-full mt-1 p-2 bg-surface-container rounded-lg text-xs font-bold outline-none border border-outline-variant/10 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="sanctuary-gradient text-white font-black py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center">
                  Save Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-surface-container rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-outline-variant p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Confirm Erasure</h3>
            <p className="text-sm font-medium text-on-surface-variant mb-8 opacity-80 decoration-error decoration-2">This critical action is permanent and actively deletes data.</p>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 font-bold text-on-surface-variant bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 font-black text-white bg-error rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



export default AdminDoctors
