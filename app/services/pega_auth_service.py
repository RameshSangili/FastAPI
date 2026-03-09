import requests
from app.config import PEGA_OAUTH_URL, PEGA_CLIENT_ID, PEGA_CLIENT_SECRET

def get_access_token():
    response = requests.post(
        PEGA_OAUTH_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": PEGA_CLIENT_ID,
            "client_secret": PEGA_CLIENT_SECRET
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    response.raise_for_status()
    return response.json()["access_token"]