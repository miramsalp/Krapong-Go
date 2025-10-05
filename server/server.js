const http = require("http");
const dotenv = require('dotenv');
const app = require("./app.js");
const connectDB = require('./config/db')
const { Server } = require("socket.io");
const initializeSocket = require('./config/socketHandler.js'); 
require('./config/redis');

dotenv.config({ path: './.env' });

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.set('socketio', io); 
initializeSocket(io);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
