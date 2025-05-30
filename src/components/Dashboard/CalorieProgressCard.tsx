import React from 'react';
import { Activity } from 'lucide-react';

interface CalorieProgressCardProps {
  calories: number;
  target: number;
}

const CalorieProgressCard: React.FC<CalorieProgressCardProps> = ({ calories, target }) => {
  const progress = Math.min(100, (calories / target) * 100);
  const remaining = Math.max(0, target - calories);
  
  let statusColor = 'text-green-600';
  let progressColor = 'bg-green-500';
  
  if (progress > 90) {
    statusColor = 'text-orange-600';
    progressColor = 'bg-orange-500';
  }
  
  if (progress >= 100) {
    statusColor = 'text-red-600';
    progressColor = 'bg-red-500';
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Today's Calories</h3>
        <Activity className="w-5 h-5 text-blue-500" />
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold">{calories}</p>
          <p className="text-gray-500 text-sm">of {target} kcal</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div 
            className={`${progressColor} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`mt-4 ${statusColor}`}>
        {calories < target ? (
          <p className="text-sm font-medium">{remaining} kcal remaining</p>
        ) : (
          <p className="text-sm font-medium">{calories - target} kcal over limit</p>
        )}
      </div>
    </div>
  );
};

export default CalorieProgressCard;