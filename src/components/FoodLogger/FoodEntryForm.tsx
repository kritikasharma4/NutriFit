import React, { useState } from 'react';
import { FoodEntry } from '../../contexts/NutritionContext';
import ImageFoodRecognition from './ImageFoodRecognition';

type FoodEntryFormProps = {
  onSubmit: (entry: Omit<FoodEntry, 'id' | 'userId' | 'timestamp'>) => void;
  onCancel: () => void;
};

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // Food database with nutritional information (simplified example)
  const foodDatabase: Record<string, { calories: number, protein: number, carbs: number, fat: number }> = {
    'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    'orange': { calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
    'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10 },
    'hamburger': { calories: 250, protein: 12, carbs: 30, fat: 9 },
    'salad': { calories: 100, protein: 3, carbs: 11, fat: 7 },
  };

  const handleFoodDetected = (foodName: string) => {
    // Clean up the food name and try to match with database
    const cleanName = foodName.toLowerCase().split(',')[0].trim();
    const matchedFood = Object.entries(foodDatabase).find(([key]) => 
      cleanName.includes(key)
    );

    if (matchedFood) {
      const [name, nutrition] = matchedFood;
      setName(name);
      setCalories(nutrition.calories.toString());
      setProtein(nutrition.protein.toString());
      setCarbs(nutrition.carbs.toString());
      setFat(nutrition.fat.toString());
    } else {
      setName(foodName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      quantity,
      calories: parseInt(calories, 10) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      mealType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageFoodRecognition onFoodDetected={handleFoodDetected} />

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Food Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity/Serving Size
          </label>
          <input
            type="text"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 1 cup, 100g"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Calories
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                min="0"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">kcal</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">
              Meal Type
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
              Protein
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="0.1"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">g</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
              Carbs
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="0.1"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">g</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
              Fat
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="0.1"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Entry
        </button>
      </div>
    </form>
  );
};

export default FoodEntryForm;