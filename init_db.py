from db.database import Base, engine
from db.models import Prediction

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully")