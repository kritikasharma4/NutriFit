import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, subHours } from 'date-fns';
import { useAuth } from './AuthContext';

export type FoodEntry = {
  id: string;
  userId: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

export type NutritionalSummary = {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealBreakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
};

type NutritionContextType = {
  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'userId' | 'timestamp'>) => void;
  removeFoodEntry: (id: string) => void;
  getEntriesForLast24Hours: () => FoodEntry[];
  getDailySummary: () => NutritionalSummary;
};

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

// Mock data for demonstration
const generateMockFoodEntries = (userId: string): FoodEntry[] => {
  const now = new Date();
  
  return [
    {
      id: uuidv4(),
      userId,
      name: 'Oatmeal with Banana',
      quantity: '1 bowl',
      calories: 350,
      protein: 10,
      carbs: 60,
      fat: 7,
      timestamp: format(subHours(now, 12), "yyyy-MM-dd'T'HH:mm:ss"),
      mealType: 'breakfast'
    },
    {
      id: uuidv4(),
      userId,
      name: 'Grilled Chicken Salad',
      quantity: '1 plate',
      calories: 450,
      protein: 35,
      carbs: 20,
      fat: 22,
      timestamp: format(subHours(now, 6), "yyyy-MM-dd'T'HH:mm:ss"),
      mealType: 'lunch'
    },
    {
      id: uuidv4(),
      userId,
      name: 'Apple',
      quantity: '1 medium',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      timestamp: format(subHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
      mealType: 'snack'
    }
  ];
};

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    if (user) {
      // In a real app, you'd fetch from an API or database
      // For demo, we'll use mock data
      const savedEntries = localStorage.getItem(`food-entries-${user.id}`);
      if (savedEntries) {
        setFoodEntries(JSON.parse(savedEntries));
      } else {
        const mockEntries = generateMockFoodEntries(user.id);
        setFoodEntries(mockEntries);
        localStorage.setItem(`food-entries-${user.id}`, JSON.stringify(mockEntries));
      }
    } else {
      setFoodEntries([]);
    }
  }, [user]);

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) return;
    
    const newEntry: FoodEntry = {
      ...entry,
      id: uuidv4(),
      userId: user.id,
      timestamp: new Date().toISOString()
    };
    
    const updatedEntries = [...foodEntries, newEntry];
    setFoodEntries(updatedEntries);
    
    // Save to localStorage for persistence
    if (user) {
      localStorage.setItem(`food-entries-${user.id}`, JSON.stringify(updatedEntries));
    }
  };

  const removeFoodEntry = (id: string) => {
    if (!user) return;
    
    const updatedEntries = foodEntries.filter(entry => entry.id !== id);
    setFoodEntries(updatedEntries);
    
    // Update localStorage
    localStorage.setItem(`food-entries-${user.id}`, JSON.stringify(updatedEntries));
  };

  const getEntriesForLast24Hours = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= twentyFourHoursAgo && entryDate <= now;
    });
  };

  const getDailySummary = (): NutritionalSummary => {
    const entries = getEntriesForLast24Hours();
    
    const summary = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealBreakdown: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0
      }
    };
    
    entries.forEach(entry => {
      summary.totalCalories += entry.calories;
      summary.totalProtein += entry.protein;
      summary.totalCarbs += entry.carbs;
      summary.totalFat += entry.fat;
      summary.mealBreakdown[entry.mealType] += entry.calories;
    });
    
    return summary;
  };

  return (
    <NutritionContext.Provider 
      value={{ 
        foodEntries, 
        addFoodEntry, 
        removeFoodEntry, 
        getEntriesForLast24Hours, 
        getDailySummary 
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};