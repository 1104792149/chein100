<template>
    <view class="page">

        <swiper @change="onChange">
            <swiper-item>
                <view class="guide-page p1">
                    <image class="guide-image" src="/static/guide/p1_image.png"></image>
                    <image class="guide-text" src="/static/guide/p1_text.png"></image>
                </view>
            </swiper-item>
            <swiper-item>
                <view class="guide-page p2">
                    <image class="guide-image" src="/static/guide/p2_image.png"></image>
                    <image class="guide-text" src="/static/guide/p2_text.png"></image>
                </view>
            </swiper-item>
            <swiper-item>
                <view class="guide-page p3">
                    <image class="guide-image" src="/static/guide/p3_image.png"></image>
                    <image class="guide-text" src="/static/guide/p3_text.png"></image>
                </view>
            </swiper-item>
            <swiper-item>
                <view class="guide-page p4">
                    <image class="guide-image" src="/static/guide/p4_image.png"></image>
                    <image class="guide-text" src="/static/guide/p4_text.png"></image>
                </view>

                <button class="btn" plain @click="start">倒计时开始</button>
            </swiper-item>
        </swiper>

        <view class="indicator">
            <view class="indicator-dots" v-for="(n, index) in 4" :key='index' :class="{ active: current === index }"></view>
        </view>

    </view>
</template>

<script>

    import store from '@/js/store'

    export default {
        name: "Guide",

        data () {
            return {
                current: 0,
            }
        },

        methods: {
            onChange (e) {
                this.current = e.detail.current;
            },

            start () {
                store.updateLaunch();
                // uni.reLaunch({ url: '/pages/login/zero' });
				uni.navigateTo({
					url: '/pages/login/zero' 
				})
            },

        }

    }
</script>

<style scoped lang="less">

    swiper {
        height: 100vh;
    }


    .guide-page {
        text-align: center;
    }
    .guide-image {
        width: 520upx;
        height: 640upx;
        margin-bottom: 46upx;
        margin-top: 150upx;
    }
    .guide-text {
        width: 475upx;
        height: 133upx;
    }

    .p3 {
        .guide-text {
            width: 531upx;
            height: 134upx;
        }
    }

    .p4 {
        .guide-text {
            width: 395upx;
            height: 133upx;
        }
    }

    .btn {
        width:320upx;
        height:80upx;
        line-height:80upx;
        border:2upx solid rgba(201,166,117,1);
        border-radius:40upx;
        margin-top: 87upx;
        font-size:32upx;
        color:rgba(201,166,117,1);

        &:active {
            opacity: 0.7;
        }

    }

    .indicator {
        display: flex;
        position: fixed;
        bottom: 85upx;
        width: 100%;
        justify-content: center;

        .indicator-dots {
            width:16upx;
            height:16upx;
            background:rgba(191,191,191,1);
            border-radius:50%;
            margin-right: 28upx;

            &:last-child {
                margin-right: 0;
            }

            &.active {
                background: #222222;
            }
        }
    }



</style>