import {createApp} from 'vue'
import App from './App.vue'
import router from './routes/index.js'
import store from './store/index.js'
import loadImage from './plugins/loadImage.js'

// import io from 'socket.io-client';
// const socket = io('http://localohst:3000');

// Vue.prototype.$socket = socket;
const app = createApp(App)

// app.config.globalProperties.$socket=socket;//socket 전역변수화

app.use(router)// $route, $router
  .use(store) // $store
  .use(loadImage) // $loadImage
  .mount('#app') //