<template>
    <view>
        <view class="page login">
            <view
                    id="phone"
                    checked="checked"
            >
                <input
                        style="color: #222222"
                        v-model="newMobile"
                        maxlength="11"
                        name="phone"
                        type="number"
                        placeholder-style="color: #999"
                        placeholder="请输入新的手机号码"
                >
            </view>
            <view class="code">
                <input type="number" placeholder="输入验证码" v-model="code" class="codeInput" placeholder-style="color: #999">
                <view class="send" @click="getCode()">{{btn_show_type==0?"点击获取":btn_show_type==2?"重新发送":countDown+"s"}}</view>
            </view>
            <view id="password">
                <input
                        v-model="password"
                        maxlength="18"
                        name="password"
                        :password="!showPassword"
                        placeholder-style="color: #999"
                        @focus="showToast('请输入6-18位数字与字母组合')"
                        placeholder="输入密码"
                >
                <view class="right" @click="showPassword = !showPassword">
                    <image
                            class="icon ic-eye"
                            :class="{ 'ic-eye-on': showPassword }"

                    ></image>
                </view>
            </view>

            <button
                    @click="next()"
                    class="now_login btn-primary"
                    :disabled="!isValid"
            >确认更绑</button>

        </view>
    </view>
</template>

<script>
    const COUNT_DOWN_S = 60;
    export default {
        data() {
            return {
                code:'',
                countDown: COUNT_DOWN_S,
                btn_show_type:0,//0代表点击获取，1代表倒计时，2代表重新发送
                showPassword:false,
                password:'',
                newMobile:'',
                successToast:false,
            };
        },
        computed:{
            isValid () {
                return this.code.length==6 && /\d{11}/.test(this.newMobile) && this.password;
            }
        },

        onLoad(option){
            this.mobile = option.mobile;
        },
        methods:{
            next(){
                uni.showLoading();
                this.$api.updatePhone(this.newMobile,this.code,this.password).then(res =>{
                    uni.hideLoading();
                    this.successToast = true;
					this.showToast('更绑成功');
                    setTimeout(function () {
                        uni.navigateBack({delta:1});
                    },1500)
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
                });
            },
            getCode() {
                if(this.newMobile===this.mobile){
                    this.showError('该手机号码与当前绑定的手机号码相同');
                    return;
                }
                uni.showLoading({ title: "请求发送中" });
                this.$api.getCode(this.newMobile).then(result => {
                    setTimeout(() => {
                        this.btn_show_type = 1;
                        uni.hideLoading();
                        this.startCountDown();
                    }, 200);
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
                });

            },
            startCountDown() {
                this.countDown = COUNT_DOWN_S;
                this.countDownIntervalId = setInterval(() => {
                    this.countDown -= 1;
                    if (this.countDown === 0) {
                        clearInterval(this.countDownIntervalId);
                        this.btn_show_type = 2;
                    }
                }, 1000);
            },
        }
    }
</script>

<style lang="less" scoped>
    .successToast{
        width:280upx;
        height:80upx;
        background:rgba(34,34,34);
        opacity: 0.5;
        border-radius:10px;
        text-align: center;
        line-height: 80upx;
        font-size: 24upx;
        color: #FFFFFF;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .code_msg{
        color: #222222;
        font-size: 28upx;
        height: 28upx;
        line-height: 28upx;
    }
    .placeholder{
        font-size: 32upx;
    }
    .mobile{
        height: 36upx;
        line-height: 36upx;
        font-size: 36upx;
        margin-top: 30upx;
    }
    .code{
        width: 610upx;
        margin-top: 52upx;
        height: 92upx;
        border-bottom: 1upx solid #F2F2F2;

    }
    .codeInput{
        width: 59%;
        height: 32upx;
        padding: 15upx 0;
        float: left;
    }
    input{
        font-size: 32upx;
    }
    .send{
        width: 40%;
        height: 92upx;
        line-height: 92upx;
        text-align: right;
        font-size: 28upx;
        float: right;
    }
    .now_login {
        margin-top: 300upx;
        margin-bottom: 74upx;
        width: 610upx;
        height: 140upx;
        font-size: 36upx;
        color: rgba(111, 79, 43, 1);
        line-height: 140upx;
        border-radius: 70upx;
    }


    .login {
        margin-right: 70upx;
        margin-left: 70upx;
        color: #999999;
        font-size: 32upx;
        #phone {
            line-height: 45upx;
            margin-top: 100upx;
            margin-bottom: 35upx;
            border-bottom: 1upx solid #F2F2F2;
            input {
                padding: 25upx 0;
            }
        }
        #msgCode {
            position: relative;
            line-height: 45upx;
            border-bottom: 1upx solid #F2F2F2;
            input {
                padding: 25upx 0;
            }
            .get-msgCode {
                font-size: 28upx;
                float: right;
                color:rgba(34,34,34,1);
                p {
                    position: absolute;
                    top: 50%;
                    right: 10upx;
                    z-index: 2;
                    transform: translateY(-50%);
                    // margin-top: -75upx;
                }
            }
        }

        #password {
            line-height: 45upx;
            margin-top: 40upx;
            border-bottom: 1upx solid #F2F2F2;
            position: relative;
            input {
                padding: 25upx 0;
            }
            .eye {
                width: 34upx;
                height: 24upx;
                position: absolute;
                top: 50%;
                right: 10upx;
                transform: translateY(-50%);
                z-index: 2;
            }
        }
        .forget_password {
            font-size:28upx;
            margin-top: 44upx;
            float: right;
            border: none;
        }
        .now_login {
            margin-top: 300upx;
            margin-bottom: 74upx;
            width: 610upx;
            height: 140upx;
            font-size: 36upx;
            color: rgba(111, 79, 43, 1);
            line-height: 140upx;
            border-radius: 70upx;
        }
        .footer-info {
            text-align: center;
            font-size:28upx;
            .now_reg {
                display: inline-block;
                margin-top: 44upx;
                border: none;
                color: #222222;
            }
        }
        .right {
            position: absolute;
            right: -10upx;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9;
            padding: 20upx;
        }
        .icon {
            width: 34upx;
            height: 24upx;
            background-size: 100% 100%;
        }
    }
    .count_down {
        color: #999999;
    }
    input {
        color: #222222;
    }
</style>
