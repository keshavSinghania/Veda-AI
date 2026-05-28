# VedaAI — AI Assessment Generator

VedaAI is a full-stack AI-powered assessment generator that allows teachers to create structured question papers using AI.  
It uses background job processing with BullMQ, Redis, and real-time updates via WebSockets.

---

## Features

- Create AI-powered assignments
- Structured question generation (sections, marks, difficulty)
- Background processing using BullMQ
- Real-time progress updates (Socket.io)
- Download generated paper as PDF
- Clean structured AI output (not raw LLM response)

---

##System Architecture

Frontend (Next.js)
        ↓
Backend API (Express + TypeScript)
        ↓
BullMQ Queue System
        ↓
Redis (Upstash)
        ↓
Worker (AI Processing)
        ↓
MongoDB (Storage)
        ↓
Socket.io (Real-time updates)

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Zustand
- Socket.io-client

### Backend
- Node.js + Express
- TypeScript
- BullMQ
- Socket.io

### Database & Infra
- MongoDB Atlas
- Upstash Redis
- Vercel (Frontend)
- Render (Backend)

---

## How It Works

1. User creates assignment from frontend
2. Backend stores request in MongoDB
3. Job is pushed to BullMQ queue
4. Worker processes AI generation
5. Result is saved in database
6. Frontend receives real-time updates
7. User views or downloads final paper

---

## Setup Instructions

git clone https://github.com/keshavSinghania/VEDA-AI.git
cd vedaai

# install all dependencies
cd backend && npm install

cd ../frontend && npm install

# setup env files
backend/.env
frontend/.env

# run backend
cd backend && npm run dev

# run frontend (open new terminal)
cd frontend && npm run dev


<!-- Example of backend .env file -->
# SERVER
PORT=5000

# DATABASE (MongoDB)
MONGO_URL=your_mongodb_connection_string_here

# REDIS (BullMQ / Queue)
REDIS_URL=your_redis_url_here

# AI SERVICE (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# FRONTEND ORIGIN (CORS)
CLIENT_URL=http://localhost:3000

<!-- Example of frontend .env file -->
# BACKEND API URL
NEXT_PUBLIC_API_URL=http://localhost:5000