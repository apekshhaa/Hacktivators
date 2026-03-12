import React from 'react';
import HealthRecordList from '../../components/health/HealthRecordList';
import RewardBadge from '../../components/rewards/RewardBadge';
import ChatWidget from '../../components/chatbot/ChatWidget';
import HospitalCard from '../../components/hospitals/HospitalCard';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, Asha!</h1>
        <RewardBadge points={250} />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthRecordList records={[{date: '2023-10-01', diagnosis: 'Routine Checkup'}]} />
        <div>
          <h2 className="text-xl font-bold mb-4">Nearby Clinics</h2>
          <HospitalCard />
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}