from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from ml.model import predict_fraud
from database.database import SessionLocal
from database.models import Prediction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SentinelFlow API")

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Metrics
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
# Input Schema
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


# -------------------------
# Metrics updater
# -------------------------
def update_metrics(result: dict):
    metrics["total_requests"] += 1

    if result["is_fraud"] == 1:
        metrics["fraud_count"] += 1
    else:
        metrics["normal_count"] += 1

    risk = result["risk_level"]

    if risk == "HIGH":
        metrics["high_risk"] += 1
    elif risk == "MEDIUM-HIGH":
        metrics["medium_high_risk"] += 1
    elif risk == "MEDIUM-LOW":
        metrics["medium_low_risk"] += 1
    else:
        metrics["low_risk"] += 1


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

    input_data = transaction.model_dump()
    result = predict_fraud(input_data)

    db = SessionLocal()
    try:
        record = Prediction(
            fraud_probability=result["fraud_probability"],
            is_fraud=result["is_fraud"],
            risk_level=result["risk_level"],
            amount=transaction.amount
        )

        db.add(record)
        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()

    update_metrics(result)
    return result


# -------------------------
# Batch prediction
# -------------------------
@app.post("/predict-batch")
def predict_batch(transactions: List[Transaction]):

    results = []
    db = SessionLocal()

    try:
        for t in transactions:
            input_data = t.model_dump()
            result = predict_fraud(input_data)

            results.append(result)
            update_metrics(result)

            db.add(Prediction(
                fraud_probability=result["fraud_probability"],
                is_fraud=result["is_fraud"],
                risk_level=result["risk_level"],
                amount=t.amount
            ))

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
def model_info():
    return {
        "model": "XGBoost",
        "task": "Fraud Detection",
        "feature_count": len(get_features),  # FIXED: assumes list, not function
        "threshold": 0.5
    }


# -------------------------
# Metrics
# -------------------------
@app.get("/metrics")
def get_metrics():
    return metrics


# -------------------------
# History
# -------------------------
@app.get("/history")
def history(limit: int = 50):

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
# Fraud rate
# -------------------------
@app.get("/fraud-rate")
def fraud_rate():

    total = metrics["total_requests"]

    if total == 0:
        return {"fraud_rate": 0}

    return {
        "fraud_rate": metrics["fraud_count"] / total
    }


# -------------------------
# Risk summary
# -------------------------
@app.get("/risk-summary")
def risk_summary():

    return {
        "high_risk": metrics["high_risk"],
        "medium_high_risk": metrics["medium_high_risk"],
        "medium_low_risk": metrics["medium_low_risk"],
        "low_risk": metrics["low_risk"]
    }