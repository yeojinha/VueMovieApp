<template>
  <header>
    <Logo />
    <div class="nav nav-pills">
      <div v-for="nav in navigations" :key="nav.name" class="nav-item">
        <RouterLink
          :to="nav.href"
          active-class="active"
          :class="{ active: isMatch(nav.path) }"
          @click="clickEventSocket"
          class="nav-link"
        >
          {{ nav.name }}
        </RouterLink>
      </div>
    </div>
    <!-- 
    <RouterLink  
    to="/about"
    class="user"
    >
      <img 
      :src="image" 
      :alt="name"
      />
    </RouterLink>  
     -->
    <div class="user" @click="toAbout">
      <img :src="image" :alt="name" />
    </div>
  </header>
</template>

<script>
import Logo from "~/components/Logo";
import {mapState} from "vuex";

export default {
  components: {
    Logo: Logo,
  },
  data() {
    return {
    
    // user : this.$store.state.user.newUser,
      navigations: [
        {
          name: "Search",
          href: "/",
          
        },
        {
          name: "Movie",
          href: "/movie/tt2005374",
          path: /^\/movie/, // '/movie'
        },
        {
          name:"Chat",
          href:"/index"
        },
        {
          name: "About",
          href: "/about",
        },
      ],
    };
  },
  computed: {
    ...mapState('about',[
      'image',
      'name'
       ])
    // image() {
    //   return this.$store.state.about.image;
    // },
    // name() {
    //   return this.$store.state.about.name;
    // },
  },
  methods: {
    isMatch(path) {
      if (!path) return false      
      else if(path==="/selections"){
        apply();
        
        return path.test(this.$route.fullPath);
        
      }
      return path.test(this.$route.fullPath);
    },
    toAbout() {
      this.$router.replace("/about");
    },
    clickEventSocket(event){
      
      // console.log("Before remove userList on Header: ", this.$store.state.user.users)
      // console.log("This user on Header: ", this.user)
      // this.$store.dispatch('user/userLeave',this.user)
      // localStorage.removeItem(this.user);          
      // console.log("After remove userList on Header: ", this.$store.state.user.users)
      // event.preventDefault();
      // console.log("Header this.$store.websocket: ",this.$store.state.user.stateWebSocket)
      // console.log("Header websocket:  ",this.websocket);
      // console.log("this.$store.state.user.stateWebSocket===WebSocket.OPEN: ",this.$store.state.user.stateWebSocket===WebSocket.OPEN)
     this.websocket=this.$store.state.user.stateWebSocket;
     //TODO 역시ㅓ websocket이 close 작동 안한다.
    //  if(this.websocket.close()){
    //    console.log("on Header web closed")
    //  }else{
    //    console.log("on Hedaer websocket not closed")
    //  }
      console.log("this.websocket on Header: ",this.websocket===WebSocket.OPEN);
      console.log("this.$store.state.user.flag on Header: ",this.$store.state.user.flag)
      if(this.websocket===WebSocket.OPEN && this.$store.state.user.flag===true){
        this.websocket.close()
        this.$store.state.user.flag=false;
      }
      
    }
    
  },
};
</script>

<style lang="scss" scoped>


header {
  height: 70px;
  padding: 40px 40px;
  display: flex;
  align-items: center;
  position: relative;
  .logo {
    margin-right: 40px;
  }
  .user {
    width: 40px;
    height: 40px;
    padding: 6px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: $gray-200;
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 40px;
    margin: auto;
    transition: 0.4s;

    &:hover {
      background-color: darken($gray-200, 10%);
    }
    img {
      width: 100%;
    }
  }
  @include media-breakpoint-down(sm){//줄여서(반응형) 공간 부족 시에 사라지게
    .nav{
      display: none;
    }
  }
}
</style>