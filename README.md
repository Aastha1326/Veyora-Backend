
---

# 📘 README for Backend (`veyora-backend`)

# 🌍 Veyora – Backend

This is the backend of Veyora, a full-stack travel itinerary generator application.

---

## 🚀 Live API
👉 (https://veyora-backend-1.onrender.com)

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- LangChain / Gemini API

---

## ✨ Features
- User Authentication (Register/Login)
- Secure password handling
- Travel itinerary generation API
- Integration with AI APIs
- RESTful API structure

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/veyora-backend.git
cd veyora-backend
```

2. Install Dependencies
   npm install

3.Create .env file
 MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
UNSPLASH_ACCESS_KEY=your_key

4.Run Server
  node server.js


📡 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
Itinerary
POST /api/itinerary
🔐 Security Note
Never commit .env file
Keep API keys secure
📌 Future Improvements
Rate limiting
Better error handling
API optimization
👩‍💻 Author

Aastha Dua
