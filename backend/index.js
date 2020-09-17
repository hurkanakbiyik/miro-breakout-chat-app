const express = require('express');

const app = express();
const cors = require('cors');
const http = require('http').Server(app);

const database = require('./database');
const webSocket = require('./webSocket');
const messageRoute = require('./routes/message.route');

const port = process.env.PORT || 8081;

app.use(cors());

app.get('/rooms/:roomId', (req, res) => {
  const { roomId: roomIdParam } = req.params;
  const room = webSocket.rooms[roomIdParam];

  if (room) {
    res.json({
      createdAt: webSocket.roomsCreatedAt.get(room),
      users: Object.values(room).map((socket) => webSocket.authors.get(socket)),
    });
  } else {
    res.status(500).end();
  }
});

app.get('/rooms', (req, res) => {
  res.json(Object.keys(webSocket.rooms));
});

app.use('/messages', messageRoute);

database.init();
webSocket.init(http);

http.listen(port, '0.0.0.0', () => {
  console.info(`Backend server is up, listening on *:${port}`);
});
