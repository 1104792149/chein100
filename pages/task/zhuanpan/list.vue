<template>
	<view class="prize_list_container">
		<view class="prize_list_title">
			<text>中奖名单：</text>
			<navigator url="/pages/task/zhuanpan/myPrize" class="my_prize_n">
				<text style="vertical-align: middle;">我的奖品</text>
				<image src="../../../static/images/task/z_right.png" mode="" class="z_right"></image>
			</navigator>
		</view>
		<view class="prize_list_content">
			<view class="prize_list_content2" :class="[animate?'anim':'']">
				<view class="prize_list_item" v-for="(item,index) in lists" :key='index' @click="getPrize(0,item.id)">
					<text class="prize_list_nickname">{{item.nickName}}</text>
					<text class="prize_list_goods">{{item.giftName}}</text>
					<text class="prize_list_time">{{item.time}}</text>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		name:'list',
		props:['lists','animate'],
		onReady(e) {
			
		},
		methods:{
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
.prize_list_container{
	width: 650upx;
	margin:0 auto;
}
.prize_list_title{
	color: #FFFFFF;
	font-size: 32upx;
	height: 130upx;
	line-height: 130upx;
}
.my_prize_n{
	width: 140upx;
	height: 130upx;
	line-height: 130upx;
	color: #C9A675;font-size: 24upx;
	float: right;
	text-align: right;
}
.prize_list_content{
	width: 650upx;
	height: 600upx;
	margin: 0 auto;
	background:rgba(34,34,34,0.3);
	overflow: hidden;
}
.prize_list_content2{
	width: 100%;
}
.prize_list_item{
	width: 100%;
	height: 100upx;
	line-height: 100upx;
	font-size: 28upx;
	color:rgba(216,216,216,1);
	text-align: left;
	transition: all 1s;
	-moz-transition: all 1s;
	-webkit-transition: all 1s;
	-o-transition: all 1s;
}
.prize_list_nickname{
	width: 150upx;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	margin-left: 30upx;
	float: left;
}
.prize_list_goods{
	margin-left: 40upx;
	width: 200upx;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	float: left;
}
.prize_list_time{
	margin-right: 30upx;
	width: 140upx;
	float: right;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.anim{
	transition: all 0.5s;
	-moz-transition: all 0.5s;
	-webkit-transition: all 0.5s;
	-o-transition: all 0.5s;
	margin-top: -100upx;
}
.z_right{
	width: 14upx;
	height: 24upx;
	margin-left: 10upx;
	vertical-align: middle;
}

</style>
