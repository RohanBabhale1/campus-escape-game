# 🎮 ClubVerse — 3D Campus Escape Room Game

> **An immersive 3D campus exploration and escape room puzzle game built for IIIT Dharwad.**
> Walk around a fully rendered campus, interact with buildings, play mini-games, and solve 8 unique club-themed escape room puzzles!

---

- http://13.50.232.119:3000/    ---->Deployed on AWS

## 🌟 Overview

ClubVerse combines a **3D open-world campus hub** with a **neon-themed escape room** experience. Players explore a faithful recreation of the IIIT Dharwad campus, interact with buildings to learn about departments, faculty, and clubs, then enter the **Escape Room** to solve puzzles themed around 8 different student clubs.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏫 **3D Campus Hub** | Walk around a fully modeled IIIT Dharwad campus with buildings, monuments, sports fields, and more |
| 🧩 **8 Escape Room Puzzles** | Each room is themed after a real student club — Dynamight, E-Cell, Hertz 440, InQuizitive, IRIS, Return 0, Technosys, Velocity |
| 🏏 **Mini-Games** | Play Cricket and Football mini-games right on the campus grounds |
| 💬 **Real-Time Chat** | Global chat system powered by Socket.IO — supports up to 1000 messages with automatic cleanup |
| 🏆 **Leaderboard** | Compete for the fastest escape times and highest scores |
| 🔐 **Authentication** | Secure JWT-based login/register system |
| 📱 **Responsive** | Works on both desktop and mobile with on-screen joystick controls |
| 🎨 **Neon Pixel UI** | Stunning retro-futuristic UI with glassmorphism, neon glows, and pixel fonts |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    🖥️  Frontend                         │
│            React + Three.js + Vite                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │ 3D Campus│  │ Escape   │  │   UI Components    │    │
│  │   Hub    │  │  Rooms   │  │ HUD, Chat, Puzzles │    │
│  └──────────┘  └──────────┘  └────────────────────┘    │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API + WebSocket
┌───────────────────────┴─────────────────────────────────┐
│                    ⚙️  Backend                          │
│          Node.js + Express + Socket.IO                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │   Auth   │  │  Game    │  │   Leaderboard      │    │
│  │   JWT    │  │ Sessions │  │   Rankings          │    │
│  └──────────┘  └──────────┘  └────────────────────┘    │
└───────────┬──────────────────────────┬──────────────────┘
            │                          │
   ┌────────┴────────┐       ┌────────┴────────┐
   │  🐘 PostgreSQL  │       │   🔴 Redis      │
   │   Game Data     │       │   Cache Layer   │
   └─────────────────┘       └─────────────────┘
```

---

## 📂 Project Structure

```
final/
├── 🐳 docker-compose.yml          # Development orchestration
├── 🐳 docker-compose.prod.yml     # Production orchestration
├── 📄 README.md                    # You are here!
│
├── ⚙️ backend/                     # Node.js API Server
│   ├── server.js                   # Express + Socket.IO entry point
│   ├── Dockerfile                  # Backend container
│   ├── package.json
│   ├── migrations/
│   │   └── init.sql                # Database schema
│   └── src/
│       ├── config/
│       │   ├── db.js               # PostgreSQL pool (with retry logic)
│       │   ├── redis.js            # Redis client
│       │   └── env.js              # Environment validation
│       ├── controllers/
│       │   ├── authController.js   # Register, Login, GetMe
│       │   ├── gameController.js   # Sessions, Progress, Restart
│       │   ├── roomController.js   # Room completion, Unlocking
│       │   └── leaderboardController.js
│       ├── middleware/
│       │   ├── authMiddleware.js   # JWT verification
│       │   └── errorHandler.js     # Global error handler
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── gameRoutes.js
│       │   ├── roomRoutes.js
│       │   └── leaderboardRoutes.js
│       └── services/
│           └── jwtService.js       # Token generation/verification
│
└── 🎨 frontend/                    # React + Vite App
    ├── Dockerfile                  # Frontend container
    ├── vite.config.js              # Build config with code-splitting
    ├── package.json
    ├── index.html
    ├── public/
    │   └── models/                 # 3D character models (.glb)
    └── src/
        ├── App.jsx                 # Router + Protected Routes
        ├── main.jsx                # Entry point
        ├── index.css               # Global neon/pixel theme
        ├── store/
        │   └── useGameStore.js     # Zustand global state
        ├── services/
        │   └── api.js              # Axios API client
        ├── pages/
        │   ├── LoginPage.jsx       # Auth page
        │   ├── GamePage.jsx        # Escape room wrapper
        │   └── CampusHub.jsx       # 3D campus entry page
        ├── hub/                    # 🏫 Campus Hub Module
        │   ├── game3d/
        │   │   └── Scene.jsx       # Three.js campus renderer
        │   └── components/
        │       ├── GameCanvas3D.jsx # Canvas + objective modals
        │       ├── Chat.jsx        # Real-time global chat
        │       ├── ClubDetails.jsx # Tech & Cultural club info
        │       ├── FacultyDetails.jsx
        │       ├── DirectorDetails.jsx
        │       ├── BoardDetails.jsx
        │       ├── StaffDetails.jsx
        │       ├── CricketGame.jsx # 🏏 Cricket mini-game
        │       ├── FootballGame.jsx# ⚽ Football mini-game
        │       └── MobileJoystick.jsx
        └── components/
            ├── game/               # 🧩 Escape Room 3D Engine
            │   ├── GameScene.jsx   # R3F canvas + physics
            │   ├── Lobby.jsx       # Room selection lobby
            │   ├── Player.jsx      # First-person controller
            │   └── rooms/          # Individual room scenes
            ├── puzzles/            # 🧠 Puzzle Components
            │   ├── DynamightPuzzle.jsx
            │   ├── ECellPuzzle.jsx
            │   ├── Hertz440Puzzle.jsx
            │   ├── InQuizitivePuzzle.jsx
            │   ├── IRISPuzzle.jsx
            │   ├── Return0Puzzle.jsx
            │   ├── TechnosysPuzzle.jsx
            │   ├── VelocityPuzzle.jsx
            │   └── FinalPuzzle.jsx
            └── ui/                 # 🎨 HUD & Overlays
                ├── HUD.jsx
                ├── Inventory.jsx
                ├── PauseMenu.jsx
                ├── ControlsOverlay.jsx
                └── InteractionPrompt.jsx
```

---

## 🚀 Quick Start

### Prerequisites

- 🐳 [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
- 📦 [Node.js 18+](https://nodejs.org/) (only for local dev without Docker)

### 🐳 Run with Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd final

# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker compose up -d --build

# 🎮 Open in browser
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# Health:   http://localhost:5000/health
```

### 🛑 Stop Everything

```bash
docker compose down --remove-orphans
```

### 🔄 Rebuild After Code Changes

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

---

## 🎮 How to Play

### 🏫 Campus Hub

1. **Register/Login** — Create an account to start your journey
2. **Explore** — Use `W` `A` `S` `D` keys to walk around the campus
3. **Sprint** — Hold `Shift` to run faster
4. **Interact** — Press `E` near buildings to open info panels
5. **Camera** — Click and drag to rotate the camera view
6. **Chat** — Use the chat panel (bottom-right) to talk with other players
7. **Mini-Games** — Walk to the Cricket/Football fields and press `E` to play!

### 🧩 Escape Room

1. Walk to **E-Block** and press `E` → Click **"Enter Console"** → **Play**
2. You'll enter a neon-lit lobby with **8 club-themed doors**
3. Walk up to any door and press `E` to enter
4. **Solve the puzzle** inside each room to earn a key 🔑
5. Collect all **8 keys** to complete the game!
6. Press `Escape` to pause — you can **Restart** or **Return to Campus**

### 🎯 Building Interactions

| Building | What You'll Find |
|----------|-----------------|
| 🏛️ **PI / M Block** | Director info, Board of Governors, Placements, AIMS Portal, Staff details |
| 🏢 **E-Block** | Faculty details, Tech/Cultural clubs, Escape Room entry |
| ☕ **Chai Tapri** | Campus chai menu with prices |
| 🧃 **Juice Tapri** | Fresh juice menu |
| 🏋️ **H-Block** | Gym, Music Room, Dance Room, Canteen |
| 🏢 **G-Block** | Building capacity info |
| 🏢 **B-Block** | Hostel info |
| 🏏 **Cricket Ground** | Playable cricket mini-game |
| ⚽ **Football Ground** | Playable football mini-game |
| 🖼️ **Gallery** | Campus photo gallery |

---

## 🧩 The 8 Escape Room Clubs

| # | Club | Puzzle Type |
|---|------|-------------|
| 1 | 💥 **Dynamight** | Physics-based challenge |
| 2 | 💡 **E-Cell** | Entrepreneurship quiz |
| 3 | 🎵 **Hertz 440** | Music/frequency puzzle |
| 4 | ❓ **InQuizitive** | Trivia challenge |
| 5 | 👁️ **IRIS** | Pattern recognition |
| 6 | 💻 **Return 0** | Coding/logic puzzle |
| 7 | ⚙️ **Technosys** | Tech challenge |
| 8 | 🏎️ **Velocity** | Speed-based puzzle |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| ⚛️ **React 18** | UI framework |
| 🎨 **Three.js** | 3D campus rendering |
| 🎮 **React Three Fiber** | React bindings for Three.js |
| 🧊 **React Three Rapier** | Physics engine for escape rooms |
| 🔄 **Zustand** | Lightweight state management |
| 🛣️ **React Router v6** | Client-side routing |
| 📡 **Axios** | HTTP client |
| 💬 **Socket.IO Client** | Real-time chat |
| 🎉 **React Confetti** | Victory celebration effects |
| ⚡ **Vite** | Build tool with HMR |
| 🎨 **Tailwind CSS** | Utility-first styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| 🟢 **Node.js** | Runtime |
| 🚂 **Express** | HTTP framework |
| 💬 **Socket.IO** | WebSocket server for chat |
| 🐘 **PostgreSQL 15** | Primary database |
| 🔴 **Redis 7** | Caching layer |
| 🔐 **JWT** | Authentication tokens |
| 🛡️ **Helmet** | Security headers |
| 🚦 **Rate Limiting** | API protection |
| 🔒 **bcrypt** | Password hashing |

### DevOps
| Technology | Purpose |
|-----------|---------|
| 🐳 **Docker** | Containerization |
| 🐙 **Docker Compose** | Multi-service orchestration |
| 🔁 **Nodemon** | Backend hot-reload |
| ⚡ **Vite HMR** | Frontend hot-reload |

---

## 🔧 Environment Variables

The Docker Compose file auto-configures everything. For manual setup:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `DATABASE_URL` | `postgresql://escape_user:escape_pass@postgres:5432/escape_room_db` | PostgreSQL connection |
| `REDIS_URL` | `redis://redis:6379` | Redis connection |
| `JWT_SECRET` | `dev_secret_change_in_production_please_32chars` | JWT signing key |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |
| `VITE_API_URL` | `http://localhost:5000/api` | Frontend API base URL |

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login & get JWT |
| `GET` | `/api/auth/me` | Verify current user |

### 🎮 Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/game/session` | Get or create active session |
| `POST` | `/api/game/session/restart` | Reset game progress |
| `GET` | `/api/game/progress` | Get room progress |
| `PUT` | `/api/game/progress/puzzle` | Save puzzle state |

### 🚪 Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rooms` | List all rooms with progress |
| `POST` | `/api/rooms/:slug/complete` | Mark room as completed |
| `POST` | `/api/rooms/:slug/attempt` | Track attempt |

### 🏆 Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leaderboard` | Get top 50 scores |
| `POST` | `/api/leaderboard` | Submit score |
| `GET` | `/api/leaderboard/me` | Get your rank |

### 💬 WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `initialMessages` | Server → Client | Send last 1000 messages on connect |
| `chatMessage` | Client → Server | Send a new message |
| `message` | Server → All | Broadcast new message |

---

## 🎨 Design System

The UI uses a custom **"Neon Pixel"** design system:

- 🟡 **Neon Yellow** `#FFE066` — Primary accent, objectives, highlights
- 🔵 **Neon Cyan** `#00F5FF` — Secondary accent, buttons, links
- 🟣 **Neon Magenta** `#FF00FF` — Tertiary accent, borders, alerts
- ⚫ **Void Black** `#0A0A0F` — Background
- 🔤 **Pixel Font** — `"Press Start 2P"` from Google Fonts
- 🪟 **Glassmorphism** — Frosted glass panels with backdrop blur

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 🔴 `ERR_EMPTY_RESPONSE` on login | Backend crashed — run `docker compose restart backend` |
| 🔴 PostgreSQL connection timeout | The DB config has retry logic (5 attempts). Just restart: `docker compose restart backend` |
| 🔴 Chat says "Connecting..." | Ensure backend is running. Socket.IO connects on port 5000 |
| 🟡 Score shows beyond 8/8 | Fixed — score is capped at 8/8 display |
| 🟡 Congratulations popup appears early | Fixed — only triggers at exactly 8/8 completion |
| 🟡 Robot moves while typing | Fixed — movement keys are disabled when focused on input fields |

---

## 👥 Controls Reference

### ⌨️ Keyboard
| Key | Action |
|-----|--------|
| `W` `A` `S` `D` | Move character |
| `Shift` | Sprint |
| `E` | Interact with buildings/doors |
| `Escape` | Pause game (in escape room) |
| `Mouse Drag` | Rotate camera |
| `Scroll` | Zoom in/out |

### 📱 Mobile
| Control | Action |
|---------|--------|
| Left Joystick | Move character |
| Tap | Interact |

---

## 📄 License

This project was built for **IIIT Dharwad** as an interactive campus tour and gamified orientation experience.

---

<div align="center">

### 🎮 Built with ❤️ for IIIT Dharwad

**Explore. Solve. Escape.**

</div>
