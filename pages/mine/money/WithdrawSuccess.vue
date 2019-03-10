<template>
    <view class="page">
        <view class="content">
            <image src="../../../static/mine/successIcon.png"></image>
            <view class="desc">
                <text>提交成功</text>
                <text>审核成功后将于1个工作日内到账</text>
            </view>
            <!-- <view class="button" @click="openTransferHistory">查看转账记录</view> -->
        </view>
    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";

    export default {

        name: "TransferSuccess",
        components: {NavigationBar},
		 data () {
		    return {
		        id: '',
		        userId: '',
		    }
		},
		 onLoad (option) {
		    this.id = option.id;
		    this.userId = option.userId;
		},
        methods: {
            openTransferHistory () {
                this.navigateTo('./WithdrawHistory',{id: this.id});
            }
        },

    }
</script>

<style scoped lang="less">

    .content {
        text-align: center;
    }

    image {
        width: 279upx;
        height: 258upx;
        margin: 180upx auto 52upx;
    }

    .desc {
        font-size:32upx;
        color:rgba(140,140,140,1);
        margin-bottom: 40upx;
        line-height:60upx;
        text {
            display: block;
        }
    }

    .button {
        display: inline-block;
        padding: 0 24upx;
        font-size:24upx;
        height: 48upx;
        line-height: 48upx;
        color:rgba(153,153,153,1);
        border:2upx solid rgba(153,153,153,1);
        border-radius:48upx;
    }

</style>