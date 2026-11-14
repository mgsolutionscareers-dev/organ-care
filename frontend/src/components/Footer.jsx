import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldAlert, PhoneCall, Globe, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      {/* Emergency Notice Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-navy-900 to-rose-900/60 border-b border-rose-500/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-rose-200 gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>MEDICAL EMERGENCY NOTICE:</strong> If you are experiencing chest pain, difficulty breathing, or stroke symptoms, call emergency services immediately.
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono font-bold text-rose-300">
            <span>US/CAN: 911</span>
            <span>EU/IND: 112</span>
            <span>UK: 999</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white stroke-white" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                Organ<span className="text-brand-400">Care</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering patient health literacy through interactive 3D human anatomy, evidence-informed nutrition, and direct discovery of verified physicians and hospitals.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-300">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Evidence-based WHO & NHS Sources</span>
            </div>
          </div>

          {/* Column 2: 3D Body & Exploration */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Anatomy Explorer
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/anatomy" className="hover:text-brand-400 transition-colors">3D Full Body View</Link></li>
              <li><Link to="/organ/heart" className="hover:text-brand-400 transition-colors">Cardiovascular (Heart)</Link></li>
              <li><Link to="/organ/brain" className="hover:text-brand-400 transition-colors">Nervous System (Brain)</Link></li>
              <li><Link to="/organ/lungs" className="hover:text-brand-400 transition-colors">Respiratory (Lungs)</Link></li>
              <li><Link to="/organ/liver" className="hover:text-brand-400 transition-colors">Hepatic & Metabolic (Liver)</Link></li>
              <li><Link to="/organ/kidneys" className="hover:text-brand-400 transition-colors">Renal System (Kidneys)</Link></li>
            </ul>
          </div>

          {/* Column 3: Healthcare Discovery */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Healthcare Discovery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className="hover:text-brand-400 transition-colors">Find Verified Doctors</Link></li>
              <li><Link to="/hospitals" className="hover:text-brand-400 transition-colors">Nearby Hospitals & ERs</Link></li>
              <li><Link to="/nutrition" className="hover:text-brand-400 transition-colors">Organ-Specific Nutrition</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-brand-400 transition-colors">AI Health Assistant</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Personal Health Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 4: Medical Safety & Credibility */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Medical Editorial Policy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All health, nutrition, and anatomical descriptions are curated for educational purposes only. OrganCare does not provide direct medical advice, clinical diagnoses, or prescription dosage recommendations.
            </p>
            <div className="p-3 rounded-xl bg-navy-900 border border-teal-500/20 text-xs text-slate-300">
              <span className="text-brand-400 font-bold block mb-1">Always Consult a Physician</span>
              Speak with a licensed medical practitioner for personalized assessment of signs, symptoms, or chronic conditions.
            </div>
          </div>

        </div>

        <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OrganCare Healthcare Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Medical Sources & References</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

