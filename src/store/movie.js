import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = " "

export default {
  //module!
  namespaced: true,
  //data!
  state: () => ({
      movies: [],
      message: _defaultMessage,
      loading: false,
      theMovie: {}
    })
    /*()=>{
       return{
         movies:[]
       }
     }*/
    ,
  //computed!
  getters: {
    // movieIds(state){//state 안에 있는 movies를 가져오기
    //   return state.movies.map(m=>m.imdbID)
    // }
  },
  //methods
  //변이!
  mutations: { //mutations에서만 state에 있는 데이터를 변경할 수 있다.
    updateState(state, payload) { //통합적으로 data 변경
      //payload로 어떤 data 들어올 수 있는지 

      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
        //아래의 내용과 같다.
        /*
        state.movies = payload.movies
        state.message = payload.message
        state.loading = payload.loading
        */
      }) //Object.keys 객체데이터의 속성의 이름으로 새로운 배열을 반환

      /*
      ['movies','message','loading'] 형태로 반환  
      */
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  },
  //비동기
  actions: {
    /*
    1. actions라는 것으로 실제 데이터 변환위해 commit이라는 메소드로 mutations 메소드를 실행
    2. context.commit()에서 아래의 경우, mutations 메소드중 'updataState'를 실행하고 
    3. 인자중 payload라는 변수에 들어갈 데이터들을 아래와 같은데
    */
    async searchMovies({
      state,
      commit
    }, payload) {
      if(state.loading){//실행중(영화목록 가져오는 중인데, 또 누르면)이면 return하여 검색 종료
        return
      }
      commit('updateState', {
        message: '',//message 초기화
        loading: true
      })
      try {
        /*
        Search.vue에서 movie.js의 searchMovies 실행, 안의 tile외 3개 객체는
        payload
        this.$store.dispatch('movie/searchMovies', {
          title: this.title,
          type: this.type,
          number: this.number,
          year: this.year
        })
        */
        // const {
        //   title,
        //   type,
        //   number,
        //   year
        // } = payload; //객체 구조 분해 할당 함.
        //const OMDB_API_KEY = "7035c60c";
        const res = await _fetchMovies({
          ...payload,
          page: 1
        })
        const {
          Search,
          totalResults
        } = res.data



        commit('updateState', { //payload에 들어가는 객체 데이터들  
          movies: _uniqBy(Search, 'imdbID') //영화정보를 mutation updateState통하여 state의 movies에 갱신
        })
        console.log(totalResults) // 340
        console.log(typeof totalResults) // string

        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10) //340개 데이터라면, 340/10 =34 총 34페이지


        // 추가 요청
        if (pageLength > 1) {
          for (let page = 2; page <= pageLength; page += 1) {
            if (page > payload.number / 10) { //number은 한 페이지에 출력되는 데이터 개수로 10,20,30 중에 선택 가능한데, 
              break
            }
            const res = await _fetchMovies({
              ...payload,
              page: page
            })
            const {
              Search
            } = res.data;

            commit('updateState', {
              //movies: Search 하면 기존의 데이터에 덮어씀
              movies: [...state.movies, ..._uniqBy(Search, 'imdbID')] //전개연산자 이용해서 기존의 데이터와 Search 데이터, movies에 재할당
              //_uniqBy(Search, 'imdbID') 
              /*
              uniqBy(객체,'요소명') 객체의 요소명에서 중복되는 요소값을 제거하여 반환 Set과 동일
              */

            })

          }
        }
      } catch (error) {
        commit('updateState', {
          movie: [],
          message: error.message
        })
      }finally{
        commit('updateState',{
          loading: false//검색 종료 
        })
      }
    },
    async searchMovieWithId({state, commit}, payload){
      if(state.loading) return //로딩하면 
      
      commit('updateState',{
        theMovie: {},
        loading: true,
      })

      try {
        const res = await _fetchMovies(payload);
        console.log(res.data)
        commit('updateState',{
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState',{
          theMovie:{}
        })
      }finally{
        commit('updateState',{
          loading: false
        })
      }
    }
  }
}

async function _fetchMovies(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}