// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const formatMessage = require('./utils/messages');
// const {
//   userJoin,
//   userLeave,
//   putUser,
//   pullUser,
//   getCurrentUser,
//   getRoomUsers,
//   getLeftUser

// const { reset } = require('nodemon');

// // } = require('./src/store/user.js');

// const app = express();
// const server = require('http').createServer(app);
// const io = require('socketio')(server);

// app.all('/*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

// app.get('/', function(req,res){
//   reset.sendFile('Hellow Chating App Server');
// });

// const botName = 'ChatCord Bot';

// // Run when client connects
// io.on('connection', socket => { //서버에서 on
//   socket.on('joinRoom', ({
//     username,
//     room
//   }) => {
//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     // Send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     });

//     // Welcome current user
//     socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

//     // Broadcast when a user connects
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         'message',
//         formatMessage(botName, `${user.username} has joined the chat`)
//       );


//   });
//   // Listen for chatMessage
//   socket.on('chatMessage', msg => {
//     const user = getCurrentUser(socket.id);

//     io.to(user.room).emit('message', formatMessage(user.username, msg));
//   });

//   // Runs when client disconnects
//   socket.on('disconnect', () => {
//     const user = userLeave(socket.id);

//     if (user) {
//       io.to(user.room).emit(
//         'message',
//         formatMessage(botName, `${user.username} has left the chat`)
//       );

//       // Send users and room info
//       io.to(user.room).emit('roomUsers', {
//         room: user.room,
//         users: getRoomUsers(user.room)
//       });
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));