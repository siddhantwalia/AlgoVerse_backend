import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


llm = ChatGroq(api_key=GROQ_API_KEY,
               model ="llama-3.3-70b-versatile")