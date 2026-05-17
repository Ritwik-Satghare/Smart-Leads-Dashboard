# Smart Leads Dashboard

A modern, full-stack CRM dashboard application.

## Technologies

- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js, TypeScript, MongoDB
- **Containerization**: Docker, Docker Compose

## Docker Usage

You can start the entire MERN stack application using Docker Compose with a single command:

```bash
docker compose up --build
```

This will spin up:
- **Frontend** on http://localhost:5173
- **Backend API** on http://localhost:5000

To stop the services, run:
```bash
docker compose down
```

## Local Setup (Without Docker)

### Server
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
