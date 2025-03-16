from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from models.model import AIModel

app = FastAPI(title="AI Engine API", description="API for the AI Engine of the Personalized Knowledge Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the AI model
model = AIModel()

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str

class PredictionRequest(BaseModel):
    input_text: str
    parameters: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    result: Any
    confidence: float

class SearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Generate a chatbot response based on the user's message and chat history.
    """
    try:
        response = model.generate_chat_response(request.message, request.chat_history)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chat response: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make a prediction based on the input text.
    """
    try:
        result, confidence = model.predict(request.input_text, request.parameters)
        return PredictionResponse(result=result, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")

@app.post("/search")
async def search(request: SearchRequest):
    """
    Search for content using semantic search.
    """
    try:
        results = model.semantic_search(request.query, request.filters)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching content: {str(e)}")

@app.get("/daily-content")
async def get_daily_content():
    """
    Get daily dynamic content for the home page.
    """
    try:
        content = model.get_daily_content()
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating daily content: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)