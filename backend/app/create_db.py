from app.database import Base, engine
from app.models import User, Pin

# Create all registered database tables
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
