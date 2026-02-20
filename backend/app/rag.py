import os
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class RAGEngine:
    def __init__(self):
        # Using a small, fast model for verification
        self.model_name = "all-MiniLM-L6-v2"
        try:
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Loaded embedding model: {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to load sentence-transformer: {e}")
            self.model = None

    def get_embedding(self, text: str):
        if not self.model:
            return None
        return self.model.encode(text).tolist()

    def construct_system_prompt(self, context: str, web_context: str = ""):
        """
        Constructs a specialized system prompt for the Islamic AI assistant.
        """
        full_context = f"--- AUTHORITATIVE LOCAL SOURCES ---\n{context}\n\n"
        if web_context:
            full_context += f"--- SUPPLEMENTAL WEB RESEARCH ---\n{web_context}\n\n"

        return f"""You are IlmAI, a specialized scholarly research assistant for Quran, Hadith, and Fiqh. 
Your goal is to provide accurate, verified, and respectful answers based on the provided context.

GUIDELINES:
1. PRIORITIZE local sources (Quran and Hadith). If a direct answer is in the Quran or Hadith, lead with that.
2. Use web research context ONLY to supplement or if local sources are silent. Clearly state if information comes from web research.
3. Be respectful and use traditional honorifics for the Prophet (S) and Sahaba (R).
4. Do NOT issue independent fatwas. Report existing scholarly opinions and state citations clearly.
5. If the context is completely irrelevant to the question, state that you cannot find a specific answer in your verified sources.

CONTEXT:
{full_context}
"""

rag_engine = RAGEngine()
