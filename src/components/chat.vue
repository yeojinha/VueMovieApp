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
      //!! new User send to server
      //!! 처음 입장 시에, 유저리스트를 다른 유저들에게 공유해달라고 flag 보낸다.
      let enterFlag = {
        entering: true,
      };
      //** 입장 시그널 전달  */
      let check = this.websocket.send(JSON.stringify(enterFlag));
      if (check < 0)
        //!! 아래 사항 출력 시에 check 보내짐.
        console.log("check flag 안보내짐");
      else {
        console.log(
          "check on chat.vue 유저리스트 공유 flag 전송 (0이상이면 정상작동): ",
          check
        );
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

    //todo newUser를 server에 전달.
    this.websocket.onmessage = ({ data }) => {
      const vo = JSON.parse(data);
      console.log("this.websocket.onmessage: ", vo);
      //!!vo.fresh(새로운 사람 입장/퇴장만 하는 경우)
      //**array  */
      /*Arr 체크 -> for문 -> 객체 fresh -> bot-messges
else !fresh -> 그냥 추가  */
      if (!Array.isArray(vo) && vo.leaving) {
        let User = {
          // id: vo.id,
          name: vo.name,
          room: vo.room,
          fresh: vo.true,
          new: vo.new,
          leaving: vo.leaving,
        };
        this.$store.state.user.index--;
        this.$store.dispatch("user/userLeave", User); //나가면 pull해줌
        console.log("유저 퇴장 후 리스트 : ", this.$store.state.user.users);
      } else if (!Array.isArray(vo) && vo.entering) {
        //** 받은게 arr가 아니고 entering flag이면 현재 userList를 전달 */
        console.log("userlist: ", JSON.stringify(this.$store.state.user.users));
        let check = this.websocket.send(
          JSON.stringify(this.$store.state.user.users)
        );
        if (check >= 0)
          console.log(
            "stirngified - >userList on chat.vue: ",
            JSON.stringify(this.$store.state.user.users)
          );
        else {
          console.log("user List 안보내짐");
        }
      } else if (!Array.isArray(vo) && !vo.fresh) {
        //** arr도 아니고 vo.fresh이면 새로운 유저 입장에 대한 bot-msg 혹은 유저가 보낸 msg이다 */
        if (vo.channel === this.channel && vo.bot) {
          this.appendNewMessage("Bot-Message", vo.message, vo.time);
        } else if (vo.channel === this.channel && !vo.bot) {
          this.appendNewMessage(vo.name, vo.message, vo.time);
        }
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      } else if (Array.isArray(vo)) {
        //**받은게 arr이면 for문으로 돌려서 추가시켜야함*/
        let leng = vo.length();
        for (let i = 0; i < leng; i++) {
          let User = {
            // id: vo.id,
            name: vo[i].name,
            room: vo[i].room,
            fresh: vo[i].true,
            new: vo[i].new,
            leaving: vo[i].leaving,
          };
          console.log("서버에서 받은 User: ", User);
          //!! User가 리스트에 없다면 추가하는 것
          let temp = this.$store.state.user.users.find(
            (us) => us.name == User.name && us.room == User.room
          );
          console.log("filter로 User와 같은 것을 temp에 넣음: ", temp);
          //* 입장 */
          if (temp === undefined) {
            //**  존재하지 않고 입장 유저면
            this.$store.state.user.index++;
            User.new = false;
            this.$store.dispatch("user/userJoin", User);
            console.log("유저 리스트 추가 : ", this.$store.state.user.users);
            //!! User가 list에 있는데 요청 -> user가 나간다
          }
        }
      }
      //** */
      this.websocket.onerror = (event) => {
        console.log("error", event);
      };
      this.websocket.onclose = (event) => {
        console.log("open event..", event);
      };
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
                fresh: true,
                new: false,
                leaving: true,
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
        }, 2000);
        localStorage.clear();
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
