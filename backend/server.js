const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('../store/_user.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  // getRoomUsers
} = require('../store/_user.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join('../', './')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {//서버에서 on
  socket.on('joinRoom', (temp) => {
    //TODO store 메소드 호출방식 변경?
    const user = userJoin(temp);

    socket.join(user.room);

    // Send users and room info
    // io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });

    // Welcome current user
    socket.emit('message', user);

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        user
      );
    // socket.emit('message', formatMessage(user, 'Welcome to ChatCord!'));

    // // Broadcast when a user connects
    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     'message',
    //     formatMessage(user, `${user.name} has joined the chat`)
    //   );


  });
  // Listen for chatMessage
    socket.on('chatMessage', msg => {//room,message정보
    const user = getCurrentUser(socket.id);
  //TODO  user를 다시 client message에 전달하는데, user 안에 message가 있느냐? 
    io.to(user.room).emit('message',user);//
  });
  // socket.on('chatMessage', msg => {
  //   const user = getCurrentUser(socket.id);

  //   io.to(user.room).emit('message', formatMessage(user, msg));
  // });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.name} has left the chat`)
      )};
    //   // Send users and room info
    //   io.to(user.room).emit('roomUsers', {
    //     room: user.room,
    //     users: getRoomUsers(user.room)
    //   });
    // }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));