import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Phone, Star, Building2 } from 'lucide-react';

// Custom Medical Hospital Marker Icon
const createHospitalIcon = (isSelected, isEmergency) => {
  const bgColor = isSelected ? '#0D9488' : isEmergency ? '#EF4444' : '#14B8A6';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="36" height="46">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M18 0 C8 0 0 8 0 18 C0 30 18 46 18 46 C18 46 36 30 36 18 C36 8 28 0 18 0 Z" fill="${bgColor}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="13" fill="#FFFFFF"/>
      <path d="M16 11 h4 v5 h5 v4 h-5 v5 h-4 v-5 h-5 v-4 h5 Z" fill="${bgColor}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-hospital-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42]
  });
};

// User Location Marker
const userIcon = L.divIcon({
  html: `
    <div style="width:20px;height:20px;border-radius:50%;background:#0284C7;border:3px solid #FFFFFF;box-shadow:0 0 12px #0284C7;">
      <div style="width:100%;height:100%;border-radius:50%;background:#38BDF8;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
    </div>
  `,
  className: 'user-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Map View Recenter Controller
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const HospitalMap = ({
  hospitals = [],
  selectedHospital = null,
  onSelectHospital,
  userLocation = null,
  height = "420px"
}) => {
  // Center defaults to selected hospital or Manhattan central coordinates
  const defaultCenter = selectedHospital 
    ? [selectedHospital.coordinates.lat, selectedHospital.coordinates.lng]
    : userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [40.758896, -73.985130];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-soft relative" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <ChangeMapView center={defaultCenter} zoom={selectedHospital ? 14 : 13} />
        
        {/* Crisp Positron Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* User Geolocation Pin */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-xs font-bold text-navy-900">
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital Markers */}
        {hospitals.map((hosp) => {
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <Marker
              key={hosp.id}
              position={[hosp.coordinates.lat, hosp.coordinates.lng]}
              icon={createHospitalIcon(isSelected, hosp.emergency24x7)}
              eventHandlers={{
                click: () => {
                  if (onSelectHospital) onSelectHospital(hosp);
                }
              }}
            >
              <Popup className="hospital-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                      {hosp.emergency24x7 ? '24/7 Emergency' : 'Hospital'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-0.5">{hosp.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{hosp.address}</p>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-3 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      {hosp.rating}
                    </span>
                    <span className="text-brand-600 font-bold">
                      {hosp.distanceKm} km away
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.coordinates.lat},${hosp.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
