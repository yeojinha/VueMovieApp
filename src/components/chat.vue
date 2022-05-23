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

    this.websocket.onopen = ({ data }) => {
      // isListFlag = true;
      // this.websocket.send(JSON.stringify(isListFlag));
      //!! new User send to server
      if (
        this.websocket.send(JSON.stringify(this.$store.state.user.thisUser)) < 0
      )
        console.log("새로운 유저 서버에 안보내짐");
      else {
        console.log("새로운 유저 서버에 보내짐");
      }

      const message = {
        name: "bot",
        message: `${this.chatUser.name}님 반갑습니다!`,
        channel: this.channel,
        bot: true,
        fresh: false,
      };
      console.log("JSON.stringify(ms) onopen: ", JSON.stringify(message));
      if (this.websocket.send(JSON.stringify(message)) < 0) {
        console.log("안보내짐 error발생");
      } else {
        console.log("보내짐");
      }
      console.log("open event..", data);
    };

    //!! sever에서 data 전달받음.
    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      console.log("this.websocket.onmessage: ", vo);
      //!!vo.fresh(새로운 사람 입장/퇴장만 하는 경우)
      //  if (vo.isListFlag) {
      //   console.log("isListFlag: ", vo.isListFlag);
      // } else
      if (vo.fresh === true && !vo.bot) {
        console.log("vo.fresh 작동 확인");
        let User = {
          // id: vo.id,
          name: vo.name,
          room: vo.room,
          fresh: vo.true,
          new: vo.new,
        };
        console.log("서버에서 받은 User: ", User);
        //!! User가 리스트에 없다면 추가하는 것
        let temp = this.$store.state.user.users.find(
          (us) => us.name == User.name && us.room == User.room && !User.new
        );
        console.log("filter로 User와 같은 것을 temp에 넣음: ", temp);
        //!! 이름이 다르
        if (temp === undefined) {
          this.$store.state.user.index++;
          //!! new User은 old
          User.new = false;
          this.$store.dispatch("user/userJoin", User);
          console.log("유저 리스트 추가 : ", this.$store.state.user.users);
          //!! User가 있는데, 요청이 들어온 것은 나가는 것이다.
        } else {
          this.$store.state.user.index--;
          this.$store.dispatch("user/userLeave", User); //나가면 pull해줌
          console.log("유저 퇴장 후 리스트 : ", this.$store.state.user.users);
        }
        //!vo.fresh가 false인 경우는 메시지인 경우
      } else if (vo.fresh !== true) {
        if (vo.channel === this.channel && vo.bot === true) {
          this.appendNewMessage("Bot-Message", vo.message, vo.time);
        } else if (vo.channel === this.channel && vo.bot === false) {
          this.appendNewMessage(vo.name, vo.message, vo.time);
        }
        //!! dummy list 감지
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
      // tempName: "Ghost",
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
      this.USER_LIST = this.$store.getters["user/getUsers"].filter(
        (user) => user.room == this.channel
      );
      console.log(
        "userList filterd List: ",
        this.$store.getters["user/getUsers"].filter(
          (user) => user.room == this.channel
        )
      );
      return this.$store.getters["user/getUsers"].filter(
        (user) => user.room == this.channel
      );
    },
  },
  methods: {
    send() {
      if (this.chatInputMessage === "") return;
      const message = {
        //todo name추가해서 server에서 처음 접속시 메세지 전달.
        name: this.chatUser.name,
        channel: this.channel,
        message: this.chatInputMessage,
        bot: false,
        fresh: false,
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
        //!! this.chatUser가 old한 상태 server에 전달되게 하라.
        this.chatUser.new = false;

        const message = {
          message: `${this.chatUser.name}님 안녕히가세요!`,
          channel: this.channel,
          bot: true,
        };
        if (this.websocket.send(JSON.stringify(message)) < 0) {
          console.log("안보내짐 error발생");
        } else {
          if (
            this.websocket.send(
              JSON.stringify({
                name: this.chatUser.name,
                room: this.channel,
                bot: false,
                fresh: true, //true -> false
                new: false,
              })
            ) < 0
          )
            console.log("chatUser 안보내짐");
          else {
            console.log("chatUser 보내짐");
          }
          console.log("보내짐");
        }
        setTimeout(function () {
          this.websocket.close();
          localStorage.clear();
        }, 2000);
        this.$store.state.user.flag = false;
      }
      this.$router.replace("/");
    },
  },
};
</script>
<style scoped>
@import "../scss/chat.css";
</style>
