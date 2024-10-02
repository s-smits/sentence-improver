# Sentence Improver

This project implements a web application for improving sentences using AI. It utilizes FastAPI for the backend, HTML/CSS/JavaScript for the frontend, and the Anthropic API for text enhancement.

## Brief demo
![main](https://github.com/user-attachments/assets/8824fc95-830d-44e5-a298-791b66138a50)

## Installation

1. Clone the repository and navigate to the project folder:
   ```
   git clone https://github.com/s-smits/sentence-improver
   cd sentence-improver
   ```

2. Create a virtual environment named `venv_sentence_improver` and activate it:
   - For macOS and Linux:
     ```
     python3 -m venv venv_sentence_improver
     source venv_sentence_improver/bin/activate
     ```
   - For Windows:
     ```
     python -m venv venv_sentence_improver
     venv_sentence_improver\Scripts\activate
     ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Rename `.env.example` to `.env` in the root directory and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

   Make sure to enter your own Anthropic API key here. This key is necessary for using the Anthropic AI model in this project.

## Usage

Start the FastAPI server:
```
python -m uvicorn app:app --reload
```

Then open a web browser and go to `http://localhost:8000` to use the Sentence Improver web application.

## Features

- Input text for improvement
- Selection of the percentage of sentences to improve
- Choice of different use cases for improvement (grammar and logic, knowledge gaps, clarity and conciseness, tone and style, persuasiveness)
- Display of original and improved sentences
- Option to accept or reject improvements
- Copying of the final text

## Project Structure

- `app.py`: FastAPI backend application
- `templates/index.html`: HTML template for the webpage
- `static/script.js`: JavaScript for frontend functionality
- `static/style.css`: CSS styles for the webpage
- `sentence_splitter.py`: Helper function for splitting sentences
- `requirements.txt`: List of Python dependencies

## Requirements

See `requirements.txt` for a full list of dependencies.

## License

[MIT License](LICENSE)
