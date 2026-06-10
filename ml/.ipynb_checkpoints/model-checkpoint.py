# This is the logic our model to make predictiosn 
import joblib 
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "artifacts", "sentinelflow_xgb.pkl")
features_path = os.path.join(BASE_DIR, "artifacts", "feature_columns.pkl")




model = joblib.load(model_path)
features = joblib.load(features_path)
## This function is called when we want to predict some input data 
def predict_fraud(input_data): 

    df = pd.DataFrame([input_data])
    df = df[features]

    prob = model.predict_proba(df)[:, 1][0]
    threshold = 0.3 

    prediction = int(prob > threshold)

    status = "FLAGGED" if prediction == 1 else "APPROVED"

       # risk level
    if prob > 0.7:
        risk = "HIGH"
    elif prob > 0.3:
        risk = "MEDIUM"
    else:
        risk = "LOW"


    # Transaction Status 
    return{
        
       "transaction_status": status,

        "fraud_probability": round(float(prob), 4),

        "is_fraud": prediction,

        "risk_level": risk,

        "model_version": "1.0",

        "threshold_used": threshold
   
    }