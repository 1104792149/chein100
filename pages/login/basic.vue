<template>
  <view class="page status">

    <navigation-bar title="基本信息" custom-left @back="back"></navigation-bar>

    <image class="avatar" :src="headImg || '../../static/login/add.png'" @click="uploadImage"></image>

    <input placeholder="昵称" placeholder-style="color: #999999" v-model="nickName" maxlength="20" />

		<view class="line"></view>

    <button class="btn-primary" @click="submit" :disabled="!isValid">提交</button>

  </view>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
import store from '@/js/store'
export default {
  name: "basic",
  components: {NavigationBar},
  data() {
    return {
      headImg: '',
      nickName: '',
    };
  },

  computed: {
    isValid () {
      return this.headImg && this.nickName;
    }
  },

  methods: {
    uploadImage () {
      uni.chooseImage({
        count: 1,
        success: res => {
          const file = res.tempFiles[0];
          this.uploadFile(file).then(url => {
            this.headImg = url;
          });
        }
      });
    },

    submit () {
      if (!this.nickName) {
        this.showToast('请输入昵称');
        return;
      }
      if (!this.headImg) {
        this.showToast('请选择头像');
        return;
      }

      uni.showLoading();
      this.$api.modifyUserInfo({
        nickName: this.nickName,
        headImg: this.headImg,
      }).then(result => {
        uni.hideLoading();
        this.showToast('设置成功');
        setTimeout(() => {
          uni.switchTab({ url: '/pages/hot/hot' });
        }, 1000);
      }).catch(error => {
				uni.hideLoading();
				if(error.code!='1005'){
					 this.showError(error);
				}
      })
    },

    back () {
      store.logout();
    },

  }
};
</script>

<style lang="less" scoped>

  .page {
    text-align: center;
  }

  image {
    width: 188upx;
    height: 188upx;
    margin-top: 102upx;
    margin-bottom: 185upx;
  }

  input {
    font-size:42upx;
		line-height: 42upx;
		height: 70upx;
    // color:rgba(53,153,153,1);
    // padding-bottom: 30upx;
		// margin-bottom: 30upx;
    position: relative;
    color: #222;
    // margin: 0 64upx 267upx;

//     &:after {
//       content: '';
//       position: absolute;
//       width: 80upx;
//       height: 2upx;
//       background: #f2f2f2;
//       bottom: 0;
//       left: 50%;
//       transform: translateX(-50%);
//     }

  }
	
	.line {
		width: 80upx;
		height: 2upx;
		background: #f2f2f2;
		margin: 15upx auto 267upx;
	}
	

  button {
    font-size:36upx;
    height:140upx;
    line-height:140upx;
    margin: 0 70upx;
    border-radius: 70upx;
  }

  .avatar {
    border-radius: 50%;
  }

</style>
