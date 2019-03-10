<template>
    <view class="page">

        <view class="form">
            <view class="form-item">
                <input :value="phone" disabled />
            </view>
            <view class="form-item">
                <input placeholder="输入验证码" type="number" maxlength="6" v-model="form.verifyCode" />
                <view class="right">
                    <text v-if="isCanSend" class="send_button" @click="sendVerifyCode">发送验证码</text>
                    <text v-else class="count_down">{{ countDown }}s</text>
                </view>
            </view>
            <view class="form-item">
                <input placeholder="设置密码" maxlength="6" :password="!showPassword" v-model="form.password" @focus="showToast('请输入6位数字的支付密码')"  />
                <view class="right" @click="changeShowPassword">
                    <image class="icon ic-eye" :class="{ 'ic-eye-on': showPassword }" ></image>
                </view>
            </view>
            <view class="form-item">
                <input placeholder="确认密码" maxlength="6" :password="!showConfirmPassword" v-model="form.confirmPassword" @focus="showToast('请再次确认输入的支付密码')" />
                <view class="right" @click="showConfirmPassword = !showConfirmPassword">
                    <image class="icon ic-eye" :class="{ 'ic-eye-on': showConfirmPassword }" ></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    import store from '@/js/store';
    import md5 from 'blueimp-md5'
    import NavigationBar from "../../components/NavigationBar";
    const COUNT_DOWN_S = 60;

    export default {
        name: "PayPassword",
        components: {NavigationBar},
        data () {
            return {
                isSend: false,
                isCanSend: true,
                countDown: COUNT_DOWN_S,
                countDownIntervalId: 0,
                showPassword: false,
                showConfirmPassword: false,

                form: {
                    verifyCode: '',
                    password: '',
                    confirmPassword: '',
                },

                phone: '',
            }
        },

        computed: {
            isValidate () {
                // if (!this.isSend) {
                //     return false;
                // }
                if (!this.form.verifyCode) {
                    return false;
                }
                if (!this.form.password) {
                    return false;
                }
                if (!this.form.password.match(/\d{6}/)) {
                    return false;
                }
                return true;
            }
        },

        mounted () {
            const user = store.get('user');
            this.phone = user.mobile;
        },

        onNavigationBarButtonTap (e) {
            this.submit();
        },

        methods: {
            sendVerifyCode () {
                uni.showLoading({ title: '请求发送中' });
                this.$api.sendMsg(this.phone).then(result => {
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
                this.countDown = COUNT_DOWN_S;
                this.countDownIntervalId = setInterval(() => {
                    this.countDown -= 1;
                    if (this.countDown === 0) {
                        clearInterval(this.countDownIntervalId);
                        this.isCanSend = true;
                    }
                }, 1000)
            },

            changeShowPassword () {
                this.showPassword = !this.showPassword;
            },

            submit () {
                if (!this.form.verifyCode) {
                    this.showToast('请输入验证码');
                    return;
                }
                if (!this.form.password) {
                    this.showToast('请输入密码');
                    return;
                }
                if (!this.form.password.match(/\d{6}/)) {
                    this.showToast("支付密码必须为6位数字组合");
                    return;
                }
                if (this.form.confirmPassword !== this.form.password) {
                    this.showToast("两次输入的密码不一致");
                    return;
                }

                uni.showLoading({ title: '加载中' });
                this.$api.setPayPassword({
                    code: this.form.verifyCode,
                    password: this.form.password,
                }).then(result => {
                    this.redirectTo('./SuccessPage', {
                        title: '支付密码',
                        message: '支付密码设置成功'
                    });
                    uni.hideLoading();
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
                })
            },

        },

    }
</script>

<style scoped lang="less">

    .page {
        position: relative;
        padding-top: var(--status-bar-height);
    }

    .form {
        padding: 70upx;
    }
    .form-item {
        position: relative;

        &+.form-item {
            margin-top: 46upx;
        }

        input {
            z-index: 7;
        }

        .right {
            position: absolute;
            right: -20upx;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9;
            padding: 20upx;
        }
        .send_button {
            font-size:28upx;
            color:rgba(34,34,34,1);
        }
        .count_down {
            font-size:28upx;
            color:rgba(153,153,153,1);
        }
        .icon {
            width: 34upx;
            height: 24upx;
            background-size: 100% 100%;
            z-index: 99;
        }
    }
    input {
        font-size:32upx;
        padding: 30upx 0;
        border-bottom: 1px solid #F2F2F2;
        color: #222222;
        &::placeholder {
            color: #999999;
        }
    }

    .submit-text {
        color: #999999;
        &:active {
            color: #999999;
        }

        &.active {
            color: #C9A675;
            &:active {
                color: #e7c18e;
            }
        }


    }

</style>