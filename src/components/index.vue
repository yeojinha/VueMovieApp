<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i>영화-채팅-방</h1>
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
      // nav:{
      //   name:"chat",
      //   href:`/chat?channel=${this.channel}`
      // }
    };
  },
  methods: {
    onClickJoinBtn(event) {
      event.preventDefault();
      if (!this.username) return;
      this.$store.state.user.reloadFlag = true; //for reload on Home.vue

      this.$store.state.user.flag = true;
      console.log("flag: ", this.$store.state.user.flag);
      // ws://localhost:80/
      // this.$store.state.user.stateWebSocket = new WebSocket(
      //   "ws://localhost:80/"
      // );
      this.$store.state.user.stateWebSocket = new WebSocket(
        "ws://jonghwa220414.herokuapp.com/ws"
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
        id: this.$store.state.user.stateWebSocket.getUniqueID(),
        name: this.username,
        room: this.room,
      };
      console.log("newUser on index.vue: ", newUser);

      this.$store.state.user.newUser = newUser;

      this.$store.dispatch("user/userJoin", newUser);
      this.$router.replace(`/chat?channel=${this.room}`);
      this.$store.state.user.index++;
      /*flag줌*/
    },
  },
};
</script>
<style scoped>
@import "../scss/chat.css";
</style>
