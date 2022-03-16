const express = require('express');
const cors = require('cors');
const app = express();
const socket = require('socket.io');
const versionRoutes = require('./routes/version');
const { handleConnection } = require('./socket/connection');

// Configuration
require('dotenv').config();
const PORT = process.env.PORT || 8090;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/version', versionRoutes);

// Listen
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", handleConnection);