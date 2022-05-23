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
      socketClose();
      localStorage.clear();
    },
    socketClose() {
      this.socket = this.$store.state.user.stateWebSocket;
      let userTemp = this.$store.state.user.thisUser;
      if (this.$store.state.user.flag === true) {
        //!! this.chatUser가 old한 상태 server에 전달되게 하라.
        userTemp.new = false;

        const message = {
          message: `${userTemp.name}님 안녕히가세요!`,
          channel: userTemp.room,
          bot: true,
        };
        if (this.socket.send(JSON.stringify(message)) < 0) {
          console.log("안보내짐 error발생");
        } else {
          if (
            this.socket.send(
              JSON.stringify({
                name: userTemp.name,
                room: userTemp.room,
                bot: false,
                fresh: false, //true -> false
                new: false,
              })
            ) < 0
          )
            console.log("chatUser 안보내짐");
          else {
            console.log("chatUser 보내짐");
          }
          console.log("보내짐");
        }
        setTimeout(function () {
          this.socket.close();
          localStorage.clear();
        }, 2500);
        this.$store.state.user.flag = false;
      }
    },
  },
};
</script>
