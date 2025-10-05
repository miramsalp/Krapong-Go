const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Ping = require('../models/Ping');
const redisClient = require('../config/redis'); 


const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('authenticate', async ({ token }) => {
            try {
                const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
                const userId = decoded.id;
                
                await redisClient.set(socket.id, userId, { EX: 1800 });
                console.log(`User ${userId} authenticated with socket ${socket.id}`);

            } catch (err) {
                console.log(`Socket authentication failed for ${socket.id}:`, err.message);
            }
        });

        socket.on('joinRoute', (routeId) => {
            socket.join(routeId);
            console.log(`User ${socket.id} joined room ${routeId}`);
        });

        socket.on('disconnect', async () => {
            console.log(`User Disconnected: ${socket.id}`);
            
            try {
                const userId = await redisClient.get(socket.id);

                if (userId) {
                    const deletedPing = await Ping.findOneAndDelete({ passengerId: userId });
                    
                    if (deletedPing) {
                        console.log(`Cleared ping for disconnected user: ${userId}`);
                        io.to(deletedPing.routeId.toString()).emit('pingRemoved', { pingId: deletedPing._id });
                    }
                    
                    await redisClient.del(socket.id);
                }
            } catch (err) {
                console.error('Error handling disconnect:', err);
            }
        });
    });
};

module.exports = initializeSocket;