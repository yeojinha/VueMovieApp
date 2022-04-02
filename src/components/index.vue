<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i> ChatCord</h1>
    </header>
    <main class="join-main">
      <form action="chat.html">
        <div class="form-control">
          <label for="username">Username</label>
          <input type="text" name="username" id="username" placeholder="Enter username..." @click="setUser" required />
        </div>
        <div class="form-control">
          <label for="room">Room</label>
          <select name="room" id="room" v-model="selectedChannel">
            <option v-for="room in RoomList" :key="room">
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
      username: '',
      id: '',
      selectedChannel: '',
      Room: [],
      RoomList: ['Melo', 'Family', 'Fantasy', 'Action'],
    };
  },
  methods: {
    setUser() {
      //setUser(유저 아이디 설정)
      this.$store.dispatch('user/userJoin', {
        username: this.username,
        type: this.type,
        id: this.id,
        Room: this.RoomList,
      });
    },
    onClickJoinBtn(event) {
      event.preventDefault();
      console.log(event);
      console.log('room', this.selectedChannel);
      location.href = `http://localhost:8080/#/chat?channel=${this.selectedChannel}`
      // TODO: Route처리
    },
  },
};
</script>
<style scoped>
@import '../scss/chat.css';
</style>
