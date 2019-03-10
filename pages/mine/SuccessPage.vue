<template>
    <view class="page">

        <view class="content" v-if="type==0">
            <image class="content-image " src="../../static/mine/successIcon.png"></image>
            <view class="desc">{{ message }}</view>
        </view>
		 <view class="content1" v-if="type==1">
		    <image src="../../static/mine/successIcon.png"></image>
			<view class="content1-text1">{{ message }}</view>
			<view class="content1-text2">审核成功后将尽快安排发货</view>
			<view class="content1-text3" @click="myPrizeTap">查看中奖记录</view>
		</view>
    </view>
</template>

<script>

    export default {

        name: "FeedbackSuccess",

        data () {
            return {
                title: '',
                message: '',
				type:0,
            }
        },

        onLoad (option) {
            this.title = option.title;
            this.message = option.message;
			 this.type = option.type||0;
            uni.setNavigationBarTitle({
                title: this.title
            });
        },
		methods:{
			myPrizeTap(){
				//查看中奖记录
				this.navigateTo('/pages/task/zhuanpan/myPrize')
			}
		}

    }
</script>

<style scoped lang="less">

    .content {
        text-align: center;
    }

    .content-image {
        width: 279upx;
        height: 258upx;
        margin: 180upx auto 112upx;
        transform: translateX(-13upx);
    }

    .desc {
        font-size:32upx;
        color:rgba(140,140,140,1);
        line-height:42upx;
    }
	.content1{
		display: flex;flex-direction: column;align-items: center;
		color: #999;
		font-size: 32upx;
	}
	.content1 image{
		width: 208upx;
		height: 194upx;
		margin-top: 180upx;
	}
	.content1-text1{
		margin-top: 52upx;
	}
	.content1-text2{
		margin-bottom: 42upx;
		margin-top: 30upx;
	}
	.content1-text3{
		padding: 14upx 26upx;
		border: solid #999999 1upx;
		font-size: 24upx;
		border-radius: 52upx;
	}
</style>