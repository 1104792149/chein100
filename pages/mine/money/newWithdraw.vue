<!--提币页-->
<template>
	<view class="page ">
		<view class="container">
			<view class="form_item right_input">
				<view class="address_text item_text">转出地址</view>
				<input type="text" v-model="form.toAddress" @change="servicecharge()" placeholder="请输入或长按粘贴地址" placeholder-style="font-size: 30upx;color: #999999;" class="address_input" />
			</view>
			<view style="clear: both;"></view>
			
			<view  class="form_item right_input">
				<view class="address_text item_text">数量</view>
				<view class="bta_text">BTA</view>
				<input type="text" v-model="form.amount" style="width: 260upx;" placeholder="最小提现单位30" placeholder-style="font-size: 30upx;color: #999999;"
				 class="address_input" />
			</view>
			
			<view style="clear: both;"></view>
			<view class="form_item1">
				<view type="text" class="all_input" >{{totalShow}}</view>
				<view class="all_text" @click="allchange">全部转出</view>
			</view>
		</view>
		<view class="blank">转账给平台内用户无需手续费，秒速到账</view>
		<view class="container">
			<view class="form_item right_input" style="border-bottom: none;">
				<view class="address_text item_text">网络手续费</view>
				<view class="bta_text">BTA</view>
				<view type="text" style="width: 240upx;" placeholder="0.00" placeholder-style="font-size: 30upx;color: #999999;"
					  class="address_input" >{{serviceCharge}}</view>
			</view>
			<view style="clear: both;"></view>
		</view>
		<view class="blank2">
			<view style="margin-left: 30upx;color:#999999;display: flex;flex-direction: row;align-items: center;">
				实际到账:
				<text style="color: #222222;margin-left: 5upx;margin-right: 5upx;">0.00000</text>
				BTA
				</view>
		</view>
		<view class="container">
			<view class="form_item right_input">
				<view class="address_text item_text" style="width: 150upx;">短信验证码</view>
				<view
						class="bta_text"
						style="width: 150upx;color: #C9A675"
						@click="sendVerifyCode">
					{{btn_show_type==0?"发送验证码":btn_show_type==2?"重新发送":countDown+"s"}}
				</view>
				<input type="text" v-model="form.code" style="width: 260upx;" placeholder="输入短信验证码" placeholder-style="font-size: 30upx;color: #999999;"
				 class="address_input textLeft" />
			</view>
			<view style="clear: both;"></view>
			<view v-if="0" class="form_item right_input">
				<view class="address_text item_text">支付密码</view>
				<input @change="change" type="text" password='true' v-model="form.payPassword" style="width: 260upx;" placeholder="输入支付密码" placeholder-style="font-size: 30upx;color: #999999;"
				 class="address_input textLeft" />
			</view>
			
			<view style="display: flex;flex-direction: row;align-items: center;height: 120upx;border-bottom: 1upx solid #EBEBEB;font-size: 30upx;color: #222222;">
				<view style="margin-right: 112upx;">支付密码</view>
				<input @change="change" type="text" password='true' 
				v-model="form.payPassword" style="width: 260upx;" placeholder="输入支付密码" placeholder-style="font-size: 30upx;color: #999999;"
				 />
			</view>
			<view style="clear: both;"></view>
		</view>
		<button
				@click="newWithdraw"
				class="now_login btn-primary"
				:disabled="!isValid"
		>确定转出</button>
		
		<view class="need_know">
			<view class="need_know_item1">
				<image src="../../../static/mine/icon_attention2x.png"></image>
				<text>注意事项</text>
			</view>
			<view class="need_know_item2">
				请确认转出地址为ETH地址，向非ETH地址转出将会造成资产损失并且不可找回。
			</view>
			<view class="need_know_item3">
				为保障资金安全，请务必确认电脑及浏览器安全，防止信息被篡改或泄露。
			</view>
		</view>
	</view>
</template>

<script>
	import StatusPage from "../../../components/StatusPage";
	import NavigationBar from "../../../components/NavigationBar";
	import store from '../../../js/store';
	const COUNT_DOWN_S = 60;
	export default {
		name: "Withdraw",

		components: {
			StatusPage,
			NavigationBar
		},

		data() {
			return {
				total: 0,
				selfPhone:store.getPhone(),
				countDown: COUNT_DOWN_S,
				btn_show_type:0,//0代表点击获取，1代表倒计时，2代表重新发送
				form: {
					toAddress: '',//转出地址
					amount: '',//转出金额
					code:'',//验证码
					payPassword:'',//支付密码
				},
				innerAddress:'',//是否内部地址
				serviceCharge:'',//手续费
				preventStatus:false,
			}
		},

		onNavigationBarButtonTap(e) {
			this.openWithdrawHistory();
		},
		mounted() {
			uni.showLoading();
			this.$api.getMyWallet(this.currentPage).then(result => {
				this.total = Number(result.BTA)
				uni.hideLoading();
			}).catch(error => {
				uni.hideLoading();
				if(error.code!='1005'){
					this.showToast(error ? error.message || error : '请检查网络是否连接');
				}
			})
		},

		computed: {
			isValid() {
				return this.form.toAddress && this.form.amount >= 30 && this.isEnough && this.form.code.length==6 && this.form.payPassword;
			},
			isEnough() {
				return this.total >= this.form.amount
			},
			fee() {
				const value = Number(this.form.amount);
				if (isNaN(value) || value <= 0) return '0.00 BTA';
				return '0.00 BTA';
			},
			expectValue() {
				const value = Number(this.form.amount);
				if (isNaN(value) || value <= 0) return '0.00';

				// return Math.max((value - 5), 0).toFixed(2);    //暂无手续费,此处打开后为手续费为5
				return Math.max((value), 0).toFixed(2);
			},
			totalShow() {
				return this.total.toFixed(2)
			},
			real(){
				return this.form.amount - this.serviceCharge;
			}
		},

		methods: {
			change(){

			},
			openWithdrawHistory() {
				this.navigateTo('./WithdrawHistory')
			},
			setTotal() {
				this.form.withdrawValue = this.total;
			},
			confirm() {
				this.navigateTo('./WithdrawConfirm', {
					amount: this.form.withdrawValue,
					toAddress: this.form.toAddress,
				})
			},
			//发送验证码
			sendVerifyCode () {
				if(this.btn_show_type==1) return;
				uni.showLoading({ title: '请求发送中' });
				this.$api.sendMsg(this.selfPhone).then(result => {
					this.btn_show_type = 1;
					uni.hideLoading();
					this.startCountDown();
				}).catch(error => {
					uni.hideLoading();
					if(error.code!='1005'){
						this.showToast(error ? error.message || error : '请检查网络是否连接');
					}
				})
			},
			startCountDown () {
				this.countDown = COUNT_DOWN_S - 1;
				this.countDownIntervalId = setInterval(() => {
					this.countDown -= 1;
					if (this.countDown === 0) {
						clearInterval(this.countDownIntervalId);
						this.btn_show_type = 2;
					}
				}, 1000)
			},
			//全部转出
			allchange(){
				this.form.amount = this.total;
			},
			//计算手续费
			servicecharge(){
				if(!this.form.toAddress){
					return;
				}
				this.$api.servicecharge(this.form.toAddress).then((res)=>{
					this.innerAddress = res.innerAddress;
					this.serviceCharge = res.serviceCharge;
					console.info(res)
				})
			},
			newWithdraw(){
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				uni.showLoading();
				this.$api.newWithdraw(this.form).then((res)=>{
					uni.hideLoading();
					let url = '';
					console.info(res)
					if(this.innerAddress){
						url = './TransferSuccess';
					}else {
						url = './WithdrawSuccess';
					}
					 this.redirectTo(url);
					 this.preventStatus=false;
// 					uni.redirectTo({
// 						url: url
// 					});
				}).catch(error => {
					this.preventStatus=false;
					uni.hideLoading();
					if(error.code!='1005'){
					this.showToast(error ? error.message || error : '请检查网络是否连接');
					}
				})
			}
		},

	}
</script>

<style>
	.container {
		margin: 0 30upx;
	}

	.item_text {
		font-size: 30upx;
		color: #222222;
		float: left;
	}

	.form_item {
		width: 690upx;
		height: 120upx;
		border-bottom: 2upx solid #EBEBEB;
		display: block;
	}

	.address_text {
		line-height: 120upx;
	}

	.address_input {
		float: right;
		height: 30upx;
		padding: 15upx 0;
		margin-top: 24upx;
		text-align: right;
	}
	.right_input input {
		text-align: right;
		font-size: 30upx;
	}

	.placeholderClass {
		font-size: 30upx;
		color: #999999;
	}

	.bta_text {
		font-size: 30upx;
		color: #999999;
		float: right;
		line-height: 120upx;
		margin-left: 48upx;
		text-align: right;
	}

	.form_item1 {
		width: 690upx;
		height: 160upx;
		display: block;
	}

	.all_text {
		float: right;
		color: #C9A675;
		font-size: 30upx;
		line-height: 160upx;
	}

	.all_input {
		float: left;
		width: 400upx;
		height: 30upx;
		padding: 15upx 0;
		margin-top: 40upx;
	}

	.blank {
		width: 100%;
		color: #C9A675;
		font-size: 28upx;
		line-height: 73upx;
		height: 73upx;
		text-align: center;
		background: rgba(215, 171, 108, 0.2);
	}

	.blank2 {
		color: #C9A675;
		font-size: 22upx;
		height: 68upx;
		background: #F5F5F5;
		line-height: 68upx;
	}
	.now_login {
		margin-top: 45upx;
		width: 610upx;
		height: 110upx;
		font-size: 36upx;
		color: rgba(111, 79, 43, 1);
		line-height: 110upx;
		border-radius: 55upx;
	}
	.need_know{
		margin-top: 60upx;
		padding: 0 36upx;
		font-size: 28upx;
	}
	.need_know_item1{
		color: #F93336;
		display: flex;flex-direction: row;align-items: center;
	}
	.need_know_item1 image{
		width: 28upx;
		height: 28upx;
		margin: 0 14upx 0 0;
		padding: 0;
	}
	.need_know_item2{
		color: #999999;
		margin-top: 36upx;
	}
	.need_know_item3{
		margin-top: 36upx;
		color: #999999;
		padding-bottom: 50upx;
	}
	.textLeft{
		text-align: left!important;
	}
	
</style>
