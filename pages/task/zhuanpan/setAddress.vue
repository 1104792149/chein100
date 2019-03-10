<template>
	<view class="page">
		<!-- #ifdef H5 -->
		<view @click="aa" style="z-index: 9999;color: red;position: fixed;top: 0;">
			删除
		</view>
		<!-- #endif -->
		 <view class="list">
			 <view class="list-input">
			 			  <text>姓名</text>
			 			   <input
			 			    name="name"
							v-model="userName"
			 			    placeholder="收货人名称"
			 			  >
			 </view>
			 <view class="list-input">
			 			  <text>手机号码</text>
			 			   <input
			 			    maxlength="11"
			 			    name="phone"
							v-model="userPhone"
			 			    type="number"
			 			    placeholder="收货人手机号码"
			 			  >
			 </view>
			 <view class="list-input"  @click="showMulLinkageThreePicker">
			 			  <text>收货地址</text>
			 			    <view  :class="[pickerText?'pickerText2':'pickerText1']" @click="addTap">{{pickerText?pickerText:'省、市、区'}}</view>
			 </view>
			  <view class="list-input">
			 			  <text>详细地址</text>
			 			   <input
			 			    maxlength="11"
			 			    name="addressDate"
							v-model="datePickerText"
			 			    placeholder="街道、门牌号"
			 			  >
			 </view>
		 </view>
		 
		 <view class="address-yes">
		 	<button class="btn-primary" :disabled="!isValid" @click="notarizeTap">确定</button>
		 </view>
		 
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		  @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		 
	</view>
</template>

<script>
	import store from '@/js/store'
	import mpvueCityPicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '../../../js/city.data.js';
	export default {
			components: {
				mpvueCityPicker
			},
			data() {
				return {
					mulLinkageTwoPicker: cityData,
					cityPickerValueDefault: [0, 0, 1],
					themeColor: '#007AFF',
					//地址
					pickerText: '',
					//详细地址
					datePickerText:'',
					mode: '',
					//收货电话号码
					userPhone:'',
					//收货人
					userName:'',
					addId:'',
				};
			},
			onLoad(e) {
				console.info(e)
				this.userName=e.name;
				this.userPhone=e.phone;
				this.datePickerText=e.address;
				this.pickerText=e.province+'-'+e.city+'-'+e.area;
				this.addId=e.id;
			},
			computed: {
			  isValid () {
				if (!this.userName) return false;
				if (!this.userPhone) return false;
				if (!this.pickerText) return false;
				if (!this.datePickerText) return false;
			    return true;
			  },
			},
			onNavigationBarButtonTap () {
				  //删除地址
				 this.addDelete();
			},
			methods: {
				aa(){
					this.addDelete();
				},
				addDelete(){
					 //删除地址
						uni.showLoading({title: '删除中...'});
						this.$api.addDelete(this.addId).then(res=>{
							uni.hideLoading();
							this.showToast("删除成功");
							if(store.getAddress().id==this.addId){
								store.upAddress('');
							}
							setTimeout(()=>{
								uni.navigateBack({
									delta: 1
								});
							},2000);
						}).catch((err) => {
							uni.hideLoading();
							if (err.code !== '1005') {
								this.showToast(err.message?err.message:'未知错误');
							}
					});
				},
				notarizeTap(){
					 if (!this.userPhone) {
					  this.showToast("手机号码不能为空!");
					  return false;
					} else if (
					  !this.userPhone.match(
					    /^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/
					  )
					) {
					  this.showToast("请输入正确的电话号码!");
					  return false;
					} else if (!this.userName) {
					  this.showToast("收货人姓名不能为空!");
					  return false;
					} else if (!this.pickerText) {
					  this.showToast("请选择收货地址!");
					  return false;
					} else if (!this.datePickerText) {
					  this.showToast("请输入详细地址");
					  return false;
					} 
					var arr=this.pickerText.split('-');
					var data={name:this.userName,phone:this.userPhone,province:arr[0],city:arr[1],area:arr[2],address:this.datePickerText,id:this.addId};
					console.info(data)
					uni.showLoading({title: '提交中...'});
					this.$api.addUpdate(data).then((res)=>{
						uni.hideLoading();
						this.showToast("修改成功");
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						},2000)
					}).catch((err) => {
            uni.hideLoading();
						if (err.code !== '1005') {
							this.showToast(err.message?err.message:'未知错误');
						}
          });
				},
				onCancel(e) {
					console.log(e)
				},
				// 三级联动选择
				showMulLinkageThreePicker() {
					this.$refs.mpvueCityPicker.show()
				},
				onConfirm(e) {
					console.info(e)
					this.pickerText = e.label;
				}
			},
			onBackPress() {
				if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
				}
			},
			onUnload() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel()
				}
				}
		};
	</script>
</script>

<style scoped="scoped">
.page{
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
	
}
.list{
	padding: 0 30upx;
}
.list-input{
	display: flex;flex-direction: row;align-items: center;justify-content: space-between;
	font-size: 30upx;
	color: #222222;
	padding: 46upx 0;
	border-bottom: #EBEBEB solid 1upx;
}
.list-input input{
	text-align: right;
	color: #222222;
}
.address-yes {
	padding: 140upx 0;
}
.address-yes button{
	height: 110upx;
	width: 610upx;
	font-size: 36upx;
	line-height: 110upx;
	border-radius: 110upx;
}
.pickerText1{
	color: #999;
}
.pickerText2{
	color: #222222;
}
</style>
