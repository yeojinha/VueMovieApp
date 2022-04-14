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
     this.websocket=this.$store.state.user.stateWebSocket;
     //TODO 역시ㅓ websocket이 close 작동 안한다.
    //  console.log("flag on Header: ",this.$store.state.user.flag);
    //  console.log("Store websocke readyState: ",this.$store.state.user.stateWebSocket.readyState)
    
      if(this.websocket===null){
          return;
      }
      else if(this.websocket.readyState===WebSocket.OPEN && this.$store.state.user.flag===true){
        this.websocket.close()
        this.$store.state.user.flag=false;
        console.log("flag on Header inside: ",this.$store.state.user.flag);
        console.log("websocket check on HEADER inside: ", this.websocket.readyState===WebSocket.OPEN)
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