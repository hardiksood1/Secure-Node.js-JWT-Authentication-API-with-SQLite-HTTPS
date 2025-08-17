import streamlit as st
import jwt
import json
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# ================= Config =================
load_dotenv()  # Load environment variables from .env
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

USERS_FILE = os.path.join(DATA_DIR, "users.json")
TOKEN_FILE = os.path.join(DATA_DIR, "session_token.enc")

SECRET_KEY = os.getenv("SECRET_KEY", "1234")
FERNET_KEY = os.getenv("FERNET_KEY", Fernet.generate_key().decode())
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("TOKEN_EXPIRE_SECONDS", 900))

fernet = Fernet(FERNET_KEY.encode())

# ================= File Helpers =================
def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    else:
        with open(USERS_FILE, "w") as f:
            json.dump({}, f)
        return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def save_token_encrypted(token: str):
    encrypted = fernet.encrypt(token.encode())
    with open(TOKEN_FILE, "wb") as f:
        f.write(encrypted)

def load_token_encrypted():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            encrypted = f.read()
        try:
            return fernet.decrypt(encrypted).decode()
        except:
            return None
    return None

def delete_token_file():
    if os.path.exists(TOKEN_FILE):
        os.remove(TOKEN_FILE)

# ================= Auth Utils =================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    users = load_users()
    user = users.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_SECONDS):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.PyJWTError:
        return "Invalid token"

# ================= Streamlit UI =================
st.set_page_config(page_title="Secure JWT Auth", page_icon="🔐")
st.title("🔐 Industry-Style JWT Authentication")

menu = st.sidebar.radio(
    "Navigation",
    ["Add User", "Update Password", "Login", "Protected Route", "Logout"]
)

# ---------- Add User ----------
if menu == "Add User":
    st.subheader("Add New User (Admin Only)")
    username = st.text_input("Username", key="add_username")
    password = st.text_input("Password", type="password", key="add_password")
    secret_key_input = st.text_input("Admin Secret Key", type="password", key="add_secret")

    if st.button("Save User"):
        if username and password and secret_key_input:
            if secret_key_input != SECRET_KEY:
                st.error("Admin Secret Key does not match! User not added.")
            else:
                users = load_users()
                if username in users:
                    st.error("User already exists!")
                else:
                    hashed_pw = pwd_context.hash(password)
                    users[username] = {"username": username, "hashed_password": hashed_pw}
                    save_users(users)
                    st.success(f"User '{username}' added successfully!")
        else:
            st.error("Please fill all fields.")

# ---------- Update Password ----------
elif menu == "Update Password":
    st.subheader("Update User Password (Admin Only)")
    username = st.text_input("Username", key="update_username")
    new_password = st.text_input("New Password", type="password", key="update_password")
    secret_key_input = st.text_input("Admin Secret Key", type="password", key="update_secret")

    if st.button("Update Password"):
        if username and new_password and secret_key_input:
            if secret_key_input != SECRET_KEY:
                st.error("Admin Secret Key does not match! Cannot update password.")
            else:
                users = load_users()
                if username not in users:
                    st.error("User does not exist!")
                else:
                    hashed_pw = pwd_context.hash(new_password)
                    users[username]["hashed_password"] = hashed_pw
                    save_users(users)
                    st.success(f"Password for user '{username}' updated successfully!")
        else:
            st.error("Please fill all fields.")

# ---------- Login ----------
elif menu == "Login":
    st.subheader("User Login")
    username = st.text_input("Username", key="login_username")
    password = st.text_input("Password", type="password", key="login_password")

    if st.button("Login"):
        user = authenticate_user(username, password)
        if user:
            token = create_access_token(data={"sub": username})
            save_token_encrypted(token)
            st.session_state["jwt_token"] = token
            st.success("Login successful!")
            st.code(token, language="text")
        else:
            st.error("Invalid username or password.")

# ---------- Protected Route ----------
elif menu == "Protected Route":
    st.subheader("Protected API Simulation")
    
    token = st.session_state.get("jwt_token") or load_token_encrypted()

    if token:
        result = decode_token(token)
        if isinstance(result, dict):
            st.success(f"✅ Hello {result['sub']}, you are authenticated!")
        else:
            st.error(result)
    else:
        st.error("No active session. Please log in.")

# ---------- Logout ----------
elif menu == "Logout":
    delete_token_file()
    st.session_state.pop("jwt_token", None)
    st.success("You have been logged out successfully!")
