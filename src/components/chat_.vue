<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1><i class="fas fa-smile"></i> ChatCord</h1>
      <button class="btn" @click="onClickleaveRoom">Leave Room</button>
    </header>
    <main class="chat-main">
      <div class="chat-sidebar">
        <h3><i class="fas fa-comments"></i> Channel Name:</h3>
        <h2 id="room-name">{{ this.channel }}</h2>
      
      </div>
      <div class="chat-messages">
      
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
        this.appendNewMessage(this.username, vo.message);
      }
    };

    this.websocket.onclose = (event) => {
      console.log('close', event);
    };
  },
  data() {
    return {
      username: 'Ghost',
      websocket: null,
      channel: '',
      chatInputMessage: '',
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
      p.innerHTML += `<span>${time}</span>`;
      div.appendChild(p);
      const para = document.createElement('p');
      para.classList.add('text');
      para.innerText = message;
      div.appendChild(para);
      document.querySelector('.chat-messages').appendChild(div);
    },
        onClickleaveRoom(event){
        event.preventDefault();
        this.websocket.onclose = (event) => {
        console.log('close', event);
         };
         //TODO router.push하면 /이동이 아닌 index.html/으로 이동하여 home으로 이동된다.
         this.$router.replace('/')
    }
  }
};
</script>

<style scoped>
@import '../scss/chat.css';
</style>