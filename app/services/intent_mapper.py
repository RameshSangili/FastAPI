INTENT_AGENT_MAP = {
    "FRAUD_CHECK": "FraudCheckAgent",
    "LOAN_STATUS": "LoanStatusAgent"
}

def map_intent(intent: str):
    return INTENT_AGENT_MAP.get(intent, "GenericAgent")
