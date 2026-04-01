import React, { useState, useEffect } from 'react'
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api'
import {
  Search,
  UserPlus,
  ChevronRight,
  Mail,
  MapPin,
  Cake,
  Stethoscope,
  FileText,
  Calendar,
  AlertTriangle,
  LifeBuoy,
  Edit,
  Trash2
} from 'lucide-react'

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 group">
    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-outline-variant shadow-sm">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-on-surface">{value}</p>
    </div>
  </div>
)

const HistoryBlock = ({ icon, title, meta }) => (
  <div className="p-5 bg-surface-container-low/50 rounded-2xl flex items-center gap-5 hover:bg-white border border-transparent hover:border-outline-variant/10 transition-all cursor-pointer group shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex-1">
      <p className="text-sm font-extrabold text-on-surface tracking-tight">{title}</p>
      <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">{meta}</p>
    </div>
    <FileText className="text-outline-variant opacity-40 group-hover:text-primary transition-colors" size={16} />
  </div>
)

const AdminPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' })

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatients()
        setPatients(res.data)
        if (res.data.length > 0) setSelectedPatient(res.data[0])
      } catch (err) {
        console.error('Failed to sync sanctuary registry:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const openModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({ name: patient.name, email: patient.email, password: '', phone: patient.phone || '' })
    } else {
      setEditingPatient(null)
      setFormData({ name: '', email: '', password: '', phone: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingPatient) {
        const updateData = { name: formData.name, email: formData.email, phone: formData.phone }
        if (formData.password) updateData.password = formData.password
        const res = await updatePatient(editingPatient._id, updateData)
        setPatients(prev => prev.map(p => p._id === editingPatient._id ? res.data : p))
      } else {
        const res = await createPatient(formData)
        setPatients(prev => [res.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving patient')
    }
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    setItemToDelete(id)
  }

  const confirmDelete = async () => {
    try {
      await deletePatient(itemToDelete)
      setPatients(prev => prev.filter(p => p._id !== itemToDelete))
    } catch (err) {
      console.error('Failed to erase record.', err)
    } finally {
      setItemToDelete(null)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface italic font-bold">Synchronizing Patient Registry...</div>

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased pb-20">
      {/* Header Section */}
      <header className="p-10 lg:p-12 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Patient Registry</h1>
          <p className="text-on-surface-variant font-medium max-w-2xl opacity-80">Manage patient records, clinical history, and sanctuary insights.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              className="pl-12 pr-6 py-4 bg-surface-container-high border-none rounded-2xl shadow-inner focus:ring-4 focus:ring-primary/10 w-full md:w-80 text-sm font-bold outline-none transition-all" 
              placeholder="Search registry..." 
              type="text"
            />
          </div>
          <button onClick={() => openModal()} className="sanctuary-gradient text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <UserPlus size={20} /> New Patient
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="p-10 lg:p-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Patient List Area */}
          <section className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-surface-container rounded-[2.5rem] shadow-sm overflow-hidden border border-outline-variant">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
                <h3 className="text-xl font-black text-on-surface tracking-tight uppercase tracking-[0.1em]">Population Health Feed</h3>
                <span className="px-5 py-1.5 bg-tertiary/10 text-tertiary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">{patients.length} ACTIVE LIVES</span>
              </div>
              
              <div className="divide-y divide-outline-variant/10">
                {patients.map(p => (
                  <div 
                    key={p._id} 
                    onClick={() => setSelectedPatient(p)}
                    className={`p-8 flex items-center justify-between hover:bg-primary/5 transition-all duration-300 group cursor-pointer relative overflow-hidden ${selectedPatient?._id === p._id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl sanctuary-gradient text-white flex items-center justify-center font-black text-xl shadow-md uppercase">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold text-on-surface group-hover:text-primary transition-colors">{p.name}</h4>
                        <p className="text-xs font-bold text-on-surface-variant opacity-60 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></div> {p.phone || 'No Contact'}</p>
                      </div>
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-end gap-1 px-8 border-x border-outline-variant/10">
                      <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Registrant ID</span>
                      <span className="text-sm font-black text-primary uppercase">{p._id.slice(-6)}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block mr-4">
                        <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest mb-1">Joined Sanctuary</p>
                        <p className="text-sm font-black text-on-surface">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openModal(p) }} className="p-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-primary rounded-xl transition-all shadow-sm">
                          <Edit size={16} />
                        </button>
                        <button onClick={(e) => handleDelete(p._id, e)} className="p-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-error rounded-xl transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Action */}
              <button className="w-full py-6 bg-surface-container-low/30 text-on-surface-variant font-bold text-sm uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                Load More Registry Data
              </button>
            </div>
          </section>

          {/* Right Detailed Sidebar */}
          <section className="col-span-12 lg:col-span-4 space-y-8">
            {selectedPatient ? (
              <>
                <div className="bg-surface-container p-10 shadow-xl shadow-primary/5 border border-outline-variant sticky top-32 rounded-[2.5rem]">
                  <div className="text-center mb-10">
                    <div className="relative inline-block mb-6">
                      <div className="w-40 h-40 rounded-[2rem] sanctuary-gradient flex items-center justify-center text-5xl text-white font-black ring-8 ring-primary/5 shadow-xl uppercase">
                        {selectedPatient.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-2 right-2 bg-tertiary w-8 h-8 rounded-2xl border-4 border-surface-container shadow-lg animate-bounce"></span>
                    </div>
                    <h2 className="text-2xl font-black text-on-surface tracking-tight">{selectedPatient.name}</h2>
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2 opacity-60">Status: ACTIVE PATIENT</p>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-6">
                      <DetailItem icon={<Mail />} label="Secure Email" value={selectedPatient.email} />
                      <DetailItem icon={<MapPin />} label="Contact" value={selectedPatient.phone || "Not Provided"} />
                      <DetailItem icon={<Calendar />} label="Joined" value={new Date(selectedPatient.createdAt).toLocaleDateString()} />
                    </div>

                    <button className="w-full py-5 sanctuary-gradient text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                      <FileText size={20} /> View Full Chart
                    </button>
                  </div>
                </div>

                <button className="w-full py-5 bg-error text-white rounded-2xl font-black shadow-xl hover:bg-error/90 transition-all flex items-center justify-center gap-3">
                  <AlertTriangle size={20} className="animate-pulse" /> Emergency Broadcast
                </button>
              </>
            ) : (
              <div className="h-[400px] bg-surface-container rounded-[2.5rem] p-10 shadow-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center opacity-60">
                <LifeBuoy size={48} className="text-primary mb-6" />
                <p className="font-extrabold text-on-surface">Select a patient to view details.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-surface-container rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant">
            <div className="p-8 sanctuary-gradient">
              <h2 className="text-2xl font-bold text-white tracking-tight">{editingPatient ? 'Update Identity' : 'Enroll New Life'}</h2>
              <p className="text-white/80 text-sm font-medium mt-1">Sanctuary Data Secure Protocol</p>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="John Doe"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Secure Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="john@example.com"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Contact Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder="+1 (..."/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Access Phrase {editingPatient && '(Leave blank to keep)'}</label>
                <input type={editingPatient ? "password" : "text"} required={!editingPatient} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-bold outline-none transition-all shadow-inner" placeholder={editingPatient ? '***' : 'Generated Secure Key'}/>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">Abort</button>
                <button type="submit" className="sanctuary-gradient text-white font-black py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center">
                  Secure Data
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



export default AdminPatients
