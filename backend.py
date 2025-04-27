# backend.py (FastAPI example)
import os
import json
import ollama
import subprocess
import chromadb
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel

app = FastAPI()

db_directory = "server/content/chroma_db"
collection_name = "books_users"
chroma_client = chromadb.PersistentClient(path=db_directory)

collection = chroma_client.get_collection(collection_name)
embedder = SentenceTransformer('all-MiniLM-L6-v2')


chat_history = []

def retrieve_relevant_context(query):
    """Retrieve relevant documents from ChromaDB based on user query"""
    query_embedding = embedder.encode(query).tolist()
    results = collection.query(query_embeddings=[query_embedding], n_results=3)
    retrieved_texts = results['documents'][0]
    return "\n".join(retrieved_texts)

def build_prompt(history, context, user_question):
    """Build prompt including past conversation and current context"""
    prompt = "You are a helpful assistant. Here is the conversation so far:\n\n"
    
    for msg in history:
        prompt += f"{msg['role']}: {msg['content']}\n"
    
    prompt += f"\nContext from database:\n{context}\n"
    prompt += f"User: {user_question}\n"
    prompt += "Assistant:"
    
    return prompt

def real_llm_response(prompt):
    """Generate response using Ollama LLM locally."""
    try:
        response = ollama.chat(model="llama2", messages=[{"role": "user", "content": prompt}])        
        # print("Ollama response:", response)  #Goofy ahh structure

        assistant_reply = response.get('message', {}).get('content', 'No valid response found')

        return assistant_reply
    
    except Exception as e:
        print("Error with Ollama:", e)
        return "Sorry, there was an error retrieving the answer."

class PromptRequest(BaseModel):
    prompt: str
    
@app.post("/generate-response")
async def generate_response(request: PromptRequest):

    user_input = request.prompt
    context = retrieve_relevant_context(user_input)
    prompt = build_prompt(chat_history, context, user_input);
    
    response = real_llm_response(prompt)
      
    chat_history.append({"role": "user", "content": user_input})
    chat_history.append({"role": "assistant", "content": response})
    
    return {"response": response, "context": context}

db_directory = "server/content/chroma_db"
embedder = SentenceTransformer('all-MiniLM-L6-v2')


@app.post("/uppdate-books")
async def uppdate_book():
    
    book_data_raw = subprocess.run(['./Cpp/bin/getAllEntriesBookRDF'], capture_output=True, text=True)
    book_data = json.loads(book_data_raw.stdout) 
    if not os.path.exists(db_directory):
        os.makedirs(db_directory)

    chroma_client = chromadb.PersistentClient(path=db_directory)

    collection_name = "books_users"

    collections = chroma_client.list_collections()

    found = False
    for collection_enumerated in collections:
        if collection_enumerated.name == collection_name:
            collection = chroma_client.get_collection(collection_name)
            found = True

    if not found:
        collection = chroma_client.create_collection(name=collection_name)
    for idx, book in enumerate(book_data):
        doc = f"Book: {book['ex:hasTitle']}. Themes: {book['ex:hasTheme1'] and book['ex:hasTheme2']}. Reading Level: {book['ex:hasReadingLvl']}."
        embedding = embedder.encode(doc).tolist()
        collection.add(
            documents=[doc],
            embeddings=[embedding],
            metadatas=[book],
            ids=[str(idx)]  
        )
        
@app.post("/uppdate-users")
async def uppdate_user():
    user_data_raw = subprocess.run(['./Cpp/bin/getAllEntriesUserRDF'], capture_output=True, text=True)

    user_data = json.loads(user_data_raw.stdout)


    if not os.path.exists(db_directory):
        os.makedirs(db_directory)

    chroma_client = chromadb.PersistentClient(path=db_directory)

    collection_name = "books_users"

    collections = chroma_client.list_collections()

    found = False
    for collection_enumerated in collections:
        if collection_enumerated.name == collection_name:
            collection = chroma_client.get_collection(collection_name)
            found = True

    if not found:
        collection = chroma_client.create_collection(name=collection_name)
    
    for idx, user in enumerate(user_data):
        doc = f"User: {user['ex:hasName'] and user['ex:hasSurrname']}. Prefers: {user['ex:hasPreferedTheme']}. Reading Level: {user['ex:hasReadingLvl']}."
        embedding = embedder.encode(doc).tolist()
        
        collection.add(
            documents=[doc],
            embeddings=[embedding],
            metadatas=[user],
            ids=[str(idx)]  
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
