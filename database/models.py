from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database.database import Base 

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    fraud_probability = Column(Float)
    is_fraud = Column(Integer)
    risk_level = Column(String)
    amount = Column(Float)