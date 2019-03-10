

<template>
  <view class="page login">

    <view
            id="phone"
            checked="checked"
    >
      <input
              style="color: #222222"
              v-model="phone"
              maxlength="11"
              name="phone"
              type="number"
              placeholder-style="color: #999"
              placeholder="手机号码"
      >
    </view>
    <!--<view id="msgCode">-->
    <!--&lt;!&ndash;长度6位限制-->
    <!--maxlength="6" &ndash;&gt;-->
    <!--<input-->
    <!--v-model="msgCode"-->
    <!--name="msgCode"-->
    <!--type="number"-->
    <!--maxlength="6"-->
    <!--placeholder-style="color: #999"-->
    <!--placeholder="输入验证码"-->
    <!--&gt;-->
    <!--<span class="get-msgCode">-->
    <!--<p-->
    <!--v-if="isCanSend"-->
    <!--@click="getCode"-->
    <!--&gt;获取验证码</p>-->
    <!--<p-->
    <!--v-else-->
    <!--class="count_down"-->
    <!--&gt;{{ countDown }}s</p>-->
    <!--</span>-->
    <!--</view>-->
    <view id="password">
      <input
              v-model="password"
              maxlength="18"
              name="password"
              :password="!showPassword"
              placeholder-style="color: #999"
              @focus="showToast('请输入6-18位数字与字母组合')"
              placeholder="输入密码"
      >
      <view class="right" @click="showPassword = !showPassword">
        <image
                class="icon ic-eye"
                :class="{ 'ic-eye-on': showPassword }"

        ></image>
      </view>
    </view>
    <view
            @click="forgetPassword"
            class="forget_password"
    >忘记密码</view>
    <button
            @click="now_login"
            class="now_login btn-primary"
            :disabled="!isValid"
    >立即登录</button>
    <view class="footer-info">
      <text>没有账号?</text>
      <view @click="register" class="now_reg">立即注册</view>
    </view>

    <alert-dialog ref="dialog"></alert-dialog>

  </view>
</template>
<script>
  import config from '@/js/config'
  import NavigationBar from "../../components/NavigationBar";
  const COUNT_DOWN_S = 60;
  import store from '@/js/store';
  import AlertDialog from "../../components/AlertDialog";
  export default {
    components: {AlertDialog, NavigationBar},
    data() {
      return {
        phone: "",
        form: {
          phone: "",
          password: "123123a",
          msgCode: "678191"
        },
        isCanSend: true,
        countDown: COUNT_DOWN_S,
        countDownIntervalId: 0,

        password: '',
        msgCode: '',
        showPassword: false
      };
    },

    computed: {
      isValid () {
        if (!this.phone) return false;
        if (!this.password) return false;
        return true;
      }
    },

    mounted () {
      this.phone = store.getPhone() || '';
    },

    onShow () {
      if (uni.getStorageSync('loginPasswordReset')) {
        this.msgCode = '';
        this.password = '';
        uni.removeStorageSync('loginPasswordReset');
      }
    },

    methods: {
      getCode() {
        if (!this.phone) {
          this.showToast("手机号码不能为空!");
          return false;
        } else if (
                !this.phone.match(
                        /^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/
                )
        ) {
          this.showToast("请输入正确的电话号码!");
          return false;
        }
        {
          uni.showLoading({ title: "请求发送中" });
          this.$api.getCode(this.phone).then(result => {
            setTimeout(() => {
              this.isSend = true;
              this.isCanSend = false;
              uni.hideLoading();
              this.startCountDown();
            }, 200);
          }).catch(error => {
            uni.hideLoading();
						if(error.code!='1005'){
							this.showError(error);
						}
          });
        }
      },
      startCountDown() {
        this.countDown = COUNT_DOWN_S;
        this.countDownIntervalId = setInterval(() => {
          this.countDown -= 1;
          if (this.countDown === 0) {
            clearInterval(this.countDownIntervalId);
            this.isCanSend = true;
          }
        }, 1000);
      },

      forgetPassword () {
        this.navigateTo('/pages/mine/LoginPasswordReset', { type: 'login', phone: this.phone })
      },

      // 点击登录

      now_login() {
        if (!this.phone) {
          this.showToast("手机号码不能为空!");
          return false;
        } else if (
                !this.phone.match(
                        /^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/
                )
        ) {
          this.showToast("请输入正确的电话号码!");
          return false;
        } else if (!this.password) {
          this.showToast("密码不能为空!");
          return false;
        }
        uni.showLoading();
        this.$api
                .login(this.phone, this.password)
                .then(result => {
                  store.updateToken(result.token);
                  store.updatePhone(this.phone); // 保存本次登录的手机号
									store.updateLaunch();
                  // 如果用户未曾设置过用户名
                  // 跳转至基础设置
                  if (Number(result.nickName) === 0) {
                    this.redirectTo('./basic');
                  } else {
                    uni.switchTab({ url: '/pages/hot/hot' });
                  }
                  uni.hideLoading();
                }).catch(error => {
									uni.hideLoading();
									if(error.code!='1005'){
										this.showToast(error ? error.message || error : '请检查网络是否连接');
									}
								});

      },

      register () {
        if (this.isActivityOpen) {
          this.navigateTo('/pages/login/register')
        } else {
          uni.showModal({
            title: '提示',
            content: `新用户注册将于${this.formatDate(config.START_TIME, 'M月D日')}正式开放`,
            showCancel: false,
          });
        }
      },

    }
  };
</script>
<style lang="less" scoped>
  .login {
    margin-right: 70upx;
    margin-left: 70upx;
    color: #999999;
    font-size: 32upx;
    #phone {
      line-height: 45upx;
      margin-top: 203upx;
      margin-bottom: 35upx;
      border-bottom: 1upx solid #F2F2F2;
      input {
        padding: 25upx 0;
      }
    }
    #msgCode {
      position: relative;
      line-height: 45upx;
      border-bottom: 1upx solid #F2F2F2;
      input {
        padding: 25upx 0;
      }
      .get-msgCode {
        font-size: 28upx;
        float: right;
        color:rgba(34,34,34,1);
        p {
          position: absolute;
          top: 50%;
          right: 10upx;
          z-index: 2;
          transform: translateY(-50%);
          // margin-top: -75upx;
        }
      }
    }

    #password {
      line-height: 45upx;
      margin-top: 40upx;
      border-bottom: 1upx solid #F2F2F2;
      position: relative;
      input {
        padding: 25upx 0;
      }
      .eye {
        width: 34upx;
        height: 24upx;
        position: absolute;
        top: 50%;
        right: 10upx;
        transform: translateY(-50%);
        z-index: 2;
      }
    }
    .forget_password {
      font-size:28upx;
      margin-top: 44upx;
      float: right;
      border: none;
    }
    .now_login {
      margin-top: 300upx;
      margin-bottom: 74upx;
      width: 610upx;
      height: 140upx;
      font-size: 36upx;
      color: rgba(111, 79, 43, 1);
      line-height: 140upx;
      border-radius: 70upx;
    }
    .footer-info {
      text-align: center;
      font-size:28upx;
      .now_reg {
        display: inline-block;
        margin-top: 44upx;
        border: none;
        color: #222222;
      }
    }
    .right {
      position: absolute;
      right: -10upx;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9;
      padding: 20upx;
    }
    .icon {
      width: 34upx;
      height: 24upx;
      background-size: 100% 100%;
    }
  }
  .count_down {
    color: #999999;
  }
  input {
    color: #222222;
  }
</style>
