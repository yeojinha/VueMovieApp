<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1><i class="fas fa-smile"></i> ChatCord</h1>
      <a href="index.html" class="btn">Leave Room</a>
    </header>
    <main class="chat-main">
      <div class="chat-sidebar">
        <h3><i class="fas fa-comments"></i> Channel Name:</h3>
        <h2 id="room-name">{{ this.channel }}</h2>
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users">
          <li v-for="user in userList" :key="user">
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
        this.appendNewMessage(this.username, vo.message, vo.time);
      }
    };

    this.websocket.onclose = (event) => {
      console.log('close', event);
    };
  },
  data() {
    return {
      username: 'tempUser',
      websocket: null,
      channel: '',
      chatInputMessage: '',
      userList:[]
    };
  },
  methods: {
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
  },
};
</script>

<style scoped>
@import '../scss/chat.css';
</style>