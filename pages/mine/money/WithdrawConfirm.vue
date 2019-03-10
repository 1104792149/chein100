<template>
    <view class="page">
        <view class="address">
            <view class="title">请再次确认您的提币地址</view>
            <view class="value">{{ form.toAddress }}</view>
        </view>

        <view class="pane">
            <view class="message-container">
                <view class="message-desc">短信验证码发送至{{ form.mobile }}</view>
                <view class="input-desc">请输入您获取的验证码</view>
                <view class="verify-code-list" @click="isFocus = true">
                    <view class="verify-code-item" v-for="(n, index) in 6">{{ form.code[index] }}</view>
                    <input class="hideInput" v-model="form.code" @blur="isFocus = false" :focus="isFocus" type="number" maxlength="6" />
                </view>
                <view class="send-status">
                    <view v-if="isCanSend" class="send-button" @click="sendVerifyCode">重新发送</view>
                    <view v-else class="count-down">{{ countDown }}s</view>
                </view>
            </view>

            <view class="attention-message">
                <view class="title">
                    <image class="icon" src="../../../static/mine/wallet/icon_warning.png"></image>
                    <text>注意事项</text>
                </view>
                <view class="text">请确认提币地址为ETH地址，向非ETH地址提币将会造成资产损失并且不可找回。</view>
                <view class="text">为保障资金安全，请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</view>
            </view>

        </view>

        <button class="btn-primary" @click="submit">提交</button>

        <pay-password-modal ref="payPasswordModal" @confirmPay="confirmPay" @resetPassword="navigateTo('../PayPassword')"></pay-password-modal>

        <alert-dialog ref="dialog" @confirm="onDialogConfirm"></alert-dialog>

    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    import PayPasswordModal from "../../../components/PayPasswordModal";
    import AlertDialog from "../../../components/AlertDialog";
    const COUNT_DOWN_S = 60;

    export default {
        name: "Withdraw",

        components: {AlertDialog, PayPasswordModal, NavigationBar},

        data () {
            return {
                isFocus: false,

                isSend: false,
                isCanSend: true,
                countDown: COUNT_DOWN_S,
                countDownIntervalId: 0,

                form: {
                    amount: '',
                    toAddress: '',
                    code: '',
                    mobile: '',
                },

                isSetPassword: true,
            }
        },

        onLoad (option) {
            this.form.toAddress = option.toAddress
            this.form.amount = option.amount
            this.form.mobile = this.getCurrentUser().mobile;
        },

        watch: {
            verifyCode () {
                if (this.form.code.length === 6) {
                    this.isFocus = false;
                    uni.hideKeyboard()
                }
            }
        },

        onShow () {
            // 检查是否设置支付密码
            this.$api.checkPayPassword('').catch(error => {
                this.isSetPassword = !(error && error.code === '2100');
            })
        },

        mounted () {
            this.sendVerifyCode();   //进入页面时获取验证码
        },

        methods: {
            sendVerifyCode () {
                uni.showLoading({ title: '请求发送中' });
                this.$api.sendMsg(this.form.mobile).then(result => {
                    this.isSend = true;
                    this.isCanSend = false;
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
                        this.isCanSend = true;
                    }
                }, 1000)
            },

            submit () {
                this.submit = false;
                uni.showLoading();
                // step 1: 校验短信验证码
                this.$api.validateMsgCode(this.form.code, this.form.mobile).then(result => {
                    // step 2: 检查是否设置支付密码
                    this.checkPayPasswordAndInput();
                    uni.hideLoading();
                }).catch(error => {

                    this.submit = true;
                    // 如果是验证码错误，弹出自定义弹框
                    if (error && error.code === '1004') {
                        this.$refs.dialog.show({
                            title: '提示',
                            message: '验证码错误',
                            confirmButtonText: '确认',
                        })
                    // 如果是其他错误,则显示后台的错误返回内容
                    } else {
						if(error.code!='1005'){
						 this.showError(error);
					}
                    }
                    uni.hideLoading();

                });
            },

            checkPayPasswordAndInput () {
                if (!this.isSetPassword) {
                    uni.showModal({ //提醒用户更新
                        title: "提示",
                        content: '你尚未设置支付密码',
                        confirmText: '去设置',
                        success: (res) => {
                            if (res.confirm) {
                                this.navigateTo('/pages/mine/PayPassword');  //Luyuxi19970625
                            }
                        }
                    });
                    return;
                }
                this.$refs.payPasswordModal.show();
            },

            confirmPay () {
                uni.showLoading();
                this.$api.withdrawCoin(this.form).then(result => {
                    uni.hideLoading();
                    this.redirectTo('./WithdrawSuccess')
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                })
            },

            onDialogConfirm () {

            },

        },

    }
</script>

<style scoped lang="less">

    .address {
        padding: 56upx 32upx 43upx;
        border-bottom: 16upx solid #F5F5F5;

        .title {
            font-size:28upx;
            color:rgba(34,34,34,1);
            line-height: 27upx;
            margin-bottom: 35upx;
        }
        .value {
            font-size:36upx;
            color:rgba(153,153,153,1);
            line-height:37upx;
        }
    }

    .pane {
        padding: 60upx 32upx;
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
                border: 1upx solid #F5F5F5;
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

    .message-container {}

    .attention-message {
        .title {
            font-size:28upx;
            color:rgba(249,51,54,1);
            margin-bottom: 36upx;
            .icon {
                width: 28upx;
                height: 28upx;
                margin-right: 13upx;
                vertical-align: middle;
                margin-top: -.2em;
            }
        }
        .text {
            font-size:28upx;
            color:rgba(153,153,153,1);
            line-height:38upx;
            &+.text {
                margin-top: 36upx;
            }
        }
    }

    .btn-primary {
        margin: 80upx 30upx 0;
    }

</style>