<template>
    <view class="page">

        <view class="option-list">
            <view class="option-item" @click="openLoginPassword">
                <text class="label">登录密码</text>
                <image class="right right-icon" src="../../static/mine/icon_right.png"></image>
            </view>
            <view class="option-item" @click="openPayPassword">
                <text class="label">支付密码</text>
                <image class="right right-icon" src="../../static/mine/icon_right.png"></image>
            </view>
        </view>
    </view>
</template>

<script>
    import NavigationBar from "../../components/NavigationBar";
    export default {
        name: "SecurityCenter",
        components: {NavigationBar},
        methods: {
            openLoginPassword () {
                this.navigateTo('./LoginPassword')
            },
            openPayPassword () {
                // 如果尚未设置过支付密码
                if (!this.getCurrentUser().payPassword) {
                    this.navigateTo('./PayPassword')
                } else {
                    this.navigateTo('./PayPasswordSuccess')
                }

            }
        },
    }
</script>

<style scoped lang="less">

    .option-list {
        .option-item {
            display: flex;
            align-items: center;
            padding: 44upx 32upx;
            border-bottom: 1upx solid #F2F2F2;
            &:active {
                background-color: #eeeeee;
            }
        }
        .label {
            font-size:30upx;
            color:rgba(34,34,34,1);
            flex: 1;
        }
        .right {

        }
        .right-icon {
            width: 14upx;
            height: 24upx;
        }
    }

</style>