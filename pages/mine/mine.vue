<template>
	<view class="page">

		<!-- 用户面板 -->
		<view class="user-pane">
			<!-- 背景图 -->
			<image class="user-pane-bg" src="../../static/mine/mine_top_bg.png"></image>
			<!-- 主要信息 -->
			<view class="user-main">
				<view class="avatar-container" @click="openUserProfileEdit">
					<image class="avatar" mode="aspectFill" :src="user.headImg"></image>
					<image v-if="isAssistNode" class="user_verify" src="../../static/mine/verify_assist_node.png"></image>
					<image v-else-if="isCoreNode" class="user_verify" src="../../static/mine/verify_core_node.png"></image>
					<image v-else-if="isSuperCodeNode" class="user_verify" src="../../static/mine/verify_super_core_node.png"></image>
				</view>
				<view class="user-info">
					<view class="username">{{ user.nickName }}</view>
					<view class="inviteCode" >
						<text v-if="(user.fullInviteNickName)&&(user.nodeType==0 || user.nodeType==1)">从属节点：{{ user.fullInviteNickName }}</text>
					</view>
				</view>
				<!-- 右侧 粉丝/邀请 人数 -->
				<!-- 普通/辅助 节点显示邀请人数 -->
				<view class="fans-info" @click="openFansList('invite')" v-if="isNormalUser || isAssistNode">
					<view>{{ fansCount }}</view>
					<view>已邀请</view>
				</view>
				<!-- 普通/辅助 节点显示邀请人数 -->
				<view class="fans-info" @click="openFansList" v-else>
					<view>{{ fansCount }}</view>
					<view>成员</view>
				</view>
			</view>
			<!-- 辅助信息 -->
			<view class="user-secondary">
				<view class="certification-container">
					<view class="certification" v-if="certificationInfo" @click="navigateTo('./InterestStatement')">CHAIN认证：{{ certificationInfo }}</view>
					<view v-else-if="hasVerify" class="has-verify">身份已认证</view>
				</view>
				<image class="qrcode" src="../../static/mine/qrcode.png" @click="openInviteCode"></image>
			</view>
		</view>

		<!-- 我的钱包 -->
		<view class="wallet-option"  @click="openMyWallet">
			<image class="bg" src="../../static/mine/wallet_option_bg.png"></image>
			<view class="text">我的钱包</view>
			<view class="button">查看详情</view>
		</view>

		<!-- 我的 - 选项列表 -->
		<view class="option-list">
			<view class="option-item" @click="openInvitedToBuild" v-if="isAssistNode">
				<image src="../../static/mine/icon_yq2x.png"></image>
				<text>邀请建矿用户</text>
			</view>
			<view class="option-item" @click="openSetAssistNode" v-if="isSuperCodeNode || isCoreNode">
				<image src="../../static/mine/icon_set_assist_node.png"></image>
				<text>设置辅助节点</text>
			</view>
			<view class="option-item" @click="openVerifyCenter" v-else>
				<image src="../../static/mine/icon_verify.png"></image>
				<text>认证中心</text>
				<view class="secondary-info verify-info" :class="{ 'red-point': !isSubmitAuthInfo }" v-show="isLoadAuthInfo">
					{{ authStatusText }}
				</view>
			</view>
			<view class="option-item" @click="openSecurityCenter">
				<image src="../../static/mine/icon_safety.png"></image>
				<text>安全中心</text>
			</view>
			<view class="option-item" @click="openSetting">
				<image src="../../static/mine/icon_setting.png"></image>
				<text>系统设置</text>
			</view>
		</view>

		<view class="tabbar-shadow"></view>
	</view>
</template>

<script>

	import store from '@/js/store';
	import utils from '@/js/utils';

	export default {
		data() {
			return {
				user: {},
				authInfo: {},
				isLoadAuthInfo: false,

				fansCount: 0,
			}
		},

		computed: {
			isNormalUser () { return this.user.nodeType === 0 },
			isAssistNode () { return this.user.nodeType === 1 },
			isCoreNode () { return this.user.nodeType === 2 },
			isSuperCodeNode () { return this.user.nodeType === 3 },

			certificationInfo () {
				if (this.isSuperCodeNode) return '超级节点';
				if (this.isCoreNode) return '核心节点';
				if (this.isAssistNode) return '辅助节点';
				return '';
			},

			isSubmitAuthInfo () {
				return !!this.authInfo.id;
			},
			authStatusText () {
				if (!this.isSubmitAuthInfo) return '去认证';
				if (this.authInfo.isPass === 0) return '审核中';
				if (this.authInfo.isPass === 2) return '未通过';
				return '';
			},
			hasVerify () {
				if (!this.isSubmitAuthInfo) return false;
				return this.authInfo.isPass === 1
			}
		},

		onLoad() {
			// 去除临时标志
			uni.removeStorageSync('reload')
		},

		onShow () {
			this.$api.getUserInfo().then(result => {
				this.user = result;
				store.updateUser(result);
			})
			//获取粉丝数量
            this.$api.countFans().then(result => {
                this.fansCount = this.countFormat(result||0);
            })

			this.$api.getUserAuthStatus().then(result => {
				this.authInfo = result.data || {};
				console.info(result)
				this.isLoadAuthInfo = true;
			})
		},

		methods: {
			openInviteCode () {
				this.navigateTo('./InviteCode', {
					code: this.user.inviteCode
				});
			},
			openFansList (type) {
				this.navigateTo('./FansList', { type:type,currentIsAssistNode:this.isAssistNode});
			},
			openSetAssistNode () {
				this.navigateTo('./SetAssistNode');
			},
			openInvitedToBuild () {
				//邀请个人建矿
				this.navigateTo('./buildList');
			},
			openSecurityCenter () {
				this.navigateTo('./SecurityCenter');
			},
			openUserProfileEdit () {
				this.navigateTo('./UserProfileEdit');
			},
			openSetting () {
				this.navigateTo('./setting/Setting');
			},
			openVerifyCenter () {
				// 如果没有提交过信息，则跳过
				if (!this.isSubmitAuthInfo) {
					this.navigateTo('./verify/VerifyCenter');
					return
				}

				switch (this.authInfo.isPass) {
					case 0: // 待审核
						this.navigateTo('./verify/VerifyStatus', { type: 1, ...this.authInfo })
						break;
					case 1: // 通过
						this.navigateTo('./verify/VerifyStatus', { type: 0, ...this.authInfo })
						break;
					case 2: // 不通过
						this.navigateTo('./verify/VerifyStatus', { type: 2 ,...this.authInfo})
						break;
				}
			},
			openMyWallet () {
				this.navigateTo('./money/MyWallet');
			},
			countFormat (count) {
				return utils.addChineseUnit(count)
			},

			copyInviteCode () {
				uni.setClipboardData({
					data: this.user.inviteCode,
					success: () => {
						this.showToast('复制成功')
					}
				});
			}

		}
	}
</script>

<style scoped lang="less">

	.page {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 40upx;
	}

	.user-pane {
		position: relative;
		position: relative;

		.user-main {
		
			color: #ffffff;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 110upx 27upx 0;
			margin-bottom: 68upx;
			z-index: 2;
			.avatar-container {
				margin-right: 38upx;
				height:100upx;
				position: relative;
				z-index: 2;
				.avatar {
					width:100upx;
					height:100upx;
					border-radius:50%;
				}
				.user_verify {
					position: absolute;
					width:35upx;
					height:35upx;
					right: 0;
					bottom:0;
				}
			}
			.user-info {
				flex: 1;
				z-index: 2;

				.username {
					font-size:38upx;
					font-weight:bold;
					color:rgba(255,255,255,1);
					padding-left: 14upx;
					
				}
				.inviteCode {
					position: relative;
					/*width: 231upx;*/
					height: 44upx;
					padding-left: 14upx;
					text {
						font-size:20upx;
						color:rgba(255,255,255,1);
						line-height:44upx;
						display: block;
					}

					.bg {
						position: absolute;
						z-index: 1;
						top: 0;
						left: 0;
						width: 231upx;
						height: 44upx;
					}
				}
			}
			.fans-info {
				font-size:24upx;
				color:rgba(255,255,255,1);
				text-align: center;
				z-index: 2;

				view:first-child {
					margin-bottom: 15upx;
					line-height: 24upx;
				}
			}
		}

		.user-secondary {
			width: 100%;
			height: 42upx;
			box-sizing: border-box;
			padding-left: 31upx;
			padding-right: 37upx;
			margin-bottom: 64upx;
			position: relative;

			.certification-container {
				flex: 1;
				display: block;
				z-index: 2;
				position: absolute;
				left: 30upx;
				top: 50%;
				transform: translateY(-50%);
				height:40upx;
				line-height:40upx;
			}
			.certification {
				display: inline-block;
				font-size: 24upx;
				color: #C9A675;
				z-index: 2;
				height:40upx;
				line-height:40upx;
				border:2upx solid #C9A675;
				border-radius:40upx;
				padding: 0 18upx;
				transform: translateY(-2upx);
				opacity: 0.8;
			}
			.has-verify {
				display: inline-block;
				font-size:24upx;
				color:rgba(255,255,255,1);
				opacity:0.5;
				height:40upx;
				line-height:40upx;
				transform: translateY(-2upx);
			}

			.qrcode {
				width: 35upx;
				height: 35upx;
				z-index: 2;

				position: absolute;
				right: 37upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.user-pane-bg {
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			height: 441upx;
			z-index: 1;
		}
	}

	.wallet-option {
		width: 690upx;
		height: 181upx;
		position: relative;
		display: flex;
		align-items: center;
		margin: 0 auto 40upx;

		.bg {
			width: 690upx;
			height: 181upx;
			position: absolute;
			z-index: 1;
		}

		.text {
			font-size:40upx;
			color:rgba(34,34,34,1);
			line-height:60upx;
			padding-left: 46upx;
			flex: 1;
			z-index: 2;
		}
		.button {
			width: 121upx;
			height: 56upx;
			background:linear-gradient(126deg,rgba(215,171,108,1),rgba(239,201,146,1));
			box-shadow:0 3upx 7upx 0 rgba(162, 78, 127, 0.35);
			border-radius:28upx 0 0 28upx;
			padding-right: 10upx;
			font-size:20upx;
			color:rgba(111,79,43,1);
			line-height:60upx;
			text-align: right;
			z-index: 2;
		}
	}

	.option-list {
		background:rgba(255,255,255,1);
		box-shadow:0px -2upx 17upx 1upx rgba(10,24,43,0.03);
		border-radius:10upx;
		width: 690upx;
		margin: 0 auto 0upx;

		.option-item {
			display: flex;
			align-items: center;
			line-height: 146upx;
			padding: 0 40upx;
			position: relative;

			&:after {
				content: "";
				height: 1upx;
				width: calc(~"100% -"80upx);
				background-color: #F2F2F2;
				position: absolute;
				left: 40upx;
				bottom: 0;
			}

			&:active {
				background-color: #eee;
			}

			&:first-child {
				border-top-left-radius:10upx;
				border-top-right-radius:10upx;
			}

			&:last-child {
				border-bottom: none;
				border-bottom-left-radius:10upx;
				border-bottom-right-radius:10upx;
				&:after {
					display: none;
				}
			}

			image {
				width: 52upx;
				height: 52upx;
				margin-right: 45upx;
			}
			text {
				font-size:30upx;
				color:rgba(34,34,34,1);
				flex: 1;
			}

			.secondary-info {

			}

			.verify-info {
				font-size:24upx;
				color:rgba(153,153,153,1);

				&.red-point {
					&:after {
						content: "";
						display: inline-block;
						vertical-align: middle;
						margin-top: -.2em;
						width:12upx;
						height:12upx;
						background:rgba(249,51,54,1);
						border-radius:50%;
						margin-left: 15upx;
					}
				}


			}

		}
	}

</style>
