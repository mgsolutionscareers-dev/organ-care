import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Search, 
  ShieldAlert, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Crosshair,
  Map as MapIcon
} from 'lucide-react';
import { hospitalsData } from '../data/hospitalsData';
import { HospitalMap } from '../components/HospitalMap';

// Calculate distance using Haversine formula
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}

export const HospitalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty') || 'all';

  const [hospitals, setHospitals] = useState(hospitalsData);
  const [selectedHospital, setSelectedHospital] = useState(hospitalsData[0]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Filter hospitals based on search & specialty
  useEffect(() => {
    let filtered = hospitalsData.map(h => {
      let dist = h.distanceKm;
      if (userLocation) {
        dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, h.coordinates.lat, h.coordinates.lng);
      }
      return { ...h, distanceKm: dist };
    });

    if (userLocation) {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (selectedSpecialty !== 'all') {
      const spec = selectedSpecialty.toLowerCase();
      filtered = filtered.filter(h => 
        h.specialties.some(s => s.toLowerCase() === spec) ||
        h.tags.some(t => t.toLowerCase().includes(spec))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.postalCode.includes(q)
      );
    }

    setHospitals(filtered);
    if (filtered.length > 0 && !filtered.some(h => h.id === selectedHospital?.id)) {
      setSelectedHospital(filtered[0]);
    }
  }, [selectedSpecialty, searchQuery, userLocation]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied/failed:', err.message);
        setLocationError('Location permission was denied. You can search manually by city or area.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const specialties = [
    { key: 'all', label: 'All Hospital Departments' },
    { key: 'cardiology', label: 'Cardiology & Heart Care' },
    { key: 'neurology', label: 'Neurology & Stroke Center' },
    { key: 'pulmonology', label: 'Pulmonology & Respiratory' },
    { key: 'gastroenterology', label: 'Gastroenterology & Liver' },
    { key: 'nephrology', label: 'Nephrology & Dialysis' },
    { key: 'urology', label: 'Urology & Kidney Care' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Verified Hospital Infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">
              Nearby Hospitals & Emergency Centers
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live interactive map and directory of accredited tertiary hospitals and 24/7 trauma centers.
            </p>
          </div>

          <button
            onClick={requestUserLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all self-start md:self-auto"
          >
            <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Detecting GPS...' : 'Find Hospitals Near Me'}
          </button>
        </div>

        {/* GPS Location Alerts */}
        {userLocation && (
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              GPS Detected: Showing hospitals sorted by actual distance from your location ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}).
            </span>
          </div>
        )}
        {locationError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-slate-100 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, area, department, or postal code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="w-full sm:w-72">
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setSearchParams({ specialty: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-brand-500"
            >
              {specialties.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ----------------- LIVE INTERACTIVE MAP SECTION ----------------- */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-brand-500" />
              Interactive Hospital Navigation Map ({hospitals.length} pins)
            </h2>
            <span className="text-xs text-slate-400">Click any hospital pin to view details and route</span>
          </div>

          <HospitalMap
            hospitals={hospitals}
            selectedHospital={selectedHospital}
            onSelectHospital={(h) => setSelectedHospital(h)}
            userLocation={userLocation}
            height="440px"
          />
        </div>

        {/* ----------------- HOSPITALS CARDS GRID ----------------- */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Hospital Listings & Medical Departments ({hospitals.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hosp) => {
              const isSelected = selectedHospital?.id === hosp.id;
              return (
                <div
                  key={hosp.id}
                  onClick={() => setSelectedHospital(hosp)}
                  className={`bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected ? 'ring-2 ring-brand-500 border-brand-500' : 'border-slate-100 hover:border-brand-200'
                  }`}
                >
                  <div>
                    {/* Hospital Image */}
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {hosp.emergency24x7 && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                            24/7 Emergency
                          </span>
                        )}
                        {hosp.tags.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md text-white font-bold text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-md flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span>{hosp.rating}</span>
                        <span className="text-[10px] text-slate-400">({hosp.reviewCount})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {hosp.name}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{hosp.address}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                        <span className="flex items-center gap-1 text-brand-600 font-bold">
                          <Navigation className="w-3.5 h-3.5" />
                          {hosp.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          ~{hosp.travelTime}
                        </span>
                      </div>

                      {/* Available Services */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Departments:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {hosp.availableServices.slice(0, 2).map((srv, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-50 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${hosp.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-colors"
                      title="Call Hospital Reception"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <Link
                      to={`/hospitals/${hosp.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
                    >
                      View Details & Route
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
