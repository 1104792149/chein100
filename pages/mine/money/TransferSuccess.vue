<template>
    <view class="page">
        <view class="content">
            <image src="../../../static/mine/successIcon.png"></image>
            <view class="desc">转账成功</view>
            <!-- <view class="button" @click="openTransferDetail">查看转账记录</view> -->
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

        onNavigationBarButtonTap (e) {
            this.openTransferHistory();
        },

        onLoad (option) {
            this.id = option.id;
            this.userId = option.userId;
			console.info(option)
        },

        methods: {
            openTransferDetail () {
                this.redirectTo('./TransferDetail', { id: this.id })
            },
            openTransferHistory () {
                this.navigateTo('./TransferHistory', { id: this.id });
            }
        },

    }
</script>

<style scoped>

    .content {
        text-align: center;
    }

    image {
        width: 279upx;
        height: 258upx;
        margin: 180upx auto 112upx;
        transform: translateX(-13upx);
    }

    .desc {
        font-size:32upx;
        color:rgba(140,140,140,1);
        line-height:42upx;
        margin-bottom: 40upx;
    }

    .button {
        display: inline-block;
        height: 48upx;
        line-height: 48upx;
        padding: 0 25upx;
        font-size:24upx;
        color:rgba(153,153,153,1);
        border:2upx solid rgba(153,153,153,1);
        border-radius:48upx;
    }

</style>