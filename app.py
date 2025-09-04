import gradio as gr
from interview_prep import InterviewPreparator

# Global instance of InterviewPreparator
interview_prep = InterviewPreparator()

def job_application_form(company_name, job_title, job_description, application_date, status):
    """
    Process job application details
    """
    # For now, just return a summary of the input
    summary = f"""
    Job Application Summary:
    
    Company: {company_name}
    Position: {job_title}
    Application Date: {application_date}
    Status: {status}
    
    Job Description: {job_description}
    """
    
    return summary

def generate_interview_questions_and_first(company_name, job_title, job_description):
    """Generate interview questions and return first question for display"""
    if not company_name or not job_title or not job_description:
        return "Please fill in all job details first.", "No questions available. Please generate questions first."
    
    questions = interview_prep.generate_interview_questions(company_name, job_title, job_description)
    
    if questions and len(questions) > 0:
        questions_text = "\n\n".join([f"{i+1}. {q}" for i, q in enumerate(questions)])
        first_question = f"Question 1:\n\n{questions[0]}"
        return f"Generated {len(questions)} interview questions:\n\n{questions_text}", first_question
    else:
        return "Failed to generate questions. Please try again.", "No questions available. Please generate questions first."

def get_current_question():
    """Get the current interview question"""
    question = interview_prep.get_current_question()
    if question:
        return f"Question {interview_prep.current_question_index + 1}:\n\n{question}"
    return "No questions available. Please generate questions first."

def submit_answer(answer):
    """Submit answer and get feedback"""
    if not answer.strip():
        return "Please provide an answer."
    
    current_question = interview_prep.get_current_question()
    if not current_question:
        return "No current question available."
    
    feedback = interview_prep.analyze_answer(current_question, answer)
    
    result = f"Feedback on your answer:\n\n{feedback}"
    
    return result

def next_question_action():
    """Move to next question and update display"""
    # First advance to the next question
    next_question = interview_prep.next_question()
    if next_question:
        return f"Question {interview_prep.current_question_index + 1}:\n\n{next_question}", ""
    else:
        return "No more questions available.", ""

def download_report():
    """Generate and provide download link for PDF report"""
    if not interview_prep.interview_data['questions']:
        return None, "No interview data available for report generation."
    
    try:
        filename = interview_prep.generate_pdf_report()
        return filename, f"Report generated successfully: {filename}"
    except Exception as e:
        return None, f"Error generating report: {str(e)}"

# Create the Gradio interface
with gr.Blocks(title="Job Application & Interview Tracker") as demo:
    gr.Markdown("# Job Application & Interview Tracker")
    
    with gr.Tabs():
        # Job Application Tab
        with gr.Tab("Job Application"):
            gr.Markdown("Enter the details of a job you have applied for:")
            
            with gr.Row():
                with gr.Column():
                    company_name = gr.Textbox(
                        label="Company Name",
                        placeholder="Enter company name"
                    )
                    
                    job_title = gr.Textbox(
                        label="Job Title",
                        placeholder="Enter job title"
                    )
                    
                    application_date = gr.Textbox(
                        label="Application Date",
                        placeholder="YYYY-MM-DD"
                    )
                    
                    status = gr.Dropdown(
                        choices=["Applied", "Interview Scheduled", "Interview Completed", "Offer Received", "Rejected", "Withdrawn"],
                        label="Application Status",
                        value="Applied"
                    )
                    
                    job_description = gr.Textbox(
                        label="Job Description",
                        placeholder="Enter job description or paste the job posting",
                        lines=5
                    )
                    
                    submit_btn = gr.Button("Submit Application", variant="primary")
                
                with gr.Column():
                    output = gr.Textbox(
                        label="Application Summary",
                        lines=10,
                        interactive=False
                    )
            
            submit_btn.click(
                fn=job_application_form,
                inputs=[company_name, job_title, job_description, application_date, status],
                outputs=output
            )
        
        # Interview Preparation Tab
        with gr.Tab("Interview Preparation"):
            gr.Markdown("Prepare for your interview with AI-powered questions and feedback:")
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("### Step 1: Generate Interview Questions")
                    generate_btn = gr.Button("Generate Interview Questions", variant="primary")
                    questions_output = gr.Textbox(
                        label="Generated Questions",
                        lines=8,
                        interactive=False
                    )
                
                with gr.Column():
                    gr.Markdown("### Step 2: Answer Questions")
                    current_question_display = gr.Textbox(
                        label="Current Question",
                        lines=4,
                        interactive=False
                    )
                    
                    answer_input = gr.Textbox(
                        label="Your Answer",
                        placeholder="Type your answer here...",
                        lines=4
                    )
                    
                    submit_answer_btn = gr.Button("Submit Answer", variant="primary")
                    
                    feedback_output = gr.Textbox(
                        label="Feedback & Next Question",
                        lines=8,
                        interactive=False
                    )
                    
                    next_question_btn = gr.Button("Next Question", variant="secondary")
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("### Step 3: Download Report")
                    download_btn = gr.Button("Download Interview Report", variant="secondary")
                    download_status = gr.Textbox(
                        label="Download Status",
                        lines=2,
                        interactive=False
                    )
            
            # Connect the buttons
            generate_btn.click(
                fn=generate_interview_questions_and_first,
                inputs=[company_name, job_title, job_description],
                outputs=[questions_output, current_question_display]
            )
            
            submit_answer_btn.click(
                fn=submit_answer,
                inputs=answer_input,
                outputs=feedback_output
            )
            
            submit_answer_btn.click(
                fn=lambda: "",
                outputs=answer_input
            )
            
            next_question_btn.click(
                fn=next_question_action,
                outputs=[current_question_display, feedback_output]
            )
            
            download_btn.click(
                fn=download_report,
                outputs=[gr.File(label="Download Report"), download_status]
            )

if __name__ == "__main__":
    demo.launch()
