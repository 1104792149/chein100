// 充币页
<template>
  <view class="page recharge" v-if="showqrcode">
    <span class="text">BTA</span>
    <!-- 二维码盒子 -->
    <view class="QrcodeBox">
      <!-- 二维码 -->
      <image class="box" src="../../../static/mine/wallet/qrcode-box.png"></image>
      <image class="qrcode" :src="qrcodeImage"></image>   <!-- 二维码图片 -->
    </view>
    <view class="url">{{url}}</view>
    <button class="copy" @click = "reaCopy">
      <image src="../../../static/mine/wallet/copy.png"></image>
      复制地址
    </button>
   <!-- <button class="save btn-primary" @click = "reaSave">
    <image src="../../../static/mine/wallet/save.png"></image>
    保存二维码
    </button> -->
    <!-- 已复制文本提示框 -->
    <view class="CopyOver">已复制</view>
    <!-- 已保存文本提示框 -->
    <view class="SaveOver">二维码已保存至本地</view>
    <canvas canvas-id="myCanvas" class="canvas"></canvas>
    <!-- 敬请期待 -->
    <!--<status-page status="noOpen"></status-page>-->

  </view>
  <view v-else class="page">
    <image src="../../../static/mine/wallet/hqsb.png" class="noqrcode"></image>
    <view class="noqrcodetext">获取失败！</view>
  </view>
</template>

<script>
  import qrcode from "../../../js/lib/qrcode";
  import NavigationBar from "../../../components/NavigationBar";
  import StatusPage from "../../../components/StatusPage";

  export default {
    name: "recharge",

    components: {
      StatusPage,
      NavigationBar
    },

    data() {
      return {
        url: "",
        visible: false,
        qrcodeImage: '',
        showqrcode:true,//是否显示二维码
				ctx:'',
      };
    },

    mounted() {

    },
    onLoad(options) {
      uni.showLoading();
      this.$api.getMyWallet().then(result => {
        if(result.ADDRESS){
          this.url = result.ADDRESS ;
          this.generateQRCodeImage(this.url);
        }else {
          this.showqrcode = false;
        }
        uni.hideLoading();
      }).catch(error => {
        this.showqrcode = false
        uni.hideLoading();
      });
    },
    onReady(){
      this.ctx = uni.createCanvasContext('myCanvas');
    },
    methods: {

      generateQRCodeImage(val) {
        if(val){
          this.qrcodeImage = qrcode.createQrCodeImg(val, {
            size: 100
          });
        }
      },

      reaCopy() {
        let data = this.url,that = this;
        if(!data){
          return;
        }
        uni.setClipboardData({
          data: data,
          success: function () {
            that.showToast("已复制");
          }
        });
      },

      // 下载二维码
      reaSave() {
        var that = this;
        //每次操作之前先清空画布
        this.ctx.clearRect(0, 0, 230,230);
        //绘画图片
        this.ctx.drawImage(this.qrcodeImage, 0, 0, 230, 230);
        this.ctx.draw();
				console.info( this.ctx)
        uni.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 230,
          height: 230,
          canvasId: 'myCanvas',
          success: function(res) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                that.showToast("二维码已保存至本地");
              },
              fail:function (res) {
                that.showToast("二维码保存失败");
              }
            });
          }
        })

      }

    }
  }
</script>

<style lang="less" scoped>
  .canvas{
    width: 230px;height: 230px;
    display: none;
  }
  .page{
    width: 100vh;
    width: 100%;
  }
  .noqrcode{
    width: 376upx;
    height: 248upx;
    margin: 312upx auto 0upx;
    display: block;
  }
  .noqrcodetext{
    width: 100%;
    text-align: center;
    color: #999999;
    font-size: 24upx;
    margin-top: 10upx;
  }
  .recharge {
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    span {
      width: 100upx;
      height: 38upx;
      position: absolute;
      top: 40upx;
      left: 330upx;
      font-size: 48upx;
    }
    .QrcodeBox {
      position: absolute;
      top: 175upx;
      .box {
        position: absolute;
        margin-left: 134upx;
        width: 482upx;
        height: 482upx;
      }
      .qrcode {
        margin-top: 13upx;
        padding-left: 5upx;
        margin-left: 144upx;
        width: 458upx;
        height: 458upx;
      }

    }
    .url {
      position: absolute;
      top: 725upx;
      left: 138upx;
      text-align: center;
      width: 472upx;
      height: 75upx;
      margin: 0 auto;
      word-wrap:break-word;
      word-break:normal;
    }
    .copy {
      position: absolute;
      margin-left: 67upx;
      top: 880upx;
      font-size: 38upx;
      width: 614upx;
      height: 110upx;
      line-height: 110upx;
      border: 2upx solid #C9A675;
      border-radius: 55upx;
      color: #C9A675;
      image {
        width: 42upx;
        height: 42upx;
        vertical-align:text-bottom;
      }
    }
    .save {
      position: absolute;
      margin-left: 67upx;
      top: 1025upx;
      font-size:38upx;
      width: 614upx;
      height: 110upx;
      line-height: 110upx;
      border-radius: 55upx;
      color: #6F4F2B;
      background: linear-gradient(#D7AB6C, #efc992);
      image {
        width: 42upx;
        height: 42upx;
        vertical-align:text-bottom;
      }
    }

    // 已复制
    .CopyOver {
      display: none;
      position: absolute;
      left: 245upx;
      bottom: 245upx;
      color: #ffffff;
      width:260upx;
      height:78upx;
      line-height: 78upx;
      background:rgba(153,153,153,1);
      opacity:0.7;
      border-radius:39upx;
      font-size: 32upx;
      text-align: center;
    }

    // 已保存
    .SaveOver {
      display: none;
      position: absolute;
      left: 159upx;
      bottom: 245upx;
      color: #ffffff;
      width:432upx;
      height:78upx;
      line-height: 78upx;
      background:rgba(153,153,153,1);
      opacity: 0.7;
      border-radius:39upx;
      font-size: 32upx;
      text-align: center;
    }
  }
</style>
