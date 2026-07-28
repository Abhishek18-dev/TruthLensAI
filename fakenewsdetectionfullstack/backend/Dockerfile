FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data inside image
RUN python -m nltk.downloader \
    -d /usr/local/share/nltk_data \
    stopwords \
    wordnet \
    omw-1.4 \
    averaged_perceptron_tagger \
    averaged_perceptron_tagger_eng

# Copy whole project
COPY . .

ENV PYTHONPATH=/app
ENV NLTK_DATA=/usr/local/share/nltk_data

EXPOSE 8000

CMD ["uvicorn","backend.app.main:app","--host","0.0.0.0","--port","8000"]
