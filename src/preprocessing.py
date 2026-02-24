import re
import string

class TextProcessor:
    def __init__(self):
        self.punctuation = string.punctuation

    def clean_text(self, text):
        """Advanced cleaning for NLP: handles special chars and whitespace."""
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        # Remove punctuation but keep apostrophes for contractions
        table = str.maketrans('', '', self.punctuation.replace("'", ""))
        text = text.translate(table)
        return text.strip().lower()