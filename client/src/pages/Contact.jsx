import React from 'react'
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react'

const ContactItem = ({ icon, label, value, subValue }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500 border border-outline-variant/10">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-label-md text-on-surface-variant font-bold mb-1 opacity-70">{label}</p>
      <p className="text-lg font-bold text-on-surface leading-tight">{value}</p>
      {subValue && <p className="text-xs text-on-surface-variant font-bold mt-1 opacity-60 uppercase">{subValue}</p>}
    </div>
  </div>
)

const Contact = () => {
  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased">
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-20 max-w-3xl">
          <p className="text-label-md text-primary mb-4 font-bold border-l-4 border-primary pl-4">Connect With Us</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6 leading-[1.2]">
            Experience the <span className="text-primary-container italic">Sanctuary</span> of Modern Care.
          </h1>
          <p className="text-body-lg text-on-surface-variant font-medium leading-relaxed opacity-90 max-w-2xl">
            We are here to assist you with any inquiries regarding our medical services, specialist appointments, or clinical facility tours.
          </p>
        </header>

        {/* Bento Layout for Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form Section */}
          <section className="lg:col-span-7 bg-surface-container rounded-3xl p-8 md:p-12 shadow-2xl border border-outline-variant/10">
            <h2 className="text-3xl font-bold text-on-surface mb-10">Send a Message</h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-label-md text-on-surface-variant font-bold" htmlFor="name">Full Name</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                    id="name" 
                    placeholder="John Doe" 
                    type="text"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-label-md text-on-surface-variant font-bold" htmlFor="email">Email Address</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                    id="email" 
                    placeholder="john@example.com" 
                    type="email"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant font-bold" htmlFor="subject">Department</label>
                <div className="relative">
                  <select className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-medium">
                    <option>General Inquiry</option>
                    <option>Specialist Consultation</option>
                    <option>Billing & Insurance</option>
                    <option>Technical Support</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-label-md text-on-surface-variant font-bold" htmlFor="message">Message</label>
                <textarea 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none font-medium" 
                  id="message" 
                  placeholder="How can we help you today?" 
                  rows="5"
                ></textarea>
              </div>

              <button className="w-full md:w-auto px-12 py-5 sanctuary-gradient text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                <Send size={20} /> Send Message
              </button>
            </form>
          </section>

          {/* Info & Location Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            {/* Emergency Highlight Card */}
            <div className="bg-error-container text-on-error-container rounded-[2rem] p-8 flex items-start gap-6 border-l-8 border-error shadow-md">
              <AlertTriangle className="text-error w-10 h-10 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 uppercase tracking-wider">Emergency Contact</h3>
                <p className="text-3xl font-black mb-3 tracking-tighter">911 or (555) 000-9999</p>
                <p className="text-sm font-medium opacity-80 leading-relaxed">Our emergency triage is available 24/7 for life-threatening conditions.</p>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-surface-container-low rounded-[2rem] p-10 space-y-8 border border-outline-variant/10 shadow-xl shadow-black/20">
              <ContactItem icon={<Phone />} label="Phone" value="+1 (800) 123-4567" />
              <ContactItem icon={<Mail />} label="Email" value="care@medicareclinic.com" />
              <ContactItem 
                icon={<Clock />} 
                label="Opening Hours" 
                value="Mon - Fri: 8 AM - 8 PM" 
                subValue="Sat - Sun: 10 AM - 4 PM"
              />
            </div>

            {/* Location / Address Card */}
            <div className="bg-surface-container rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10">
              <div className="h-56 w-full bg-surface-variant relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-40 contrast-125 transition-all hover:scale-105 duration-1000" alt="Clinical Excellence" />
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <div className="bg-surface-container-high p-4 rounded-full shadow-2xl animate-pulse">
                    <MapPin className="text-primary w-8 h-8 fill-primary/10" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-surface-container-high/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-primary shadow-sm border border-outline-variant/10">
                  123 Sanctuary Way, Medical District
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 text-on-surface">Clinic Location</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-6 opacity-80">
                  Located in the heart of the city’s health district, easily accessible via public transit and with ample private parking.
                </p>
                <a className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300" href="#">
                  Get Directions <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ CTA Section */}
        <section className="mt-24 sanctuary-gradient text-white rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="z-10 relative max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a quick question?</h2>
            <p className="text-lg opacity-90 font-medium">Browse our help center for immediate answers regarding insurance, patient portals, and visitor policies.</p>
          </div>
          <button className="z-10 relative px-10 py-5 bg-white/10 border border-white/20 backdrop-blur-md text-white font-extrabold rounded-2xl hover:bg-white/20 transition-all whitespace-nowrap shadow-xl flex items-center gap-3">
            <HelpCircle size={24} /> Visit Help Center
          </button>
          
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl"></div>
        </section>
      </main>
    </div>
  )
}



export default Contact
