<template>
	<view class="page">
		
		<view class="address" @click="addressTap">
			<view class="address-left"  >
				<view>
					<view  v-if="addressItem" class="address-left-top clamp2">{{addressItem.province}}{{addressItem.city}}{{addressItem.area}}{{addressItem.address}}</view>
					<view  v-if="addressItem" class="address-left-center clamp1">{{addressItem.name}} {{addressItem.phone}}</view>
				</view>
				<view  v-if="!addressItem" class="address-left-buttom">请选择收货地址</view>
			</view>
			<view >
				<image class="ic-right" src="../../../static/mine/wallet/arroes@2x.png"></image>
			</view>
		</view>
		<view class="tishi">
			确认领取奖品
		</view>
		<view class="arrPrize">
			<label v-for="(item,index) in newList" :key='index'>
			<view class="arrPrize-item">
				<text>{{item.giftName}}</text>
				<text>X{{item.num}}</text>
			</view>
			</label>
		</view>
		
		<view class="button-select">
			<view class="button-select-left">
				<text>合计:</text>
				<text>{{list.length}}</text>
				<text>件</text>
			</view>
			<view class="button-select-rigth">
				<button @click="toPickUpTap" :disabled="!addressItem" class="btn-primary">
					去领取
				</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import store from '@/js/store'
	export default {
		data() {
			return {
				list:[],
				addressItem:''
			};
		},
		onLoad(e) {
			store.upAddress('');
			console.info(JSON.parse(e.data));
			this.list=JSON.parse(e.data);
		},
		onShow() {
			this.addressItem=store.getAddress()||'';
			console.info(this.addressItem)
		},
		computed:{
			userGifIds(){
				let value=''
				this.list.forEach(item => {
				       value+=value?','+item.id:item.id;
				    });
					return value;
			},
			newList(){
				this.list.forEach(item => {
				   item.num=1;
				});
				var tmp = {};
				for(var i = 0, len = this.list.length; i < len; i++){
					var obj = this.list[i];        
						if(obj.giftId in tmp){
						tmp[obj.giftId].num += obj.num;
					}else{
						tmp[obj.giftId] = obj;
					}
				}
				var result = [];
				for(var key in tmp){
					result.push(tmp[key]);
				}
				return result;
			}
		},
		methods: {
			//地址
			addressTap(){
				 this.navigateTo('/pages/task/zhuanpan/address')
			},
			//去领取 
			toPickUpTap(){
				this.$api.receiveGift(this.userGifIds,this.addressItem.id).then(res=>{
					console.info(res)
					store.upLogStatus(true);
					this.redirectTo('/pages/mine/SuccessPage',{title:'确认领取',message:'提交成功',type:1})
				}).catch(error=>{
					uni.hideLoading();
					if (error.code !== '1005') {
							this.showError(error);
					}
				});
			},
			
			
		}
	}
</script>

<style scoped>
.page{
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
	padding-bottom: 230upx;
	}
.ic-right{
	width: 14upx;
	height: 24upx;
}
.address{
	display: flex;
	flex-direction: row;
	align-items:center;
	justify-content: space-between;
	padding: 26upx 30upx;
}
.address-left{
	min-height: 108upx;
	display: flex;
	flex-direction: row;
	align-items:center;
	justify-content: space-between;
	font-size: 30upx;
}
.address-left-top{
	color: #1E1E1E;
	font-size: 30upx;
	width: 420upx;
}
.address-left-center{
	margin-top: 9upx;
	color: #999;
	font-size: 24upx;
	width: 420upx;
}
.tishi{
	background: #F5F5F5;
	height: 68upx;
	line-height: 68upx;
	padding-left: 30upx;
	color: #999999;
	font-size: 22upx;
}
.arrPrize{
	padding: 0 30upx;
	color: #1E1E1E;
	font-size: 30upx;
}
.arrPrize-item{
	padding: 66upx 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-bottom: #EBEBEB solid 1upx;
}
/* 底部选择 */
	.button-select{
		display: flex;
		flex-direction: row;
		align-items:center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		width: 100vw;
		padding: 30upx 0;
		border-top: #EBEBEB 1upx solid;
		background: #FFFFFF;
		
	}
	.button-select-left{
		color: #1E1E1E;
		font-size: 30upx;
		padding-left:62upx;
	}
	.button-select-rigth {
		padding-right: 30upx;
	}
	.button-select-rigth button{
		height: 68upx;
		width: 196upx;
		border-radius: 68upx;
		line-height: 68upx;
		font-size: 36upx;
		text-align: center;
		color: #6F4F2B;
	}
</style>
