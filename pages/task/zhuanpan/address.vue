<template>
	<view class="page">
		<label v-for="(item,index) in addArr" :key='index'>
			<view class="address">
				<view class="address-left" @click="addressItmeTap(item)">
					<view class="address-left-top clamp2">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
					<view class="address-left-buttom clamp1">{{item.name}} {{item.phone}}</view>
				</view>
				<view @click="setAddressTap(item)">
					<image class="ic-right" src="../../../static/images/task/iconfontedit2x.png"></image>
				</view>
			</view>
		</label>
		
		<view class="address-add">
			<button class="btn-primary" @click="addAddressTap">新增收货地址</button>
		</view>
	</view>
</template>

<script>
	import store from '@/js/store'
	export default {
		data() {
			return {
				addArr:[]
			};
		},
		onShow() {
			this.addList();
		},
		methods:{
			addressItmeTap(itme){
				store.upAddress(itme);
				uni.navigateBack({
					delta: 1
				});
			},
			// 新增地址
			addAddressTap(){
				 this.navigateTo('/pages/task/zhuanpan/addAddress')
			},
			//修改地址
			setAddressTap(item){
				 this.navigateTo('/pages/task/zhuanpan/setAddress',item)
			},
			//获取地址列表
			addList(){
				this.$api.addList().then(res=>{
					console.info(res)
					this.addArr=res;
				}).catch((err) => {
					uni.hideLoading();
					if (err.code !== '1005') {
						this.showToast(err.message?err.message:'未知错误');
					}
        });
			}
		}
	}
</script>

<style>
.page{
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
		}
.ic-right{
	width: 44upx;
	height: 44upx;
}
.address{
	display: flex;
	flex-direction: row;
	align-items:center;
	justify-content: space-between;
	padding: 26upx 0;
	margin: 0 30upx;
	border-bottom: #EBEBEB solid 1upx;
}
.address-left{
	min-height: 108upx;
}
.address-left-top{
	color: #1E1E1E;
	font-size: 30upx;
	width: 420upx;
}
.address-left-buttom{
	margin-top: 9upx;
	color: #999;
	font-size: 24upx;
	width: 420upx;
}
.address-add {
	padding: 140upx 0;
}
.address-add button{
	height: 110upx;
	width: 610upx;
	font-size: 36upx;
	line-height: 110upx;
	border-radius: 110upx;
}
</style>
