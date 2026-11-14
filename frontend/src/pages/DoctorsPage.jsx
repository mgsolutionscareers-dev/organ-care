import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Phone, 
  Building2, 
  Calendar,
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { doctorsData } from '../data/doctorsData';
import { hospitalsData } from '../data/hospitalsData';
import { HospitalMap } from '../components/HospitalMap';
import { useAuth } from '../context/AuthContext';
import { toggleFavoriteDoctor, fetchFavoriteDoctors } from '../services/favoritesService';

export const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty') || 'all';
  const cityParam = searchParams.get('city') || 'all';

  const [doctors, setDoctors] = useState(doctorsData);
  const [hospitals, setHospitals] = useState(hospitalsData);
  const [selectedHospital, setSelectedHospital] = useState(hospitalsData[0]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState([]);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Load user favorites
  useEffect(() => {
    if (currentUser) {
      fetchFavoriteDoctors(currentUser.uid).then(favs => {
        setFavoriteDoctorIds(favs.map(f => f.id));
      });
    }
  }, [currentUser]);

  // Filter doctors based on inputs
  useEffect(() => {
    let filtered = [...doctorsData];

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(d => 
        d.specialtyKey.toLowerCase() === selectedSpecialty.toLowerCase() ||
        d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(d => d.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.hospitalAffiliation.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
      );
    }

    setDoctors(filtered);
  }, [selectedSpecialty, selectedCity, searchQuery]);

  const handleToggleFav = async (doctor) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const isNowFav = await toggleFavoriteDoctor(currentUser.uid, doctor);
    if (isNowFav) {
      setFavoriteDoctorIds(prev => [...prev, doctor.id]);
    } else {
      setFavoriteDoctorIds(prev => prev.filter(id => id !== doctor.id));
    }
  };

  const specialties = [
    { key: 'all', label: 'All Specialties' },
    { key: 'cardiology', label: 'Cardiology' },
    { key: 'neurology', label: 'Neurology' },
    { key: 'pulmonology', label: 'Pulmonology' },
    { key: 'gastroenterology', label: 'Gastroenterology' },
    { key: 'nephrology', label: 'Nephrology' },
    { key: 'urology', label: 'Urology' },
  ];

  const cities = [
    { key: 'all', label: 'All Locations' },
    { key: 'New York', label: 'New York' },
    { key: 'Manhattan', label: 'Manhattan' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Verified Healthcare Providers
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">
              Doctor & Hospital Discovery
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Find verified medical specialists affiliated with top tertiary hospitals.
            </p>
          </div>

          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto"
          >
            <Building2 className="w-4 h-4 text-brand-400" />
            Browse Full Hospital Navigator
          </Link>
        </div>

        {/* ----------------- SEARCH & FILTER BAR ----------------- */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor name, hospital, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setSearchParams({ specialty: e.target.value, city: selectedCity });
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-brand-500"
            >
              {specialties.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSearchParams({ specialty: selectedSpecialty, city: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-brand-500"
            >
              {cities.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ----------------- SPLIT LAYOUT: DOCTORS LIST & INTERACTIVE MAP PREVIEW ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Doctor Cards (Matches Reference Layout) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>{doctors.length} Specialist{doctors.length === 1 ? '' : 's'} Available</span>
              <span>Sorted by Medical Verification</span>
            </div>

            {doctors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-slate-100">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No Specialists Matched Your Filter</h3>
                <p className="text-xs text-slate-400 mt-1">Try switching to 'All Specialties' or clearing the search terms.</p>
                <button
                  onClick={() => { setSelectedSpecialty('all'); setSelectedCity('all'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              doctors.map((doctor) => {
                const isFav = favoriteDoctorIds.includes(doctor.id);
                return (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-lg border border-slate-100 hover:border-brand-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-navy-900 truncate">
                            {doctor.name}
                          </h3>
                          {doctor.verified && (
                            <span title="Verified Medical License & Board Certification">
                              <CheckCircle2 className="w-4 h-4 text-brand-500 fill-brand-50" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-brand-600 mt-0.5">
                          {doctor.specialty}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {doctor.qualifications} • {doctor.experienceYears} years exp
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            {doctor.rating} ({doctor.reviewCount} reviews)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {doctor.distanceKm} km
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <button
                        onClick={() => handleToggleFav(doctor)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isFav
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-slate-50 text-slate-400 hover:text-rose-600 border-slate-200'
                        }`}
                        title={isFav ? "Saved in Favorites" : "Save Doctor to Favorites"}
                      >
                        {isFav ? <BookmarkCheck className="w-4 h-4 fill-rose-500" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setSelectedDoctorModal(doctor)}
                        className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Live Interactive Map (Matches Screenshot Exactly!) */}
          <div className="lg:col-span-5 space-y-5 sticky top-28">
            <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-500" />
                  Nearby Hospitals
                </h3>
                <Link to="/hospitals" className="text-xs font-bold text-brand-600 hover:underline">
                  View Full Map
                </Link>
              </div>

              {/* Live Interactive Leaflet Map */}
              <HospitalMap
                hospitals={hospitals}
                selectedHospital={selectedHospital}
                onSelectHospital={(h) => setSelectedHospital(h)}
                height="320px"
              />

              {/* Selected Hospital Info Footer */}
              {selectedHospital && (
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">{selectedHospital.name}</h4>
                    <p className="text-[11px] text-slate-500">{selectedHospital.address} • {selectedHospital.distanceKm} km</p>
                  </div>
                  <Link
                    to={`/hospitals/${selectedHospital.id}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs"
                  >
                    Directions
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Hospital List */}
            {hospitals.slice(0, 2).map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`bg-white rounded-3xl p-5 shadow-soft border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  selectedHospital?.id === hosp.id ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-100 hover:border-brand-200'
                }`}
              >
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {hosp.emergency24x7 ? '24/7 Emergency Care' : 'General Care'}
                  </span>
                  <h4 className="text-sm font-bold text-navy-900 mt-1 truncate">{hosp.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{hosp.address}</p>
                </div>
                <Link
                  to={`/hospitals/${hosp.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 text-xs font-bold shrink-0 transition-colors"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ----------------- DOCTOR PROFILE MODAL ----------------- */}
      {selectedDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedDoctorModal(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedDoctorModal.avatar}
                alt={selectedDoctorModal.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-navy-900">{selectedDoctorModal.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-brand-500 fill-brand-50" />
                </div>
                <p className="text-xs font-bold text-brand-600">{selectedDoctorModal.specialty}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedDoctorModal.hospitalAffiliation}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Physician Bio & Background</span>
                <p className="leading-relaxed">{selectedDoctorModal.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Qualifications</span>
                  <span className="font-bold text-slate-800">{selectedDoctorModal.qualifications}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Experience</span>
                  <span className="font-bold text-slate-800">{selectedDoctorModal.experienceYears} Years Clinical</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedDoctorModal.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedDoctorModal.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Available: {selectedDoctorModal.availableDays.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => handleToggleFav(selectedDoctorModal)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                {favoriteDoctorIds.includes(selectedDoctorModal.id) ? 'Saved' : 'Favorite'}
              </button>
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
