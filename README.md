🚀 Veyora Backend

This repository contains the backend server for Veyora, an AI-powered travel planning platform.
It handles authentication, user management, trip planning, and AI-based itinerary generation through RESTful APIs.

🔧 Tech Stack
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
REST API

✨ Features
User registration & login (JWT-based authentication)
Secure protected routes
Trip creation & management
AI-powered itinerary generation
Modular MVC architecture
Environment-based configuration

📁 Project Structure
backend/
│── models/        # MongoDB schemas
│── routes/        # API routes
│── server.js      # Main server file
│── package.json   # Dependencies
│── .gitignore     # Ignored files

⚙️ Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3001


⚠️ The .env file is ignored from version control for security reasons.

▶️ Run Locally
1️⃣ Clone the repository
git clone https://github.com/yourusername/veyora-backend.git

2️⃣ Install dependencies
npm install

3️⃣ Start the server
node server.js


The server will run on:
http://localhost:3001

🔗 API Endpoints (Sample)
POST /api/auth/register
POST /api/auth/login
POST /api/trips
GET /api/itinerary

🚀 Future Enhancements

Email verification
Password reset functionality
Role-based access control

Deployment with Docker

👩‍💻 Author

Aastha Dua
B.Tech CSE Student
