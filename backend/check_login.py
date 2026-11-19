
from app.database import SessionLocal
from app.models.user import User
from pwdlib import PasswordHash

db = SessionLocal()
password_hash = PasswordHash.recommended()

try:
    email = input("Enter registered email: ").strip()
    password = input("Enter registered password: ")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        print("RESULT: Email not found in database.")
    else:
        print("RESULT: Email found in database.")

        if password_hash.verify(password, user.hashed_password):
            print("RESULT: Password verification successful!")
        else:
            print("RESULT: Password does not match.")

finally:
    db.close()

