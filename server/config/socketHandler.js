const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('joinRoute', (routeId) => {
            socket.join(routeId);
            console.log(`User ${socket.id} joined room ${routeId}`);
        });
        
        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
        });
    });
};

module.exports = initializeSocket;