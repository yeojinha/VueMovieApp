<template>
  <div class="container"> <!--  container
  https://getbootstrap.com/docs/5.1/layout/containers/ 참조
  클래스로 화면크기 변할 때, 뷰포트도 변한다.(가변성) -->
    <h1>
      <span span>OMDb</span>API<br/>
      THE OPEN<br />
      MOVIE DATABASE<br/>
    </h1>
    <p>
    The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users.<br/>
    If you find this service useful, please consider making a one-time donation or become a patron.
    </p>
  </div>
</template>

<style lang="scss" scoped>

  .container{
    padding-top: 40px//위쪽에 40px만큼 container 내부 여백줌.
  }
  h1{//h1 style tag
    line-height: 1;
    font-family: "Oswald", sans-serif;
    font-size: 80px;
    span {//h1.span style tag
      color: $primary;
    }
  }
  p{//p style tag
    margin: 30px 0;
    color: $gray-600;
  }
</style>