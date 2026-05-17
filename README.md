# Smart Leads Dashboard 🚀

A polished, production-ready full-stack CRM SaaS platform designed for high-performance lead management and real-time analytics. Built with the MERN stack, this application features robust JWT authentication, role-based access control, real-time Socket.io events, advanced MongoDB aggregation pipelines, and a stunning, responsive TailwindCSS UI.

---

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based auth with HTTP Bearer tokens, protected routing, and automatic session expiration handling.
- **📊 Real-time Analytics**: Live dashboard metrics powered by complex MongoDB aggregation pipelines and `Recharts`. Updates instantaneously via `Socket.io`.
- **👥 Advanced Lead Management**: Full CRUD capabilities with advanced filtering, searching, sorting, and cursor-based pagination.
- **📥 CSV Export**: Seamlessly export filtered lead data into CSV format directly from the dashboard.
- **🎨 Modern UI/UX**: State-of-the-art dark/light mode UI built with TailwindCSS, featuring smooth micro-animations, loading skeletons, and polished empty states.
- **🛡️ Edge Case Handling**: Comprehensive error catching, friendly toast notifications (`react-hot-toast`), and custom 404 fallback pages.
- **📖 API Documentation**: Auto-generated interactive OpenAPI/Swagger documentation (`/api-docs`).

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- TypeScript
- TailwindCSS (Styling & Design System)
- React Query (Server State Management)
- Recharts (Data Visualization)
- React Hook Form + Yup (Validation)

**Backend**
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- Socket.io (Realtime Events)
- Swagger / OpenAPI (API Docs)

**DevOps & Infrastructure**
- Docker & Docker Compose
- Nodemon & TSX (Hot Reloading)
- ESLint (Strict Code Quality)

---

## 📁 Architecture & Folder Structure

The project follows a clean, decoupled client-server architecture. The backend uses a layered Controller-Service-Route pattern to maintain separation of concerns.

```text
📦 Smart-Leads-ServiceHive
├── 📂 frontend                  # React SPA
│   ├── 📂 src
│   │   ├── 📂 components        # Reusable UI elements & AuthGuards
│   │   ├── 📂 context           # Auth, Theme, & Socket providers
│   │   ├── 📂 layouts           # Dashboard shell & navigation
│   │   ├── 📂 pages             # Route-level components
│   │   └── 📂 services          # Axios API interceptors & React Query
│   └── vercel.json              # Vercel deployment config
└── 📂 server                    # Express API
    ├── 📂 src
    │   ├── 📂 controllers       # Request handling logic
    │   ├── 📂 middleware        # JWT verification, Error handling
    │   ├── 📂 models            # Mongoose schemas
    │   ├── 📂 routes            # Express routers & Swagger JSDoc
    │   ├── 📂 services          # Core business logic & aggregations
    │   └── server.ts            # Application entry point
    └── Dockerfile               # Container definition
```

---

## 🚀 Local Development Setup

### 1. Environment Variables

Create `.env` files in both the `frontend` and `server` directories.

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smartleads
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Run with Docker (Recommended)

Start the entire MERN stack using Docker Compose:

```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 3. Run Manually (Without Docker)

**Backend**
```bash
cd server
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 API Documentation

The backend features fully interactive Swagger documentation. Once the server is running, visit:
👉 `http://localhost:5000/api-docs`

This interface allows you to view request/response schemas, authenticate using your JWT Bearer token, and test the API directly from the browser.

---

## 🌍 Deployment Instructions

The application is configured and ready for production deployment.

### Frontend (Vercel)
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the Root Directory to `frontend`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend.
5. Deploy. (The included `vercel.json` automatically handles SPA routing).

### Backend (Render / Railway)
1. Connect your repository to Render/Railway.
2. Set the Root Directory to `server`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`
5. Add all required environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
6. Deploy.

---

## 🔮 Future Improvements

- **OAuth Integration**: Add Google/GitHub SSO for frictionless onboarding.
- **Advanced Role Permissions**: Expand beyond Admin/User to custom granular permission sets.
- **Email Service**: Integrate SendGrid or Resend for lead status notifications and password resets.
- **E2E Testing**: Implement Cypress or Playwright for automated end-to-end testing flows.

---
*Developed for internship evaluation and technical demonstration.*
