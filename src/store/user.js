import { compileTemplate } from "@vue/compiler-sfc";

export default {
  //module!
  namespaced: true,

  //data!
  state: () => ({
    users: [],
    user:{
      id,
      username,
      room
    }
  }),
  //computed!
  getters: {

  },
  //변이!
  mutations: {
    putUser(state, user){
      state.users.push(user)
    },
    pullUser(state,index){
      if(index !== 1){
        state.users.splice(index, 1)[0]
      }
    }
  },
  //비동기
  actions: {
    // Join user to chat
    userJoin({state},user) {
      commit('addUser', user)
      console.log(state.users)
    },
    // Get current user
    getCurrentUser(id) {
      return users.find(user => user.id === id);
    },
    // User leaves chat
    fuserLeave(id) {      
      const index = users.findIndex(user => user.id === id);
      commit('pullUser', user,index,id)
    },
    // Get room users
    getRoomUsers(room) {
      return users.filter(user => user.room === room);
    }

  }
}