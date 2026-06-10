from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from ml.model import predict_fraud, features
from db.database import SessionLocal
from db.models import Prediction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SentinelFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Global metrics (Updated to reflect your multi-tier risk strategy)
# -------------------------
metrics = {
    "total_requests": 0,
    "fraud_count": 0,
    "normal_count": 0,
    "high_risk": 0,
    "medium_high_risk": 0,
    "medium_low_risk": 0,
    "low_risk": 0
}


# -------------------------
# Request schema
# -------------------------
class Transaction(BaseModel):
    amount: float
    merchant: str
    merchant_category: str
    country: str
    is_international: bool
    device_type: str
    new_device: bool
    account_age_days: int
    transactions_last_hour: int
    total_spent_today: float
    time_of_day: str
    vpn_detected: bool
    email_verified: bool
    phone_verified: bool
    two_factor_enabled: bool
    failed_login_attempts: int
    distance_from_home_km: float


# Helper function to centrally update global metrics
def _update_metrics(result):
    metrics["total_requests"] += 1
    
    if result["is_fraud"] == 1:
        metrics["fraud_count"] += 1
    else:
        metrics["normal_count"] += 1

    # Map the new model risk categories to tracking variables
    risk_mapping = {
        "HIGH": "high_risk",
        "MEDIUM-HIGH": "medium_high_risk",
        "MEDIUM-LOW": "medium_low_risk",
        "LOW": "low_risk"
    }
    metric_key = risk_mapping.get(result["risk_level"])
    if metric_key:
        metrics[metric_key] += 1


# -------------------------
# Health check
# -------------------------
@app.get("/")
def home():
    return {"message": "SentinelFlow API running"}


# -------------------------
# Single prediction
# -------------------------
@app.post("/predict")
def predict(transaction: Transaction):
    # Using model_dump() for Pydantic V2 compatibility
    result = predict_fraud(transaction.model_dump())
    
    db = SessionLocal()
    new_record = Prediction(
        fraud_probability=result["fraud_probability"],
        is_fraud=result["is_fraud"],
        risk_level=result["risk_level"],
        amount=transaction.amount
    )

    try:
        db.add(new_record)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        _update_metrics(result)
        db.close()

    return result


# -------------------------
# Batch prediction
# -------------------------
@app.post("/predict-batch")
def predict_batch(transactions: List[Transaction]):
    results = []
    db = SessionLocal()

    try:
        for trans in transactions:
            result = predict_fraud(trans.model_dump())
            results.append(result)

            _update_metrics(result)

            new_record = Prediction(
                fraud_probability=result["fraud_probability"],
                is_fraud=result["is_fraud"],
                risk_level=result["risk_level"],
                amount=trans.amount
            )
            db.add(new_record)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    return results


# -------------------------
# Model info
# -------------------------
@app.get("/model-info")
def get_model_info():
    return {
        "Model": "XGBoost",
        "Task": "Fraud Detection",
        "Threshold": 0.4,  # Updated to reflect your new model logic
        "feature_count": len(features)
    }


# -------------------------
# Metrics endpoint
# -------------------------
@app.get("/metrics")
def get_metrics():
    return metrics


# -------------------------
# History of the Database
# -------------------------
@app.get("/history")
def get_history(limit: int = 50):
    db = SessionLocal()
    try:
        records = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "id": r.id, 
                "timestamp": r.timestamp,
                "fraud_probability": r.fraud_probability,
                "is_fraud": r.is_fraud,
                "risk_level": r.risk_level,
                "amount": r.amount
            }
            for r in records
        ]
    finally: 
        db.close()


# -------------------------
# Fraud Rate 
# -------------------------
@app.get("/fraud-rate")
def fraud_rate():
    total = metrics["total_requests"]
    if total == 0: 
        return {"fraud_rate": 0}
    
    return {"fraud_rate": metrics["fraud_count"] / total}


# -------------------------
# Risk Breakdown
# -------------------------
@app.get("/risk-summary")
def risk_summary():
    return {
        "high_risk": metrics["high_risk"],
        "medium_high_risk": metrics["medium_high_risk"],
        "medium_low_risk": metrics["medium_low_risk"],
        "low_risk": metrics["low_risk"]
    }