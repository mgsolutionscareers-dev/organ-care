import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  Navigation, 
  ArrowRight,
  Crosshair,
  Sparkles,
  Map as MapIcon,
  ListFilter
} from 'lucide-react';
import { organsData } from '../data/organsData';
import { HospitalMap } from '../components/HospitalMap';
import { 
  calculateHaversineDistance, 
  fetchLiveNearbyHospitals,
  getApproximateLocationByIP,
  reverseGeocodeCity
} from '../services/hospitalLocationService';

export const HospitalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const organParam = searchParams.get('organ') || '';
  const specialtyParam = searchParams.get('specialty') || 'all';

  const selectedOrganData = organParam ? organsData.find(o => o.organId.toLowerCase() === organParam.toLowerCase()) : null;

  const [rawHospitals, setRawHospitals] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationCity, setLocationCity] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState('Detecting your local area...');
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'

  const specialties = [
    { key: 'all', label: 'All Departments' },
    { key: 'cardiology', label: 'Cardiology' },
    { key: 'neurology', label: 'Neurology' },
    { key: 'pulmonology', label: 'Pulmonology' },
    { key: 'gastroenterology', label: 'Gastroenterology' },
    { key: 'nephrology', label: 'Nephrology' },
    { key: 'urology', label: 'Urology' },
    { key: 'endocrinology', label: 'Endocrinology' },
    { key: 'emergency', label: 'Emergency 24/7' }
  ];

  // Request high-accuracy GPS
  const requestUserGPS = () => {
    if (!navigator.geolocation) {
      setLocationNotice('GPS is not supported in this browser. Please type your city in the search bar.');
      return;
    }
    setLocating(true);
    setLocationNotice('Requesting GPS satellite lock...');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });

        // Reverse geocode to find exact city/town name
        const geoInfo = await reverseGeocodeCity(lat, lng);
        const cityStr = geoInfo ? `${geoInfo.city}, ${geoInfo.state}` : 'Current GPS Location';
        setLocationCity(cityStr);
        setLocationNotice(`📍 Accurate GPS locked: Showing hospitals near ${cityStr}`);

        const live = await fetchLiveNearbyHospitals(lat, lng, 35000, organParam, geoInfo?.city || '');
        if (live && live.length > 0) {
          setRawHospitals(live);
          setSelectedHospital(live[0]);
        }
        setLocating(false);
      },
      async (err) => {
        console.warn('GPS permission denied or timeout:', err.message);
        // Fallback to IP geolocation
        const ipLoc = await getApproximateLocationByIP();
        if (ipLoc) {
          setUserLocation({ lat: ipLoc.lat, lng: ipLoc.lng });
          const cityName = `${ipLoc.city}, ${ipLoc.region || ipLoc.country}`;
          setLocationCity(cityName);
          setLocationNotice(`📍 Showing hospitals near ${cityName} (network location).`);
          const live = await fetchLiveNearbyHospitals(ipLoc.lat, ipLoc.lng, 35000, organParam, ipLoc.city);
          if (live && live.length > 0) {
            setRawHospitals(live);
            setSelectedHospital(live[0]);
          }
        } else {
          setLocationNotice('Could not acquire location. Please enter your city or area in search.');
        }
        setLocating(false);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  // Initial load: fast IP location + concurrent GPS query
  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialArea() {
      setLocating(true);

      // Step 1: Instant IP-based lookup so user gets hospitals for their real city immediately
      const ipLoc = await getApproximateLocationByIP();
      if (ipLoc && isSubscribed) {
        setUserLocation({ lat: ipLoc.lat, lng: ipLoc.lng });
        const cityStr = `${ipLoc.city}, ${ipLoc.region || ipLoc.country}`;
        setLocationCity(cityStr);
        setLocationNotice(`📍 Live Location: ${cityStr}`);

        const live = await fetchLiveNearbyHospitals(ipLoc.lat, ipLoc.lng, 35000, organParam, ipLoc.city);
        if (live && live.length > 0 && isSubscribed) {
          setRawHospitals(live);
          setSelectedHospital(live[0]);
        }
        setLocating(false);
      }

      // Step 2: Concurrently request precise GPS
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            if (!isSubscribed) return;
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserLocation({ lat, lng });

            const geoInfo = await reverseGeocodeCity(lat, lng);
            const cityStr = geoInfo ? `${geoInfo.city}, ${geoInfo.state}` : 'Current GPS Location';
            setLocationCity(cityStr);
            setLocationNotice(`📍 GPS Location: ${cityStr}`);

            const live = await fetchLiveNearbyHospitals(lat, lng, 35000, organParam, geoInfo?.city || '');
            if (live && live.length > 0 && isSubscribed) {
              setRawHospitals(live);
              setSelectedHospital(live[0]);
            }
            setLocating(false);
          },
          (err) => {
            console.warn('Background GPS prompt skipped:', err.message);
            if (isSubscribed) setLocating(false);
          },
          { timeout: 7000 }
        );
      } else {
        if (isSubscribed) setLocating(false);
      }
    }

    loadInitialArea();
    return () => { isSubscribed = false; };
  }, [organParam]);

  // Sync specialty from query parameter
  useEffect(() => {
    if (specialtyParam && specialtyParam !== selectedSpecialty) {
      setSelectedSpecialty(specialtyParam);
    }
  }, [specialtyParam]);

  // Filter hospitals based on search & specialty
  useEffect(() => {
    let filtered = rawHospitals.map(h => {
      let dist = h.distanceKm || 5.0;
      if (userLocation && h.coordinates && h.coordinates.lat != null && h.coordinates.lng != null) {
        dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, h.coordinates.lat, h.coordinates.lng);
      }
      return { 
        ...h, 
        distanceKm: dist,
        travelTime: dist <= 2 ? '5-8 min' : (dist <= 5 ? '10-15 min' : (dist <= 10 ? '18-25 min' : `${Math.round(dist * 2)} min`))
      };
    });

    if (userLocation) {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (selectedSpecialty !== 'all') {
      const spec = selectedSpecialty.toLowerCase();
      const matched = filtered.filter(h => 
        (h.specialties && h.specialties.some(s => s.toLowerCase() === spec)) ||
        (h.tags && h.tags.some(t => t.toLowerCase().includes(spec))) ||
        (h.availableServices && h.availableServices.some(srv => srv.toLowerCase().includes(spec))) ||
        h.emergency24x7
      );
      if (matched.length > 0) {
        filtered = matched;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        (h.city && h.city.toLowerCase().includes(q)) ||
        (h.area && h.area.toLowerCase().includes(q)) ||
        (h.postalCode && h.postalCode.includes(q))
      );
    }

    setHospitals(filtered);
    if (filtered.length > 0 && !filtered.some(h => h.id === selectedHospital?.id)) {
      setSelectedHospital(filtered[0]);
    }
  }, [selectedSpecialty, searchQuery, userLocation, rawHospitals]);

  // Handle explicit search submission
  const handleSearchSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLocating(true);
    setLocationNotice(`Searching hospitals in "${searchQuery}"...`);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lng = parseFloat(geoData[0].lon);
        setUserLocation({ lat, lng });
        const searchedCity = geoData[0].display_name.split(',')[0].trim();
        setLocationCity(searchedCity);
        setLocationNotice(`📍 Search center: ${searchedCity}`);

        const live = await fetchLiveNearbyHospitals(lat, lng, 35000, organParam, searchedCity);
        if (live && live.length > 0) {
          setRawHospitals(live);
          setSelectedHospital(live[0]);
        }
      }
    } catch (err) {
      console.warn('Geocoding search error:', err);
    } finally {
      setLocating(false);
    }
  };

  const handleClearOrganFilter = () => {
    setSelectedSpecialty('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ----------------- TOP HERO & SEARCH HEADER ----------------- */}
      <div className="bg-white border-b border-slate-200/80 pt-6 sm:pt-8 pb-5 sm:pb-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
          
          {/* Header Title + Location Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5 text-teal-500" />
                Hospital & Doctor Discovery
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123E48] tracking-tight">
                Nearby Hospitals & Medical Centers
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Real-time verified emergency rooms, specialized hospital departments, and clinics in your area.
              </p>
            </div>

            {/* GPS Auto-Detect Button */}
            <button
              onClick={requestUserGPS}
              disabled={locating}
              className="self-stretch sm:self-auto px-4 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-60"
            >
              <Crosshair className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
              {locating ? 'Detecting Location...' : 'Use My Live GPS'}
            </button>
          </div>

          {/* Organ Referral Banner (If coming from 3D Anatomy) */}
          {selectedOrganData && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#123E48] to-[#0D9488] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-300 animate-ping shrink-0"></span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider block">
                    Specialized Organ Referral
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Showing hospital facilities tailored for the{' '}
                    <span className="text-teal-200 underline font-extrabold">{selectedOrganData.name}</span>{' '}
                    ({selectedOrganData.recommendedSpecialist?.title || 'Specialist'})
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearOrganFilter}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer border border-white/20 whitespace-nowrap"
              >
                Clear Organ Filter
              </button>
            </div>
          )}

          {/* Live Location Pill Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="font-medium text-slate-700">{locationNotice}</span>
              {locationCity && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-bold text-[11px]">
                  {locationCity}
                </span>
              )}
            </div>

            <div className="text-slate-500 text-xs">
              <span className="font-bold text-slate-800">{hospitals.length}</span> facilities found
            </div>
          </div>

          {/* Search Box & Department Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-3 pt-1">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hospital name, city, or area (e.g. Dharmavaram, Mumbai, New York)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#123E48] hover:bg-navy-900 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Department Filter Pills (Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {specialties.map(spec => (
                <button
                  key={spec.key}
                  onClick={() => setSelectedSpecialty(spec.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    selectedSpecialty === spec.key
                      ? 'bg-[#14B8A6] text-white shadow-sm shadow-teal-500/20'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>

          </div>

          {/* Mobile View Toggle Switch: List View vs Map View (lg:hidden) */}
          <div className="lg:hidden flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'list' 
                  ? 'bg-white text-[#123E48] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-teal-600" />
              <span>List View ({hospitals.length})</span>
            </button>
            <button
              onClick={() => setMobileTab('map')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'map' 
                  ? 'bg-white text-[#123E48] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Interactive Map</span>
            </button>
          </div>

        </div>
      </div>

      {/* ----------------- MAIN TWO-COLUMN SPLIT LAYOUT ----------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Hospital Cards Directory (58% width on desktop; visible on mobile when mobileTab === 'list') */}
          <div className={`lg:col-span-7 space-y-3 sm:space-y-4 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
            
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Sorted by nearest distance to you</span>
              {userLocation && (
                <span className="text-teal-700 font-bold flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" />
                  Live GPS
                </span>
              )}
            </div>

            {hospitals.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Hospitals Found in this View</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try switching departments, expanding your search radius, or clicking 'Use My Live GPS'.
                </p>
                <button
                  onClick={() => { setSelectedSpecialty('all'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              hospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                const googleMapsUrl = (hosp.coordinates?.lat != null && hosp.coordinates?.lng != null)
                  ? `https://www.google.com/maps/dir/?api=1&destination=${hosp.coordinates.lat},${hosp.coordinates.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`;

                return (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                      isSelected 
                        ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/10' 
                        : 'border-slate-200/90 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start justify-between">
                      
                      {/* Left: Hospital Thumbnail Image */}
                      <div className="w-full sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                        <img
                          src={hosp.image}
                          alt={hosp.name}
                          className="w-full h-full object-cover"
                        />
                        {hosp.emergency24x7 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[9px] uppercase shadow">
                            24/7 ER
                          </div>
                        )}
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-extrabold text-[#123E48] leading-snug hover:text-teal-600 transition-colors">
                            {hosp.name}
                          </h3>
                        </div>

                        {/* Rating & Proximity Pills */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            <span>{hosp.rating}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({hosp.reviewCount})</span>
                          </div>

                          <span className="text-slate-300">•</span>

                          <div className="flex items-center gap-1 text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 text-[11px]">
                            <Navigation className="w-3 h-3 text-teal-600" />
                            <span>{hosp.distanceKm} km</span>
                            <span className="text-slate-400 font-normal">({hosp.travelTime})</span>
                          </div>
                        </div>

                        {/* Address */}
                        <p className="text-xs text-slate-500 flex items-start gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{hosp.address}</span>
                        </p>

                        {/* Services preview badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hosp.availableServices?.slice(0, 2).map((srv, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium truncate max-w-[200px]">
                              {srv}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Right: Actions */}
                      <div className="w-full sm:w-auto flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </a>

                        <Link
                          to={`/hospitals/${hosp.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                        >
                          Details
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* RIGHT COLUMN: Interactive Map (42% width on desktop; visible on mobile when mobileTab === 'map') */}
          <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${mobileTab === 'map' ? 'block' : 'hidden lg:block'}`}>
            
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#123E48]">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Hospital Map Navigator</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {hospitals.length} pins active
                </span>
              </div>

              {/* Map Canvas */}
              <div className="w-full h-[360px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-slate-200 relative">
                <HospitalMap
                  hospitals={hospitals}
                  selectedHospital={selectedHospital}
                  onSelectHospital={setSelectedHospital}
                  userLocation={userLocation}
                />
              </div>

              {/* Selected Hospital Info Box below the map */}
              {selectedHospital && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-teal-600">Selected Facility</div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#123E48] truncate">
                      {selectedHospital.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {selectedHospital.address}
                    </p>
                  </div>

                  <a
                    href={(selectedHospital.coordinates?.lat != null && selectedHospital.coordinates?.lng != null)
                      ? `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospital.name + ' ' + selectedHospital.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Route
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
