// 登录0页
<template>
  <view class="page zero">
    <image class="logo" src="../../static/login/logo2x.png"></image>
    <image class="mark" src="../../static/login/CHAIN@2x.png"></image>
    <image class="versions" src="../../static/login/versions@2x.png"></image>
    <button class="register btn-primary" @click="navigateTo('./login')">登录</button>
    <button class="login" @click="register">注册</button>
  </view>
</template>

<script>

  import config from '@/js/config'

    export default {

      methods: {
        register () {
          if (this.isActivityOpen) {
            this.navigateTo('./register')
          } else {
            uni.showModal({
              title: '提示',
              content: `新用户注册将于${this.formatDate(config.START_TIME, 'M月D日')}正式开放`,
              showCancel: false,
            });
          }
        },
      },

    }
</script>

<style lang="less" scoped>
  .zero {
    width:  100vw;
    height: 100vh;
    background-color: #242A34;
    text-align: center;

    .logo {
      width:  103upx;
      height: 115upx;
      display: inline-block;
      margin: 150upx auto 87upx;
    }
    .mark {
      display: block;
      width:  260upx;
      height: 36upx;
      margin: 0 auto;
      margin-bottom: 38upx;
    }
    .versions {
      width:  480upx;
      height: 70upx;
    }
    .register {
      width:  610upx;
      height: 140upx;
      line-height: 140upx;
      margin-top:    196upx;
      margin-right:  70upx;
      margin-bottom: 60upx;
      margin-left:   70upx;
      font-size: 36upx;
      color: #6F4F2B;
      border-radius: 70upx;
    }
    .login {
      width:  610upx;
      height: 140upx;
      line-height: 140upx;
      border: 2upx solid #C9A675;
      font-size: 36upx;
      color: #C9A675;
      background-color: #242A34;

      border:2upx solid rgba(201, 166, 117, 1);
      border-radius:70px;

    }
  }
</style>
