<template>
	<view class="page">
		<image src="../../../static/mine/successIcon.png" mode="" class="successSubmit"></image>
		<view class="success_text">
			<text>提交成功 \n</text>
			<text>审核成功后将于1个工作日内安排发货</text>
		</view>
		<view class="seeDocument" @click="navigateTo('./myPrize')">查看中奖记录</view>
	</view>
</template>

<script>
	import NavigationBar from "../../../components/NavigationBar";
	export default {
		components: {NavigationBar},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.page{
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
.successSubmit{
	width: 208upx;
	height: 194upx;
	margin-top: 154upx;
	margin-left: 258upx;
	display: block;
}
.success_text{
	font-size: 32upx;
	text-align: center;
	line-height: 60upx;
	color: #999999;
}
.seeDocument{
	width: 196upx;
	height: 48upx;
	margin: 30upx auto;
	text-align: center;
	line-height: 48upx;
	color: #999999;
	border: 2upx solid #999999;
	border-radius: 24upx;
	font-size: 24upx;
}
</style>
