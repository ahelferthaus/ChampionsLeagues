# Champions — Youth Sports Team Management Platform

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![Live Demo](https://img.shields.io/badge/Live-championsleagues.lovable.app-00c896)](https://championsleagues.lovable.app)

**Champions** is an all-in-one platform for youth sports team management — handling finances, trip planning, scheduling, communication, and more so coaches and parents can focus on the game.

---

## 🏆 What It Does

Youth sports clubs manage thousands of teams that travel to tournaments across the country. Champions replaces the spreadsheets, Venmo requests, and group texts with a single platform:

- **💰 Financial Management** — Track expenses, split costs, collect payments via Stripe Connect
- **✈️ Trip Planning** — Coordinate travel logistics, itineraries, and RSVPs for tournaments
- **📅 Team Scheduling** — Manage practices, games, and tournaments with calendar sync
- **📋 Roster Management** — Player profiles, jersey numbers, positions, and parent/child relationships
- **📊 Attendance Tracking** — Track who shows up to practices and games
- **💬 Team Messaging** — In-app messaging with email notifications
- **📈 Player & Team Stats** — Goals, assists, cards, minutes played, and team standings
- **🎥 Video & Recruiting** — Video links and an AI-powered clip advisor for recruiting highlights
- **📁 Team Resources** — Shared links, documents, and pinned resources
- **🏢 Club Administration** — Multi-team club management with league hierarchies

## 🎯 Target Market

- **Youth Soccer**: ~6,000 clubs, 10,000+ travel-competitive teams (ECNL/ECRL, MLS NEXT, GA, etc.)
- **Multi-Sport**: Basketball (AAU), Baseball (Perfect Game), Hockey (AAA), Volleyball, Lacrosse, Swimming, and more
- **Users**: Club administrators, team managers/coaches, parents, and players

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Lovable Cloud (Supabase) — Auth, Database, Edge Functions, Storage |
| **Payments** | Stripe Connect Express |
| **AI** | Lovable AI (video clip advisor) |
| **State** | TanStack React Query |
| **Routing** | React Router v6 |

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui primitives
├── contexts/         # React context providers (TeamContext)
├── hooks/            # Custom hooks (auth, events, expenses, roster, etc.)
├── integrations/     # Supabase client & types
├── lib/              # Utilities, demo data, calendar export
├── pages/            # Route-level page components
└── assets/           # Static images

supabase/
├── functions/        # Edge functions (Stripe, email, AI)
├── migrations/       # Database migrations
└── config.toml       # Supabase configuration

public/
└── docs/             # Platform specification document
```

## 🗃️ Database Schema

Key tables: `clubs`, `teams`, `team_members`, `events`, `event_attendance`, `expenses`, `expense_shares`, `payments`, `trips`, `trip_itinerary`, `messages`, `player_stats`, `video_links`, `team_resources`, `child_profiles`, `profiles`, `seasons`, `leagues`

Role-based access with RLS policies using roles: `club_admin`, `team_manager`, `parent`, `player`

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📖 Documentation

A comprehensive platform specification (BRD, FRD, user stories, architecture, roadmap) is available at `/docs` in the running app, or directly at [`public/docs/Champions_Platform_Specification.md`](public/docs/Champions_Platform_Specification.md).

## 📊 Current Status

**Stage: MVP / Pre-Production**

| Module | Status |
|--------|--------|
| Authentication | ✅ Working |
| Club & Team Creation | ✅ Working |
| Expense Management (Stripe) | ✅ Working |
| Profile Management | ✅ Working |
| Schedule/Events | ⚠️ Partial |
| Roster Management | ⚠️ Partial |
| Trip Planning | ⚠️ Partial |
| Attendance Tracking | ⚠️ Partial |
| Messaging | ⚠️ Partial |
| Video/Recruiting | ⚠️ Partial |
| Player & Team Stats | ⚠️ Partial |

## 📄 License

Private — All rights reserved.
