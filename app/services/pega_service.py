import requests
from app.config import PEGA_BASE_URL, PEGA_TOKEN

def invoke_pega_agent(agent_name: str, payload: dict):

    headers = {
        "Authorization": f"Bearer {PEGA_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "agentName": agent_name,
        "payload": payload
    }

    response = requests.post(
        PEGA_BASE_URL,
        json=body,
        headers=headers,
        timeout=30
    )

    return response.json()