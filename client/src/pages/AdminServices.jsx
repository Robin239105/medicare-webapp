import React, { useState, useEffect } from 'react'
import { getServices, createService, updateService, deleteService } from '../services/api'
import { 
  Plus, 
  Search, 
  GripVertical, 
  Edit3, 
  Trash2, 
  Heart, 
  Brain, 
  Activity, 
  Stethoscope,
  TrendingUp,
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Bone,
  Syringe,
  Microscope
} from 'lucide-react'

const AVAILABLE_ICONS = [
  { name: 'Heart', icon: <Heart /> },
  { name: 'Brain', icon: <Brain /> },
  { name: 'Activity', icon: <Activity /> },
  { name: 'Stethoscope', icon: <Stethoscope /> },
  { name: 'Eye', icon: <Eye /> },
  { name: 'Bone', icon: <Bone /> },
  { name: 'Syringe', icon: <Syringe /> },
  { name: 'Microscope', icon: <Microscope /> }
]

const StatSquare = ({ icon, value, label, color }) => (
  <div className="bg-surface-container p-10 rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col justify-between items-center text-center group">
    <div className={`${color} group-hover:scale-125 transition-transform duration-500`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div className="mt-6">
      <h4 className="text-3xl font-extrabold tracking-tighter">{value}</h4>
      <p className="text-[10px] font-black text-on-surface-variant opacity-60 uppercase tracking-widest mt-2">{label}</p>
    </div>
  </div>
)

const ProgressRow = ({ label, percent, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-sm font-black uppercase tracking-widest text-on-surface-variant opacity-60">
      <span>{label} Units</span>
      <span>{percent}%</span>
    </div>
    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden shadow-inner">
      <div className={`${color} h-full rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
)

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', price: '', iconName: 'Activity', isActive: true })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices()
        setServices(res.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // Mock function for fetchAppointments fix (typo correction in my thought)

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setFormData({ 
        title: service.title, 
        description: service.description, 
        price: service.price, 
        iconName: service.iconName || 'Activity', 
        isActive: service.isActive !== false 
      })
    } else {
      setEditingService(null)
      setFormData({ title: '', description: '', price: '', iconName: 'Activity', isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        const res = await updateService(editingService._id, formData)
        setServices(prev => prev.map(s => s._id === editingService._id ? res.data : s))
      } else {
        const res = await createService(formData)
        setServices(prev => [res.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      alert('Error saving service')
    }
  }

  const handleDelete = (id) => {
    setItemToDelete(id)
  }

  const confirmDelete = async () => {
    try {
      await deleteService(itemToDelete)
      setServices(prev => prev.filter(s => s._id !== itemToDelete))
    } catch (err) {
      console.error('Failed to erase record.', err)
    } finally {
      setItemToDelete(null)
    }
  }

  const toggleActiveStatus = async (service) => {
    try {
      const updatedData = { ...service, isActive: !service.isActive }
      const res = await updateService(service._id, updatedData)
      setServices(prev => prev.map(s => s._id === service._id ? res.data : s))
    } catch (err) {
      console.error('Failed to toggle status', err)
      alert('Failed to update service status.')
    }
  }

  const renderIcon = (iconName) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName)
    return found ? found.icon : <Activity />
  }

  const activeServicesCount = services.filter(s => s.isActive).length

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 p-10 lg:p-12 mb-8 bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant/10">
        <div className="space-y-3">
          <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Operations Center</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Clinic Services</h2>
          <p className="text-on-surface-variant max-w-xl font-medium opacity-80">Configure and manage clinical offerings across sanctuary departments.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 rounded-2xl bg-surface-container-high text-on-surface font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-surface-container-highest transition-all shadow-lg border border-outline-variant/10">
            <History size={18} /> Logs
          </button>
          <button onClick={() => openModal()} className="px-8 py-4 rounded-2xl sanctuary-gradient text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
            <Plus size={20} /> Add Service
          </button>
        </div>
      </header>

      <main className="px-10 lg:px-12 max-w-[1600px] mx-auto">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <span className="p-5 bg-primary/10 rounded-2xl text-primary group-hover:rotate-12 transition-transform duration-500 border border-primary/20">
                <Info size={32} />
              </span>
              <span className="text-[10px] font-black text-tertiary bg-tertiary/10 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">Operational Sanctuary</span>
            </div>
            <div className="mt-8">
              <h4 className="text-4xl font-extrabold tracking-tighter">{activeServicesCount} Active Units</h4>
              <p className="text-on-surface-variant text-sm font-bold opacity-60 uppercase tracking-widest mt-2">Services currently visible in sanctuary menu</p>
            </div>
          </div>
          <StatSquare icon={<TrendingUp />} value="8" label="Departments" color="text-primary-container" />
          <StatSquare icon={<Activity />} value="+12%" label="Utilization" color="text-secondary" />
        </section>

        {/* Services Management Area */}
        <div className="bg-surface-container rounded-[3rem] shadow-sm border border-outline-variant overflow-hidden">
          {/* Filters and Search */}
          <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between border-b border-outline-variant/10 bg-surface-container-low/30">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                className="w-full pl-12 pr-6 py-4 bg-surface-container-high rounded-2xl border-none shadow-inner focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm outline-none" 
                placeholder="Universal Service Search..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Cardiology', 'Neurology', 'Diagnostics'].map((cat, idx) => (
                <button 
                  key={cat} 
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    idx === 0 ? "sanctuary-gradient text-white shadow-md" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest border border-outline-variant/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Services */}
          <div className="divide-y divide-outline-variant/5">
            {loading ? (
              <div className="p-20 text-center animate-pulse font-bold text-on-surface-variant">Synchronizing Service Matrix...</div>
            ) : (
              services.map(service => (
                <div key={service._id} className="group flex items-center gap-8 p-10 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden">
                  <button className="cursor-grab active:cursor-grabbing text-outline-variant opacity-0 group-hover:opacity-100 transition-all">
                    <GripVertical size={24} />
                  </button>
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(renderIcon(service.iconName), { size: 28 })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h5 className="text-xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">{service.title}</h5>
                      <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-surface-container-highest text-on-surface-variant opacity-60 uppercase tracking-widest">UID: {service._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium opacity-80 line-clamp-1 max-w-2xl">{service.description}</p>
                  </div>
                  <div className="hidden lg:block w-48 text-right">
                    <span className="text-[10px] font-black text-primary bg-primary/5 px-4 py-2 rounded-full uppercase tracking-widest border border-primary/10">Clinical Specialist</span>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">
                        {service.isActive ? 'Active Status' : 'Inactive'}
                      </span>
                      <button 
                        onClick={() => toggleActiveStatus(service)}
                        className={`w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${service.isActive ? 'bg-tertiary' : 'bg-outline-variant/30'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${service.isActive ? 'right-1' : 'left-1'}`}></span>
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => openModal(service)} className="p-3 bg-surface-container-high text-on-surface-variant hover:text-primary rounded-xl shadow-lg border border-outline-variant/10 scale-100 hover:scale-110 active:scale-90 transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(service._id)} className="p-3 bg-surface-container-high text-on-surface-variant hover:text-error rounded-xl shadow-lg border border-outline-variant/10 scale-100 hover:scale-110 active:scale-90 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Distribution Section */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 bg-surface-container p-12 rounded-[3rem] shadow-sm border border-outline-variant">
            <div className="flex items-center justify-between mb-12">
              <h4 className="text-2xl font-black text-on-surface tracking-tight">Department Traffic Matrix</h4>
              <button className="text-primary text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:underline underline-offset-8">
                View Full Audit <ExternalLink size={16} />
              </button>
            </div>
            <div className="space-y-10">
              <ProgressRow label="Cardiology" percent={78} color="bg-primary" />
              <ProgressRow label="Radiology" percent={64} color="bg-secondary" />
              <ProgressRow label="Neurology" percent={42} color="bg-tertiary" />
            </div>
          </div>
          <div className="lg:col-span-4 relative rounded-[3rem] overflow-hidden min-h-[400px] flex items-end p-10 text-white shadow-2xl group border border-outline-variant/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
              alt="Clinic Interior" 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop" 

            />
            <div className="relative z-20">
              <h4 className="text-2xl font-black mb-3 tracking-tight">Sanctuary Standards</h4>
              <p className="text-sm font-medium opacity-80 leading-relaxed italic">Our clinical sanctuary environment is maintained through rigorous service audits and patient feedback loops.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-surface-container-high rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden border border-outline-variant/10">
            <div className="p-8 sanctuary-gradient">
              <h2 className="text-2xl font-bold text-white tracking-tight">{editingService ? 'Modify Clinical Service' : 'Add New Service'}</h2>
              <p className="text-white/80 text-sm font-medium mt-1">Configure unit operations and pricing</p>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Service Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="e.g. Cardiology Screening"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Clinical Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner h-24 resize-none" placeholder="Details of sanctuary treatment..."/>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Sanctuary Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVAILABLE_ICONS.map((iconObj) => (
                    <div 
                      key={iconObj.name}
                      onClick={() => setFormData({...formData, iconName: iconObj.name})}
                      className={`h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 shadow-sm ${
                        formData.iconName === iconObj.name 
                          ? 'border-primary bg-primary/10 text-primary scale-105' 
                          : 'border-transparent bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {React.cloneElement(iconObj.icon, { size: 24 })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Base Price ($)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="150"/>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="sanctuary-gradient text-white font-black py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center">
                  Save Unit
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



export default AdminServices
