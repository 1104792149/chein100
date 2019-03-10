<template>
    <view class="page">

        <image class="page-background" src="../../static/mine/invite_bg.png"></image>

        <view class="empty-padding"></view>
        <view class="invite-title-info">
            <view class="slide slide-left">
                <image class="logo" src="../../static/mine/logo_white.png"></image>
            </view>
            <view class="text">INVITING</view>
            <view class="slide">
                <image class="right" src="../../static/mine/invite_right_icon.png"></image>
            </view>
        </view>

        <view class="invite-content">
            <image class="invite-content-bg" src="../../static/mine/invite_content_bg.png"></image>
            <view class="invite-title">我的邀请码</view>
            <view class="invite-code">{{ code }}</view>
            <view class="copy-button btn-primary" @click="copy">复制</view>
            <view class="copy-desc">请在注册时填写邀请码</view>
            <view class="invite-content-bottom">
                <image class="qrcode" :src="qrcodeImage"></image>
                <view class="qrcode-desc">点击右上角，分享给好友下载注册</view>
            </view>
        </view>

        <share
                ref="share"
               :url="shareUrl"
               title="邀请您加入CHAIN生态"
               summary="加入CHAIN生态，做任务领奖励。每天一件新鲜事，倒计时100天！"
                :visible="visible"
               @close="visible = false">

        </share>

    </view>
</template>

<script>

    import qrcode from '../../js/lib/qrcode'
    import config from '../../js/config'
    import Share from '../../components/Share'
    import NavigationBar from "../../components/NavigationBar";

    export default {
        name: "InviteCode",

        components: {
            NavigationBar,
            Share,
        },

        data () {
            return {
                code: '',
                qrcodeImage: '',
                visible: false,
            }
        },

        computed: {
            shareUrl () {
                return config.DOWNLOAD_URL + '?code=' + this.code;
            }
        },

        onLoad (option) {
            this.code = option.code;
        },

        onBackPress () {
            if (this.visible) {
                this.$refs.share.close();
                return true;
            }
        },

        onNavigationBarButtonTap (e) {
            this.share();
        },

        mounted () {
            this.generateQRCodeImage(this.shareUrl);
        },

        methods: {
            generateQRCodeImage (val) {
                this.qrcodeImage = qrcode.createQrCodeImg(val, {
                    size: 100
                });
            },

            copy () {
                uni.setClipboardData({
                    data: this.code,
                    success: () => {
                        this.showToast('复制成功')
                    }
                });
            },

            share () {
                this.visible = true;
            }

        },

    }
</script>

<style scoped lang="less">

    .page {
        min-height: 100vh;
        overflow: hidden;
    }

    .page-background {
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: -1;
    }

    .empty-padding {
        height: 104upx;
    }

    .invite-title-info {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 102upx;

        .logo {
            width: 53upx;
            height: 59upx;
        }
        .text {
            margin: 0 72upx;
            font-size:24upx;
            line-height: 52upx;
            color:rgba(245,245,245,1);
            border-top: 1upx solid #FFFFFF;
            border-bottom: 1upx solid #FFFFFF;
            letter-spacing: 10upx;
        }
        .right {
            width: 62upx;
            height: 18upx;
        }
        .slide {
            flex: 1;
        }
        .slide-left {
            height: 59upx;
            text-align: right;
        }
        .slide-right {
            height: 18upx;
        }
    }

    .invite-content {
        width: 550upx;
        height: 722upx;
        box-sizing: border-box;
        margin: 0 auto;
        text-align: center;
        padding: 48upx 0;
        position: relative;

        .invite-content-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 722upx;
            z-index: -1;
        }

        .invite-title {
            font-size:28upx;
            line-height: 27upx;
            color:rgba(34,34,34,1);
            margin-bottom: 32upx;
        }
        .invite-code {
            font-size:88upx;
            font-weight:bold;
            color:rgba(34,34,34,1);
            margin-bottom: 32upx;
            line-height: 72upx;
        }
        .copy-button {
            width: 156upx;
            height: 50upx;
            line-height: 50upx;
            margin: 0 auto;
            margin-bottom: 32upx;
            position: relative;
            font-size:28upx;
            color: #6F4F2B;
            box-sizing: border-box;

        }
        .copy-desc {
            font-size:24upx;
            color:rgba(153,153,153,1);
            margin-top: 3upx;
            line-height: 24upx;
        }
        .invite-content-bottom {}
        .qrcode {
            width: 204upx;
            height: 204upx;
            margin-top: 96upx;
            margin-bottom: 33upx;
            background-color: #eee;
        }
        .qrcode-desc {
            font-size:24upx;
            color:rgba(153,153,153,1);
        }
    }

</style>