import React, { useState } from 'react';
import { PlusCircle, Search, X, UtensilsCrossed } from 'lucide-react';
import { useNutrition, FoodEntry } from '../contexts/NutritionContext';
import FoodEntryForm from '../components/FoodLogger/FoodEntryForm';
import FoodEntryList from '../components/FoodLogger/FoodEntryList';

const FoodLogger: React.FC = () => {
  const { foodEntries, addFoodEntry, removeFoodEntry } = useNutrition();
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string | null>(null);
  
  // Filter entries based on search query and meal type
  const filteredEntries = foodEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMealType = selectedMealFilter ? entry.mealType === selectedMealFilter : true;
    return matchesSearch && matchesMealType;
  });
  
  // Group entries by date
  const groupedEntries: Record<string, FoodEntry[]> = {};
  
  filteredEntries.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }
    groupedEntries[date].push(entry);
  });

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleAddEntry = (newEntry: Omit<FoodEntry, 'id' | 'userId' | 'timestamp'>) => {
    addFoodEntry(newEntry);
    setIsAddingEntry(false);
  };

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Food Logger</h1>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsAddingEntry(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Food Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search food entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMealFilter(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedMealFilter === null
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {mealTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMealFilter(selectedMealFilter === option.value ? null : option.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedMealFilter === option.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food entry form modal */}
      {isAddingEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 md:mx-0 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Food Entry</h3>
              <button
                onClick={() => setIsAddingEntry(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FoodEntryForm onSubmit={handleAddEntry} onCancel={() => setIsAddingEntry(false)} />
          </div>
        </div>
      )}

      {/* Food entries list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {sortedDates.length > 0 ? (
          <div>
            {sortedDates.map(date => (
              <div key={date}>
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500">{date}</h3>
                </div>
                <FoodEntryList 
                  entries={groupedEntries[date]} 
                  onDelete={removeFoodEntry} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No food entries</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a food entry.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddingEntry(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Food Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogger;