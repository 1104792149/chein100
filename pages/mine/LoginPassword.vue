<template>
    <view class="page">
        <view class="form">
            <view class="form-item">
                <input v-if="isLoginReset" v-model="phone" placeholder="输入手机号" />
                <input v-else :value="phone" disabled />
            </view>
            <view class="form-item">
                <input placeholder="输入验证码" type="number" maxlength="6" v-model="form.verifyCode" />
                <view class="right">
                    <text v-if="isCanSend" class="send_button" @click="sendVerifyCode">发送验证码</text>
                    <text v-else class="count_down">{{ countDown }}s</text>
                </view>
            </view>
            <view class="form-item">
                <input placeholder="输入新密码" maxlength="18" :password="!showPassword" v-model="form.password" @focus="showToast('请输入6-18位数字与字母组合')" />
                <view class="right" @click="showPassword = !showPassword">
                    <image class="icon ic-eye" :class="{ 'ic-eye-on': showPassword }"></image>
                </view>
            </view>
            <view class="form-item">
                <input placeholder="确认新密码" maxlength="18" :password="!showConfirmPassword" v-model="form.confirmPassword" @focus="showToast('请输入6-18位数字与字母组合')"  />
                <view class="right" @click="showConfirmPassword = !showConfirmPassword">
                    <image class="icon ic-eye" :class="{ 'ic-eye-on': showConfirmPassword }"></image>
                </view>
            </view>
        </view>

    </view>
</template>

<script>

    import LoginPasswordMixins from './LoginPasswordMixins';

    export default {

        name: "PayPassword",

        mixins: [LoginPasswordMixins]

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
            right: -10upx;
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

    .btn-primary {
        font-size:36upx;
        height: 140upx;
        line-height: 140upx;
        margin: 30upx 70upx;
        border-radius: 70upx;
    }

</style>