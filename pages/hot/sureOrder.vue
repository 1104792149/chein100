<template>
	<view class="page">
		<view class="detail_top">
			<image src="" mode="" class="detail_img"></image>
			<view class="detail_desc">
				<view class="detail_name">万宝路黑冰爆珠</view>
				<view class="detail_price">￥ 25.00</view>
			</view>
			<view class="detail_top_right">
				<view class="detail_reduce" @click="reduce">
					-
				</view>
				<input type="number" v-model="order.num" class="detail_num" />
				<view class="add" @click="add">
					+
				</view>
			</view>
		</view>
		<view class="detail_heji">
			<view style="float: right;margin-right: 30upx;">
				<text>共1件商品 合计:</text>
				<text>￥25.00</text>
			</view>
		</view>
		<view class="blank"></view>
		<!-- 姓名 -->
		<view class="address_item">
			<text class="label" style="vertical-align: middle;">姓名</text>
			<input type="text" class="input" placeholder="请填写姓名" placeholder-style="color: #999999" />
		</view>
		<!-- 手机号码 -->
		<view class="address_item">
			<text class="label" style="vertical-align: middle;">手机号码</text>
			<input class="input" placeholder="请填写手机号码" type="number" maxlength="11" placeholder-style="color: #999999" />
		</view>
		<!-- 收货地址 -->
		<view class="address_item" @click="showAddress">
			<text class="label" style="vertical-align: middle;">收货地址</text>
			<view class="right" v-if="order.province">
				<text>{{ order.province }}</text>
				<text>{{ order.city }}</text>
				<text>{{ order.area }}</text>
			</view>
			<view class="right" style="color: #999999" v-else>
				省、市、区
			</view>
		</view>
		<!-- 详细地址 -->
		<view class="address_item">
			<text class="label" style="vertical-align: middle;">详细地址</text>
			<input type="text" class="input" placeholder="街道、门牌号" placeholder-style="color: #999999" />
		</view>
		<view class="detail_copy">
			<view class="detail_copy_desc">付款钱包地址</view>
			<view style="clear: both;"></view>
			<input type="text" value=""  class="detail_copy_input" placeholder="请输入或长按粘贴地址"/>
		</view>

		<mpvue-city-picker themeColor="#C9A675" ref="mpvueCityPicker" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker';
	import NavigationBar from "../../components/NavigationBar";
	export default {
		data() {
			return {
				order: {
					num: 5
				}
			};
		},
		components: {
			NavigationBar,
			mpvueCityPicker
		},
		methods: {
			reduce(){
				if(this.order.num<=0){
					return;
				}
				this.order.num = Number(this.order.num) - 1;
			},
			add(){
				this.order.num = Number(this.order.num) + 1;
			},
			showAddress() {
				this.$refs.mpvueCityPicker.show();
			},

			onConfirm(e) {
				const data = e.label.split('-');
				this.saveData.province = data[0];
				this.saveData.city = data[1];
				this.saveData.area = data[2];
			},

			pickChange(e) {
				
			},
		}
	}
	// <text style="font-size: 20upx;">.00</text>
</script>

<style>
	.page {
		width: 100%;
		font-size: 30upx;
		color: #222222;
	}

	.detail_top {
		width: 100%;
		height: 173upx;
		border-bottom: 1upx solid #E6E6E6;
		border-top: 1upx solid #E6E6E6;
	}

	.detail_img {
		width: 148upx;
		height: 148upx;
		float: left;
		margin-left: 30upx;
		margin-top: 13upx;
		border: 1upx solid red;
	}

	.detail_desc {
		float: left;
		margin-left: 25upx;
	}

	.detail_name {
		font-size: 26upx;
		margin-top: 21upx;
		line-height: 26upx;
	}

	.detail_price {
		color: #F93336;
		font-size: 24upx;
		margin-top: 35upx;
	}

	.detail_top_right {
		margin-right: 30upx;
		font-size: 20upx;
		float: right;
		margin-top: 70upx;
	}

	.detail_reduce {
		width: 35upx;
		height: 30upx;
		border: 1upx solid rgba(153, 153, 153, 1);
		border-radius: 5upx 0px 0px 5upx;
		text-align: center;
		line-height: 30upx;
		float: left;
		vertical-align: middle;
	}

	.detail_num {
		width: 55upx;
		height: 30upx!important;
		line-height: 30upx!important;
		min-height: 30upx!important;
		text-align: center;
		border-bottom: 1upx solid rgba(153, 153, 153, 1);
		border-top: 1upx solid rgba(153, 153, 153, 1);
		float: left;
		vertical-align: middle;
	}
/* 	.detail_num::before{
		height: 30upx!important;
		line-height: 30upx!important;
	} */
	.add {
		width: 35upx;
		height: 30upx;
		border: 1upx solid rgba(153, 153, 153, 1);
		border-radius: 0px 5upx 5upx 0px;
		text-align: center;
		line-height: 30upx;
		float: left;
		vertical-align: middle;
	}

	.detail_heji {
		font-size: 24upx;
		height: 60upx;
		line-height: 60upx;
	}

	.blank {
		width: 100%;
		height: 17upx;
		background: rgba(242, 242, 242, 1);
	}

	.address_item {
		display: flex;
		width: 690upx;
		height: 120upx;
		font-size: 28upx;
		margin: 0 auto;
		color: #222222;
		line-height: 120upx;
		border-bottom: 1upx solid rgba(242, 242, 242, 1);
	}

	.label {
		flex: 1;
	}

	.input {
		display: inline-block;
		width: 500upx;
		height: 120upx;
		float: right;
		vertical-align: middle;
		text-align: right;
		line-height: 98upx;
	}

	.right {
		color: #222222;
	}
	.detail_copy{
		width: 100%;
		height: 176upx;
		border-bottom: 1upx solid #E6E6E6;
	}
	.detail_copy_desc{
		height: 30upx;
		line-height: 30upx;
		margin-left: 30upx;
		margin-top: 56upx;
		float: left;
	}
	.detail_copy_input{
		margin-left: 30upx;
		margin-top: 30upx;
		float: left;
	}
</style>
