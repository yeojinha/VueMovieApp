<template>
		<div class="join-container">
			<header class="join-header">
				<h1><i class="fas fa-smile"></i> ChatCord</h1>
			</header>
			<main class="join-main">
				<form action="chat.html">
					<div class="form-control">
						<label for="username">Username</label>
						<input
							type="text"
							name="username"
							id="username"
							placeholder="Enter username..."
              @click="setUser"
							required
						/>
					</div>
					<div class="form-control">
						<label for="room">Room</label>
						<select name="room" id="room">
              
              <option
              v-for="value in Rooms"
              :key="value"
              {{value}}
              >
              </option>
							<option value="JavaScript">멜로</option>
							<option value="Python">판타지</option>
							<option value="PHP">액션</option>
							<option value="C#">뷁</option>
							<option value="Ruby">신흥고</option>
							<option value="Java">하여쥔</option>
						</select>
					</div>
					<button type="submit" class="btn">Join Chat</button>
				</form>
			</main>
		</div>
</template>
<script>

export default {
  data(){
    return {
      username: '',
      id: '',
      Room:[],
      RoomList: [
       "JavaScript", "Python", "PHP", "C#", "Ruby", "Java"
      ]
    }
  },
  methods: {   
     setUser() {//setUser(유저 아이디 설정)
      this.$store.dispatch('user/pushUser', {
        username: this.username,
        type: this.type,
        id: this.id,
        Room: this.RoomList
      })
    },

  }
}
</script>
<style scoped>
@import "../scss/chat.css";
</style>