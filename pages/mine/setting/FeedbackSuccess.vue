<template>
    <view class="page">

        <view class="content">
            <image src="../../../static/mine/successIcon.png"></image>
            <view class="desc">提交成功</view>
        </view>

    </view>
</template>

<script>

    export default {

        name: "FeedbackSuccess",

    }
</script>

<style scoped lang="less">

    .content {
        text-align: center;
    }

    image {
        width: 279upx;
        height: 258upx;
        margin: 180upx auto 112upx;
    }

    .desc {
        font-size:32upx;
        color:rgba(140,140,140,1);
        line-height:42upx;
    }

</style>