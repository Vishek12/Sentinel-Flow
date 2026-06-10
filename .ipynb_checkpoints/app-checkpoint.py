from fastapi import FastAPI
from pydantic import BaseModel
from ml.model import predict_fraud, features
from typing import List
from collections import defaultdict 


#Global metrics 
metrics = {
    "total_requests": 0,
    "fraud_count": 0, 
    "normal_count":0, 
    "high_risk":0
}


app = FastAPI(title="SentinelFlow API")



class Transaction(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float


@app.get("/")
def home():
    return {"message": "SentinelFlow API running"}

@app.post("/predict")
def predict(transaction: Transaction):

    result = predict_fraud(transaction.dict()); 

    metrics["total_requests"] += 1
    
    if result["is_fraud"] == 1:
        metrics["fraud_count"] += 1

    if result["risk_level"] == "HIGH":
        metrics["high_risk"] += 1

    else:
        metrics["normal_count"] += 1 
    
    return result

@app.post("/predict-batch")
def predict_batch(transactions: List[Transaction]):
    results = []

    for trans in transactions: 

        result = predict_fraud(trans.dict())

        metrics["total_requests"] += 1
    
        if result["is_fraud"] == 1:
            metrics["fraud_count"] += 1

        if result["risk_level"] == "HIGH":
            metrics["high_risk"] += 1

        else:
            metrics["normal_count"] += 1 

        results.append(result)
        
    return results
    
    # return [predict_fraud(trans.dict()) for trans in transactions]

    


@app.get("/model-info")
def get_model_info():
    return {
        "Model": "XGBoost", 
        "Task": "Fraud Detection", 
        "Threshold:":0.3, 
        "feature Count": len(features)
    }

@app.get("/metrics")
def get_metrics():
    return {
        "total_requests": metrics["total_requests"],
        "fraud_detected": metrics["fraud_count"],
        "normal_transactions": metrics["normal_count"],
        "high_risk_alerts": metrics["high_risk"]
    }
    
    
