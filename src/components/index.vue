<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i> ChatCord</h1>
    </header>
    <main class="join-main">
      <form action="chat.html">
        <div class="form-control">
          <label for="username">Username</label>
          <input type="text" v-model="user.name" placeholder="Enter username..." required />
        </div>
        <div class="form-control">
          <label for="room">Room</label>
          <select name="room" id="room" v-model="user.room">
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
      user:{
        name:'',
        room:''
      },
      //id: '',
      selectedChannel: '',
      //Room: [],
      List: {
        name:"Room",
        items:['Melo', 'Family', 'Fantasy', 'Action']
      }
    };
  },
  methods: {
    onClickJoinBtn(event) {
      event.preventDefault();
      this.$store.dispatch('user/userJoin', {
        name: this.user.name,
        room: this.user.room
      });
      location.href = `http://localhost:8080/#/chat?channel=${this.user.room}`;
    }
  },
};
</script>
<style scoped>
@import '../scss/chat.css';
</style>
