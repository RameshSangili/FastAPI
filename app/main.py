from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import logging

from app.services.pega_ai_agent_service import (
    pega_create_conversation,
    pega_continue_conversation_stream
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FastAPI → Pega Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class ChatRequest(BaseModel):
    message: str
    conversationId: str | None = None


@app.get("/")
def health():
    return {"status": "running"}


@app.post("/api/chat/start")
def start_chat(req: ChatRequest):
    try:
        return pega_create_conversation(req.message)
    except Exception as e:
        logger.error(f"Start chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat/continue")
def continue_chat(req: ChatRequest):
    """Stream the response from Pega to React"""
    
    if not req.conversationId:
        raise HTTPException(status_code=400, detail="conversationId required")
    
    def generate():
        try:
            logger.info(f"Starting stream for conversation: {req.conversationId}")
            
            chunk_count = 0
            for chunk in pega_continue_conversation_stream(
                req.conversationId,
                req.message
            ):
                chunk_count += 1
                logger.info(f"Yielding chunk {chunk_count}: {chunk[:50]}...")
                
                # Send each chunk as SSE to frontend
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            
            logger.info(f"Stream completed. Total chunks: {chunk_count}")
            
        except Exception as e:
            logger.error(f"Stream error: {e}", exc_info=True)
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )