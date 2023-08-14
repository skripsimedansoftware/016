const { Server } = require('socket.io');
const { JWTVerify } = require('../helpers/jwt.helper');

const io = new Server();

io.use((socket, next) => {
  JWTVerify(socket.handshake.auth).then(({ payload }) => {
    socket.user = payload;
    socket.join(payload.jabatan);
    next();
  }, next);
});

io.on('connect', (socket) => {
  console.log(socket.id, 'connect', socket.user);
});

module.exports = io;
