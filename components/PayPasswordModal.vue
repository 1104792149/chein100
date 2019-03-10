<template>
    <!-- <view class="modal" :class="{ hide: !visible }"> -->
	<view class="modal" v-if="visible">
        <view class="mask" :class="{ show: isShow }"></view>

        <view class="modal-content" :class="{ show: isShow }">
            <view class="modal-title">
                <view class="title">请输入支付密码</view>
                <image @click="close" class="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAACQElEQVRoQ+XavVLDMAwAYLntADwUd4wk7RMwwgoPwwxs8AIlZeSuDwUMTczFtCUhf7IsOWph44hdfZWS2EZmuVyeTSaTezDmCgDAArzYPL9dLBYf5e/af4biN1mWPYAx1zWIMe/FZjPXjnS42ewVrL2oxm8BnuZJ4kwmW60+AeCkkSnlyC7c1vGVJslpP9D9VWcmB3Bl5BVgW4lW06kMicABWPuYpumNyxFqgBIkJVZTKikDYz9dqTE6oHYkFedKtJqJkImkMhoaUw2oLZOhuEYGNZUrB64TOHYmuXC9wLGQnLhBYGwkNw4FjIWUwKGB0kgpnBdQCimJ8wZyI6VxJCAXMgaODAxFxsIFAanImLhgoC+yvL7tDKW2UGfeezYW25RdASorAOvt3Oedn8GMY8mg1wK979sTwLEC0eXahhTCsQNJSEGcCHCPnE7fAKD7fvvJ5LrI80vJA2aWh8zfqnMPnWMFIp+ov9/JIZWoN27HFESylSgZJ4xkASJxh/miR+G2JXhwSzUf3O5VQBlDWT7uK586OCTQkLG+8ZLuQY4AOebAYL2BnIFxztWF9QJKBCQxZxWLBkoGIjk3CigZgNd+krDiGQTGwEkie4ExcVLITuAYOAlkK3BMHDfyf/0LW0PmWk8HWvrRatf1PF3/RxuJxsxxZfL4W7la+0VrizldHYeYasP1i7pTU104j1cIol9UKQ6JHOgXVY4bRDb6RStN6WDtc1EUd5LH6ZidOPYad0/2xD+4m8B+kNbrjh74DdlyAHVU7lQPAAAAAElFTkSuQmCC"></image>
            </view>

            <view class="password-input-list" @click="isFocus = true">
                <!--<view class="password-item" v-for="(n, index) in 6">{{ password[index] }}</view>-->
				<!-- changepsw(password[index]) -->
                <view class="password-item" v-for="(n, index) in 6" :key='index'>{{password[index]?'*':'' }}</view>
                <input v-model="password" class="hideInput" maxlength="6" type="number" :focus="isFocus" @blur="isFocus = false" />

            </view>

            <button class="btn-primary button" :disabled="password.length !== 6" @click="confirmPay">确认支付</button>
        </view>
        <view>{{source}}</view>
        <alert-dialog ref="dialog" @confirm="onDialogConfirm" @cancel="retryInputPassword"></alert-dialog>

    </view>
</template>

<script>
    import AlertDialog from "./AlertDialog";
    export default {
        name: "PayPasswordModal",
        components: {AlertDialog},
        data () {
            return {
                visible: false,
                isShow: false,
                isFocus: false,
                password: ''
            }
        },
        props:['source'],
        watch: {
            password () {
                if (this.password.length === 6) {
                    this.isFocus = false;
                    uni.hideKeyboard()
                }
            }
        },

        methods: {
            changepsw(n){
                if(n){
                    return '*';
                }
            },
            show () {
                this.visible = true;
                this.isShow = true;
                setTimeout(() => {
                    this.isFocus = true;
                }, 300)
            },

            close () {
                this.isShow = false;
                setTimeout(() => {
                    this.visible = false;
                }, 300);
                this.isFocus = false;
                uni.hideKeyboard()
            },

            confirmPay () {
                //  输入密码同意建矿后续操作
                if(this.source==3){
                    this.close();
                    this.$emit('pswPass',this.password);
                    return;
                }
                uni.showLoading();
                this.$api.checkPayPassword(this.password).then(result => {
                    uni.hideLoading()
                    this.close();
                    if(this.source==2){
                        this.$emit('pswPass',this.password);
                        return;
                    }
                    this.$emit('confirmPay');
                }).catch(error => {
                    uni.hideLoading()
                    if (error && error.code === '2101') {
                        this.$refs.dialog.show({
                            message: '支付密码错误，请重试',
                            cancelButtonText: '重试',
                            confirmButtonText: '忘记密码',
                            messageAlign: 'left',
                            confirmButtonTextColor: '#F93336',
                        });
                    } else {
                        this.showError(error)
                    }
                });

            },

            onDialogConfirm () {
                this.navigateTo('/pages/mine/PayPassword')
            },

            retryInputPassword () {
                this.isFocus = true;
				this.password='';
            },

        },

    }
</script>

<style scoped lang="less">

    .modal {}

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background:rgba(34,34,34, 0.5);
        transition: 0.3s ease;
        opacity: 0;
        z-index: 999;

        &.show {
            opacity: 1;
        }

    }

    .modal-content {
        position: absolute;
        background:rgba(255,255,255,1);
        border-radius:8upx;
        margin: 0 32upx;
        width: calc(~"100% - "64upx);
        z-index: 1000;
        top: 50%;
        margin-top: -50%;

        transition: 0.3s ease;
        transform: scale(0.2);
        opacity: 0;

        &.show {
            opacity: 1;
            transform: scale(1);
        }

    }

    .modal-title {
        height: 112upx;
        position: relative;
        text-align: center;
        border-bottom: 1upx solid #F5F5F5;

        .title {
            line-height: 112upx;
            font-size:36upx;
            color:rgba(34,34,34,1);
        }
        .close {
            width: 28upx;
            height: 28upx;
            position: absolute;
            right: 30upx;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .password-input-list {
        display: flex;
        font-size:60upx;
        color:rgba(34,34,34,1);
        justify-content: center;
        margin-top: 100upx;
        margin-bottom: 120upx;
        position: relative;

        .password-item {
            text-align: center;
            width: 97upx;
            height:100upx;
            line-height:100upx;
            border: 1upx solid #e2e2e2;
            border-left: 0;
            &:first-child {
                border-left: 1upx solid #e2e2e2;
            }
        }



    }

    .button {
        width: 400upx;
        margin: 0 auto 140upx;
    }

    .hideInput {
        position: absolute;
        width: 1200upx;
        height:100upx !important;
        line-height:100upx !important;
        top: 0;
        left: -500upx;
        z-index: 9;
        opacity: 0;
    }

    .hide {
        transform: scale(0);
    }

</style>