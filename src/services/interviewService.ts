import { InterviewQuestion } from '../types';

export class InterviewService {
  private generateMockQuestions(companyName: string, jobTitle: string, jobDescription: string): string[] {
    // Mock questions based on common interview patterns
    const questions = [
      `Tell me about yourself and why you're interested in the ${jobTitle} position at ${companyName}.`,
      `What specific experience do you have that makes you a good fit for this role?`,
      `Describe a challenging project you've worked on and how you overcame obstacles.`,
      `How do you stay current with industry trends and technologies?`,
      `Tell me about a time when you had to work with a difficult team member.`,
      `Where do you see yourself in 5 years, and how does this role fit into your career goals?`,
      `What questions do you have about ${companyName} or this position?`
    ];

    // Add role-specific questions based on job description keywords
    const description = jobDescription.toLowerCase();
    
    if (description.includes('leadership') || description.includes('manage')) {
      questions.push('Describe your leadership style and give an example of how you\'ve motivated a team.');
      )
    }
    
    if (description.includes('problem solving') || description.includes('analytical')) {
      questions.push('Walk me through your problem-solving process when faced with a complex technical challenge.');
    }
    
    if (description.includes('customer') || description.includes('client')) {
      questions.push('How do you handle difficult customer situations or feedback?');
    }

    return questions.slice(0, 8); // Return up to 8 questions
  }

  async generateQuestions(companyName: string, jobTitle: string, jobDescription: string): Promise<string[]> {
    // In a real implementation, this would call an AI service
    // For now, we'll use mock questions
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateMockQuestions(companyName, jobTitle, jobDescription));
      }, 1000);
    });
  }

  async analyzeAnswer(question: string, answer: string): Promise<string> {
    // Mock feedback generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedback = this.generateMockFeedback(question, answer);
        resolve(feedback);
      }, 800);
    });
  }

  private generateMockFeedback(question: string, answer: string): string {
    const answerLength = answer.length;
    const hasSpecificExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('instance');
    const hasNumbers = /\d/.test(answer);

    let feedback = "**Feedback on your answer:**\n\n";
    
    // Strengths
    feedback += "**Strengths:**\n";
    if (answerLength > 100) {
      feedback += "• Good detail and thoroughness in your response\n";
    }
    if (hasSpecificExamples) {
      feedback += "• Excellent use of specific examples to support your points\n";
    }
    if (hasNumbers) {
      feedback += "• Good use of quantifiable metrics and data\n";
    }
    feedback += "• Clear communication and structure\n\n";

    // Areas for improvement
    feedback += "**Areas for Improvement:**\n";
    if (answerLength < 50) {
      feedback += "• Consider providing more detail and specific examples\n";
    }
    if (!hasSpecificExamples) {
      feedback += "• Try to include specific examples from your experience\n";
    }
    feedback += "• Consider using the STAR method (Situation, Task, Action, Result) for behavioral questions\n\n";

    // Suggestions
    feedback += "**Suggestions:**\n";
    feedback += "• Practice your delivery to sound confident and natural\n";
    feedback += "• Prepare follow-up questions to show your interest in the role\n\n";

    // Rating
    const rating = Math.min(10, Math.max(6, Math.floor(answerLength / 20) + (hasSpecificExamples ? 2 : 0) + (hasNumbers ? 1 : 0)));
    feedback += `**Overall Rating: ${rating}/10**\n`;
    feedback += "Keep practicing to improve your interview performance!";

    return feedback;
  }
}