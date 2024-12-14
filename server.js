const express = require('express');
const cors = require('cors');
const { Server } = require('ws'); 
const http = require('http');
const contractRoutes = require('./routes/contracts');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.use(cors());
app.use(express.json());

// WebSocket connection handling
// When a client connects via WebSocket, we set up event handlers
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const broadcastUpdate = (type, data) => {
  wss.clients.forEach((client) => {

    console.log("Inside server.js broadcastUpdate, type", type);
    console.log("Inside server.js broadcastUpdate, data", data);
    // Only send to clients that are still connected
    if (client.readyState === WebSocket.OPEN) {
      // Send stringified message with type and data
      client.send(JSON.stringify({ type, data }));
    }
  });
};

app.set('broadcastUpdate', broadcastUpdate);

// Set up contract REST API routes
app.use('/api/contracts', contractRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 