import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import movie from './movie.js'
import about from './about.js'
import user from './user.js'

export default createStore({//store생성
  modules:{
    movie: movie,
    about: about,
    user: user
  },
  plugins:[
    createPersistedState({
      paths:['user'],
    })
  ]
})