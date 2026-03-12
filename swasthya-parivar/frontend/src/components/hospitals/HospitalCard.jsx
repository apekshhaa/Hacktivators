import React from 'react';

export default function HospitalCard({ hospital }) {
  return (
    <div className="border p-4 rounded bg-white shadow-sm">
      <h3 className="font-bold text-lg">{hospital?.name || "Rural Clinic Seva"}</h3>
      <p className="text-gray-600">{hospital?.distance || "2.5 km away"}</p>
      <button className="mt-2 text-blue-600 hover:underline">Book Appointment</button>
    </div>
  );
}