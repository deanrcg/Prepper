export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  applicationDate: string;
  status: 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Received' | 'Rejected' | 'Withdrawn';
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  feedback?: string;
}

export interface InterviewSession {
  id: string;
  jobApplicationId: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  isComplete: boolean;
  createdAt: string;
}