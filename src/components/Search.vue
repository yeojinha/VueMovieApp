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

      <button 
        class="btn btn-primary"
        @click="apply">
        Search
      </button>
      </div>
      
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
          items: [10,20,30,40,50]
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

        },

      ]
    }
  },
  methods: {   

     async apply() {//search 누르면 movie의 searchMovies에 전달되어 실행(API)
      this.$store.dispatch('movie/searchMovies', {
        title: this.title,
        type: this.type,
        number: this.number,
        year: this.year,
      })
    },

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