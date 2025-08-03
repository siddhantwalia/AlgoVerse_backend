from fastapi import FastAPI
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
    return write_react_app_to_file(code,file)

def write_react_app_to_file(code: str, filename: str = 'App.tsx') -> None:
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(code)
    print(f"File '{filename}' has been created successfully.")
