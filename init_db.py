from database.database import Base, engine
from database.models import Prediction

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully")