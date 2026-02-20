import requests
import sys
import os
import time

# Add the parent directory to sys.path to find the app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app import models
from app.rag import rag_engine

def fetch_hadith_book(edition):
    url = f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/{edition}.json"
    print(f"Fetching Hadith edition: {edition}...")
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['hadiths']
    else:
        print(f"Error fetching Hadith {edition}: {response.status_code}")
        return None

def ingest_hadith():
    db = SessionLocal()
    
    # We'll fetch English Bukhari
    bukhari_eng = fetch_hadith_book("eng-bukhari")

    if not bukhari_eng:
        print("Failed to fetch Hadith data.")
        return

    print("Processing and ingesting Hadiths (Limit 100 for verification)...")
    # Take a sample for verification
    for i in range(min(len(bukhari_eng), 100)):
        h = bukhari_eng[i]
        
        # Some API versions might have slightly different structures
        text = h.get('text', '')
        if not text: continue

        embedding = rag_engine.get_embedding(text[:500]) # Embed first 500 chars for speed
        
        hadith = models.Hadith(
            book_name="Sahih Bukhari",
            hadith_number=int(h.get('hadithnumber', 0)),
            arabic_text="", # We could fetch Arabic too, but English is priority for retrieval
            english_text=text,
            grade="Sahih",
            embedding=embedding
        )
        db.add(hadith)
        
        if i % 10 == 0:
            db.commit()
            print(f"Ingested {i} hadiths...")

    db.commit()
    print("Hadith ingestion complete.")
    db.close()

if __name__ == "__main__":
    ingest_hadith()
