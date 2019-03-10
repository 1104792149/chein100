<template>
	<view>
		<view class="closeView" @touchstart="hideS()" @touchmove='hideS()' @longpress='hideS()' v-if="showSign"></view>
		<view class="signing" v-bind:class="[showSign?'top0':'top100']">
			<image src="../../static/images/task/signing.png" mode="" class="signingImg" v-bind:class="[showSign?'top0':'top100']"></image>
			<view class="signing_content" v-bind:class="[showSign?'top0':'top100']">
				<image src="../../static/images/task/sign_back.png" mode="" class="signBack" @tap="hideS"></image>
				<view class="signTime">
					<view class="signTime_item" v-for="(item,index) in signList" :key='index'>
						<view class="date">{{index==3?"今天":index==4?"明天":item.signDate}}</view>
						<view class="lianxu" v-bind:class="[item.isSign==1?'':'col_white']">+{{item.integer}}</view>
						<template v-if="item.isSign==1">
							<image src="../../static/images/task/sign_done.png" mode="" class="sign_done"></image>
						</template>
					</view>
				</view>
				<view class="sign_days_text">
					<text>已连续签到</text>
					<text class="sign_days">{{continueSign}}天</text>
				</view>
				<view class="heji">
					<text>合计领取</text>
					<text class="hejijifen">{{totalSignInteger}}积分</text>
				</view>
				<view class="goOnSign" @click="goSign()" v-bind:class="[todaySign==0?'':'op50']">{{todaySign==0?"立即签到":todaySign==1?"已签到":""}}</view>
				<view class="shouqi" @click="hideS">
					<text>收起</text>
					<image src="../../static/images/task/shouqi.png" mode="" class="shouqitupian"></image>
				</view>
			</view>
		</view>
		<!-- <template> -->
			<view class="zhezhaoceng" @click="hideSignToast" v-if="signSuccessToast"></view>
			<view class="prize_toast" v-bind:class="[!signSuccessToast?'hide_prize_toast':'']">
				<image src="../../static/images/task/close_icon.png" mode="" class="close_icon" @click="hideSignToast"></image>
				<view class="bta_prize">{{today_sign_integral}}积分</view>
				<view class="prize_desc2" v-if="!todayis7">签到成功！恭喜你获得{{today_sign_integral}}积分</view>
				<view class="prize_desc2" v-else>
					<text>签到成功！\n</text>
					<text>恭喜你额外获得一次转盘机会</text>
				</view>
				<view class="hasGived">系统已自动将以上积分下发至您的账户</view>
			</view>
		<!-- </template> -->
	</view>
</template>

<script>
	import format from 'date-fns/format';
	import api from '../../js/api/module/task.js';
	export default {
		data() {
			return {
				totalSignInteger: 0, //总积分
				lastSignInDays: 0, //连续签到天数
				signList: [], //签到列表
				todaySign: 0, //今天是否签到
				today_sign_integral:'',//今天签到的积分
				signSuccessToast:false,//签到是否成功的标志
				continueSign:0,
				todayis7:false,
				preventStatus:false,
			};
		},
		// 		components:{
		// 			prizing,
		// 		},
		updated() {

		},
		onLoad() {

		},

		watch: {
			showSign (show) {
				if (show) {
					this.getUserSignInInfo();
				}
			},
		},

		computed: {
			position_top() {
				let top = this.showSign ? '47upx' : '-100vh';
				return 'top:' + top;
			}
		},
		props: ['showSign', 'changeShowSign', 'changeIntegralTotal'],
		methods: {

			hideS() {
				this.$emit('changeShowSign');
			},
			getUserSignInInfo() {
				// if(!this.showSign) return;
				api.getUserSignInInfo().then((res) => {
					console.log(res);
					this.signList = res.signList;//签到列表
					this.todaySign = res.todaySign;//今日签到积分：0未签到,非0,已签到
					this.totalIntegral = res.totalIntegral;
					this.continueSign = res.continueSign;//	连续签到天数
					this.totalSignInteger = res.totalSignInteger;//	签到获取总积分
					this.$emit('changeIntegralTotal',this.totalSignInteger);
				}).catch((err) => {
					if (err.code !== '1005') {
							this.showToast(err.message?err.message:'未知错误');
					}
				});
			},

			goSign() {
				if(this.todaySign==1) return;
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				uni.showLoading();
				api.userSignIn().then((res) => {
					this.today_sign_integral = res.todayInteger;
					this.todayis7 = res.isAddTurnTable==1;
					this.signSuccessToast = true;
					this.getUserSignInInfo();
					this.preventStatus=false;
					uni.hideLoading();
				}).catch((err) => {
					this.preventStatus=false;
					uni.hideLoading();
					if (err.code !== '1005') {
							this.showToast(err.message?err.message:'未知错误');
					}
				});
			},
			hideSignToast(){
				this.signSuccessToast = false;
			}
		}
	}
</script>

<style scoped>
	.signing {
		width: 100%;
		height: 688upx;
		position: fixed;
		z-index: 4;
		left: 0;
		transition: all 0.7s;
	}
	.signingImg {
		width: 100%;
		height: 688upx;
		position: fixed;
		left: 0;
		z-index: 5;
		transition: all 0.7s;
	}
	.top100 {
		top: -100vh;
	}
	.top0{
		top: 0upx;
	}
	.signing_content {
		width: 690upx;
		height: 688upx;
		position: fixed;
		left: 30upx;
		z-index: 6;
		transition: all 0.7s;
	}

	.col_white {
		color: #FFFFFF !important;
	}

	.signBack {
		width: 15upx;
		height: 28upx;
		margin-top: 76upx;
	}

	.signTime {
		width: 100%;
		display: flex;
		justify-content: space-between;
		text-align: center;
		margin-top: 61upx;
		min-height: 160upx;
	}

	.date {
		font-size: 24upx;
		font-family: FZLTHK--GBK1-0;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		height: 25upx;
		line-height: 25upx;
	}

	.lianxu {
		font-size: 24upx;
		font-family: FZLTHK--GBK1-0;
		font-weight: bold;
		color: #C9A675;
		height: 25upx;
		line-height: 25upx;
		margin-top: 51upx;
	}

	.sign_done {
		width: 29upx;
		height: 29upx;
		margin-top: 25upx;
	}

	.sign_days_text {
		margin-top: 20upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		font-weight: bold;
		font-size: 32upx;
		line-height: 32upx;
	}

	.sign_days {
		font-size: 32upx;
		font-family: FZLTHK--GBK1-0;
		font-weight: bold;
		color: rgba(201, 166, 117, 1);
		margin-left: 40upx;
	}

	.heji {
		margin-top: 40upx;
		font-size: 28upx;
	}

	.heji {
		margin-top: 40upx;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
	}

	.hejijifen {
		font-weight: 400;
		margin-left: 40upx;
		color: rgba(201, 166, 117, 1);
	}

	.goOnSign {
		width: 690upx;
		height: 100upx;
		font-weight: bold;
		font-size: 32upx;
		color: rgba(111, 79, 43, 1);
		text-align: center;
		line-height: 100upx;
		border-radius: 50px;
		background: #C9A675;
		margin-top: 41upx;
	}

	.op50 {
		opacity: 0.5;
	}

	.shouqi {
		width: 100%;
		text-align: center;
		vertical-align: middle;
		font-size: 24upx;
		color: #999999;
		margin-top: 36upx;
		height: 50upx;
		position: absolute;
		bottom: 0;
	}

	.shouqitupian {
		width: 22upx;
		height: 22upx;
		display: inline-block;
		vertical-align: middle;
		margin-left: 7upx;
	}

	.close_icon {
		width: 28upx;
		height: 28upx;
		float: right;
		margin-right: 37upx;
		margin-top: 37upx;


	}

	.prize_toast {
		width: 580upx;
		height: 554upx;
		position: fixed;
		z-index: 100;
		background-color: white;
		top: 50%;
		left: 85upx;
		transform: translateY(-50%) scale(1);
		transition: all 0.7s;
		transform-origin: 50% 0;
		opacity: 1;
	}
	.hide_prize_toast{
		transform: scale(0);
		opacity: 0;
	}
	.prize_img {
		width: 210upx;
		height: 210upx;
		margin: 70upx auto 0;
	}

	.prize_desc {
		color: #1E1E1E;
		font-size: 32upx;
		width: 100%;
		text-align: center;
		line-height: 32upx;
	}

	.getPrize {
		width: 420upx;
		height: 80upx;
		margin: 90upx auto 0;
		text-align: center;
		line-height: 80upx;
		background: linear-gradient(126deg, rgba(215, 171, 108, 1), rgba(239, 201, 146, 1));
		box-shadow: 0px 3px 7px 0px rgba(162, 78, 127, 0.35);
		border-radius: 40upx;
		color: rgba(93, 77, 58, 1);
		font-size: 32upx;
	}

	/*BTA奖励类型*/
	.bta_prize {
		width: 100%;
		height: 50upx;
		line-height: 50upx;
		text-align: center;
		margin: 150upx auto 0;
		font-size: 60upx;
		color: #C9A675;
	}

	.prize_desc2 {
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		margin: 60upx auto 0;
		font-size: 32upx;
		color: #1E1E1E;
	}

	.hasGived {
		width: 100%;
		height: 24upx;
		line-height: 24upx;
		text-align: center;
		margin: 140upx auto 0;
		font-size: 24upx;
		color: #999999;
	}

	.zhezhaoceng {
		width: 100%;
		height: 100vh;
		z-index: 20;
		background-color: #000000;
		opacity: 0.8;
		position: fixed;
		top: 0;
		left: 0;
	}
	.closeView{
		width: 100%;
		height: 100vh;
		position: fixed;
		z-index: 3;
		top: 0;
		left: 0;
	}
</style>
