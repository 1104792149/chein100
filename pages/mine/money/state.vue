// 钱包说明
<template>
  <view class="page state">
    <ul>
      <li>
        1. 我的钱包是您在CHAIN平台内所有资产的管理中心
      </li>
      <li>
        2. BTA是CHAIN的唯一流通凭证，是平台的等价值交换工具，可通过完成平台任务等方式获得
      </li>
      <li>
        3. 积分是平台用户的专属积分，可用于CHAIN DAPP正式版上线后服务和产品的兑换，用户可通过参与积分活动获得积分
      </li>
    </ul>
    <!--<view class="cell">-->
      <!--<span>联系我们：</span>-->
      <!--<span>CHAIN@CHAINTOP.COM</span>-->
    <!--</view>-->
    <!--<view class="versions">CHAIN  V1.0</view>-->

  </view>
</template>
<script>
  import NavigationBar from "../../../components/NavigationBar";
  export default {
    name: "state",
    components: {
      NavigationBar
    },
  }
</script>
<style lang="less" scoped>
  .state {
    ul,li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    ul {
      width: 588upx;
      height: 411upx;

      margin-top: 94upx;
      margin-left: 91upx;
      li {
        height: 72upx;
        line-height: 48upx;;
        font-size: 28upx;
        color: #222222;
        margin-bottom: 70upx;
      }
    }
    .cell {
      font-size: 24upx;
      color: #222;
      margin-left: 190upx;
      margin-top: 486upx;
      margin-bottom: 42upx;
      span {
      }
    }
    .versions {
      font-size: 24upx;
      color: #999;
      margin-left: 310upx;
    }
  }
</style>

