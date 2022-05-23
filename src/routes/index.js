import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./Home.vue";
import Movie from "./Movie.vue";
import About from "./About.vue";
import NotFound from "./NotFound.vue";
import Index from "../components/index.vue";
import Chat from "../components/chat.vue";
//src\routes\public\css\js\chat.html

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    //이동시 scroll 맨 위로 설정
    // always scroll to top
    return { top: 0 };
  },
  routes: [
    //아래 이름을 이동
    {
      path: "/", //page 구분
      component: Home, //
      name: "Home",
    },
    {
      path: "/movie/:id",
      component: Movie,
      name: "Movie",
    },
    {
      path: "/chat",
      component: Chat,
      name: "Chat",
    },
    {
      path: "/about",
      component: About,
      name: "About",
    },
    {
      path: "/index",
      component: Index,
      name: "Index",
    },
    {
      path: "/:notFound(.*)",
      component: NotFound,
      name: "NotFound",
    },
    // {
    //   path: "/",
    //   component: Home,
    //   beforeEnter(to, from, next) {
    //     window.location.href =
    //       "https://hardcore-cori-ba34bc.netlify.app/#/Home";
    //   },
    // },
  ],
  methods: {
    socketClose() {
      this.socket = this.$store.state.user.stateWebSocket;
      // this.socket.close();
      this.socket.close();
    },
  },
});
