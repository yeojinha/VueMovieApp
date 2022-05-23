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
      name: "",
      room: "",
      new: true,
      fresh: true,
    },
    user: {
      name: "",
      room: "",
    },
    userList: [],
    users: [],
    rooms: [],
    pulledUser: "",
  },
  getters: {
    getUsers: function (state) {
      return state.users;
    },
  },
  methods: {},
  mutations: {
    putUser(state, user) {
      //!! 중복 추가 방지
      for (let i = 0; i < state.mutationFlas; i++) {
        if (
          state.users[i].name == user.name &&
          state.users[i].room == user.room
        ) {
          return;
        }
        state.users.push(user);
        let dummyUser = user;
        dummyUser.dummy = true;
        state.userList.push(dummyUser); //dummy list 만듬
      }
      state.mutationFlas++;
      console.log("users dummy on putUser: ", state.userList);
      console.log("users array on putUser: ", state.users);
    },
    pullUser(state, user) {
      console.log("before pull User on pullUser: ", state.users);
      state.mutationFlas--;
      const temp = state.users.find(
        (us) => us.name === user.name && us.room === user.room
      );
      console.log("found user: ", temp);
      const index = state.users.indexOf(temp);
      console.log("index: ", index);
      if (index !== -1) {
        state.pulledUser = state.users.splice(index, 1)[0];
        state.userList.splice(index, 1)[0]; // dummy List pull
      }
      console.log("After usrs array on pullUser: ", state.users);
      console.log("state.pulledUser: ", state.pulledUser);
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
