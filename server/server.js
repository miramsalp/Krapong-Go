const http = require("http");
const dotenv = require('dotenv');
const app = require("./app.js");
const connectDB = require('./config/db')

dotenv.config({ path: './.env' });

connectDB();

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
