import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDoctor } from '../services/api'
import { ArrowLeft, Star, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react'

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctor(id)
        setDoctor(res.data)
      } catch (error) {
        console.error('Error fetching doctor details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-on-surface mb-4">Specialist Not Found</h2>
        <button onClick={() => navigate('/doctors')} className="text-primary font-bold hover:underline">
          Return to Registry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Premium Header */}
      <div className="bg-surface-container py-12 px-8 border-b border-outline-variant/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
            <img 
              src={doctor.image || 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=600&auto=format&fit=crop'} 

              alt={doctor.name}
              className="w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-surface-container-high"
            />
            <div className="absolute -bottom-4 -right-4 bg-tertiary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-tertiary/30">
              4.9
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left pt-4">
            <Link to="/doctors" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline mb-6">
              <ArrowLeft size={16} /> Back to Directory
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-2">{doctor.name}</h1>
            <p className="text-xl font-bold text-primary tracking-widest uppercase mb-6">{doctor.specialization}</p>
            
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-2xl">
              {doctor.bio || "Dedicated clinical specialist offering state-of-the-art care and compassionate guidance in the sanctuary ecosystem."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl shadow-sm text-sm font-bold text-on-surface-variant border border-outline-variant/10">
                <MapPin size={16} className="text-primary" /> Sanctuary HQ
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl shadow-sm text-sm font-bold text-on-surface-variant border border-outline-variant/10">
                <CheckCircle size={16} className="text-secondary" /> Board Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Active Schedule Overview */}
          <section>
            <h3 className="text-2xl font-black text-on-surface mb-6 flex items-center gap-3">
              <Calendar className="text-primary" /> Clinical Availability
            </h3>
            
            {doctor.schedule && doctor.schedule.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctor.schedule.map((slot, index) => (
                  <div key={index} className="bg-surface-container-high p-6 rounded-2xl shadow-xl border border-outline-variant/10 flex items-start justify-between group hover:border-primary/20 transition-colors">
                    <div>
                      <h4 className="font-extrabold text-on-surface text-lg mb-1">{slot.day}</h4>
                      <p className="text-on-surface-variant text-sm font-medium flex items-center gap-2">
                        <Clock size={14} className="text-primary" /> {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-low p-8 rounded-2xl text-center">
                <p className="text-on-surface-variant font-medium">Pending active schedule blocks.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Action Block */}
        <div>
          <div className="bg-surface-container p-8 rounded-[2rem] shadow-2xl border border-outline-variant/5 sticky top-32">
            <h4 className="text-lg font-black text-on-surface mb-2">Ready for Consultation?</h4>
            <p className="text-sm font-medium text-on-surface-variant mb-8 line-clamp-3">
              Confirm your visit through our secure platform. The scheduling engine will instantly sync with {doctor.name}'s active calendar.
            </p>
            <Link 
              to="/booking"
              state={{ doctorId: doctor._id }}
              className="w-full flex items-center justify-center gap-3 sanctuary-gradient text-white py-5 rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
            >
              Book an Encounter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
