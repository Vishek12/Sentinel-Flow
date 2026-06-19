import joblib
import pandas as pd
import io
import boto3

s3 = boto3.client("s3")
BUCKET = "sentinelflow-models-123"

_pipeline = None

def load_from_s3(key):
    buffer = io.BytesIO()

    s3.download_fileobj(
        BUCKET,
        key,
        buffer
    )

    buffer.seek(0)
    return joblib.load(buffer)


def get_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = load_from_s3("pipelines/sentinelflow_xgb_v1.pkl")
    return _pipeline

   
def predict_fraud(input_data):
    pipeline = get_pipeline()
   
    
    raw_df = pd.DataFrame([input_data])

    #Prevent any uninented casing 
    raw_df.columns = [col.lower() for col in raw_df.columns]

    #Feed the raw data into the pipeline 
    prob = float(pipeline.predict_proba(raw_df)[0][1])
    
    threshold = 0.50
    prediction = int(prob >= threshold)

    if prob >= 0.75:
        risk = "HIGH"
        status = "BLOCK"
    elif prob >= 0.50:
        risk = "MEDIUM-HIGH"
        status = "FLAGGED"

    elif prob >= 0.25:
        risk = "MEDIUM-LOW"
        status = "APPROVED-MONITORED"
    else:
        risk = "LOW"
        status = "APPROVED"

    return {
        "transaction_status": status,
        "fraud_probability": round(prob, 4),
        "is_fraud": prediction,
        "risk_level": risk,
        "model_version": "1.2 (Pipeline Optimized)",
        "threshold_used": threshold
    }