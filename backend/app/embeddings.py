from sentence_transformers import SentenceTransformer
import torch

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        # This model produces 384-dimensional embeddings
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer(model_name, device=self.device)

    def generate_embedding(self, text: str):
        return self.model.encode(text).tolist()

    def generate_embeddings_batch(self, texts: list[str]):
        return self.model.encode(texts).tolist()

# Singleton instance
embedding_service = EmbeddingService()
