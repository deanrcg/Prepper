import React, { useState } from 'react';
import { JobApplication } from '../types';
import { Building2, Calendar, FileText, Briefcase } from 'lucide-react';

interface JobApplicationFormProps {
  onSubmit: (application: Omit<JobApplication, 'id'>) => void;
  currentApplication?: JobApplication;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ 
  onSubmit, 
  currentApplication 
}) => {
  const [formData, setFormData] = useState({
    companyName: currentApplication?.companyName || '',
    jobTitle: currentApplication?.jobTitle || '',
    jobDescription: currentApplication?.jobDescription || '',
    applicationDate: currentApplication?.applicationDate || new Date().toISOString().split('T')[0],
    status: currentApplication?.status || 'Applied' as const
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <Briefcase className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Job Application Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter job title"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Application Date
              </label>
              <input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleChange('applicationDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Interview Completed">Interview Completed</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Job Description
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter job description or paste the job posting"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              submitted
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {submitted ? '✓ Application Submitted!' : 'Submit Application'}
          </button>
        </form>

        {currentApplication && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Company:</span> {currentApplication.companyName}</p>
              <p><span className="font-medium">Position:</span> {currentApplication.jobTitle}</p>
              <p><span className="font-medium">Application Date:</span> {currentApplication.applicationDate}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  currentApplication.status === 'Offer Received' ? 'bg-green-100 text-green-800' :
                  currentApplication.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  currentApplication.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentApplication.status}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};