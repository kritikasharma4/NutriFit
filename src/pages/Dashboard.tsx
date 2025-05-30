import React, { useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Activity, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../contexts/NutritionContext';
import { useHealth } from '../contexts/HealthContext';
import NutritionSummaryChart from '../components/Dashboard/NutritionSummaryChart';
import CalorieProgressCard from '../components/Dashboard/CalorieProgressCard';
import RecentFoodEntries from '../components/Dashboard/RecentFoodEntries';
import HealthIssuesOverview from '../components/Dashboard/HealthIssuesOverview';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    foodEntries, 
    getEntriesForLast24Hours, 
    getDailySummary 
  } = useNutrition();
  
  const { 
    healthIssues, 
    fitnessRecommendations,
    generateFitnessRecommendations 
  } = useHealth();
  
  const summary = getDailySummary();
  const recentEntries = getEntriesForLast24Hours();

  useEffect(() => {
    // Generate fitness recommendations if not already generated
    if (!fitnessRecommendations && summary.totalCalories > 0) {
      generateFitnessRecommendations(summary.totalCalories);
    }
  }, [summary.totalCalories, fitnessRecommendations, generateFitnessRecommendations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => navigate('/food-logger')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Log Food
          </button>
        </div>
      </div>

      {/* Nutritional summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CalorieProgressCard 
          calories={summary.totalCalories} 
          target={2000} 
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Macronutrients</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Protein</span>
                <span className="text-sm font-medium text-gray-900">{summary.totalProtein}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2" 
                  style={{ width: `${Math.min(100, (summary.totalProtein / 150) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Carbs</span>
                <span className="text-sm font-medium text-gray-900">{summary.totalCarbs}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2" 
                  style={{ width: `${Math.min(100, (summary.totalCarbs / 300) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Fat</span>
                <span className="text-sm font-medium text-gray-900">{summary.totalFat}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 rounded-full h-2" 
                  style={{ width: `${Math.min(100, (summary.totalFat / 65) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Meal Distribution</h3>
            <UtensilsCrossed className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-32">
            <NutritionSummaryChart data={summary} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent food entries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Food Entries</h3>
          </div>
          <div className="px-6 py-4">
            <RecentFoodEntries entries={recentEntries.slice(0, 5)} />
            {recentEntries.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>No food entries in the last 24 hours</p>
                <button
                  onClick={() => navigate('/food-logger')}
                  className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Add your first entry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Health issues overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Health Issues</h3>
            <button
              onClick={() => navigate('/health-profile')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="px-6 py-4">
            <HealthIssuesOverview issues={healthIssues.slice(0, 3)} />
            {healthIssues.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p>No health issues added yet</p>
                <button
                  onClick={() => navigate('/health-profile')}
                  className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Add health issues
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitness recommendations preview */}
      {fitnessRecommendations && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Fitness Recommendations</h3>
            <button
              onClick={() => navigate('/fitness-recommendations')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Full Plan
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Based on your calorie intake:</p>
              <p className="text-lg font-medium">
                Target calories to burn: 
                <span className="text-blue-600 ml-1">
                  {fitnessRecommendations.calorieTarget} kcal
                </span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {fitnessRecommendations.activities.slice(0, 2).map((activity, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">{activity.name}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{activity.duration} minutes</span>
                    <span className="text-green-600">{activity.caloriesBurned} kcal</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => navigate('/fitness-recommendations')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
              >
                See Complete Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;