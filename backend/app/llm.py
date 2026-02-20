import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class LLMProvider:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def generate_response(self, system_prompt: str, user_query: str):
        # List of models to try in order of preference
        models_to_try = [
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "mixtral-8x7b-32768",
            "llama3-8b-8192"
        ]
        
        last_error = ""
        for model in models_to_try:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_query},
                    ],
                    model=model,
                    temperature=0.2,
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                error_msg = str(e)
                last_error = error_msg
                if "rate_limit_exceeded" in error_msg.lower():
                    # Move to next model if rate limited
                    continue
                return f"Error connecting to Groq ({model}): {error_msg}"
        
        return f"All Groq models rate limited or failed. Last error: {last_error}"

llm_provider = LLMProvider()
