from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base 

DATABASE_URL = "postgresql://postgres:Vi$hek2001@sentinelflow.cfk8k6ou49n6.ca-central-1.rds.amazonaws.com:5432/SentinelFlow_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()