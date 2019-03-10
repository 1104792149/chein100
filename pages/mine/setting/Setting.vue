<template>
    <view class="page">
        <view class="option-list">
            <!--<view class="option-item" @click="openFeedback">-->
                <!--<text class="label">意见反馈</text>-->
                <!--<image class="right right-icon" src="../../../static/mine/icon_right.png"></image>-->
            <!--</view>-->
            <view class="option-item" @click="openAbout">
                <text class="label">关于CHAIN</text>
                <image class="right right-icon" src="../../../static/mine/icon_right.png"></image>
            </view>
            <view class="option-item" @click="logout">
                <text class="label">退出登录</text>
                <image class="right right-icon" src="../../../static/mine/icon_right.png"></image>
            </view>
        </view>

        <alert-dialog ref="dialog" @confirm="onConfirm"></alert-dialog>

    </view>
</template>

<script>
    import AlertDialog from "../../../components/AlertDialog";
    import NavigationBar from "../../../components/NavigationBar";
    import store from '@/js/store'

    export default {
        name: "Setting",
        components: {NavigationBar, AlertDialog},
        methods: {
            openFeedback () {
                this.navigateTo('./Feedback');
            },
            openAbout () {
                this.navigateTo('./About');
            },
            logout () {
                this.$refs.dialog.show({
                    title: '提示',
                    message: '是否确认退出当前账号？',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                })
            },
            onConfirm () {
                store.logout();
            },
        },

    }
</script>

<style scoped lang="less">

    .page {
        min-height: 100vh;
    }

    .option-list {
        .option-item {
            display: flex;
            align-items: center;
            height: 120upx;
            line-height: 120upx;
            padding: 0 30upx;
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