import requests
import sys
import os
import time

# Add the parent directory to sys.path to find the app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app import models
from app.rag import rag_engine

def fetch_quran(edition):
    url = f"https://api.alquran.cloud/v1/quran/{edition}"
    print(f"Fetching Quran edition: {edition}...")
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['data']['surahs']
    else:
        print(f"Error fetching Quran {edition}: {response.status_code}")
        return None

def ingest_quran():
    db = SessionLocal()
    
    # We'll fetch English (Asad) and Arabic (original)
    en_surahs = fetch_quran("en.asad")
    ar_surahs = fetch_quran("quran-simple") # Simple Arabic text

    if not en_surahs or not ar_surahs:
        print("Failed to fetch Quran data.")
        return

    print("Cleaning existing Quran verses for fresh full ingestion...")
    db.query(models.QuranVerse).delete()
    db.commit()

    print("Processing and ingesting full Quran...")
    for i in range(len(en_surahs)):
        en_surah = en_surahs[i]
        ar_surah = ar_surahs[i]
        
        surah_num = en_surah['number']
        print(f"Ingesting Surah {surah_num}: {en_surah['englishName']}...")
        
        for j in range(len(en_surah['ayahs'])):
            en_ayah = en_surah['ayahs'][j]
            ar_ayah = ar_surah['ayahs'][j]
            
            # Use English text for embedding
            embedding = rag_engine.get_embedding(en_ayah['text'])
            
            verse = models.QuranVerse(
                surah_number=surah_num,
                ayah_number=en_ayah['numberInSurah'],
                arabic_text=ar_ayah['text'],
                english_text=en_ayah['text'],
                embedding=embedding
            )
            db.add(verse)
        
        # Commit every surah to avoid huge transactions
        db.commit()
        print(f"Surah {surah_num} complete.")

    print("Quran ingestion complete.")
    db.close()

if __name__ == "__main__":
    ingest_quran()
