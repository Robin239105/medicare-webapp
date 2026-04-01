import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../services/api'
import { 
  Heart, 
  Brain, 
  Activity, 
  Baby, 
  ShieldAlert, 
  Stethoscope, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Bone,
  Syringe,
  Microscope,
  Eye
} from 'lucide-react'

const Badge = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-6 bg-surface-container rounded-3xl shadow-sm border border-outline-variant">
    <div className="w-14 h-14 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-tertiary mb-6 font-bold">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h4 className="text-xl font-bold text-on-surface mb-3">{title}</h4>
    <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-80">{desc}</p>
  </div>
)

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

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

  const iconMap = {
    'Heart': <Heart />,
    'Brain': <Brain />,
    'Activity': <Activity />,
    'Baby': <Baby />,
    'ShieldAlert': <ShieldAlert />,
    'Stethoscope': <Stethoscope />,
    'Bone': <Bone />,
    'Syringe': <Syringe />,
    'Microscope': <Microscope />,
    'Eye': <Eye />
  }

  const renderIcon = (iconName, title) => {
    if (iconMap[iconName]) return iconMap[iconName]
    // Legacy fallback based on title
    if (iconMap[title]) return iconMap[title]
    return <Stethoscope />
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Header */}
      <section className="bg-surface py-20 px-8 border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto text-center">
          <span className="label-md font-bold text-primary tracking-widest uppercase mb-4 block underline decoration-primary decoration-4">Our Medical Menu</span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6">
            World-Class Care, <span className="text-primary italic">Designed for You</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium">
            Discover a comprehensive range of clinical services executed with precision and a deep commitment to patient-centric healing.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-8 max-w-7xl mx-auto py-24">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-bold tracking-widest uppercase">Synchronizing clinical data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service._id} className="group bg-surface-container p-10 rounded-[2.5rem] shadow-sm border border-outline-variant hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary-container group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(renderIcon(service.iconName, service.title), { size: 28 })}
                  </div>
                  <div className="text-primary font-bold text-xl">${service.price} <span className="text-on-surface-variant text-xs font-medium uppercase tracking-widest opacity-60">Consultation</span></div>
                </div>

                <h3 className="text-2xl font-bold text-on-surface mb-4">{service.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-medium mb-10 opacity-90">
                  {service.description || "Expert medical consultation and diagnostic care within our sanctuary environment."}
                </p>

                <ul className="space-y-4 mb-4">
                  <li className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-tertiary" /> Specialized Diagnostics
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-tertiary" /> Personalized Care Plan
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-tertiary" /> 24/7 Portal Access
                  </li>
                </ul>

                <hr className="border-outline-variant/10 my-8" />
                
                <div className="mb-10">
                   <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Preparation Protocol</h5>
                   <div className="p-5 bg-surface rounded-2xl border border-outline-variant/30">
                      <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed opacity-60">
                        Arrive 15 mins early. Bring previous medical history. Fasting may be required depending on diagnostic depth.
                      </p>
                   </div>
                </div>

                <Link 
                  to="/booking" 
                  state={{ serviceId: service._id }}
                  className="w-full flex items-center justify-center gap-3 bg-surface-container-high text-primary py-5 rounded-2xl font-bold text-sm group-hover:sanctuary-gradient group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  Book This Service <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Specialty Highlights */}
      <section className="pb-24 px-8 max-w-7xl mx-auto">
        <div className="bg-primary/5 rounded-[3rem] p-12 lg:p-20 grid lg:grid-cols-2 gap-12 items-center border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
            <Microscope size={300} />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Clinical Methodology</span>
            <h2 className="text-4xl font-black text-on-surface tracking-tight mb-8">Synchronized Healthcare Mastery.</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><CheckCircle2 size={20} /></div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Integrated medical records accessible anywhere in the clinical sanctuary.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><CheckCircle2 size={20} /></div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Rapid diagnostic turn-around using cloud-synced laboratory systems.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><CheckCircle2 size={20} /></div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Multidisciplinary specialist consultation for complex clinical cases.</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 hidden lg:block">
            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop" className="rounded-[2.5rem] shadow-2xl border-4 border-surface" alt="Clinical Excellence" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-surface-container py-20 px-8 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <Badge icon={<Clock />} title="Minimal Wait Times" desc="Our sanctuary avoids the congestion of traditional hospitals." />
          <Badge icon={<ShieldCheck />} title="Expert Certification" desc="Every specialist is board-certified with years of excellence." />
          <Badge icon={<Activity />} title="Outcome Focused" desc="We focus on long-term wellness trajectories for every patient." />
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-on-surface mb-4">Ready to Prioritize Your Wellness?</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto mb-12 font-medium">Join thousands of patients who have discovered the sanctuary difference.</p>
        <Link to="/booking" className="sanctuary-gradient text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform duration-300">
          Book Your Initial Consultation
        </Link>
      </section>
    </div>
  )
}



export default ServicesPage
