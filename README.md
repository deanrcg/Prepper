# Job Application & Interview Tracker

A comprehensive Gradio application for tracking job applications and preparing for interviews using AI-powered feedback.

## Features

### Job Application Tracking
- Input job application details including company name, job title, application date, status, and job description
- View a summary of the submitted application
- Track application status through the hiring process

### AI-Powered Interview Preparation
- Generate 6-8 relevant interview questions based on the job description
- Answer questions one at a time with real-time AI feedback
- Receive detailed analysis of strengths and weaknesses in your answers
- Download a comprehensive PDF report with all questions, answers, and feedback

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the project root with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to the URL shown in the terminal (usually http://127.0.0.1:7860)

## How to Use

### Job Application Tab
1. Fill in the job details (company, title, description, etc.)
2. Click "Submit Application" to save the information

### Interview Preparation Tab
1. **Generate Questions**: Click "Generate Interview Questions" to create AI-powered questions based on your job description
2. **Answer Questions**: Answer each question one at a time and receive instant feedback
3. **Download Report**: After completing all questions, download a PDF report with your complete interview session

## Project Structure

- `app.py` - Main Gradio application with tabs for job tracking and interview prep
- `interview_prep.py` - Interview preparation logic with OpenAI integration and PDF generation
- `requirements.txt` - Python dependencies
- `README.md` - Project documentation

## Technologies Used

- **Gradio** - Web interface framework
- **OpenAI GPT-3.5-turbo** - AI-powered interview questions and feedback
- **ReportLab** - PDF report generation
- **Python-dotenv** - Environment variable management

## License

MIT License - feel free to use and modify as needed.
