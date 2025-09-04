import React, { useState } from 'react';
import { JobApplication, InterviewQuestion, InterviewSession } from '../types';
import { InterviewService } from '../services/interviewService';
import { PDFService } from '../services/pdfService';
import { Brain, MessageSquare, Download, ArrowRight, CheckCircle } from 'lucide-react';

interface InterviewPreparationProps {
  jobApplication?: JobApplication;
}

export const InterviewPreparation: React.FC<InterviewPreparationProps> = ({ jobApplication }) => {
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const interviewService = new InterviewService();

  const generateQuestions = async () => {
    if (!jobApplication) return;

    setIsGenerating(true);
    try {
      const questions = await interviewService.generateQuestions(
        jobApplication.companyName,
        jobApplication.jobTitle,
        jobApplication.jobDescription
      );

      const session: InterviewSession = {
        id: Date.now().toString(),
        jobApplicationId: jobApplication.id,
        questions: questions.map((q, index) => ({
          id: `q-${index}`,
          question: q
        })),
        currentQuestionIndex: 0,
        isComplete: false,
        createdAt: new Date().toISOString()
      };

      setInterviewSession(session);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!interviewSession || !currentAnswer.trim()) return;

    setIsAnalyzing(true);
    const currentQuestion = interviewSession.questions[interviewSession.currentQuestionIndex];
    
    try {
      const feedback = await interviewService.analyzeAnswer(currentQuestion.question, currentAnswer);
      
      const updatedSession = {
        ...interviewSession,
        questions: interviewSession.questions.map((q, index) =>
          index === interviewSession.currentQuestionIndex
            ? { ...q, answer: currentAnswer, feedback }
            : q
        )
      };

      setInterviewSession(updatedSession);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error analyzing answer:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    if (!interviewSession) return;

    const nextIndex = interviewSession.currentQuestionIndex + 1;
    const isComplete = nextIndex >= interviewSession.questions.length;

    setInterviewSession({
      ...interviewSession,
      currentQuestionIndex: nextIndex,
      isComplete
    });

    setCurrentAnswer('');
    setShowFeedback(false);
  };

  const downloadReport = () => {
    if (!jobApplication || !interviewSession) return;
    PDFService.generateInterviewReport(jobApplication, interviewSession);
  };

  if (!jobApplication) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Preparation</h2>
          <p className="text-gray-600">Please submit a job application first to generate interview questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = interviewSession?.questions[interviewSession.currentQuestionIndex];
  const progress = interviewSession ? ((interviewSession.currentQuestionIndex + 1) / interviewSession.questions.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Brain className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Interview Preparation</h2>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-800">
            <span className="font-semibold">{jobApplication.jobTitle}</span> at{' '}
            <span className="font-semibold">{jobApplication.companyName}</span>
          </p>
        </div>
      </div>

      {/* Step 1: Generate Questions */}
      {!interviewSession && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Generate Interview Questions</h3>
          <p className="text-gray-600 mb-6">
            Generate AI-powered interview questions tailored to your job description.
          </p>
          <button
            onClick={generateQuestions}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Questions...' : 'Generate Interview Questions'}
          </button>
        </div>
      )}

      {/* Step 2: Answer Questions */}
      {interviewSession && !interviewSession.isComplete && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Step 2: Answer Questions</h3>
            <div className="text-sm text-gray-500">
              Question {interviewSession.currentQuestionIndex + 1} of {interviewSession.questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {currentQuestion && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-900 text-lg leading-relaxed">{currentQuestion.question}</p>
                </div>
              </div>

              {!showFeedback ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Type your answer here..."
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim() || isAnalyzing}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing Answer...' : 'Submit Answer'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Your Answer:</h4>
                    <p className="text-blue-800">{currentAnswer}</p>
                  </div>

                  {currentQuestion.feedback && (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-3">AI Feedback:</h4>
                      <div className="text-green-800 whitespace-pre-line">
                        {currentQuestion.feedback}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={nextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                  >
                    {interviewSession.currentQuestionIndex + 1 < interviewSession.questions.length ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Interview
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Download Report */}
      {interviewSession?.isComplete && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Complete!</h3>
            <p className="text-gray-600 mb-6">
              You've answered all {interviewSession.questions.length} questions. Download your comprehensive report below.
            </p>
            <button
              onClick={downloadReport}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center mx-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Interview Report
            </button>
          </div>
        </div>
      )}

      {/* Questions Overview */}
      {interviewSession && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions Overview</h3>
          <div className="space-y-3">
            {interviewSession.questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  index === interviewSession.currentQuestionIndex
                    ? 'border-indigo-500 bg-indigo-50'
                    : question.answer
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Question {index + 1}</span>
                  {question.answer && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-gray-700 mt-2 text-sm">{question.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};