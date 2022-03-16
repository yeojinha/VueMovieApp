export default {
  install(app) {
    app.config.globalProperties.$loadImage = (src) => {

      return new Promise((resolve) => {
        const img = document.createElement('img')
        img.src = src
        img.addEventListener('load', () => {//load 끝나면
          // 완료!
          resolve()//resolve 실행
        })
      })
    }
  }
}