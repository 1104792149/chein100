<template>
    <view class="page">
        <image class="logo" src="../../../static/mine/logo.png"></image>
        <view class="content">
            <view style="text-align: center">CHAIN100百天计划</view>
            <view>100天，每天一件新鲜事！</view>
            <view>100百天计划，旨在打造全新社区生态，在CHAINDAPP正式版发布前，构建一个以价值、共识、利益为核心的社区生态。</view>
            <view>CHAIN100生态怀着开放的态度欢迎各类能够为生态贡献价值的服务商入驻，保证生态每天可以为用户带来新鲜的、有趣的、丰富的、多彩的各种事情，让大家在CHAIN100生态内：有玩不尽的游戏，拿不完的礼品，看不完的新鲜事，还有各类高端溯源产品任你选，高潜力项目开放让你参与。</view>
        </view>
        <view class="contact">
            <text class="label">联系我们：</text>
            <text class="text">chain@chaintop.io</text>
        </view>
    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    export default {
        name: "About",
        components: {NavigationBar}
    }
</script>

<style scoped lang="less">

    .page {
        text-align: center;
        padding-bottom: 16upx;
    }

    .logo {
        width: 68upx;
        height: 76upx;
        margin-top: 85upx;
    }

    .content {
        text-align: left;
        padding: 76upx;
        margin-bottom: 103upx;
        view {
            font-size:28upx;
            color:rgba(34,34,34,1);
            margin-bottom: 40upx;
            line-height:48upx;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .contact {
        font-size:24upx;
        color:rgba(34,34,34,1);
        margin-bottom: 42px;
    }

    .version {
        font-size:24upx;
        color:rgba(153,153,153,1);
    }

</style>