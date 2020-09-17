const socketIo = require('socket.io');
const messageService = require('../services/message.service');

const socketConfig = require('../config');

let roomId;
let author;

const rooms = {};
const roomsCreatedAt = new WeakMap();
const authors = new WeakMap();

function init(http) {
  if (!http) {
    console.warn('Http is not provided for socket');
  }
  const io = socketIo(http, socketConfig);
  io.on('connection', (socket) => {
    socket.on('join', (_roomId, _name, callback) => {
      if (!_roomId || !_name) {
        if (callback) {
          callback('roomId and name params required');
        }
        console.warn(`${socket.id} attempting to connect without roomId or name`, { roomId, author });
        return;
      }

      roomId = _roomId;
      author = _name;

      if (rooms[roomId]) {
        rooms[roomId][socket.id] = socket;
      } else {
        rooms[roomId] = { [socket.id]: socket };
        roomsCreatedAt.set(rooms[roomId], new Date());
      }
      socket.join(roomId);

      authors.set(socket, author);

      io.to(roomId).emit('system message', `${author} joined ${roomId}`);

      if (callback) {
        callback(null, { success: true });
      }
    });

    socket.on('chat message', (text) => {
      messageService
        .save({ text, roomId, author, })
        .then((savedData) => {
          console.log(savedData);
          io.to(roomId).emit('chat message', text, author);
        });
    });

    socket.on('disconnect', () => {
      io.to(roomId).emit('system message', `${author} left ${roomId}`);

      if (rooms[roomId] && rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
      }

      const room = rooms[roomId];
      if (room && !Object.keys(room).length) {
        delete rooms[roomId];
      }
    });
  });
}

module.exports = {
  init,
  authors,
  rooms,
  roomsCreatedAt,
};
