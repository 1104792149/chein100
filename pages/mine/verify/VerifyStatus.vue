<template>
    <view class="page status">

        <navigation-bar title="身份认证">
            <view class="right-child" v-if="type == 2" @click="authAgain">重新认证</view>
        </navigation-bar>

        <view class="verify-status" :class="{ failed: type == 2 }">
            <image v-if="type == 0" class="status-icon" src="../../../static/mine/successIcon.png"></image>
            <image v-if="type == 1" class="status-icon" src="../../../static/mine/icon_info.png"></image>
            <image v-if="type == 2" class="status-icon" src="../../../static/mine/icon_failed.png"></image>
            <view class="message">{{ message }} </view>
            <view class='reason' v-if="type==2">{{reason}}</view>
        </view>

        <view class="verify-info" v-if="type != 2">
            <view class="info-row">
                <view class="label">国家</view>
                <view class="value">中国</view>
            </view>
            <view class="info-row">
                <view class="label">姓名</view>
                <view class="value">{{ verifyInfo.relName }}</view>
            </view>
            <view class="info-row" style="margin-bottom: 60upx">
                <view class="label">身份证</view>
                <view class="value">{{ verifyInfo.idCard }}</view>
            </view>
            <view class="id-card-container">
                <view class="title">证件材料</view>
                <view class="image-list">
                    <!-- 手持 -->
                    <image class="image-item" mode="aspectFill" :src="verifyInfo.holdCode"></image>
                    <!-- 正面 -->
                    <image class="image-item" mode="aspectFill" :src="verifyInfo.front"></image>
                    <!-- 反面 -->
                    <image class="image-item" mode="aspectFill" :src="verifyInfo.back"></image>
                </view>
            </view>

        </view>
    </view>
</template>

<script>

    import NavigationBar from "../../../components/NavigationBar";
    const MESSAGE_MAP = {
        0: '您已通过身份认证',
        1: '大约需要1～2个工作日，请耐心等待',
        2: '审核失败',
    }

    export default {

        name: "VerifyStatus",
        components: {NavigationBar},
        data () {
            return {
                type: 0,
				reason:'',
                verifyInfo: {
                    relName: '',
                    idCard: '',
                    holdCode: '',
                    front: '',
                    back: '',
					
                },
            }
        },

        computed: {
            message () {
                return MESSAGE_MAP[this.type]
            },
        },

        onLoad (option) {
            this.type = option.type || 0;
			console.info(option)
            if(option.type==2){
                this.reason = option.content;
            }
            this.verifyInfo.relName = option.relName;
            this.verifyInfo.idCard = option.idCard;
            this.verifyInfo.holdCode = option.holdCode;
            this.verifyInfo.front = option.front;
            this.verifyInfo.back = option.back;
        },

        methods: {
            authAgain () {
                this.redirectTo('./VerifyCenter', { force: true, })
            }
        },

    }
</script>

<style scoped lang="less">

    .page {
        min-height: 100vh;
    }

    .verify-status {
        text-align: center;
        padding-top: 53upx;
        padding-bottom: 57upx;
        border-bottom: 22upx solid #f2f2f2;
        background-color: #ffffff;

        .status-icon {
            width: 208upx;
            height: 194upx;
            margin-bottom: 50upx;
            transform: translateX(-13upx);
        }
        .message {
            text-align: center;
            font-size:32upx;
            color:rgba(140,140,140,1);
            line-height:42upx;
        }
        .reason{
            margin-top: 38upx;
            color: #999999;
            text-align: center;
            font-size: 26upx;
        }
        &.failed {
            padding-top: 130upx;
        }

    }

    .verify-info {
        background-color: #ffffff;
        padding: 45upx 30upx;
        font-size:28upx;
        color:rgba(34,34,34,1);

        .info-row {
            margin-bottom: 77upx;
            display: flex;
            font-size:32upx;
            color:rgba(34,34,34,1);
            padding-bottom: 30upx;
            border-bottom: 1upx solid #F2F2F2;

            .label {
                width: 100upx;
                margin-right: 56upx;
            }
            .value {
            }
        }
    }

    .id-card-container {
        .title {
            font-size:32upx;
            color:rgba(34,34,34,1);
            margin-bottom: 36upx;
        }
        .image-list {
            display: flex;
            margin-bottom: 16upx;
        }
        .image-item {
            flex: 1;
            height: 158upx;
            text-align: center;
            background-color: #F2F2F2;
            margin-right: 30upx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .failed {
        border-bottom: none;
    }

</style>