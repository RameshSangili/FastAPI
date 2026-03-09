import requests
import uuid
import json
import logging

from app.config import (
    PEGA_AGENT_EXECUTE_URL,
    PEGA_AGENT_CONTINUE_BASE_URL,
    TOKEN_URL,
    CLIENT_ID,
    CLIENT_SECRET
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pega-agent")


def get_access_token():
    logger.info("Requesting OAuth token")
    
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        },
        timeout=30
    )
    
    logger.info(f"OAuth Status: {resp.status_code}")
    resp.raise_for_status()
    token = resp.json()["access_token"]
    
    logger.info("OAuth token received")
    return token


def build_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    }


# --------------------------------------------------
# START (POST JSON-RPC)
# --------------------------------------------------

def pega_create_conversation(message: str):
    
    token = get_access_token()
    headers = build_headers(token)
    
    payload = {
        "jsonrpc": "2.0",
        "id": str(uuid.uuid4()),
        "method": "message/send",
        "params": {
            "message": {
                "role": "agent",
                "parts": [
                    {"kind": "text", "text": message}
                ]
            }
        }
    }
    
    logger.info("==== CREATE CONVERSATION ====")
    logger.info(f"URL: {PEGA_AGENT_EXECUTE_URL}")
    logger.info(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(
        PEGA_AGENT_EXECUTE_URL,
        json=payload,
        headers=headers,
        timeout=60
    )
    
    logger.info(f"HTTP Status: {response.status_code}")
    logger.info(f"Response: {response.text[:1000]}")
    
    response.raise_for_status()
    data = response.json()
    
    result = data.get("result", {})
    context_id = result.get("contextId")
    reply = result.get("parts", [{}])[0].get("text", "")
    
    logger.info(f"ContextId extracted: {context_id}")
    
    return {
        "conversationId": context_id,
        "reply": reply
    }


# --------------------------------------------------
# CONTINUE (PATCH) - Pega sends raw JSON lines, not SSE
# --------------------------------------------------

def pega_continue_conversation_stream(conversation_id: str, message: str):
    """
    Generator that yields chunks from Pega's stream.
    Pega sends raw JSON objects as lines, NOT standard SSE format.
    """
    
    token = get_access_token()
    headers = build_headers(token)
    
    url = f"{PEGA_AGENT_CONTINUE_BASE_URL}/{conversation_id}"
    
    payload = {
        "request": message,
        "capabilities": {
            "stream": {"isEnabled": True}
        }
    }
    
    logger.info("==== CONTINUE CONVERSATION ====")
    logger.info(f"URL: {url}")
    logger.info(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.patch(
        url,
        json=payload,
        headers=headers,
        stream=True,
        timeout=120
    )
    
    logger.info(f"HTTP Status: {response.status_code}")
    response.raise_for_status()
    
    # Parse the stream - Pega sends JSON objects as lines
    for raw_line in response.iter_lines(decode_unicode=True):
        
        if not raw_line:
            continue
        
        line = raw_line.strip()
        logger.info(f"RAW LINE: {line}")
        
        # Skip empty lines
        if not line:
            continue
        
        try:
            # Parse the JSON directly (no "data: " prefix)
            data_obj = json.loads(line)
            logger.info(f"PARSED JSON: {data_obj}")
            
            # Extract the response field
            if "response" in data_obj:
                response_text = data_obj["response"]
                logger.info(f"Found response field, length: {len(response_text)}")
                
                # Yield the response in chunks for typing effect
                chunk_size = 10 # Adjust for typing speed
                for i in range(0, len(response_text), chunk_size):
                    chunk = response_text[i:i + chunk_size]
                    logger.info(f"Yielding chunk: {chunk[:30]}...")
                    yield chunk
            
            # Handle other possible fields
            elif "content" in data_obj:
                yield data_obj["content"]
            elif "text" in data_obj:
                yield data_obj["text"]
            else:
                logger.warning(f"Unknown response format: {list(data_obj.keys())}")
                
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}, Line: {line}")
            continue
    
    logger.info("SSE stream completed")
