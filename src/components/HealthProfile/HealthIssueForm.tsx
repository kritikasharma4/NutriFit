import React, { useState } from 'react';
import { HealthIssue } from '../../contexts/HealthContext';

type HealthIssueFormProps = {
  onSubmit: (issue: Omit<HealthIssue, 'id' | 'userId'>) => void;
  onCancel: () => void;
};

const HealthIssueForm: React.FC<HealthIssueFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'physical' | 'mental'>('physical');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      category,
      description,
      severity
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Issue Name
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="physical">Physical</option>
          <option value="mental">Mental</option>
        </select>
      </div>

      <div>
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
          Severity
        </label>
        <select
          id="severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as any)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Describe your health issue..."
        />
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
          Add Issue
        </button>
      </div>
    </form>
  );
};

export default HealthIssueForm;