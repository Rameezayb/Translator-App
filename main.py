from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.model import TranslatorAI

app = FastAPI(title="TranslateAI API", version="1.0.0")

# Configure CORS to allow requests from the HTML frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify ["http://localhost:8000", etc.])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the translator model
translator = TranslatorAI()


class TranslationRequest(BaseModel):
    """Request schema for translation endpoint."""
    text: str
    target_language: str = "en"


class TranslationResponse(BaseModel):
    """Response schema for translation endpoint."""
    input_text: str
    translation: str
    sentiment_score: float


@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """
    Translate text and return translation with sentiment analysis.
    
    Args:
        text: The text to translate
        target_language: Target language code (e.g., 'fr', 'es', 'de')
    
    Returns:
        TranslationResponse with input, translation, and sentiment score
    """
    result = translator.run_inference(request.text, target=request.target_language)
    
    return TranslationResponse(
        input_text=result["input"],
        translation=result["translation"],
        sentiment_score=result["sentiment_score"]
    )


@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "TranslateAI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
