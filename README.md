# TranslateAI: Intelligent Language Translation with Sentiment Analysis

A professional AI-driven translation suite combining natural language processing with sentiment analysis. Built with a modular Python backend (FastAPI) and a responsive JavaScript frontend, this application demonstrates advanced NLP techniques in a production-ready architecture.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technical Architecture](#technical-architecture)
- [AI Component](#ai-component)
- [Installation](#installation)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

**TranslateAI** is an AI-driven translation suite that integrates:

- **Multilingual Translation**: Real-time translation across 100+ languages
- **Sentiment Analysis**: NLP-based sentiment scoring for input text
- **Modular Pipeline**: Clean separation between preprocessing, inference, and API layers
- **Responsive UI**: Modern web interface with glassmorphic design for desktop and mobile
- **Production-Ready Backend**: FastAPI server with CORS support and validation

This project demonstrates expertise in:
- Natural Language Processing (NLP) and text preprocessing
- REST API design and implementation
- Full-stack development with modern frameworks
- Software architecture and modularity

---

## Technical Architecture

### Backend Stack
- **Framework**: FastAPI (async Python web framework)
- **Server**: Uvicorn (ASGI server)
- **NLP Libraries**: TextBlob, NLTK, spaCy
- **Data Validation**: Pydantic models

### Frontend Stack
- **HTML5**: Semantic markup
- **CSS3**: Glassmorphic design with CSS Grid/Flexbox
- **JavaScript (ES6+)**: Async/await, Fetch API, DOM manipulation
- **Icons**: Ionicons library


### Natural Language Processing Pipeline

The AI component employs a custom NLP pipeline designed for robust text processing:

#### 1. **Text Preprocessing** (`src/preprocessing.py`)
   - **Regex-based Cleaning**: Removes punctuation, special characters, and noise
   - **Normalization**: Lowercasing, whitespace handling
   - **Tokenization**: Breaking text into meaningful tokens
   - **Stopword Removal**: Filtering common words for focused analysis

#### 2. **Sentiment Analysis** (`src/model.py`)
   - **TextBlob Integration**: Pre-trained polarity scoring (-1 to +1)
   - **Polarity Interpretation**:
     - Negative: < 0.3
     - Neutral: 0.3 - 0.7
     - Positive: > 0.7

#### 3. **Translation Layer**
   - **TextBlob Translate**: Language detection and translation
   - **Multi-language Support**: 100+ language pairs
   - **Context Awareness**: Sentiment validation for translation quality


## Installation

### Prerequisites
- Python 3.8+
- pip or conda package manager
- Virtual environment (recommended)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rameezayb/Translator-App.git
   cd Translator-App
   ```

2. **Create a Virtual Environment**
   ```bash
   # Using venv
   python -m venv venv
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Activate (macOS/Linux)
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLTK Data** (required for TextBlob)
   ```bash
   python -m textblob.download_corpora
   ```

5. **Run the FastAPI Server**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the Application**
   - Frontend: Open `index.html` in your browser
   - API Documentation: Visit `http://127.0.0.1:8000/docs` (Swagger UI)
   - Health Check: `http://127.0.0.1:8000/health`

### Environment Variables (Optional)
```bash
export FASTAPI_HOST=0.0.0.0
export FASTAPI_PORT=8000
```

### Running the Test Suite

The project includes a comprehensive unittest suite in the `/tests` folder.

1. **Run All Tests**
   ```bash
   python -m unittest discover -s tests -p "test_*.py" -v
   ```

2. **Run Specific Test Module**
   ```bash
   python -m unittest tests.test_pipeline -v
   ```

3. **Run with Coverage Report**
   ```bash
   pip install coverage
   coverage run -m unittest discover -s tests
   coverage report -m
   coverage html  # Generate HTML report
   ```

4. **Run Tests with pytest** (alternative)
   ```bash
   pip install pytest pytest-cov
   pytest tests/ -v --cov=src --cov-report=html
   ```



## Dependencies

### Core
- `fastapi==0.104.1` - Web framework
- `uvicorn==0.24.0` - ASGI server
- `pydantic==2.5.0` - Data validation

### NLP
- `textblob==0.17.1` - Sentiment and translation
- `nltk==3.8.1` - Natural language toolkit

See `requirements.txt` for complete dependency list.


## Contact

**Author**: Rameez  
**Email**: mrameez16dev@gmail.com  
**GitHub**: [github.com/Rameezayb](https://github.com/Rameezayb)

For questions, suggestions, or collaboration inquiries related to this AI project, please open an issue or contact directly.

---

This project demonstrates:
- ✅ Custom NLP pipeline design and implementation
- ✅ Full-stack ML application architecture
- ✅ REST API design with FastAPI
- ✅ Comprehensive testing and code documentation
- ✅ Responsive, user-centered UI design
- ✅ Scalable, modular Python codebase


