# AgriTech — Smart Farming Management System

A full-stack MERN capstone project for farmers, with JWT authentication, farm and crop management, weather forecasts, rule-based soil health guidance, pest alerts, resource ordering, expert consultation/community posts, and an admin dashboard.

## Stack
- Frontend: React + Vite, React Router, Axios, Bootstrap
- Backend: Node.js, Express, MongoDB + Mongoose
- Security: JWT, bcryptjs, role-based middleware, validation, Helmet, rate limiting
- Weather: Open-Meteo API (no API key required)
- Tests/API exploration: health endpoint and included Postman collection

## Requirements
- Node.js 18+ and npm
- MongoDB local or MongoDB Atlas connection string

## Run locally

### 1. Configure backend
```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.

### 2. Install and start API
```bash
npm install
npm run seed:admin
npm run dev
```
API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`

The optional seed creates an admin only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are configured in `.env`.

### 3. Install and start frontend (new terminal)
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Demo workflow
1. Register a farmer account and log in.
2. Create a farm with a location and optional coordinates.
3. Add crops to that farm and update their stage/planting date.
4. Open Weather to load a forecast for entered coordinates (default coordinates are for Bhopal; replace with your farm's coordinates).
5. Add soil readings to receive a simple rule-based soil guidance summary. This is informational, not a laboratory diagnosis.
6. Review pest alerts; create an expert consultation request or community post.
7. Browse resources and place an order.
8. To demonstrate role-based access, log in using the admin account created by `npm run seed:admin`.

## Important implementation notes
- Weather data is fetched live from Open-Meteo. If the network/API is unavailable, the UI displays a helpful error instead of fabricating live data.
- Pest alerts and soil guidance are rule-based demo features, not agronomic guarantees. Farmers should confirm treatment decisions with a qualified local agricultural expert.
- Multilingual UI currently includes English and Hindi interface labels for the main navigation and key actions. Expand translations before production.
- Orders are recorded as demo orders; no real payment processing is implemented.
- For deployment, use HTTPS, set production secrets, restrict CORS, configure managed MongoDB backups, and review privacy/security before using real farmer data.

## Project structure
```text
agritech-capstone/
  client/       React/Vite frontend
  server/       Express/Mongoose API
  docs/         API and demo notes
```

## GitHub
Create an empty repository on GitHub, then from this folder:
```bash
git init
git add .
git commit -m "Build AgriTech smart farming capstone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```
Never commit `.env` files or real credentials.

## Demo video checklist
- Introduce the problem and intended users.
- Show registration/login and role separation.
- Demonstrate farm/crop CRUD.
- Show live weather, soil guidance and pest alerts.
- Demonstrate resource ordering, consultation/community and admin dashboard.
- End with the architecture/tech stack and GitHub repository.
