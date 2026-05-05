# Whack-a-Mole — ASP.NET Core 9 MVC

A browser-based Whack-a-Mole game built with ASP.NET Core 9 MVC and Bootstrap 5.

## Features
- 3x3 mole grid with random spawning
- 3 difficulty levels (Easy / Medium / Hard)
- Level progression — speeds up every 10 whacks
- Bomb moles that deduct points
- Score popups on each hit
- Session-based leaderboard (top 10 scores)
- Game Over modal with name entry and rank display
- Fully responsive with Bootstrap 5

## Tech Stack
- **Framework**: ASP.NET Core 9 MVC
- **Session**: ASP.NET Core Session (leaderboard storage)
- **UI**: Bootstrap 5.3 + Bootstrap Icons (CDN)
- **Game Logic**: Vanilla JavaScript

## Run Locally

```bash
cd WhackAMole
"C:\Program Files\dotnet\dotnet.exe" run
```

Open: **http://localhost:5000**

## Resume Bullet Points
- Built a browser-based game using ASP.NET Core 9 MVC with server-side session management for a real-time leaderboard
- Implemented game logic in JavaScript with dynamic difficulty scaling, level progression, and animated UI feedback
- Used Bootstrap 5 for a fully responsive layout with modals, cards, and custom CSS animations
