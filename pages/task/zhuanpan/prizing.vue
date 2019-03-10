<template>
	<view>
		<view class="zhezhaoceng" @click="hide1" v-if="showPrizingToast"></view>
		<view class="prize_toast" v-bind:class="[!showPrizingToast?'hide_prize_toast':'']">

			<!-- 1-BTA 2-积分 3-实物 -->
			<!-- 实物 -->
			<template v-if="current_gift_item.giftType==3">
				<image class="prize_img" :src="current_gift_item.giftImage"></image>
				<view class="prize_desc">恭喜你获得{{current_gift_item.giftName}}</view>
				<view class="hasGived">请在【我的奖品】中查看领取</view>
			</template>
			<!-- BTa -->
			<template v-if="current_gift_item.giftType==1">
				<image src="../../../static/images/task/close_icon.png" mode="" class="close_icon" @click="hide1"></image>
				<view class="bta_prize">{{current_gift_item.giftName}}</view>
				<view class="prize_desc2">恭喜你获得{{current_gift_item.giftName}}</view>
				<view class="hasGived">系统已自动将以上BTA下发至您的账户</view>
			</template>
			<template v-if="current_gift_item.giftType==2">
				<image src="../../../static/images/task/close_icon.png" mode="" class="close_icon" @click="hide1"></image>
				<view class="bta_prize">{{current_gift_item.giftName}}</view>
				<view class="prize_desc2">恭喜你获得{{current_gift_item.giftName}}</view>
				<view class="hasGived">系统已自动将以上积分下发至您的账户</view>
			</template>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				
			};
		},
		name: 'prizing',
		props: ['current_gift_item', 'hide','showPrizingToast'],
		onLoad() {
			console.log(this.current_gift_item);
		},
		methods: {
			hide1() {
				this.$emit('hide');
			},
			getPrize(id,userGiftId){
				this.$emit('hide');
				uni.navigateTo({
					url:'/pages/task/zhuanpan/submitAddress?giftId=' + id +'&userGiftId=' + userGiftId ,
				})
			}
		}
	}
</script>

<style scoped>
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
		/* top: 391upx; */
		/* left: 85upx; */
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
		display: block;
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
		/* background: linear-gradient(126deg, rgba(215, 171, 108, 1), rgba(239, 201, 146, 1)); */
		background: rgba(201,166,117,1);
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
		margin: 160upx auto 0;
		font-size: 60upx;
		color: #C9A675;
	}

	.prize_desc2 {
		width: 100%;
		height: 32upx;
		line-height: 32upx;
		text-align: center;
		margin: 65upx auto 0;
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
</style>
