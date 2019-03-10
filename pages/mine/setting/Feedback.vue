<template>
    <view class="page">
        <view class="textarea-container">
            <textarea v-model="content" placeholder="留下您的反馈建议" placeholder-style="color: #999999" maxlength="200" />
            <view class="count">{{ content.length }}/200</view>
        </view>
        <view class="upload-container">
            <view class="title">上传相关截图</view>
            <view class="image-list">
                <view class="image-item" v-for="(image, index) in imageList">
                    <image class="image" :src="image" mode="aspectFit" @click="previewImage(image)"></image>
                    <image class="close" @click="removeImage(index)" src="../../../static/mine/icon_delete.png"></image>
                </view>
                <view class="image-item upload" @click="chooseImage" v-if="imageList.length < maxImageCount">
                    <image class="image" src="../../../static/mine/upload_add.png"></image>
                </view>

            </view>
        </view>
    </view>
</template>

<script>

    import NavigationBar from "../../../components/NavigationBar";
    const MAX_IMAGE_COUNT = 3;

    export default {
        name: "Feedback",
        components: {NavigationBar},
        data () {
            return {
                content: '',
                imageList: [],
                maxImageCount: MAX_IMAGE_COUNT,
            }
        },

        onNavigationBarButtonTap (e) {
            this.submit();
        },

        methods: {
            chooseImage () {
                uni.chooseImage({
                    count: 2,
                    sizeType: ['compressed'],
                    success: res => {
                        this.imageList = this.imageList.concat(res.tempFilePaths);
                        console.log(JSON.stringify(res.tempFilePaths));
                    }
                });
            },

            removeImage (index) {
                this.imageList.splice(index, 1);
            },

            previewImage (url) {
                uni.previewImage({
                    current: url,
                    urls: this.imageList,
                });
            },

            redirectSuccess () {
                this.redirectTo('../SuccessPage', {
                    title: '意见反馈',
                    message: '提交成功'
                })
            },

            submit () {
                uni.showLoading();
                setTimeout(() => {
                    this.redirectSuccess();
                    uni.hideLoading();
                }, 300);
            },

        },

    }
</script>

<style scoped lang="less">

    .page {
        min-height: 100vh;
        background-color: #F2F2F2;
    }

    .textarea-container {
        background-color: #ffffff;
        position: relative;
        margin-bottom: 1upx;
        textarea {
            width: 100%;
            height: 367upx;
            box-sizing: border-box;
            padding: 48upx 50upx;
            color: #222;
            line-height: 52upx;
        }
        .count {
            position: absolute;
            font-size:24upx;
            color:rgba(153,153,153,1);
            right: 30upx;
            bottom: 42upx;
        }
    }

    .upload-container {
        background-color: #ffffff;
        padding: 60upx 50upx;
        .title {
            font-size:28upx;
            color:rgba(34,34,34,1);
            margin-bottom: 48upx;
        }
        .image-list {
            display: flex;
            flex-wrap: wrap;
        }
        .image-item {
            width:200upx;
            height:200upx;
            position: relative;
            margin-right: 24upx;
            margin-bottom: 24upx;

            &:nth-child(3n) {
                margin-right: 0;
            }

            .image {
                width:200upx;
                height:200upx;
            }
            .close {
                width:32upx;
                height:32upx;
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(50%, -50%);
            }
        }
    }

</style>