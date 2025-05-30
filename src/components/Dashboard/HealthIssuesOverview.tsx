import React from 'react';
import { HealthIssue } from '../../contexts/HealthContext';

interface HealthIssuesOverviewProps {
  issues: HealthIssue[];
}

const HealthIssuesOverview: React.FC<HealthIssuesOverviewProps> = ({ issues }) => {
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

  if (issues.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>No health issues added</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {issues.map((issue) => (
        <div key={issue.id} className="py-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{issue.name}</h4>
            <div className="flex space-x-2">
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
      ))}
    </div>
  );
};

export default HealthIssuesOverview;