
// API
const express = require('express');
const cors = require('cors');
const app = express();
// const luaRoutes = require('./routes/lua');
// const pythonRoutes = require('./routes/python');

// Configuration
require('dotenv').config();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/lua', luaRoutes);
// app.use('/python', pythonRoutes);

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Websocket
const ws_app = express();
const socket = require('socket.io');
const { socketConnection } = require('./socket/connection');

ws_app.use(cors());
ws_app.use(express());

const WS_PORT = process.env.WS_PORT || 8000;

const ws_server = ws_app.listen(WS_PORT, () => console.log(`Socket.io Server running on port ${WS_PORT}`));

const io = socket(ws_server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", socketConnection)
