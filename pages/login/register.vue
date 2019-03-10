
<template>
  <view class="page register">

    <view
      id="phone"
      checked="checked"
    >

      <input
        v-model="form.phone"
        maxlength="11"
        name="phone"
        type="number"
        placeholder="手机号码"
      >
    </view>
    <view id="msgCode" >
      <!--长度6位限制
        maxlength="6" -->
      <input
			
        v-model="form.msgCode"
        name="msgCode"
        type="number"
        maxlength="6"
        placeholder="输入验证码"
      >
      <span class="get-msgCode">
        <p
          v-if="isCanSend"
          @click="getCode"
          style="z-index: 99999;"
        >获取验证码</p>
        <p
          v-else
          class="count_down"
        >{{ countDown }}s</p>
      </span>
    </view>
    <view id="password">
      <input
        v-model="form.password"
        maxlength="18"
        name="password"
        :password="!showPassword"
        placeholder="输入密码"
        @focus="showToast('请输入6-18位数字与字母组合')"
      >
      <view class="right">
        <image
                class="icon ic-eye"
                :class="{ 'ic-eye-on': showPassword }"
                @click="showPassword = !showPassword"
        ></image>
      </view>

    </view>
    <view id="confirmPassword">
      <input
        v-model="form.confirmPassword"
        maxlength="18"
        name="confirmPassword"
        :password="!showconfirmPassword"
        @blur="checkConfirmPassword"
        placeholder="确认密码"
        @focus="showToast('请输入6-18位数字与字母组合')"
      >
      <view class="right">
        <image
                class="icon ic-eye"
                :class="{ 'ic-eye-on': showconfirmPassword }"
                @click="showconfirmPassword = !showconfirmPassword"
        ></image>
      </view>

    </view>
    <view
      id="inviteCode"
    >
      <input
        v-model="form.inviteCode"
        name="inviteCode"
        maxlength="6"
        placeholder="邀请码（必填）"
      >
    </view>

    <button
      @click="create"
      :disabled="!isValid"
      class="create btn-primary"
    >创建账号</button>
    <view class="footer-info">
      <text>已有账号?</text>
      <view
        @click="navigateTo('./login')"
        class="now_reg"
      >立即登录</view>
    </view>
  </view>
</template>
<script>
import NavigationBar from "../../components/NavigationBar";
const COUNT_DOWN_S = 60;
import store from '@/js/store'
export default {
  components: {NavigationBar},
  data() {
    return {
      phone: "",
      form: {
        phone: "",
        password: "",
        msgCode: "",
        inviteCode: "",
        confirmPassword: "",
      },
      isCanSend: true,
      countDown: COUNT_DOWN_S,
      countDownIntervalId: 0,

      Password: false,
      showPassword: false,
      showconfirmPassword: false,
			register_status:true
    };
  },

  computed: {
    isValid () {
      if (!this.form.phone) return false;
      if (!this.form.password) return false;
      if (!this.form.msgCode) return false;
      if (!this.form.inviteCode) return false;
      if (!this.form.confirmPassword) return false;
			if(!this.register_status) return false;
      return true;
    },
  },

  methods: {
    getCode() {
      if (!this.form.phone) {
        this.showToast("手机号码不能为空!");
        return false;
      } else if (
        !this.form.phone.match(
          /^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/
        )
      ) {
        this.showToast("请输入正确的电话号码!");
        return false;
      }
      {
        uni.showLoading({ title: "请求发送中" });
				this.register_status=false;
        this.$api.getCode(this.form.phone).then(result => {
						this.isSend = true;
            this.isCanSend = false;
            uni.hideLoading();
            this.startCountDown();
        }).catch(error => {
						this.register_status=true;
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
				this.register_status=true;
      }, 1000);
    },
    create () {
      if (!this.form.phone) {
        this.showToast("手机号码不能为空!");
        return false;
      } else if (
        !this.form.phone.match(
          /^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/
        )
      ) {
        this.showToast("请输入正确的电话号码!");
        return false;
      } else if (!this.form.msgCode) {
        this.showToast("验证码不能为空!");
        return false;
      } else if (!this.form.password) {
        this.showToast("秘密不能为空!");
        return false;
      } else if (
        !this.form.password.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/)
      ) {
        this.showToast("请输入6至18位数字与字母组合的密码!");
        return false;
      }else if (this.form.password !== this.form.confirmPassword) {
        this.showToast("两次输入密码不一致,请重新输入!");
        return false;
      } else if (!this.form.inviteCode){
        this.showToast("邀请码不能为空!");
        return false;
      }
      uni.showLoading();
        this.$api.register(this.form)
          .then(result => {
            store.updateToken(result);
            store.updatePhone(this.form.phone);
						store.updateLaunch();
            this.redirectTo("./basic");
            uni.hideLoading();
          }).catch(error => {
            uni.hideLoading();
						if(error.code!='1005'){
							this.showError(error);
						}
          });
      },

    checkConfirmPassword () {
      if (this.form.password !== this.form.confirmPassword) {
        this.showToast("两次输入密码不一致,请重新输入!");
      }
    },

    }
};
</script>
<style lang="less" scoped>
.register {
  margin-right: 70upx;
  margin-left: 70upx;
  color: #999999;
  font-size: 32upx;
  #phone {
    line-height: 45upx;
    margin-top: 50upx;
    margin-bottom: 33upx;
    border-bottom: 1upx solid #f2f2f2;
    input {
      padding: 29upx 0;
    }
  }
  #msgCode {
    border-bottom: 1upx solid #f2f2f2;
    position: relative;
    input {
      padding: 29upx 0;
    }
    .get-msgCode {
      font-size: 28upx;
      float: right;
      color:rgba(34,34,34,1);
      p {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10upx;

        z-index: 2;
      }
    }
  }

  #password {
    line-height: 45upx;
    margin-top: 40upx;
    border-bottom: 1upx solid #f2f2f2;
    position: relative;
    input {
      padding: 25upx 0;
    }
    .right {
      position: absolute;
      right: -20upx;
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
  #confirmPassword {
    line-height: 45upx;
    margin-top: 40upx;
    border-bottom: 1upx solid #f2f2f2;
    position: relative;
    input {
      padding: 25upx 0;
    }
    .right {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      z-index: 9;
    }
    .icon {
      width: 34upx;
      height: 24upx;
      background-size: 100% 100%;

    }
  }
  #inviteCode {
		line-height: 45upx;
    margin-top: 40upx;
    border-bottom: 1upx solid #f2f2f2;
    input {
			padding: 25upx 0;
    }
  }
  .create {
    margin-top: 149upx;
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
    font-size: 28upx;
    .now_reg {
      display: inline-block;
      margin-top: 44upx;
      border: none;
      color: #222222;
    }
  }
}

  .count_down {
    color: #999999;
  }

input {
  color: #222222;
}

</style>
