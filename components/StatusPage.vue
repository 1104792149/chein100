<template>
    <view class="status-page" v-if="status" :class="{ fixed }">

        <view v-if="status === 'empty'">
            <image src="/static/statusPage/empty.png"></image>
            <view class="text">{{ customEmptyText || '空空如也～' }}</view>
        </view>

        <view v-if="status === 'network'">
            <image src="/static/statusPage/network.png"></image>
            <view class="text">网络不太顺畅哦！</view>
            <button palin @click="$emit('retry')">重新加载</button>
        </view>

        <view v-if="status === 'noSearchResult'">
            <image src="/static/statusPage/search.png"></image>
            <view class="text">{{customEmptyText||"没有搜到对应项目，换个关键词试试？"}}</view>
        </view>

        <view v-if="status === 'noOpen'">
            <image src="/static/statusPage/noOpen.png"></image>
            <view class="text">敬请期待！</view>
        </view>

    </view>
</template>

<script>
    export default {
        name: "StatusPage",

        props: {
            status: String,
            fixed: {
                type: Boolean,
                default: true,
            },
            customEmptyText: String
        },

    }
</script>

<style scoped lang="less">

    .status-page {
        left: 0;
        top: 0;
        width: 100vw;

        background-color: #ffffff;
        text-align: center;
        z-index: 888;

        &.fixed {
            height: 100vh;
            position: fixed;
        }

    }

    image {
        width: 371upx;
        height: 292upx;
        margin-top: 269upx;
        margin-bottom: 20upx;
    }

    .text {
        font-size:24upx;
        color:rgba(153,153,153,1);
        line-height:70upx;
        margin-bottom: 55upx;
    }

    button {
        display: inline-block;
        padding: 0 30upx;
        height:60upx;
        line-height:60upx;
        border:1upx solid rgba(153,153,153,1);
        border-radius:30upx;
        background-color: #ffffff;

        font-size:20upx;
        color:rgba(153,153,153,1);
    }

</style>