<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1><i class="fas fa-smile"></i>영화-채팅-방</h1>
    <!-- <a href="index.html" class="btn">Leave Room</a> -->
    <button class="btn" @click="onClickleaveRoom">Leave Room</button>
    </header>
    <main class="chat-main">
      <div class="chat-sidebar">
        <h3><i class="fas fa-comments"></i> Channel Name:</h3>
        <h2 id="room-name">{{ this.channel }}</h2><!--TODO channel을 store에서 가져와야 함.-->
        <!-- <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users">
          <li v-for="user in this.$store.state.user.users" 
            :key="user">
            <li v-if="'user.room'=='this.channel'">
              {{ user.name }}
            </li>
          </li>
        </ul> -->
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
        <button class="btn" @click="handleSend"><i class="fas fa-paper-plane"></i> Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  created() {
    this.channel = this.$route.query.channel || '';
    this.$store.state.user.stateWebSocket = new WebSocket('ws://peaceful-ridge-59102.herokuapp.com:9999/ws');
    // this.websocket = new SockJS('http://localhost:8080/ws/realtime');
    this.websocket=this.$store.state.user.stateWebSocket;
    
    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      if (vo.channel === this.channel) {
        this.appendNewMessage(this.tempName, vo.message, vo.time);
      }
    };
    this.websocket.onopen = (event) => {
      console.log('open event..', event);
      
    };

    this.websocket.onerror = (event) => {
      console.log('error', event);
    };
     this.websocket.onclose = (event) => {
            console.log('close', event); 
    };
   
  },data() {
    return {
      tempName: 'Ghost',
      user:{
        name:'',
        room:''
      },
      // username:  this.$store.state.user.newUser.name,
      websocket: null,
      channel: '',
      chatInputMessage: '',
    };
  },
  // computed:{
  //   getThisRoom(){
      
  //   },
  //   userList(){
  //     // console.log("this.$store.state.user.users: ",this.$store.state.user.users.filter(user=>user.room == this.channel)); 
  //     // console.log("this. Get user: ", this.getUser);
  //     return this.$store.state.user.users.filter(user=>user.room == this.channel);
  //   },
  //   getUser(){
  //     //TODO name으로 store users에서 해당하는 user가져오기.
  //     for(let i=0;i<this.$store.state.user.users.length;i++){
  //       if(this.username===this.$store.state.user.users[i].name){
  //         return this.$store.state.user.users[i]
  //       }
  //     }
  //   }
  // },
  methods: {
   handleSend(){
     if(this.websocket===WebSocket.OPEN){
       send()
     }else if(this.websocket==WebSocket.CONNECTING){
       this.websocket.addEventListener('open',()=>this.handleSend())
     }
   },
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
      console.log("userList: ",this.$store.state.user.users)
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
    //TODO button router로 나가면, 다시 들어와서 메시지 치면 1개만 나와야 하는데, 나간 수 만큼 (모든 펑션) 작동함
    onClickleaveRoom(event){
        event.preventDefault();
         //TODO router.push하면 /이동이 아닌 index.html/으로 이동하여 home으로 이동된다.
        //  console.log("get User on chat: ", this.getUser)
        //  this.$store.dispatch('user/userLeave',this.getUser)
        //  localStorage.removeItem(this.getUser);      
         this.$router.replace('/')
        //  console.log("After left userList on chat: ", this.$store.state.user.users)
         this.websocket.close();
    }
   
  }
};
</script>

<style scoped>
@import '../scss/chat.css';
</style>