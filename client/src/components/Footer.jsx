import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-surface-container-high w-full py-24 px-8 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-3xl font-black text-on-surface tracking-tighter">
            Medi<span className="text-primary italic">Care</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed font-medium text-sm opacity-80">
            A premium private clinic sanctuary where world-class medical expertise meets intentional patient-centric care.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Medical Services</div>
          <ul className="space-y-4">
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/services">Cardiology</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/services">Neurology</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/services">Pediatrics</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/services">Emergency Care</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Quick Links</div>
          <ul className="space-y-4">
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/about">About Us</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/doctors">Our Doctors</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/portal">Patient Portal</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100" to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sanctuary Support</div>
          <div className="text-on-surface-variant text-xs leading-relaxed font-black uppercase tracking-widest opacity-60 space-y-4">
            <p>123 Sanctuary Way,<br/>Medical District, NY 10001</p>
            <p className="text-primary opacity-100">support@medicare.com</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-outline-variant/10 text-center">
        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          © {new Date().getFullYear()} MediCare Clinic Sanctuary. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
