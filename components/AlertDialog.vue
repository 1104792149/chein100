<template>
    <view class="dialog" :class="{ hide: !visible }">

        <view class="mask" :class="{ show: isShow }"></view>

        <view class="dialog-content" :class="{ show: isShow }">

            <view class="dialog-title" v-if="title">{{ title }}</view>

            <view class="message" :style="{ textAlign: messageAlign }">{{ message }}</view>

            <view class="dialog-footer">
                <button class="btn-cancel" plain @click="cancel" v-if="cancelButtonText">{{ cancelButtonText }}</button>
                <button class="btn-confirm" plain @click="confirm" :style="{ color: confirmButtonTextColor }">{{ confirmButtonText }}</button>
            </view>

        </view>

    </view>
</template>

<script>
    export default {
        name: "AlertDialog",

        data () {
            return {
                visible: false,
                isShow: false,

                title: '',
                message: '',
                cancelButtonText: '取消',
                confirmButtonText: '确认',
                messageAlign: '',
                confirmButtonTextColor: '',
            }
        },

        methods: {
            show (args = {}) {
                this.title = args.title || '提示';
                this.message = args.message;
                this.cancelButtonText = args.cancelButtonText;
                this.confirmButtonText = args.confirmButtonText;
                this.messageAlign = args.messageAlign;
                this.confirmButtonTextColor = args.confirmButtonTextColor;

                this.visible = true;
                this.isShow = true;
            },

            close () {
                this.isShow = false;
                setTimeout(() => {
                    this.visible = false;
                }, 300);
            },

            cancel () {
                this.$emit('cancel')
                this.close();
            },

            confirm () {
                this.close();
                this.$emit('confirm');
            }

        },

    }
</script>

<style scoped lang="less">

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background:rgba(34,34,34, 0.5);
        transition: 0.3s ease;
        opacity: 0;
        z-index: 1999;

        &.show {
            opacity: 1;
        }

    }

    .dialog-content {
        position: absolute;
        background:rgba(255,255,255,1);
        border-radius:4upx;
        margin: 0 32upx;
        width: calc(~"100% - "64upx);
        z-index: 2000;
        top: 50%;

        transition: 0.3s ease;
        transform: translateY(-50%) scale(0.2);
        opacity: 0;

        &.show {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }

    }

   .dialog-title {
       font-size:32upx;
       color:rgba(34,34,34,1);
       line-height: 30upx;
       padding: 38upx 0;
       text-align: center;
       border-bottom: 1upx solid #F2F2F2;
   }
    .message {
        font-size:32upx;
        color:rgba(34,34,34,1);
        line-height:40upx;
        text-align: center;
        padding: 90upx 100upx;
    }
    .dialog-footer {
        margin-bottom: 28upx;
        display: flex;
        justify-content: flex-end;
        padding-right: 25upx;
        button {
            display: inline-block;
            font-size:32upx;
            line-height: 30upx;
            padding: 12upx 20upx;
            border: none;
            background: none;
            margin: 0;

            &+button {
                margin-left: 50upx;
            }

            &:after {
                border: none;
            }
        }
        .btn-cancel {
            color:rgba(153,153,153,1);
        }
        .btn-confirm {
            color:rgba(249,51,54,1);
        }
    }

    .hide {
        transform: scale(0);
    }

</style>