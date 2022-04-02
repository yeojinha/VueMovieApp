import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './Home.vue';
import Movie from './Movie.vue';
import About from './About.vue';
import NotFound from './NotFound.vue';
import Index from '../components/index.vue';
import Chat from '../components/chat.vue';
//src\routes\public\css\js\chat.html

export default createRouter({
  // Hash모드는 #들어간 것으로 들어가기
  // https://google.comm/#/search
  history: createWebHashHistory(),
  scrollBehavior() {
    //이동시 scroll 맨 위로 설정
    // always scroll to top
    return { top: 0 };
  },
  routes: [
    //아래 이름을 이동
    {
      path: '/', //page 구분
      component: Home, //
    },
    {
      path: '/movie/:id',
      component: Movie,
    },
    {
      path: '/chat',
      component: Chat,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/index',
      component: Index,
    },
    {
      path: '/:notFound(.*)',
      component: NotFound,
    },
  ],
});
