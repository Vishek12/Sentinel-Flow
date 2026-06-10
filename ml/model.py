# This is the logic our model uses to make predictions

import os
import joblib
import pandas as pd
import io 
import boto3 

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#
# model_path = os.path.join(
#     BASE_DIR,
#     "artifacts",
#     "sentinelflow_xgb.pkl"
# )
#
# feature_columns_path = os.path.join(
#     BASE_DIR,
#     "artifacts",
#     "feature_columns.pkl"
# )

#Retreive the model and features from our s3 bucket
s3 = boto3.client("s3")

BUCKET = "sentinelflow-models-123"


#load the files
def load_from_s3(key):
    buffer = io.ByteIO()
    s3.download_fileobj(BUCKET, key, buffer)
    return joblib.load(buffer)
    
    





# Load model
model = joblib.load(model_path)

# Load the exact column order the model expects
features = joblib.load(feature_columns_path)


def predict_fraud(input_data):
  
    # Convert input dict to DataFrame
    raw_df = pd.DataFrame([input_data])
    
    # Ensure columns match the exact training feature order
    # Any missing columns default to 0/NaN; extra columns are dropped
    final_features = raw_df.reindex(columns=features, fill_value=0)

    # Get fraud probability (probability of class 1)
    prob = float(model.predict_proba(final_features)[0][1])

    # Your committed optimal threshold
    threshold = 0.40
    prediction = int(prob >= threshold)

    # --- ADVANCED RISK & TRANSACTION LOGIC ---
    if prob >= 0.75:
        risk = "HIGH"
        status = "BLOCK"  # Hard block, extremely likely to be fraud
        
    elif prob >= 0.40:
        risk = "MEDIUM-HIGH"
        status = "FLAGGED"  # Crosses your 0.40 threshold, trigger investigation
        
    elif prob >= 0.20:
        risk = "MEDIUM-LOW"
        status = "REVIEW"  # Safe zone, but good candidate for step-up auth (SMS/OTP)
        
    else:
        risk = "LOW"
        status = "APPROVED"  # Safe to pass instantly

    return {
        "transaction_status": status,
        "fraud_probability": round(prob, 4),
        "is_fraud": prediction,
        "risk_level": risk,
        "model_version": "1.1",
        "threshold_used": threshold
    }