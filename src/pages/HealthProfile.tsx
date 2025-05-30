import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useHealth, HealthIssue } from '../contexts/HealthContext';
import HealthIssueForm from '../components/HealthProfile/HealthIssueForm';
import HealthIssueCard from '../components/HealthProfile/HealthIssueCard';

const HealthProfile: React.FC = () => {
  const { healthIssues, recommendations, addHealthIssue, removeHealthIssue } = useHealth();
  const [isAddingIssue, setIsAddingIssue] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'physical' | 'mental'>('all');
  
  // Filter issues based on active category
  const filteredIssues = healthIssues.filter(issue => {
    if (activeCategory === 'all') return true;
    return issue.category === activeCategory;
  });
  
  // Group recommendations by issue ID
  const recommendationsByIssue: Record<string, typeof recommendations> = {};
  recommendations.forEach(rec => {
    if (!recommendationsByIssue[rec.issueId]) {
      recommendationsByIssue[rec.issueId] = [];
    }
    recommendationsByIssue[rec.issueId].push(rec);
  });

  const handleAddIssue = (newIssue: Omit<HealthIssue, 'id' | 'userId'>) => {
    addHealthIssue(newIssue);
    setIsAddingIssue(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Health Profile</h1>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsAddingIssue(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Health Issue
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveCategory('physical')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'physical'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Physical
        </button>
        <button
          onClick={() => setActiveCategory('mental')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'mental'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mental
        </button>
      </div>

      {/* Health issue form modal */}
      {isAddingIssue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 md:mx-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Health Issue</h3>
              <button
                onClick={() => setIsAddingIssue(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <HealthIssueForm onSubmit={handleAddIssue} onCancel={() => setIsAddingIssue(false)} />
          </div>
        </div>
      )}

      {/* Health issues list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <HealthIssueCard 
              key={issue.id} 
              issue={issue} 
              recommendations={recommendationsByIssue[issue.id] || []}
              onDelete={() => removeHealthIssue(issue.id)} 
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
              {activeCategory === 'physical' ? (
                <svg xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor\" className="h-12 w-12">
                  <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                </svg>
              ) : activeCategory === 'mental' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No health issues {activeCategory !== 'all' ? `in ${activeCategory} category` : ''}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a health issue.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddingIssue(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Health Issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfile;