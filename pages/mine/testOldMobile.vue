<template>
	<view>
		<view class="container">
			<view class="code_msg">验证码已发送至</view>
			<view class="mobile">{{mobile}}</view>
			<view class="code">
				<input type="number" placeholder="输入验证码" v-model="code" class="codeInput" placeholder-class="placeholder">
				<view class="send" @click="getCode()">{{btn_show_type!=1?"重新发送":countDown+"s"}}</view>

			</view>
			<button
					@click="next()"
					class="now_login btn-primary"
					:disabled="!isValid"
			>下一步</button>
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
				mobile:'',
			};
		},
		computed:{
			isValid () {
				return this.code.length==6;
			}
		},
		onLoad(option){
			this.mobile = option.mobile;
			this.getCode();
		},
		methods:{
			next(){
				uni.showLoading();
				this.$api.validateMsgCode(this.code,this.mobile).then(res =>{
					uni.hideLoading();
					uni.redirectTo({
						url: '/pages/mine/testNewMobile?mobile=' + this.mobile
					});
				}).catch(error => {
					uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
				});
			},
			getCode() {
				uni.showLoading({ title: "请求发送中" });
				this.$api.getCode(this.mobile).then(result => {
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

<style>
	.container{
		margin: 112upx 69upx 0;
		color: #222222;
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
</style>
