
import socketio from 'socket.io-client';

let socket: any = null;

const socketCheck = () => {
  if (socket == null) {
    console.error('SocketService: Action failed. Socket has not been initialized');
    return false;
  }
  return true;
};

const init = (url: string) => {
  return new Promise((resolve, reject) => {
    socket = socketio(url);
    console.log(`SocketService: Initialized with url: ${url}`);
    socket.on('connect', () => {
      // TODO: Rejoin rooms
      resolve(socket);
    });
  });
};

const emit = (name: string, data: any) => {
  if (socketCheck()) {
    socket.emit(name, data);
  }
};

const joinRoom = (roomId: string) => {
  if (socketCheck()) {
    // console.log(io);
    emit('join', {room: roomId});
    console.log(`SocketService: Joined room with id: ${roomId}`);
  }
};

const leaveRoom = (roomId: string) => {
  if (socketCheck()) {
    emit('leave', {room: roomId});
    console.log(`SocketService: Left room with id: ${roomId}`);
  }
};


export default {
  init,
  joinRoom,
  leaveRoom,
  emit,
  socket,
};
