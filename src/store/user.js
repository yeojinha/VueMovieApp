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
    },
    user: {
      name: "",
      room: "",
    },
    users: ref([]),
    rooms: [],
    pulledUser: "",
  },
  getters: {
    getUsers: function (state) {
      console.log("state.users on getters: ", state.users);
      return state.users;
    },
  },
  methods: {},
  mutations: {
    putUser(state, user) {
      state.mutationFlas++;
      state.users.push(user);
      console.log("users array on users.js: ", state.users);
    },
    pullUser(state, user) {
      state.mutationFlas--;
      const temp = state.users.find(
        (us) => us.name === user.name && us.room === user.room
      );
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
