/* 热点页 */
<template>
  <view class="page hot_page">

    <view class="mask"></view>

    <view class="fixed">
      <view class="status-bar"></view>
      <view class="top_tab">
        <text class="last_time">倒计时</text>
        <view class="day" v-if="differenceDay < 0">
          <text>-</text>
          <text>-</text>
          <text>-</text>
        </view>
        <view class="day" v-else>
          <view class="corss_line"></view>

          <text>{{countDownHundred }}</text>
          <text>{{countDownTen }}</text>
          <text>{{countDownOne }}</text>
        </view>
        <!--<text class="last_day">{{day}}</text>-->
        <text class="last_time1">天</text>
      </view>
    </view>

    <view class="empty-area"></view>

    <view class="cover" style="width: 100%">
      <image class="top_image" :src="top.img" @click="openActivityDetail(top)" lazy-load ></image>
    </view>


    <view class="main_image">
			<label   v-for="(activity,index) in middleList" :key='index'>
				 <view class="item" @click="openActivityDetail(activity)">
				  <image :src="activity.img" lazy-load ></image> 
				
				  <text class="title">{{ activity.name }}</text>
				</view>
			</label>
    </view>

    <view class="chain-calendar">
      <view class="title">CHAIN日历</view>

      <view class="activity-list">
				<label v-for="(activity,index) in activityList" :key="activity.id">
        <view class="activity"  :class="{ today: activity._isToday }" @click="openActivityDetail(activity)">

          <!-- 今日 -->
          <view class="datetime today" v-if="activity._isToday">
            <image class="today-flag" lazy-load  src="../../static/hot/today2x.png"></image>
            <view class="time">{{ activity._time }}</view>
          </view>
          <!-- 其他时间 -->
          <view class="datetime" v-else>
            <text class="date">{{ activity._datetime }}</text>
          </view>

          <view class="activity-content">
            <view class="activity-title">{{ activity.name }}</view>
            <view class="footer single-line">
              <text class="author single-line">{{ activity.contentProvider }}</text>
              <text>{{ activity._readCount }}次阅读</text>
            </view>
          </view>

           <image class="activity-cover" lazy-load  :src="activity.img"></image> 
						<!-- <view class="" style="position: relative;width:198upx;height:152upx;">
						<image class="activity-cover"  style="position: absolute;top: 0;left: 0;"  :class="{lazy:!activity.show}" :data-index="index" @load="getImgDone" :src="activity.show?activity.img:''" />
						<image class="placeholder activity-cover" style="position: absolute;top: 0;left: 0;" :class="{loaded:activity.loaded}" :src="placeholderSrc" />
						</view> -->
        </view>
				</label>
      </view>

    </view>

    <view class="tabbar-shadow"></view>

    <uni-load-more :loading-type="loadingType"></uni-load-more>
		<UpdateTheAnnouncement :back='backStatus' :text='announcementText' @announcement='announcementTap'></UpdateTheAnnouncement>
  </view>
</template>

<script>

  import differenceInDays from 'date-fns/difference_in_days'
  import loadMoreMixins from '@/js/mixins/loadMoreMixins';
  import UniLoadMore from "../../components/uni-load-more";
  import utils from '@/js/utils';
  import store from '@/js/store';
  import isToday from 'date-fns/is_today';
	import UpdateTheAnnouncement from '../../components/UpdateTheAnnouncement'

export default {

  components: { UniLoadMore,UpdateTheAnnouncement},

  data() {
    return {
      day: "100",
      image: "",
      main_image: "",
      par: {
        id:"",
        date: "",
        title: "",
        image: "",
        insuer: "",
        reader: ""
      },

      countDown: new Date().getTime(),
      top: {},
      middleList: [],
      activityList: [],

      isForce: false,
      versionContent: '',
			//默认图片
			placeholderSrc: '../../static/hot/60x60.png',
			show: false,
			//是否弹更新公告窗
			backStatus:false,
			announcementText:''
    };
  },

  mixins: [loadMoreMixins],

  onLoad () {
		console.info(1111111)
		console.info(store.isFirstLaunch())
    if (!store.isFirstLaunch()) {
			 setTimeout(()=>{
				  uni.reLaunch({ url: '/pages/guide/Guide' });
			 },500)
      return;
    }
    if (!store.getToken()) {
      uni.reLaunch({ url: '/pages/login/zero' });
      return;
    }
		 //uni.removeStorageSync('announcement');
		// 弹窗且记录状态
		if(!store.getAnnouncement()){
			//获取弹窗内容
			this.startWindow();
		}
    // TODO: 可以换一种方式，减少请求，后续有时间再优化
    // 检查是否已经设置过昵称
    this.$api.getUserInfo().then(result => {
      store.updateUser(result);
      if (!result.nickName) {
        this.redirectTo('/pages/login/basic');
      }
    }).catch(err=>{})
  },
	onPageScroll() {
		this.load()
	},
  onBackPress () {
    if (this.isForce) {
      this.showModal();
      return true;
    }
  },

  onPullDownRefresh () {
    this.loading = true;
    this.baseFetch();
    this.fetch();
  },

  mounted () {
    this.fetch();
  },

  onShow () {
		if (!this.show) {
			this.show = true
			setTimeout(() => {
				this.load()
			}, 100)
		}
    this.baseFetch();
  },

  computed: {
    differenceDay () {
      return differenceInDays(new Date(), this.countDown);
    },
    countDownDay () {
      return Math.max(100 - this.differenceDay, 0);
    },
    countDownOne () {
      return parseInt(this.countDownDay % 10);
    },
    countDownTen () {
      return parseInt((this.countDownDay % 100) / 10);
    },
    countDownHundred () {
      return parseInt((this.countDownDay % 1000) / 100);
    },
  },

  methods: {
		announcementTap(){
			//关闭弹窗
			this.backStatus=false;
		},
		//获取更新弹窗内容
		startWindow(){
			this.$api.startWindow().then(res=>{
				console.info(res)
				if(res){
					this.announcementText=res
					store.upAnnouncement(true);
					this.backStatus=true;
				}
			}).catch(error=>{
				this.loadMoreErrorHandle(error)
			})
		},

    baseFetch () {
      // 获取倒计时
      this.$api.getActivityCountDown().then(result => {
					this.countDown = result;
					this.baseFetch2()
      });
    },
		baseFetch2(){
			 // 获取顶部
			this.$api.getActivityTop().then(result => {
					 this.top = result;
					 this.baseFetch3()
			});
		},
		baseFetch3(){
			 this.$api.getActivityMiddle().then(result => {
					this.middleList = result; 
			})
		},
		load() {
			uni.createSelectorQuery().selectAll('.lazy').boundingClientRect((images) => {
				images.forEach((image, index) => {
						this.activityList[image.dataset.index].show = true;
				})
			}).exec()
		},
		getImgDone(e) {
			this.activityList[e.target.dataset.index].loaded = true
		},
    fetch () {
      this.$api.getActivityList(this.currentPage).then(result => {
        uni.stopPullDownRefresh()
        if (this.currentPage === 0) {
          this.activityList = [];
        }
        result.list.forEach((item, index) => {
          item._datetime = this.formatDate(item.startDate, 'YYYY-MM-DD HH:mm:ss')
          item._isToday = isToday(item.startDate)
          item._time = this.formatDate(item.startDate, 'HH:mm:ss')
          item._readCount = utils.addChineseUnit(item.readCount);
					item.show = false;
					item.loaded = false;
        })
				
        this.loadMoreSuccessHandle(result.list);
        this.activityList = this.activityList.concat(result.list);
      }).catch(error => {
        this.loadMoreErrorHandle(error)
      })
    },

    addChineseUnit (count) {
      const result = utils.addChineseUnit(count);
      return result
    },

    openActivityDetail (activity) {
      activity.readCount = activity.readCount + 1;
      activity._readCount = utils.addChineseUnit(activity.readCount);
      this.navigateTo('./hot_par', { id: activity.id })
    }

  }

};

</script>


<style lang="less" scoped>
.placeholder {
		opacity: 1;
		transition: opacity 0.3s linear;
	}

	.placeholder.loaded {
		opacity: 0;
	}
	
.empty-area {
  height: 90upx;
}

.hot_page {
  padding-top: var(--status-bar-height);
  background-color: #ffffff;
  overflow-x: hidden;

  .corss_line {
    position: absolute;
    left: 0upx;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    border-top: 2upx solid #0f0f0f;
  }
  .top_tab {
    /*padding: 5upx 0;*/
    color: #222222;
    text-align: center;
    font-size: 32upx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90upx;
    box-sizing: border-box;

    .last_day {
      color: #c9a675;
      height: 62upx;
      line-height: 62upx;
      border-width: 120upx;
      background-color: #222222;
      display: inline-block;
      margin-left: 5upx;
      margin-right: 5upx;
    }
    .day {
      display: flex;
      margin: 0 8upx;
      position: relative;
      text {
        display: inline-block;
        width: 42upx;
        height: 60upx;
        line-height: 60upx;
        background: rgba(34, 34, 34, 1);
        border-radius: 4upx;
        font-size: 46upx;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(201, 166, 117, 1);
        & + text {
          margin-left: 2upx;
        }
      }
    }
  }
  .top_image {
    width: 100%;
  }

  .fixed {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
    background-color: #ffffff;
    .status-bar {
      height: var(--status-bar-height);;
      width: 100%;
    }

  }

  .main_image {
    display: flex;
    flex-direction: inherit;
    padding: 30upx 30upx 0 30upx;
    justify-content: space-between;

    .item {
      position: relative;
      width: 216upx;
      height: 144upx;
    }
		
    image {
      width: 216upx;
      height: 144upx;
      border-radius: 4upx;
      margin-right: 18upx;
			opacity:0;
			transition: opacity 0.4s linear;
    }
		image {
		 opacity:1;
		}
    image:last-child {
      margin-right: 0;
    }

    text {
      position: absolute;
      bottom: 12upx;
      width: 100%;
      z-index: 2;
      padding-left: 14upx;
      padding-right: 30upx;
      box-sizing: border-box;

      font-size:16upx;
      color:rgba(255,255,255,1);
      line-height:24upx;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

  }

}


.chain-calendar {


  .title {
    font-size:30upx;
    font-weight:bold;
    color:rgba(34,34,34,1);
    padding: 0 30upx;
    margin: 30upx 0;

    &:before {
      content: "";
      display: inline-block;
      width:6upx;
      height:20upx;
      background:rgba(201,166,117,1);
      border-radius:3upx;
      margin-right: 22upx;
    }
  }
}


.activity-list {
  padding: 0 15upx;
}
.activity {
  display: flex;
  box-sizing: border-box;
  padding-right: 10upx;

  &.today {
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 11px 1px rgba(201,167,118,0.3);
    border-radius:4px;
  }

  .datetime {
    width: 155upx;
    font-size:20upx;

    padding-top: 20upx;
    padding-bottom: 20upx;

    color:rgba(34,34,34,1);
    line-height:30upx;
    border-right: 3upx solid rgba(242,242,242,1);;
    color: #222222;
    padding-left: 20upx;

    .today-flag {
      width: 98upx;
      height: 32upx;
      margin-bottom: 8upx;
      display: block;
    }
    .time {
      line-height: 18upx;
    }

    &.today {
      border-color: #C9A675;
      .time {
        color: #C9A675;
      }
    }

    .date {

    }
  }


  .activity-content {
    padding-left: 20upx;
    padding-top: 20upx;
    padding-bottom: 20upx;

    flex: 1;
    position: relative;

    .activity-title {
      font-size:28upx;
      color:rgba(34,34,34,1);
      line-height:40upx;
      margin-bottom: 20upx;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .footer {
      font-size:18upx;
      color:rgba(153,153,153,1);
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 20upx;
      right: 0;
      left: 20upx;
      .author {
        width: 150upx;
      }
    }

  }

  .activity-cover {
    width:168upx;
    height:112upx;
    border-radius:4px;

    margin-left: 30upx;

    padding-top: 20upx;
    padding-bottom: 20upx;

  }

  &.today {
    .activity-title {
      font-size: 30upx;
    }
    .activity-cover {
      width:180upx;
      height:120upx;
    }
  }

}


.cover {
  position: relative;
  height: 0;
  padding-top: 66.66%;

  image {
    position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  }

}

</style>
