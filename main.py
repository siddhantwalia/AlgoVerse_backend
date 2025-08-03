from fastapi import FastAPI
import re
from pydantic import BaseModel
import langchain
from model import llm
from utils import Prompt
app = FastAPI()

class AlgoMaker(BaseModel):
    Algo_name :str


@app.get("/")
def home():
    return "hehe"

@app.post(("/make"))
def make_algo(req:AlgoMaker):
    query = req.Algo_name
    chain = Prompt | llm
    code = chain.invoke(query).content
    file = query+".jsx"
    code = clean_output(code)   
    
    return write_react_app_to_file(code,file)

def write_react_app_to_file(code: str, filename: str = 'App.tsx') -> None:
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(code)
    print(f"File '{filename}' has been created successfully.")


def clean_output(answer):
    content = str(answer).strip()
    content = re.sub(r"<explanation>.*?</explanation>", "", content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r"<dependencies(-file)?>.*?</dependencies(-file)?>", "", content, flags=re.DOTALL | re.IGNORECASE)

    match = re.search(r"<code-file[^>]*>(.*?)</code-file>", content, re.DOTALL)
    if match:
        extracted = match.group(1).strip()
    else:
        extracted = "" 

    cleaned = re.sub(r"\n{3,}", "\n\n", extracted)
    return cleaned
    