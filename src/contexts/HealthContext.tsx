import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

export type HealthIssue = {
  id: string;
  userId: string;
  category: 'physical' | 'mental';
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
};

export type HealthRecommendation = {
  id: string;
  issueId: string;
  recommendation: string;
  type: 'lifestyle' | 'diet' | 'exercise' | 'medical';
};

type FitnessRecommendation = {
  id: string;
  userId: string;
  calorieTarget: number;
  activities: Array<{
    name: string;
    duration: number;
    caloriesBurned: number;
  }>;
  dietSuggestions: string[];
};

type HealthContextType = {
  healthIssues: HealthIssue[];
  recommendations: HealthRecommendation[];
  fitnessRecommendations: FitnessRecommendation | null;
  addHealthIssue: (issue: Omit<HealthIssue, 'id' | 'userId'>) => void;
  removeHealthIssue: (id: string) => void;
  generateFitnessRecommendations: (caloriesConsumed: number) => void;
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

// Mock data and functions for health issues and recommendations
const generateMockHealthIssues = (userId: string): HealthIssue[] => {
  return [
    {
      id: uuidv4(),
      userId,
      category: 'physical',
      name: 'Back pain',
      description: 'Lower back pain when sitting for long periods',
      severity: 'moderate'
    },
    {
      id: uuidv4(),
      userId,
      category: 'mental',
      name: 'Stress',
      description: 'Work-related stress and occasional anxiety',
      severity: 'mild'
    }
  ];
};

const generateMockRecommendations = (issues: HealthIssue[]): HealthRecommendation[] => {
  const recommendations: HealthRecommendation[] = [];
  
  issues.forEach(issue => {
    if (issue.name === 'Back pain') {
      recommendations.push(
        {
          id: uuidv4(),
          issueId: issue.id,
          recommendation: 'Practice daily stretching exercises focused on lower back',
          type: 'exercise'
        },
        {
          id: uuidv4(),
          issueId: issue.id,
          recommendation: 'Take short walking breaks every hour during work',
          type: 'lifestyle'
        }
      );
    } else if (issue.name === 'Stress') {
      recommendations.push(
        {
          id: uuidv4(),
          issueId: issue.id,
          recommendation: 'Practice 10 minutes of mindfulness meditation daily',
          type: 'lifestyle'
        },
        {
          id: uuidv4(),
          issueId: issue.id,
          recommendation: 'Include foods rich in omega-3 fatty acids and magnesium',
          type: 'diet'
        }
      );
    }
  });
  
  return recommendations;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [fitnessRecommendations, setFitnessRecommendations] = useState<FitnessRecommendation | null>(null);

  useEffect(() => {
    if (user) {
      // In a real app, you'd fetch from an API
      // For demo, we'll use mock data
      const savedIssues = localStorage.getItem(`health-issues-${user.id}`);
      const savedRecommendations = localStorage.getItem(`health-recommendations-${user.id}`);
      
      if (savedIssues && savedRecommendations) {
        setHealthIssues(JSON.parse(savedIssues));
        setRecommendations(JSON.parse(savedRecommendations));
      } else {
        const mockIssues = generateMockHealthIssues(user.id);
        const mockRecommendations = generateMockRecommendations(mockIssues);
        
        setHealthIssues(mockIssues);
        setRecommendations(mockRecommendations);
        
        localStorage.setItem(`health-issues-${user.id}`, JSON.stringify(mockIssues));
        localStorage.setItem(`health-recommendations-${user.id}`, JSON.stringify(mockRecommendations));
      }
    } else {
      setHealthIssues([]);
      setRecommendations([]);
    }
  }, [user]);

  const addHealthIssue = (issue: Omit<HealthIssue, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newIssue: HealthIssue = {
      ...issue,
      id: uuidv4(),
      userId: user.id
    };
    
    const updatedIssues = [...healthIssues, newIssue];
    setHealthIssues(updatedIssues);
    
    // Generate and add recommendations for the new issue
    const newRecommendations = generateMockRecommendations([newIssue]);
    const updatedRecommendations = [...recommendations, ...newRecommendations];
    setRecommendations(updatedRecommendations);
    
    // Save to localStorage
    localStorage.setItem(`health-issues-${user.id}`, JSON.stringify(updatedIssues));
    localStorage.setItem(`health-recommendations-${user.id}`, JSON.stringify(updatedRecommendations));
  };

  const removeHealthIssue = (id: string) => {
    if (!user) return;
    
    const updatedIssues = healthIssues.filter(issue => issue.id !== id);
    setHealthIssues(updatedIssues);
    
    // Remove associated recommendations
    const updatedRecommendations = recommendations.filter(rec => rec.issueId !== id);
    setRecommendations(updatedRecommendations);
    
    // Update localStorage
    localStorage.setItem(`health-issues-${user.id}`, JSON.stringify(updatedIssues));
    localStorage.setItem(`health-recommendations-${user.id}`, JSON.stringify(updatedRecommendations));
  };

  const generateFitnessRecommendations = (caloriesConsumed: number) => {
    if (!user) return;
    
    // Example algorithm to generate fitness recommendations
    // In a real app, this would be more sophisticated
    const calorieTarget = Math.round(caloriesConsumed * 0.8); // Target to burn 80% of consumed calories
    
    // Generate activity suggestions based on calorie target
    const activities = [];
    
    if (calorieTarget > 1500) {
      activities.push(
        { name: 'Running (10km)', duration: 60, caloriesBurned: 600 },
        { name: 'Strength training', duration: 45, caloriesBurned: 400 },
        { name: 'Swimming', duration: 30, caloriesBurned: 300 }
      );
    } else if (calorieTarget > 1000) {
      activities.push(
        { name: 'Jogging (5km)', duration: 30, caloriesBurned: 300 },
        { name: 'Cycling', duration: 45, caloriesBurned: 350 },
        { name: 'Yoga', duration: 30, caloriesBurned: 150 }
      );
    } else {
      activities.push(
        { name: 'Walking (3km)', duration: 30, caloriesBurned: 150 },
        { name: 'Light stretching', duration: 20, caloriesBurned: 80 },
        { name: 'Gentle yoga', duration: 30, caloriesBurned: 120 }
      );
    }
    
    // Diet suggestions based on calorie consumption
    let dietSuggestions = [];
    
    if (caloriesConsumed > 2500) {
      dietSuggestions = [
        'Reduce portion sizes for all meals',
        'Avoid sugary drinks and snacks',
        'Increase water intake to 3L per day',
        'Include more fiber-rich vegetables'
      ];
    } else if (caloriesConsumed > 1800) {
      dietSuggestions = [
        'Maintain balanced portions',
        'Limit processed foods',
        'Stay hydrated with 2.5L of water',
        'Include protein with each meal'
      ];
    } else {
      dietSuggestions = [
        'Ensure adequate protein intake',
        'Don\'t skip meals',
        'Include healthy fats from nuts and avocados',
        'Stay hydrated throughout the day'
      ];
    }
    
    const recommendation: FitnessRecommendation = {
      id: uuidv4(),
      userId: user.id,
      calorieTarget,
      activities,
      dietSuggestions
    };
    
    setFitnessRecommendations(recommendation);
    localStorage.setItem(`fitness-recommendations-${user.id}`, JSON.stringify(recommendation));
  };

  return (
    <HealthContext.Provider 
      value={{ 
        healthIssues, 
        recommendations, 
        fitnessRecommendations,
        addHealthIssue, 
        removeHealthIssue,
        generateFitnessRecommendations
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};