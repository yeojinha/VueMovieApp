export default {
  namespaced: true,
  state: {
   newUser:{
     id:null,
     name:'',
     room:''
   },
   users:[],

  },
  getters: {
 
  },
  computed:{
    getRoomUsers(room){
      return state.users.filter(user=> user.room===room);
    },
    getCurrentUser(id){
      return state.users.find(user => user.id === id);
    }
  },
  methods:{
    formatMessage(temp, textTemp) {
    return {
    user:{
      id:temp.id,
      name:temp.name,
      room:temp.room
    },
    text:textTemp,
    time: moment().format('h:mm a')
  };
}
  },
  mutations: {
    newUserRefresh(user){
      state.newUser={...user};
    },
    userJoin(temp){
      const user = temp;
      state.users.push(user);
      console.log(state.users);
      return user;
    
    },
    userLeave(id){
      const idx = state.users.findIndex(user => user.id===id);

      if(idx!==-1){
        return state.users.splice(index,1)[0];//나간유저 반환
      }
      
    }
  },
  actions: {

  }
}
