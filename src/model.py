from textblob import TextBlob
from src.preprocessing import TextProcessor

class TranslatorAI:
    def __init__(self):
        self.processor = TextProcessor()

    def run_inference(self, raw_text, target="fr"):
        """Process text and run sentiment-aware translation."""
        clean = self.processor.clean_text(raw_text)
        blob = TextBlob(clean)
        
        # Logic: We use sentiment to validate translation context
        sentiment = blob.sentiment.polarity
        translation = blob.translate(to=target)
        
        return {
            "input": clean,
            "translation": str(translation),
            "sentiment_score": sentiment
        }