<template>
  <div class="container"> <!--  container
  https://getbootstrap.com/docs/5.1/layout/containers/ 참조
  클래스로 화면크기 변할 때, 뷰포트도 변한다.(가변성) -->
    <h1>
      <span span>Search</span> Movies by Title<br/>
    </h1>
    
  </div>
</template>

<style lang="scss" scoped>

  .container{
    padding-top: 40px;//위쪽에 40px만큼 container 내부 여백줌.
    padding-bottom: 10px;
  }
  h1{//h1 style tag
    line-height: 1;
    font-family: $fontStyle;
    font-size: 100px;
    span {//h1.span style tag
      color: $primary;
    }
  }
  p{//p style tag
    margin: 10px 0;
    color: $gray-600;
  }
</style>