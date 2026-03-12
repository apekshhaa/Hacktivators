import React from 'react';

// Component to display health records
export default function HealthRecordList({ records = [] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Health Records</h2>
      {records.length === 0 ? <p>No records found.</p> : (
        <ul>
          {records.map((r, i) => <li key={i} className="border-b py-2">{r.date}: {r.diagnosis}</li>)}
        </ul>
      )}
    </div>
  );
}