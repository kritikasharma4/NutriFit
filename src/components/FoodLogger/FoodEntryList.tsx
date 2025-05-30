import React from 'react';
import { Coffee, Sun, Moon, Clock, Trash2 } from 'lucide-react';
import { FoodEntry } from '../../contexts/NutritionContext';
import { format, parseISO } from 'date-fns';

interface FoodEntryListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

const FoodEntryList: React.FC<FoodEntryListProps> = ({ entries, onDelete }) => {
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
  
  // Sort entries by timestamp (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <ul className="divide-y divide-gray-200">
      {sortedEntries.map((entry) => (
        <li key={entry.id} className="py-4 px-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-50 rounded-md p-2">
              {getMealIcon(entry.mealType)}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {entry.calories} kcal
                  </p>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <span>{entry.quantity}</span>
                <span className="mx-1">•</span>
                <span>{getMealTypeName(entry.mealType)}</span>
                <span className="mx-1">•</span>
                <span>{format(parseISO(entry.timestamp), 'h:mm a')}</span>
              </div>
              <div className="mt-1 grid grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Protein:</span> {entry.protein}g
                </div>
                <div>
                  <span className="font-medium">Carbs:</span> {entry.carbs}g
                </div>
                <div>
                  <span className="font-medium">Fat:</span> {entry.fat}g
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FoodEntryList;