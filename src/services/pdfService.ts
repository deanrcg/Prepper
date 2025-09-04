import jsPDF from 'jspdf';
import { JobApplication, InterviewSession } from '../types';

export class PDFService {
  static generateInterviewReport(
    jobApplication: JobApplication,
    interviewSession: InterviewSession
  ): void {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (yPosition + (lines.length * lineHeight) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      lines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 5; // Extra spacing after text blocks
    };

    // Title
    addText('Interview Preparation Report', 18, true);
    yPosition += 10;

    // Job Details
    addText('Job Details', 14, true);
    addText(`Company: ${jobApplication.companyName}`);
    addText(`Position: ${jobApplication.jobTitle}`);
    addText(`Application Date: ${jobApplication.applicationDate}`);
    addText(`Status: ${jobApplication.status}`);
    yPosition += 10;

    // Questions and Answers
    addText('Interview Questions & Answers', 14, true);
    
    interviewSession.questions.forEach((q, index) => {
      if (q.answer && q.feedback) {
        addText(`Question ${index + 1}:`, 12, true);
        addText(q.question);
        
        addText('Your Answer:', 12, true);
        addText(q.answer);
        
        addText('Feedback:', 12, true);
        addText(q.feedback);
        
        yPosition += 10;
      }
    });

    // Footer
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${timestamp}`, margin, pdf.internal.pageSize.getHeight() - 10);

    // Download the PDF
    const filename = `interview_prep_${jobApplication.companyName}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }
}

export { PDFService }