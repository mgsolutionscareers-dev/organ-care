import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink,
  Share2
} from 'lucide-react';
import { hospitalsData } from '../data/hospitalsData.js';

export const HospitalDetailPage = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const found = hospitalsData.find(h => h.id.toLowerCase() === id.toLowerCase()) || hospitalsData[0];
    setHospital(found);
  }, [id]);

  if (!hospital) return null;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hospitals Directory
          </Link>
        </div>

        {/* ----------------- SPLIT LAYOUT (Matches Reference Image) ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hospital Profile Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-100">
            {/* Hospital Photo */}
            <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-100">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {hospital.emergency24x7 && (
                  <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                    24/7 Emergency Care
                  </span>
                )}
              </div>
            </div>

            {/* Hospital Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                    {hospital.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    {hospital.rating} ({hospital.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{hospital.area}, {hospital.city}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {hospital.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Address & Contact Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{hospital.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                  <a href={`tel:${hospital.phone}`} className="font-bold text-slate-900 hover:text-brand-600">
                    {hospital.phone}
                  </a>
                </div>
              </div>

              {/* Action Buttons: Visit Website & Get Directions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>

              {/* Available Services (Matches screenshot: Available Services list) */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Available Services & Facilities:
                </h3>
                <div className="space-y-2">
                  {hospital.availableServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="pt-2 text-xs text-slate-500 leading-relaxed">
                {hospital.overview}
              </div>

            </div>
          </div>

          {/* Right Column: Route Map & Live Navigation Panel */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Hospital Navigation & Route</h3>
                <p className="text-xs text-slate-500">Fastest transit route with live traffic estimate</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                ~{hospital.travelTime} ETA
              </div>
            </div>

            {/* Interactive Route Map Container */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Hospital Route Map"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-navy-950/20"></div>

              {/* Simulated GPS Blue Path line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 60 260 Q 180 200 240 140 T 360 80"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              </svg>

              {/* User Start Marker */}
              <div className="absolute bottom-10 left-12 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                </div>
                <span className="text-[10px] font-bold text-white bg-navy-900/80 px-2 py-0.5 rounded-md mt-1">
                  Your Location
                </span>
              </div>

              {/* Destination Hospital Pin */}
              <div className="absolute top-14 right-20 flex flex-col items-center">
                <div className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xl flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {hospital.name}
                </div>
                <div className="w-3 h-3 bg-rose-600 rotate-45 -mt-1.5"></div>
              </div>

              {/* Float Card: 2.8 km, 10 min (Exactly matching UI reference!) */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-navy-900">{hospital.distanceKm} km</div>
                  <div className="text-xs text-slate-500 font-semibold">{hospital.travelTime} drive</div>
                </div>
              </div>
            </div>

            {/* Emergency Department Notice */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Emergency Triage Readiness</span>
                Emergency Department triage desk is active 24 hours daily. For acute life-threatening situations, dial 911 / 112 directly.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

