import sys
import os

# Add the parent directory to sys.path to find the app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine
from app import models
from app.rag import rag_engine

def ingest_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.QuranVerse).count() > 0:
        print("Data already exists. Skipping ingestion.")
        db.close()
        return

    sample_verses = [
        {
            "surah": 24,
            "ayah": 35,
            "arabic": "ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍ فِيهَا مِصْبَاحٌ",
            "english": "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp.",
            "tafsir": "Allah's guidance and truth illuminate the universe. The metaphor of light represents divine knowledge and clarity."
        },
        {
            "surah": 2,
            "ayah": 255,
            "arabic": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
            "english": "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
            "tafsir": "Ayat al-Kursi, the Verse of the Throne, describes Allah's absolute power and lordship over all creation."
        },
        {
            "surah": 2,
            "ayah": 43,
            "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
            "english": "And establish prayer and give zakah and bow with those who bow [in worship and obedience].",
            "tafsir": "The fundamental command to establish Salah and give Zakat as pillars of the faith."
        }
    ]

    for v in sample_verses:
        verse = models.QuranVerse(
            surah_number=v["surah"],
            ayah_number=v["ayah"],
            arabic_text=v["arabic"],
            english_text=v["english"],
            tafsir_summary=v["tafsir"],
            embedding=rag_engine.get_embedding(v["english"])
        )
        db.add(verse)
    
    db.commit()
    print(f"Successfully ingested {len(sample_verses)} sample verses.")
    db.close()

if __name__ == "__main__":
    ingest_data()
