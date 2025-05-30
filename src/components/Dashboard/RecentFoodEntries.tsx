import React from 'react';
import { Coffee, Sun, Moon, Clock } from 'lucide-react';
import { FoodEntry } from '../../contexts/NutritionContext';
import { format, parseISO } from 'date-fns';

interface RecentFoodEntriesProps {
  entries: FoodEntry[];
}

const RecentFoodEntries: React.FC<RecentFoodEntriesProps> = ({ entries }) => {
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Sun className="h-5 w-5 text-amber-500" />;
      case 'lunch':
        return <Sun className="h-5 w-5 text-orange-500" />;
      case 'dinner':
        return <Moon className="h-5 w-5 text-indigo-500" />;
      case 'snack':
        return <Coffee className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getMealTypeName = (mealType: string) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  if (entries.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>No recent food entries</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {entries.map((entry) => (
        <div key={entry.id} className="py-4 flex items-start">
          <div className="flex-shrink-0 bg-blue-50 rounded-md p-2">
            {getMealIcon(entry.mealType)}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{entry.name}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {entry.calories} kcal
                </p>
              </div>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>{entry.quantity}</span>
              <span className="mx-1">•</span>
              <span>{getMealTypeName(entry.mealType)}</span>
              <span className="mx-1">•</span>
              <span>
                {format(parseISO(entry.timestamp), 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentFoodEntries;