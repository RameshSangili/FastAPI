import os
from google import genai
from google.genai import errors
from app.config import GEMINI_API_KEY

# Force API Studio (vertexai=False) and the stable v1 endpoint
client = genai.Client(
    api_key=GEMINI_API_KEY,
    vertexai=False, 
    http_options={'api_version': 'v1'}
)

def gemini_prepare_message(user_message: str) -> str:
    """
    Service using Gemini 1.5 Flash with explicit versioning.
    """
    prompt = f"Rewrite the following user request into a clear instruction:\n\n{user_message}"

    try:
        # Using the absolute versioned string 'gemini-1.5-flash'
        # The 'models/' prefix is handled by the Client automatically in v1
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        
        if not response.text:
            return "The model returned an empty response."
            
        return response.text

    except errors.ClientError as e:
        # This catches 404/400 errors specifically
        print(f"DEBUG: Client Error: {e}")
        return f"Configuration Error: {e.message}"

    except errors.APIError as e:
        if e.code == 429:
            return "The assistant is currently busy. Please wait a few seconds."
        raise e

    except Exception as e:
        print(f"DEBUG: Unexpected Error: {e}")
        raise e
