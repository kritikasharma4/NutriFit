import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Activity, Utensils, Heart } from 'lucide-react';
import { HealthIssue, HealthRecommendation } from '../../contexts/HealthContext';

interface HealthIssueCardProps {
  issue: HealthIssue;
  recommendations: HealthRecommendation[];
  onDelete: () => void;
}

const HealthIssueCard: React.FC<HealthIssueCardProps> = ({ issue, recommendations, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getCategoryColor = (category: string) => {
    return category === 'physical' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };
  
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'lifestyle':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'diet':
        return <Utensils className="h-4 w-4 text-green-500" />;
      case 'exercise':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">{issue.name}</h3>
              <div className="flex ml-2 space-x-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(issue.category)}`}>
                  {issue.category}
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(issue.severity)}`}>
                  {issue.severity}
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{issue.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDelete}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {expanded && recommendations.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">{rec.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthIssueCard;