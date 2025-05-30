import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Utensils, RefreshCcw } from 'lucide-react';
import { useNutrition } from '../contexts/NutritionContext';
import { useHealth } from '../contexts/HealthContext';

const FitnessRecommendations: React.FC = () => {
  const { getDailySummary } = useNutrition();
  const { fitnessRecommendations, generateFitnessRecommendations } = useHealth();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const summary = getDailySummary();
  
  useEffect(() => {
    // Generate recommendations if none exist yet
    if (!fitnessRecommendations && summary.totalCalories > 0) {
      generateFitnessRecommendations(summary.totalCalories);
    }
  }, [fitnessRecommendations, generateFitnessRecommendations, summary.totalCalories]);
  
  const handleRegenerateRecommendations = () => {
    setIsRegenerating(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      generateFitnessRecommendations(summary.totalCalories);
      setIsRegenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fitness Recommendations</h1>
        {fitnessRecommendations && (
          <button
            onClick={handleRegenerateRecommendations}
            disabled={isRegenerating}
            className={`inline-flex items-center px-4 py-2 mt-4 md:mt-0 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              isRegenerating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition-colors`}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Plan'}
          </button>
        )}
      </div>

      {/* Loading state */}
      {!fitnessRecommendations && summary.totalCalories === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No calorie data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Log your food intake to generate fitness recommendations.
          </p>
        </div>
      )}

      {/* Loading state */}
      {!fitnessRecommendations && summary.totalCalories > 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Recommendations content */}
      {fitnessRecommendations && (
        <div className="space-y-6">
          {/* Calorie summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Calorie Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Calories Consumed</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalCalories} kcal</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Calories to Burn</p>
                <p className="text-2xl font-bold text-blue-600">{fitnessRecommendations.calorieTarget} kcal</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Net Calorie Goal</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.totalCalories - fitnessRecommendations.calorieTarget} kcal
                </p>
              </div>
            </div>
          </div>

          {/* Recommended activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Recommended Activities</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fitnessRecommendations.activities.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <Dumbbell className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="text-md font-medium text-gray-900">{activity.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Duration</span>
                        <span className="text-sm font-medium">{activity.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Calories</span>
                        <span className="text-sm font-medium text-green-600">
                          {activity.caloriesBurned} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diet suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Diet Suggestions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fitnessRecommendations.dietSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Utensils className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessRecommendations;