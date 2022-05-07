<template>
  <Headline />
  <Search />
  <MovieList />
</template>

<script>
import Headline from "~/components/Headline";
import Search from "~/components/Search";
import MovieList from "~/components/MovieList";

export default {
  //Home vue 열릴 때, components 갱신되어야 할 것들 목록 작성.
  //headline, Search, MovieList(초기화면에 목록이 ?기준으로 노출되어야 할 듯.)

  components: {
    Headline,
    Search,
    MovieList,
  },
  created() {
    //store에서 무리
    this.$store.commit("movie/resetMovies"); //mutation의 resetMovies로 상태 변화
    this.$store.state.user.stateWebSocket = new WebSocket(
      "ws://jonghwa220414.herokuapp.com/ws"
    );
    //webSocket의 UniqueID 함수 생성하여 newUser에 전달.
    this.$store.state.user.stateWebSocket.getUniqueID = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + "-" + s4();
    };
  },
  mounted() {
    window.addEventListener("beforeunload", this.unLoadEvent);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.unLoadEvent);
    //todo store에서 flag걸어준다.  chat에 접속하면 flag 1
    if (this.$store.state.user.reloadFlag === true) {
      location.reload();
      this.$store.state.user.reloadFlag = false;
    }
  },
  methods: {
    unLoadEvent: function (event) {
      if (this.isLeaveSite) return;
      event.preventDefault();
      event.returnValue = "";
      localStorage.clear();
    },
  },
};
</script>
