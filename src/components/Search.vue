<template>
  <div class="container">
    <!-- v-model 양방향 데이터 바인딩 -->
    <input 
      v-model="title"
      class="form-control"
      type="text"
      placeholder="Enter the Movie title" 
      @keyup.enter="apply"/><!-- enter key 누르면 apply 메소드 실행 -->
      <div class="selects">
        <!-- 
          v-model 양방향 데이터 바인딩
          $data같은 경우 select 태그가 loop로 이루어져 있어 data명을 직접적으로 명시하지 못해
          v-model="$data[filter.name]"과 같이 배열형태로 데이터바인딩.
        -->
        <select
          v-for="filter in filters"
          v-model="$data[filter.name]"
          :key="filter.name"
          class="form-select">

          <option 
            v-if="filter.name === 'year'"
            value=""><!-- 빈문자 value -->
            All Years
          </option>

          <option
          v-for="item in filter.items"
          :key="item">
          {{ item }}
          </option>
          
        </select>
      </div>
      <button 
        class="btn btn-primary"
        @click="apply">
        Apply
      </button>
  </div>
</template>

<script>

export default {
  data(){
    return {
      title: '',
      type: 'movie',
      number: 10,
      year: '',
      rating:'',
      filters: [
        {//type
          name: 'type',
          items: ['movie','series','episode']
        },
        {//number
          name: 'number',
          items: [10,20,30]
        },
        {//year
          name: 'year',
          items: (()  =>  { //즉시 실행함수
            const years = [];
            const thisYear = new Date().getFullYear();// 최신년도 반환
            for(let i = thisYear; i>=1985; i-=1){
              years.push(i);
            }
            return years;
          })()
          /*즉시실행함수
          (function () {
          //do something 
          })();
          (()=>{

          })();

          */
        },
        // {
        //   name:"rating",
        //   items:[10,20,30,40,50,60,70,80,90,100]
        // }
      ]
    }
  },
  methods: {   
      //Search movies...
      /*
      Store의 Mutations를 실행할 때는 .commit()메소드를, 
      Actions를 실행할 때는 .dispatch() 메소드를 사용.
      */
      /*
      윗 부분에 v-model 양방향 데이터바인딩이 존재하는데
      위 <template></template> select에서 데이터가 갱신되어 v-model에 따른 data () filter를 보면
      title, type, year이 존재하고  select로 인해 값이 바뀔 수 있는데, 
      그렇게 바뀌어진 데이터를 apply라는 메소드가 실행될 때,
      store action이 사용할 수 있게 searchMovies 것에 전달할 수 있어야 한다. 
      */
     async apply() {//search 누르면 movie의 searchMovies에 전달되어 실행(API)
      this.$store.dispatch('movie/searchMovies', {
        title: this.title,
        type: this.type,
        number: this.number,
        year: this.year,
        //rating:this.rating
      })//store의 모듈에 movie.js 안에 searchMovies 
      //payload 안에는 const {title, type, number, year, star} = payload;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  > * { // >자식선택자로 * 전체 선택
    margin-right: 10px;//자식 우측 여백 10
    font-size: 15px;
    &:last-child{//마지막 자식은 우측 여백 0
      margin-right: 0px;
    }
  }
  .selects{
    display: flex;
    select{
      width: 120px;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .btn {
    width: 120px;
    height: 50px;
    font-weight: 700;
    flex-shrink: 0;//지정된 너비보다 줄어드는 것을 방지
  }
  @include media-breakpoint-down(lg){
    display: block;    
    input{
      margin-right: 0;
      margin-bottom: 10px;
    }
    .selects{
      margin-right: 0;
      margin-bottom: 10px;
      select{
        width: 100%;
      }
    }
    .btn{
      width: 100%;
    }
  }
}
</style>