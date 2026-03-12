import React from 'react';
import TrendChart from '../../components/analytics/TrendChart';
import HealthMap from '../../components/maps/HealthMap';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Health Worker Dashboard</h1>
      <HealthMap />
      <TrendChart />
    </div>
  );
}