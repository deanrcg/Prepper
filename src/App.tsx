import React, { useState } from 'react';
import { JobApplication } from './types';
import { JobApplicationForm } from './components/JobApplicationForm';
import { InterviewPreparation } from './components/InterviewPreparation';
import { Briefcase, Brain } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'application' | 'interview'>('application');
  const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null);

  const handleApplicationSubmit = (applicationData: Omit<JobApplication, 'id'>) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: Date.now().toString()
    };
    setCurrentApplication(newApplication);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Job Tracker Pro</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('application')}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'application'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Job Application
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'interview'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            Interview Prep
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'application' ? (
          <JobApplicationForm 
            onSubmit={handleApplicationSubmit}
            currentApplication={currentApplication}
          />
        ) : (
          <InterviewPreparation jobApplication={currentApplication} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Job Tracker Pro. Built with React and TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;