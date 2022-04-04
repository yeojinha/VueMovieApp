<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1><i class="fas fa-smile"></i> ChatCord</h1>
      <button class="btn" @click="onClickleaveRoom">Leave Room</button>
      <!-- <a href="index.html" class="btn">Leave Room</a> -->
    </header>
    <main class="chat-main">
      <div class="chat-sidebar">
        <h3><i class="fas fa-comments"></i> Channel Name:</h3>
        <h2 id="room-name">{{ this.channel }}</h2><!--TODO channel을 store에서 가져와야 함.-->
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users">
          <li v-for="user in userList" :key="user"><!--TODO userList를 store에서 가져와야 함.-->
              {{user}}
          </li>
        </ul>
      </div>
      <div class="chat-messages">
        <!-- <div class="message">
          <p class="meta">Brad <span>9:12pm</span></p>
          <p class="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, repudiandae.</p>
        </div>
        <div class="message">
          <p class="meta">Mary <span>9:15pm</span></p>
          <p class="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, repudiandae.</p>
        </div> -->
      </div>
    </main>
    <div class="chat-form-container">
      <form id="chat-form">
        <input id="msg" placeholder="Enter Message" required autocomplete="off" v-model="chatInputMessage" />
        <button class="btn" @click="send"><i class="fas fa-paper-plane"></i> Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  created() {
//   const username= $store.state.getCurrentUser;
//   console.log($store.state.getCurrentUser);

//   const room = this.channel;
//     const socket = io();//클라이언트에서 io하면 

//   // Join chatroom 
//   socket.emit('joinRoom', { username, room });

//   // Get room and users
//   socket.on('roomUsers', ({ room, users }) => {
//     outputRoomName(room);
//     outputUsers(users);
//     //on으로 roomUsers
//   });
//   // Message from server
//   socket.on('message', (chatInputMessage) => {
//     console.log(chatInputMessage);
//     outputMessage(chatInputMessage);

//     // Scroll down
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// // Message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });
    this.channel = this.$route.query.channel || '';
    this.websocket = new WebSocket('ws://localhost:9999/ws');
    // this.websocket = new SockJS('http://localhost:8080/ws/realtime');

    this.websocket.onopen = (event) => {
      console.log('open event..', event);
      
    };

    this.websocket.onerror = (event) => {
      console.log('error', event);
    };

    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      if (vo.channel === this.channel) {
        this.appendNewMessage(this.$store.username, vo.message, vo.time);
      }
    };

     this.websocket.onclose = (event) => {
            console.log('close', event); 
    };

   
  },data() {
    return {
      username: 'tempUser',
      websocket: null,
      channel: '',
      chatInputMessage: '',
    };
  },
  computed:{
    userList(){
      //TODO this.$store.state.users가 undefined 받아들여지지 않는 듯함.
      console.log("this.$store.state.users: ",this.$store.state.users)
      return this.$store.state.users;
    }
  },
  methods: {

//       appendNewMessage(username, message, time) {
//       const div = document.createElement('div');
//       div.classList.add('message');
//       const p = document.createElement('p');
//       p.classList.add('meta');
//       p.innerText = username;
//       p.innerHTML += `<span>${moment(time).format('h:mm a')}</span>`;
//       div.appendChild(p);
//       const para = document.createElement('p');
//       para.classList.add('text');
//       para.innerText = message;
//       div.appendChild(para);
//       document.querySelector('.chat-messages').appendChild(div);
//     },

// // Add room name to DOM
// outputRoomName(room) {
//   roomName.innerText = room;
// },

// // Add users to DOM
// outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// },

//     leaveRoom(){
//         const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//         if (leaveRoom) {
//         window.location = '#/index';
//         } else {
//         }
//     }
    send() {
      if (this.chatInputMessage === '') return;
      const message = {
        channel: this.channel,
        message: this.chatInputMessage,
      };
      this.websocket.send(JSON.stringify(message));
      this.chatInputMessage = '';
    },
    onEnter() {
      this.send();
    },
    appendNewMessage(username, message, time) {
      const div = document.createElement('div');
      div.classList.add('message');
      const p = document.createElement('p');
      p.classList.add('meta');
      p.innerText = username;
      p.innerHTML += `<span>${moment(time).format('h:mm a')}</span>`;
      div.appendChild(p);
      const para = document.createElement('p');
      para.classList.add('text');
      para.innerText = message;
      div.appendChild(para);
      document.querySelector('.chat-messages').appendChild(div);
    },
    onClickleaveRoom(event){
        event.preventDefault();
         //TODO router.push하면 /이동이 아닌 index.html/으로 이동하여 home으로 이동된다.
         this.$router.replace('/')
    }
   
  }
};
</script>

<style scoped>
@import '../scss/chat.css';
</style>