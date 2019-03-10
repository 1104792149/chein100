<template>
  <view class="page">
    <view class="tab-list">


      <view @click="currentTab = tab.id"
            :class="{ active: currentTab == tab.id }"
            :key="tab.id"
            class="tab-item"
            v-for="tab in tabList">
        {{ tab.text }}
      </view>
    </view>

    <view class="tab-content"></view>
    <!--<history-list :list="showList"></history-list>-->
    <!--<history-list v-for="tab in tabList" :key="tab.id" :type="tab.id" v-show="currentTab === tab.id" :ref="`list${tab.id}`"></history-list>-->

    <!--<history-list  v-for="tab in tabList" v-show="currentTab == tab.id" :type="tab.id" :current="currentTab" :ref="'list' + tab.id"></history-list>-->
    <history-list :show="currentTab === 0" :type="0" :current="currentTab" ref="list0"></history-list>
    <history-list :show="currentTab === 1" :type="1" :current="currentTab" ref="list1"></history-list>
    <history-list :show="currentTab === 2" :type="2" :current="currentTab" ref="list2"></history-list>
    <history-list :show="currentTab === 3" :type="3" :current="currentTab" ref="list3"></history-list>

    <!--<swiper class="swiper" :current="currentTab" @change="swiperChange">-->
      <!--<swiper-item class="swiper-item" v-for="tab in tabList">-->
        <!--<history-list :type="tab.id" :current="currentTab"></history-list>-->
      <!--</swiper-item>-->
    <!--</swiper>-->


  </view>
</template>
<script>
import NavigationBar from "../../../components/NavigationBar";
import HistoryList from "./sub/HistoryList";


  export default {
    components: { HistoryList, NavigationBar},
    data () {
      return {
        tab: 1,

        tabList: [
          { text: 'BTA', id: 0 },
          { text: '积分', id: 1 },
          { text: '提币', id: 2 },
          { text: '转账', id: 3 },
        ],
        currentTab: 0,
      }
    },

    onPullDownRefresh () {
      this.$refs[`list${this.currentTab}`].refresh();
    },

    onReachBottom () {
      this.$refs[`list${this.currentTab}`].loadMore();
    },

    computed: {
    },

    onLoad () {
    },

    watch: {
    },

    mounted () {

    },

    methods: {
      swiperChange (e) {
        this.currentTab = e.detail.current
      }
    }
  }
</script>

<style lang="less" scoped>

  .tab-list {
    line-height:72upx;
    height: 72upx;
    display: flex;
    border-bottom: 16upx solid #F5F5F5;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99;
    background-color: #ffffff;

    .tab-item {
      color: #999999;
      flex: 1;
      text-align: center;
      font-size:28upx;

      &.active {
        color:rgba(34,34,34,1);
      }

    }

  }

  .tab-content {
    padding-top: 88upx;
  }

  .hide {
    position: absolute;
    transform: scale(0);
  }

  /*.swiper {*/
    /*height: calc(100vh - 176upx - var(--status-bar-height));*/
  /*}*/

</style>
