<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1><i class="fas fa-smile"></i>Movie-Chat-Room</h1>
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
      <div class="chat-messages"></div>
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
import moment from "moment";
export default {
  created() {
    this.channel = this.$route.query.channel || "";
    this.websocket = this.$store.state.user.stateWebSocket;

    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      console.log("onmessage: ", vo.message, " and ", vo);
      if (vo.channel === this.channel && vo.bot === true) {
        this.appendNewMessage("Bot-Message", vo.message, vo.time);
      } else if (vo.channel === this.channel && vo.bot === false) {
        this.appendNewMessage(vo.name, vo.message, vo.time);
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
      console.log("open event..", event);
    };
  },
  data() {
    return {
      chatUser: this.$store.state.user.newUser,
      tempName: "Ghost",
      user: {
        id: null,
        name: "",
        room: "",
      },
      USER_LIST: [],
      // username:  this.$store.state.user.newUser.name,
      websocket: null,
      channel: "",
      chatInputMessage: "",
    };
  },

  computed: {
    userList() {
      this.USER_LIST = this.$store.getters["user/getUsers"];
    },
  },
  methods: {
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

      console.log("this.USER-LIST on computed userList(): ", this.USER_LIST);
      console.log("message on chat: ", message);
      const json = JSON.parse(message.toString());
      console.log("json on app.js: ", json);
      json.time = Date.now();
      message2 = JSON.stringify(json);
      console.log("message on app.js: ", message2);
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
      p.innerText = username + " ";
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
        this.$store.commit("user/pullUser", this.chatUser); //나가면 pull해줌.
        const message = {
          message: `${this.chatUser.name}님 안녕히가세요!`,
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
        while (this.USER_LIST.length > 0) {
          this.USER_LIST.pop();
        }
        console.log("USER_LIST POP 확인: ", this.USER_LIST);
        localStorage.clear();
        this.$store.state.user.flag = false;
        console.log("flag on chat: ", this.$store.state.user.flag);
        console.log(
          "this.websocket.readyState: ",
          this.websocket.readyState === WebSocket.OPEN
        );
      }
      this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
@import "../scss/chat.css";
</style>
