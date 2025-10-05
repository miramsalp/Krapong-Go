# Krapong-Go
This project allows passengers to view live vehicle locations, while enabling drivers to see passenger locations and manage their own status updates on the map.

<table>
  <tr>
    <td align="center">
      <p><strong>Login & Authentication</strong></p>
      <img src="./docs/images/mockup_login.png" alt="Login Screen Mockup" width="350"/>
    </td>
    <td align="center">
      <p><strong>Real-time Tracking Map</strong></p>
      <img src="./docs/images/mockup_mainpage.png" alt="Passenger Menu Mockup" width="350"/>
    </td>
  </tr>
</table>

## Features

- User Authentication
- Real-time Tracking
- Passenger Actions
- Driver Actions
- Mobile-First UI

## Tech Stack

**Client:** React, React Router, Leaflet, Axios, Socket.IO Client

**Server:** Node.js, Express.js, MongoDB (Mongoose), Socket.IO, Redis, JSON Web Token (JWT)

**DevOps:** Docker (for running Redis) 

## Installation

### Clone the repository

```bash
    git clone https://github.com/miramsalp/Krapong-Go.git
    cd Krapong-Go
```

### Backend Setup

```bash
    cd server
    npm install
    # set up .env in server folder example is below
    # set up docker somewhere you need redis to be running
    docker run -d -p 6379:6379 --name krapong-redis redis
    npm run dev
```
The backend server will be running at http://localhost:5000

### .env (backend)
```bash
    PORT=5000
    NODE_ENV=development

    # MongoDB Connection String
    MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?
    retryWrites=true&w=majority

    TEST_MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/TEST_myFirstDatabase?
    retryWrites=true&w=majority

    # JWT
    JWT_SECRET=supersecretandverylongstringforsecurity
    JWT_EXPIRES_IN=90d
```

### Frontend Setup

```bash
    cd client
    npm install
    # set up .env for frontend example below
    npm run dev
```
### .env (frontend)

```bash
    # Environment variables for the client application
    VITE_API_BASE_URL=http://localhost:5000
```

The frontend application will be available at http://localhost:5173




