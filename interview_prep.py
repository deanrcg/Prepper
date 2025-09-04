import os
import json
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Load environment variables
load_dotenv()

class InterviewPreparator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.interview_data = {
            'job_details': {},
            'questions': [],
            'answers': [],
            'feedback': []
        }
        self.current_question_index = 0
    
    def generate_interview_questions(self, company_name, job_title, job_description):
        """Generate interview questions based on job details"""
        prompt = f"""
        You are a senior HR professional conducting an interview for the position of {job_title} at {company_name}.
        
        Based on the following job description, generate 6-8 relevant interview questions that would help assess the candidate's suitability for this role:
        
        Job Description: {job_description}
        
        Please provide questions that cover:
        - Technical skills and experience
        - Behavioral/situational scenarios
        - Problem-solving abilities
        - Cultural fit and motivation
        
        Return the questions as a JSON array of strings.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            # Extract questions from response
            content = response.choices[0].message.content
            # Try to parse as JSON, if not, split by lines
            try:
                questions = json.loads(content)
            except:
                # Fallback: split by lines and clean up
                questions = [q.strip() for q in content.split('\n') if q.strip() and not q.startswith('[') and not q.startswith(']')]
            
            self.interview_data['job_details'] = {
                'company': company_name,
                'title': job_title,
                'description': job_description
            }
            self.interview_data['questions'] = questions
            self.current_question_index = 0
            
            return questions
            
        except Exception as e:
            return [f"Error generating questions: {str(e)}"]
    
    def analyze_answer(self, question, answer):
        """Analyze the user's answer and provide feedback"""
        prompt = f"""
        As a senior HR professional, analyze this interview answer:
        
        Question: {question}
        Answer: {answer}
        
        Provide constructive feedback covering:
        1. Strengths of the answer
        2. Areas for improvement
        3. Specific suggestions for better responses
        4. Overall rating (1-10)
        
        Format your response as a structured analysis.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            feedback = response.choices[0].message.content
            
            # Store the Q&A and feedback
            self.interview_data['answers'].append(answer)
            self.interview_data['feedback'].append(feedback)
            
            return feedback
            
        except Exception as e:
            return f"Error analyzing answer: {str(e)}"
    
    def get_current_question(self):
        """Get the current question"""
        if self.current_question_index < len(self.interview_data['questions']):
            return self.interview_data['questions'][self.current_question_index]
        return None
    
    def next_question(self):
        """Move to the next question"""
        self.current_question_index += 1
        return self.get_current_question()
    
    def is_interview_complete(self):
        """Check if all questions have been answered"""
        return self.current_question_index >= len(self.interview_data['questions'])
    
    def generate_pdf_report(self):
        """Generate a PDF report of the interview session"""
        if not self.interview_data['questions']:
            return None
        
        filename = f"interview_prep_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        doc = SimpleDocTemplate(filename, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("Interview Preparation Report", title_style))
        story.append(Spacer(1, 20))
        
        # Job Details
        story.append(Paragraph("Job Details", styles['Heading2']))
        story.append(Paragraph(f"Company: {self.interview_data['job_details']['company']}", styles['Normal']))
        story.append(Paragraph(f"Position: {self.interview_data['job_details']['title']}", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Questions and Answers
        story.append(Paragraph("Interview Questions & Answers", styles['Heading2']))
        story.append(Spacer(1, 20))
        
        for i, (question, answer, feedback) in enumerate(zip(
            self.interview_data['questions'],
            self.interview_data['answers'],
            self.interview_data['feedback']
        ), 1):
            story.append(Paragraph(f"Question {i}:", styles['Heading3']))
            story.append(Paragraph(question, styles['Normal']))
            story.append(Spacer(1, 10))
            
            story.append(Paragraph("Your Answer:", styles['Heading4']))
            story.append(Paragraph(answer, styles['Normal']))
            story.append(Spacer(1, 10))
            
            story.append(Paragraph("Feedback:", styles['Heading4']))
            story.append(Spacer(1, 10))
            
            # Split feedback into sections and add spacing
            feedback_lines = feedback.split('\n')
            formatted_feedback = []
            
            for line in feedback_lines:
                line = line.strip()
                if line:
                    # Add extra spacing for numbered sections (1., 2., 3., 4.)
                    if line.startswith(('1.', '2.', '3.', '4.')):
                        formatted_feedback.append('')  # Add blank line before numbered sections
                        formatted_feedback.append(line)
                    else:
                        formatted_feedback.append(line)
            
            # Join with proper spacing and create separate paragraphs
            feedback_text = '\n'.join(formatted_feedback)
            feedback_paragraphs = feedback_text.split('\n')
            
            for para in feedback_paragraphs:
                if para.strip():
                    story.append(Paragraph(para.strip(), styles['Normal']))
                    story.append(Spacer(1, 5))  # Add small spacing between paragraphs
            story.append(Spacer(1, 20))
            
            if i < len(self.interview_data['questions']):
                story.append(PageBreak())
        
        doc.build(story)
        return filename
