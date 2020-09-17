const socketIo = require('socket.io');
const messageService = require('../services/message.service');

const socketConfig = require('../config');

let roomId;
let name;

const rooms = {};
const roomsCreatedAt = new WeakMap();
const names = new WeakMap();

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
        console.warn(`${socket.id} attempting to connect without roomId or name`, { roomId, name });
        return;
      }

      roomId = _roomId;
      name = _name;

      if (rooms[roomId]) {
        rooms[roomId][socket.id] = socket;
      } else {
        rooms[roomId] = { [socket.id]: socket };
        roomsCreatedAt.set(rooms[roomId], new Date());
      }
      socket.join(roomId);

      names.set(socket, name);

      io.to(roomId).emit('system message', `${name} joined ${roomId}`);

      if (callback) {
        callback(null, { success: true });
      }
    });

    socket.on('chat message', (msg) => {
      messageService
        .save({ message: msg, roomId, name })
        .then((savedData) => {
          console.log(savedData);
          io.to(roomId).emit('chat message', msg, name);
        });
    });

    socket.on('disconnect', () => {
      io.to(roomId).emit('system message', `${name} left ${roomId}`);

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
  names,
  rooms,
  roomsCreatedAt,
};
