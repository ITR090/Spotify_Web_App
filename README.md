

# 🎧 Fullstack Spotify Integration App

This project is a fullstack web application that integrates the **Spotify API** to provide music search and more features. It is built with a **React** frontend and an **Express.js (Node.js)** backend.

---

## 📌 Features

- 🔍 Search for tracks, artists, and albums using Spotify API
- ▶️ Play previews of tracks 
- ❤️ Manage playlist
- 🌐 Responsive UI with reusable components

---

## 🧠 Tech Stack

### Frontend

- **React**
- **React Hooks** (`useState`, `useEffect`, etc.)
- **React Router DOM**
- **React Context API**
- **Reusable UI Components**
- **Axios** (for API calls)

### Backend

- **Node.js**
- **Express**
- **Spotify Web API**
- **dotenv** for environment variables

---

## 🔑 Spotify API Integration

The app uses Spotify's **Authorization Code Flow** to authenticate and fetch access tokens from the Spotify API.

You must register your app on the [Spotify Developer Portal] to get:

- `Client ID`
- `Client Secret`

---

## 🔧 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/ITR090/spotify_web_app.git
cd spotify-react-node-app
```

2. **Setup backend**

```
cd backend
npm install
```
---
**Create a .env file**
```
NODE_ENV
PORT
CLIENT_ID
CLIENT_SECRET
REDIRECT_URI
AUTHORIZATION 
FRONTEND_URI
```
---
**Then run**
```
npm start
```
---

3. Setup frontend (on root folder)
```
npm install
npm start
```
