<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i>Movie-Chat-Room</h1>
    </header>
    <main class="join-main">
      <form action="chat.html">
        <div class="form-control">
          <label for="username">Username</label>
          <input
            type="text"
            v-model="this.username"
            placeholder="Enter username..."
            required
          />
        </div>
        <div class="form-control">
          <label for="room">Room</label>
          <select name="room" id="room" v-model="this.room">
            <option v-for="room in List.items" :key="room">
              {{ room }}
            </option>
          </select>
        </div>
        <button class="btn" @click="onClickJoinBtn">Join Chat</button>
      </form>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newUser: {
        id: null,
        name: "",
        room: "",
      },
      username: "",
      room: "Melo",
      List: {
        name: "Room",
        items: ["Melo", "Family", "Fantasy", "Action", "SF", "etc"],
      },
    };
  },
  methods: {
    onClickJoinBtn(event) {
      event.preventDefault();
      //!! 이름명 입력 안했거나, 중복이름 (같은 방에) 존재하면 X
      if (!this.username) return;
      else if (
        this.$store.state.user.users.find(
          (us) => us.name == this.username && us.room == this.room
        )
      ) {
        alert("아이디 중복");
        return;
      }
      this.$store.state.user.reloadFlag = true; //for reload on Home.vue
      this.$store.state.user.flag = true;
      console.log("flag: ", this.$store.state.user.flag);
      // ws://localhost:80/
      // this.$store.state.user.stateWebSocket = new WebSocket(
      //   "ws://localhost:80/"
      // );
      this.$store.state.user.stateWebSocket = new WebSocket(
        "ws://chat-server-yeojin.herokuapp.com/ws"
      );
      //webSocket의 UniqueID 함수 생성하여 newUser에 전달.
      this.$store.state.user.stateWebSocket.getUniqueID = function () {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + "-" + s4();
      };
      //newUser 웹소켓 uniqueId전달 받음
      let newUser = {
        // id: this.$store.sta/te.user.stateWebSocket.getUniqueID(),
        name: this.username,
        room: this.room,
        new: true,
        fresh: true,
        leaving: false,
      };
      //newUser 서버에 전달
      console.log("newUser on index.vue: ", newUser);
      this.$store.state.user.newUser = newUser;
      console.log("new User on index.vue: ", this.$store.state.user.newUser);
      // this.$store.dispatch("user/userJoin", newUser);
      this.$router.replace(`/chat?channel=${this.room}`);
      /*flag줌*/
    },
  },
};
</script>
<style scoped>
@import "../scss/chat.css";
</style>
