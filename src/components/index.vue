<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i>영화-채팅-방</h1>
    </header>
    <main class="join-main">
      <form action="chat.html">
        <div class="form-control">
          <label for="username">Username</label>
          <input type="text" v-model="this.username" placeholder="Enter username..." required />
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
      newUser:{
        name:'',
        room:''
      },
      username:'',
      room:'Melo',
      List: {
        name:"Room",
        items:['Melo', 'Family', 'Fantasy', 'Action']
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
      const newUser={
        name:this.username,
        room:this.room
      }
      this.$store.state.user.flag=true;
       console.log("flag: ",this.$store.state.user.flag)
       this.$router.replace(`/chat?channel=${this.room}`)
       /*flag줌*/
       
    }
  },
};
</script>
<style scoped>
@import '../scss/chat.css';
</style>
