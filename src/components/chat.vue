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
          <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
          <li
            v-for="user in userList"
            v-if="user.room !== this.channel"
            :key="user.id"
          >
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
    console.log(
      "this.$store.state.user.newUser: ",
      this.$store.state.user.newUser
    );

    this.websocket.onopen = ({ data }) => {
      //!! new User send to server
      this.websocket.send(JSON.stringify(this.$store.state.user.newUser));
      console.log("this new User onopen: ", this.$store.state.user.newUser);
      const message = {
        name: "bot",
        message: `${this.chatUser.name}님 반갑습니다!`,
        channel: this.channel,
        bot: true,
        fresh: false,
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
    //todo newUser를 server에 전달.

    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      //!!vo.fresh(새로운 사람 입장/퇴장만 하는 경우)
      console.log("vo JSON 내용 체크 onmessage: ", vo);
      if (vo.fresh === true) {
        let User = {
          // id: vo.id,
          name: vo.name,
          room: vo.room,
          fresh: vo.true,
        };
        console.log("vo.fresh 체크 작동함");
        console.log(
          " vo.fresh 체크 전 users on onmessage: ",
          this.$store.state.user.users
        );
        console.log("User: ", User);
        //!! User가 리스트에 없다면 추가하는 것
        if (!this.$store.state.user.users.includes(User)) {
          this.$store.state.user.index++;
          this.$store.dispatch("user/userJoin", User);
          console.log("users on onmessage: ", this.$store.state.user.users);
        } else {
          //!! User가 있는데, 요청이 들어온 것은 나가는 것이다.
          console.log("User가 있는데, 요청이 들어온 것은 나가는 것이다.");
          this.$store.state.user.index--;
          this.$store.dispatch("user/userLeave", User); //나가면 pull해줌
        }
        //!vo.fresh가 false인 경우는 메시지인 경우
      } else if (vo.fresh !== true) {
        if (vo.channel === this.channel && vo.bot === true) {
          this.appendNewMessage("Bot-Message", vo.message, vo.time);
        } else if (vo.channel === this.channel && vo.bot === false) {
          this.appendNewMessage(vo.name, vo.message, vo.time);
        }
      }

      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
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
      return this.$store.getters["user/getUsers"];
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
        fresh: false,
      };

      console.log("this.USER-LIST on computed userList(): ", this.USER_LIST);
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
        //!! this.chatUser가 server에 전달되게 하라.
        this.websocket.send(JSON.stringify(this.chatUser));
        console.log(
          "send this.chatUser for leaving chnnel on event: ",
          this.chatUser
        );
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
        //!! 본인 저장소에서 지워야
        this.$store.dispatch("user/userLeave", this.chatUser);
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
