// import { toSafeInteger } from "lodash";
import { ref } from "vue";
export default {
  namespaced: true,
  state: {
    stateWebSocket: null,
    reloadFlag: false,
    flag: false,
    mutationFlas: 0,
    newUser: {
      id: "",
      name: "",
      room: "",
    },
    user: {
      id: "",
      name: "",
      room: "",
    },
    users: ref([]),
    rooms: [],
    pulledUser: "",
  },
  // getters: {
  //   getCurrentUser(state,name) {
  //     return state.users.find(user => user.name === name);
  //   },
  //   getLeftUser(state) {
  //     return state.pulledUser;
  //   }
  // },
  // computed:{
  //     getRoomUsers(state,room) {
  //     return state.users.filter(user => user.room === room);
  //   },
  //   getRecentUser(state){
  //   return state.newUser;
  //   },
  //   getRoomName(state){
  //     return state.user.room;
  //   },

  // },
  getters: {
    getUsers: function (state) {
      return state.users;
    },
  },
  methods: {},
  mutations: {
    putUser(state, user) {
      state.mutationFlas++;
      // state.newUser = user;
      // console.log("state newUser: ", state.newUser);
      // state.users.push({
      //   id: user.id,
      //   name: user.name,
      //   room: user.room,
      // });
      state.users.push(user);
      // state.users.value.push(user);
      // state.users = [...state.users, user];
      console.log("users array on users.js: ", state.users);
    },
    pullUser(state, user) {
      state.mutationFlas--;
      const temp = state.users.find((us) => us.id === user.id);
      console.log("pull user: ", temp);
      const index = state.users.indexOf(temp);
      console.log("index: ", index);
      if (index !== -1) {
        state.pulledUser = state.users.splice(index, 1)[0];
        console.log("usrs.list: ", state.users);
        console.log("state.pulledUser: ", state.pulledUser);
      }
    },
  },
  actions: {
    userJoin(context, user) {
      console.log("...user: ", { ...user });
      context.commit("putUser", user);
    },
    userLeave(context, user) {
      console.log("...user: ", { ...user });
      context.commit("pullUser", user);
    },
  },
};

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
