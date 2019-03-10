<template>
	<view class="page">
		<image src="../../../static/images/task/task_detail_bg.png" mode="" class="task_detail_bg"></image>
		<!-- <view class="detail_content">
				<view class="detail_title">11111</view>
				<view class="detail_gold">+222222BTA</view>
				<template v-if="type==1">
					<image src="../../../static/images/task/task_detail_img.png" mode="" class="detail_mid"></image>
				</template>
				<view class="deatil_desc">用户资产达到100BTA，即可领取该任务，且在平台倒计时100天结束时发放该奖励。（注：该任务中的100BTA定投期为100天）（注：该任务中的100BTA定投期为100天）</view>
				<template v-if="type==1">
					<view class="goCharge">去充值</view>
				</template>
				<view class="deatil_desc onlyText">
					用户资产达到100BTA，即可领取该任务，且在平台倒计时100天结束时发放该奖励。
				</view>
		</view> -->
		<!-- BTA任务 freezeDays1 -->
		
		<template  v-if='detail.taskId>=1 && detail.taskId<=3 && detail.freezeDays>0'>
			<view class="count-down">
				<view class="daojishi_text">资金定投倒计时</view>
				<view class="daojishi_item_box">
					<view class="daojishi_item" v-for="(item2,index2) in  freezeDays1" :key='index2'>{{item2}}</view>
					<view class="daojishi_line"></view>
				</view>
				<view class="daojishi_text" >天</view>
			</view>
		</template>
		<template v-if='detail.taskId>=1 && detail.taskId<=3'>
			<view class="detail_content">
				<view class="detail_title">{{detail.name}}</view>
				<view class="detail_gold">平分{{detail.amount}}BTA</view>
				<image :src="detail.img" mode="" class="detail_mid"></image>
				<view class="deatil_desc">{{detail.description}}</view>
				<template v-if="!detail.userTaskId">
					<view class="goCharge" @click="join()">
						去参与
					</view>
				</template>
				<template v-else>
					<view class="hasJoin">
						已参与
					</view>
				</template>
			</view>
		</template>
		<!-- 节点任务 -->
		<template v-if="detail.taskId>=4 && detail.taskId<=7">
			<view class="detail_content">
				<view class="detail_title">{{detail.name}}</view>
				<view class="detail_gold">+{{detail.amount}}BTA</view>
				<image :src="detail.img" mode="" class="detail_mid"></image>
				<view class="deatil_desc">{{detail.description}}</view>
				<view class="goCharge" v-if="detail.taskId==4 || detail.taskId==6" @click="goConfig()">去设置</view>
			</view>
		</template>
		<template v-if="detail.taskId>=8 && detail.taskId<=16">
			<view class="detail_content">
				<view class="detail_title">{{detail.name}}</view>
				<view class="detail_gold">+{{detail.amount}}BTA</view>
				<image :src="detail.img" mode="" class="detail_mid"></image>
				<view class="deatil_desc">{{detail.description}}</view>
			</view>
		</template>
		<template v-if="detail.taskId==17">
			<view class="detail_content">
				<view class="detail_title">{{detail.name}}</view>
				<view class="detail_gold">+{{detail.amount}}BTA</view>
				<view class="deatil_desc onlyText">
					{{detail.description}}
				</view>
			</view>
		</template>
		<template v-if="detail.taskId==19 || detail.taskId==30">
			<view class="detail_content">
				<view class="detail_title">{{detail.name}}</view>
				<template v-if="detail.taskId==19">
					<view class="detail_gold">+3BTA/位</view>
					<view class="deatil_desc">
						<text>通过邀请码注册成功，并通过身份认证后发放\n</text>
						<text>按单个自动发放，无需点击领取</text>
					</view>
					<view class="goCharge" @click="goY()">去邀请</view>
				</template>
				<template v-if="detail.taskId==30">
					<view class="detail_gold" v-if="detail.taskId==30">该节点已邀请:{{inviteNum}}/{{totalNum}}</view>
					<view class="deatil_desc">
						<text decode='true'>{{text1}}</text>
						<text style="color: #C9A675" decode='true'>「{{node_name}}」</text>
						<text decode='true'>{{text2}}</text>
					</view>
					<template v-if="!detail.deadline && !buildTaskDone">
						<view class="goCharge" style="width: 240upx;" @click="agreeBuildMine()">同意建矿邀请</view>
					</template>
					<template v-if="detail.deadline">
						<view class="goCharge hasJoin" style="width: 240upx;">已建矿</view>
					</template>
					<template v-if="buildTaskDone">
						<view class="goCharge hasJoin">已结束</view>
					</template>
				</template>

			</view>
		</template>
		<!--2019.01.16版本新增建矿  辅助节点邀请建矿用户任务后-->
		<template v-if="detail.taskId>=20 && detail.taskId<=29">
			<view class="detail_content">
				<view class="detail_title">邀请个人用户建矿</view>
				<view class="detail_gold">+{{detail.amount}}BTA</view>
				<image :src="detail.img" mode="" class="detail_mid"></image>
				<view class="deatil_desc">
					<text decode='true'>{{detail.description}}</text>
				</view>
				<view class="goCharge" @click="goBuildList()">去邀请</view>
			</view>
		</template>

		<!-- 去充值的cofirm -->
		<view class="zhezhaoceng" @click="charge_comfirm = false" v-if='charge_comfirm'></view>
		<view class="charge"  v-bind:class="[!charge_comfirm?'hide_charge_toast':'']">
			<view class="comfirm_title">提示</view>
			<view class="comfirm_content" >
				{{comfirm_msg}}
				<text v-if="comfirm_msg2">\n{{comfirm_msg2}}</text>
			</view>
			<view class="comfirm_btn" @click="comfirm_fun()">{{comfirm_btn_msg}}</view>
			<view class="que_btn" @click="que">取消</view>
			
		</view>

		<!--输入密码-->
		<password ref="psw" :source="source" @pswPass="pswPass($event)"></password>
	</view>
</template>

<script>
	import store from '../../../js/store.js';
	import NavigationBar from "../../../components/NavigationBar";
    import password from "../../../components/PayPasswordModal";
	import api from '../../../js/api/module/task.js';
	export default {
		components: {
			NavigationBar,
            password,
		},
		data() {
			return {
				type: 1,
				detail: {},
				position: '',
				charge_comfirm:false,//确认框是否显示的标志
				comfirm_msg:'',//确认框的content
				comfirm_msg2:'',//确认框换行的文字
				comfirm_btn_msg:'',//按钮的文字
				show_type:1,//1为确定参加活动弹框，2为是否去充值的弹框，3为去设置支付密码的弹框,4为确认建矿
                source:2,//2代表从何bta任务内调用password组件,3代表确定参与建矿
				totalNum:'',//总建矿数
				inviteNum:'',//	当前建矿数
				node_name:'',//节点名称
				text1:'',
				text2:'',
				buildTaskDone:false,////邀请个人建矿是否人员已满
			};
		},
		onLoad(options) {
			let detail = JSON.parse(options.detail);
			this.detail = detail;
			if(detail.taskId==30){
				this.getBuildTaskDetal(detail.taskId);
			}
			this.position = options.position;
			console.info(detail)
		},
		computed:{
			freezeDays1(){
				let arr=[];
				arr.push(parseInt((this.detail.freezeDays1 % 1000) / 100));
				arr.push(parseInt((this.detail.freezeDays1 % 100) / 10));
				arr.push(parseInt(this.detail.freezeDays1 % 10));
				return arr;
			},
		},
		methods: {
			//普通用户-获取建矿任务详情
			getBuildTaskDetal(taskId){
				this.$api.getBuildTaskDetal(taskId).then((res)=>{
					this.totalNum = res.totalNum;
					if(res.nickName.length>4){
						res.nickName = res.nickName.slice(0,2) + '*' + res.nickName.slice(res.nickName.length-2,res.nickName.length);
					}
					this.node_name = res.nickName;
					this.inviteNum = res.inviteNum;
					this.text1 = this.detail.description.slice(0,4);
					this.text2 = this.detail.description.slice(4,this.detail.description.length);
					this.text2 = this.text2.replace(/\\n/gm, '\n');
					this.buildTaskDone = res.inviteNum>=res.totalNum ? true : false;
				}).catch((res)=>{
					if (res.code !== '1005') {
						this.showToast(res.message ? res.message : '未知错误');
					}
				});
			},

			join(){
				this.comfirm_msg = '是否确认参与该活动？';
				this.comfirm_btn_msg = '确认';
				this.show_type = 1;
				this.charge_comfirm = true;
			},
			comfirm_fun(){
				this.charge_comfirm = false;
				if(this.show_type==1){
					//确定是否参加活动
					this.conformCondition(this.detail);
				}else if(this.show_type==2){
					// 余额不足时确定是否去充值
					this.goCharge();
				}else if (this.show_type==3){
				    //跳往设置支付密码页面
                    uni.navigateTo({
                        url: '/pages/mine/PayPassword'
                    })
				}else if(this.show_type==4){
					this.source = 3;
					this.$refs.psw.show();
				}
			},
			que(){
				this.charge_comfirm = false;
			},
			goCharge() {
				uni.navigateTo({
					url: '/pages/mine/money/recharge'
				})
			},
			goConfig() {
				uni.navigateTo({
					url: '/pages/mine/SetAssistNode'
				})
			},
			goY() {
				uni.navigateTo({
					url: '/pages/mine/InviteCode?code=' + store.getUser().inviteCode
				})
			},
			//跳往邀请个人建框
			goBuildList(){
				uni.navigateTo({
					url: '/pages/mine/buildList'
				})
			},
            conformCondition(item){
				uni.showLoading();
				this.$api.conformCondition(item.taskId).then((res)=>{
					uni.hideLoading();
                    this.$refs.psw.show();
				}).catch((err)=>{
					uni.hideLoading();
					if (err.code == '2012') {
							this.comfirm_msg = '您的资产余额不足';
							this.comfirm_btn_msg = '去充值';
							this.show_type = 2;
							this.charge_comfirm = true;
							// this.goDetail(item, 1);
					} else if(err.code == '2011'){
							this.detail.userTaskId = true;
							this.showToast(err.message ? err.message : '该活动已参加');
					} else if(err.code == "2100"){
							// this.showToast(err.message ? err.message : '支付密码未设置');
							this.comfirm_msg = '您还未设置支付密码，前往设置';
							this.comfirm_btn_msg = '去设置';
							this.show_type = 3;
							this.charge_comfirm = true;
					} else if (err.code !== '1005') {
               this.showToast(err.message ? err.message : '未知错误');
					}
				})
			},
			//参加BTA任务
			takePartInBtaTask($event) {
			    let data = {
			        taskId:this.detail.taskId,
					payPassword: $event
				};
				uni.showLoading();
				api.takePartInBtaTask(data).then((res) => {
					uni.hideLoading();
					this.detail.userTaskId = true;
					this.showToast('您已成功参与该活动');
				}).catch((err) => {
					uni.hideLoading();
					if (err.code !== '1005') {
						this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//检验是否满足建矿	条件
			agreeBuildMine(){
				uni.showLoading();
				this.$api.agreeBuildMine().then((res)=>{
					uni.hideLoading();
					this.comfirm_msg = '同意建矿后';
					this.comfirm_msg2 = '您的1000BTA将被锁定建矿30天';
					this.comfirm_btn_msg = '确认';
					this.show_type = 4;
					this.charge_comfirm = true;
				}).catch((err)=>{
					uni.hideLoading();
					if (err.code == '2012') {
						this.comfirm_msg = '您的资产余额不足';
						this.comfirm_btn_msg = '去充值';
						this.show_type = 2;
						this.charge_comfirm = true;
						// this.goDetail(item, 1);
					}else if(err.code == "2100"){
						// this.showToast(err.message ? err.message : '支付密码未设置');
						this.comfirm_msg = '您还未设置支付密码，前往设置';
						this.comfirm_btn_msg = '去设置';
						this.show_type = 3;
						this.charge_comfirm = true;
					}else if (err.code !== '1005') {
						this.showToast(err.message ? err.message : '未知错误');
					}
				});

			},
			//普通用户建框
			confirmBuildMine($event){
				uni.showLoading();
				this.$api.confirmBuildMine($event).then((res)=>{
					uni.hideLoading();
					//改变按钮
					this.detail.deadline = true;//改变按钮状态
					this.showToast('您已成功参与该任务');
					this.inviteNum = Number(this.inviteNum) + 1;
				}).catch((err)=>{
					uni.hideLoading();
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				})
			},
			//输入密码后点击确定后的事件
			pswPass($event){
				if(this.source==2){
					//此时为触发参加bta任务事件
					this.takePartInBtaTask($event);
				}else if (this.source==3) {
					//此时为触发弹出是否同意建矿弹框点击确定后的事件，即真正同意建矿
					this.confirmBuildMine($event);
				}
			},
		}
	}
</script>

<style>
	.hasJoin {
		width: 180upx;
		height: 64upx;
		border: 2upx solid rgba(255, 167, 26, 1);
		border-radius: 60upx;
		color: rgba(201, 166, 117, 1);
		font-size: 30upx;
		opacity: 0.25;
		margin: 20upx auto;
		text-align: center;
		line-height: 64upx;
	}

	.page {
		width: 100%;
		height: 100vh;
		overflow-x: hidden;
		position: relative;
	}

	.task_detail_bg {
		width: 100%;
		height: 100vh;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
	}
	
	.detail_content {
		width: 610upx;
		/*height: 770upx;*/
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		background: rgba(67, 67, 67, 0.25);
		padding-bottom: 40upx;
	}

	.detail_title {
		width: 100%;
		height: 130upx;
		line-height: 130upx;
		text-align: center;
		font-size: 32upx;
		color: #C9A675;
		border-bottom: 2upx solid rgba(2, 0, 0, 1);
	}

	.detail_gold {
		width: 530upx;
		margin: 0 auto;
		text-align: right;
		font-size: 28upx;
		color: rgba(201, 166, 117, 1);
		height: 83upx;
		line-height: 83upx;
	}

	.deatil_desc {
		width: 530upx;
		line-height: 54upx;
		font-size: 28upx;
		color: rgba(255, 254, 254, 01);
		text-align: justify;
		margin: 40upx auto 0;
		/* max-height: 170upx;*/
	}

	.detail_mid {
		width: 530upx;
		height: 200upx;
		display: block;
		margin: 32upx auto;
	}

	.goCharge {
		width: 180upx;
		height: 64upx;
		margin: 36upx auto 0;
		border: 2upx solid #C9A675;
		border-radius: 32upx;
		font-size: 30upx;
		text-align: center;
		line-height: 64upx;
		color: #C9A675;
	}

	.onlyText {
		margin: 145upx auto 0;
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
	.charge{
		width: 690upx;
		height: 400upx;
		position: fixed;
		z-index: 30;
		background-color: #FFFFFF;
		top: 50%;
		left: 30upx;
		transform: translateY(-50%) scale(1);
		transition: all 0.7s;
		transform-origin: 50% 0;
		opacity: 1;
		font-size: 32upx;
		border-radius: 4upx;
	}
	.hide_charge_toast {
		transform: scale(0);
		opacity: 0;
	}
	.comfirm_title{
		width: 100%;
		text-align: center;
		height: 105upx;
		line-height: 105upx;
		color: #222222;
		border-bottom: 2upx solid #F2F2F2;
	}
	.comfirm_content{
		width: 100%;
		text-align: center;
		color: #222222;
		text-align: center;
		height: 190upx;
		flex-direction: column;
		display: flex;
		justify-content:center;
		line-height: 40upx;
	}
	.que_btn{
		color: #999999;
		width: 150upx;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		float: right;
	}
	.comfirm_btn{
		color: #F93336;
		width: 150upx;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		float: right;
		margin-right: 20upx;
	}
	/* 倒计时 */
	.count-down{
		width: 610upx;
		min-height: 80upx;
		position: absolute;
		top: 7.5%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		color: #C9A675;
		text-align: right;
		font-size: 28upx;
		display: flex;flex-direction: row;align-items: center;justify-content: flex-end;
	}
	.daojishi_text {
		float: left;
		height: 30upx;
		line-height: 30upx;
		font-weight: bold;
	}
	
	.daojishi_item_box {
		width: 140upx;
		justify-content: space-between;
		display: flex;
		position: relative;
		padding: 0 10upx;
		
	}
	
	.daojishi_item {
		width: 42upx;
		height: 62upx;
		display: inline-block;
		font-size: 46upx;
		background-color: #222222;
		border-radius: 5upx;
		text-align: center;
		line-height:  62upx;
	}
	
	.daojishi_line {
		background-color: #0F0F0F;
		position: absolute;
		top: 50%;
		left: 0;
		width:160upx;
		height: 1upx;
	}
</style>
