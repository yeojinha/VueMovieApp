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
        <h2 id="room-name">{{ this.channel }}</h2>
        <!--TODO channel을 store에서 가져와야 함.-->
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users">
          <li v-for="user in userList" :key="user.id">
            {{ user.name }}
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
        <input
          id="msg"
          placeholder="Enter Message"
          required
          autocomplete="off"
          v-model="chatInputMessage"
        />
        <button class="btn" @click="send">
          <i class="fas fa-paper-plane"></i> Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
//TODO 유저목록 갱신화 시켜야함.
import moment from "moment";

export default {
  created() {
    const chatMessages = document.querySelector(".chat-messages");
    this.channel = this.$route.query.channel || "";
    // this.$store.state.user.stateWebSocket = new WebSocket("ws://localhost:80/");
    // this.$store.state.user.stateWebSocket = new WebSocket(
    //   "ws://jonghwa220414.herokuapp.com/ws"
    // );
    this.websocket = this.$store.state.user.stateWebSocket;

    // this.websocket.getUiqueID = function () {
    //   function s4() {
    //     return Math.floor((1 + Math.random()) * 0x10000)
    //       .toString(16)
    //       .substring(1);
    //   }
    //   return s4() + s4() + "-" + s4();
    // };

    this.websocket.onmessage = ({ data }) => {
      // this.websocket.id = this.websocket.getUiqueID();
      const vo = JSON.parse(data);
      console.log("onmessage: ", vo.message, " and ", vo);
      if (vo.channel === this.channel && vo.bot === true) {
        this.appendNewMessage("Bot-Message", vo.message, vo.time);
      } else if (vo.channel === this.channel && vo.bot === false) {
        this.appendNewMessage(this.chatUser.name, vo.message, vo.time);
      }

      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    };

    this.websocket.onopen = ({ data }) => {
      const message = {
        message: `${this.chatUser.name}님 반갑습니다!`,
        channel: this.channel,
        bot: true,
      };
      console.log("message on onopen: ", message);

      console.log("JSON.stringify(ms) onopen: ", JSON.stringify(message));
      if (this.websocket.send(JSON.stringify(message)) < 0) {
        console.log("안보내짐 error발생");
      } else {
        console.log("보내짐");
      }
      console.log("open event..", data);
    };

    this.websocket.onerror = (event) => {
      console.log("error", event);
    };

    this.websocket.onclose = (event) => {
      // const message = {
      //   message: `${this.chatUser.name}님 바이바이!`,
      //   channel: this.channel,
      //   bot: true,
      // };
      // console.log("message on onclose: ", message);
      // console.log("JSON.stringify(ms) onclose: ", JSON.stringify(message));
      // if (this.websocket.send(JSON.stringify(message)) < 0) {
      //   console.log("안보내짐 error발생");
      // } else {
      //   console.log("보내짐");
      // }
      console.log("open event..", event);
    };
  },
  data() {
    return {
      // listOfUsers = this.$store.getters['user/getUsers'],
      chatUser: this.$store.state.user.newUser,
      tempName: "Ghost",
      user: {
        id: null,
        name: "",
        room: "",
      },
      // username:  this.$store.state.user.newUser.name,
      websocket: null,
      channel: "",
      chatInputMessage: "",
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
  computed: {
    //todo userList자동으로 업뎃해야함.
    userList() {
      console.log("setTimeOut줌 1초");
      setTimeout(() => {
        return this.$store.getters["user/getUsers"];
      }, 1000);
    },
  },
  methods: {
    handleSend() {
      console.log("websocket is? ", this.websocket);
      console.log("websocket is on?", this.websocket === WebSocket.OPEN);
      if (this.websocket === WebSocket.OPEN) {
        this.send();
      } else if (this.websocket == WebSocket.CONNECTING) {
        this.websocket.addEventListener("open", () => this.handleSend());
      }
    },
    send() {
      console.log("websocket: ", this.websocket);
      console.log("state.websocket: ", this.$store.state.user.stateWebSocket);
      console.log(
        "this.websocket on Chat: ",
        this.websocket.readyState === WebSocket.OPEN
      );
      if (this.chatInputMessage === "") return;
      const message = {
        //todo name추가해서 server에서 처음 접속시 메세지 전달.
        name: this.chatUser.name,
        channel: this.channel,
        message: this.chatInputMessage,
        bot: false,
      };
      console.log("message on chat: ", message);
      this.websocket.send(JSON.stringify(message));
      this.chatInputMessage = "";
    },
    onEnter() {
      this.send();
    },
    appendNewMessage(username, message, time) {
      const div = document.createElement("div");
      div.classList.add("message");
      const p = document.createElement("p");
      p.classList.add("meta");
      p.innerText = username;
      p.innerHTML += `<span>${moment(time).format("h:mm a")}</span>`;
      div.appendChild(p);
      const para = document.createElement("p");
      para.classList.add("text");
      para.innerText = message;
      div.appendChild(para);
      document.querySelector(".chat-messages").appendChild(div);
      document.querySelector(".chat-messages").scrollTop =
        document.querySelector(".chat-messages").scrollHeight;
    },
    appendNewMessageFromBot(username, message, time) {
      const div = document.createElement("div");
      div.classList.add("message");
      const p = document.createElement("p");
      p.classList.add("meta");
      p.innerText = username;
      p.innerHTML += `<span>${moment(time).format("h:mm a")}</span>`;
      div.appendChild(p);
      const para = document.createElement("p");
      para.classList.add("text");
      para.innerText = message;
      div.appendChild(para);
      document.querySelector(".chat-messages").appendChild(div);
      document.querySelector(".chat-messages").scrollTop =
        document.querySelector(".chat-messages").scrollHeight;
    },
    //TODO document.querySelector(".chat-messges")에서 append messages할 때, div class "message" 붙는 것들을 삭제시켜야 한다.
    onClickleaveRoom(event) {
      event.preventDefault();
      if (this.$store.state.user.flag === true) {
        //todo .chat-messages에서 classList가져와서 message class 삭제.
        // document.querySelector(".chat-messages").remove("message");
        this.$store.dispatch("user/userLeave", this.chatUser); //나가면 pull해줌.
        const message = {
          message: `${this.chatUser.name}님 안녕히가세요.`,
          channel: this.channel,
          bot: true,
        };
        console.log("message on onclose: ", message);
        console.log("JSON.stringify(ms) onclose: ", JSON.stringify(message));
        if (this.websocket.send(JSON.stringify(message)) < 0) {
          console.log("안보내짐 error발생");
        } else {
          console.log("보내짐");
        }
        this.websocket.close();
        // localStorage.clear();
        this.$store.state.user.flag = false;
        console.log("flag on chat: ", this.$store.state.user.flag);
        console.log(
          "this.websocket.readyState: ",
          this.websocket.readyState === WebSocket.OPEN
        );
      }
      this.$router.replace("/");
      //todo router로 이동했을 때, 전에 있던 내용들 다 지워져야 함. go는 현재 경로에서 refresh하는 것이다.
      //todo location href를 사용하던지 해야함.
      // window.location.href = "https://hardcore-cori-ba34bc.netlify.app/#/";
      // setTimeout(function () {
      //   this.$router.push("/");
      // }, 1200);
    },
  },
};
</script>

<style scoped>
@import "../scss/chat.css";
</style>
