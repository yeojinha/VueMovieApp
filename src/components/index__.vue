<template>
  <div class="join-container">
    <header class="join-header">
      <h1><i class="fas fa-smile"></i>영화-채팅-방</h1>
    </header>
    <main class="join-main">
      <form action="chat.html">
        <div class="form-control">
          <label for="room">Room</label>
          <select name="room" id="room" v-model="this.selectedChannel">
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
        room:'',
        msg:''
      },
      //id: '',
      selectedChannel: '',
      //Room: [],
      List: {
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
      //TODO store.users에 입력한 이름있으면 ,작동 안하고 message popUp되어 진행 막기.
      const newUser ={
        name: Math.ceil(Math.random()*10000000).toString(),
        room: this.user.room,
        msg:this.user.msg
      }
      this.$store.state.user.newUser = newUser;
      this.$store.dispatch('user/userJoin',newUser);
      console.log("this.user.room:",newUser.room)
       this.$router.push(`/chat?channel=${this.selectedChannel}`)
    }
  },
};
</script>
<style scoped>
@import '../scss/chat.css';
</style>
