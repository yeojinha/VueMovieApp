<template>
<!-- RouterLink는 a 태그로 변환된다 -->
  <RouterLink 
    to="/" 
    class="logo">
    <span>Movies</span>.COM
  </RouterLink>  
</template>

<style lang="scss" scoped>


  .logo {
    font-family: $fontStyle;
    font-size: 20px;
    color: $black;//main.scss에서 가져온 $black
    text-decoration: none;
    &:hover {
      color:$black;
    }
    span {
      color: $primary;
    }
  }
</style>