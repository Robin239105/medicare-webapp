import React from 'react'
import { Link } from 'react-router-dom'
import { 
  History, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Lightbulb,
  Award,
  Star,
  Shield,
  Trophy
} from 'lucide-react'

const ValueCard = ({ icon, title, desc, color, bg }) => (
  <div className="group p-10 rounded-3xl bg-surface-container hover:bg-surface-container-high transition-all duration-500 border border-outline-variant shadow-sm hover:shadow-xl hover:shadow-primary/5">
    <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
      {React.cloneElement(icon, { size: 32, className: color })}
    </div>
    <h4 className="text-2xl font-bold mb-4 text-on-surface">{title}</h4>
    <p className="text-on-surface-variant leading-relaxed font-medium opacity-90">{desc}</p>
  </div>
)

const AwardBadge = ({ icon, title, desc }) => (
  <div className="bg-surface-container p-8 rounded-3xl text-center border border-outline-variant shadow-sm transition-transform hover:-translate-y-2 duration-300">
    <div className="text-primary mb-6 flex justify-center">
      {React.cloneElement(icon, { size: 48, strokeWidth: 1.5 })}
    </div>
    <p className="font-bold text-on-surface leading-tight mb-2">{title}</p>
    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest opacity-60">{desc}</p>
  </div>
)

const AboutUs = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* Hero Section: Asymmetric Layout */}
      <section className="relative overflow-hidden bg-surface py-24 px-8 pt-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <span className="label-md text-primary tracking-[0.2em] font-bold uppercase text-xs">ESTABLISHED 1998</span>
            <h1 className="text-5xl md:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight">
              A Sanctuary for <br/>
              <span className="text-primary">Clinical Excellence</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl font-medium">
              Founded on the principles of high-end hospitality and medical precision, MediCare Clinic provides a tranquil environment where advanced healthcare meets compassionate service.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-surface-container">
              <img 
                className="w-full h-full object-cover" 
                alt="Modern Clinic Reception" 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop" 
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-surface-container p-8 rounded-2xl shadow-xl border border-outline-variant max-w-[220px]">
              <p className="text-4xl font-extrabold text-primary mb-1">25+</p>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider leading-relaxed">Years of Dedicated Patient Sanctuary</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="bg-surface-container py-32 px-8 border-y border-outline-variant/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-on-surface">The MediCare Journey</h2>
              <div className="w-16 h-1.5 sanctuary-gradient rounded-full"></div>
              <div className="space-y-6">
                <p className="text-on-surface-variant leading-relaxed font-medium text-lg">
                  What began as a small private practice has evolved into a leading multi-disciplinary clinic. We recognized that the environment in which healing occurs is just as vital as the treatment itself.
                </p>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  By removing the sterile, intimidating atmosphere of traditional hospitals, we've created a space where patients feel heard, respected, and truly at peace.
                </p>
              </div>
            </div>
            <div className="bg-surface-container p-12 rounded-[2.5rem] shadow-sm border border-outline-variant relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <Sparkles className="text-primary w-10 h-10 mb-8" />
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Our Mission</h3>
              <p className="text-xl italic text-on-surface-variant leading-relaxed font-medium opacity-90">
                "To redefine the healthcare experience by blending world-class clinical expertise with an atmosphere of absolute serenity and personal attention."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-surface py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="label-md text-primary tracking-[0.2em] font-bold uppercase text-xs">GUIDING PRINCIPLES</span>
            <h2 className="text-4xl font-bold text-on-surface">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<ShieldCheck />} 
              title="Integrity" 
              desc="Unwavering ethical standards in every diagnosis, treatment, and patient interaction we facilitate." 
              color="text-primary"
              bg="bg-primary/5"
            />
            <ValueCard 
              icon={<HeartHandshake />} 
              title="Compassion" 
              desc="Empathy is the heartbeat of our clinic. We treat the person, not just the symptoms or the charts." 
              color="text-tertiary"
              bg="bg-tertiary/5"
            />
            <ValueCard 
              icon={<Lightbulb />} 
              title="Innovation" 
              desc="Continuous adoption of cutting-edge medical technologies within our peaceful healing sanctuary." 
              color="text-secondary"
              bg="bg-secondary/5"
            />
          </div>
        </div>
      </section>

      {/* Team Panorama */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-[21/9] shadow-2xl border-4 border-surface-container">
            <img 
              className="w-full h-full object-cover" 
              alt="Medical Team" 
              src="https://images.unsplash.com/photo-1755189776403-323a2523ca0b?q=80&w=1000&auto=format&fit=crop" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-3">The Hands Behind Your Care</h3>
                <p className="opacity-90 font-medium text-lg">Our multidisciplinary team of specialists is united by a single vision: your enduring health and well-being.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="bg-surface-container-high py-32 px-8 border-y border-outline-variant/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <span className="label-md text-primary tracking-[0.2em] font-bold uppercase text-xs">RECOGNITION</span>
              <h2 className="text-4xl font-bold text-on-surface mt-4">Excellence Acknowledged</h2>
              <p className="text-on-surface-variant mt-4 font-medium leading-relaxed">Our commitment to safety and quality is validated by international healthcare bodies and patient choice awards.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AwardBadge icon={<Award />} title="JCI Accredited Facility" desc="Global Safety Standard" />
            <AwardBadge icon={<Trophy />} title="Top Clinic Award 2024" desc="Healthcare Excellence" />
            <AwardBadge icon={<Star />} title="Patient Choice Winner" desc="5-Star Experience" />
            <AwardBadge icon={<Shield />} title="ISO 9001 Certified" desc="Quality Management" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto sanctuary-gradient rounded-[3rem] p-20 text-center text-white relative overflow-hidden cloud-shadow">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Experience The Sanctuary Difference</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">Your journey toward better health begins in an environment designed for your comfort.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/booking" className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:scale-105 transition-transform">Book Your Consultation</Link>
              <Link to="/services" className="px-10 py-5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">View Our Services</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  )
}



export default AboutUs
