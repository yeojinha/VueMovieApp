export default {
  namespaced: true,
  state: {
      user:{
        name:'',
        room:''
      },
      users: [],
      rooms: [],
      pulledUser:''
  },
  getters: {
    getCurrentUser(state,name) {
      return state.users.find(user => user.name === name);
    },
    getLeftUser(state) {
      return state.pulledUser;
    },
    getRoomUsers(state,room) {
      return state.users.filter(user => user.room === room);
    }
  },
  mutations: {
    putUser(state,user)
    {
      const userList=[]
      console.log("user: ",user)
      userList.push(user)
      console.log("userList: ",userList)
      state.users.push({
        name:user.name,
        room:user.room
        });
      console.log("users array: ",state.users);    
      
    },
    pullUser(state,name){
      const index = state.users.find(user=>user.name===name)
      if (index !== -1) {
        state.pulledUser=state.users.splice(index, 1)[0];
      }
    }
  },
  actions: {
    userJoin(context,user) {
      console.log('...user: ',{...user})
      context.commit('putUser',user);
    },
    userLeave(context,{...user}){
      context.commit('pullUser',user);
    }
  }
}

// const users = [];

// // Join user to chat
// function userJoin(id, username, room) {
//   const user = { id, username, room };

//   users.push(user);

//   return user;
// }

// // Get current user
// function getCurrentUser(id) {
//   return users.find(user => user.id === id);
// }

// // User leaves chat
// function userLeave(id) {
//   const index = users.findIndex(user => user.id === id);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }

// // Get room users
// function getRoomUsers(room) {
//   return users.filter(user => user.room === room);
// }

// module.exports = {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// };