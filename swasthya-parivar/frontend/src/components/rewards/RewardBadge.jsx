import React from 'react';

export default function RewardBadge({ points = 150 }) {
  return (
    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold inline-block">
      🏆 {points} Health Points
    </div>
  );
}