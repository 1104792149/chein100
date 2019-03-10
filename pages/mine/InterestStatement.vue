<template>
    <view class="page">
        <web-view class="webView" :webview-styles="webviewStyles" src="/hybrid/html/equity.html"></web-view>
    </view>
</template>

<script>
    export default {
        name: "InterestStatement",

        data () {
            return {
                webviewStyles: {
                    progress: false
                },
            }
        },

        mounted () {
            uni.setNavigationBarTitle({ title: '节点权益' })
        },

    }
</script>

<style scoped>

    .page {
        width: 100vw;
        height: 100vh;
    }
    .webView {
        width: 100vw;
        height: 100vh;
    }

</style>