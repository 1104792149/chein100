<template>
    <view class="page">
        <view class="user-info">
            <image class="avatar" :src="user.headImg"></image>
            <view class="username">{{ user.nickName }}</view>
            <view class="phone">{{ user._mobile }}</view>
        </view>

        <view class="transfer-container">
            <view class="title">转账金额（BTA）</view>
            <view class="transfer-value">
                <input type="number" v-model="bta" />
                <image v-show="bta" class="clear" src="../../../static/mine/wallet/icon_delete_gray.png" @click="clearBTA"></image>
            </view>
            <view class="desc" v-if="isEnough">可用{{ totalShow }}BTA</view>
            <view class="desc error" v-else>账户余额不足</view>
        </view>

        <view class="message-container">
            <view class="message-desc">短信验证码发送至{{selfPhone}}</view>
            <view class="input-desc">请输入您获取的验证码</view>
            <view class="verify-code-list" @click="isFocus = true">
                <view class="verify-code-item" v-for="(n, index) in 6" :key="index">{{ code[index] }}</view>
                <input class="hideInput" v-model="code" @blur="isFocus = false" :focus="isFocus" type="number" maxlength="6" />
            </view>
            <view class="send-status">
                <view class="send-button" @click="sendVerifyCode" v-if="btn_show_type==0 || btn_show_type==2">{{btn_show_type==0?"点击获取":btn_show_type==2?"重新发送":""}}</view>
                <view  class="count-down" v-if="btn_show_type==1">{{ countDown }}s</view>
            </view>
        </view>

        <button class="button btn-primary" :disabled="!isValid" @click="next">
            确认转账
        </button>

        <pay-password-modal ref="payPasswordModal" @confirmPay="confirmPay"></pay-password-modal>

    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    import PayPasswordModal from "../../../components/PayPasswordModal";
    import store from '../../../js/store';
    const COUNT_DOWN_S = 60;
    export default {
        name: "Transfer",
        components: {PayPasswordModal, NavigationBar},
        data () {
            return {
                total: 0,
                bta: '',
                user: {},
                isFocus: false,
                btn_show_type:0,//0代表点击获取，1代表倒计时，2代表重新发送
                isSetPassword: true,
                code:'',
                selfPhone:store.getPhone(),
                countDown: COUNT_DOWN_S,
            }
        },

        onLoad (option) {
            option._mobile = this.hidePhone(option.mobile);
            this.user = option;

            this.$api.getMyWallet(this.currentPage).then(result => {
                this.total = Number(result.BTA)
                uni.hideLoading();
            }).catch(error => {
                uni.hideLoading();
            })
        },

        onShow () {
            // 检查是否设置支付密码
            this.$api.checkPayPassword('').catch(error => {
                this.isSetPassword = !(error && error.code === '2100');
            })
        },

        computed: {
            isValid () {
                return this.bta > 0 && this.isEnough && this.code && this.code.length==6;
            },
            isEnough () {
                return this.total >= this.bta
            },
            totalShow () {
                return this.total.toFixed(2)
            }

        },

        onBackPress () {
            if (this.$refs.payPasswordModal.visible) {
                this.$refs.payPasswordModal.close();
                return true;
            }
        },

        onNavigationBarButtonTap (e) {
            this.openTransferHistory();
        },

        methods: {
            sendVerifyCode () {
                uni.showLoading({ title: '请求发送中' });
                this.$api.sendMsg(this.selfPhone).then(result => {
                    this.btn_show_type = 1
                    uni.hideLoading();
                    this.startCountDown();
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                })
            },
            startCountDown () {
                this.countDown = COUNT_DOWN_S - 1;
                this.countDownIntervalId = setInterval(() => {
                    this.countDown -= 1;
                    if (this.countDown === 0) {
                        clearInterval(this.countDownIntervalId);
                        this.btn_show_type = 2;
                    }
                }, 1000)
            },
            clearBTA () {
                this.bta = '';
            },

            next () {
                if (!this.isSetPassword) {
                    uni.showModal({ //提醒用户更新
                        title: "提示",
                        content: '你尚未设置支付密码',
                        confirmText: '去设置',
                        success: (res) => {
                            if (res.confirm) {
                                this.navigateTo('/pages/mine/PayPassword');
                            }
                        }
                    })
                    return;
                }

                this.$refs.payPasswordModal.show();
            },

            confirmPay (password) {
                uni.showLoading();
                this.$api.transfer(
                    this.bta,
                    this.user.nickName,
                    this.user.id,
                    this.user.mobile,
                    this.user.headImg,
                    this.code
                ).then(result => {
                    this.redirectTo('./TransferSuccess', { id: result, userId: this.user.id })
                    uni.hideLoading();
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                })
            },

            openTransferHistory () {
                this.navigateTo('./TransferHistory', {
                    nickName: this.user.nickName,
                    id: this.user.id,
                    mobile: this.user.mobile,
                    headImg: this.user.headImg,
                });
            },

        },
    }
</script>

<style scoped lang="less">

    .page {
        /*background-color: #F5F5F5;*/
        min-height: 100vh;
        padding-top: 50upx;

    }

    .user-info {
        text-align: center;
        margin-bottom: 48upx;
        .avatar {
            width: 148upx;
            height: 148upx;
            margin-bottom: 16upx;
            border-radius: 50%;
        }
        .username {
            font-size:36upx;
            color:rgba(30,30,30,1);
            line-height: 30upx;
            margin-bottom: 16upx;
        }
        .phone {
            font-size:28upx;
            color:rgba(153,153,153,1);
            line-height:24px;
        }
    }

    .transfer-container {
        padding: 0 30upx;
        margin-bottom: 48upx;
        .title {
            font-size:28upx;
            color:rgba(34,34,34,1);
            line-height:31upx;
            margin-bottom: 30upx;
        }
        .transfer-value {
            position: relative;
            height: 122upx;
            border-bottom: 1upx solid #E2E2E2;
            margin-bottom: 16upx;
            input {
                font-size: 72upx;
                height: 122upx;
                line-height: 122upx;
                position: absolute;
                left: 0;
                top: 0;
            }
            .clear {
                width: 32upx;
                height: 32upx;
                position: absolute;
                top: 50%;
                right: 8upx;
                transform: translateY(-50%);
                z-index: 2;
            }
        }
        .desc {
            font-size:20upx;
            color:#C9A675;
            line-height:31upx;
            &.error {
                color: #F93336;
            }
        }
    }

    .message-container{
        padding: 0 30upx;
        .message-desc {
            font-size:28upx;
            color:rgba(153,153,153,1);
            line-height:28upx;
            margin-bottom: 35upx;
        }
        .input-desc {
            font-size:28upx;
            color:rgba(34,34,34,1);
            line-height:28upx;
            margin-bottom: 60upx;
        }
        .verify-code-list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            margin-bottom: 40upx;
            .verify-code-item {
                width: 90upx;
                height: 90upx;
                line-height: 90upx;
                text-align: center;
                border: 1upx solid #E2E2E2;
                font-size:60upx;
                color:rgba(34,34,34,1);
            }
            .hideInput {
                position: absolute;
                left: -200upx;
            }
        }
        .send-status {
            margin-bottom: 60upx;
            .send-button {
                display: inline-block;
                height:46upx;
                line-height:46upx;
                border:2upx solid rgba(201,166,117,1);
                border-radius:23upx;
                font-size:28upx;
                color:rgba(201,166,117,1);
                padding: 0 24upx;
            }
            .count-down {
                font-size:28upx;
                color:rgba(153,153,153,1);
            }
        }
    }
    .button {
        height: 110upx;
        line-height: 110upx;
        margin: 0 70upx;
        border-radius:55upx;
    }

</style>