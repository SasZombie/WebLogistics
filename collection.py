import os
import chromadb
import subprocess
from sentence_transformers import SentenceTransformer
import json


def main()->None:
    
    book_data_raw = subprocess.run(['./Cpp/bin/getAllEntriesBookRDF'], capture_output=True, text=True)
    user_data_raw = subprocess.run(['./Cpp/bin/getAllEntriesUserRDF'], capture_output=True, text=True)

    book_data = json.loads(book_data_raw.stdout) 
    user_data = json.loads(user_data_raw.stdout)

    db_directory = "server/content/chroma_db"

    if not os.path.exists(db_directory):
        os.makedirs(db_directory)

    chroma_client = chromadb.PersistentClient(path=db_directory)

    collection_name = "books_users"

    collections = chroma_client.list_collections()

    print(collections)
    found = False
    # If the collection doesn't exist, create it
    for collection_enumerated in collections:
        if collection_enumerated.name == collection_name:
            collection = chroma_client.get_collection(collection_name)
            found = True

    if not found:
        collection = chroma_client.create_collection(name=collection_name)
    

    embedder = SentenceTransformer('all-MiniLM-L6-v2')

    for idx, book in enumerate(book_data):
        doc = f"Book: {book['ex:hasTitle']}. Themes: {book['ex:hasTheme1'] and book['ex:hasTheme2']}. Reading Level: {book['ex:hasReadingLvl']}."
        embedding = embedder.encode(doc).tolist()
        collection.add(
            documents=[doc],
            embeddings=[embedding],
            metadatas=[book],
            ids=[str(idx)]  
        )

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
    main();