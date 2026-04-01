import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDoctors } from '../services/api'
import { 
  Heart, 
  Brain, 
  Activity, 
  Baby, 
  Stethoscope, 
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Quote,
  Star,
  Plus,
  MapPin,
  Calendar
} from 'lucide-react'

const ServiceCard = ({ icon, title, desc, color, text }) => (
  <div className="bg-surface-container p-8 rounded-xl border border-outline-variant hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center ${text} mb-6`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-on-surface-variant font-medium leading-relaxed opacity-90">{desc}</p>
  </div>
)

const Step = ({ num, title, desc }) => (
  <div className="flex gap-8 group">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black group-hover:bg-primary group-hover:text-white transition-all shadow-lg shrink-0">
      {num}
    </div>
    <div>
      <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant font-medium opacity-70 leading-relaxed">{desc}</p>
    </div>
  </div>
)



const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className="bg-surface-container rounded-[2rem] border border-outline-variant overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
      >
        <span className="text-lg font-bold text-on-surface">{question}</span>
        <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-primary text-white rotate-45' : 'bg-surface-container-high text-outline-variant'}`}>
          <Plus size={20} />
        </div>
      </button>
      {isOpen && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="h-px bg-outline-variant/10 mb-6" />
          <p className="text-on-surface-variant font-medium leading-relaxed opacity-80">{answer}</p>
        </div>
      )}
    </div>
  )
}

const Testimonial = ({ text, author, info, img }) => (
  <div className="bg-surface-container p-10 rounded-[2.5rem] shadow-sm border border-outline-variant hover:shadow-xl hover:shadow-primary/5 transition-all relative group overflow-hidden">
    <Quote className="text-primary opacity-[0.05] w-20 h-20 absolute -top-4 -right-4 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0" strokeWidth={1} />
    <p className="text-on-surface italic mb-10 relative z-10 font-medium leading-relaxed text-lg opacity-90">"{text}"</p>
    <div className="flex items-center gap-4">
      <img className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-surface-container" src={img} alt={author} />
      <div>
        <div className="font-bold">{author}</div>
        <div className="text-sm text-on-surface-variant font-medium">{info}</div>
      </div>
    </div>
  </div>
)

const Home = () => {
  const [doctors, setDoctors] = useState([])
  const [doctorsLoading, setDoctorsLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors()
        setDoctors(res.data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setDoctorsLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const featuredDoctors = doctors
    .filter((doc, index, self) => index === self.findIndex(d => d.name === doc.name))
    .slice(0, 3)

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden px-8 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
          <div className="z-10">
            <span className="label-md font-semibold tracking-wider text-primary mb-4 block uppercase opacity-80 decoration-primary decoration-2">
              Welcome to Your Sanctuary
            </span>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-on-surface mb-6">
              Healthcare Redefined with <span className="text-primary">Compassion.</span>
            </h1>
            <p className="body-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed font-medium">
              Experience a clinical environment that prioritizes your peace of mind. We combine cutting-edge precision with the warmth of a healing sanctuary.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking" className="sanctuary-gradient text-white px-8 py-4 rounded-lg font-semibold text-lg cloud-shadow hover:scale-105 transition-transform">
                Book Appointment
              </Link>
              <Link to="/services" className="bg-surface-container-low text-primary px-8 py-4 rounded-lg font-semibold text-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
                Our Services
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <img 
              className="rounded-[2rem] shadow-2xl w-full h-[600px] object-cover border-8 border-surface-container" 
              alt="Medical Sanctuary Interior" 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"

            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-container-low py-12 px-8 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-5xl font-extrabold text-primary mb-2">5000+</div>
            <div className="label-md tracking-widest text-on-surface-variant uppercase">Happy Patients</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-extrabold text-primary mb-2">20+</div>
            <div className="label-md tracking-widest text-on-surface-variant uppercase">Specialist Doctors</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-extrabold text-primary mb-2">15+</div>
            <div className="label-md tracking-widest text-on-surface-variant uppercase">Years Excellence</div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-on-surface mb-4">Our Specialized Services</h2>
          <div className="h-1 w-20 sanctuary-gradient mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<Heart />} 
            title="Cardiology" 
            desc="Advanced heart health diagnostics and personalized care plans for cardiovascular wellness." 
            color="bg-primary-fixed" 
            text="text-primary"
          />
          <ServiceCard 
            icon={<Brain />} 
            title="Neurology" 
            desc="Comprehensive neurological evaluations and treatment for brain and nervous system health." 
            color="bg-tertiary-fixed font-bold" 
            text="text-tertiary"
          />
          <ServiceCard 
            icon={<Activity />} 
            title="Orthopedics" 
            desc="Specialized care for bone, joint, and muscle health, focusing on mobility and recovery." 
            color="bg-secondary-fixed" 
            text="text-secondary"
          />
          <ServiceCard 
            icon={<Baby />} 
            title="Pediatrics" 
            desc="Gentle and expert medical care tailored for infants, children, and adolescents." 
            color="bg-primary-fixed" 
            text="text-primary"
          />
          <ServiceCard 
            icon={<Stethoscope />} 
            title="Internal Medicine" 
            desc="Expert general care and diagnostics for long-term health and preventive medicine." 
            color="bg-tertiary-fixed font-bold" 
            text="text-tertiary"
          />
          <ServiceCard 
            icon={<ShieldAlert />} 
            title="Emergency Care" 
            desc="24/7 rapid response medical care for urgent health situations and critical needs." 
            color="bg-secondary-fixed" 
            text="text-secondary"
          />
        </div>
      </section>



      {/* Health FAQ */}
      <section className="py-24 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-on-surface tracking-tighter mb-4">Patient FAQ</h2>
          <p className="text-on-surface-variant font-medium opacity-60">Common inquiries about your sanctuary experience.</p>
        </div>
        <div className="space-y-6">
          <FAQItem 
            question="How do I prepare for my first clinical consultation?" 
            answer="We recommend arriving 15 minutes early to synchronize your files. Please bring any previous medical reports and a list of current medications to ensure a thorough evaluation."
          />
          <FAQItem 
            question="Is the Patient Portal secure for my medical records?" 
            answer="Absolutely. We use end-to-end clinical-grade encryption and biometric-ready authentication to ensure your sanctuary data remains private and protected."
          />
          <FAQItem 
            question="Can I book emergency sessions through the web portal?" 
            answer="While our portal is perfect for scheduled care, for immediate life-threatening emergencies, please call our 24/7 Rapid Response line or your local emergency services."
          />
          <FAQItem 
            question="What insurance providers are synchronized with your system?" 
            answer="We work with most major medical insurance providers. You can verify your specific policy during the booking process or by contacting our administrative desk."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-surface-container-low py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-on-surface mb-8">Seamless Care in 3 Steps</h2>
              <div className="space-y-12">
                <Step 
                  num="1" 
                  title="Book Your Visit" 
                  desc="Use our simple online portal to select your preferred specialist and time slot." 
                />
                <Step 
                  num="2" 
                  title="Initial Consultation" 
                  desc="Meet with our expert doctors in a calm, focused environment for a thorough evaluation." 
                />
                <Step 
                  num="3" 
                  title="Personalized Plan" 
                  desc="Receive a tailored recovery or wellness plan designed specifically for your needs." 
                />
              </div>
            </div>
            <div className="relative">
              <img 
                className="rounded-2xl shadow-xl z-10 relative"
                alt="Patient consultation" 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
              />
              <div className="absolute -bottom-6 -left-6 bg-surface-container-high p-6 rounded-xl shadow-lg border border-outline-variant/20 z-20">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-tertiary w-8 h-8" />
                  <div>
                    <div className="font-bold text-on-surface">Certified Care</div>
                    <div className="text-sm text-on-surface-variant font-medium">ISO 9001 Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors — same cards as Our Doctors, first 3 from API */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold text-on-surface mb-2">Meet Our Specialists</h2>
            <p className="text-on-surface-variant font-medium">The world-class minds behind our sanctuary.</p>
          </div>
          <Link to="/doctors" className="text-primary font-bold flex items-center gap-2 hover:underline decoration-2">
            View All Doctors <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctorsLoading ? (
            <div className="col-span-full py-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-bold tracking-widest uppercase">Synchronizing clinical data...</p>
            </div>
          ) : (
            featuredDoctors.map((doc) => (
              <div key={doc._id} className="group bg-surface-container rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 border border-outline-variant transition-all duration-500">
                <div className="relative h-80 overflow-hidden">
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

                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-on-surface mb-1">{doc.name}</h3>
                    <p className="text-primary font-bold text-sm tracking-wide uppercase">{doc.specialization}</p>
                  </div>

                  <p className="text-on-surface-variant text-sm leading-relaxed font-medium mb-8 opacity-90 line-clamp-3">
                    {doc.bio || 'Leading expert dedicated to providing exceptional care within the clinical sanctuary environment.'}
                  </p>

                  <div className="flex items-center gap-6 pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold">
                      <MapPin size={14} /> Sanctuary NY
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-primary text-xs font-bold">
                      <Calendar size={14} />
                      {doc.schedule?.length > 0
                        ? doc.schedule.map((s) => s.day).join(', ')
                        : 'Schedule Pending'}
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <Link
                      to="/booking"
                      state={{ doctorId: doc._id }}
                      className="flex items-center justify-center sanctuary-gradient text-white py-4 rounded-xl font-bold text-sm shadow-md"
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
            ))
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-24 px-8 border-y border-outline-variant/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface mb-4">Patient Experiences</h2>
            <p className="text-on-surface-variant font-medium">What it feels like to be cared for at MediCare.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              text="The atmosphere is so different from other places I've been to. It really does feel like a sanctuary. Dr. Jenkins was incredibly thorough."
              author="Emily Thompson"
              info="Patient for 3 years"
              img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop"
            />
            <Testimonial 
              text="I had surgery here last month and the care was extraordinary. The staff treated me like family. Professionalism at its peak."
              author="Marcus Johnson"
              info="Post-Op Recovery"
              img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
            />
            <Testimonial 
              text="Finally, a clinic that respects your time. No long waits, and the booking process is so streamlined. Highly recommended."
              author="Sophia Lee"
              info="Regular Checkup"
              img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>
    </div>
  )
}



export default Home
