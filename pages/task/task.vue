<template>
	<view class="page" style="min-height: 100vh;">
		<!-- <scroll-view scroll-y style="width: 100%;height: 100vh;"> -->
		<view class="top">
			<image src="../../static/images/task/top_bg.png" mode="" class="top_bg"></image>
			<view class="top_content">
				<text decode='true'>矿池余额(BTA)\n</text>
				<text decode='true' class="yue">{{ifPrivate?privateMineBalance:mineBalance}}\n</text>

				<view class="">
						<!--<text decode='true' style="margin-top: 56upx;display: block;line-height:40upx;">-->
							<!--<text decode='true' v-if="nodeType==0">用户激励矿池总量</text>-->
							<!--<text decode='true' v-if="nodeType>=1 && nodeType<=3">矿池总量</text>-->
							<!--<text decode='true' style="margin-left: 10upx;">{{mineTotal}}BTA</text>-->
						<!--</text>-->
					<text decode='true' style="margin-top: 56upx;display: block;line-height:40upx;">
					<text decode='true' v-if="!ifPrivate">用户激励矿池总量</text>
					<text decode='true' v-if="ifPrivate">矿池总量</text>
					<text decode='true' style="margin-left: 10upx;">{{ifPrivate?UserMinePoolInfo.privateMineTotal:UserMinePoolInfo.mineTotal}}BTA</text>
					</text>
				</view>
				<view class="public_and_private" v-if="UserMinePoolInfo.isPrivate==1" @click="ifPrivate=!ifPrivate">
					<text decode='true'>{{ifPrivate?"公矿池":"私矿池"}}</text>
					<image src="../../static/images/task/public_and_private.png"></image>
				</view>
			</view>
		</view>
		<!-- 每日任务 -->
		<view class="every_day">
			<view style='width: 100%;height: 60upx;margin-top: 20upx;float: left;'>
				<view class="tipIcon"></view>
				<view class="every_day_text"><text decode='true'>每日任务</text></view>
			</view>
			<view style="clear: both;"></view>
			<view class="every_day_box">
				<view class="sign" @click="showSignContent">
					<view class="signLeft">
						<view class="signTitle">每日签到</view>
						<view class="signGold">{{integralTotal}}积分</view>
					</view>
					<image src="../../static/images/task/sign.png" mode="" class="signRight"></image>
				</view>
				<view class="every_day_border"></view>
				<navigator class="pan" hover-class="none" url='/pages/task/zhuanpan/zhuanpan'>
					<view class="signLeft">
						<view class="signTitle">每日转盘</view>
						<view class="signGold">额外惊喜</view>
					</view>
					<image src="../../static/images/task/zhuan.png" mode="" class="signRight"></image>
				</navigator>
			</view>
		</view>
		<!-- bta任务 -->
		<view style='width: 100%;height: 60upx;margin-top: 25upx;float: left;' v-if="bta_tasks.length>0">
			<view class="tipIcon"></view>
			<view class="every_day_text"><text decode='true'>BTA任务</text></view>
		</view>
		<view style="clear: both;"></view>
		<view class="Bta_item" v-for="(item,index) in bta_tasks" :key='index' @click="goDetail(item,1)">
			<view class="bta_content">
				<view class="Bta_left">
					<view class="signTitle BtaTitle">{{item.name}}</view>
					<view class="signGold BtaGold">
						<text decode='true'>奖励</text>
						<text decode='true' style="margin-left: 10upx;">{{item.amount}}BTA</text>
					</view>
				</view>
				<view class="Bta_right">
					<template v-if="!item.userTaskId && item.lastDays>0">
						<view class="Bta_right_btn btn_type1">去完成</view>
					</template>
					<template v-else-if="item.userTaskId && item.lastDays>=0 && item.isDone==0">
						<view class="Bta_right_top">
							<!-- <view class="backgroundV"></view>
						<view class="topV"></view>
						<view class="numProgress">70/100</view> -->
							<view class="daojishi_text">倒计时</view>
							<view class="daojishi_item_box">
								<view class="daojishi_item" v-for="(item2,index2) in item.lastDays1" :key='index2'>{{item2}}</view>
								<!-- <view class="daojishi_item">0</view>
							<view class="daojishi_item">0</view> -->
								<view class="daojishi_line"></view>
							</view>
							<view class="daojishi_text" style="width: 16upx;">天</view>
						</view>
						<view class="Bta_right_btn btn_type_no_tap">
							<image src="../../static/images/task/can_get.png" style="width: 140upx; height:48upx;" mode=""></image>
						</view>
					</template>
					<template v-else-if="item.userTaskId && item.lastDays==0 && item.isDone==0">
						<view class="Bta_right_btn btn_type_can_tap" @click.stop="fetchBtaTaskReward(item.taskId,index)">领取奖励</view>
					</template>
					<template v-else-if="item.userTaskId && item.lastDays==0 && item.isDone==1">
						<view class="Bta_right_btn btn_type_end">已领取</view>
					</template>
					<template v-else-if="item.lastDays==0 && item.isDone==0 && !item.userTaskId">
						<view class="Bta_right_btn btn_type_end" @click.stop="showTaskEnd()">
							<image src="../../static/images/task/game_over.png" style="width: 140upx; height:48upx;" mode=""></image>
						</view>
					</template>
				</view>
			</view>
			
		</view>

		<!-- 核心节点任务 -->
		<view style='width: 100%;height: 60upx;margin-top: 20upx;float: left;' v-if="nodeTask.length>0">
			<view class="tipIcon"></view>
			<!-- <view class="every_day_text"><text decode='true'>{{(nodeType==2 || nodeType==3)?'核心节点任务':nodeType==1?'辅助节点任务':'普通用户任务'}}</text></view> -->
			<view class="every_day_text"><text decode='true'>私矿任务</text></view>
		</view>
		<view style="clear: both;"></view>
		<view class="hexinBox">
			<!-- 节点任务 -->
			<template v-if="nodeType==2 || nodeType==3">
				<view class="hexinItem" v-for='(item,index) in nodeTask' :key='index' @click="goDetail(item,2)">
					<image src="../../static/images/task/has.png" mode="" class="can_get_gold" v-if="(item.isDone==0 && item.doneNum>=item.totalNum) || item.isDone==1"></image>
					<view class="hexinItemC">
						<view class="taskName"><text decode='true'>{{item.name}}</text></view>

						<view class="taskBtn" @click.stop='btnClick(item,index)'  v-bind:class="[item.isDone==1?'has':(item.isDone==0 && !hasOpen && index>=2)?'noOpen':(item.isDone==0 && item.doneNum>=item.totalNum)?'can':'no']">
							<!-- item.isDone==0 && item.doneNum<item.totalNum && hasOpen -->
							<template v-if='item.isDone==1'>
								<text decode='true'>已领取</text>
							</template>
							<template v-else-if='item.isDone==0 && item.doneNum>=item.totalNum' >
								<text decode='true'>领取奖励</text>
							</template>
							<template v-else-if='item.isDone==0 && !hasOpen && index>=2'>
								<text decode='true'>待开放</text>
							</template>
							<template v-else>
								<text decode='true'>去完成</text>
							</template>
						</view>
						<view class="taskPro">已完成 {{item.doneNum}}/{{item.totalNum}}</view>
					</view>
				</view>
			</template>
			<!-- 辅助节点任务 -->
			<template v-if="nodeType==1">
				<view class="hexinItem" v-for='(item,index) in nodeTask' :key='index'>
					<template v-if="item.taskId!=30">
						<image src="../../static/images/task/has.png" mode="" class="can_get_gold" v-if="(item.isDone==0 && item.doneNum>=item.totalNum) || item.isDone==1"></image>
						<view class="hexinItemC"  @click="goDetail(item,2)">
							<view class="taskName">
								<text decode='true'>{{item.name}}</text>
							</view>
							<!-- 即将上线 -->
							<template v-if="item.publish==0">
								<view class="taskBtn noOpen">
									<text decode='true'>即将上线</text>
								</view>
							</template>
							<!-- 一领奖 -->
							<template v-if="item.isDone==1 && item.publish==1">
								<view class="taskBtn has">
									<text decode='true'>已领奖</text>
								</view>
							</template>
							<!-- 去完成 -->
							<template v-if="item.isDone==0 && item.publish==1 && item.doneNum<item.totalNum">
								<view class="taskBtn no">
									<text decode='true'>去完成</text>
								</view>
							</template>
							<!-- 可以领奖 -->
							<template v-if="item.isDone==0 && item.publish==1 && item.doneNum>=item.totalNum">
								<view class="taskBtn can" @click.stop="fetchUserTaskReward(index)">
									<text decode='true'>领取奖励</text>
								</view>
							</template>
						
							<view class="taskPro">已完成 {{item.doneNum}}/{{item.totalNum}}</view>
						</view>
					</template>
					<!--历史建矿邀请任务-->
					<template v-if="item.taskId==30">
					<!--<image src="../../static/images/task/has.png" mode="" class="can_get_gold" v-if="isCheck==1"></image>-->
					<view class="hexinItemC">
					  <view class="taskName"><text decode='true'>{{item.name}}</text></view>
					  <template v-if='!item.deadline && !buildTaskDone && item.isDone==0'>
						<view class="taskBtn no" @click.stop="goDetail(item,3)">
						  <text decode='true'>去完成</text>
						</view>
					  </template>
					
						<template v-else-if='item.deadline  && item.isDone==0 && item.countdownShow == 0'>
							<view class="taskBtn can" @click.stop="receiveBuildMineAward(index)">
							<text decode='true'>领取奖励</text>
							</view>
						</template>
					  
					  <template v-else-if='item.isDone==1'>
						<view class="taskBtn has" >
						  <text decode='true'>已领取</text>
						</view>
					  </template>
					
					  <template v-else-if="!item.deadline && buildTaskDone && item.isDone==0">
						<view class="taskBtn has">
						  <text decode='true'>已结束</text>
						</view>
					  </template>
					  <template v-else-if="item.deadline  && item.isDone==0 && item.countdownShow != 0">
						<view class="taskBtn has" style="width: 180upx;font-size: 30upx;">
						  <text decode='true' style="color: #8C5E10;opacity: 0.5;">倒计时{{item.countdownShow}}天</text>
						</view>
					  </template>
					  <view class="taskPro">已完成 {{!item.deadline && !buildTaskDone && item.isDone==0?0:1}}/1</view>
					</view>
					</template>
				</view>
			</template>
			<!-- 普通用户节点 -->
			<template v-if="nodeType==0">
				<view class="hexinItem" v-if='nodeTask.length>0' v-for="(item,index) in nodeTask" :key="index">
					<!--个人认证任务-->
					<template v-if="item.taskId==18">
						<image src="../../static/images/task/has.png" mode="" class="can_get_gold" v-if="isCheck==1"></image>
						<view class="hexinItemC">
							<view class="taskName"><text decode='true'>{{item.name}}</text></view>
							<template v-if='isCheck==0'>
								<view class="taskBtn no" @click.stop="goCheck()">
									<text decode='true'>去认证</text>
								</view>
							</template>
							<template v-if="isCheck==1 && item.isDone==1">
								<view class="taskBtn has">
									<text decode='true'>已认证</text>
								</view>
							</template>
							<template v-if="isCheck==1 && item.isDone==0">
								<view class="taskBtn can" @click="userAuthenticateReward(index)">
									<text decode='true'>领取奖励</text>
								</view>
							</template>
							<view class="taskPro">已完成 {{isCheck?1:0}}/1</view>
						</view>
					</template>
					<!--拉新任务-->
					<template v-if="item.taskId==19">
						<view class="hexinItemC">
						<view class="taskName"><text decode='true'>{{item.name}}</text></view>
						<view class="taskBtn no" @click.stop="goDetail(item,3)">
							<text decode='true'>去拉新</text>
						</view>
						<view class="taskPro">无上限</view>
						</view>
					</template>
					<!--建矿邀请任务-->
					<template v-if="item.taskId==30">
					<!--<image src="../../static/images/task/has.png" mode="" class="can_get_gold" v-if="isCheck==1"></image>-->
					<view class="hexinItemC">
					  <view class="taskName"><text decode='true'>{{item.name}}</text></view>
					  <template v-if='!item.deadline && !buildTaskDone && item.isDone==0'>
						<view class="taskBtn no" @click.stop="goDetail(item,3)">
						  <text decode='true'>去完成</text>
						</view>
					  </template>

						<template v-else-if='item.deadline  && item.isDone==0 && item.countdownShow == 0'>
							<view class="taskBtn can" @click.stop="receiveBuildMineAward(index)">
							<text decode='true'>领取奖励</text>
							</view>
						</template>
					  
					  <template v-else-if='item.isDone==1'>
						<view class="taskBtn has">
						  <text decode='true'>已领取</text>
						</view>
					  </template>

					  <template v-else-if="!item.deadline && buildTaskDone && item.isDone==0">
						<view class="taskBtn has">
						  <text decode='true'>已结束</text>
						</view>
					  </template>
					  <template v-else-if="item.deadline  && item.isDone==0 && item.countdownShow != 0">
						<view class="taskBtn has" style="width: 180upx;font-size: 30upx;">
						  <text decode='true' style="color: #8C5E10;opacity: 0.5;">倒计时{{item.countdownShow}}天</text>
						</view>
					  </template>
					  <view class="taskPro">已完成 {{!item.deadline && !buildTaskDone && item.isDone==0?0:1}}/1</view>
					</view>
				  </template>
				</view>
				<!--<view class="hexinItem">-->
					<!--<view class="hexinItemC">-->
						<!--<view class="taskName"><text decode='true'>邀请新用户</text></view>-->
						<!--<view class="taskBtn no" @click.stop="goDetail({taskId:19},3)">-->
							<!--<text decode='true'>去拉新</text>-->
						<!--</view>-->
						<!--<view class="taskPro">无上限</view>-->
					<!--</view>-->
				<!--</view>-->
			</template>

			<!-- <view class="hexinItem">
			<image src="../../static/images/task/no_open.png" mode="" class="no_open"></image>
			<view class="can_get_gold">敬请期待!</view>
		</view> -->
		</view>
		<view style="height: 30upx;clear: both;"></view>
		<!-- </scroll-view> -->
		<view class="tabbar-shadow"></view>
		<!-- 签到弹窗组件 -->
		<signing ref="signing" :showSign='showSign' @changeShowSign='changeShowSign' @changeIntegralTotal='changeIntegralTotal'></signing>
		<!-- 积分奖励 -->
		<!-- <template > -->
		<view class="zhezhaoceng" @click="hideBtaToast" v-if='taskSuccessToast'></view>
		<view class="prize_toast" v-bind:class="[!taskSuccessToast?'hide_prize_toast':'']">
			<image src="../../static/images/task/close_icon.png" mode="" class="close_icon" @click="hideBtaToast"></image>
			<view class="bta_prize">{{current_task_bta}}BTA</view>
			<view class="prize_desc2">恭喜你获得{{current_task_bta}}BTA</view>
			<view class="hasGived">系统已自动将以上BTA下发至您的账户</view>
		</view>
		<!-- </template> -->
	</view>
</template>

<script>
	import api from '../../js/api/module/task.js';
	import signing from './signing.vue';
	import store from '../../js/store.js';
	export default {
		data() {
			return {
				showSign: false,
				bta_tasks: [],
				UserMinePoolInfo:{
					privateMineBalance:0,
					mineBalance:0,
					privateMineTotal:0,
					mineTotal:0,
				},
				ifPrivate:true,//===true的时候当前显示的是私矿，==false当前显示的是公矿
				hasOpen: false, //核心节点的后续任务有没有开放
				nodeTask: [], //节点任务列表
				nodeType: '', //用户类型
				isCheck: 0, //是否认证
				taskSuccessToast: false,
				current_task_bta: '',
				integralTotal: 0, //任务页面用户签到所得积分
				buildTaskDone:false,//邀请个人建矿是否人员已满
				preventStatus:false//按钮防刷
			}
		},
		components: {
			signing,
		},
		computed:{
			privateMineBalance(){
				return this.changeNum(this.UserMinePoolInfo.privateMineBalance);
			},
			mineBalance(){
				return this.changeNum(this.UserMinePoolInfo.mineBalance);
			},
		},
		onShow() {
			let userInfo = store.getUser();
			this.nodeType = userInfo.nodeType;
			this.isCheck = userInfo.isCheck;
			this.getBtaTask();
			this.getUserMinePoolInfo();
			this.getUserTask();
		},

		mounted() {
			this.$refs.signing.getUserSignInInfo();
		},

		methods: {
			//参加BTA任务
			takePartInBtaTask(item) {
				api.takePartInBtaTask(item.taskId).then((res) => {
					this.getBtaTask();
				}).catch((err) => {
					if(err.code == 2000){
						this.goDetail(item,1);
					}
					if (err.code !== '1005') {
						this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//bta任务，点击已结束弹出
			showTaskEnd(){
				this.showToast('该任务已结束');
			},
			// 获取BTA任务
			getBtaTask() {
				api.getBtaTask().then((res) => {
					for (let k in res) {
						res[k].lastDays = '' + res[k].lastDays;
						if (res[k].lastDays.length == 2) {
							res[k].lastDays1 = '0' + res[k].lastDays;
						} else if (res[k].lastDays.length == 1) {
							res[k].lastDays1 = '00' + res[k].lastDays;
						} else {
							res[k].lastDays1 = res[k].lastDays;
						}
						
						res[k].freezeDays = '' + res[k].freezeDays;
						if (res[k].freezeDays.length == 2) {
							res[k].freezeDays1 = '0' + res[k].freezeDays;
						} else if (res[k].freezeDays.length == 1) {
							res[k].freezeDays1 = '00' + res[k].freezeDays;
						} else {
							res[k].freezeDays1 = res[k].freezeDays;
						}
					}
					// console.log(res);
					this.bta_tasks = res;
				}).catch((err) => {
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//领取BTA任务奖励
			fetchBtaTaskReward(taskId, index) {
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				api.fetchBtaTaskReward(taskId).then((res) => {
					this.taskSuccessToast = true;
					this.current_task_bta = this.bta_tasks[index].amount;
					this.getBtaTask();
					this.getUserMinePoolInfo(); //刷新矿产情况
					this.preventStatus=false;
				}).catch((err) => {
					this.preventStatus=false;
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},

			//获取用户矿产
			getUserMinePoolInfo() {
				api.getUserMinePoolInfo().then((res) => {
					if(res.isPrivate==0){
						res.privateMineBalance = res.mineBalance;
						res.privateMineTotal = res.mineTotal;
						this.ifPrivate = false;//当用户没有私矿池的时候，主动切换为公狂池
					}
					this.UserMinePoolInfo = res;
					console.log(this.ifPrivate);
					console.log(this.UserMinePoolInfo);
				}).catch((err) => {
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//获取用户任务列表
			getUserTask() {
				api.getUserTask().then((res) => {
					// console.log(res);
					for(let k in res){
						res[k].name = res[k].name.replace(/\\n/gm, '\n');
					}

					if(store.getUser().nodeType==2 || store.getUser().nodeType==3){
						// 核心节点任务
						if (res.length > 0 && res[1].doneNum >= 10) {
							// 任务是否开放
							this.hasOpen = true;
						}
					}
					//判断是否同意邀请建矿
					if(store.getUser().nodeType==0||store.getUser().nodeType==1){
						var haveBuildTask = false;
						for(let k in res){
							if(!haveBuildTask){
								haveBuildTask = res[k].taskId ==30 ? true : false;
							}
							//&& !res[k].deadline
							if(res[k].taskId == 30){
								this.getBuildTaskDetal(30);
								res[k].countdownShow = this.getCountdown(res[k].deadline);
							}
						}
						if(haveBuildTask){
							res.unshift(res.pop());
						}
					}
					this.nodeTask = res;
				}).catch((err) => {
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//将100000变成100,000
			changeNum(num) {
				var arr = Number(num).toFixed(2).split('.');
				num = arr[0];
				var num = (num || 0).toString();
				var result = '';
				while (num.length > 3) {
					result = ',' + num.slice(-3) + result;
					num = num.slice(0, num.length - 3);
				}
				if (num) {
					result = num + result;
				}
				return result + '.' + arr[1];
			},
			showSignContent() {
				this.showSign = true;
			},
			changeShowSign(value) {
				this.showSign = false;
			},
			//按钮点击
			btnClick(item,index) {
				console.log('btnClick');
				if (item.isDone == 0 && item.doneNum >= item.totalNum) {
					//领取任务奖励
					this.fetchUserTaskReward(index);
				} else {
					//去往详情页 
					this.goDetail(item,2);
				}
			},
			// 领取任务奖励
			fetchUserTaskReward(index) {
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				console.log('fetchUserTaskReward');
				api.fetchUserTaskReward(this.nodeTask[index].taskId).then((res) => {
					this.current_task_bta = store.getUser().nodeType==1 ? res.awardAmount : this.nodeTask[index].amount;
					this.taskSuccessToast = true;
					this.getUserMinePoolInfo(); //刷新矿产情况
					this.nodeTask[index].isDone = 1;
					this.getUserTask();
					this.preventStatus=false;
				}).catch((err) => {
					this.preventStatus=false;
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			// 去往详情页
			goDetail(detail, position) {
				detail = JSON.stringify(detail);
				if(position==1){
					if((detail.lastDays==0 && detail.isDone==0 && !detail.userTaskId) || (detail.userTaskId && detail.lastDays==0 && detail.isDone==1)){
						return;
					}
				}
				if(this.nodeType==1 && detail.publish==0){
					return;
				}
				uni.navigateTo({
					url: '/pages/task/task_detail/task_detail?detail=' + detail + '&position=' + position,
				})
			},
			// 去认证
			goCheck() {
				uni.navigateTo({
					url: '/pages/mine/verify/VerifyCenter'
				})
			},
			// 领取认证奖励
			userAuthenticateReward(index){
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				api.userAuthenticateReward().then((res)=>{
					this.taskSuccessToast = true;
					this.current_task_bta = this.nodeTask[index].amount;
					this.nodeTask[index].isDone = 1;
					this.preventStatus=false;
				}).catch((err) => {
					this.preventStatus=false;
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			//领取建矿奖励 
			receiveBuildMineAward(index){
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				api.receiveBuildMineAward().then((res)=>{
					this.taskSuccessToast = true;
					this.current_task_bta = this.nodeTask[index].amount;
					this.nodeTask[index].isDone = 1;
					this.preventStatus=false;
					this.getUserMinePoolInfo(); //刷新矿产情况
				}).catch((err) => {
					this.preventStatus=false;
					if (err.code !== '1005') {
							this.showToast(err.message ? err.message : '未知错误');
					}
				});
			},
			
			goY() {
				uni.navigateTo({
					url: '/pages/mine/InviteCode?code=' + store.getUser().inviteCode
				})
			},
			hideBtaToast() {
				this.taskSuccessToast = false
			},
			changeIntegralTotal(value) {
				this.integralTotal = value;
			},
			//普通用户-获取建矿任务详情
			getBuildTaskDetal(taskId){
				this.$api.getBuildTaskDetal(taskId).then((res)=>{
					this.buildTaskDone = res.inviteNum>=res.totalNum ? true : false;
				}).catch((res)=>{
					if (res.code !== '1005') {
							this.showToast(res.message ? res.message : '未知错误');
					}
				});
			},
			//获取倒计时
			getCountdown(timestamp){
				let nowTime = new Date().getTime(),countdown=0,timestamp_offset;
				timestamp_offset = timestamp - nowTime;
				if(timestamp>0&&timestamp_offset>0){
					countdown = timestamp_offset/(24*60*60*1000);
				}
				return Math.ceil(countdown);
			}
		}
	}
</script>

<style>
	@import '../../style/task.css';

	.page {
		width: 100%;
		overflow-x: hidden;
		background: #F5F5F7;
		letter-spacing: 50;
		font-family: FZLTHK--GBK1-0;
	}
</style>
