import re
from textblob import TextBlob

def clean_text(text):
    # Preprocessing: Remove special characters and lowercase
    return re.sub(r'[^a-zA-Z\s]', '', text).lower()

def translate_and_analyze(text, target_lang='fr'):
    cleaned = clean_text(text)
    blob = TextBlob(cleaned)
    return blob.translate(to=target_lang), blob.sentiment.polarity