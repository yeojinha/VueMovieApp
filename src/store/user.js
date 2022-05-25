import { ref } from "vue";
export default {
  namespaced: true,
  state: {
    stateWebSocket: null,
    reloadFlag: false,
    flag: false,
    temp: undefined,
    lengthOfList: 0,
    mutationFlas: 0,
    newUser: {
      name: "",
      room: "",
      new: true,
      fresh: true,
      leaving: undefined,
      entering: false,
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
      return state.users;
    },
  },
  methods: {},
  mutations: {
    putUser(state, user) {
      state.mutationFlas++;
      state.users.push(user);
      console.log("users array on putUser: ", state.users);
    },
    pullUser(state, user) {
      console.log("before pull User on pullUser: ", state.users);
      this.$store.state.user.lengthOfList--;
      state.mutationFlas--;
      state.temp = state.users.find(
        (us) => us.name === user.name && us.room === user.room
      );
      console.log("found user: ", temp);
      const index = state.users.indexOf(temp);
      console.log("index: ", index);
      if (index !== -1) {
        state.pulledUser = state.users.splice(index, 1)[0];
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
