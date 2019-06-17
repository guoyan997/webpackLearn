<template>
  <div id="app">
   <div class="vue-box">{{message}}</div>
      <div>现在的环境是：{{evn}}</div>
   <!--<div>{{process.env.VUE_BASE_URL}}</div>-->
  <!--<div>{{test1 + test2}}</div>-->
   <div class="img-box">123</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: '123456',
      evn: process.env.NODE_ENV
    }
  },
  methods: {
  },
  mounted () {
      if (process.env.NODE_ENV === 'production') {
      } else {
      }
      // console.log(PRODUCTION, VERSION, BROWSER_SUPPORTS_HTML5, TWO, process.env);
  }
}
</script>

<style lang="scss">
@import 'index.scss';
@import './assets/scss/rem.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: px2rem(60);
  .vue-box {
    width: 200px;
    height: 200px;
    color: #fff000;
    margin-left: px2rem(80);
    background-color: $font-color;
    @extend %message-common;
    @include border-radius(10px);
  }
  .img-box {
    width: 100%;
    height: px2rem(400);
    // background: url('./assets/imgs/test.png') no-repeat;
     background-image:url('./assets/imgs/test.png');
     background-position: top left;
     background-repeat: no-repeat;
     background-size: cover;
     // filter: blur(90px);
     -webkit-filter: blur(2px); /* Chrome, Safari, Opera */
     filter: blur(2px);
     opacity: 0.6;
  }
    // 这里是没有用到的css
    .nouse {
        width: 100px;
        background: #fff000;
    }
}

</style>
