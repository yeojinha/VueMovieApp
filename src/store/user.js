// import { toSafeInteger } from "lodash";

export default {
  namespaced: true,
  state: {
    stateWebSocket: null,
    reloadFlag: false,
    flag: false,
    mutationFlas: 0,
    newUser: {
      id: null,
      name: "",
      room: "",
    },
    user: {
      id: null,
      name: "",
      room: "",
    },
    users: {
      user_s: [],
    },
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
      return state.users.user_s;
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
      state.users.user_s.push(user);
      // state.users = [...state.users, user];
      console.log("users array on users.js: ", state.users.user_s);
    },
    pullUser(state, user) {
      state.mutationFlas--;
      const temp = state.users.user_s.find((us) => us.id === user.id);
      console.log("pull user: ", temp);
      const index = state.users.indexOf(temp);
      console.log("index: ", index);
      if (index !== -1) {
        state.pulledUser = state.users.user_s.splice(index, 1)[0];
        console.log("usrs.list: ", state.users.user_s);
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
