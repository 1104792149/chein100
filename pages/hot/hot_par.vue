<template>
  <view class="page hot_result">

    <view class="cover" v-if="result.img">
      <image class="text_image" :src="result.img"></image>
    </view>

    <view class="text" v-if="result.name">
      <view class="text_title">{{ result.name }}</view>
      <!-- 中心文本的创建信息start -->
      <view class="con_messahe">
        <view class="chain_day">{{result.startDate}}</view>
        <!-- <view class="chain_time">{{result.formatTime}}</view> -->
        <image src="../../static/hot/look.png" class="look"></image>
        <view  class="reader">{{result.readCount||0}}次阅读</view>
      </view >
      <!-- 中心文本的创建信息end -->

      <rich-text   class="richText matter" :nodes="result.content"></rich-text>
    </view>
		<status-page :status="dataStatus" @retry="retry" :fixed="false" ></status-page>
    <share
      ref="share"
      :url="shareUrl"
      :title="result.name"
      :summary="result.name"
      :imageUrl="result.img"
      :visible="visible"
      @close="visible = false">
    </share>
		
  </view>
</template>
<script>
  import Share from '../../components/Share'
  import NavigationBar from '../../components/NavigationBar.vue'
	import StatusPage from "../../components/StatusPage";
  import config from '@/js/config'

  export default {

      name: "hot_result",
      components: {
        NavigationBar,
        Share,
				StatusPage,
      },
    data () {
      return {
        id: '',
        result: {
          img: '',
          name: '',
          formatDay: '',
          formatTime: '',
          readCount: '',
          content: '',
					fileUrl:'',

      },
        visible: false,
				dataStatus:'',
      }
    },

    onBackPress () {
			console.info(11)
      if (this.visible) {
        this.$refs.share.close();
        return true;
      }
    },

    computed: {
			
      shareUrl () {
        return config.SHARE_ACTIVITY_DETAIL_URL + '?id=' + this.id;
      },
      shareSummary () {
        return this.result.name;
      },
    },

    mounted () {
    },

    onNavigationBarButtonTap (e) {
        this.share();
    },

    onLoad (option) {

      const id = option.id;
      this.id = id;
      var formatDate;
			uni.showLoading();
      this.$api.getActivityDetail(id).then(result => {
				uni.hideLoading()
				console.log(result);
				if(result.id){
					this.dataStatus=''
				}else{
					this.dataStatus='empty'
				}
        this.result.img = result.img
        this.result.name = result.name
        this.result.startDate = this.formatDate(result.startDate, 'YYYY-MM-DD HH:mm:ss')
        this.result.readCount = result.readCount
				
// 						if(result.content.indexOf(".jpg")>0){
// 							this.fileUrl=result.content.substring(result.content.indexOf("https"),result.content.indexOf(".jpg")+4)
// 						}
// 						if(result.content.indexOf(".png")>0){
// 							this.fileUrl=result.content.substring(result.content.indexOf("https"),result.content.indexOf(".png")+4)
// 						}
        this.result.content = result.content.replace(/<img/g, '<img style="max-width:100%;height:auto"  ')
      }).catch(error => {
				uni.hideLoading();
				if (error.code !== '1005') {
					this.showError(error);
				}
      })
    },


    methods: {
			//复制  事件 @click="aTap"
			aTap(value){
				console.info(value)
				for (let s in value) {
						console.log(s)
				}
			},
			downloadFile(aa){
				console.info(aa)
				// 保存图片到本地
			let that=this;
			if(this.fileUrl){
				uni.saveImageToPhotosAlbum({
					filePath:  that.fileUrl,
					success: function () {
							uni.showToast({
								title: '已保存',
								duration: 2000
							});
					}
				});
			}else{
				uni.setClipboardData({
				data: that.result.content.replace(/&nbsp;/g,''),
				success: function () {
					uni.showToast({
						title: '复制成功',
						duration: 2000
					});
				}
				});
			}
			},
      share () {
        this.visible = true;
      }
    }
  }


</script>
<style lang="less" scoped>

  .hot_result {

    .share {
      width:  30upx;
      height: 30upx;
      line-height: 30upx;
    }
    .text_image {
      width: 100%;
    }

    .text {
      margin: 0 20upx;
      padding-bottom: 40upx;
      .text_title {
        font-size: 36upx;
        color:rgba(34,34,34,1);
        line-height:46upx;
        margin-bottom: 30upx;
      }
      .con_messahe {
        display: inline-block;
        color: #999999;
        font-size:24upx;
        color:rgba(153,153,153,1);
        line-height: 20px;
        margin-bottom: 46upx;

        .chain_day {
          display: inline-block;
          margin-right: 59upx;
        }

        .chain_time {
          display: inline-block;
        }
        .look {
          display: inline-block;
          width:  34upx;
          height: 24upx;
          margin-left:  59upx;
          margin-right: 20upx;
          vertical-align: middle;
          margin-top: -.2em;
        }
        .reader {
          display: inline-block;
        }
      }
    }

    .matter {
      font-size: 26upx;
      color: #666;
      line-height:48upx;
    }


    .share_box {
      width: 750upx;
      height: 340upx;
      background: #999999;
      ul {
        li {
          width: 240upx;
          display: inline-block;
          list-style:none;
          text-align: center;
        }
      }
    }
  }

  .cover {
    position: relative;
    height: 0;
    width: 100%;
    padding-top: 66.66%;
    margin-bottom: 34upx;

    image {
      position: absolute; left: 0; top: 0; width: 100%; height: 100%;
    }

  }

</style>
