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

**DevOps:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:

```bash
    git clone https://github.com/miramsalp/Krapong-Go.git
    cd Krapong-Go
```

2. Create a `.env` file in the `server` directory with the following content:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://admin:password123@mongo:27017/myapp?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-and-long-jwt-secret
JWT_EXPIRES_IN=90d
```

3. Build and run the application using Docker Compose:

```bash
    docker-compose up --build
```

The application will be available at `http://localhost:3000`.