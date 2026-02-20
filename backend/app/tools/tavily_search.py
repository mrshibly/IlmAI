from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

class SearchTool:
    def __init__(self):
        self.api_key = os.getenv("TAVILY_API_KEY")
        if not self.api_key:
            print("Warning: TAVILY_API_KEY not found in environment.")
        self.client = TavilyClient(api_key=self.api_key) if self.api_key else None

    def search(self, query: str, search_depth: str = "advanced", max_results: int = 5):
        """
        Performs a web search using Tavily.
        """
        if not self.client:
            return []
        
        try:
            # Filter for Islamic/Religious content if needed, but Tavily is generally good with query intent
            response = self.client.search(query=query, search_depth=search_depth, max_results=max_results)
            return response.get('results', [])
        except Exception as e:
            print(f"Tavily search error: {e}")
            return []

search_tool = SearchTool()
