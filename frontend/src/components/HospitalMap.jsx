import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Phone, Star, Building2, MapPin, ExternalLink } from 'lucide-react';

// Custom Medical Hospital Marker Icon
const createHospitalIcon = (isSelected, isEmergency) => {
  const bgColor = isSelected ? '#0D9488' : isEmergency ? '#EF4444' : '#14B8A6';
  const strokeColor = isSelected ? '#FFFFFF' : '#FFFFFF';
  const size = isSelected ? 42 : 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="${size}" height="${Math.round(size * 1.28)}">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M18 0 C8 0 0 8 0 18 C0 30 18 46 18 46 C18 46 36 30 36 18 C36 8 28 0 18 0 Z" fill="${bgColor}" stroke="${strokeColor}" stroke-width="${isSelected ? '2' : '1'}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="13" fill="#FFFFFF"/>
      <path d="M16 10 h4 v5 h5 v4 h-5 v5 h-4 v-5 h-5 v-4 h5 Z" fill="${bgColor}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-hospital-marker',
    iconSize: [size, Math.round(size * 1.28)],
    iconAnchor: [size / 2, Math.round(size * 1.28)],
    popupAnchor: [0, -Math.round(size * 1.15)]
  });
};

// User Location Marker
const userIcon = L.divIcon({
  html: `
    <div style="width:22px;height:22px;border-radius:50%;background:#0284C7;border:3px solid #FFFFFF;box-shadow:0 0 14px rgba(2,132,199,0.8);position:relative;">
      <div style="position:absolute;inset:-4px;border-radius:50%;background:#38BDF8;opacity:0.6;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
    </div>
  `,
  className: 'user-marker',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Map View & Resize Handler
const MapController = ({ center, zoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount and multiple timeouts to handle CSS animations and flex layouts
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 450);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [map]);

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
    } else if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.0 });
    }
  }, [center, zoom, bounds, map]);

  return null;
};

export const HospitalMap = ({
  hospitals = [],
  selectedHospital = null,
  onSelectHospital,
  userLocation = null,
  height = "420px"
}) => {
  const [mapError, setMapError] = useState(false);

  // Compute map center
  const defaultCenter = selectedHospital 
    ? [selectedHospital.coordinates.lat, selectedHospital.coordinates.lng]
    : userLocation 
    ? [userLocation.lat, userLocation.lng]
    : hospitals.length > 0
    ? [hospitals[0].coordinates.lat, hospitals[0].coordinates.lng]
    : [40.758896, -73.985130];

  // Compute bounds if multiple hospitals and user location
  const allPoints = [
    ...(userLocation ? [[userLocation.lat, userLocation.lng]] : []),
    ...hospitals.map(h => [h.coordinates.lat, h.coordinates.lng])
  ];
  const bounds = allPoints.length > 0 ? allPoints : null;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-soft relative bg-slate-100" style={{ height, minHeight: '300px' }}>
      {!mapError ? (
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full z-10"
        >
          <MapController 
            center={selectedHospital ? [selectedHospital.coordinates.lat, selectedHospital.coordinates.lng] : defaultCenter} 
            zoom={selectedHospital ? 14 : 12}
            bounds={!selectedHospital && bounds ? bounds : null}
          />
          
          {/* Voyager Basemap Tiles with high reliability */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                  <div className="p-1 min-w-[210px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        hosp.emergency24x7 ? 'bg-rose-50 text-rose-700 font-extrabold' : 'bg-teal-50 text-teal-800'
                      }`}>
                        {hosp.emergency24x7 ? '🚨 24/7 Emergency Care' : 'Tertiary Hospital'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">{hosp.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{hosp.address}</p>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-3 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
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
                      className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get Live Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
          <MapPin className="w-10 h-10 text-brand-500 mb-2" />
          <h4 className="text-sm font-bold text-navy-900">Hospital Navigator Directory</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Displaying {hospitals.length} verified hospitals and emergency trauma centers.
          </p>
        </div>
      )}
    </div>
  );
};

