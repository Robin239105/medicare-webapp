import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDoctors } from '../services/api'
import { Search, Filter, Star, MapPin, Calendar, ArrowRight } from 'lucide-react'

const OurDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Specialists')
  
  const categories = ['All Specialists', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Psychiatry']

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors()
        setDoctors(res.data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Header */}
      <section className="bg-surface-container-low py-20 px-8 border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto text-center">
          <span className="label-md font-bold text-primary tracking-widest uppercase mb-4 block">Medical Excellence</span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6">
            Meet Our <span className="text-primary italic">Sanctuary</span> Specialists
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium">
            Our world-class team combines unmatched clinical expertise with a deep commitment to compassionate, patient-centered care.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="relative -mt-10 px-8 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-surface-container rounded-[2.5rem] shadow-xl shadow-primary/5 border border-outline-variant p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={24} />
              <input 
                type="text" 
                placeholder="Search by specialist name..." 
                className="w-full pl-16 pr-6 py-5 bg-surface-container-low rounded-[2rem] border-none focus:ring-4 focus:ring-primary/10 font-bold text-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full md:w-72 group">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform" size={20} />
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-14 pr-10 py-5 bg-surface-container-low text-on-surface font-black rounded-[2rem] border border-outline-variant/10 appearance-none cursor-pointer focus:ring-4 focus:ring-primary/10 transition-all text-sm uppercase tracking-widest"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All Specialists' ? 'Active Filters' : cat}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <Filter size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Grid */}
      <section className="px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-bold tracking-widest uppercase">Synchronizing clinical data...</p>
            </div>
          ) : doctors.filter((doc, index, self) => 
            index === self.findIndex(d => d.name === doc.name)
          ).filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = activeCategory === 'All Specialists' || d.specialization === activeCategory
            return matchesSearch && matchesCategory
          }).map(doc => (
            <div key={doc._id} className="group bg-surface-container rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 border border-outline-variant transition-all duration-500 flex flex-col h-full">
              <div className="relative h-80 overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src={doc.image || 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=600&auto=format&fit=crop'}
                  alt={doc.name} 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-outline-variant shadow-sm">
                  <Star size={14} className="text-tertiary fill-tertiary" />
                  <span className="text-xs font-bold text-on-surface">4.9</span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-on-surface mb-1">{doc.name}</h3>
                    <p className="text-primary font-bold text-sm tracking-wide uppercase">{doc.specialization}</p>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium mb-8 opacity-90 line-clamp-3 min-h-[3rem]">
                      {doc.bio || "Leading expert dedicated to providing exceptional care within the clinical sanctuary environment."}
                    </p>
                  </div>

                  <div className="flex items-start gap-4 pt-6 border-t border-outline-variant/10 min-h-[4rem]">
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold whitespace-nowrap pt-0.5">
                      <MapPin size={14} /> Sanctuary NY
                    </div>
                    <div className="flex items-start gap-2 text-primary text-xs font-bold leading-tight">
                      <Calendar size={14} className="mt-0.5 shrink-0" /> 
                      <span className="opacity-100">
                        {doc.schedule?.length > 0 
                          ? doc.schedule.map(s => s.day).join(', ') 
                          : 'Schedule Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
                  <Link 
                    to="/booking" 
                    state={{ doctorId: doc._id }}
                    className="flex items-center justify-center sanctuary-gradient text-white py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-shadow"
                  >
                    Book Now
                  </Link>
                  <Link 
                    to={`/doctors/${doc._id}`}
                    className="flex items-center justify-center bg-surface-container-low text-on-surface py-4 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">Can't find the right specialist?</h2>
            <p className="opacity-80 font-medium">Our care coordinators are here to guide you to the right sanctuary professional.</p>
          </div>
          <Link to="/contact" className="bg-white text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            Talk to an Expert <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default OurDoctors
