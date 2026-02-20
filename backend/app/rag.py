import os
import numpy as np
import google.generativeai as genai
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class RAGEngine:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.api_available = True
            logger.info("Configured Gemini Embeddings API")
        else:
            self.api_available = False
            logger.warning("GEMINI_API_KEY not found. Semantic search will be disabled.")
        
        # Using Gemini's latest embedding model
        self.model_name = "models/text-embedding-004"

    def get_embedding(self, text: str):
        if not self.api_available or not text:
            return None
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Failed to generate embedding via Gemini API: {e}")
            return None

    def cosine_similarity(self, vec1, vec2):
        if vec1 is None or vec2 is None:
            return 0.0
        try:
            v1 = np.array(vec1)
            v2 = np.array(vec2)
            dot_product = np.dot(v1, v2)
            norm_v1 = np.linalg.norm(v1)
            norm_v2 = np.linalg.norm(v2)
            if norm_v1 == 0 or norm_v2 == 0:
                return 0.0
            return float(dot_product / (norm_v1 * norm_v2))
        except:
            return 0.0

    def search_semantic(self, query_vector, candidates, top_k=3, threshold=0.3):
        """
        Performs semantic search across a list of SQLAlchemy objects with 'embedding' fields.
        """
        if not query_vector:
            return []
            
        scored_candidates = []
        for item in candidates:
            if hasattr(item, 'embedding') and item.embedding:
                score = self.cosine_similarity(query_vector, item.embedding)
                scored_candidates.append((score, item))
            
        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        return [item for score, item in scored_candidates[:top_k] if score >= threshold]

    def construct_system_prompt(self, context: str, web_context: str = "", madhhab: str = "General", language: str = "en", mode: str = "standard"):
        """
        Constructs a specialized system prompt for the Islamic AI assistant with personalization.
        """
        full_context = f"--- AUTHORITATIVE LOCAL SOURCES ---\n{context}\n\n"
        if web_context:
            full_context += f"--- SUPPLEMENTAL WEB RESEARCH ---\n{web_context}\n\n"

        lang_instruction = "Respond in English."
        if language == "bn":
            lang_instruction = "Respond in Bangla (Bengali)."

        madhhab_instruction = ""
        if madhhab and madhhab != "General" and mode != "comparative":
            madhhab_instruction = f"7. The user follows the **{madhhab}** Madhhab (school of thought). Prioritize {madhhab} rulings or viewpoints when providing Fiqh information, while remaining respectful of other scholarly opinions."
        
        mode_instruction = ""
        if mode == "comparative":
            mode_instruction = """
7. **COMPARATIVE FIQH MODE ENABLED**: Provide a side-by-side comparison of the major schools of thought (Hanafi, Shafi'i, Maliki, Hanbali) where applicable. 
   - Use a clear Markdown table or structured bullet points to contrast the views.
   - Highlight areas of consensus (Ijma) and legitimate scholarly disagreement (Ikhtilaf).
   - Maintain professional, objective scholarly neutrality.
"""

        return f"""You are IlmAI, a specialized scholarly research assistant for Quran, Hadith, and Fiqh. 
Your goal is to provide accurate, verified, and respectful answers based on the provided context.

GUIDELINES:
1. PRIORITIZE local sources (Quran and Hadith). If a direct answer is in the Quran or Hadith, lead with that.
2. Use web research context ONLY to supplement or if local sources are silent. Clearly state if information comes from web research.
3. Be respectful and use traditional honorifics for the Prophet (S) and Sahaba (R).
4. Do NOT issue independent fatwas. Report existing scholarly opinions and state citations clearly.
5. Use Markdown formatting for clarity. Use **bold** for key terms, names, and titles. Use bullet points for lists.
6. If the context is completely irrelevant to the question, state that you cannot find a specific answer in your verified sources.
{madhhab_instruction}{mode_instruction}

Language Instruction: {lang_instruction}

CONTEXT:
{full_context}
"""

rag_engine = RAGEngine()
