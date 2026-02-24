from textblob import TextBlob
from src.preprocessing import TextProcessor

class TranslatorAI:
    def __init__(self):
        self.processor = TextProcessor()

    def run_inference(self, raw_text, target="fr"):
        """Process text and run sentiment-aware translation."""
        clean = self.processor.clean_text(raw_text)
        blob = TextBlob(clean)
        
        # Calculate sentiment
        sentiment = blob.sentiment.polarity
        
        # Attempt translation using deep-translator
        translation = clean
        try:
            from deep_translator import GoogleTranslator
            # Map two-letter language codes to full language names if needed
            translator = GoogleTranslator(source='auto', target=target)
            translation = translator.translate(clean)
        except Exception as e:
            # Fallback: return cleaned original
            translation = clean
        
        return {
            "input": clean,
            "translation": str(translation),
            "sentiment_score": sentiment
        }