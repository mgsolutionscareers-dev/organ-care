import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Apple, 
  Stethoscope, 
  Building2, 
  Bot, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  Heart,
  Brain,
  Wind
} from 'lucide-react';
import { organsData } from '../../../backend/src/data/organsData.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const [organs, setOrgans] = useState([]);

  useEffect(() => {
    // Fetch organs from backend API with fallback
    fetch('/api/organs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrgans(data.data);
      })
      .catch(() => setOrgans(organsData));
  }, []);

  const featureCards = [
    {
      title: '3D Anatomy Explorer',
      description: 'Interact with full-body 3D models, rotate, zoom, and explore internal organ structures.',
      icon: Compass,
      link: '/anatomy',
      gradient: 'from-teal-500/10 to-teal-500/20',
      border: 'border-teal-500/30',
      iconColor: 'text-brand-500',
    },
    {
      title: 'Nutrition Guidance',
      description: 'Discover evidence-informed diets, supportive foods, and habits to protect every vital organ.',
      icon: Apple,
      link: '/nutrition',
      gradient: 'from-emerald-500/10 to-emerald-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Find Doctors & Hospitals',
      description: 'Locate certified cardiologists, neurologists, and nearby hospitals with 24/7 emergency care.',
      icon: Stethoscope,
      link: '/doctors',
      gradient: 'from-sky-500/10 to-sky-500/20',
      border: 'border-sky-500/30',
      iconColor: 'text-sky-500',
    },
    {
      title: 'AI Health Chatbot',
      description: 'Get instant educational explanations for organ functions, symptoms, and medical specialties.',
      icon: Bot,
      link: '/ai-assistant',
      gradient: 'from-cyan-500/10 to-cyan-500/20',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-[#0A2E35] text-white py-16 lg:py-24">
        {/* Glow backdrop shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                3D-Powered Healthcare Education Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Explore Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
                  Take Charge of Your Health.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Interactive 3D anatomy, organ information, nutrition guidance and healthcare support — all in one place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/anatomy"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-navy-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-glow hover:scale-105 transition-all"
                >
                  <Activity className="w-5 h-5" />
                  Explore 3D Body
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/nutrition"
                  className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all"
                >
                  Learn More
                </Link>
              </div>

              {/* Verification Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>WHO & NHS Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>11 Core Anatomy Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-teal-400" />
                  <span>Evidence-Informed Care</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (Matches reference illustration) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-teal-500/30 shadow-2xl bg-gradient-to-b from-navy-900/80 to-navy-950/80 backdrop-blur-xl p-3 group">
                <img
                  src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"
                  alt="3D Anatomical Human Model"
                  className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                
                {/* Overlay floating badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-navy-900/90 backdrop-blur-md border border-teal-500/30 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Interactive 3D Engine</span>
                    <h4 className="text-sm font-bold">Real-time WebGL Anatomy</h4>
                  </div>
                  <Link
                    to="/anatomy"
                    className="p-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------- 4 FEATURE CARDS (Below Hero) ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                to={feat.link}
                className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-xl border border-slate-100 hover:border-brand-200 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} ${feat.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ----------------- ORGANS OVERVIEW GRID ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600">
              Interactive Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-1">
              Explore Vital Human Organs
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mt-2">
              Select any organ to examine high-resolution 3D visualizations, biological functions, warning signs, and dietary support.
            </p>
          </div>
          <Link
            to="/anatomy"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            Launch 3D Body Explorer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organs.slice(0, 6).map((org) => (
            <div
              key={org.organId}
              onClick={() => navigate(`/organ/${org.organId}`)}
              className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-xl border border-slate-100 hover:border-brand-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-700">
                  {org.system}
                </span>
                <span className="text-xs text-slate-400 font-mono">{org.layer}</span>
              </div>

              <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                {org.name}
              </h3>
              <p className="text-xs font-semibold text-brand-600 mt-0.5">
                {org.tagline}
              </p>

              <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                {org.overview}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy-900">
                <span className="text-brand-600 group-hover:underline">View Anatomy & Care</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- PURPOSE & HEALTHCARE IMPACT ----------------- */}
      <section className="bg-navy-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Why OrganCare?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Bridging Medical Knowledge and Everyday Patient Wellness
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Most patients find anatomy diagrams confusing and medical terminology intimidating. OrganCare turns medical science into an intuitive, visual, and actionable experience.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Anatomical Accuracy</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Built on peer-reviewed clinical literature from WHO, NHS, and MedlinePlus.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Specialist Discovery</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Seamlessly connects each organ condition to the appropriate specialist physician and nearby tertiary hospitals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ethical, Safe AI</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Strict safety protocols that protect users against misleading diagnoses and identify emergencies immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-navy-800/80 border border-teal-500/20 backdrop-blur-md text-center">
                <span className="text-4xl font-extrabold text-teal-400">11</span>
                <p className="text-xs text-slate-300 font-semibold mt-1">Key Internal Organs</p>
                <p className="text-[11px] text-slate-400 mt-0.5">3D Interactive Models</p>
              </div>

              <div className="p-6 rounded-3xl bg-navy-800/80 border border-teal-500/20 backdrop-blur-md text-center">
                <span className="text-4xl font-extrabold text-teal-400">500+</span>
                <p className="text-xs text-slate-300 font-semibold mt-1">Medical Functions</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Physiological Data Points</p>
              </div>

              <div className="p-6 rounded-3xl bg-navy-800/80 border border-teal-500/20 backdrop-blur-md text-center">
                <span className="text-4xl font-extrabold text-teal-400">100%</span>
                <p className="text-xs text-slate-300 font-semibold mt-1">Verified Doctors</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Hospital Affiliated</p>
              </div>

              <div className="p-6 rounded-3xl bg-navy-800/80 border border-teal-500/20 backdrop-blur-md text-center">
                <span className="text-4xl font-extrabold text-teal-400">24/7</span>
                <p className="text-xs text-slate-300 font-semibold mt-1">Educational AI</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Safe Guidance Assistant</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

