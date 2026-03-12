import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Users, Clock, Stethoscope } from 'lucide-react';
import L from 'leaflet';
import { generateMockHospitals } from '../../data/mockHospitals';
import BookingModal from './BookingModal';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to center map when location changes
function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
}

const HospitalMapModal = ({ onClose, householdId }) => {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleBookAppointment = (hospital, doctor = null) => {
        setSelectedBooking({
            hospital: hospital.name,
            doctor: doctor ? doctor.name : null
        });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    setHospitals(generateMockHospitals(latitude, longitude));
                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    // Fallback to a default location (e.g., Delhi) if permission denied
                    const defaultLat = 28.6139;
                    const defaultLng = 77.2090;
                    setPosition([defaultLat, defaultLng]);
                    setHospitals(generateMockHospitals(defaultLat, defaultLng));
                    setLoading(false);
                    alert("Location access denied or unavailable. Showing default location.");
                }
            );
        } else {
            setLoading(false);
            alert("Geolocation not supported.");
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0d4648] w-full max-w-5xl h-[80vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#2b4548]">
                    <div>
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                            <MapPin className="text-accent" /> Nearby Hospitals
                        </h2>
                        <p className="text-gray-400 text-sm">Real-time availability and queue status</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-gray-900">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mr-3"></div>
                            Locating you...
                        </div>
                    ) : (
                        position && (
                            <MapContainer
                                center={position}
                                zoom={14}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <RecenterMap lat={position[0]} lng={position[1]} />

                                {/* User Marker */}
                                <Marker position={position} icon={L.icon({
                                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41],
                                    popupAnchor: [1, -34],
                                    shadowSize: [41, 41]
                                })}>
                                    <Popup>You are here</Popup>
                                </Marker>

                                {/* Hospital Markers */}
                                {hospitals.map((hospital) => (
                                    <Marker
                                        key={hospital.id}
                                        position={[hospital.lat, hospital.lng]}
                                        icon={L.icon({
                                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                            iconSize: [25, 41],
                                            iconAnchor: [12, 41],
                                            popupAnchor: [1, -34],
                                            shadowSize: [41, 41]
                                        })}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="p-2 min-w-[250px]">
                                                <h3 className="font-bold text-lg text-gray-800 mb-2">{hospital.name}</h3>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Users size={16} className="text-orange-500" />
                                                        <span className="font-medium">{hospital.waitingCount} People in Queue</span>
                                                    </div>

                                                    <div className="border-t pt-2">
                                                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Available Specialists</p>
                                                        {hospital.doctors.map((doc, i) => (
                                                            <div key={i} className="flex justify-between items-center text-sm py-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Stethoscope size={14} className="text-blue-500" />
                                                                    <span className="text-gray-700">{doc.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">
                                                                    <Clock size={10} />
                                                                    {doc.availableTime}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => handleBookAppointment(hospital)}
                                                        className="w-full mt-2 bg-[#0d4648] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#2b4548] transition-colors"
                                                    >
                                                        Book Appointment
                                                    </button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        )
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {selectedBooking && (
                <BookingModal
                    isOpen={!!selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    initialData={selectedBooking}
                    householdId={householdId}
                />
            )}
        </div>
    );
};

export default HospitalMapModal;
